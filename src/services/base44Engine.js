import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  eventBus,
  initStorage
} from './storage';
import { ORDER_STATUS, canTransition } from './orderStateMachine';

// Ensure storage is initialized on load
initStorage();

export const base44 = {
  // Auth Module
  auth: {
    me() {
      const user = getStorageItem(STORAGE_KEYS.CURRENT_USER, null);
      return user;
    },

    updateMe(partialData) {
      const currentUser = this.me();
      if (!currentUser) throw new Error('Not authenticated');

      const users = getStorageItem(STORAGE_KEYS.USERS, []);
      const updatedUser = {
        ...currentUser,
        data: {
          ...currentUser.data,
          ...partialData
        }
      };

      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
      setStorageItem(STORAGE_KEYS.CURRENT_USER, updatedUser, 'AUTH_CHANGED');
      return updatedUser;
    },

    login(email, password = '') {
      const users = getStorageItem(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('User not found. Please register or check your email.');
      }
      setStorageItem(STORAGE_KEYS.CURRENT_USER, user, 'AUTH_CHANGED');
      return user;
    },

    switchDemoRole(appRole) {
      const users = getStorageItem(STORAGE_KEYS.USERS, []);
      const targetUser = users.find(u => u.data?.app_role === appRole);
      if (targetUser) {
        setStorageItem(STORAGE_KEYS.CURRENT_USER, targetUser, 'AUTH_CHANGED');
        return targetUser;
      }
      return null;
    },

    register({ email, password, full_name, app_role, phone, restaurant_id, vehicle }) {
      const users = getStorageItem(STORAGE_KEYS.USERS, []);
      const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw new Error('An account with this email already exists.');
      }

      const newId = `usr_${Date.now()}`;
      const newUser = {
        id: newId,
        email,
        full_name,
        role: app_role === 'admin' ? 'admin' : 'user',
        data: {
          app_role,
          phone: phone || '',
          restaurant_id: restaurant_id || null,
          vehicle: vehicle || '',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`
        }
      };

      users.push(newUser);
      setStorageItem(STORAGE_KEYS.USERS, users);
      setStorageItem(STORAGE_KEYS.CURRENT_USER, newUser, 'AUTH_CHANGED');

      // If delivery partner, run link logic
      if (app_role === 'delivery_partner' && restaurant_id) {
        base44.functions.LinkDeliveryPartner({
          user_id: newId,
          restaurant_id,
          name: full_name,
          email,
          phone,
          vehicle
        });
      }

      return newUser;
    },

    verifyOtp(otpCode) {
      // In this environment, any 6-digit code or "123456" succeeds
      if (!otpCode || otpCode.length < 4) {
        throw new Error('Please enter a valid 4 to 6-digit verification code.');
      }
      return true;
    },

    logout() {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      eventBus.publish('AUTH_CHANGED', null);
    }
  },

  // Entities with Row-Level Security (RLS)
  entities: {
    Restaurant: {
      async list(filter = {}) {
        const restaurants = getStorageItem(STORAGE_KEYS.RESTAURANTS, []);
        let result = [...restaurants];

        if (filter.enabled !== undefined) {
          result = result.filter(r => r.enabled === filter.enabled);
        }
        if (filter.owner_id) {
          result = result.filter(r => r.owner_id === filter.owner_id);
        }
        return result;
      },

      async get(id) {
        const restaurants = getStorageItem(STORAGE_KEYS.RESTAURANTS, []);
        return restaurants.find(r => r.id === id) || null;
      },

      async update(id, updates) {
        const user = base44.auth.me();
        const restaurants = getStorageItem(STORAGE_KEYS.RESTAURANTS, []);
        const target = restaurants.find(r => r.id === id);
        if (!target) throw new Error('Restaurant not found');

        // RLS check: only owner or admin can edit
        if (user?.role !== 'admin' && target.owner_id !== user?.id && user?.data?.restaurant_id !== id) {
          throw new Error('RLS Violation: You can only edit your own restaurant.');
        }

        const updated = { ...target, ...updates };
        const newRestaurants = restaurants.map(r => r.id === id ? updated : r);
        setStorageItem(STORAGE_KEYS.RESTAURANTS, newRestaurants, 'RESTAURANTS_CHANGED');
        return updated;
      },

      async create(data) {
        const user = base44.auth.me();
        const restaurants = getStorageItem(STORAGE_KEYS.RESTAURANTS, []);
        const newRestaurant = {
          id: `rest_${Date.now()}`,
          owner_id: user?.id,
          enabled: true,
          rating: 4.5,
          reviews_count: "New",
          delivery_time: "25-35 mins",
          distance: "2.5 km",
          ...data
        };
        restaurants.push(newRestaurant);
        setStorageItem(STORAGE_KEYS.RESTAURANTS, restaurants, 'RESTAURANTS_CHANGED');
        return newRestaurant;
      }
    },

    Food: {
      async list(filter = {}) {
        const foods = getStorageItem(STORAGE_KEYS.FOOD, []);
        let result = [...foods];

        if (filter.restaurant_id) {
          result = result.filter(f => f.restaurant_id === filter.restaurant_id);
        }
        if (filter.category) {
          result = result.filter(f => f.category === filter.category);
        }
        if (filter.enabled !== undefined) {
          result = result.filter(f => f.enabled === filter.enabled);
        }
        return result;
      },

      async create(data) {
        const foods = getStorageItem(STORAGE_KEYS.FOOD, []);
        const newFood = {
          id: `food_${Date.now()}`,
          enabled: true,
          rating: 4.5,
          votes: 10,
          ...data
        };
        foods.push(newFood);
        setStorageItem(STORAGE_KEYS.FOOD, foods, 'FOOD_CHANGED');
        return newFood;
      },

      async update(id, updates) {
        const foods = getStorageItem(STORAGE_KEYS.FOOD, []);
        const updated = foods.map(f => f.id === id ? { ...f, ...updates } : f);
        setStorageItem(STORAGE_KEYS.FOOD, updated, 'FOOD_CHANGED');
        return updated.find(f => f.id === id);
      },

      async delete(id) {
        const foods = getStorageItem(STORAGE_KEYS.FOOD, []);
        const filtered = foods.filter(f => f.id !== id);
        setStorageItem(STORAGE_KEYS.FOOD, filtered, 'FOOD_CHANGED');
        return true;
      }
    },

    Order: {
      async list() {
        const user = base44.auth.me();
        const allOrders = getStorageItem(STORAGE_KEYS.ORDERS, []);
        if (!user) return [];

        // Apply RLS
        if (user.role === 'admin' || user.data?.app_role === 'admin') {
          return allOrders;
        }

        if (user.data?.app_role === 'customer') {
          return allOrders.filter(o => o.customer_id === user.id);
        }

        if (user.data?.app_role === 'restaurant') {
          const restId = user.data?.restaurant_id;
          return allOrders.filter(o => o.restaurant_id === restId);
        }

        if (user.data?.app_role === 'delivery_partner') {
          // Delivery partner sees:
          // 1. Orders assigned to them
          // 2. Orders that are ready for pickup at their restaurant
          const partnerList = getStorageItem(STORAGE_KEYS.DELIVERY_PARTNERS, []);
          const myPartner = partnerList.find(dp => dp.user_id === user.id || dp.email === user.email);
          const dpId = myPartner ? myPartner.id : null;
          const restId = user.data?.restaurant_id || myPartner?.restaurant_id;

          return allOrders.filter(o => {
            const isAssignedToMe = dpId && o.delivery_partner_id === dpId;
            const isAvailableForPickup = (o.status === ORDER_STATUS.READY) && (!restId || o.restaurant_id === restId);
            return isAssignedToMe || isAvailableForPickup;
          });
        }

        return [];
      },

      async get(id) {
        const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
        const order = orders.find(o => o.id === id);
        return order || null;
      },

      async create(orderData) {
        const user = base44.auth.me();
        if (!user) throw new Error('Must be logged in to place an order');

        const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
        const newOrder = {
          id: `ord_${Date.now()}`,
          customer_id: user.id,
          customer_name: user.full_name || 'Valued Customer',
          customer_phone: user.data?.phone || '+91 98765 43210',
          status: ORDER_STATUS.PENDING,
          delivery_partner_id: null,
          created_at: new Date().toISOString(),
          status_updated_at: new Date().toISOString(),
          ...orderData
        };

        orders.unshift(newOrder);
        setStorageItem(STORAGE_KEYS.ORDERS, orders, 'ORDERS_CHANGED');
        return newOrder;
      },

      subscribe(callback) {
        return eventBus.subscribe('ORDERS_CHANGED', callback);
      }
    },

    Address: {
      async list() {
        const user = base44.auth.me();
        if (!user) return [];
        const addresses = getStorageItem(STORAGE_KEYS.ADDRESSES, []);
        if (user.role === 'admin' || user.data?.app_role === 'admin') {
          return addresses;
        }
        return addresses.filter(a => a.customer_id === user.id);
      },

      async create(data) {
        const user = base44.auth.me();
        if (!user) throw new Error('Must be logged in');

        const addresses = getStorageItem(STORAGE_KEYS.ADDRESSES, []);
        const newAddress = {
          id: `addr_${Date.now()}`,
          customer_id: user.id,
          latitude: 12.9716 + (Math.random() - 0.5) * 0.02,
          longitude: 77.6413 + (Math.random() - 0.5) * 0.02,
          ...data
        };
        addresses.push(newAddress);
        setStorageItem(STORAGE_KEYS.ADDRESSES, addresses, 'ADDRESSES_CHANGED');
        return newAddress;
      }
    },

    DeliveryPartner: {
      async list(filter = {}) {
        const partners = getStorageItem(STORAGE_KEYS.DELIVERY_PARTNERS, []);
        let result = [...partners];
        if (filter.restaurant_id) {
          result = result.filter(dp => dp.restaurant_id === filter.restaurant_id);
        }
        return result;
      },

      async get(id) {
        const partners = getStorageItem(STORAGE_KEYS.DELIVERY_PARTNERS, []);
        return partners.find(dp => dp.id === id) || null;
      },

      async updateLocation(partnerId, { latitude, longitude }) {
        const partners = getStorageItem(STORAGE_KEYS.DELIVERY_PARTNERS, []);
        const target = partners.find(dp => dp.id === partnerId);
        if (!target) return null;

        const updated = {
          ...target,
          latitude,
          longitude,
          location_updated_at: new Date().toISOString()
        };

        const newPartners = partners.map(dp => dp.id === partnerId ? updated : dp);
        setStorageItem(STORAGE_KEYS.DELIVERY_PARTNERS, newPartners, `LOCATION_UPDATED_${partnerId}`);
        eventBus.publish('DELIVERY_LOCATION_TICK', { partnerId, latitude, longitude });
        return updated;
      }
    }
  },

  // Backend Functions
  functions: {
    // 1. UpdateOrderStatus
    async UpdateOrderStatus({ order_id, next_status, delivery_partner_id = null }) {
      const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
      const order = orders.find(o => o.id === order_id);
      if (!order) throw new Error(`Order ${order_id} not found.`);

      // Validate state machine transition
      const isValid = canTransition(order.status, next_status, order.order_type);
      if (!isValid) {
        throw new Error(`Illegal state transition from "${order.status}" to "${next_status}" for ${order.order_type} order.`);
      }

      const updated = {
        ...order,
        status: next_status,
        status_updated_at: new Date().toISOString()
      };

      // Stamp delivery partner when assigned
      if (next_status === ORDER_STATUS.ASSIGNED && delivery_partner_id) {
        updated.delivery_partner_id = delivery_partner_id;
      }

      const newOrders = orders.map(o => o.id === order_id ? updated : o);
      setStorageItem(STORAGE_KEYS.ORDERS, newOrders, 'ORDERS_CHANGED');
      eventBus.publish(`ORDER_STATUS_${order_id}`, updated);
      return updated;
    },

    // 2. LinkDeliveryPartner
    async LinkDeliveryPartner({ user_id, restaurant_id, name, email, phone, vehicle }) {
      const partners = getStorageItem(STORAGE_KEYS.DELIVERY_PARTNERS, []);
      const existing = partners.find(p => p.user_id === user_id || p.email === email);

      const partnerData = {
        id: existing?.id || `dp_${Date.now()}`,
        user_id,
        restaurant_id,
        name,
        email,
        phone: phone || '',
        vehicle: vehicle || 'Two Wheeler',
        status: 'active',
        current_order_id: null,
        rating: 4.9,
        total_deliveries: existing?.total_deliveries || 0,
        latitude: 12.9345,
        longitude: 77.6265,
        location_updated_at: new Date().toISOString()
      };

      let newPartners;
      if (existing) {
        newPartners = partners.map(p => p.id === existing.id ? partnerData : p);
      } else {
        newPartners = [...partners, partnerData];
      }

      setStorageItem(STORAGE_KEYS.DELIVERY_PARTNERS, newPartners, 'DELIVERY_PARTNERS_CHANGED');
      return partnerData;
    },

    // 3. GetDeliveryLocation
    async GetDeliveryLocation({ order_id }) {
      const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
      const order = orders.find(o => o.id === order_id);
      if (!order || !order.delivery_partner_id) {
        return null;
      }

      const partners = getStorageItem(STORAGE_KEYS.DELIVERY_PARTNERS, []);
      const partner = partners.find(p => p.id === order.delivery_partner_id);
      if (!partner) return null;

      // Privacy check: only return GPS if order is assigned, picked_up, or out_for_delivery
      const trackingStatuses = [ORDER_STATUS.ASSIGNED, ORDER_STATUS.PICKED_UP, ORDER_STATUS.OUT_FOR_DELIVERY];
      if (!trackingStatuses.includes(order.status)) {
        return null;
      }

      return {
        latitude: partner.latitude,
        longitude: partner.longitude,
        location_updated_at: partner.location_updated_at,
        partner_name: partner.name,
        partner_phone: partner.phone,
        partner_vehicle: partner.vehicle,
        partner_rating: partner.rating
      };
    }
  }
};

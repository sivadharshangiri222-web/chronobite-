import {
  INITIAL_USERS,
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_ITEMS,
  INITIAL_ADDRESSES,
  INITIAL_DELIVERY_PARTNERS,
  INITIAL_ORDERS
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'chronobite_users',
  CURRENT_USER: 'chronobite_current_user',
  RESTAURANTS: 'chronobite_restaurants',
  FOOD: 'chronobite_food',
  ADDRESSES: 'chronobite_addresses',
  DELIVERY_PARTNERS: 'chronobite_delivery_partners',
  ORDERS: 'chronobite_orders',
  GPS_COORDS: 'chronobite_gps_coords'
};

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  publish(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
    // Also trigger generic storage event for cross-component sync
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb({ event, data }));
    }
  }
}

export const eventBus = new EventBus();

export const initStorage = (forceReset = false) => {
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0])); // Default customer
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(INITIAL_RESTAURANTS));
    localStorage.setItem(STORAGE_KEYS.FOOD, JSON.stringify(INITIAL_FOOD_ITEMS));
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(INITIAL_ADDRESSES));
    localStorage.setItem(STORAGE_KEYS.DELIVERY_PARTNERS, JSON.stringify(INITIAL_DELIVERY_PARTNERS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    eventBus.publish('DATA_RESET', {});
    return true;
  }
  return false;
};

// Generic storage accessors
export const getStorageItem = (key, defaultVal = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultVal;
  }
};

export const setStorageItem = (key, value, triggerEvent = null) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (triggerEvent) {
      eventBus.publish(triggerEvent, value);
    }
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

export { STORAGE_KEYS };

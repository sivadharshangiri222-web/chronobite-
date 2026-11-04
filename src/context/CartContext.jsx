import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'chronobite_active_cart';

export function CartProvider({ children }) {
  const [cartState, setCartState] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        restaurantId: null,
        restaurantName: null,
        restaurantAddress: null,
        restaurantLat: null,
        restaurantLng: null,
        orderType: 'delivery',
        items: [],
        tip: 20,
        coupon: null,
        instructions: ''
      };
    } catch {
      return {
        restaurantId: null,
        restaurantName: null,
        restaurantAddress: null,
        restaurantLat: null,
        restaurantLng: null,
        orderType: 'delivery',
        items: [],
        tip: 20,
        coupon: null,
        instructions: ''
      };
    }
  });

  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    pendingFood: null,
    pendingRestaurant: null
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cartState]);

  const addItem = (food, restaurant) => {
    // If cart already has items from another restaurant
    if (cartState.items.length > 0 && cartState.restaurantId && cartState.restaurantId !== restaurant.id) {
      setConflictModal({
        isOpen: true,
        pendingFood: food,
        pendingRestaurant: restaurant
      });
      return;
    }

    setCartState(prev => {
      const existing = prev.items.find(i => i.food_id === food.id);
      let updatedItems;

      if (existing) {
        updatedItems = prev.items.map(i =>
          i.food_id === food.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [
          ...prev.items,
          {
            food_id: food.id,
            name: food.name,
            price: food.price,
            quantity: 1,
            is_veg: food.is_veg,
            image_url: food.image_url,
            restaurant_id: restaurant.id
          }
        ];
      }

      return {
        ...prev,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantAddress: restaurant.address,
        restaurantLat: restaurant.latitude,
        restaurantLng: restaurant.longitude,
        items: updatedItems
      };
    });
  };

  const updateQuantity = (foodId, delta) => {
    setCartState(prev => {
      const existing = prev.items.find(i => i.food_id === foodId);
      if (!existing) return prev;

      const newQty = existing.quantity + delta;
      let newItems;

      if (newQty <= 0) {
        newItems = prev.items.filter(i => i.food_id !== foodId);
      } else {
        newItems = prev.items.map(i =>
          i.food_id === foodId ? { ...i, quantity: newQty } : i
        );
      }

      if (newItems.length === 0) {
        return {
          ...prev,
          restaurantId: null,
          restaurantName: null,
          restaurantAddress: null,
          items: [],
          coupon: null
        };
      }

      return { ...prev, items: newItems };
    });
  };

  const removeItem = (foodId) => {
    updateQuantity(foodId, -9999);
  };

  const clearCart = () => {
    setCartState({
      restaurantId: null,
      restaurantName: null,
      restaurantAddress: null,
      restaurantLat: null,
      restaurantLng: null,
      orderType: 'delivery',
      items: [],
      tip: 20,
      coupon: null,
      instructions: ''
    });
    setConflictModal({ isOpen: false, pendingFood: null, pendingRestaurant: null });
  };

  const resolveConflictReplace = () => {
    if (conflictModal.pendingFood && conflictModal.pendingRestaurant) {
      const food = conflictModal.pendingFood;
      const restaurant = conflictModal.pendingRestaurant;
      setCartState({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantAddress: restaurant.address,
        restaurantLat: restaurant.latitude,
        restaurantLng: restaurant.longitude,
        orderType: 'delivery',
        tip: 20,
        coupon: null,
        instructions: '',
        items: [
          {
            food_id: food.id,
            name: food.name,
            price: food.price,
            quantity: 1,
            is_veg: food.is_veg,
            image_url: food.image_url,
            restaurant_id: restaurant.id
          }
        ]
      });
    }
    setConflictModal({ isOpen: false, pendingFood: null, pendingRestaurant: null });
  };

  const resolveConflictCancel = () => {
    setConflictModal({ isOpen: false, pendingFood: null, pendingRestaurant: null });
  };

  const setOrderType = (type) => {
    setCartState(prev => ({ ...prev, orderType: type }));
  };

  const setTip = (amount) => {
    setCartState(prev => ({ ...prev, tip: amount }));
  };

  const setInstructions = (text) => {
    setCartState(prev => ({ ...prev, instructions: text }));
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SWIGGY50' || clean === 'CHRONO50') {
      setCartState(prev => ({ ...prev, coupon: { code: clean, discountPercent: 50, maxDiscount: 120 } }));
      return { success: true, message: '50% discount applied up to ₹120!' };
    } else if (clean === 'FLAT100') {
      setCartState(prev => ({ ...prev, coupon: { code: clean, flatDiscount: 100, minOrder: 399 } }));
      return { success: true, message: 'Flat ₹100 discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try SWIGGY50 or FLAT100' };
    }
  };

  const removeCoupon = () => {
    setCartState(prev => ({ ...prev, coupon: null }));
  };

  // Calculations
  const totalItemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemTotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Delivery fee waived for pickup or orders above ₹500
  const deliveryFee = cartState.orderType === 'pickup' ? 0 : (itemTotal >= 500 ? 0 : 35);
  const platformFee = 5;
  const taxes = Math.round(itemTotal * 0.05); // 5% GST

  let discountAmount = 0;
  if (cartState.coupon) {
    if (cartState.coupon.discountPercent) {
      discountAmount = Math.min(Math.round((itemTotal * cartState.coupon.discountPercent) / 100), cartState.coupon.maxDiscount);
    } else if (cartState.coupon.flatDiscount) {
      discountAmount = itemTotal >= (cartState.coupon.minOrder || 0) ? cartState.coupon.flatDiscount : 0;
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee + taxes + (cartState.orderType === 'delivery' ? cartState.tip : 0) - discountAmount);

  return (
    <CartContext.Provider
      value={{
        ...cartState,
        totalItemCount,
        itemTotal,
        deliveryFee,
        platformFee,
        taxes,
        discountAmount,
        grandTotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOrderType,
        setTip,
        setInstructions,
        applyCoupon,
        removeCoupon,
        conflictModal,
        resolveConflictReplace,
        resolveConflictCancel
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

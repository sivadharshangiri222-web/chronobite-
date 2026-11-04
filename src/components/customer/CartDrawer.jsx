import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import VegBadge from '../common/VegBadge';
import { X, Plus, Minus, ArrowRight, ShoppingBag, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  const {
    items,
    restaurantName,
    restaurantAddress,
    totalItemCount,
    itemTotal,
    deliveryFee,
    platformFee,
    taxes,
    discountAmount,
    grandTotal,
    updateQuantity,
    clearCart,
    orderType,
    setOrderType
  } = useCart();

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/app/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-swiggy-surface border-l border-white/10 shadow-2xl flex flex-col justify-between animate-slide-up">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Your Cart</h3>
                <p className="text-xs text-muted-foreground">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-rose-400 px-2 py-1 rounded transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {items.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground mb-4">
                  <UtensilsCrossed className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="font-bold text-white text-lg">Your cart is empty</h4>
                <p className="text-xs text-muted-foreground max-w-xs mt-1">
                  Explore mouth-watering biryanis, pizzas, and burger deals to satisfy your cravings!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary-hover transition-all"
                >
                  Browse Top Restaurants
                </button>
              </div>
            ) : (
              <>
                {/* Restaurant Scoped Header */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Ordering from:</p>
                  <h4 className="font-bold text-white text-sm mt-0.5">{restaurantName}</h4>
                  <p className="text-[11px] text-muted-foreground truncate">{restaurantAddress}</p>
                </div>

                {/* Delivery vs Pickup Selector */}
                <div className="grid grid-cols-2 gap-2 bg-swiggy-darker p-1 rounded-xl border border-white/5 text-xs font-bold">
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 rounded-lg transition-all ${
                      orderType === 'delivery'
                        ? 'bg-primary text-white shadow-glow'
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    🛵 Home Delivery
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 rounded-lg transition-all ${
                      orderType === 'pickup'
                        ? 'bg-primary text-white shadow-glow'
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    🛍️ Self Pickup
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {items.map(item => (
                    <div
                      key={item.food_id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <VegBadge isVeg={item.is_veg} />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">₹{item.price}</p>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-swiggy-darker border border-white/10 rounded-lg overflow-hidden shrink-0">
                        <button
                          onClick={() => updateQuantity(item.food_id, -1)}
                          className="px-2 py-1 text-muted-foreground hover:text-white hover:bg-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.food_id, 1)}
                          className="px-2 py-1 text-muted-foreground hover:text-white hover:bg-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-white text-right w-14 shrink-0">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2 pt-3 border-t border-white/5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="text-white font-medium">₹{itemTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-400 font-medium' : 'text-white font-medium'}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="text-white font-medium">₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST and Restaurant Charges (5%)</span>
                    <span className="text-white font-medium">₹{taxes}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-extrabold text-white">
                    <span>To Pay</span>
                    <span className="text-primary text-base">₹{grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-white/5 bg-swiggy-darker">
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm shadow-glow flex items-center justify-between transition-all duration-200 active:scale-98"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-white/80 uppercase font-semibold">Total Payable</span>
                  <span className="text-base font-black">₹{grandTotal}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

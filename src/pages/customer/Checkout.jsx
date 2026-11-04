import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { base44 } from '../../services/base44Engine';
import VegBadge from '../../components/common/VegBadge';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Plus,
  ArrowLeft,
  CheckCircle,
  Tag,
  ShieldCheck,
  Bike,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function Checkout() {
  const {
    items,
    restaurantId,
    restaurantName,
    restaurantAddress,
    restaurantLat,
    restaurantLng,
    orderType,
    setOrderType,
    itemTotal,
    deliveryFee,
    platformFee,
    taxes,
    discountAmount,
    grandTotal,
    tip,
    setTip,
    coupon,
    applyCoupon,
    removeCoupon,
    clearCart,
    instructions,
    setInstructions
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState({ enabled: true });

  // New Address Form State
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPhone, setNewPhone] = useState(user?.data?.phone || '');

  useEffect(() => {
    async function loadInitial() {
      if (restaurantId) {
        const rest = await base44.entities.Restaurant.get(restaurantId);
        if (rest) setRestaurantStatus(rest);
      }
      const addrList = await base44.entities.Address.list();
      setAddresses(addrList);
      if (addrList.length > 0) {
        setSelectedAddressId(addrList[0].id);
      }
    }
    loadInitial();
  }, [restaurantId]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    setCouponFeedback(res);
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    try {
      const created = await base44.entities.Address.create({
        label: newLabel,
        full_address: newAddressText,
        city: 'Bangalore',
        landmark: newLandmark,
        phone: newPhone
      });
      setAddresses(prev => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowNewAddressModal(false);
      setNewAddressText('');
      setNewLandmark('');
    } catch (err) {
      console.error('Failed to create address', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!restaurantStatus.enabled) {
      alert('This restaurant is currently closed. Cannot place order.');
      return;
    }

    if (items.length === 0) return;

    const chosenAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0] || {
      full_address: '12th Main Road, Indiranagar, Bangalore',
      latitude: 12.9716,
      longitude: 77.6413
    };

    setIsPlacingOrder(true);

    try {
      const newOrder = await base44.entities.Order.create({
        restaurant_id: restaurantId,
        restaurant_name: restaurantName,
        order_type: orderType,
        total_amount: grandTotal,
        address_id: selectedAddressId || 'addr_default',
        delivery_address: orderType === 'delivery' ? chosenAddress.full_address : 'Self Pickup at Restaurant',
        customer_lat: chosenAddress.latitude || 12.9716,
        customer_lng: chosenAddress.longitude || 77.6413,
        restaurant_lat: restaurantLat || 12.9345,
        restaurant_lng: restaurantLng || 77.6265,
        notes: instructions,
        items: items.map(i => ({
          food_id: i.food_id,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        }))
      });

      // Joyful celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      clearCart();
      setTimeout(() => {
        navigate(`/app/orders/${newOrder.id}`);
      }, 700);
    } catch (err) {
      console.error('Order creation failed', err);
      alert('Failed to place order: ' + err.message);
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Please select some mouth-watering dishes before proceeding to checkout.
        </p>
        <Link to="/app" className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          to={`/app/restaurant/${restaurantId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {restaurantName}</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fulfillment, Address & Cooking Instructions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Type Toggle */}
          <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Choose Order Type</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  orderType === 'delivery'
                    ? 'bg-primary/15 border-primary text-white shadow-glow'
                    : 'bg-swiggy-surface border-white/5 text-muted-foreground hover:text-white'
                }`}
              >
                <Bike className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Doorstep Delivery</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Instant GPS live tracked delivery</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  orderType === 'pickup'
                    ? 'bg-primary/15 border-primary text-white shadow-glow'
                    : 'bg-swiggy-surface border-white/5 text-muted-foreground hover:text-white'
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Self Pickup</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Collect order directly from kitchen</p>
                </div>
              </button>
            </div>
          </div>

          {/* Delivery Address Section (if Delivery) */}
          {orderType === 'delivery' && (
            <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Delivery Address</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewAddressModal(true)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Addresses List */}
              <div className="space-y-3">
                {addresses.map(addr => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-primary/10 border-primary shadow-glow'
                          : 'bg-swiggy-surface border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-xs uppercase tracking-wider">{addr.label}</h4>
                            {addr.is_default && (
                              <span className="text-[10px] bg-white/10 text-muted-foreground px-1.5 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {addr.full_address}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Phone: {addr.phone}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                  );
                })}

                {addresses.length === 0 && (
                  <p className="text-xs text-muted-foreground py-2">
                    No saved addresses found. Please click "Add New" above.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cooking & Delivery Instructions */}
          <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-2">
              Cooking / Delivery Notes
            </h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please make biryani less spicy, don't ring the doorbell, leave near door..."
              rows={3}
              className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Delivery Partner Tip */}
          {orderType === 'delivery' && (
            <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-sm">
              <h3 className="text-sm font-bold text-white mb-1">
                Say thanks with a Tip to your Delivery Hero
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                100% of your tip goes directly to the delivery partner.
              </p>

              <div className="flex items-center gap-2.5">
                {[0, 20, 30, 50].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTip(amt)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      tip === amt
                        ? 'bg-primary text-white border-primary shadow-glow'
                        : 'bg-swiggy-surface text-muted-foreground border-white/10 hover:text-white'
                    }`}
                  >
                    {amt === 0 ? 'No Tip' : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Bill */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-card sticky top-20">
            <div className="border-b border-white/5 pb-4 mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Order From</span>
              <h3 className="font-extrabold text-white text-base mt-0.5">{restaurantName}</h3>
              <p className="text-xs text-muted-foreground truncate">{restaurantAddress}</p>
            </div>

            {/* Items review */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map(i => (
                <div key={i.food_id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate flex-1 pr-2">
                    <VegBadge isVeg={i.is_veg} />
                    <span className="text-white font-medium truncate">{i.name}</span>
                    <span className="text-muted-foreground">× {i.quantity}</span>
                  </div>
                  <span className="text-white font-bold shrink-0">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="pt-4 mt-4 border-t border-white/5">
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-emerald-400">{coupon.code}</span>
                      <p className="text-[10px] text-emerald-300">Saved ₹{discountAmount}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-400 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Try SWIGGY50 or FLAT100"
                      className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-muted-foreground uppercase focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-swiggy-surface border border-white/10 hover:border-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p className={`text-[11px] mt-1.5 font-medium ${couponFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Bill Details */}
            <div className="pt-4 mt-4 border-t border-white/5 space-y-2 text-xs text-muted-foreground">
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
                <span>GST & Restaurant Taxes</span>
                <span className="text-white font-medium">₹{taxes}</span>
              </div>
              {orderType === 'delivery' && tip > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Partner Tip</span>
                  <span className="text-white font-medium">₹{tip}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between text-base font-black text-white">
                <span>To Pay</span>
                <span className="text-primary text-lg">₹{grandTotal}</span>
              </div>
            </div>

            {/* Closed warning if disabled */}
            {!restaurantStatus.enabled && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Restaurant is temporarily closed.</span>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !restaurantStatus.enabled}
              className="mt-6 w-full py-4 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider shadow-glow transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order • ₹{grandTotal}</span>
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ChronoBite Assured Lightning Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      {showNewAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-swiggy-surface border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg text-white mb-4">Add Delivery Address</h3>

            <form onSubmit={handleCreateAddress} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Home', 'Work', 'Other'].map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        newLabel === lbl
                          ? 'bg-primary text-white border-primary'
                          : 'bg-swiggy-darker text-muted-foreground border-white/5 hover:text-white'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Complete Address *</label>
                <textarea
                  required
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  placeholder="Flat/House No., Building, Street, Area"
                  rows={3}
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="e.g. Near Toit / Behind Metro"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAddressModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-white rounded-xl border border-white/10 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-xl shadow-glow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

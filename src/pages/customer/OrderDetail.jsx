import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '../../services/base44Engine';
import { eventBus } from '../../services/storage';
import { ORDER_STATUS, STATUS_LABELS } from '../../services/orderStateMachine';
import StatusBadge from '../../components/common/StatusBadge';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import {
  ArrowLeft,
  Clock,
  Phone,
  MessageSquare,
  Bike,
  CheckCircle,
  MapPin,
  Receipt,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partnerGps, setPartnerGps] = useState(null);
  const [actionError, setActionError] = useState(null);

  const loadOrder = async () => {
    try {
      const data = await base44.entities.Order.get(orderId);
      setOrder(data);
      if (data && data.delivery_partner_id) {
        const gps = await base44.functions.GetDeliveryLocation({ order_id: orderId });
        setPartnerGps(gps);
      }
    } catch (err) {
      console.error('Error loading order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();

    // Listen for order updates
    const unsubOrder = eventBus.subscribe(`ORDER_STATUS_${orderId}`, (updated) => {
      setOrder(updated);
    });
    const unsubOrders = base44.entities.Order.subscribe(() => {
      loadOrder();
    });

    // Listen for live GPS ticks
    const unsubGps = eventBus.subscribe('DELIVERY_LOCATION_TICK', async () => {
      const gps = await base44.functions.GetDeliveryLocation({ order_id: orderId });
      setPartnerGps(gps);
    });

    return () => {
      unsubOrder();
      unsubOrders();
      unsubGps();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <Link to="/app/orders" className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold">
          View All Orders
        </Link>
      </div>
    );
  }

  // Stepper Sequence
  const deliverySteps = [
    { key: ORDER_STATUS.PENDING, label: 'Order Placed' },
    { key: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
    { key: ORDER_STATUS.PREPARING, label: 'Preparing' },
    { key: ORDER_STATUS.READY, label: 'Food Ready' },
    { key: ORDER_STATUS.ASSIGNED, label: 'Rider Assigned' },
    { key: ORDER_STATUS.PICKED_UP, label: 'Picked Up' },
    { key: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
    { key: ORDER_STATUS.DELIVERED, label: 'Delivered' }
  ];

  const pickupSteps = [
    { key: ORDER_STATUS.PENDING, label: 'Order Placed' },
    { key: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
    { key: ORDER_STATUS.PREPARING, label: 'Preparing' },
    { key: ORDER_STATUS.READY, label: 'Food Ready' },
    { key: ORDER_STATUS.READY_FOR_PICKUP, label: 'Ready for Pickup' },
    { key: ORDER_STATUS.COMPLETED, label: 'Completed' }
  ];

  const steps = order.order_type === 'pickup' ? pickupSteps : deliverySteps;
  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  // Quick State Advance Simulation Helper (uses exact UpdateOrderStatus backend function)
  const getNextStatus = () => {
    if (currentStepIndex >= 0 && currentStepIndex < steps.length - 1) {
      return steps[currentStepIndex + 1].key;
    }
    return null;
  };

  const handleSimulateNextStep = async () => {
    setActionError(null);
    const next = getNextStatus();
    if (!next) return;

    try {
      await base44.functions.UpdateOrderStatus({
        order_id: order.id,
        next_status: next,
        delivery_partner_id: next === ORDER_STATUS.ASSIGNED ? 'dp_1' : undefined
      });
      await loadOrder();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const isTerminal = ['delivered', 'completed', 'rejected', 'cancelled'].includes(order.status);
  const showLiveMap = order.order_type === 'delivery' && ['assigned', 'picked_up', 'out_for_delivery'].includes(order.status);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          to="/app/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all orders</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* Header Hero */}
        <div className="bg-card rounded-2xl p-6 border border-white/10 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold text-muted-foreground">ID: #{order.id}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">{order.order_type}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {order.restaurant_name}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} size="md" />
            </div>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-4">
              Live Order Progress
            </h3>

            {/* Stepper Bar */}
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-white/10 -translate-y-1/2 z-0 hidden sm:block">
                <div
                  className="h-full bg-primary transition-all duration-500 shadow-glow"
                  style={{
                    width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%`
                  }}
                />
              </div>

              {/* Step Dots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
                {steps.map((s, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <div key={s.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isDone
                            ? 'bg-primary text-white shadow-glow'
                            : isCurrent
                            ? 'bg-primary text-white border-4 border-white/20 animate-pulse shadow-glow'
                            : 'bg-swiggy-surface text-muted-foreground border border-white/10'
                        }`}
                      >
                        {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-semibold mt-2 ${
                          isCurrent ? 'text-primary font-bold' : isDone ? 'text-white' : 'text-muted-foreground'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Simulator Action Helper */}
          {!isTerminal && getNextStatus() && (
            <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs text-white">
                  <strong>Workflow Simulator:</strong> Advance order to next state: <span className="font-mono text-primary font-bold">"{STATUS_LABELS[getNextStatus()]?.label}"</span>
                </span>
              </div>
              <button
                onClick={handleSimulateNextStep}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Advance State</span>
              </button>
            </div>
          )}

          {actionError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {actionError}
            </div>
          )}
        </div>

        {/* Live Delivery GPS Map Section */}
        {showLiveMap && (
          <div className="bg-card rounded-2xl p-5 border border-white/10 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-white text-base">Live Delivery Route & GPS</h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Estimated Arrival: 15-20 Mins
              </span>
            </div>

            <LiveTrackingMap
              riderLat={partnerGps?.latitude || 12.9520}
              riderLng={partnerGps?.longitude || 77.6320}
              restaurantLat={order.restaurant_lat || 12.9345}
              restaurantLng={order.restaurant_lng || 77.6265}
              customerLat={order.customer_lat || 12.9716}
              customerLng={order.customer_lng || 77.6413}
              restaurantName={order.restaurant_name}
              customerName={order.customer_name}
            />

            {/* Delivery Partner Profile Card */}
            {partnerGps && (
              <div className="p-4 rounded-xl bg-swiggy-surface border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
                    <Bike className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{partnerGps.partner_name || 'Vikram Singh'}</span>
                      <span className="text-[11px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                        ★ {partnerGps.partner_rating || '4.9'}
                      </span>
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {partnerGps.partner_vehicle || 'Honda Activa 6G (KA 03 EN 4492)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={`tel:${partnerGps.partner_phone || '+919123456789'}`}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Rider</span>
                  </a>
                  <button
                    onClick={() => alert(`Messaging partner: ${partnerGps.partner_name}`)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Details & Bill Breakdown */}
        <div className="bg-card rounded-2xl p-6 border border-white/10 shadow-card space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-white/5 pb-3">
            <Receipt className="w-4 h-4 text-primary" />
            <span>Order Summary & Receipt</span>
          </h3>

          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-white font-medium">
                  {item.quantity} × {item.name}
                </span>
                <span className="text-white font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Delivery Address</span>
              <span className="text-white font-medium max-w-xs text-right truncate">
                {order.delivery_address}
              </span>
            </div>

            {order.notes && (
              <div className="flex justify-between">
                <span>Cooking Notes</span>
                <span className="text-white font-medium italic max-w-xs text-right">
                  "{order.notes}"
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex justify-between text-base font-black text-white">
              <span>Grand Total</span>
              <span className="text-primary text-lg">₹{order.total_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

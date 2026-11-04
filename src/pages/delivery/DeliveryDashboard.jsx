import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { base44 } from '../../services/base44Engine';
import { ORDER_STATUS } from '../../services/orderStateMachine';
import { gpsSimulator } from '../../services/deliverySimulator';
import StatusBadge from '../../components/common/StatusBadge';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import {
  Bike,
  Navigation,
  MapPin,
  Phone,
  CheckCircle,
  Package,
  Clock,
  Sparkles,
  Play,
  Square,
  AlertCircle
} from 'lucide-react';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [partner, setPartner] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // active | available | history
  const [isSimulatingGps, setIsSimulatingGps] = useState(false);
  const [gpsProgress, setGpsProgress] = useState(0);
  const [currentCoords, setCurrentCoords] = useState(null);

  const loadData = async () => {
    const partners = await base44.entities.DeliveryPartner.list();
    const myPartner = partners.find(p => p.user_id === user?.id || p.email === user?.email) || partners[0];
    setPartner(myPartner);

    const allOrders = await base44.entities.Order.list();
    setOrders(allOrders);

    if (myPartner) {
      setCurrentCoords({ lat: myPartner.latitude, lng: myPartner.longitude });
    }
  };

  useEffect(() => {
    loadData();
    const unsub = base44.entities.Order.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, [user]);

  // Partner ID
  const partnerId = partner?.id || 'dp_1';

  // Available orders for claiming: status is ready & not yet assigned
  const availableOrders = orders.filter(o => o.status === ORDER_STATUS.READY && !o.delivery_partner_id);

  // Active assigned order for this partner
  const activeOrder = orders.find(o =>
    o.delivery_partner_id === partnerId &&
    [ORDER_STATUS.ASSIGNED, ORDER_STATUS.PICKED_UP, ORDER_STATUS.OUT_FOR_DELIVERY].includes(o.status)
  );

  // Completed history
  const historyOrders = orders.filter(o =>
    o.delivery_partner_id === partnerId &&
    [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED].includes(o.status)
  );

  const handleAcceptOrder = async (orderId) => {
    try {
      await base44.functions.UpdateOrderStatus({
        order_id: orderId,
        next_status: ORDER_STATUS.ASSIGNED,
        delivery_partner_id: partnerId
      });
      setActiveTab('active');
      await loadData();
    } catch (err) {
      alert('Failed to accept: ' + err.message);
    }
  };

  const handleAdvanceStatus = async (nextStatus) => {
    if (!activeOrder) return;
    try {
      await base44.functions.UpdateOrderStatus({
        order_id: activeOrder.id,
        next_status: nextStatus
      });

      // If out for delivery, automatically start GPS simulation towards customer!
      if (nextStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
        startGpsSim();
      }

      if (nextStatus === ORDER_STATUS.DELIVERED) {
        stopGpsSim();
      }

      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const startGpsSim = () => {
    if (!activeOrder) return;
    setIsSimulatingGps(true);
    gpsSimulator.startSimulation(
      partnerId,
      activeOrder.restaurant_lat || 12.9345,
      activeOrder.restaurant_lng || 77.6265,
      activeOrder.customer_lat || 12.9716,
      activeOrder.customer_lng || 77.6413,
      ({ latitude, longitude, progress }) => {
        setCurrentCoords({ lat: latitude, lng: longitude });
        setGpsProgress(Math.round(progress));
      }
    );
  };

  const stopGpsSim = () => {
    setIsSimulatingGps(false);
    gpsSimulator.stopSimulation(partnerId);
  };

  const totalEarnings = historyOrders.length * 60 + 50; // Base delivery pay + tips

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Rider Header Bar */}
      <div className="bg-card border-b border-white/5 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-glow">
              <Bike className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  Delivery Partner Hero
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active on Duty
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1">
                {partner?.name || 'Vikram Singh'}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vehicle: {partner?.vehicle || 'Honda Activa 6G (KA 03 EN 4492)'} • Rating: ★ {partner?.rating || '4.9'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-swiggy-surface p-3 rounded-2xl border border-white/5">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Deliveries</span>
              <p className="text-lg font-black text-white">{historyOrders.length + 342}</p>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Today's Earnings</span>
              <p className="text-lg font-black text-emerald-400">₹{totalEarnings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex border-b border-white/10 pb-3 gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-primary text-white shadow-glow'
                : 'bg-swiggy-surface text-muted-foreground hover:text-white'
            }`}
          >
            Active Delivery {activeOrder ? '(1)' : '(0)'}
          </button>

          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'available'
                ? 'bg-amber-500 text-black shadow-glow font-extrabold'
                : 'bg-swiggy-surface text-muted-foreground hover:text-white'
            }`}
          >
            Available Orders Pool ({availableOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-white shadow-glow-green'
                : 'bg-swiggy-surface text-muted-foreground hover:text-white'
            }`}
          >
            Completed Runs ({historyOrders.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Active Order Tab */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {!activeOrder ? (
              <div className="py-20 text-center bg-card rounded-2xl border border-white/5 p-8">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground mx-auto mb-4">
                  <Package className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-lg font-bold text-white">No active delivery in progress</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Switch to the "Available Orders Pool" tab to accept an incoming food delivery run.
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow"
                >
                  View Available Orders ({availableOrders.length})
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Order Detail Card */}
                <div className="bg-card rounded-2xl p-6 border border-primary/30 shadow-card">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground font-bold">#{activeOrder.id}</span>
                        <StatusBadge status={activeOrder.status} />
                      </div>
                      <h3 className="text-xl font-black text-white">{activeOrder.restaurant_name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">To: {activeOrder.customer_name} • {activeOrder.customer_phone}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${activeOrder.customer_phone}`}
                        className="px-4 py-2 rounded-xl bg-swiggy-surface border border-white/10 hover:border-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Customer</span>
                      </a>
                    </div>
                  </div>

                  {/* Pickup & Drop Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                    <div className="p-3.5 rounded-xl bg-swiggy-surface border border-white/5">
                      <span className="text-[10px] font-bold uppercase text-blue-400">1. Pickup Kitchen</span>
                      <p className="font-bold text-xs text-white mt-1">{activeOrder.restaurant_name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">100ft Road, Koramangala 4th Block</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-swiggy-surface border border-white/5">
                      <span className="text-[10px] font-bold uppercase text-emerald-400">2. Customer Doorstep</span>
                      <p className="font-bold text-xs text-white mt-1">{activeOrder.customer_name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{activeOrder.delivery_address}</p>
                    </div>
                  </div>

                  {/* State Machine Action Progression */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                      Delivery Workflow Actions:
                    </h4>

                    {activeOrder.status === ORDER_STATUS.ASSIGNED && (
                      <button
                        onClick={() => handleAdvanceStatus(ORDER_STATUS.PICKED_UP)}
                        className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-glow flex items-center justify-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        <span>Step 1: Confirm Order Picked Up from Kitchen</span>
                      </button>
                    )}

                    {activeOrder.status === ORDER_STATUS.PICKED_UP && (
                      <button
                        onClick={() => handleAdvanceStatus(ORDER_STATUS.OUT_FOR_DELIVERY)}
                        className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider shadow-glow flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Step 2: Start Ride (Out for Delivery)</span>
                      </button>
                    )}

                    {activeOrder.status === ORDER_STATUS.OUT_FOR_DELIVERY && (
                      <button
                        onClick={() => handleAdvanceStatus(ORDER_STATUS.DELIVERED)}
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-glow-green flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Step 3: Mark Delivered to Customer Doorstep</span>
                      </button>
                    )}
                  </div>

                  {/* GPS Broadcast Simulation Controller */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSimulatingGps ? 'bg-emerald-400' : 'bg-muted-foreground'} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSimulatingGps ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                      </span>
                      <span className="text-xs text-white">
                        Live GPS Broadcast: <strong>{isSimulatingGps ? `Active (${gpsProgress}% route completed)` : 'Paused'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isSimulatingGps ? (
                        <button
                          onClick={startGpsSim}
                          className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Start GPS Simulator</span>
                        </button>
                      ) : (
                        <button
                          onClick={stopGpsSim}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Pause GPS</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map View */}
                <div className="bg-card rounded-2xl p-5 border border-white/10 shadow-card">
                  <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <span>Real-time GPS Live Map</span>
                  </h4>
                  <LiveTrackingMap
                    riderLat={currentCoords?.lat || 12.9520}
                    riderLng={currentCoords?.lng || 77.6320}
                    restaurantLat={activeOrder.restaurant_lat || 12.9345}
                    restaurantLng={activeOrder.restaurant_lng || 77.6265}
                    customerLat={activeOrder.customer_lat || 12.9716}
                    customerLng={activeOrder.customer_lng || 77.6413}
                    restaurantName={activeOrder.restaurant_name}
                    customerName={activeOrder.customer_name}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Available Orders Pool Tab */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Orders Ready at Kitchens for Pickup</span>
            </h3>

            {availableOrders.length === 0 ? (
              <div className="py-16 text-center bg-card rounded-2xl border border-white/5 p-8">
                <p className="text-sm text-muted-foreground">
                  No orders currently waiting for delivery partner assignment.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Place an order as Customer, then confirm & mark ready as Restaurant to see it appear here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableOrders.map(order => (
                  <div key={order.id} className="bg-card rounded-2xl p-5 border border-amber-500/20 shadow-card flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-muted-foreground font-bold">#{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>

                      <h4 className="font-bold text-base text-white">{order.restaurant_name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Deliver to: <strong className="text-white">{order.customer_name}</strong> ({order.delivery_address})</p>

                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Payout: <strong className="text-emerald-400">₹60.00</strong></span>
                        <span className="text-muted-foreground">{order.items?.length} items</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-glow transition-all"
                    >
                      Accept Delivery
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-swiggy-surface border-b border-white/5 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Restaurant</th>
                  <th className="p-3.5">Destination</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Earning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {historyOrders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-mono text-muted-foreground">#{order.id}</td>
                    <td className="p-3.5 font-bold">{order.restaurant_name}</td>
                    <td className="p-3.5 text-muted-foreground truncate max-w-xs">{order.delivery_address}</td>
                    <td className="p-3.5">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="p-3.5 text-right font-black text-emerald-400">₹60.00</td>
                  </tr>
                ))}
                {historyOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No delivery runs completed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

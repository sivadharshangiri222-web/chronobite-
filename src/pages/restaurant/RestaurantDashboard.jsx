import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { base44 } from '../../services/base44Engine';
import { ORDER_STATUS } from '../../services/orderStateMachine';
import StatusBadge from '../../components/common/StatusBadge';
import VegBadge from '../../components/common/VegBadge';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle,
  Play,
  XCircle,
  PackageCheck,
  AlertCircle,
  Flame,
  TrendingUp,
  Receipt,
  RotateCw
} from 'lucide-react';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // incoming | active | completed

  const restaurantId = user?.data?.restaurant_id || 'rest_1';

  const loadData = async () => {
    try {
      const rest = await base44.entities.Restaurant.get(restaurantId);
      setRestaurant(rest);
      const orderList = await base44.entities.Order.list();
      setOrders(orderList);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = base44.entities.Order.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, [restaurantId]);

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      await base44.functions.UpdateOrderStatus({
        order_id: orderId,
        next_status: nextStatus
      });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const incomingOrders = orders.filter(o => o.status === ORDER_STATUS.PENDING);
  const inKitchenOrders = orders.filter(o => [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING].includes(o.status));
  const readyOrders = orders.filter(o => [ORDER_STATUS.READY, ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.ASSIGNED, ORDER_STATUS.PICKED_UP, ORDER_STATUS.OUT_FOR_DELIVERY].includes(o.status));
  const completedOrders = orders.filter(o => [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED, ORDER_STATUS.REJECTED, ORDER_STATUS.CANCELLED].includes(o.status));

  const totalRevenue = orders
    .filter(o => [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED].includes(o.status))
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Banner */}
      <div className="bg-card border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Kitchen Partner Portal
              </span>
              {restaurant?.enabled ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Kitchen Open & Accepting Orders
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-400">
                  🔴 Kitchen Offline
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              {restaurant?.name || 'Spice Garden Kitchen'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live orders pipeline & kitchen order tickets (KOT)
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-swiggy-surface p-3 rounded-2xl border border-white/5">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Active Orders</span>
              <p className="text-lg font-black text-white">{incomingOrders.length + inKitchenOrders.length + readyOrders.length}</p>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Fulfilled Revenue</span>
              <p className="text-lg font-black text-primary">₹{totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'incoming'
                  ? 'bg-amber-500 text-black shadow-glow font-extrabold'
                  : 'bg-swiggy-surface text-muted-foreground hover:text-white'
              }`}
            >
              New Orders ({incomingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-primary text-white shadow-glow'
                  : 'bg-swiggy-surface text-muted-foreground hover:text-white'
              }`}
            >
              In Kitchen & Ready ({inKitchenOrders.length + readyOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'completed'
                  ? 'bg-emerald-500 text-white shadow-glow-green'
                  : 'bg-swiggy-surface text-muted-foreground hover:text-white'
              }`}
            >
              Completed / History ({completedOrders.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/restaurant/menu"
              className="px-3 py-1.5 rounded-xl bg-swiggy-surface hover:bg-white/5 border border-white/10 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
              <span>Menu Editor</span>
            </Link>
            <Link
              to="/restaurant/partners"
              className="px-3 py-1.5 rounded-xl bg-swiggy-surface hover:bg-white/5 border border-white/10 text-xs font-bold text-white transition-colors"
            >
              Delivery Fleet
            </Link>
            <Link
              to="/restaurant/profile"
              className="px-3 py-1.5 rounded-xl bg-swiggy-surface hover:bg-white/5 border border-white/10 text-xs font-bold text-white transition-colors"
            >
              Profile & Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-48 bg-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            {activeTab === 'incoming' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Incoming Orders Awaiting Confirmation</span>
                </h3>

                {incomingOrders.length === 0 ? (
                  <div className="py-16 text-center bg-card rounded-2xl border border-white/5 p-8">
                    <p className="text-sm text-muted-foreground">No new incoming orders right now.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {incomingOrders.map(order => (
                      <div key={order.id} className="bg-card rounded-2xl p-5 border border-amber-500/30 shadow-card flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs text-muted-foreground font-bold">#{order.id}</span>
                            <span className="text-[11px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {order.order_type}
                            </span>
                          </div>

                          <h4 className="font-bold text-base text-white">{order.customer_name}</h4>
                          <p className="text-xs text-muted-foreground">{order.customer_phone}</p>

                          {/* Items List */}
                          <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs text-white">
                                <span>{item.quantity} × {item.name}</span>
                                <span className="font-medium text-muted-foreground">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {order.notes && (
                            <p className="mt-3 p-2 rounded-lg bg-swiggy-surface text-[11px] text-amber-300 italic border border-white/5">
                              Note: "{order.notes}"
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-5 pt-3 border-t border-white/5 flex gap-2">
                          <button
                            onClick={() => handleStatusChange(order.id, ORDER_STATUS.REJECTED)}
                            className="flex-1 py-2 rounded-xl bg-swiggy-surface hover:bg-rose-500/20 text-rose-400 border border-white/10 text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, ORDER_STATUS.CONFIRMED)}
                            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-glow transition-all"
                          >
                            Accept Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'active' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...inKitchenOrders, ...readyOrders].map(order => (
                    <div key={order.id} className="bg-card rounded-2xl p-5 border border-white/10 shadow-card flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs text-muted-foreground font-bold">#{order.id}</span>
                          <StatusBadge status={order.status} />
                        </div>

                        <h4 className="font-bold text-base text-white">{order.customer_name}</h4>
                        <span className="text-[11px] text-muted-foreground block">{order.delivery_address}</span>

                        <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-white">
                              <span>{item.quantity} × {item.name}</span>
                              <span className="font-medium text-muted-foreground">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <p className="mt-2 text-[11px] text-amber-300 italic">
                            Note: "{order.notes}"
                          </p>
                        )}
                      </div>

                      {/* State Advancers according to State Machine */}
                      <div className="mt-5 pt-3 border-t border-white/5 space-y-2">
                        {order.status === ORDER_STATUS.CONFIRMED && (
                          <button
                            onClick={() => handleStatusChange(order.id, ORDER_STATUS.PREPARING)}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-glow flex items-center justify-center gap-1.5"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Start Preparing (In Kitchen)</span>
                          </button>
                        )}

                        {order.status === ORDER_STATUS.PREPARING && (
                          <button
                            onClick={() => handleStatusChange(
                              order.id,
                              order.order_type === 'pickup' ? ORDER_STATUS.READY_FOR_PICKUP : ORDER_STATUS.READY
                            )}
                            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black shadow-glow flex items-center justify-center gap-1.5"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Mark Food Ready & Packed</span>
                          </button>
                        )}

                        {order.status === ORDER_STATUS.READY_FOR_PICKUP && (
                          <button
                            onClick={() => handleStatusChange(order.id, ORDER_STATUS.COMPLETED)}
                            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-glow-green flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Handed Over (Completed)</span>
                          </button>
                        )}

                        {order.status === ORDER_STATUS.READY && (
                          <div className="p-2.5 rounded-xl bg-swiggy-surface border border-white/5 text-center text-xs text-muted-foreground">
                            Waiting for Delivery Partner to accept & assign...
                          </div>
                        )}

                        {['assigned', 'picked_up', 'out_for_delivery'].includes(order.status) && (
                          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-center text-xs text-primary font-bold">
                            Delivery Hero is fulfilling this order
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {inKitchenOrders.length + readyOrders.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-white/5 p-8">
                      <p className="text-sm text-muted-foreground">No active orders in preparation right now.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-swiggy-surface border-b border-white/5 text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white">
                    {completedOrders.map(order => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono text-muted-foreground">#{order.id}</td>
                        <td className="p-3.5 font-bold">{order.customer_name}</td>
                        <td className="p-3.5 text-muted-foreground">
                          {order.items?.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                        </td>
                        <td className="p-3.5">
                          <StatusBadge status={order.status} size="sm" />
                        </td>
                        <td className="p-3.5 text-right font-black text-primary">₹{order.total_amount}</td>
                      </tr>
                    ))}
                    {completedOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No completed orders yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

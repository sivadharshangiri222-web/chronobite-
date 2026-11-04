import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '../../services/base44Engine';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Clock,
  ArrowRight,
  Receipt,
  UtensilsCrossed,
  MapPin,
  Bike,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const loadOrders = async () => {
    try {
      const data = await base44.entities.Order.list();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const unsub = base44.entities.Order.subscribe(() => {
      loadOrders();
    });
    return () => unsub();
  }, []);

  const terminalStatuses = ['delivered', 'completed', 'rejected', 'cancelled'];
  const activeOrders = orders.filter(o => !terminalStatuses.includes(o.status));
  const pastOrders = orders.filter(o => terminalStatuses.includes(o.status));

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" />
              <span>Your Orders</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live updates & complete order history
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="p-2 rounded-xl bg-swiggy-surface border border-white/5 text-muted-foreground hover:text-white transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === 'active'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <span>Live & Active ({activeOrders.length})</span>
            {activeTab === 'active' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-glow" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === 'past'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <span>Order History ({pastOrders.length})</span>
            {activeTab === 'past' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-glow" />
            )}
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-32 bg-card rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-card rounded-2xl border border-white/5 p-8">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground mb-4">
              <UtensilsCrossed className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {activeTab === 'active' ? 'No active orders right now' : 'No past orders yet'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Hungry? Order your favorite delicacies from top-rated kitchens!
            </p>
            <Link
              to="/app"
              className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary-hover transition-all"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map(order => (
              <div
                key={order.id}
                className="bg-card rounded-2xl p-5 border border-white/5 shadow-card hover:border-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-base text-white">
                      {order.restaurant_name}
                    </h3>
                    <StatusBadge status={order.status} />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5">
                      {order.order_type}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {order.items?.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="font-bold text-white">₹{order.total_amount}</span>
                    <span>•</span>
                    <span>{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <Link
                    to={`/app/orders/${order.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-swiggy-surface border border-white/10 hover:border-primary text-xs font-bold text-white hover:text-primary transition-all active:scale-95 shadow-sm"
                  >
                    <span>{activeTab === 'active' ? 'Track Live Order' : 'View Order Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

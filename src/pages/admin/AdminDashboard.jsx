import React, { useState, useEffect } from 'react';
import { base44 } from '../../services/base44Engine';
import { STORAGE_KEYS, getStorageItem, setStorageItem, initStorage } from '../../services/storage';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Shield,
  Store,
  Receipt,
  Bike,
  Users,
  TrendingUp,
  DollarSign,
  RotateCcw,
  Search,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview | restaurants | orders | fleet
  const [loading, setLoading] = useState(true);

  // New restaurant modal
  const [showAddRest, setShowAddRest] = useState(false);
  const [restName, setRestName] = useState('');
  const [restCuisine, setRestCuisine] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restPriceLevel, setRestPriceLevel] = useState('$$');
  const [restCover, setRestCover] = useState('');

  const loadAll = async () => {
    try {
      const r = await base44.entities.Restaurant.list();
      const o = await base44.entities.Order.list();
      const p = await base44.entities.DeliveryPartner.list();
      const u = getStorageItem(STORAGE_KEYS.USERS, []);

      setRestaurants(r);
      setOrders(o);
      setPartners(p);
      setUsers(u);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const unsub = base44.entities.Order.subscribe(() => {
      loadAll();
    });
    return () => unsub();
  }, []);

  const totalGmv = orders
    .filter(o => ['delivered', 'completed'].includes(o.status))
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const handleToggleRestaurant = async (rest) => {
    await base44.entities.Restaurant.update(rest.id, { enabled: !rest.enabled });
    await loadAll();
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    if (!restName || !restCuisine) return;

    await base44.entities.Restaurant.create({
      name: restName,
      cuisine: restCuisine,
      address: restAddress || 'Indiranagar, Bangalore',
      phone: '+91 80 4455 6677',
      price_level: restPriceLevel,
      cost_for_two: '₹500 for two',
      cover_url: restCover || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      enabled: true
    });

    setRestName('');
    setRestCuisine('');
    setRestAddress('');
    setShowAddRest(false);
    await loadAll();
  };

  const handleResetData = () => {
    if (window.confirm('Reset the entire ChronoBite platform back to initial seed data?')) {
      initStorage(true);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-card border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Platform Admin Command Center
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-400" />
              <span>ChronoBite Global Oversight</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Multi-role telemetry, enterprise order tracking, and restaurant catalog governance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="px-3.5 py-2 rounded-xl bg-swiggy-surface border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Platform State</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Fulfilled GMV</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white">₹{totalGmv}</h3>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Live Platform Volume</span>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <Receipt className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-white">{orders.length}</h3>
            <span className="text-[11px] text-primary font-semibold mt-1 block">Delivery & Pickup</span>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Restaurants</span>
              <Store className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-white">{restaurants.length}</h3>
            <span className="text-[11px] text-amber-400 font-semibold mt-1 block">{restaurants.filter(r => r.enabled).length} active online</span>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-white/5 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Fleet Partners</span>
              <Bike className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-white">{partners.length}</h3>
            <span className="text-[11px] text-indigo-400 font-semibold mt-1 block">Registered Couriers</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex border-b border-white/10 pb-3 gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-glow' : 'bg-swiggy-surface text-muted-foreground'
            }`}
          >
            All Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'restaurants' ? 'bg-indigo-600 text-white shadow-glow' : 'bg-swiggy-surface text-muted-foreground'
            }`}
          >
            Restaurants Directory ({restaurants.length})
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'fleet' ? 'bg-indigo-600 text-white shadow-glow' : 'bg-swiggy-surface text-muted-foreground'
            }`}
          >
            Fleet & Users ({users.length})
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'overview' && (
          <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-swiggy-surface border-b border-white/5 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Restaurant</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-mono text-muted-foreground">#{order.id}</td>
                    <td className="p-3.5 font-bold">{order.customer_name}</td>
                    <td className="p-3.5 text-muted-foreground">{order.restaurant_name}</td>
                    <td className="p-3.5 uppercase text-[10px] font-bold text-muted-foreground">{order.order_type}</td>
                    <td className="p-3.5">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="p-3.5 text-right font-black text-primary">₹{order.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">All Platform Restaurants</h3>
              <button
                onClick={() => setShowAddRest(true)}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Restaurant</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(rest => (
                <div key={rest.id} className="bg-card rounded-2xl p-5 border border-white/5 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-base text-white">{rest.name}</span>
                      <button
                        onClick={() => handleToggleRestaurant(rest)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                          rest.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {rest.enabled ? 'Online' : 'Offline'}
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground">{rest.cuisine}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 truncate">{rest.address}</p>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Rating: ★ {rest.rating}</span>
                      <span>ETA: {rest.delivery_time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-swiggy-surface border-b border-white/5 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-bold flex items-center gap-2">
                      <img src={u.data?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} className="w-6 h-6 rounded-full object-cover" />
                      <span>{u.full_name}</span>
                    </td>
                    <td className="p-3.5 text-muted-foreground">{u.email}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-white">
                        {u.data?.app_role}
                      </span>
                    </td>
                    <td className="p-3.5 text-muted-foreground">{u.data?.phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Onboard Restaurant Modal */}
      {showAddRest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-swiggy-surface border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg text-white mb-4">Onboard New Restaurant</h3>

            <form onSubmit={handleCreateRestaurant} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Restaurant Name *</label>
                <input
                  required
                  type="text"
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  placeholder="e.g. Bombay Frankie & Chai Bar"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Cuisines *</label>
                <input
                  required
                  type="text"
                  value={restCuisine}
                  onChange={(e) => setRestCuisine(e.target.value)}
                  placeholder="e.g. Rolls, Street Food, Chai, Snacks"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Address</label>
                <input
                  type="text"
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  placeholder="100ft Road, Indiranagar, Bangalore"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={restCover}
                  onChange={(e) => setRestCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRest(false)}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-glow"
                >
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

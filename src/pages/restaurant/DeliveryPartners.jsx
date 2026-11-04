import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { base44 } from '../../services/base44Engine';
import {
  Bike,
  Plus,
  ArrowLeft,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function DeliveryPartners() {
  const { user } = useAuth();
  const restaurantId = user?.data?.restaurant_id || 'rest_1';

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New partner state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('Honda Activa (KA 03 EN 4492)');

  const loadPartners = async () => {
    try {
      const data = await base44.entities.DeliveryPartner.list({ restaurant_id: restaurantId });
      setPartners(data);
    } catch (err) {
      console.error('Failed to load partners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, [restaurantId]);

  const handleCreatePartner = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    await base44.functions.LinkDeliveryPartner({
      user_id: `usr_deliv_${Date.now()}`,
      restaurant_id: restaurantId,
      name,
      email,
      phone,
      vehicle
    });

    setName('');
    setEmail('');
    setPhone('');
    setShowAddModal(false);
    await loadPartners();
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <Link
          to="/restaurant"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Kitchen Console</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Bike className="w-6 h-6 text-primary" />
              <span>Delivery Fleet Partners</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Assigned delivery personnel handling order fulfillments
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Partner</span>
          </button>
        </div>

        {/* Partners List */}
        <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-card">
          <div className="divide-y divide-white/5">
            {partners.map(partner => (
              <div key={partner.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-white">{partner.name}</h4>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {partner.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{partner.vehicle}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                      <span>Phone: {partner.phone}</span>
                      <span>•</span>
                      <span>{partner.email}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">★ {partner.rating} ({partner.total_deliveries} deliveries)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {partners.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-xs">
                No delivery partners linked to this restaurant yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-swiggy-surface border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg text-white mb-4">Link Delivery Partner</h3>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Partner Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Singh"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@chronobite.com"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 91234 56789"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Vehicle Details</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. Honda Activa 6G (KA 03 EN 4492)"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-glow"
                >
                  Link Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { base44 } from '../../services/base44Engine';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Shield,
  Save,
  CheckCircle,
  RotateCcw
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, resetAllDemoData } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.data?.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New address state
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [label, setLabel] = useState('Home');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');

  const loadAddresses = async () => {
    const list = await base44.entities.Address.list();
    setAddresses(list);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({ phone });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!fullAddress.trim()) return;

    await base44.entities.Address.create({
      label,
      full_address: fullAddress,
      landmark,
      phone: phone || '+91 98765 43210'
    });
    setFullAddress('');
    setLandmark('');
    setShowNewAddr(false);
    await loadAddresses();
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            <span>Profile & Account Settings</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal info and delivery addresses
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 border border-white/10 shadow-card">
          <div className="flex items-center gap-4 pb-6 border-b border-white/5">
            <img
              src={user?.data?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/10"
            />
            <div>
              <h3 className="font-bold text-lg text-white">{user?.full_name}</h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] uppercase font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                Role: {user?.data?.app_role}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={fullName}
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white opacity-70"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white opacity-70"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow flex items-center gap-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>

              {saveSuccess && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Saved Addresses */}
        <div className="bg-card rounded-2xl p-6 border border-white/10 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Saved Delivery Addresses</span>
            </h3>
            <button
              onClick={() => setShowNewAddr(!showNewAddr)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* New address form */}
          {showNewAddr && (
            <form onSubmit={handleAddAddress} className="p-4 rounded-xl bg-swiggy-surface border border-white/5 space-y-3">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">New Address</h4>
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setLabel(lbl)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold ${
                      label === lbl ? 'bg-primary text-white border-primary' : 'bg-swiggy-darker text-muted-foreground'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <textarea
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="Full address, Street, Door no."
                rows={2}
                className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Landmark (Optional)"
                className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-primary"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewAddr(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-glow"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="p-4 rounded-xl bg-swiggy-surface border border-white/5 flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {addr.label}
                  </span>
                  <p className="text-xs text-white font-medium mt-2 leading-relaxed">
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
            ))}
          </div>
        </div>

        {/* Danger zone / Reset Demo */}
        <div className="bg-card rounded-2xl p-6 border border-rose-500/20 shadow-card flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-white">Reset Demo Database</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Clear your custom orders and restore initial seed state
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state?')) {
                resetAllDemoData();
                window.location.reload();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}

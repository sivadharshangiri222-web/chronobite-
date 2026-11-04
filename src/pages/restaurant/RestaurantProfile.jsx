import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { base44 } from '../../services/base44Engine';
import {
  Store,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function RestaurantProfile() {
  const { user } = useAuth();
  const restaurantId = user?.data?.restaurant_id || 'rest_1';

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [coverUrl, setCoverUrl] = useState('');
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    async function load() {
      const rest = await base44.entities.Restaurant.get(restaurantId);
      if (rest) {
        setRestaurant(rest);
        setName(rest.name || '');
        setCuisine(rest.cuisine || '');
        setDescription(rest.description || '');
        setAddress(rest.address || '');
        setPhone(rest.phone || '');
        setEnabled(rest.enabled ?? true);
        setCoverUrl(rest.cover_url || '');
        setDiscount(rest.discount || '');
      }
      setLoading(false);
    }
    load();
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.Restaurant.update(restaurantId, {
        name,
        cuisine,
        description,
        address,
        phone,
        enabled,
        cover_url: coverUrl,
        discount
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            <span>Restaurant Profile & Settings</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your kitchen's operating status, address, and profile details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-white/10 shadow-card space-y-6">
          {/* Operational Status Switch */}
          <div className="p-4 rounded-xl bg-swiggy-surface border border-white/5 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-white">Accepting Orders Online</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Toggle off if the kitchen is full or closed for the night.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                enabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-glow-green'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500'
              }`}
            >
              {enabled ? '🟢 Kitchen Open' : '🔴 Closed'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Restaurant Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Cuisines Offered</label>
              <input
                type="text"
                required
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">About / Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Kitchen Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Banner Cover Image URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Promotional Discount Tag</label>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="60% OFF up to ₹120"
                className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black shadow-glow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Restaurant Settings</span>
            </button>

            {saved && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

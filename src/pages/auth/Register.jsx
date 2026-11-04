import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '../../services/base44Engine';
import {
  Clock,
  Mail,
  Lock,
  User,
  Phone,
  Store,
  Bike,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [role, setRole] = useState('customer'); // customer | restaurant | delivery_partner

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [vehicle, setVehicle] = useState('Honda Activa (KA 03 EN 4492)');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      const list = await base44.entities.Restaurant.list({ enabled: true });
      setRestaurants(list);
      if (list.length > 0) {
        setRestaurantId(list[0].id);
      }
    }
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (role === 'delivery_partner' && !restaurantId) {
      setError('Please select a restaurant to partner with.');
      return;
    }

    // Save pending registration payload to session/state and navigate to OTP verification
    const regPayload = {
      email,
      password,
      full_name: fullName,
      app_role: role,
      phone,
      restaurant_id: role === 'delivery_partner' ? restaurantId : null,
      vehicle: role === 'delivery_partner' ? vehicle : null
    };

    sessionStorage.setItem('chronobite_pending_reg', JSON.stringify(regPayload));
    navigate('/verify-otp');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/app" className="inline-flex items-center gap-2 mb-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-swiggy-deepOrange flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-3xl font-black tracking-tight text-white">Chrono<span className="text-primary">Bite</span></span>
        </Link>
        <h2 className="text-lg font-bold text-white mt-2">Create your ChronoBite account</h2>
        <p className="text-xs text-muted-foreground">Select your role to start ordering or fulfilling meals</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-card rounded-2xl p-6 border border-white/10 shadow-card">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Join ChronoBite As:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                    role === 'customer'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-glow-green'
                      : 'bg-swiggy-surface text-muted-foreground border-white/5 hover:text-white'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('restaurant')}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                    role === 'restaurant'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-glow'
                      : 'bg-swiggy-surface text-muted-foreground border-white/5 hover:text-white'
                  }`}
                >
                  Restaurant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('delivery_partner')}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                    role === 'delivery_partner'
                      ? 'bg-primary/20 text-primary border-primary shadow-glow'
                      : 'bg-swiggy-surface text-muted-foreground border-white/5 hover:text-white'
                  }`}
                >
                  Rider Partner
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Extra fields if Delivery Partner selected */}
            {role === 'delivery_partner' && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  Delivery Partner Onboarding Details:
                </span>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Select Base Restaurant to Link With *
                  </label>
                  <select
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    {restaurants.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.cuisine.split(',')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Vehicle Details</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. TVS Jupiter (KA 05 AB 1234)"
                    className="w-full bg-swiggy-surface border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to OTP Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground border-t border-white/5 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

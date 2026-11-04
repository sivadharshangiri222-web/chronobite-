import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  Bike,
  UtensilsCrossed,
  User,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/app';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = login(email, password);
      redirectByRole(user.data?.app_role);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuickLogin = (roleKey) => {
    const user = switchDemoRole(roleKey);
    if (user) {
      redirectByRole(user.data?.app_role);
    }
  };

  const redirectByRole = (appRole) => {
    switch (appRole) {
      case 'restaurant': navigate('/restaurant'); break;
      case 'delivery_partner': navigate('/delivery'); break;
      case 'admin': navigate('/admin'); break;
      default: navigate('/app'); break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/app" className="inline-flex items-center gap-2 mb-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-swiggy-deepOrange flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-3xl font-black tracking-tight text-white">Chrono<span className="text-primary">Bite</span></span>
        </Link>
        <h2 className="text-lg font-bold text-white mt-2">Sign in to your account</h2>
        <p className="text-xs text-muted-foreground">Access your role-based orders, kitchen console, or rider portal</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        {/* Quick Demo Access Bar */}
        <div className="bg-card rounded-2xl p-4 border border-white/10 shadow-card mb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Instant 1-Click Demo Login:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="p-2 rounded-xl bg-swiggy-surface hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-left transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Customer</p>
                <p className="text-[10px] text-muted-foreground truncate">Aarav Sharma</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('restaurant')}
              className="p-2 rounded-xl bg-swiggy-surface hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-left transition-colors flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Restaurant</p>
                <p className="text-[10px] text-muted-foreground truncate">Spice Garden</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('delivery_partner')}
              className="p-2 rounded-xl bg-swiggy-surface hover:bg-primary/10 border border-white/5 hover:border-primary/30 text-left transition-colors flex items-center gap-2"
            >
              <Bike className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Delivery Partner</p>
                <p className="text-[10px] text-muted-foreground truncate">Vikram Singh</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-2 rounded-xl bg-swiggy-surface hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-left transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Admin</p>
                <p className="text-[10px] text-muted-foreground truncate">Global Hub</p>
              </div>
            </button>
          </div>
        </div>

        {/* Credentials Login Form */}
        <div className="bg-card rounded-2xl p-6 border border-white/10 shadow-card">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@chronobite.com"
                  className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider shadow-glow transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Google Auth & Register link */}
          <div className="mt-5 pt-5 border-t border-white/5 space-y-4">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="w-full py-2.5 rounded-xl bg-swiggy-surface hover:bg-white/5 border border-white/10 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

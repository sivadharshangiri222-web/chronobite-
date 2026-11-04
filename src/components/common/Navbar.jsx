import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  LogOut,
  ChevronDown,
  Clock,
  Receipt,
  UtensilsCrossed,
  Shield,
  Bike,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onOpenCart }) {
  const { user, role, logout } = useAuth();
  const { totalItemCount } = useCart();
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (role) {
      case 'restaurant': return '/restaurant';
      case 'delivery_partner': return '/delivery';
      case 'admin': return '/admin';
      default: return '/app';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center gap-6">
          <Link to={getDashboardLink()} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-swiggy-deepOrange flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">Chrono<span className="text-primary">Bite</span></span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                  {role}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase hidden sm:block">Lightning Food Delivery</span>
            </div>
          </Link>

          {/* Delivery Location Selector (Customer view) */}
          <div className="hidden lg:flex items-center gap-2 text-sm pl-4 border-l border-white/10">
            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white text-xs">Indiranagar, Bangalore</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">12th Main Road, HAL 2nd Stage...</span>
            </div>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/app"
            className={`transition-colors hover:text-primary ${
              location.pathname === '/app' ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`}
          >
            Explore Food
          </Link>
          <Link
            to="/app/orders"
            className={`flex items-center gap-1.5 transition-colors hover:text-primary ${
              location.pathname.startsWith('/app/orders') ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>My Orders</span>
          </Link>

          {/* Quick links to role spaces if relevant */}
          {role === 'restaurant' && (
            <Link to="/restaurant" className="text-amber-400 font-medium flex items-center gap-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Kitchen Console</span>
            </Link>
          )}
          {role === 'delivery_partner' && (
            <Link to="/delivery" className="text-primary font-medium flex items-center gap-1">
              <Bike className="w-4 h-4" />
              <span>Rider Dashboard</span>
            </Link>
          )}
          {role === 'admin' && (
            <Link to="/admin" className="text-indigo-400 font-medium flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Admin Hub</span>
            </Link>
          )}
        </div>

        {/* Right: Cart and User Account */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            onClick={onOpenCart || (() => navigate('/app/checkout'))}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-swiggy-surface hover:bg-swiggy-border border border-white/10 text-white font-medium text-sm transition-all duration-200"
            title="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Cart</span>
            {totalItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-swiggy-surface border border-white/10 hover:border-primary/50 transition-colors"
              >
                <img
                  src={user.data?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-xs font-semibold text-white hidden sm:block max-w-[100px] truncate">
                  {user.full_name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {userDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-swiggy-surface border border-white/10 rounded-xl shadow-2xl p-2 z-50 text-sm animate-fade-in"
                  onClick={() => setUserDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="font-semibold text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/app/orders"
                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/app/profile"
                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Saved Addresses & Profile</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

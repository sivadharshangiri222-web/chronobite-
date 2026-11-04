import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Bike, UtensilsCrossed, User, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function RoleDemoBar() {
  const { user, role, switchDemoRole, resetAllDemoData } = useAuth();
  const [minimized, setMinimized] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = (newRoleKey, targetRoute) => {
    switchDemoRole(newRoleKey);
    navigate(targetRoute);
  };

  const handleReset = () => {
    if (window.confirm('Reset all ChronoBite seed data to pristine initial state?')) {
      resetAllDemoData();
      navigate('/app');
    }
  };

  const roles = [
    {
      key: 'customer',
      label: 'Customer',
      name: 'Aarav Sharma',
      route: '/app',
      icon: User,
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      key: 'restaurant',
      label: 'Restaurant',
      name: 'Priya (Spice Garden)',
      route: '/restaurant',
      icon: UtensilsCrossed,
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    },
    {
      key: 'delivery_partner',
      label: 'Delivery Partner',
      name: 'Vikram Singh',
      route: '/delivery',
      icon: Bike,
      color: 'bg-primary/15 text-primary border-primary/30'
    },
    {
      key: 'admin',
      label: 'Admin',
      name: 'Platform Overseer',
      route: '/admin',
      icon: Shield,
      color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
    }
  ];

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 bg-swiggy-surface border border-swiggy-border text-white text-xs font-medium px-3 py-2 rounded-full shadow-2xl hover:border-primary transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
          <span>Quick Switch Role</span>
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-swiggy-darker/95 backdrop-blur-md border-b border-white/5 py-1.5 px-3 sm:px-6 sticky top-0 z-50 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wider mr-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Switch Demo Role:
          </span>

          {roles.map(r => {
            const isActive = role === r.key;
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={() => handleRoleSwitch(r.key, r.route)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-glow'
                    : 'bg-swiggy-surface text-muted-foreground border-white/10 hover:text-white hover:border-white/20'
                }`}
                title={`Switch to ${r.label} mode`}
              >
                <Icon className="w-3 h-3" />
                <span>{r.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Right: Active user name and Reset */}
        <div className="flex items-center gap-2 ml-auto">
          {user && (
            <span className="text-[11px] text-muted-foreground hidden md:inline-flex items-center gap-1.5 bg-swiggy-surface/60 px-2 py-0.5 rounded border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Logged as: <strong className="text-white font-medium">{user.full_name}</strong>
            </span>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 rounded border border-white/10 text-muted-foreground hover:text-rose-400 hover:border-rose-500/30 transition-colors text-[11px]"
            title="Reset orders and data back to default state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Seed Data</span>
          </button>

          <button
            onClick={() => setMinimized(true)}
            className="p-1 text-muted-foreground hover:text-white rounded hover:bg-white/5"
            title="Collapse demo bar"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { STATUS_LABELS } from '../../services/orderStateMachine';

export default function StatusBadge({ status, size = 'md' }) {
  const meta = STATUS_LABELS[status] || { label: status, color: 'muted' };

  const colorStyles = {
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    primary: 'bg-primary/20 text-primary border-primary/40',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    red: 'bg-red-500/15 text-red-400 border-red-500/30',
    muted: 'bg-secondary text-muted-foreground border-white/10'
  };

  const isLive = ['pending', 'confirmed', 'preparing', 'ready', 'assigned', 'picked_up', 'out_for_delivery'].includes(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorStyles[meta.color] || colorStyles.muted} ${sizeClasses}`}
    >
      {isLive && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      <span>{meta.label}</span>
    </span>
  );
}

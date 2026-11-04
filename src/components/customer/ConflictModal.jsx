import React from 'react';
import { useCart } from '../../context/CartContext';
import { AlertCircle, Trash2 } from 'lucide-react';

export default function ConflictModal() {
  const { conflictModal, restaurantName, resolveConflictReplace, resolveConflictCancel } = useCart();

  if (!conflictModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-swiggy-surface border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center gap-3 text-amber-400 mb-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="font-bold text-lg text-white">Replace Cart Items?</h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Your cart currently contains dishes from <strong className="text-white">{restaurantName}</strong>.
          Would you like to reset your cart to add dishes from <strong className="text-primary">{conflictModal.pendingRestaurant?.name}</strong>?
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={resolveConflictCancel}
            className="px-4 py-2 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
          >
            Keep Existing Items
          </button>
          <button
            onClick={resolveConflictReplace}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset & Add New</span>
          </button>
        </div>
      </div>
    </div>
  );
}

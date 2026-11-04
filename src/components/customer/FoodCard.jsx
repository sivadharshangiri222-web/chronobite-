import React from 'react';
import VegBadge from '../common/VegBadge';
import { Star, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function FoodCard({ food, restaurant }) {
  const { items, addItem, updateQuantity } = useCart();

  const cartItem = items.find(i => i.food_id === food.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = !food.enabled;

  return (
    <div className={`py-5 border-b border-white/5 flex items-start justify-between gap-4 transition-opacity ${isOutOfStock ? 'opacity-60' : ''}`}>
      {/* Left Details */}
      <div className="flex-1 pr-2">
        <div className="flex items-center gap-2 mb-1.5">
          <VegBadge isVeg={food.is_veg} />
          {food.bestseller && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              ★ Bestseller
            </span>
          )}
          {food.rating && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              {food.rating} ({food.votes || 50})
            </span>
          )}
        </div>

        <h4 className="font-bold text-base text-white tracking-tight">
          {food.name}
        </h4>

        <p className="font-semibold text-sm text-foreground/90 mt-1">
          ₹{food.price}
        </p>

        {food.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        )}
      </div>

      {/* Right Image & Add Button */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="w-28 sm:w-32 aspect-square rounded-2xl overflow-hidden bg-muted border border-white/5 shadow-md">
          <img
            src={food.image_url}
            alt={food.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Floating Add or Stepper Button */}
        <div className="absolute -bottom-3 z-10 shadow-lg">
          {isOutOfStock ? (
            <span className="px-3 py-1.5 rounded-lg bg-swiggy-surface border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
              Sold Out
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-swiggy-surface border border-primary text-primary rounded-xl overflow-hidden shadow-glow">
              <button
                onClick={() => updateQuantity(food.id, -1)}
                className="px-2.5 py-1.5 hover:bg-primary/20 active:scale-95 transition-all text-white font-bold"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-extrabold text-white min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(food.id, 1)}
                className="px-2.5 py-1.5 hover:bg-primary/20 active:scale-95 transition-all text-white font-bold"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(food, restaurant)}
              className="px-6 py-1.5 rounded-xl bg-swiggy-surface hover:bg-primary text-primary hover:text-white border border-white/10 hover:border-primary text-xs font-extrabold tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-md"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

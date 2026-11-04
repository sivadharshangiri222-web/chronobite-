import React from 'react';
import { Search, Star, Clock, ArrowUpDown, X } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  vegOnly,
  onToggleVeg,
  rating4Plus,
  onToggleRating4Plus,
  fastDelivery,
  onToggleFastDelivery,
  sortBy,
  onSortChange
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 py-3 border-b border-white/5">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for restaurants, biryani, burgers, pizzas..."
          className="w-full bg-swiggy-surface border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
        {/* Veg Only */}
        <button
          onClick={onToggleVeg}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 shrink-0 ${
            vegOnly
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-glow-green'
              : 'bg-swiggy-surface text-muted-foreground border-white/5 hover:border-white/20 hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Pure Veg</span>
        </button>

        {/* 4.0+ Rating */}
        <button
          onClick={onToggleRating4Plus}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 shrink-0 ${
            rating4Plus
              ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-glow'
              : 'bg-swiggy-surface text-muted-foreground border-white/5 hover:border-white/20 hover:text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Ratings 4.0+</span>
        </button>

        {/* Fast Delivery */}
        <button
          onClick={onToggleFastDelivery}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 shrink-0 ${
            fastDelivery
              ? 'bg-primary/20 text-primary border-primary shadow-glow'
              : 'bg-swiggy-surface text-muted-foreground border-white/5 hover:border-white/20 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>Fast ({'<'}25 min)</span>
        </button>

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-swiggy-surface border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-white focus:outline-none focus:border-primary cursor-pointer transition-colors"
          >
            <option value="relevance">Sort: Recommended</option>
            <option value="rating">Rating: High to Low</option>
            <option value="delivery_time">Delivery Time: Fastest</option>
          </select>
        </div>
      </div>
    </div>
  );
}

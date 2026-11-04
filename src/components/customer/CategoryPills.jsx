import React from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All Cuisines', emoji: '🍽️' },
  { id: 'biryani', label: 'Biryani', emoji: '🍗' },
  { id: 'pizzas', label: 'Pizzas', emoji: '🍕' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'asian', label: 'Asian & Dimsums', emoji: '🥟' },
  { id: 'desserts', label: 'Cakes & Desserts', emoji: '🍰' },
  { id: 'pure_veg', label: 'Pure Veg', emoji: '🥗' },
  { id: 'fast_food', label: 'Fries & Shakes', emoji: '🍟' },
];

export default function CategoryPills({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max pb-1">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-glow scale-105'
                  : 'bg-swiggy-surface text-muted-foreground border border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

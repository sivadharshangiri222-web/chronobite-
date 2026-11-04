import React, { useState, useEffect } from 'react';
import { base44 } from '../../services/base44Engine';
import RestaurantCard from '../../components/customer/RestaurantCard';
import CategoryPills from '../../components/customer/CategoryPills';
import FilterBar from '../../components/customer/FilterBar';
import { Sparkles, Utensils, Zap, Percent, Clock } from 'lucide-react';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [rating4Plus, setRating4Plus] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const data = await base44.entities.Restaurant.list();
        setRestaurants(data);
      } catch (err) {
        console.error('Error fetching restaurants', err);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurants();
  }, []);

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(r => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisine.toLowerCase().includes(q);
      if (!matchName && !matchCuisine) return false;
    }

    // Category
    if (selectedCategory !== 'all') {
      const catKeywords = {
        biryani: ['biryani', 'mughlai', 'kebab'],
        pizzas: ['pizza', 'italian', 'pasta'],
        burgers: ['burger', 'fries', 'american'],
        asian: ['asian', 'chinese', 'dimsum', 'wok'],
        desserts: ['bakery', 'dessert', 'cake', 'sweet'],
        pure_veg: ['pure veg', 'vegetarian', 'thali'],
        fast_food: ['shake', 'burger', 'fries']
      };
      const keywords = catKeywords[selectedCategory] || [];
      const matchCat = keywords.some(k => r.cuisine.toLowerCase().includes(k) || r.name.toLowerCase().includes(k));
      if (!matchCat) return false;
    }

    // Veg Only
    if (vegOnly) {
      const isPureVeg = r.cuisine.toLowerCase().includes('pure veg') || r.tags?.includes('100% Pure Veg');
      if (!isPureVeg) return false;
    }

    // 4.0+ Rating
    if (rating4Plus && r.rating < 4.6) {
      return false;
    }

    // Fast Delivery (<25 mins)
    if (fastDelivery) {
      const timeNum = parseInt(r.delivery_time);
      if (timeNum > 25) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'delivery_time') {
      return parseInt(a.delivery_time) - parseInt(b.delivery_time);
    }
    return 0; // relevance
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Promotional Banners Carousel / Swiggy-Style Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Banner 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white shadow-card flex flex-col justify-between h-44 group">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-md mb-2">
                <Percent className="w-3 h-3 text-amber-300" />
                Special Offer
              </span>
              <h2 className="text-2xl font-black leading-tight">FLAT 50% OFF</h2>
              <p className="text-xs text-white/90 font-medium mt-1">On your first 3 gourmet orders. Use code <span className="font-mono font-bold bg-white/20 px-1 rounded">CHRONO50</span></p>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold underline underline-offset-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Deals &rarr;
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80"
              alt="Biryani promo"
              className="absolute -right-6 -bottom-6 w-36 h-36 object-cover rounded-full border-4 border-white/20 opacity-80 group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Banner 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-800 p-6 text-white shadow-card flex flex-col justify-between h-44 group">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-md mb-2">
                <Zap className="w-3 h-3 text-yellow-300" />
                Lightning Speed
              </span>
              <h2 className="text-2xl font-black leading-tight">Under 20 Mins</h2>
              <p className="text-xs text-white/90 font-medium mt-1">Supercharged delivery straight from the wok to your door</p>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold underline underline-offset-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Order Express &rarr;
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
              alt="Burger promo"
              className="absolute -right-6 -bottom-6 w-36 h-36 object-cover rounded-full border-4 border-white/20 opacity-80 group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Banner 3 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 p-6 text-white shadow-card flex flex-col justify-between h-44 group">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-md mb-2">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                Gourmet Selection
              </span>
              <h2 className="text-2xl font-black leading-tight">Artisan Wood-Fired</h2>
              <p className="text-xs text-white/90 font-medium mt-1">48-hr fermented sourdough pizzas & handmade pastas</p>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold underline underline-offset-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Taste Italy &rarr;
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80"
              alt="Pizza promo"
              className="absolute -right-6 -bottom-6 w-36 h-36 object-cover rounded-full border-4 border-white/20 opacity-80 group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Category Pills Carousel */}
        <div>
          <h3 className="text-base font-extrabold text-white mb-2 tracking-tight">
            What's on your mind?
          </h3>
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Filter Bar */}
        <div>
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            vegOnly={vegOnly}
            onToggleVeg={() => setVegOnly(!vegOnly)}
            rating4Plus={rating4Plus}
            onToggleRating4Plus={() => setRating4Plus(!rating4Plus)}
            fastDelivery={fastDelivery}
            onToggleFastDelivery={() => setFastDelivery(!fastDelivery)}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Header Count */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Restaurants delivering to you</span>
            <span className="text-xs font-bold bg-primary/20 text-primary px-2.5 py-0.5 rounded-full border border-primary/30">
              {filteredRestaurants.length}
            </span>
          </h2>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-card rounded-2xl h-72 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-card rounded-2xl border border-white/5 p-8">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground mb-4">
              <Utensils className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-white">No restaurants found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              We couldn't find any restaurants matching your filters. Try clearing your search or resetting dietary filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setVegOnly(false);
                setRating4Plus(false);
                setFastDelivery(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

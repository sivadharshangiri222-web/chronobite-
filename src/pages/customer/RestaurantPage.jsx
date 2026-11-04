import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '../../services/base44Engine';
import { useCart } from '../../context/CartContext';
import FoodCard from '../../components/customer/FoodCard';
import {
  Star,
  Clock,
  MapPin,
  Tag,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, totalItemCount, grandTotal } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const rest = await base44.entities.Restaurant.get(id);
        const foodList = await base44.entities.Food.list({ restaurant_id: id });
        setRestaurant(rest);
        setFoods(foodList);
      } catch (err) {
        console.error('Error fetching restaurant details', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-white">Restaurant Not Found</h2>
        <Link to="/app" className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  // Filter foods by veg/non-veg
  const filteredFoods = vegOnly ? foods.filter(f => f.is_veg) : foods;

  // Group by category
  const categories = Array.from(new Set(filteredFoods.map(f => f.category || 'General')));

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Back button & Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to restaurants</span>
        </Link>
      </div>

      {/* Restaurant Header Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <div className="bg-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-card">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {restaurant.name}
                </h1>
                {!restaurant.enabled && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase">
                    Temporarily Closed
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {restaurant.cuisine}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{restaurant.address}</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold mt-4 text-foreground/90 flex-wrap">
                <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                  <Star className="w-3 h-3 fill-white" />
                  <span>{restaurant.rating}</span>
                  <span className="text-[10px] opacity-80">({restaurant.reviews_count})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{restaurant.delivery_time}</span>
                </div>
                <div className="text-muted-foreground">
                  {restaurant.cost_for_two}
                </div>
              </div>
            </div>

            {/* Restaurant Thumbnail */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-md">
              <img
                src={restaurant.image_url || restaurant.cover_url}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Discount Tag */}
          {restaurant.discount && (
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-primary">
              <Tag className="w-4 h-4 fill-primary" />
              <span>{restaurant.discount}</span>
            </div>
          )}

          {!restaurant.enabled && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>This restaurant is currently closed for new orders. You can browse the menu but cannot checkout.</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Filter & Sticky Category Nav */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-white/5 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeCategory === null
                  ? 'bg-primary text-white shadow-glow'
                  : 'bg-swiggy-surface text-muted-foreground hover:text-white border border-white/5'
              }`}
            >
              All Dishes ({filteredFoods.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-swiggy-surface text-muted-foreground hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pure Veg Toggle Switch */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 transition-all ${
              vegOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-glow-green'
                : 'bg-swiggy-surface text-muted-foreground border-white/10 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Veg Only</span>
          </button>
        </div>
      </div>

      {/* Menu Categories & Items List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {categories.map(category => {
          if (activeCategory && activeCategory !== category) return null;
          const itemsInCategory = filteredFoods.filter(f => (f.category || 'General') === category);
          if (itemsInCategory.length === 0) return null;

          return (
            <section key={category} className="bg-card rounded-2xl p-5 border border-white/5 shadow-sm">
              <h3 className="font-extrabold text-lg text-white mb-2 flex items-center justify-between">
                <span>{category}</span>
                <span className="text-xs text-muted-foreground font-normal">({itemsInCategory.length})</span>
              </h3>

              <div className="divide-y divide-white/5">
                {itemsInCategory.map(food => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {filteredFoods.length === 0 && (
          <div className="text-center py-12 bg-card rounded-2xl border border-white/5 p-6">
            <p className="text-sm text-muted-foreground">No dishes found with the selected filters.</p>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none">
          <div className="max-w-xl mx-auto pointer-events-auto">
            <div className="bg-primary text-white p-3.5 sm:p-4 rounded-2xl shadow-glow flex items-center justify-between border border-white/20 animate-slide-up">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase font-extrabold tracking-wider text-white/90">
                  {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'} Added
                </span>
                <span className="text-base font-black">
                  ₹{grandTotal} <span className="text-[11px] font-normal text-white/80">plus taxes</span>
                </span>
              </div>

              <button
                onClick={() => navigate('/app/checkout')}
                className="px-4 py-2 rounded-xl bg-white text-primary text-xs font-black uppercase tracking-wider shadow hover:bg-slate-100 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>View Cart</span>
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

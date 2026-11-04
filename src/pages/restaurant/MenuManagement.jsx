import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { base44 } from '../../services/base44Engine';
import VegBadge from '../../components/common/VegBadge';
import {
  UtensilsCrossed,
  Plus,
  ArrowLeft,
  Trash2,
  Edit,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Star
} from 'lucide-react';

export default function MenuManagement() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Biryani & Rice');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const restaurantId = user?.data?.restaurant_id || 'rest_1';

  const loadFoods = async () => {
    try {
      const data = await base44.entities.Food.list({ restaurant_id: restaurantId });
      setFoods(data);
    } catch (err) {
      console.error('Failed to load foods', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, [restaurantId]);

  const handleToggleStock = async (food) => {
    await base44.entities.Food.update(food.id, { enabled: !food.enabled });
    await loadFoods();
  };

  const handleDelete = async (foodId) => {
    if (window.confirm('Delete this menu item?')) {
      await base44.entities.Food.delete(foodId);
      await loadFoods();
    }
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    await base44.entities.Food.create({
      restaurant_id: restaurantId,
      name,
      category,
      price: parseFloat(price),
      description,
      is_veg: isVeg,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      enabled: true
    });

    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setShowAddModal(false);
    await loadFoods();
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Back link */}
        <Link
          to="/restaurant"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Kitchen Console</span>
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
              <span>Menu Management</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add dishes, update prices, and toggle in-stock availability
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>

        {/* Menu Items Table / Grid */}
        <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-card">
          <div className="p-4 border-b border-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Dishes: {foods.length}</span>
            <span>Active Dishes: {foods.filter(f => f.enabled).length}</span>
          </div>

          <div className="divide-y divide-white/5">
            {foods.map(food => (
              <div key={food.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-white/5">
                    <img src={food.image_url} alt={food.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <VegBadge isVeg={food.is_veg} />
                      <h4 className="font-bold text-sm text-white truncate">{food.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{food.category} • <strong className="text-white">₹{food.price}</strong></p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-md mt-0.5">{food.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* In-Stock Toggle */}
                  <button
                    onClick={() => handleToggleStock(food)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                      food.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {food.enabled ? 'In Stock' : 'Out of Stock'}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="p-2 text-muted-foreground hover:text-rose-400 rounded-lg hover:bg-white/5"
                    title="Delete dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-swiggy-surface border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg text-white mb-4">Add Menu Item</h3>

            <form onSubmit={handleCreateFood} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Dish Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mutton Dum Biryani"
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Biryani & Rice">Biryani & Rice</option>
                    <option value="Starters & Kebabs">Starters & Kebabs</option>
                    <option value="Neapolitan Pizzas">Neapolitan Pizzas</option>
                    <option value="Gourmet Burgers">Gourmet Burgers</option>
                    <option value="Desserts & Sides">Desserts & Sides</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="299"
                    className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Dietary Preference</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="radio"
                      name="vegType"
                      checked={isVeg}
                      onChange={() => setIsVeg(true)}
                    />
                    <span>Pure Veg</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="radio"
                      name="vegType"
                      checked={!isVeg}
                      onChange={() => setIsVeg(false)}
                    />
                    <span>Non-Veg</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredients and culinary preparation details"
                  rows={2}
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-swiggy-darker border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-glow"
                >
                  Create Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

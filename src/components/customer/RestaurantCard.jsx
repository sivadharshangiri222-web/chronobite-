import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Tag } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const isClosed = !restaurant.enabled;

  return (
    <Link
      to={`/app/restaurant/${restaurant.id}`}
      className={`group flex flex-col bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 hover:shadow-card hover:-translate-y-1 transition-all duration-300 ${
        isClosed ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      {/* Cover Image & Discount Badge */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={restaurant.cover_url || restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient shadow overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Swiggy Discount Overlay */}
        {restaurant.discount && (
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <span className="font-extrabold text-sm uppercase tracking-wide text-white drop-shadow-md flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-primary fill-primary" />
              {restaurant.discount}
            </span>
            <span className="text-[11px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" />
              {restaurant.delivery_time}
            </span>
          </div>
        )}

        {/* Closed Badge */}
        {isClosed && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-600/90 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-sm">
            Closed Now
          </div>
        )}

        {/* Price level badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-semibold backdrop-blur-md">
          {restaurant.price_level} • {restaurant.cost_for_two}
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            {/* Swiggy Rating Badge */}
            <div className="flex items-center gap-1 bg-emerald-600 text-white px-1.5 py-0.5 rounded-md text-xs font-bold shrink-0">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-1 line-clamp-1 font-medium">
            {restaurant.cuisine}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            {restaurant.distance} away
          </span>
          <span className="truncate max-w-[150px]">{restaurant.address.split(',')[0]}</span>
        </div>
      </div>
    </Link>
  );
}

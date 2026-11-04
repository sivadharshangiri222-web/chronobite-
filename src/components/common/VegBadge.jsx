import React from 'react';

export default function VegBadge({ isVeg, size = 'sm' }) {
  const dim = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const dotDim = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  if (isVeg) {
    return (
      <span
        title="Pure Vegetarian"
        className={`inline-flex items-center justify-center border-[1.5px] border-emerald-500 rounded-[3px] p-[1.5px] bg-emerald-500/10 ${dim}`}
      >
        <span className={`rounded-full bg-emerald-500 ${dotDim}`} />
      </span>
    );
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center border-[1.5px] border-rose-500 rounded-[3px] p-[1.5px] bg-rose-500/10 ${dim}`}
    >
      <span
        className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-rose-500"
      />
    </span>
  );
}

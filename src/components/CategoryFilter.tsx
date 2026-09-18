import React from 'react';
import { CATEGORIES } from '../data/places';
import { CategoryType } from '../types';

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  placesCountByCategory: Record<CategoryType, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  placesCountByCategory,
}) => {
  return (
    <div className="w-full bg-slate-50/70 border-b border-slate-200/60 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = placesCountByCategory[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                    : 'bg-white hover:bg-pink-50/50 text-slate-700 hover:text-pink-700 border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-pink-700/80 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

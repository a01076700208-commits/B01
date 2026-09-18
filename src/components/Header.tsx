import React from 'react';
import { Search, Sparkles, Heart, Calendar, Compass, X } from 'lucide-react';
import { FilterState } from '../types';

interface HeaderProps {
  filter: FilterState;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
  itineraryCount: number;
  onOpenFavorites: () => void;
  onOpenItinerary: () => void;
  onOpenRecommender: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filter,
  onSearchChange,
  favoritesCount,
  itineraryCount,
  onOpenFavorites,
  onOpenItinerary,
  onOpenRecommender,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  아이랑<span className="text-pink-600">노는날</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-pink-100 text-pink-700 rounded-full">
                  전국 키즈맵
                </span>
              </div>
              <p className="text-[11px] text-slate-700 hidden md:block">
                엄마·아빠가 직접 검증한 지역별 아이 나들이 가이드
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                id="search-places-input"
                type="text"
                value={filter.searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="장소명, 지역, '비오는날', '수유실', '무료' 검색..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-600 rounded-full border border-transparent focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-hidden transition-all"
              />
              {filter.searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800 p-0.5"
                  aria-label="검색어 지우기"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Smart recommender */}
            <button
              id="open-smart-recommender-btn"
              onClick={onOpenRecommender}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">오늘 뭐하지?</span>
              <span className="sm:hidden">맞춤추천</span>
            </button>

            {/* Plan/Itinerary Basket */}
            <button
              id="open-itinerary-btn"
              onClick={onOpenItinerary}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-full transition-colors active:scale-95"
              title="나들이 계획표"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">코스계획</span>
              {itineraryCount > 0 && (
                <span className="px-1.5 py-0.2 text-[11px] font-bold bg-amber-500 text-white rounded-full">
                  {itineraryCount}
                </span>
              )}
            </button>

            {/* Favorites Wishlist */}
            <button
              id="open-favorites-btn"
              onClick={onOpenFavorites}
              className="relative p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-full transition-colors active:scale-95"
              title="찜한 목록"
            >
              <div className="flex items-center gap-1.5">
                <Heart
                  className={`w-4 h-4 ${
                    favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                  }`}
                />
                <span className="hidden md:inline">찜 목록</span>
                {favoritesCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[11px] font-bold bg-rose-500 text-white rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

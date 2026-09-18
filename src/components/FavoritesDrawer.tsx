import React from 'react';
import { X, Heart, Trash2, ExternalLink, ArrowRight } from 'lucide-react';
import { Place } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  places: Place[];
  onRemoveFavorite: (id: string) => void;
  onSelectPlace: (place: Place) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  places,
  onRemoveFavorite,
  onSelectPlace,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const favoritePlaces = places.filter((p) => favorites.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">찜한 나들이 목록</h2>
                <p className="text-xs text-slate-700">총 {favoritePlaces.length}곳 저장됨</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {favoritePlaces.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-3">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  아직 찜한 장소가 없어요
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  마음에 드는 나들이 명소의 하트(♥) 아이콘을 눌러 나만의 가보고 싶은 리스트를 채워보세요!
                </p>
              </div>
            ) : (
              favoritePlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 transition-all group"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                    onClick={() => {
                      onSelectPlace(place);
                      onClose();
                    }}
                  />

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      onSelectPlace(place);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-pink-600 truncate">
                        {place.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
                        {place.regionName.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {place.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-700">
                      <span className="text-amber-500 font-bold">★ {place.rating.toFixed(1)}</span>
                      <span>•</span>
                      <span>{place.isFree ? '무료' : '유료'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => onRemoveFavorite(place.id)}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <a
                      href={place.mapSearchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="지도 보기"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {favoritePlaces.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                전체 삭제
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

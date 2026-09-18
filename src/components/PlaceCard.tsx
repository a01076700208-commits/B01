import React from 'react';
import {
  Heart,
  MapPin,
  Star,
  Plus,
  Check,
  Baby,
  Car,
  CloudRain,
  Sun,
  Layers,
  Sparkles,
  Clock,
  ExternalLink,
  Play
} from 'lucide-react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  isInItinerary: boolean;
  onToggleFavorite: (placeId: string) => void;
  onToggleItinerary: (placeId: string) => void;
  onOpenDetail: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isFavorite,
  isInItinerary,
  onToggleFavorite,
  onToggleItinerary,
  onOpenDetail,
}) => {
  const envBadge = {
    indoor: { text: '실내', icon: CloudRain, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    outdoor: { text: '야외', icon: Sun, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    both: { text: '실내외', icon: Layers, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  }[place.environment];

  const activityBadgeColors: Record<string, string> = {
    체험: 'bg-amber-100 text-amber-800 border-amber-300',
    자연: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    문화: 'bg-rose-100 text-rose-800 border-rose-300',
    교육: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };

  const EnvIcon = envBadge.icon;

  return (
    <div
      id={`place-card-${place.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-pink-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-left cursor-pointer relative"
      onClick={() => onOpenDetail(place)}
    >
      {/* Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs">
              {place.regionName}
            </span>
            <span
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded-lg border backdrop-blur-xs ${envBadge.color}`}
            >
              <EnvIcon className="w-3 h-3" />
              {envBadge.text}
            </span>
            <span
              className={`px-2 py-1 text-[11px] font-bold rounded-lg border shadow-2xs backdrop-blur-xs ${
                activityBadgeColors[place.activityLabel] || 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {place.activityLabel}
            </span>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(place.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              isFavorite
                ? 'bg-white text-rose-500 shadow-md'
                : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
            }`}
            title={isFavorite ? '찜 취소' : '찜하기'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Free admission tag or category bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
          {place.videoUrl && (
            <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white rounded-md shadow-md flex items-center gap-1">
              <Play className="w-3 h-3 fill-white" />
              <span>숏츠 영상</span>
            </span>
          )}
          {place.isFree ? (
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-md shadow-xs">
              무료 입장
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-semibold bg-black/50 text-white rounded-md backdrop-blur-xs">
              {place.categoryLabel}
            </span>
          )}
        </div>

        {/* Rating bottom right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{place.rating.toFixed(1)}</span>
          <span className="text-slate-300 text-[10px]">({place.reviewCount})</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Estimated duration banner */}
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-pink-700 bg-pink-50/90 px-2.5 py-1 rounded-lg border border-pink-200/80 w-fit">
            <Clock className="w-3.5 h-3.5 text-pink-600 shrink-0" />
            <span>예상 소요 시간: {place.estimatedTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1 break-keep">
            {place.name}
          </h3>

          {/* Short summary */}
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed break-keep">
            {place.summary}
          </p>

          {/* Target Ages */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            {place.targetAges.map((age, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap break-keep"
              >
                {age}
              </span>
            ))}
          </div>

          {/* Parent Tip Quote */}
          {place.parentTips.length > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 leading-snug flex items-start gap-1.5 break-keep">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2 break-keep">
                <strong>맘&대디 꿀팁:</strong> {place.parentTips[0]}
              </span>
            </div>
          )}
        </div>

        {/* Footer info & Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-700 mb-3">
            <div className="flex items-center gap-2">
              {place.facilities.nursingRoom && (
                <span className="flex items-center gap-0.5 text-pink-600 font-medium" title="수유실 완비">
                  <Baby className="w-3.5 h-3.5" /> 수유실
                </span>
              )}
              {place.facilities.strollerFriendly && (
                <span className="text-slate-700 font-medium" title="유모차 이동 용이">
                  유모차OK
                </span>
              )}
              {place.facilities.parking && (
                <span className="flex items-center gap-0.5 text-slate-700 font-medium" title="주차 가능">
                  <Car className="w-3.5 h-3.5" /> 주차
                </span>
              )}
            </div>

            <span className="font-semibold text-slate-700 truncate max-w-[120px]">
              {place.priceInfo.split('/')[0]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(place);
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              상세 정보
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleItinerary(place.id);
              }}
              className={`w-full py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                isInItinerary
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-pink-500 hover:bg-pink-600 text-white shadow-xs'
              }`}
            >
              {isInItinerary ? (
                <>
                  <Check className="w-3.5 h-3.5" /> 담김
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> 코스 담기
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Phone,
  DollarSign,
  Heart,
  Plus,
  Check,
  Share2,
  Sparkles,
  ExternalLink,
  Copy,
  Baby,
  Car,
  Utensils,
  TreePine,
  Layers,
  CloudRain,
  Sun,
  Star,
  Play,
  Video
} from 'lucide-react';
import { Place } from '../types';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  isFavorite: boolean;
  isInItinerary: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleItinerary: (id: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  isFavorite,
  isInItinerary,
  onToggleFavorite,
  onToggleItinerary,
}) => {
  if (!place) return null;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const photos = place.gallery && place.gallery.length > 0 ? place.gallery : [place.image];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(place.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${place.name} - 아이랑 노는날`,
        text: `${place.name} (${place.regionName}): ${place.summary}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyAddress();
    }
  };

  const envText = {
    indoor: '실내 전용 (비오는 날 최적)',
    outdoor: '야외 전용 (맑은 날 피크닉)',
    both: '실내 및 야외 복합',
  }[place.environment];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-md"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1">
          {/* Main Photo Gallery */}
          <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
            <img
              src={photos[activePhotoIdx]}
              alt={place.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Thumbnail dots if multiple photos */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activePhotoIdx === idx ? 'w-6 bg-pink-500' : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Hero Overlay Info */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-pink-500 text-white rounded-md">
                  {place.regionName}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-white/20 backdrop-blur-md rounded-md">
                  {place.categoryLabel}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-black/40 backdrop-blur-md rounded-md">
                  {envText}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-keep">
                {place.name}
              </h2>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Quick Action Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-base font-extrabold text-slate-900">{place.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-700">({place.reviewCount}개 평가)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(place.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  {isFavorite ? '찜 완료' : '찜하기'}
                </button>

                <button
                  onClick={() => onToggleItinerary(place.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                    isInItinerary
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-xs'
                  }`}
                >
                  {isInItinerary ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isInItinerary ? '일정에 담김' : '일정 코스 담기'}
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title="공유하기"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Target Ages Pills */}
            <div className="flex items-center gap-2 flex-wrap break-keep">
              <span className="text-xs font-bold text-slate-700">추천 연령:</span>
              {place.targetAges.map((age, i) => (
                <span
                  key={i}
                  className="text-xs font-bold px-2.5 py-1 bg-pink-100/70 text-pink-800 rounded-lg whitespace-nowrap break-keep"
                >
                  {age}
                </span>
              ))}
              {place.isFree && (
                <span className="text-xs font-extrabold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg whitespace-nowrap break-keep">
                  무료 입장 혜택
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5 break-keep">장소 소개</h3>
              <p className="text-sm text-slate-600 leading-relaxed break-keep">
                {place.description}
              </p>
            </div>

            {/* Parenting Pro-Tips Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 break-keep">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-3">
                <Sparkles className="w-4 h-4 text-amber-600" />
                엄마·아빠 리얼 관람 꿀팁 & 준비물
              </div>
              <ul className="space-y-2">
                {place.parentTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-amber-950 break-keep">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                    <span className="break-keep">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* YouTube Shorts Video Section */}
            {place.videoUrl && place.videoEmbedId && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700 text-white shadow-lg break-keep">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Play className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-500/30 text-red-300 border border-red-500/40">
                          YouTube Shorts
                        </span>
                        <span className="text-[11px] text-slate-400">생생 추천 영상</span>
                      </div>
                      <h4 className="text-sm font-black text-white mt-0.5">
                        {place.videoTitle || `${place.name} 추천 숏폼 영상`}
                      </h4>
                    </div>
                  </div>

                  <a
                    href={place.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 shrink-0"
                  >
                    <span>유튜브 앱에서 보기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Video Embed Frame */}
                <div className="flex justify-center bg-black/40 p-2 sm:p-4 rounded-2xl border border-slate-800">
                  <div className="w-full max-w-[320px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-700">
                    <iframe
                      src={`https://www.youtube.com/embed/${place.videoEmbedId}?rel=0&modestbranding=1`}
                      title={place.videoTitle || place.name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Facilities & Amenities Matrix */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">아이 동반 편의시설</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    place.facilities.nursingRoom
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Baby className="w-4 h-4 shrink-0" />
                  <span>수유실/기저귀교환대: {place.facilities.nursingRoom ? '있음' : '미비'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    place.facilities.strollerFriendly
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-sm shrink-0">🛒</span>
                  <span>유모차 이동: {place.facilities.strollerFriendly ? '편리' : '일부계단'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    place.facilities.parking
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Car className="w-4 h-4 shrink-0" />
                  <span>주차장: {place.facilities.parking ? '완비' : '대중교통권장'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    place.facilities.picnicAllowed
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <TreePine className="w-4 h-4 shrink-0" />
                  <span>돗자리/도시락: {place.facilities.picnicAllowed ? '가능' : '제한'}</span>
                </div>
              </div>
            </div>

            {/* Detail Info Grid */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 space-y-3 border border-slate-200/70 text-xs sm:text-sm">
              <div className="flex items-start gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">예상 소요 시간 & 활동 유형</span>
                  <span className="font-extrabold text-pink-700 mr-2">{place.estimatedTime}</span>
                  <span className="text-slate-600">({place.activityLabel} · {place.categoryLabel})</span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2 pt-2 border-t border-slate-200/60">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">주소</span>
                    <span>{place.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyAddress}
                    className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? '복사됨!' : '주소복사'}
                  </button>
                  <a
                    href={place.mapSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-1"
                  >
                    네이버지도 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700 pt-2 border-t border-slate-200/60">
                <Clock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">이용시간</span>
                  <span>{place.operatingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700 pt-2 border-t border-slate-200/60">
                <Calendar className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">휴관 및 정기휴무</span>
                  <span className="text-rose-700 font-medium">{place.closedDays}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700 pt-2 border-t border-slate-200/60">
                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">이용요금</span>
                  <span>{place.priceInfo}</span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">문의전화</span>
                    <span>{place.contact}</span>
                  </div>
                </div>
                <a
                  href={`tel:${place.contact}`}
                  className="px-3 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-800"
                >
                  전화걸기
                </a>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              {place.tags.map((tag, i) => (
                <span key={i} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <a
            href={place.mapSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
          >
            길찾기 / 상세 리뷰 보기 <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

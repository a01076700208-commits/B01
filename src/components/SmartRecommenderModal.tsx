import React, { useState, useMemo } from 'react';
import { X, Sparkles, Compass, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { Place, RegionId } from '../types';
import { REGIONS } from '../data/places';

interface SmartRecommenderModalProps {
  places: Place[];
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
}

export const SmartRecommenderModal: React.FC<SmartRecommenderModalProps> = ({
  places,
  onClose,
  onSelectPlace,
}) => {
  const [selectedAge, setSelectedAge] = useState<'baby' | 'toddler' | 'elementary'>('toddler');
  const [selectedWeather, setSelectedWeather] = useState<'indoor' | 'outdoor' | 'any'>('indoor');
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('all');
  const [preference, setPreference] = useState<'animal' | 'science' | 'park' | 'nature'>('science');

  const recommendations = useMemo(() => {
    let filtered = places.filter((p) => {
      // Age filter
      if (selectedAge === 'baby') {
        const matchesBaby = p.targetAges.some((a) => a.includes('0~3세') || a.includes('유아'));
        if (!matchesBaby) return false;
      } else if (selectedAge === 'toddler') {
        const matchesToddler = p.targetAges.some((a) => a.includes('유아') || a.includes('4~7세'));
        if (!matchesToddler) return false;
      } else if (selectedAge === 'elementary') {
        const matchesElem = p.targetAges.some((a) => a.includes('초등'));
        if (!matchesElem) return false;
      }

      // Weather filter
      if (selectedWeather === 'indoor' && p.environment === 'outdoor') return false;
      if (selectedWeather === 'outdoor' && p.environment === 'indoor') return false;

      // Region filter
      if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;

      return true;
    });

    // Score based on preference
    filtered.sort((a, b) => {
      let scoreA = a.rating * 10;
      let scoreB = b.rating * 10;

      if (preference === 'animal' && a.category === 'zoo_aquarium') scoreA += 20;
      if (preference === 'animal' && b.category === 'zoo_aquarium') scoreB += 20;

      if (preference === 'science' && a.category === 'science_museum') scoreA += 20;
      if (preference === 'science' && b.category === 'science_museum') scoreB += 20;

      if (preference === 'park' && (a.category === 'themepark' || a.category === 'kids_cafe')) scoreA += 20;
      if (preference === 'park' && (b.category === 'themepark' || b.category === 'kids_cafe')) scoreB += 20;

      if (preference === 'nature' && a.category === 'nature_farm') scoreA += 20;
      if (preference === 'nature' && b.category === 'nature_farm') scoreB += 20;

      return scoreB - scoreA;
    });

    return filtered.slice(0, 3);
  }, [places, selectedAge, selectedWeather, selectedRegion, preference]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 text-slate-800 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            오늘 뭐하지? 3초 맞춤 추천
          </h2>
        </div>
        <p className="text-xs text-slate-700 mb-6">
          아이 나이와 오늘 날씨, 선호하는 테마를 고르면 딱 맞는 최적의 나들이 장소를 찾아드려요!
        </p>

        {/* Form Controls */}
        <div className="space-y-4">
          {/* Step 1: Age */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              1. 아이 연령대는 어떻게 되나요?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'baby', label: '👶 0~3세 영유아' },
                { id: 'toddler', label: '🧒 4~7세 유아' },
                { id: 'elementary', label: '🎒 8세+ 초등생' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedAge(opt.id as typeof selectedAge)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    selectedAge === opt.id
                      ? 'bg-pink-500 border-pink-500 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Weather & Environment */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              2. 오늘 날씨 / 실내외 환경은요?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'indoor', label: '🌧️ 비/미세먼지 (실내)' },
                { id: 'outdoor', label: '☀️ 맑은 날씨 (야외)' },
                { id: 'any', label: '🌈 상관없음' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedWeather(opt.id as typeof selectedWeather)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    selectedWeather === opt.id
                      ? 'bg-pink-500 border-pink-500 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Preference & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                3. 오늘 당기는 놀이 테마는?
              </label>
              <select
                value={preference}
                onChange={(e) => setPreference(e.target.value as typeof preference)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
              >
                <option value="science">🚀 직접 만지는 과학관/체험관</option>
                <option value="animal">🐬 신기한 동물원/아쿠아리움</option>
                <option value="park">🎢 신나는 놀이공원/키즈파크</option>
                <option value="nature">🐑 탁 트인 자연/동물먹이주기</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                4. 희망 지역을 선택해주세요
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as RegionId)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.badge} {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-pink-600" />
              추천 결과 (TOP {recommendations.length})
            </h3>
            <span className="text-[11px] text-slate-700 font-medium">클릭 시 상세페이지 이동</span>
          </div>

          {recommendations.length === 0 ? (
            <div className="py-8 text-center text-slate-600 text-xs">
              선택한 조건에 맞는 장소가 없습니다. 지역을 '전국 전체'로 변경해 보세요!
            </div>
          ) : (
            <div className="space-y-2.5">
              {recommendations.map((rec, i) => (
                <div
                  key={rec.id}
                  onClick={() => {
                    onSelectPlace(rec);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-pink-50/60 border border-slate-200/80 hover:border-pink-300 transition-all cursor-pointer group"
                >
                  <span className="w-6 h-6 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-pink-600 truncate">
                        {rec.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
                        {rec.regionName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {rec.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-amber-700 flex-wrap">
                      <span className="font-bold">★ {rec.rating.toFixed(1)}</span>
                      <span>•</span>
                      <span className="text-pink-700 font-bold">⏱️ {rec.estimatedTime}</span>
                      <span>•</span>
                      <span className="text-slate-600">{rec.activityLabel}</span>
                      <span>•</span>
                      <span className="text-slate-600">{rec.priceInfo.split('/')[0]}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

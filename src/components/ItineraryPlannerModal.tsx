import React, { useState } from 'react';
import {
  X,
  Calendar,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Square,
  Printer,
  Sparkles,
  MapPin,
  ExternalLink,
  Plus,
  Navigation,
  Car,
  Bus,
  Footprints,
  Map as MapIcon,
  ArrowRight
} from 'lucide-react';
import { Place } from '../types';

interface ItineraryPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  itineraryIds: string[];
  places: Place[];
  onRemoveFromItinerary: (id: string) => void;
  onReorder: (newIds: string[]) => void;
  onOpenPlaceDetail: (place: Place) => void;
}

const DEFAULT_CHECKLIST = [
  { id: 'item-1', text: '물티슈 & 손소독제', checked: true },
  { id: 'item-2', text: '아이 여벌옷 1~2벌 & 양말', checked: true },
  { id: 'item-3', text: '간식, 물통, 이유식(보온병)', checked: true },
  { id: 'item-4', text: '휴대용 유모차 또는 아기띠', checked: false },
  { id: 'item-5', text: '휴대폰 보조배터리', checked: true },
  { id: 'item-6', text: '돗자리 & 접이식 의자', checked: false },
  { id: 'item-7', text: '상비약 (해열제, 밴드, 모기기피제)', checked: false },
  { id: 'item-8', text: '자외선 차단 모자 & 아기 선크림', checked: false },
];

export const ItineraryPlannerModal: React.FC<ItineraryPlannerModalProps> = ({
  isOpen,
  onClose,
  itineraryIds,
  places,
  onRemoveFromItinerary,
  onReorder,
  onOpenPlaceDetail,
}) => {
  if (!isOpen) return null;

  const [memos, setMemos] = useState<Record<string, string>>({});
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [travelMode, setTravelMode] = useState<'driving' | 'transit' | 'walking'>('driving');
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [selectedPreviewIdx, setSelectedPreviewIdx] = useState(0);

  const itineraryPlaces = itineraryIds
    .map((id) => places.find((p) => p.id === id))
    .filter((p): p is Place => Boolean(p));

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= itineraryIds.length) return;

    const updated = [...itineraryIds];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onReorder(updated);
  };

  const handleToggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddCheckItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, text: newCheckItem.trim(), checked: false },
    ]);
    setNewCheckItem('');
  };

  const handlePrint = () => {
    window.print();
  };

  // Google Maps Full Course Multi-Stop Directions URL generator
  const getGoogleMapsFullRouteUrl = () => {
    if (itineraryPlaces.length === 0) return '';
    if (itineraryPlaces.length === 1) {
      const q = encodeURIComponent(`${itineraryPlaces[0].name} ${itineraryPlaces[0].address}`);
      return `https://www.google.com/maps/search/?api=1&query=${q}`;
    }
    const origin = encodeURIComponent(itineraryPlaces[0].address || itineraryPlaces[0].name);
    const destination = encodeURIComponent(
      itineraryPlaces[itineraryPlaces.length - 1].address || itineraryPlaces[itineraryPlaces.length - 1].name
    );
    const waypoints = itineraryPlaces
      .slice(1, -1)
      .map((p) => encodeURIComponent(p.address || p.name))
      .join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }
    return url;
  };

  // Leg-by-leg Directions URL
  const getLegRouteUrl = (from: Place, to: Place, mode: 'driving' | 'transit' = 'driving') => {
    const origin = encodeURIComponent(from.address || from.name);
    const destination = encodeURIComponent(to.address || to.name);
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
  };

  // Single place location on Google Maps
  const getPlaceMapUrl = (place: Place) => {
    const query = encodeURIComponent(`${place.name} ${place.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const previewPlace = itineraryPlaces[selectedPreviewIdx] || itineraryPlaces[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-800 break-keep"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 break-keep">
                우리 가족 당일치기 나들이 코스
              </h2>
              <p className="text-xs text-slate-600 break-keep">
                선택한 장소들로 맞춤 하루 동선을 만들고 구글 지도 경로를 탐색해 보세요
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Places Course */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>📍 방문 코스 순서 ({itineraryPlaces.length}곳)</span>
              </h3>
              <span className="text-[11px] text-slate-700">▲▼ 버튼으로 순서를 바꿀 수 있습니다</span>
            </div>

            {/* Google Maps Route Finding Banner */}
            {itineraryPlaces.length > 0 && (
              <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md border border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-700/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-white">
                          Google 지도 전체 동선 경로 찾기
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/30 text-pink-300 border border-pink-500/40">
                          {itineraryPlaces.length}개 코스 연결
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {itineraryPlaces.length >= 2
                          ? `${itineraryPlaces[0].name}부터 ${itineraryPlaces[itineraryPlaces.length - 1].name}까지 최적 이동 경로`
                          : `${itineraryPlaces[0].name} 위치 및 상세 경로`}
                      </p>
                    </div>
                  </div>

                  {/* Travel Mode Selector */}
                  <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700 w-fit">
                    <button
                      type="button"
                      onClick={() => setTravelMode('driving')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        travelMode === 'driving'
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>자동차</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTravelMode('transit')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        travelMode === 'transit'
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Bus className="w-3.5 h-3.5" />
                      <span>대중교통</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTravelMode('walking')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        travelMode === 'walking'
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Footprints className="w-3.5 h-3.5" />
                      <span>도보</span>
                    </button>
                  </div>
                </div>

                {/* Route Button & Preview Toggle */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <a
                    href={getGoogleMapsFullRouteUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl transition-all shadow-md active:scale-98 text-center"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Google 지도에서 전체 코스 경로 및 소요시간 보기</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowMapPreview((prev) => !prev)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all"
                  >
                    <MapIcon className="w-3.5 h-3.5 text-pink-400" />
                    <span>{showMapPreview ? '지도 접기' : '지도 미리보기'}</span>
                  </button>
                </div>

                {/* Inline Google Maps Preview Panel */}
                {showMapPreview && previewPlace && (
                  <div className="mt-4 pt-4 border-t border-slate-700/80">
                    <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
                      <span className="text-[11px] text-slate-300 shrink-0 font-bold">확인할 코스:</span>
                      {itineraryPlaces.map((p, idx) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPreviewIdx(idx)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                            selectedPreviewIdx === idx
                              ? 'bg-pink-500 text-white'
                              : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          {idx + 1}. {p.name}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-700 relative bg-slate-950 h-56 sm:h-64">
                      <iframe
                        title="Google Maps Location Preview"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(previewPlace.address || previewPlace.name)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate">📍 {previewPlace.name} ({previewPlace.address})</span>
                      <a
                        href={getPlaceMapUrl(previewPlace)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-pink-400 hover:text-pink-300 font-bold shrink-0 flex items-center gap-1"
                      >
                        구글맵에서 크게 보기 <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {itineraryPlaces.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  아직 코스에 담긴 장소가 없습니다.
                </p>
                <p className="text-[11px] text-slate-700">
                  메인 목록에서 마음에 드는 명소의 <strong>[+ 코스 담기]</strong> 버튼을 눌러보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {itineraryPlaces.map((place, index) => {
                  const nextPlace = itineraryPlaces[index + 1];
                  return (
                    <React.Fragment key={place.id}>
                      <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-2.5">
                        <div className="flex items-center gap-3">
                          {/* Course Number Badge */}
                          <span className="w-7 h-7 rounded-xl bg-pink-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>

                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 cursor-pointer"
                            onClick={() => onOpenPlaceDetail(place)}
                          />

                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => onOpenPlaceDetail(place)}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 truncate hover:text-pink-600">
                                {place.name}
                              </h4>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {place.regionName}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-100 text-pink-800 font-medium">
                                ⏱️ {place.estimatedTime}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 truncate mt-0.5">
                              {place.summary}
                            </p>
                          </div>

                          {/* Reorder & Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              disabled={index === 0}
                              onClick={() => handleMove(index, 'up')}
                              className="p-1 text-slate-600 hover:text-slate-800 disabled:opacity-30 rounded-md hover:bg-slate-100"
                              title="위로 이동"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              disabled={index === itineraryPlaces.length - 1}
                              onClick={() => handleMove(index, 'down')}
                              className="p-1 text-slate-600 hover:text-slate-800 disabled:opacity-30 rounded-md hover:bg-slate-100"
                              title="아래로 이동"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemoveFromItinerary(place.id)}
                              className="p-1 text-slate-600 hover:text-rose-600 rounded-md hover:bg-rose-50 ml-1"
                              title="제거"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Pro-Tip Highlight */}
                        {place.parentTips.length > 0 && (
                          <div className="text-[11px] text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="truncate">
                              <strong>관람 팁:</strong> {place.parentTips[0]}
                            </span>
                          </div>
                        )}

                        {/* Location & Google Map Link for Individual Place */}
                        <div className="flex items-center justify-between pt-0.5 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1 truncate max-w-sm">
                            <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            <span className="truncate">{place.address}</span>
                          </div>
                          <a
                            href={getPlaceMapUrl(place)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-pink-600 hover:text-pink-700 font-bold shrink-0 flex items-center gap-1 ml-2"
                          >
                            구글맵 위치 <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        {/* Memo Input */}
                        <div className="pt-1">
                          <input
                            type="text"
                            value={memos[place.id] || ''}
                            onChange={(e) =>
                              setMemos((prev) => ({ ...prev, [place.id]: e.target.value }))
                            }
                            placeholder="메모를 입력하세요 (예: 10시 오픈런 도착, 주변 돈까스 맛집 가기)"
                            className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:border-pink-500 placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      {/* Leg Connector between index and index+1 */}
                      {nextPlace && (
                        <div className="relative py-1 flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-dashed border-pink-300/80" />
                          </div>
                          <div className="relative bg-pink-50/95 border border-pink-200 text-pink-900 px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs flex items-center gap-2 backdrop-blur-xs">
                            <div className="flex items-center gap-1">
                              <span className="w-4 h-4 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center">
                                {index + 1}
                              </span>
                              <ArrowRight className="w-3 h-3 text-pink-500" />
                              <span className="w-4 h-4 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center">
                                {index + 2}
                              </span>
                            </div>
                            <span className="text-slate-600 font-medium">구간 길찾기:</span>
                            <a
                              href={getLegRouteUrl(place, nextPlace, 'driving')}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-0.5 text-pink-700 hover:text-pink-900 font-bold underline hover:no-underline"
                            >
                              <Car className="w-3 h-3" /> 자동차
                            </a>
                            <span>|</span>
                            <a
                              href={getLegRouteUrl(place, nextPlace, 'transit')}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-0.5 text-pink-700 hover:text-pink-900 font-bold underline hover:no-underline"
                            >
                              <Bus className="w-3 h-3" /> 대중교통
                            </a>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Family Packing Checklist */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <span>🎒 아이 동반 필수 준비물 체크리스트</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                    item.checked
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 line-through opacity-80'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <span className="truncate">{item.text}</span>
                </button>
              ))}
            </div>

            {/* Add custom checklist item */}
            <form onSubmit={handleAddCheckItem} className="mt-3 flex gap-2">
              <input
                type="text"
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                placeholder="준비물 직접 추가 (예: 비눗방울, 휴대용 변기커버)..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:border-pink-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> 추가
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-4 h-4" /> 계획표 인쇄/PDF 저장
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-colors shadow-xs"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

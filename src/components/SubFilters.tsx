import React from 'react';
import { CloudRain, Sun, Baby, Check, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { FilterState, EnvironmentType, AgeGroupType } from '../types';

interface SubFiltersProps {
  filter: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalFiltered: number;
}

export const SubFilters: React.FC<SubFiltersProps> = ({
  filter,
  onChange,
  onReset,
  totalFiltered,
}) => {
  const isAnyFilterActive =
    filter.environment !== 'all' ||
    filter.activityType !== 'all' ||
    filter.category !== 'all' ||
    filter.ageGroup !== 'all' ||
    filter.freeOnly ||
    filter.strollerOnly ||
    filter.nursingRoomOnly ||
    filter.parkingOnly;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Top: Weather (Indoor/Outdoor) & Age pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Weather / Environment filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-700 px-2 flex items-center gap-1 shrink-0">
              날씨:
            </span>
            <button
              id="filter-env-all"
              onClick={() => onChange({ environment: 'all' })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filter.environment === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              날씨 전체
            </button>
            <button
              id="filter-env-indoor"
              onClick={() => onChange({ environment: 'indoor' })}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filter.environment === 'indoor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-600'
              }`}
              title="비오거나 미세먼지 심한 날 안심하고 갈 수 있는 실내 시설"
            >
              <CloudRain className="w-3.5 h-3.5" />
              실내 (비오는 날)
            </button>
            <button
              id="filter-env-outdoor"
              onClick={() => onChange({ environment: 'outdoor' })}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filter.environment === 'outdoor'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-600'
              }`}
              title="화창한 날 돗자리 펴고 뛰어놀기 좋은 야외 명소"
            >
              <Sun className="w-3.5 h-3.5" />
              실외 (야외 나들이)
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Age selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-600 px-2 flex items-center gap-1">
              <Baby className="w-3.5 h-3.5" />
              연령:
            </span>
            {(
              [
                { id: 'all', label: '전연령' },
                { id: 'baby', label: '0~3세 영유아' },
                { id: 'toddler', label: '4~7세 유아' },
                { id: 'elementary', label: '8세+ 초등' },
              ] as { id: AgeGroupType; label: string }[]
            ).map((age) => (
              <button
                key={age.id}
                id={`filter-age-${age.id}`}
                onClick={() => onChange({ ageGroup: age.id })}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  filter.ageGroup === age.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sort By & Reset */}
        <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <select
              id="sort-select"
              value={filter.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-pink-500 cursor-pointer"
            >
              <option value="popular">추천순</option>
              <option value="rating">평점 높은 순</option>
              <option value="reviews">리뷰 많은 순</option>
              <option value="name">가나다순</option>
            </select>
          </div>

          {isAnyFilterActive && (
            <button
              id="reset-filter-btn"
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-rose-600 transition-colors font-medium px-2 py-1 rounded-md hover:bg-rose-50"
            >
              <RotateCcw className="w-3 h-3" />
              필터 초기화
            </button>
          )}
        </div>
      </div>

      {/* Parental Conveniences Checklist */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-700 mr-1">부모 필수 편의:</span>

        {/* Free only */}
        <button
          id="toggle-free-only"
          onClick={() => onChange({ freeOnly: !filter.freeOnly })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            filter.freeOnly
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
            filter.freeOnly ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
          }`}>
            <Check className="w-2.5 h-2.5" />
          </span>
          무료 입장만
        </button>

        {/* Nursing Room */}
        <button
          id="toggle-nursing-only"
          onClick={() => onChange({ nursingRoomOnly: !filter.nursingRoomOnly })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            filter.nursingRoomOnly
              ? 'bg-pink-50 text-pink-700 border-pink-300'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
            filter.nursingRoomOnly ? 'bg-pink-600 text-white' : 'bg-slate-200 text-transparent'
          }`}>
            <Check className="w-2.5 h-2.5" />
          </span>
          수유실 완비
        </button>

        {/* Stroller Rental / Friendly */}
        <button
          id="toggle-stroller-only"
          onClick={() => onChange({ strollerOnly: !filter.strollerOnly })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            filter.strollerOnly
              ? 'bg-pink-50 text-pink-700 border-pink-300'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
            filter.strollerOnly ? 'bg-pink-600 text-white' : 'bg-slate-200 text-transparent'
          }`}>
            <Check className="w-2.5 h-2.5" />
          </span>
          유모차 대여/편의
        </button>

        {/* Parking */}
        <button
          id="toggle-parking-only"
          onClick={() => onChange({ parkingOnly: !filter.parkingOnly })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            filter.parkingOnly
              ? 'bg-blue-50 text-blue-700 border-blue-300'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
            filter.parkingOnly ? 'bg-blue-600 text-white' : 'bg-slate-200 text-transparent'
          }`}>
            <Check className="w-2.5 h-2.5" />
          </span>
          전용 주차장
        </button>

        <span className="ml-auto text-xs text-slate-600 font-medium">
          검색 결과 <strong className="text-pink-600 font-bold">{totalFiltered}</strong>곳
        </span>
      </div>
    </div>
  );
};

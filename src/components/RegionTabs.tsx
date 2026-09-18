import React from 'react';
import { REGIONS } from '../data/places';
import { RegionId } from '../types';

interface RegionTabsProps {
  selectedRegion: RegionId;
  onSelectRegion: (region: RegionId) => void;
  placesCountByRegion: Record<RegionId, number>;
}

export const RegionTabs: React.FC<RegionTabsProps> = ({
  selectedRegion,
  onSelectRegion,
  placesCountByRegion,
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded">
              REGION SELECTION
            </span>
            <h2 className="text-sm font-semibold text-slate-800">
              어디로 떠나시나요? 지역을 선택해 보세요
            </h2>
          </div>
          <span className="text-xs text-slate-700 hidden sm:inline">
            총 {placesCountByRegion['all']}개 검증된 놀거리
          </span>
        </div>

        {/* Scrollable pill container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {REGIONS.map((region) => {
            const isSelected = selectedRegion === region.id;
            const count = placesCountByRegion[region.id] || 0;

            return (
              <button
                key={region.id}
                id={`region-tab-${region.id}`}
                onClick={() => onSelectRegion(region.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200/90'
                }`}
              >
                <span className="text-base leading-none">{region.badge}</span>
                <span className="font-semibold">{region.shortName}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isSelected
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 group-hover:bg-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ACTIVITY_TYPES } from '../data/places';
import { ActivityType } from '../types';

interface ActivityTypeFilterProps {
  selectedActivity: ActivityType;
  onSelectActivity: (activity: ActivityType) => void;
  placesCountByActivity: Record<ActivityType, number>;
}

export const ActivityTypeFilter: React.FC<ActivityTypeFilterProps> = ({
  selectedActivity,
  onSelectActivity,
  placesCountByActivity,
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-800 hidden sm:inline-block">
              활동 유형:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            {ACTIVITY_TYPES.map((act) => {
              const isSelected = selectedActivity === act.id;
              const count = placesCountByActivity[act.id] ?? 0;

              return (
                <button
                  key={act.id}
                  id={`activity-btn-${act.id}`}
                  onClick={() => onSelectActivity(act.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 border active:scale-95 ${
                    isSelected
                      ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-700 border-slate-200'
                  }`}
                  title={act.description}
                >
                  <span className="text-sm">{act.icon}</span>
                  <span>{act.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isSelected ? 'bg-pink-700/80 text-white' : 'bg-slate-200/80 text-slate-600'
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
    </div>
  );
};

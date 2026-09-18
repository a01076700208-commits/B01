import React, { useState, useEffect, useMemo } from 'react';
import { PLACES, REGIONS, CATEGORIES, ACTIVITY_TYPES } from './data/places';
import { Place, FilterState, RegionId, CategoryType, ActivityType } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { RegionTabs } from './components/RegionTabs';
import { ActivityTypeFilter } from './components/ActivityTypeFilter';
import { CategoryFilter } from './components/CategoryFilter';
import { SubFilters } from './components/SubFilters';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { SmartRecommenderModal } from './components/SmartRecommenderModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ItineraryPlannerModal } from './components/ItineraryPlannerModal';
import { VideoShortsModal } from './components/VideoShortsModal';
import { MapPin, Compass, Search, RotateCcw, Heart, Calendar, CloudRain, Sun, Clock, Filter } from 'lucide-react';

const INITIAL_FILTER: FilterState = {
  region: 'all',
  activityType: 'all',
  category: 'all',
  environment: 'all',
  ageGroup: 'all',
  freeOnly: false,
  strollerOnly: false,
  nursingRoomOnly: false,
  parkingOnly: false,
  searchQuery: '',
  sortBy: 'popular',
};

export default function App() {
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kids_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [itinerary, setItinerary] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kids_itinerary');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedDetailPlace, setSelectedDetailPlace] = useState<Place | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [isShortsModalOpen, setIsShortsModalOpen] = useState(false);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kids_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore storage errors
    }
  }, [favorites]);

  // Sync itinerary with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kids_itinerary', JSON.stringify(itinerary));
    } catch {
      // Ignore storage errors
    }
  }, [itinerary]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleItinerary = (id: string) => {
    setItinerary((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilter = () => {
    setFilter((prev) => ({
      ...INITIAL_FILTER,
      region: prev.region, // Keep active region
    }));
  };

  // Pre-calculate region counts
  const placesCountByRegion = useMemo(() => {
    const counts: Record<RegionId, number> = {
      all: PLACES.length,
      seoul: 0,
      gyeonggi_incheon: 0,
      gangwon: 0,
      chungcheong: 0,
      gyeongsang: 0,
      jeolla: 0,
      jeju: 0,
    };
    PLACES.forEach((p) => {
      counts[p.region] = (counts[p.region] || 0) + 1;
    });
    return counts;
  }, []);

  // Pre-calculate activity type counts within the selected region
  const placesCountByActivity = useMemo(() => {
    const counts: Record<ActivityType, number> = {
      all: 0,
      experience: 0,
      nature: 0,
      culture: 0,
      education: 0,
    };
    const inRegion = filter.region === 'all'
      ? PLACES
      : PLACES.filter((p) => p.region === filter.region);

    counts.all = inRegion.length;
    inRegion.forEach((p) => {
      counts[p.activityType] = (counts[p.activityType] || 0) + 1;
    });
    return counts;
  }, [filter.region]);

  // Pre-calculate category counts within the selected region
  const placesCountByCategory = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      all: 0,
      science_museum: 0,
      themepark: 0,
      zoo_aquarium: 0,
      nature_farm: 0,
      kids_cafe: 0,
      art_culture: 0,
    };

    const inRegion = filter.region === 'all'
      ? PLACES
      : PLACES.filter((p) => p.region === filter.region);

    counts.all = inRegion.length;
    inRegion.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return counts;
  }, [filter.region]);

  // Filtered & Sorted Places
  const filteredPlaces = useMemo(() => {
    return PLACES.filter((place) => {
      // 1. Region filter
      if (filter.region !== 'all' && place.region !== filter.region) {
        return false;
      }

      // 2. Activity Type filter (체험/자연/문화/교육 등)
      if (filter.activityType !== 'all' && place.activityType !== filter.activityType) {
        return false;
      }

      // 3. Category filter
      if (filter.category !== 'all' && place.category !== filter.category) {
        return false;
      }

      // 4. Weather / Environment filter (실내/실외)
      if (filter.environment === 'indoor' && place.environment === 'outdoor') return false;
      if (filter.environment === 'outdoor' && place.environment === 'indoor') return false;

      // 5. Age filter
      if (filter.ageGroup === 'baby') {
        const hasBaby = place.targetAges.some((a) => a.includes('0~3세') || a.includes('영유아'));
        if (!hasBaby) return false;
      } else if (filter.ageGroup === 'toddler') {
        const hasToddler = place.targetAges.some((a) => a.includes('유아') || a.includes('4~7세'));
        if (!hasToddler) return false;
      } else if (filter.ageGroup === 'elementary') {
        const hasElem = place.targetAges.some((a) => a.includes('초등'));
        if (!hasElem) return false;
      }

      // 6. Parental conveniences
      if (filter.freeOnly && !place.isFree) return false;
      if (filter.nursingRoomOnly && !place.facilities.nursingRoom) return false;
      if (filter.strollerOnly && !(place.facilities.strollerFriendly || place.facilities.strollerRental)) return false;
      if (filter.parkingOnly && !place.facilities.parking) return false;

      // 7. Search Query
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.trim().toLowerCase();
        const matchesName = place.name.toLowerCase().includes(q);
        const matchesRegion = place.regionName.toLowerCase().includes(q);
        const matchesSummary = place.summary.toLowerCase().includes(q);
        const matchesTips = place.parentTips.some((tip) => tip.toLowerCase().includes(q));
        const matchesTags = place.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesCategory = place.categoryLabel.toLowerCase().includes(q);
        const matchesActivity = place.activityLabel.toLowerCase().includes(q);

        // Special semantic matches
        const matchesFreeQuery = (q.includes('무료') || q.includes('공짜')) && place.isFree;
        const matchesIndoorQuery = (q.includes('비오는') || q.includes('실내')) && place.environment !== 'outdoor';
        const matchesOutdoorQuery = (q.includes('야외') || q.includes('실외') || q.includes('공원')) && place.environment !== 'indoor';
        const matchesAnimalQuery = (q.includes('동물') || q.includes('물고기') || q.includes('수족관')) &&
          (place.category === 'zoo_aquarium' || place.tags.some(t => t.includes('동물')));

        if (
          !matchesName &&
          !matchesRegion &&
          !matchesSummary &&
          !matchesTips &&
          !matchesTags &&
          !matchesCategory &&
          !matchesActivity &&
          !matchesFreeQuery &&
          !matchesIndoorQuery &&
          !matchesOutdoorQuery &&
          !matchesAnimalQuery
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filter.sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      if (filter.sortBy === 'name') {
        return a.name.localeCompare(b.name, 'ko');
      }
      // 'popular' default: composite score of rating & reviewCount
      const scoreA = a.rating * Math.log10(a.reviewCount + 10);
      const scoreB = b.rating * Math.log10(b.reviewCount + 10);
      return scoreB - scoreA;
    });
  }, [filter]);

  const activeRegionObj = REGIONS.find((r) => r.id === filter.region) || REGIONS[0];
  const activeActivityObj = ACTIVITY_TYPES.find((a) => a.id === filter.activityType);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header with Search & Quick Navigation */}
      <Header
        filter={filter}
        onSearchChange={(query) => handleFilterChange({ searchQuery: query })}
        favoritesCount={favorites.length}
        itineraryCount={itinerary.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenItinerary={() => setIsItineraryOpen(true)}
        onOpenRecommender={() => setIsRecommenderOpen(true)}
      />

      {/* Hero Banner with trending keywords */}
      <HeroBanner
        currentRegionName={activeRegionObj.name}
        onQuickSearch={(query) => {
          if (query === '비오는날') {
            handleFilterChange({ environment: 'indoor', searchQuery: '' });
          } else if (query === '무료') {
            handleFilterChange({ freeOnly: true, searchQuery: '' });
          } else {
            handleFilterChange({ searchQuery: query });
          }
        }}
        onOpenRecommender={() => setIsRecommenderOpen(true)}
        onOpenShorts={() => setIsShortsModalOpen(true)}
      />

      {/* Regional Selector Tabs: 사용자가 지역을 선택하면 해당 지역의 인기 명소 목록 표시 */}
      <RegionTabs
        selectedRegion={filter.region}
        onSelectRegion={(region) => handleFilterChange({ region })}
        placesCountByRegion={placesCountByRegion}
      />

      {/* Activity Type Filter: 활동 유형(체험/자연/문화/교육 등)별 놀거리 필터링 */}
      <ActivityTypeFilter
        selectedActivity={filter.activityType}
        onSelectActivity={(activityType) => handleFilterChange({ activityType })}
        placesCountByActivity={placesCountByActivity}
      />

      {/* Category Pills */}
      <CategoryFilter
        selectedCategory={filter.category}
        onSelectCategory={(category) => handleFilterChange({ category })}
        placesCountByCategory={placesCountByCategory}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Active Region & Criteria Banner */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs break-keep">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{activeRegionObj.badge}</span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 break-keep">
              {activeRegionObj.name} 아이와 가기 좋은 인기 명소
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-bold whitespace-nowrap">
              {filteredPlaces.length}곳 추천
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 flex-wrap break-keep">
            {filter.environment !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium whitespace-nowrap">
                {filter.environment === 'indoor' ? <CloudRain className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                {filter.environment === 'indoor' ? '실내' : '실외'}
              </span>
            )}
            {filter.activityType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium whitespace-nowrap">
                {activeActivityObj?.icon} {activeActivityObj?.label}
              </span>
            )}
            <span className="text-[11px] text-slate-700 whitespace-nowrap">⏱️ 각 장소별 예상 소요 시간 포함</span>
          </div>
        </div>

        {/* SubFilters: Weather (실내/실외), Age Group, Facilities Toggles, Sort */}
        <SubFilters
          filter={filter}
          onChange={handleFilterChange}
          onReset={handleResetFilter}
          totalFiltered={filteredPlaces.length}
        />

        {/* Places Grid: 이름, 간단한 설명, 예상 소요 시간 포함 */}
        {filteredPlaces.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs max-w-lg mx-auto p-8 break-keep">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5 break-keep">
              선택한 조건에 맞는 놀거리가 없습니다
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed mb-5 break-keep">
              날씨(실내/실외)나 활동 유형(체험/자연/문화/교육) 조건을 조정하거나,
              다른 지역을 선택해 보세요.
            </p>
            <button
              onClick={handleResetFilter}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              필터 초기화하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isFavorite={favorites.includes(place.id)}
                isInItinerary={itinerary.includes(place.id)}
                onToggleFavorite={handleToggleFavorite}
                onToggleItinerary={handleToggleItinerary}
                onOpenDetail={(p) => setSelectedDetailPlace(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black text-xs">
                아이
              </div>
              <span className="font-extrabold text-sm text-slate-900">
                아이랑 노는날
              </span>
              <span className="text-slate-600">| 대한민국 전국 지역별 키즈 나들이 가이드</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setIsFavoritesOpen(true)}
                className="hover:text-pink-600 transition-colors"
              >
                찜한 장소 ({favorites.length})
              </button>
              <span>•</span>
              <button
                onClick={() => setIsItineraryOpen(true)}
                className="hover:text-pink-600 transition-colors"
              >
                당일치기 코스 ({itinerary.length})
              </button>
              <span>•</span>
              <button
                onClick={() => setIsRecommenderOpen(true)}
                className="hover:text-pink-600 transition-colors text-pink-600 font-bold"
              >
                오늘 뭐하지? 맞춤 추천
              </button>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-600 text-center md:text-left leading-relaxed">
            ※ 관람 시간, 입장 요금 및 휴관일은 시설 측의 사정에 따라 변동될 수 있으므로 방문 전 공식 누리집 또는 유선 연락을 통해 다시 한번 확인하시기 바랍니다.
          </p>
        </div>
      </footer>

      {/* Detail Modal */}
      <PlaceDetailModal
        place={selectedDetailPlace}
        onClose={() => setSelectedDetailPlace(null)}
        isFavorite={selectedDetailPlace ? favorites.includes(selectedDetailPlace.id) : false}
        isInItinerary={selectedDetailPlace ? itinerary.includes(selectedDetailPlace.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onToggleItinerary={handleToggleItinerary}
      />

      {/* Smart Recommender Modal */}
      {isRecommenderOpen && (
        <SmartRecommenderModal
          places={PLACES}
          onClose={() => setIsRecommenderOpen(false)}
          onSelectPlace={(place) => setSelectedDetailPlace(place)}
        />
      )}

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        places={PLACES}
        onRemoveFavorite={handleToggleFavorite}
        onSelectPlace={(place) => setSelectedDetailPlace(place)}
        onClearAll={() => setFavorites([])}
      />

      {/* Itinerary Planner Modal */}
      <ItineraryPlannerModal
        isOpen={isItineraryOpen}
        onClose={() => setIsItineraryOpen(false)}
        itineraryIds={itinerary}
        places={PLACES}
        onRemoveFromItinerary={handleToggleItinerary}
        onReorder={(newIds) => setItinerary(newIds)}
        onOpenPlaceDetail={(place) => setSelectedDetailPlace(place)}
      />

      {/* Recommended YouTube Shorts Modal */}
      <VideoShortsModal
        isOpen={isShortsModalOpen}
        onClose={() => setIsShortsModalOpen(false)}
        videoUrl="https://youtube.com/shorts/v-01_IurmLQ?si=Spqwnu7hwJo-C1e4"
        videoId="v-01_IurmLQ"
        title="아이와 가기 좋은 실내 명소 베스트! 서울대공원 원더파크 과천"
        targetPlace={PLACES.find((p) => p.id === 'gwacheon-wonder-park')}
        onOpenPlaceDetail={(place) => setSelectedDetailPlace(place)}
      />
    </div>
  );
}

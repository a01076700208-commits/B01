export type RegionId =
  | 'all'
  | 'seoul'
  | 'gyeonggi_incheon'
  | 'gangwon'
  | 'chungcheong'
  | 'gyeongsang'
  | 'jeolla'
  | 'jeju';

export type ActivityType = 'all' | 'experience' | 'nature' | 'culture' | 'education';

export type CategoryType =
  | 'all'
  | 'science_museum'
  | 'themepark'
  | 'zoo_aquarium'
  | 'nature_farm'
  | 'kids_cafe'
  | 'art_culture';

export type EnvironmentType = 'all' | 'indoor' | 'outdoor' | 'both';

export type AgeGroupType = 'all' | 'baby' | 'toddler' | 'elementary';

export interface PlaceFacilities {
  nursingRoom: boolean; // 수유실
  strollerRental: boolean; // 유모차 대여
  strollerFriendly: boolean; // 유모차 이동 용이
  parking: boolean; // 주차 가능
  restaurant: boolean; // 식당/카페테리아
  restArea: boolean; // 휴게 쉼터
  picnicAllowed: boolean; // 돗자리/도시락 가능
  wheelchairAccessible: boolean; // 배리어프리
}

export interface Place {
  id: string;
  name: string;
  region: RegionId;
  regionName: string; // e.g. "서울 종로구", "경기 과천시"
  category: CategoryType;
  categoryLabel: string;
  activityType: 'experience' | 'nature' | 'culture' | 'education';
  activityLabel: string; // '체험' | '자연' | '문화' | '교육'
  estimatedTime: string; // e.g. "약 2~3시간", "반나절 (3~4시간)", "종일 (5시간 이상)"
  summary: string;
  description: string;
  targetAges: string[]; // e.g. ['0~3세 영유아', '4~7세 유아']
  environment: 'indoor' | 'outdoor' | 'both';
  isFree: boolean;
  priceInfo: string;
  operatingHours: string;
  closedDays: string;
  address: string;
  contact: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  parentTips: string[];
  facilities: PlaceFacilities;
  tags: string[];
  mapSearchUrl: string;
  homepageUrl?: string;
  videoUrl?: string;
  videoEmbedId?: string;
  videoTitle?: string;
}

export interface FilterState {
  region: RegionId;
  activityType: ActivityType;
  category: CategoryType;
  environment: EnvironmentType;
  ageGroup: AgeGroupType;
  freeOnly: boolean;
  strollerOnly: boolean;
  nursingRoomOnly: boolean;
  parkingOnly: boolean;
  searchQuery: string;
  sortBy: 'popular' | 'rating' | 'reviews' | 'name';
}

export interface PlanItem {
  placeId: string;
  date: string;
  timeSlot?: string;
  memo?: string;
}

import React from 'react';
import { Sparkles, ShieldCheck, Heart, MapPin, Compass, CheckCircle2, Play } from 'lucide-react';
import heroIllustration from '../assets/images/kids_hero_picnic_1789709336143.jpg';

interface HeroBannerProps {
  onQuickSearch: (query: string) => void;
  onOpenRecommender: () => void;
  onOpenShorts?: () => void;
  currentRegionName: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onQuickSearch,
  onOpenRecommender,
  onOpenShorts,
  currentRegionName,
}) => {
  const trendingTags = [
    { label: '비오는날 실내', query: '비오는날' },
    { label: '입장료 무료', query: '무료' },
    { label: '동물 먹이주기', query: '먹이주기' },
    { label: '국립과학관', query: '과학관' },
    { label: '0~3세 영유아', query: '영유아' },
    { label: '유모차 산책', query: '유모차' },
    { label: '초등학생 추천', query: '초등' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-pink-50/90 via-rose-50/40 to-slate-50 border-b border-pink-100/70 pt-6 sm:pt-8 pb-8 sm:pb-10">
      {/* Decorative background blurs */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-12 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Heading, descriptions, and tags */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-pink-200 text-pink-700 text-xs font-bold shadow-2xs mb-4 w-fit backdrop-blur-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>
              <span>대한민국 전국 엄선 키즈 명소 & 엄마아빠 실전 팁</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] break-keep">
              이번 주말, 우리 아이와 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500">
                어디로 떠나볼까요?
              </span>
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl break-keep">
              서울, 경기, 강원, 충청, 경상, 전라, 제주까지! 날씨별 실내·외 구분과
              수유실·유모차 동선 등 육아 부모에게 꼭 필요한 핵심 정보만 정성껏 모았습니다.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <button
                onClick={onOpenRecommender}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-md shadow-pink-500/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>3초 맞춤 코스 찾기</span>
              </button>

              {onOpenShorts && (
                <button
                  type="button"
                  onClick={onOpenShorts}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>실시간 추천 숏츠 보기</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 border border-pink-100 text-xs font-semibold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>현재 탐색 지역: <strong className="text-pink-600 font-bold">{currentRegionName}</strong></span>
              </div>
            </div>

            {/* Quick Trending Keyword Pills */}
            <div className="mt-5 pt-4 border-t border-pink-100/80 flex items-center gap-1.5 flex-wrap break-keep">
              <span className="text-xs font-bold text-slate-700 mr-1 whitespace-nowrap">추천 검색:</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => onQuickSearch(tag.query)}
                  className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-pink-500 hover:text-white text-slate-700 rounded-full border border-slate-200/90 shadow-2xs transition-all active:scale-95 whitespace-nowrap break-keep"
                >
                  #{tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Cute Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Cute image card wrapper */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-pink-500/10 border-4 border-white bg-white group">
                <img
                  src={heroIllustration}
                  alt="아이와 함께 떠나는 행복한 주말 나들이"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-72 lg:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                {/* Floating badge inside image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-bold bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                    <span>전국 엄선 50+ 키즈 프렌들리 스팟</span>
                  </div>
                  <span className="text-[11px] bg-pink-500/90 text-white px-2 py-0.5 rounded-full">
                    실시간 업데이트
                  </span>
                </div>
              </div>

              {/* Floating feature card 1 (Top right) */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-pink-100 flex items-center gap-2 text-xs font-bold text-slate-800 animate-bounce-subtle">
                <div className="w-7 h-7 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="pr-1 text-left">
                  <div className="text-[10px] text-pink-600 leading-tight">안심 체크</div>
                  <div>수유실 & 유모차 완비</div>
                </div>
              </div>

              {/* Floating feature card 2 (Bottom left) */}
              <div className="hidden sm:flex absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-pink-100 items-center gap-2 text-xs font-bold text-slate-800">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="pr-1 text-left">
                  <div className="text-[10px] text-amber-700 leading-tight">날씨 걱정 끝</div>
                  <div>실내/실외 원클릭 분리</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

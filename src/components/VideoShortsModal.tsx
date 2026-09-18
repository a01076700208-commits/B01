import React from 'react';
import { X, ExternalLink, Play, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Place } from '../types';

interface VideoShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoId: string;
  title: string;
  targetPlace?: Place | null;
  onOpenPlaceDetail?: (place: Place) => void;
}

export const VideoShortsModal: React.FC<VideoShortsModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  videoId,
  title,
  targetPlace,
  onOpenPlaceDetail,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700 my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                  YouTube Shorts
                </span>
                <span className="text-[11px] text-slate-400">실시간 추천 숏폼</span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center">
          <div className="w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black relative">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Action links */}
          <div className="mt-4 w-full flex flex-col sm:flex-row items-center gap-2.5 justify-center">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <span>YouTube에서 직접 열기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {targetPlace && onOpenPlaceDetail && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPlaceDetail(targetPlace);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>{targetPlace.name} 상세 정보 보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Extra info footer */}
        {targetPlace && (
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate pr-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 truncate">
                📍 {targetPlace.name} · {targetPlace.regionName} ({targetPlace.summary})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { RotateCw, BookmarkPlus, BookmarkCheck, Sparkles, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Flashcard3D({
  verseData,
  isFlipped,
  onFlip,
  isSaved,
  savedStatus,
  onToggleSave,
  onPrevVerse,
  onNextVerse
}) {
  if (!verseData) return null;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
        aria-label="點擊翻轉經文字卡"
        className="w-full h-[54vh] min-h-[340px] max-h-[460px] perspective-1000 cursor-pointer select-none group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* 正面：中文和合本 (CUV) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/5 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 tracking-wide">
                  和合本 CUV
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {verseData.zhShortRef}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                點擊翻面看 NIV
              </span>
            </div>

            <div className="my-auto py-4 overflow-y-auto max-h-full flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600/80 mb-2 text-center">
                {verseData.zhRef}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed text-center tracking-wide">
                「{verseData.zhText}」
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{verseData.enRef}</span>
              <span className="font-medium text-indigo-600">正面 · 中文經文</span>
            </div>
          </div>

          {/* 背面：英文 NIV */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl shadow-indigo-950/20 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 tracking-wide">
                  NIV English
                </span>
                <span className="text-xs text-indigo-300/80 font-medium">
                  {verseData.zhRef}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-300 group-hover:text-white transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                點擊翻回中文
              </span>
            </div>

            <div className="my-auto py-4 overflow-y-auto max-h-full flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-2 text-center">
                {verseData.enRef}
              </p>
              <p className="text-lg sm:text-xl font-medium text-white/95 leading-relaxed text-center italic">
                “{verseData.enText}”
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300/80">
              <span>New International Version</span>
              <span className="font-medium text-indigo-200">背面 · 英文經文</span>
            </div>
          </div>
        </div>
      </div>

      {/* 下方操作列：上一節 / 加入卡牌庫 / 下一節 */}
      <div className="w-full flex items-center justify-between gap-2.5 mt-4">
        <button
          type="button"
          onClick={onPrevVerse}
          className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition flex items-center gap-1 text-xs font-semibold shadow-sm"
          title="上一節"
        >
          <ChevronLeft className="w-4 h-4" />
          上一節
        </button>

        <button
          type="button"
          onClick={onToggleSave}
          className={`flex-1 py-3 px-4 rounded-2xl font-semibold text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 shadow-md'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4" />
              <span>已加入卡牌庫 ({savedStatus === 'memorized' ? '已熟記' : '待複習'})</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              <span>加入卡牌庫</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onNextVerse}
          className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition flex items-center gap-1 text-xs font-semibold shadow-sm"
          title="下一節"
        >
          下一節
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

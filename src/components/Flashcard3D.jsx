import React from 'react';
import { RotateCw, BookmarkPlus, BookmarkCheck, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';

export default function Flashcard3D({
  verseData,
  enVersion = 'NKJV',
  isFlipped,
  onFlip,
  isSaved,
  savedStatus,
  onToggleSave,
  onPrevVerse,
  onNextVerse,
  prevLabel = '上一節',
  nextLabel = '下一節',
  quizHideText = false,
  quizRevealed = true,
  onRevealQuiz,
  onDeleteCard
}) {
  if (!verseData) return null;

  const activeEnText =
    enVersion === 'NKJV'
      ? verseData.nkjvText || verseData.enText || verseData.nivText
      : verseData.nivText || verseData.enText;

  const fullEnTitle =
    enVersion === 'NKJV'
      ? 'New King James Version (NKJV)'
      : 'New International Version (NIV)';

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div
        onClick={() => {
          if (!isFlipped && quizHideText && !quizRevealed && onRevealQuiz) {
            onRevealQuiz();
          } else {
            onFlip();
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isFlipped && quizHideText && !quizRevealed && onRevealQuiz) {
              onRevealQuiz();
            } else {
              onFlip();
            }
          }
        }}
        aria-label="點擊翻轉經文字卡"
        className="w-full h-[52vh] min-h-[330px] max-h-[450px] perspective-1000 cursor-pointer select-none group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* 正面：和合本 CUNP */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/5 p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  正面 · 和合本 CUNP
                </span>
                {savedStatus && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      savedStatus === 'memorized'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {savedStatus === 'memorized' ? '已熟記' : '待複習'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {onDeleteCard && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCard();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="從卡牌庫移除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50/70 px-2.5 py-1 rounded-full group-hover:bg-indigo-100 transition">
                  <RotateCw className="w-3.5 h-3.5" />
                  翻面看 {enVersion}
                </span>
              </div>
            </div>

            <div className="my-auto py-4 overflow-y-auto max-h-full flex flex-col items-center justify-center text-center">
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide">
                <span>{verseData.zhRef}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">{verseData.enRef}</span>
              </div>

              {quizHideText && !quizRevealed ? (
                <div className="w-full py-7 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:border-indigo-400 transition">
                  <Eye className="w-6 h-6 text-indigo-500" />
                  <p className="text-sm font-bold text-slate-700">請先在心中默背此節經文</p>
                  <p className="text-xs text-slate-400">
                    點擊字卡揭曉「和合本 CUNP」經文，或翻面背誦 {enVersion}
                  </p>
                </div>
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed text-center tracking-wide">
                  「{verseData.zhText}」
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{verseData.enRef} ({enVersion})</span>
              <span className="font-medium text-indigo-600">
                {quizHideText && !quizRevealed ? '點擊揭曉中文' : '點擊翻面看英文'}
              </span>
            </div>
          </div>

          {/* 背面：英文 NKJV / NIV */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl shadow-indigo-950/20 p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/25 text-indigo-100 border border-indigo-400/30">
                  背面 · {enVersion} 英文
                </span>
                <span className="text-xs text-indigo-300 font-medium">
                  {verseData.zhShortRef}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-200 bg-white/10 px-2.5 py-1 rounded-full group-hover:bg-white/20 transition">
                <RotateCw className="w-3.5 h-3.5" />
                翻回 CUNP
              </span>
            </div>

            <div className="my-auto py-4 overflow-y-auto max-h-full flex flex-col items-center justify-center text-center">
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-xs font-bold tracking-wide">
                <span>{verseData.enRef}</span>
                <span className="text-indigo-400/50">|</span>
                <span className="text-indigo-200 font-normal">{enVersion}</span>
              </div>
              <p className="text-lg sm:text-xl font-medium text-white/95 leading-relaxed text-center italic">
                “{activeEnText}”
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300/80">
              <span>{fullEnTitle}</span>
              <span className="font-medium text-indigo-200">點擊翻回正面</span>
            </div>
          </div>
        </div>
      </div>

      {/* 下方操作列 */}
      <div className="w-full flex items-center justify-between gap-2.5 mt-4">
        <button
          type="button"
          onClick={onPrevVerse}
          className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition flex items-center gap-1 text-xs font-semibold shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          {prevLabel}
        </button>

        <button
          type="button"
          onClick={onToggleSave}
          className={`flex-1 py-3 px-4 rounded-2xl font-semibold text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 shadow-md'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4" />
              <span>已收藏 ({savedStatus === 'memorized' ? '已熟記' : '待複習'})</span>
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
          className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition flex items-center gap-1 text-xs font-semibold shadow-xs"
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

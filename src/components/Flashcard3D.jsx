import React from 'react';
import {
  RotateCw,
  BookmarkPlus,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  Star,
  Folder,
  FolderPlus
} from 'lucide-react';

export default function Flashcard3D({
  verseData,
  enVersion = 'NKJV',
  isFlipped,
  onFlip,
  isSaved,
  savedStatus,
  isStarred = false,
  folderBadges = [],
  onToggleSave,
  onToggleStar,
  onEditFolders,
  onPrevVerse,
  onNextVerse,
  prevLabel = '上一節',
  nextLabel = '下一節',
  quizHideText = false,
  zhRevealed = true,
  enRevealed = true,
  onToggleZhReveal,
  onToggleEnReveal,
  onDeleteCard
}) {
  if (!verseData) return null;

  const activeEnText =
    enVersion === 'NKJV'
      ? verseData.nkjvText || verseData.enText || verseData.nivText
      : verseData.nivText || verseData.enText;

  return (
    <div className="flex flex-col items-center w-full">
      {/* 卡片隨時可點擊 3D 翻面；中央遮罩按鈕獨立控制中英文顯示與隱藏 */}
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
        style={{ perspective: '1200px' }}
        className="w-full h-[50vh] min-h-[320px] max-h-[430px] cursor-pointer select-none group relative"
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
          className="relative w-full h-full"
        >
          {/* 正面：中文和合本 CUNP */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/5 p-5 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  正面 · 和合本 CUNP
                </span>
                {isSaved && (
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

              <div className="flex items-center gap-1">
                {onToggleStar && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStar();
                    }}
                    className={`p-1.5 rounded-lg transition ${
                      isStarred
                        ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                        : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'
                    }`}
                    title={isStarred ? '取消星號' : '加入 ⭐ 星號重點經文'}
                  >
                    <Star className="w-4 h-4" fill={isStarred ? 'currentColor' : 'none'} />
                  </button>
                )}

                {onEditFolders && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditFolders();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition"
                    title="設定所屬資料夾"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                )}

                {onDeleteCard && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCard();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="移除此卡"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50/70 px-2.5 py-1 rounded-full">
                  <RotateCw className="w-3.5 h-3.5" />
                  翻面看 {enVersion}
                </span>
              </div>
            </div>

            <div className="my-auto py-3 overflow-y-auto max-h-full flex flex-col items-center justify-center text-center">
              <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide">
                <span>{verseData.zhRef}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">{verseData.enRef}</span>
              </div>

              {folderBadges.length > 0 && (
                <div className="mb-2 flex items-center justify-center gap-1 flex-wrap">
                  {folderBadges.map((fName) => (
                    <span
                      key={fName}
                      className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Folder className="w-2.5 h-2.5" />
                      {fName}
                    </span>
                  ))}
                </div>
              )}

              {quizHideText && !zhRevealed ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleZhReveal) onToggleZhReveal(true);
                  }}
                  className="w-full py-5 px-4 rounded-2xl bg-slate-50 border border-dashed border-indigo-300 flex flex-col items-center justify-center gap-1.5 hover:border-indigo-500 hover:bg-indigo-50/50 transition"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    點此顯示中文經文 (CUNP)
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    點擊卡片外圍空白處可隨時翻至背面 ({enVersion})
                  </p>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed tracking-wide">
                    「{verseData.zhText}」
                  </p>
                  {quizHideText && onToggleZhReveal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleZhReveal(false);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold transition"
                    >
                      <EyeOff className="w-3 h-3" />
                      隱藏中文經文
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{verseData.enRef} ({enVersion})</span>
              <span>點擊卡片隨時翻面 →</span>
            </div>
          </div>

          {/* 背面：英文譯本 (NKJV 或 NIV) */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl p-5 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-indigo-100">
                背面 · {enVersion} 英文
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-200">
                <RotateCw className="w-3.5 h-3.5" />
                點擊翻回 CUNP
              </span>
            </div>

            <div className="my-auto py-3 overflow-y-auto max-h-full flex flex-col items-center justify-center text-center">
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-xs font-semibold tracking-wide">
                <span>{verseData.enRef}</span>
                <span className="text-indigo-300/60">|</span>
                <span className="text-indigo-200 font-normal">{enVersion}</span>
              </div>

              {quizHideText && !enRevealed ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleEnReveal) onToggleEnReveal(true);
                  }}
                  className="w-full py-5 px-4 rounded-2xl bg-white/10 border border-dashed border-indigo-300/50 flex flex-col items-center justify-center gap-1.5 hover:bg-white/15 transition"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    點此顯示英文經文 ({enVersion})
                  </span>
                  <p className="text-xs text-indigo-200/80 mt-1">
                    點擊卡片外圍空白處可隨時翻回正面 (CUNP)
                  </p>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg sm:text-xl font-medium text-white/95 leading-relaxed italic">
                    “{activeEnText}”
                  </p>
                  {quizHideText && onToggleEnReveal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleEnReveal(false);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-indigo-100 text-[11px] font-semibold transition"
                    >
                      <EyeOff className="w-3 h-3" />
                      隱藏英文經文
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300/80">
              <span>
                {enVersion === 'NKJV'
                  ? 'New King James Version (NKJV)'
                  : 'New International Version (NIV)'}
              </span>
              <span>點擊卡片隨時翻面 →</span>
            </div>
          </div>
        </div>
      </div>

      {/* 字卡下方控制列 */}
      <div className="w-full flex items-center justify-between gap-2.5 mt-3.5">
        <button
          type="button"
          onClick={onPrevVerse}
          className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95 transition flex items-center gap-1 text-xs font-medium shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          {prevLabel}
        </button>

        <button
          type="button"
          onClick={onToggleSave}
          className={`flex-1 py-3 px-4 rounded-2xl font-semibold text-sm transition active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
            isSaved
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
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
          className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95 transition flex items-center gap-1 text-xs font-medium shadow-xs"
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

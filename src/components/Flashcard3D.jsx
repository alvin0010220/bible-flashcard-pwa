import React from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  Star,
  Folder,
  FolderPlus,
  FolderCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Flashcard3D({
  verseData,
  enVersion = 'NKJV',
  mode = 'search', // 'search' | 'deck'
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
      {/* 卡片隨時可點擊 3D 翻面；中央按鈕獨立控制中英文顯示與隱藏 */}
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
          {/* 正面：中文 CUNP */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 p-5 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* 配色 3 & 文字 9：小卡左上角改成「正面 CUNP」，底色 #43978d (2號)，字白色 */}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#43978d] text-white shadow-2xs">
                  正面 CUNP
                </span>
                {/* 配色 4：待複習 底#f9e07f (3號) 字#264d59 (1號)；已熟記 底#f9ad6a (4號) 字#264d59 (1號) */}
                {isSaved && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      savedStatus === 'memorized'
                        ? 'bg-[#f9ad6a] text-[#264d59]'
                        : 'bg-[#f9e07f] text-[#264d59]'
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
                        ? 'text-[#d46c4e] bg-[#f9e07f]/50 hover:bg-[#f9e07f]'
                        : 'text-slate-300 hover:text-[#d46c4e] hover:bg-slate-50'
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#264d59] hover:bg-slate-100 transition"
                    title="選擇資料夾"
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#d46c4e] hover:bg-rose-50 transition"
                    title="刪除此小卡"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* 配色 3 & 文字 6：右上角「翻面看 NKJV/NIV」，底色 #43978d (2號)，字白色 */}
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#43978d] text-white px-2.5 py-1 rounded-full shadow-2xs">
                  <RotateCw className="w-3.5 h-3.5" />
                  翻面看 {enVersion}
                </span>
              </div>
            </div>

            <div className="my-auto py-3 overflow-y-auto max-h-full flex flex-col items-center justify-center text-center">
              <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#264d59] text-xs font-bold tracking-wide">
                <span>{verseData.zhRef}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">{verseData.enRef}</span>
              </div>

              {/* 配色 7：小卡中央資料夾標籤 底色 #f9e07f (3號)，字 #264d59 (1號) */}
              {folderBadges.length > 0 && (
                <div className="mb-2 flex items-center justify-center gap-1 flex-wrap">
                  {folderBadges.map((fName) => (
                    <span
                      key={fName}
                      className="px-2.5 py-0.5 rounded-full bg-[#f9e07f] text-[#264d59] text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <Folder className="w-3 h-3" />
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
                  className="w-full py-5 px-4 rounded-2xl bg-slate-50 border border-dashed border-[#43978d] flex flex-col items-center justify-center gap-1.5 hover:bg-[#43978d]/5 transition"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#43978d] text-white text-xs font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    點此顯示中文經文 (CUNP)
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    點擊卡片外圍空白處可隨時翻面看 {enVersion}
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

            {/* 文字 7 & 8：移除左下角重複標示，右下角改為「點擊翻面」 */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end text-xs text-slate-400">
              <span className="font-medium text-slate-500">點擊翻面</span>
            </div>
          </div>

          {/* 背面：英文譯本 (NKJV 或 NIV) — 配色 5：底色改 #264d59 (1號) */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-[#264d59] text-white shadow-xl p-5 flex flex-col justify-between overflow-hidden border border-white/10"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              {/* 文字 10：小卡背面左上角改成「背面 NKJV」或「背面 NIV」 */}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/15 text-white">
                背面 {enVersion}
              </span>
              {/* 文字 6：統一成「翻面看 CUNP」 */}
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/15 text-white px-2.5 py-1 rounded-full">
                <RotateCw className="w-3.5 h-3.5" />
                翻面看 CUNP
              </span>
            </div>

            <div className="my-auto py-3 overflow-y-auto max-h-full flex flex-col items-center justify-center text-center">
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wide">
                <span>{verseData.enRef}</span>
                <span className="text-white/40">|</span>
                <span className="text-[#f9e07f] font-bold">{enVersion}</span>
              </div>

              {quizHideText && !enRevealed ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleEnReveal) onToggleEnReveal(true);
                  }}
                  className="w-full py-5 px-4 rounded-2xl bg-white/10 border border-dashed border-white/30 flex flex-col items-center justify-center gap-1.5 hover:bg-white/15 transition"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#43978d] text-white text-xs font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    點此顯示英文經文 ({enVersion})
                  </span>
                  <p className="text-xs text-white/80 mt-1">
                    點擊卡片外圍空白處可隨時翻面看 CUNP
                  </p>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg sm:text-xl font-medium text-white leading-relaxed italic">
                    “{activeEnText}”
                  </p>
                  {quizHideText && onToggleEnReveal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleEnReveal(false);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold transition"
                    >
                      <EyeOff className="w-3 h-3" />
                      隱藏英文經文
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 文字 7 & 8：移除左下角重複標示，右下角改為「點擊翻面」 */}
            <div className="pt-2.5 border-t border-white/15 flex items-center justify-end text-xs text-white/75">
              <span className="font-medium">點擊翻面</span>
            </div>
          </div>
        </div>
      </div>

      {/* 字卡下方控制列 */}
      <div className="w-full flex items-center justify-between gap-2.5 mt-3.5">
        <button
          type="button"
          onClick={onPrevVerse}
          className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-[#264d59] hover:bg-slate-100 active:scale-95 transition flex items-center gap-1 text-xs font-bold shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          {prevLabel}
        </button>

        {mode === 'search' ? (
          /* 經文檢索頁下方大按鈕：未加入顯示「加入書籤」(圖示統一為資料夾 FolderPlus)，已加入顯示「已加入書籤」(底色 #43978d 字 #f9e07f) */
          <button
            type="button"
            onClick={onToggleSave}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
              isSaved
                ? 'bg-[#43978d] text-[#f9e07f] hover:opacity-95'
                : 'bg-[#264d59] text-white hover:opacity-95'
            }`}
          >
            {isSaved ? (
              <>
                <FolderCheck className="w-4 h-4" />
                <span>已加入書籤</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4" />
                <span>加入書籤</span>
              </>
            )}
          </button>
        ) : (
          /* 經文書籤頁下方大按鈕：待複習顯示「背熟了！」(底色 #43978d 字 #f9e07f)，已熟記顯示「要再複習」(底色 #f9ad6a 字 #264d59) */
          <button
            type="button"
            onClick={onToggleSave}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
              savedStatus === 'memorized'
                ? 'bg-[#f9ad6a] text-[#264d59] hover:opacity-95'
                : 'bg-[#43978d] text-[#f9e07f] hover:opacity-95'
            }`}
          >
            {savedStatus === 'memorized' ? (
              <>
                <Clock className="w-4 h-4" />
                <span>要再複習</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>背熟了！</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onNextVerse}
          className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-[#264d59] hover:bg-slate-100 active:scale-95 transition flex items-center gap-1 text-xs font-bold shadow-xs"
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

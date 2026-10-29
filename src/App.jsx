import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Layers,
  Shuffle,
  Eye,
  EyeOff,
  Star,
  Folder,
  FolderPlus,
  ChevronDown,
  ChevronUp,
  ListFilter,
  Edit3,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { searchBilingualVerse } from './lib/bibleQueryEngine.js';
import { BIBLE_BOOKS_META } from './lib/bookAbbreviations.js';
import bibleIndexes from './lib/ChineseBibleSearchJS/bibleIndexes.js';
import Flashcard3D from './components/Flashcard3D.jsx';

const STORAGE_KEY = 'bible_flashcards_mvp_v2';
const FOLDERS_STORAGE_KEY = 'bible_flashcard_folders_v1';
const SELECTED_FOLDERS_KEY = 'bible_flashcard_selected_folders_v1';
const VERSION_STORAGE_KEY = 'bible_flashcards_en_version_v1';
const QUICK_EXAMPLES = ['Eph3:3', '弗3:3', '約3:16', 'Rom8:24', '創1:1', '出2:2', '林後4:4'];

const DEFAULT_FOLDERS = [
  { id: 'folder-oct', name: '十月經文', createdAt: '2026-10-01T08:00:00.000Z' },
  { id: 'folder-nov', name: '十一月經文', createdAt: '2026-10-29T08:00:00.000Z' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'deck'
  const [enVersion, setEnVersion] = useState(() => {
    try {
      const v = localStorage.getItem(VERSION_STORAGE_KEY);
      return v === 'NIV' || v === 'NKJV' ? v : 'NKJV';
    } catch {
      return 'NKJV';
    }
  });
  const [query, setQuery] = useState('Eph3:3');
  const [currentVerse, setCurrentVerse] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 功能 1：書卷與各章展開選單
  const [showBookChapterModal, setShowBookChapterModal] = useState(false);
  const [expandedBookIndex, setExpandedBookIndex] = useState(43);
  const [testamentFilter, setTestamentFilter] = useState('ALL');

  // 功能 3：書籤資料夾與多選狀態
  const [folders, setFolders] = useState(() => {
    try {
      const raw = localStorage.getItem(FOLDERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_FOLDERS;
    } catch {
      return DEFAULT_FOLDERS;
    }
  });
  const [selectedFolderIds, setSelectedFolderIds] = useState(() => {
    try {
      const raw = localStorage.getItem(SELECTED_FOLDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [showSaveFolderModal, setShowSaveFolderModal] = useState(false);
  const [targetVerseForFolders, setTargetVerseForFolders] = useState(null);
  const [modalCheckedFolderIds, setModalCheckedFolderIds] = useState([]);
  const [modalStarred, setModalStarred] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');

  const [showFolderManagerModal, setShowFolderManagerModal] = useState(false);
  const [expandedFolderIdsInManager, setExpandedFolderIdsInManager] = useState(['folder-oct', 'folder-nov']);
  const [managerNewFolderName, setManagerNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  // 卡牌庫 Flashcard 背誦狀態（支援卡片隨時翻面 ＋ 中英文獨立遮罩按鈕）
  const [deckFilter, setDeckFilter] = useState('all'); // 'all' | 'review' | 'memorized' | 'starred'
  const [deckIndex, setDeckIndex] = useState(0);
  const [deckFlipped, setDeckFlipped] = useState(false);
  const [deckQuizHideText, setDeckQuizHideText] = useState(true);
  const [deckZhRevealed, setDeckZhRevealed] = useState(false);
  const [deckEnRevealed, setDeckEnRevealed] = useState(false);

  const [cards, setCards] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bible_flashcards_mvp_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.map((c) => ({
          ...c,
          starred: Boolean(c.starred),
          folderIds: Array.isArray(c.folderIds) ? c.folderIds : []
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('LocalStorage save failed', e);
    }
  }, [cards]);

  useEffect(() => {
    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    } catch (e) {
      console.error('LocalStorage folders save failed', e);
    }
  }, [folders]);

  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_FOLDERS_KEY, JSON.stringify(selectedFolderIds));
    } catch (e) {
      console.error('LocalStorage selected folders save failed', e);
    }
  }, [selectedFolderIds]);

  useEffect(() => {
    try {
      localStorage.setItem(VERSION_STORAGE_KEY, enVersion);
    } catch (e) {
      console.error('LocalStorage version save failed', e);
    }
  }, [enVersion]);

  useEffect(() => {
    handleSearch('Eph3:3');
  }, []);

  async function handleSearch(inputQuery) {
    const q = (typeof inputQuery === 'string' ? inputQuery : query).trim();
    if (!q) return;
    setErrorMsg('');
    const res = await searchBilingualVerse(q);
    if (!res.ok) {
      setErrorMsg(res.error);
    } else {
      setCurrentVerse(res.data);
      setExpandedBookIndex(res.data.bookIndex);
      setIsFlipped(false);
    }
  }

  function handleSelectBookAndChapter(bookIdx, chNum) {
    const bookMeta = BIBLE_BOOKS_META[bookIdx];
    if (!bookMeta) return;
    const nextQ = `${bookMeta.zhShort}${chNum}:1`;
    setQuery(nextQ);
    handleSearch(nextQ);
    setShowBookChapterModal(false);
    setActiveTab('search');
  }

  function handleToggleStar(verseObj) {
    if (!verseObj) return;
    const exists = cards.find((c) => c.id === verseObj.id);
    if (exists) {
      setCards(cards.map((c) => (c.id === verseObj.id ? { ...c, starred: !c.starred } : c)));
    } else {
      setCards([
        {
          ...verseObj,
          status: 'review',
          starred: true,
          folderIds: [],
          addedAt: new Date().toISOString()
        },
        ...cards
      ]);
    }
  }

  function openSaveFolderModal(verseObj) {
    if (!verseObj) return;
    const exists = cards.find((c) => c.id === verseObj.id);
    setTargetVerseForFolders(verseObj);
    if (exists) {
      setModalCheckedFolderIds(Array.isArray(exists.folderIds) ? [...exists.folderIds] : []);
      setModalStarred(Boolean(exists.starred));
    } else {
      setModalCheckedFolderIds(selectedFolderIds.length > 0 ? [...selectedFolderIds] : folders[0] ? [folders[0].id] : []);
      setModalStarred(false);
    }
    setNewFolderNameInput('');
    setShowSaveFolderModal(true);
  }

  function handleConfirmSaveToFolders() {
    if (!targetVerseForFolders) return;
    const exists = cards.find((c) => c.id === targetVerseForFolders.id);
    if (exists) {
      setCards(
        cards.map((c) =>
          c.id === targetVerseForFolders.id
            ? { ...c, folderIds: [...modalCheckedFolderIds], starred: modalStarred }
            : c
        )
      );
    } else {
      setCards([
        {
          ...targetVerseForFolders,
          status: 'review',
          starred: modalStarred,
          folderIds: [...modalCheckedFolderIds],
          addedAt: new Date().toISOString()
        },
        ...cards
      ]);
    }
    setShowSaveFolderModal(false);
  }

  function toggleCardStatus(id) {
    setCards(
      cards.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'memorized' ? 'review' : 'memorized' }
          : c
      )
    );
  }

  function removeCard(id) {
    setCards(cards.filter((c) => c.id !== id));
    setDeckFlipped(false);
    setDeckZhRevealed(false);
    setDeckEnRevealed(false);
  }

  const savedCard = currentVerse ? cards.find((c) => c.id === currentVerse.id) : null;

  const folderScopedCards = useMemo(() => {
    if (selectedFolderIds.length === 0) return cards;
    return cards.filter(
      (c) => Array.isArray(c.folderIds) && c.folderIds.some((fid) => selectedFolderIds.includes(fid))
    );
  }, [cards, selectedFolderIds]);

  const filteredCards = useMemo(() => {
    if (deckFilter === 'starred') return cards.filter((c) => Boolean(c.starred));
    return folderScopedCards.filter((c) => (deckFilter === 'all' ? true : c.status === deckFilter));
  }, [cards, folderScopedCards, deckFilter]);

  const safeDeckIndex = filteredCards.length > 0 ? Math.min(deckIndex, filteredCards.length - 1) : 0;
  const activeDeckCard = filteredCards[safeDeckIndex] || null;

  const displayedBooks = useMemo(() => {
    if (testamentFilter === 'OT') return BIBLE_BOOKS_META.slice(0, 39);
    if (testamentFilter === 'NT') return BIBLE_BOOKS_META.slice(39, 66);
    return BIBLE_BOOKS_META;
  }, [testamentFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col max-w-md mx-auto border-x border-slate-200/70 shadow-sm">
      {/* 頂部導覽列 */}
      <header className="px-3.5 pt-3.5 pb-3 bg-white border-b border-slate-200/80 sticky top-0 z-20 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 leading-tight truncate">
                聖經背誦字卡 ｜ CUNP &amp; NKJV &amp; NIV
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                新標點和合本 CUNP · {enVersion} 雙語對照
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
            {(['NKJV', 'NIV']).map((ver) => (
              <button
                key={ver}
                type="button"
                onClick={() => setEnVersion(ver)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  enVersion === ver ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {ver}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'search' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            經文檢索
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deck')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
              activeTab === 'deck' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>卡牌庫背誦</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700">
              {cards.length}
            </span>
          </button>
        </div>
      </header>

      {/* 主內容區 */}
      <main className="flex-1 p-4 flex flex-col">
        {activeTab === 'search' ? (
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookChapterModal(true)}
                  className="px-3 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{currentVerse ? `${currentVerse.zhShort} ${currentVerse.chapter}章` : '選擇書卷'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(query);
                  }}
                  className="relative flex-1 flex items-center"
                >
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Eph3:3 或 弗3:3..."
                    className="w-full pl-9 pr-16 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
                  >
                    檢索
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
                <span className="text-[11px] text-slate-400 shrink-0">快速範例：</span>
                {QUICK_EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setQuery(ex);
                      handleSearch(ex);
                    }}
                    className="px-2.5 py-1 rounded-full text-xs bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 shrink-0 transition"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {errorMsg && (
                <div className="mt-1 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}
            </div>

            <div className="my-auto py-1">
              <Flashcard3D
                verseData={currentVerse}
                enVersion={enVersion}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                isSaved={Boolean(savedCard)}
                savedStatus={savedCard?.status}
                isStarred={Boolean(savedCard?.starred)}
                folderBadges={
                  savedCard?.folderIds
                    ? folders.filter((f) => savedCard.folderIds.includes(f.id)).map((f) => f.name)
                    : []
                }
                onToggleSave={() => openSaveFolderModal(currentVerse)}
                onToggleStar={() => handleToggleStar(currentVerse)}
                onEditFolders={() => openSaveFolderModal(currentVerse)}
                onPrevVerse={() => {
                  if (currentVerse && currentVerse.verse > 1) {
                    const nextQ = `${currentVerse.zhShort}${currentVerse.chapter}:${currentVerse.verse - 1}`;
                    setQuery(nextQ);
                    handleSearch(nextQ);
                  }
                }}
                onNextVerse={() => {
                  if (currentVerse) {
                    const nextQ = `${currentVerse.zhShort}${currentVerse.chapter}:${currentVerse.verse + 1}`;
                    setQuery(nextQ);
                    handleSearch(nextQ);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between gap-3">
            <div className="space-y-2">
              {/* B+A 資料夾多選與管理列 */}
              <div className="p-2 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5 text-indigo-600" />
                    {deckFilter === 'starred'
                      ? '⭐ 加星號模式（跨資料夾顯示）'
                      : selectedFolderIds.length === 0
                      ? `全部資料夾 (${folderScopedCards.length})`
                      : `已選 ${selectedFolderIds.length} 個資料夾 (${folderScopedCards.length})`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFolderManagerModal(true)}
                    className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold flex items-center gap-1"
                  >
                    <ListFilter className="w-3 h-3" />
                    書籤目錄 / 管理
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFolderIds([]);
                      setDeckIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 border ${
                      selectedFolderIds.length === 0 && deckFilter !== 'starred'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    全部 ({cards.length})
                  </button>
                  {folders.map((folder) => {
                    const count = cards.filter((c) => c.folderIds?.includes(folder.id)).length;
                    const isSel = selectedFolderIds.includes(folder.id);
                    return (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => {
                          setSelectedFolderIds((prev) =>
                            prev.includes(folder.id)
                              ? prev.filter((id) => id !== folder.id)
                              : [...prev, folder.id]
                          );
                          setDeckIndex(0);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 border flex items-center gap-1 ${
                          isSel && deckFilter !== 'starred'
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{folder.name}</span>
                        <span className="text-[10px] opacity-80">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4 大狀態分類（含 ⭐ 加星號） */}
              <div className="grid grid-cols-4 gap-1 bg-slate-200/70 p-1 rounded-xl">
                {[
                  { key: 'all', label: `全部 (${folderScopedCards.length})` },
                  { key: 'review', label: `待複習 (${folderScopedCards.filter((c) => c.status === 'review').length})` },
                  { key: 'memorized', label: `已熟記 (${folderScopedCards.filter((c) => c.status === 'memorized').length})` },
                  { key: 'starred', label: `⭐星號 (${cards.filter((c) => c.starred).length})` }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setDeckFilter(tab.key);
                      setDeckIndex(0);
                      setDeckFlipped(false);
                      setDeckZhRevealed(false);
                      setDeckEnRevealed(false);
                    }}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition truncate ${
                      deckFilter === tab.key
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {filteredCards.length > 0 && (
                <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-700">
                    第 {safeDeckIndex + 1} / {filteredCards.length} 張
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDeckQuizHideText(!deckQuizHideText);
                      setDeckZhRevealed(false);
                      setDeckEnRevealed(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-1"
                  >
                    {deckQuizHideText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{deckQuizHideText ? '默背遮罩：開' : '默背遮罩：關'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (filteredCards.length > 1) {
                        const next = Math.floor(Math.random() * filteredCards.length);
                        setDeckIndex(next);
                        setDeckFlipped(false);
                        setDeckZhRevealed(false);
                        setDeckEnRevealed(false);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold flex items-center gap-1"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>抽背</span>
                  </button>
                </div>
              )}
            </div>

            {!activeDeckCard ? (
              <div className="my-auto py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-6">
                <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">目前沒有符合條件的背誦字卡</p>
              </div>
            ) : (
              <div className="my-auto py-1">
                <Flashcard3D
                  verseData={activeDeckCard}
                  enVersion={enVersion}
                  isFlipped={deckFlipped}
                  onFlip={() => setDeckFlipped(!deckFlipped)}
                  isSaved={true}
                  savedStatus={activeDeckCard.status}
                  isStarred={Boolean(activeDeckCard.starred)}
                  folderBadges={
                    activeDeckCard.folderIds
                      ? folders.filter((f) => activeDeckCard.folderIds.includes(f.id)).map((f) => f.name)
                      : []
                  }
                  onToggleSave={() => toggleCardStatus(activeDeckCard.id)}
                  onToggleStar={() => handleToggleStar(activeDeckCard)}
                  onEditFolders={() => openSaveFolderModal(activeDeckCard)}
                  prevLabel="上一張"
                  nextLabel="下一張"
                  quizHideText={deckQuizHideText}
                  zhRevealed={deckZhRevealed}
                  enRevealed={deckEnRevealed}
                  onToggleZhReveal={(val) => setDeckZhRevealed(val)}
                  onToggleEnReveal={(val) => setDeckEnRevealed(val)}
                  onDeleteCard={() => removeCard(activeDeckCard.id)}
                  onPrevVerse={() => {
                    const nextIdx = (safeDeckIndex - 1 + filteredCards.length) % filteredCards.length;
                    setDeckIndex(nextIdx);
                    setDeckFlipped(false);
                    setDeckZhRevealed(false);
                    setDeckEnRevealed(false);
                  }}
                  onNextVerse={() => {
                    const nextIdx = (safeDeckIndex + 1) % filteredCards.length;
                    setDeckIndex(nextIdx);
                    setDeckFlipped(false);
                    setDeckZhRevealed(false);
                    setDeckEnRevealed(false);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* 書卷與章節展開選單 Modal */}
      {showBookChapterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-end sm:items-center justify-center">
          <div className="bg-[#121214] text-white w-full max-w-md h-[86vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden">
            <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#18181b]">
              <button
                type="button"
                onClick={() => setShowBookChapterModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold">書卷</h2>
              <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full text-[11px]">
                {[
                  { k: 'ALL', l: '全部' },
                  { k: 'OT', l: '舊約' },
                  { k: 'NT', l: '新約' }
                ].map((t) => (
                  <button
                    key={t.k}
                    type="button"
                    onClick={() => setTestamentFilter(t.k)}
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      testamentFilter === t.k ? 'bg-white text-black' : 'text-zinc-300'
                    }`}
                  >
                    {t.l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-white/5">
              {displayedBooks.map((book) => {
                const totalChapters = bibleIndexes.getTotalChapters(book.index);
                const isExpanded = expandedBookIndex === book.index;
                return (
                  <div key={book.index} className="py-1">
                    <button
                      type="button"
                      onClick={() => setExpandedBookIndex(isExpanded ? -1 : book.index)}
                      className="w-full py-3 flex items-center justify-between text-left"
                    >
                      <span className="text-base font-bold">{book.zhFull}</span>
                      <span className="text-xs text-zinc-400">{totalChapters} 章</span>
                    </button>
                    {isExpanded && (
                      <div className="grid grid-cols-5 gap-2.5 pb-4 pt-1">
                        {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chNum) => (
                          <button
                            key={chNum}
                            type="button"
                            onClick={() => handleSelectBookAndChapter(book.index, chNum)}
                            className="h-12 rounded-xl bg-[#2c2c30] hover:bg-[#3a3a40] font-bold text-sm flex items-center justify-center"
                          >
                            {chNum}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 收藏經文並勾選資料夾 Modal */}
      {showSaveFolderModal && targetVerseForFolders && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold">選擇書籤資料夾（可複選）</h2>
              <button type="button" onClick={() => setShowSaveFolderModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {folders.map((folder) => {
                const checked = modalCheckedFolderIds.includes(folder.id);
                return (
                  <div
                    key={folder.id}
                    onClick={() =>
                      setModalCheckedFolderIds((prev) =>
                        prev.includes(folder.id)
                          ? prev.filter((id) => id !== folder.id)
                          : [...prev, folder.id]
                      )
                    }
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                      checked ? 'bg-violet-50 border-violet-300 font-semibold' : 'border-slate-200'
                    }`}
                  >
                    <span className="text-xs">{folder.name}</span>
                    <input type="checkbox" checked={checked} readOnly className="w-4 h-4 accent-violet-600" />
                  </div>
                );
              })}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFolderNameInput.trim()) return;
                const nf = { id: `folder-${Date.now()}`, name: newFolderNameInput.trim() };
                setFolders([...folders, nf]);
                setModalCheckedFolderIds([...modalCheckedFolderIds, nf.id]);
                setNewFolderNameInput('');
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newFolderNameInput}
                onChange={(e) => setNewFolderNameInput(e.target.value)}
                placeholder="新增資料夾..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <button type="submit" className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
                新增
              </button>
            </form>
            <button
              type="button"
              onClick={handleConfirmSaveToFolders}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              確認儲存
            </button>
          </div>
        </div>
      )}

      {/* Chrome 書籤管理員式資料夾預覽抽屜 Modal */}
      {showFolderManagerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold">書籤資料夾管理 ＆ 展開預覽</h2>
              <button type="button" onClick={() => setShowFolderManagerModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 my-3">
              {folders.map((folder) => {
                const fCards = cards.filter((c) => c.folderIds?.includes(folder.id));
                const isExpanded = expandedFolderIdsInManager.includes(folder.id);
                return (
                  <div key={folder.id} className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedFolderIdsInManager((prev) =>
                            prev.includes(folder.id)
                              ? prev.filter((id) => id !== folder.id)
                              : [...prev, folder.id]
                          )
                        }
                        className="flex items-center gap-2 text-xs font-bold"
                      >
                        <Folder className="w-4 h-4 text-violet-600" />
                        <span>{folder.name} ({fCards.length})</span>
                      </button>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 bg-slate-50 flex flex-wrap gap-1.5">
                        {fCards.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setSelectedFolderIds([folder.id]);
                              setDeckFilter('all');
                              setShowFolderManagerModal(false);
                              setActiveTab('deck');
                            }}
                            className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold"
                          >
                            {c.zhRef}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

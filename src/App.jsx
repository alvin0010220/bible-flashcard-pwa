import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Layers, CheckCircle2, Clock, Trash2, RotateCw, Sparkles, ArrowRight } from 'lucide-react';
import { searchBilingualVerse } from './lib/bibleQueryEngine.js';
import Flashcard3D from './components/Flashcard3D.jsx';

const STORAGE_KEY = 'bible_flashcards_mvp_v1';

const QUICK_EXAMPLES = ['Eph3:3', '弗3:3', '約3:16', 'Rom8:28', '詩23:1', '腓4:13'];

export default function App() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'deck'
  const [query, setQuery] = useState('Eph3:3');
  const [currentVerse, setCurrentVerse] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [deckFilter, setDeckFilter] = useState('all'); // 'all' | 'review' | 'memorized'
  const [cards, setCards] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
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
      setIsFlipped(false);
    }
  }

  function toggleSaveCurrent() {
    if (!currentVerse) return;
    const exists = cards.find((c) => c.id === currentVerse.id);
    if (exists) {
      setCards(cards.filter((c) => c.id !== currentVerse.id));
    } else {
      setCards([
        {
          ...currentVerse,
          status: 'review',
          addedAt: new Date().toISOString()
        },
        ...cards
      ]);
    }
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
  }

  const savedCard = currentVerse ? cards.find((c) => c.id === currentVerse.id) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col max-w-md mx-auto border-x border-slate-200/70 shadow-sm">
      {/* 頂部導覽列 */}
      <header className="px-4 pt-4 pb-3 bg-white border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">聖經背誦字卡</h1>
            <p className="text-[11px] text-slate-500">CUV 和合本 & NIV 雙語對照</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'search' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            經文檢索
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deck')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              activeTab === 'deck' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            <span>卡牌庫</span>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(query);
                }}
                className="relative flex items-center"
              >
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="輸入中英縮寫，如 Eph3:3 或 弗3:3..."
                  className="w-full pl-10 pr-20 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
                >
                  檢索
                </button>
              </form>

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
                <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}
            </div>

            <div className="my-auto py-2">
              <Flashcard3D
                verseData={currentVerse}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                isSaved={Boolean(savedCard)}
                savedStatus={savedCard?.status}
                onToggleSave={toggleSaveCurrent}
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
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {[
                  { key: 'all', label: `全部 (${cards.length})` },
                  { key: 'review', label: `待複習 (${cards.filter((c) => c.status === 'review').length})` },
                  { key: 'memorized', label: `已熟記 (${cards.filter((c) => c.status === 'memorized').length})` }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDeckFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      deckFilter === tab.key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 mt-1">
              {cards
                .filter((c) => (deckFilter === 'all' ? true : c.status === deckFilter))
                .map((card) => (
                  <div
                    key={card.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-800">{card.zhRef}</span>
                        <span className="ml-2 text-xs text-slate-400">{card.enRef}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleCardStatus(card.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            card.status === 'memorized'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {card.status === 'memorized' ? '已熟記' : '待複習'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCard(card.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                          title="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{card.zhText}</p>
                    <p className="text-xs text-slate-500 italic leading-relaxed">{card.enText}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

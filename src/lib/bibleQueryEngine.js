import bibleSearch from './ChineseBibleSearchJS/bibleSearch.js';
import bibleIndexes from './ChineseBibleSearchJS/bibleIndexes.js';
import { normalizeQueryToChineseBibleSearch } from './bookAbbreviations.js';

const nivBookCache = new Map();

/**
 * 結合 ChineseBibleSearchJS 模組與 Bible-niv-main 目錄下的書卷 JSON 檔案，
 * 解析中英縮寫（如 Eph3:3 或 弗3:3）並提取中英對照單節經文。
 */
export async function searchBilingualVerse(rawQuery) {
  const parsed = normalizeQueryToChineseBibleSearch(rawQuery);
  if (!parsed) {
    return {
      ok: false,
      error: '格式無法識別，請輸入如「Eph3:3」、「弗3:3」或「約 3:16」的書卷章節格式。'
    };
  }
  if (parsed.error) {
    return { ok: false, error: parsed.error };
  }

  const { bookMeta, chapter, verse, normalizedChineseQuery } = parsed;

  // 1. 透過 ChineseBibleSearchJS-master 執行檢索與驗證
  let searchError = null;
  let zhTitle = '';
  const zhLines = [];

  bibleSearch.setOptions({
    onError: (err, source) => {
      searchError = source ? `${err} (${source})` : err;
    },
    onTitle: (title) => {
      zhTitle = title;
    },
    onTextLine: (prefix, text) => {
      zhLines.push({ prefix, text });
    }
  });

  bibleSearch.indexSearch(normalizedChineseQuery);

  if (searchError || zhLines.length === 0) {
    const maxCh = bibleIndexes.getTotalChapters(bookMeta.index);
    const maxVs = bibleIndexes.getTotalLines(bookMeta.index, chapter);
    const detail = maxVs > 0
      ? `${bookMeta.zhFull} 第 ${chapter} 章共有 ${maxVs} 節`
      : `${bookMeta.zhFull} 共有 ${maxCh} 章`;
    return {
      ok: false,
      error: `${searchError || '查無經文'}（${detail}）`
    };
  }

  // 2. 從 Bible-niv-main 對應書卷 JSON 檔案提取英文經文
  const enBookName = bookMeta.enName;
  let nivBookData = nivBookCache.get(enBookName);
  if (!nivBookData) {
    const baseUrl = import.meta.env?.BASE_URL || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const res = await fetch(`${normalizedBase}Bible-niv-main/${encodeURIComponent(enBookName)}.json`);
    if (!res.ok) {
      return { ok: false, error: `無法載入英文經文檔案：${enBookName}.json` };
    }
    nivBookData = await res.json();
    nivBookCache.set(enBookName, nivBookData);
  }

  const chapterObj = nivBookData.chapters.find(c => String(c.chapter) === String(chapter));
  const verseObj = chapterObj?.verses?.find(v => String(v.verse) === String(verse));

  if (!verseObj) {
    return {
      ok: false,
      error: `NIV 資料庫中找不到 ${enBookName} ${chapter}:${verse}`
    };
  }

  return {
    ok: true,
    data: {
      id: `${bookMeta.enName}-${chapter}-${verse}`,
      bookIndex: bookMeta.index,
      zhFull: bookMeta.zhFull,
      zhShort: bookMeta.zhShort,
      enName: bookMeta.enName,
      chapter,
      verse,
      zhRef: `${bookMeta.zhFull} ${chapter}:${verse}`,
      zhShortRef: `${bookMeta.zhShort} ${chapter}:${verse}`,
      enRef: `${bookMeta.enName} ${chapter}:${verse}`,
      zhText: zhLines[0].text,
      enText: verseObj.text.replace(/`/g, "'")
    }
  };
}

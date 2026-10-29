import bibleSearch from './ChineseBibleSearchJS/bibleSearch.js';
import bibleIndexes from './ChineseBibleSearchJS/bibleIndexes.js';
import { normalizeQueryToChineseBibleSearch } from './bookAbbreviations.js';

const nivBookCache = new Map();
const nkjvBookCache = new Map();

async function fetchBookJsonFromDir(dirName, enBookName, cacheMap) {
  if (cacheMap.has(enBookName)) return cacheMap.get(enBookName);
  const baseUrl = import.meta.env?.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  try {
    const res = await fetch(`${normalizedBase}${dirName}/${encodeURIComponent(enBookName)}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && Array.isArray(data.chapters)) {
      cacheMap.set(enBookName, data);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function extractVerseFromBookJson(bookData, chapter, verse) {
  if (!bookData || !Array.isArray(bookData.chapters)) return null;
  const chObj = bookData.chapters.find((c) => String(c.chapter) === String(chapter));
  const vObj = chObj?.verses?.find((v) => String(v.verse) === String(verse));
  return vObj?.text ? String(vObj.text).replace(/`/g, "'") : null;
}

/**
 * 結合 ChineseBibleSearchJS 模組與 Bible-nkjv-main / Bible-niv-main 目錄下的 66 卷 JSON 檔案，
 * 解析中英縮寫（如 Eph3:3 或 弗3:3）並同時提取 CUNP、NKJV 與 NIV 對照單節經文。
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
  const zhLines = [];

  bibleSearch.setOptions({
    onError: (err, source) => {
      searchError = source ? `${err} (${source})` : err;
    },
    onTitle: () => {},
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

  const enBookName = bookMeta.enName;
  const verseKey = `${enBookName}-${chapter}-${verse}`;

  // 2. 平行載入 NKJV (public/Bible-nkjv-main/<Book>.json) 與 NIV (public/Bible-niv-main/<Book>.json)
  const [nkjvBookData, nivBookData] = await Promise.all([
    fetchBookJsonFromDir('Bible-nkjv-main', enBookName, nkjvBookCache),
    fetchBookJsonFromDir('Bible-niv-main', enBookName, nivBookCache)
  ]);

  const nkjvText = extractVerseFromBookJson(nkjvBookData, chapter, verse) || '';
  const nivText = extractVerseFromBookJson(nivBookData, chapter, verse) || '';

  return {
    ok: true,
    data: {
      id: verseKey,
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
      nkjvText,
      nivText,
      enText: nkjvText || nivText
    }
  };
}

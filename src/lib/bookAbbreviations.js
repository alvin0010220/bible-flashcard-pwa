// 66卷聖經中英對照與縮寫映射表（與 ChineseBibleSearchJS 及 Bible-niv-main/Books.json 順序完全一致）
export const BIBLE_BOOKS_META = [
  { index: 0, zhFull: '創世記', zhShort: '創', zhSimp: ['创世记', '创'], enName: 'Genesis', enAliases: ['gen', 'ge', 'gn', 'genesis'] },
  { index: 1, zhFull: '出埃及記', zhShort: '出', zhSimp: ['出埃及记'], enName: 'Exodus', enAliases: ['exo', 'ex', 'exod', 'exodus'] },
  { index: 2, zhFull: '利未記', zhShort: '利', zhSimp: ['利未记'], enName: 'Leviticus', enAliases: ['lev', 'le', 'lv', 'leviticus'] },
  { index: 3, zhFull: '民數記', zhShort: '民', zhSimp: ['民数记'], enName: 'Numbers', enAliases: ['num', 'nu', 'nm', 'nb', 'numbers'] },
  { index: 4, zhFull: '申命記', zhShort: '申', zhSimp: ['申命记'], enName: 'Deuteronomy', enAliases: ['deu', 'deut', 'dt', 'deuteronomy'] },
  { index: 5, zhFull: '約書亞記', zhShort: '書', zhSimp: ['约书亚记', '书'], enName: 'Joshua', enAliases: ['jos', 'josh', 'jsh', 'joshua'] },
  { index: 6, zhFull: '士師記', zhShort: '士', zhSimp: ['士师记'], enName: 'Judges', enAliases: ['jdg', 'judg', 'jg', 'jdgs', 'judges'] },
  { index: 7, zhFull: '路得記', zhShort: '得', zhSimp: ['路得记'], enName: 'Ruth', enAliases: ['rut', 'rth', 'ru', 'ruth'] },
  { index: 8, zhFull: '撒母耳記上', zhShort: '撒上', zhSimp: ['撒母耳记上'], enName: '1 Samuel', enAliases: ['1sa', '1sam', '1sm', '1samuel', '1 samuel', '1 sam'] },
  { index: 9, zhFull: '撒母耳記下', zhShort: '撒下', zhSimp: ['撒母耳记下'], enName: '2 Samuel', enAliases: ['2sa', '2sam', '2sm', '2samuel', '2 samuel', '2 sam'] },
  { index: 10, zhFull: '列王紀上', zhShort: '王上', zhSimp: ['列王纪上'], enName: '1 Kings', enAliases: ['1ki', '1kgs', '1kin', '1kings', '1 kings'] },
  { index: 11, zhFull: '列王紀下', zhShort: '王下', zhSimp: ['列王纪下'], enName: '2 Kings', enAliases: ['2ki', '2kgs', '2kin', '2kings', '2 kings'] },
  { index: 12, zhFull: '歷代志上', zhShort: '代上', zhSimp: ['历代志上'], enName: '1 Chronicles', enAliases: ['1ch', '1chr', '1chron', '1chronicles', '1 chronicles'] },
  { index: 13, zhFull: '歷代志下', zhShort: '代下', zhSimp: ['历代志下'], enName: '2 Chronicles', enAliases: ['2ch', '2chr', '2chron', '2chronicles', '2 chronicles'] },
  { index: 14, zhFull: '以斯拉記', zhShort: '拉', zhSimp: ['以斯拉记'], enName: 'Ezra', enAliases: ['ezr', 'ez', 'ezra'] },
  { index: 15, zhFull: '尼希米記', zhShort: '尼', zhSimp: ['尼希米记'], enName: 'Nehemiah', enAliases: ['neh', 'ne', 'nehemiah'] },
  { index: 16, zhFull: '以斯帖記', zhShort: '斯', zhSimp: ['以斯帖记'], enName: 'Esther', enAliases: ['est', 'esth', 'es', 'esther'] },
  { index: 17, zhFull: '約伯記', zhShort: '伯', zhSimp: ['约伯记'], enName: 'Job', enAliases: ['job', 'jb'] },
  { index: 18, zhFull: '詩篇', zhShort: '詩', zhSimp: ['诗篇', '诗'], enName: 'Psalms', enAliases: ['psa', 'ps', 'psalm', 'psalms', 'psm', 'pss'] },
  { index: 19, zhFull: '箴言', zhShort: '箴', zhSimp: ['箴言'], enName: 'Proverbs', enAliases: ['pro', 'prov', 'prv', 'pr', 'proverbs'] },
  { index: 20, zhFull: '傳道書', zhShort: '傳', zhSimp: ['传道书', '传'], enName: 'Ecclesiastes', enAliases: ['ecc', 'eccl', 'ec', 'qoh', 'ecclesiastes'] },
  { index: 21, zhFull: '雅歌', zhShort: '歌', zhSimp: ['雅歌'], enName: 'Song Of Solomon', enAliases: ['sng', 'song', 'sos', 'so', 'cant', 'songofsolomon', 'song of solomon', 'song of songs'] },
  { index: 22, zhFull: '以賽亞書', zhShort: '賽', zhSimp: ['以赛亚书', '赛'], enName: 'Isaiah', enAliases: ['isa', 'is', 'isaiah'] },
  { index: 23, zhFull: '耶利米書', zhShort: '耶', zhSimp: ['耶利米书'], enName: 'Jeremiah', enAliases: ['jer', 'je', 'jr', 'jeremiah'] },
  { index: 24, zhFull: '耶利米哀歌', zhShort: '哀', zhSimp: ['耶利米哀歌'], enName: 'Lamentations', enAliases: ['lam', 'la', 'lamentations'] },
  { index: 25, zhFull: '以西結書', zhShort: '結', zhSimp: ['以西结书', '结'], enName: 'Ezekiel', enAliases: ['ezk', 'ezek', 'eze', 'ezekiel'] },
  { index: 26, zhFull: '但以理書', zhShort: '但', zhSimp: ['但以理书'], enName: 'Daniel', enAliases: ['dan', 'da', 'dn', 'daniel'] },
  { index: 27, zhFull: '何西阿書', zhShort: '何', zhSimp: ['何西阿书'], enName: 'Hosea', enAliases: ['hos', 'ho', 'hosea'] },
  { index: 28, zhFull: '約珥書', zhShort: '珥', zhSimp: ['约珥书'], enName: 'Joel', enAliases: ['jol', 'joel', 'joe', 'jl'] },
  { index: 29, zhFull: '阿摩司書', zhShort: '摩', zhSimp: ['阿摩司书'], enName: 'Amos', enAliases: ['amo', 'am', 'amos'] },
  { index: 30, zhFull: '俄巴底亞書', zhShort: '俄', zhSimp: ['俄巴底亚书'], enName: 'Obadiah', enAliases: ['oba', 'obad', 'ob', 'obadiah'] },
  { index: 31, zhFull: '約拿書', zhShort: '拿', zhSimp: ['约拿书'], enName: 'Jonah', enAliases: ['jon', 'jnh', 'jonah'] },
  { index: 32, zhFull: '彌迦書', zhShort: '彌', zhSimp: ['弥迦书', '弥'], enName: 'Micah', enAliases: ['mic', 'mc', 'micah'] },
  { index: 33, zhFull: '那鴻書', zhShort: '鴻', zhSimp: ['那鸿书', '鸿'], enName: 'Nahum', enAliases: ['nam', 'nah', 'na', 'nahum'] },
  { index: 34, zhFull: '哈巴谷書', zhShort: '哈', zhSimp: ['哈巴谷书'], enName: 'Habakkuk', enAliases: ['hab', 'hb', 'habakkuk'] },
  { index: 35, zhFull: '西番雅書', zhShort: '番', zhSimp: ['西番雅书'], enName: 'Zephaniah', enAliases: ['zep', 'zeph', 'zp', 'zephaniah'] },
  { index: 36, zhFull: '哈該書', zhShort: '該', zhSimp: ['哈该书', '该'], enName: 'Haggai', enAliases: ['hag', 'hg', 'haggai'] },
  { index: 37, zhFull: '撒迦利亞書', zhShort: '亞', zhSimp: ['撒迦利亚书', '亚'], enName: 'Zechariah', enAliases: ['zec', 'zech', 'zc', 'zechariah'] },
  { index: 38, zhFull: '瑪拉基書', zhShort: '瑪', zhSimp: ['玛拉基书', '玛'], enName: 'Malachi', enAliases: ['mal', 'ml', 'malachi'] },
  { index: 39, zhFull: '馬太福音', zhShort: '太', zhSimp: ['马太福音'], enName: 'Matthew', enAliases: ['mat', 'matt', 'mt', 'matthew'] },
  { index: 40, zhFull: '馬可福音', zhShort: '可', zhSimp: ['马可福音'], enName: 'Mark', enAliases: ['mrk', 'mark', 'mk', 'mr'] },
  { index: 41, zhFull: '路加福音', zhShort: '路', zhSimp: ['路加福音'], enName: 'Luke', enAliases: ['luk', 'luke', 'lk'] },
  { index: 42, zhFull: '約翰福音', zhShort: '約', zhSimp: ['约翰福音', '约'], enName: 'John', enAliases: ['jhn', 'john', 'jn', 'joh'] },
  { index: 43, zhFull: '使徒行傳', zhShort: '徒', zhSimp: ['使徒行传'], enName: 'Acts', enAliases: ['act', 'acts', 'ac'] },
  { index: 44, zhFull: '羅馬書', zhShort: '羅', zhSimp: ['罗马书', '罗'], enName: 'Romans', enAliases: ['rom', 'ro', 'rm', 'romans'] },
  { index: 45, zhFull: '哥林多前書', zhShort: '林前', zhSimp: ['哥林多前书'], enName: '1 Corinthians', enAliases: ['1co', '1cor', '1corinthians', '1 corinthians', '1 cor'] },
  { index: 46, zhFull: '哥林多後書', zhShort: '林後', zhSimp: ['哥林多后书', '林后'], enName: '2 Corinthians', enAliases: ['2co', '2cor', '2corinthians', '2 corinthians', '2 cor'] },
  { index: 47, zhFull: '加拉太書', zhShort: '加', zhSimp: ['加拉太书'], enName: 'Galatians', enAliases: ['gal', 'ga', 'galatians'] },
  { index: 48, zhFull: '以弗所書', zhShort: '弗', zhSimp: ['以弗所书'], enName: 'Ephesians', enAliases: ['eph', 'ephes', 'ep', 'ephesians'] },
  { index: 49, zhFull: '腓利比書', zhShort: '腓', zhSimp: ['腓利比书'], enName: 'Philippians', enAliases: ['php', 'phil', 'pp', 'philippians'] },
  { index: 50, zhFull: '歌羅西書', zhShort: '西', zhSimp: ['歌罗西书'], enName: 'Colossians', enAliases: ['col', 'co', 'colossians'] },
  { index: 51, zhFull: '帖撒羅尼迦前書', zhShort: '帖前', zhSimp: ['帖撒罗尼迦前书'], enName: '1 Thessalonians', enAliases: ['1th', '1thess', '1thes', '1thessalonians', '1 thessalonians', '1 thess'] },
  { index: 52, zhFull: '帖撒羅尼迦後書', zhShort: '帖後', zhSimp: ['帖撒罗尼迦后书', '帖后'], enName: '2 Thessalonians', enAliases: ['2th', '2thess', '2thes', '2thessalonians', '2 thessalonians', '2 thess'] },
  { index: 53, zhFull: '提摩太前書', zhShort: '提前', zhSimp: ['提摩太前书'], enName: '1 Timothy', enAliases: ['1ti', '1tim', '1timothy', '1 timothy', '1 tim'] },
  { index: 54, zhFull: '提摩太後書', zhShort: '提後', zhSimp: ['提摩太后书', '提后'], enName: '2 Timothy', enAliases: ['2ti', '2tim', '2timothy', '2 timothy', '2 tim'] },
  { index: 55, zhFull: '提多書', zhShort: '多', zhSimp: ['提多书'], enName: 'Titus', enAliases: ['tit', 'ti', 'titus'] },
  { index: 56, zhFull: '腓利門書', zhShort: '門', zhSimp: ['腓利门书', '门'], enName: 'Philemon', enAliases: ['phm', 'phlm', 'pm', 'philemon'] },
  { index: 57, zhFull: '希伯來書', zhShort: '來', zhSimp: ['希伯来书', '来'], enName: 'Hebrews', enAliases: ['heb', 'he', 'hebrews'] },
  { index: 58, zhFull: '雅各書', zhShort: '雅', zhSimp: ['雅各书'], enName: 'James', enAliases: ['jas', 'jam', 'jm', 'james'] },
  { index: 59, zhFull: '彼得前書', zhShort: '彼前', zhSimp: ['彼得前书'], enName: '1 Peter', enAliases: ['1pe', '1pet', '1pt', '1p', '1peter', '1 peter', '1 pet'] },
  { index: 60, zhFull: '彼得後書', zhShort: '彼後', zhSimp: ['彼得后书', '彼后'], enName: '2 Peter', enAliases: ['2pe', '2pet', '2pt', '2p', '2peter', '2 peter', '2 pet'] },
  { index: 61, zhFull: '約翰壹書', zhShort: '約壹', zhSimp: ['约翰一书', '约一', '約一', '約翰一書'], enName: '1 John', enAliases: ['1jn', '1jhn', '1jo', '1john', '1 john'] },
  { index: 62, zhFull: '約翰貳書', zhShort: '約貳', zhSimp: ['约翰二书', '约二', '約二', '約翰二書'], enName: '2 John', enAliases: ['2jn', '2jhn', '2jo', '2john', '2 john'] },
  { index: 63, zhFull: '約翰參書', zhShort: '約參', zhSimp: ['约翰三书', '约三', '約三', '約翰三書'], enName: '3 John', enAliases: ['3jn', '3jhn', '3jo', '3john', '3 john'] },
  { index: 64, zhFull: '猶大書', zhShort: '猶', zhSimp: ['犹大书', '犹'], enName: 'Jude', enAliases: ['jud', 'jude', 'jd'] },
  { index: 65, zhFull: '啟示錄', zhShort: '啟', zhSimp: ['启示录', '启', '啓示錄', '啓'], enName: 'Revelation', enAliases: ['rev', 're', 'rv', 'revelation'] }
];

export function normalizeQueryToChineseBibleSearch(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const trimmed = rawInput.trim();
  const match = trimmed.match(/^([1-3]?\s*[a-zA-Z一-龥]+(?:\s+[a-zA-Z]+)*)\.?\s*(\d+)\s*[:：.\s]\s*(\d+)(?:\s*[-－~]\s*(\d+))?$/);
  if (!match) return null;

  const rawBook = match[1].trim().toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ');
  const rawBookNoSpace = rawBook.replace(/\s+/g, '');
  const chapter = parseInt(match[2], 10);
  const verse = parseInt(match[3], 10);
  const endVerse = match[4] ? parseInt(match[4], 10) : verse;

  const foundBook = BIBLE_BOOKS_META.find(b =>
    b.zhShort === rawBookNoSpace ||
    b.zhFull === rawBookNoSpace ||
    b.zhSimp.includes(rawBookNoSpace) ||
    b.enName.toLowerCase() === rawBook ||
    b.enName.toLowerCase().replace(/\s+/g, '') === rawBookNoSpace ||
    b.enAliases.includes(rawBook) ||
    b.enAliases.includes(rawBookNoSpace)
  );

  if (!foundBook) return { error: `找不到書卷：「${match[1]}」`, rawBook: match[1] };

  return {
    bookMeta: foundBook,
    chapter,
    verse,
    endVerse,
    normalizedChineseQuery: `${foundBook.zhShort}${chapter}:${verse}`
  };
}

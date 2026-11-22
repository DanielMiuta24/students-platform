import axios from 'axios';

const DAAD_DATA_URL =
  'https://www2.daad.de/bundles/daadstipendiendatenbanklsh/data/a/js/scholarships.js';

const SUBJECT_GROUPS: Record<string, string> = {
  A: 'Languages and Cultural Studies',
  B: 'Law, Economics and Social Sciences',
  C: 'Mathematics and Natural Sciences',
  D: 'Human Medicine',
  E: 'Veterinary Medicine / Agriculture',
  F: 'Engineering',
  G: 'Art, Music and Sport',
};

const INTENTIONS: Record<number, string> = {
  1: 'Study',
  2: 'Research / Doctorate / PhD',
  3: 'Language Course',
  4: 'Internship',
  5: 'Teaching',
};

const STATUS_LABELS: Record<number, string> = {
  1: 'Undergraduates',
  2: 'Postdoctoral researchers',
  3: 'Graduates',
  4: 'Doctoral candidates / PhD students',
  5: 'Faculty',
};

export interface DAADScholarship {
  id: number;
  nameEn: string;
  introduction: string;
  subjectGroups: string[];
  intentions: string[];
  targetStatus: string[];
  isDaad: boolean;
  detailUrl: string;
  source: 'daad';
}

export interface DAADSearchResult {
  scholarships: DAADScholarship[];
  total: number;
  source: 'daad';
}

let cachedData: DAADScholarship[] | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

async function loadData(): Promise<DAADScholarship[]> {
  if (cachedData && Date.now() - cacheTime < CACHE_TTL_MS) {
    return cachedData;
  }

  const response = await axios.get<string>(DAAD_DATA_URL, {
    responseType: 'text',
    timeout: 15000,
    headers: { 'User-Agent': 'Mozilla/5.0 ISCompass/1.0' },
  });

  const match = response.data.match(/var scholarships = TAFFY\((\[.*\])\);/s);
  if (!match) throw new Error('DAAD data format changed');

  const raw: any[] = JSON.parse(match[1]);

  cachedData = raw.map((item): DAADScholarship => ({
    id: item.id,
    nameEn: item.nameEn || item.nameDe,
    introduction: item.introduction?.en || item.introduction?.de || '',
    subjectGroups: (item.subjectGrps as string[]).map(
      (code) => SUBJECT_GROUPS[code] ?? code
    ),
    intentions: (item.intentions as number[]).map(
      (id) => INTENTIONS[id] ?? String(id)
    ),
    targetStatus: (item.status as number[]).map(
      (id) => STATUS_LABELS[id] ?? String(id)
    ),
    isDaad: Boolean(item.isDaad),
    detailUrl: `https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?q=${encodeURIComponent(item.nameEn || item.nameDe)}`,
    source: 'daad',
  }));

  cacheTime = Date.now();
  return cachedData;
}

export async function searchDAAD(
  query: string,
  subjectGroup?: string,
  intention?: string,
  page = 1,
  pageSize = 10
): Promise<DAADSearchResult> {
  const all = await loadData();
  const q = query.toLowerCase().trim();

  let results = all.filter((s) => {
    const matchesQuery =
      s.nameEn.toLowerCase().includes(q) ||
      s.introduction.toLowerCase().includes(q) ||
      s.subjectGroups.some((g) => g.toLowerCase().includes(q)) ||
      s.intentions.some((i) => i.toLowerCase().includes(q)) ||
      s.targetStatus.some((t) => t.toLowerCase().includes(q));

    const matchesSubject = subjectGroup
      ? s.subjectGroups.some((g) =>
          g.toLowerCase().includes(subjectGroup.toLowerCase())
        )
      : true;

    const matchesIntention = intention
      ? s.intentions.some((i) =>
          i.toLowerCase().includes(intention.toLowerCase())
        )
      : true;

    return matchesQuery && matchesSubject && matchesIntention;
  });

  const total = results.length;
  const start = (page - 1) * pageSize;
  results = results.slice(start, start + pageSize);

  return { scholarships: results, total, source: 'daad' };
}

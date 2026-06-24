import type { BibleBook, BibleVerse } from "@/src/types/lumina";

type BibleJson = {
  book: string;
  abbrev: string;
  chapters: Record<string, { verse: Record<string, string> }>;
};

export type BibleBookData = BibleBook & {
  chapters: number[];
  versesByChapter: Record<number, BibleVerse[]>;
};

export const bibleCatalog: BibleBook[] = [
  { id: "gen", name: "Genesis", abbreviation: "Gn", testament: "old", order: 1 },
  { id: "exo", name: "Exodo", abbreviation: "Ex", testament: "old", order: 2 },
  { id: "lev", name: "Levitico", abbreviation: "Lv", testament: "old", order: 3 },
  { id: "num", name: "Numeros", abbreviation: "Nm", testament: "old", order: 4 },
  { id: "deu", name: "Deuteronomio", abbreviation: "Dt", testament: "old", order: 5 },
  { id: "jos", name: "Josue", abbreviation: "Js", testament: "old", order: 6 },
  { id: "jdg", name: "Juizes", abbreviation: "Jz", testament: "old", order: 7 },
  { id: "rut", name: "Rute", abbreviation: "Rt", testament: "old", order: 8 },
  { id: "1sa", name: "1 Samuel", abbreviation: "1Sm", testament: "old", order: 9 },
  { id: "2sa", name: "2 Samuel", abbreviation: "2Sm", testament: "old", order: 10 },
  { id: "1ki", name: "1 Reis", abbreviation: "1Rs", testament: "old", order: 11 },
  { id: "2ki", name: "2 Reis", abbreviation: "2Rs", testament: "old", order: 12 },
  { id: "1ch", name: "1 Cronicas", abbreviation: "1Cr", testament: "old", order: 13 },
  { id: "2ch", name: "2 Cronicas", abbreviation: "2Cr", testament: "old", order: 14 },
  { id: "ezr", name: "Esdras", abbreviation: "Ed", testament: "old", order: 15 },
  { id: "neh", name: "Neemias", abbreviation: "Ne", testament: "old", order: 16 },
  { id: "est", name: "Ester", abbreviation: "Et", testament: "old", order: 17 },
  { id: "job", name: "Jo", abbreviation: "Jo", testament: "old", order: 18 },
  { id: "psa", name: "Salmos", abbreviation: "Sl", testament: "old", order: 19 },
  { id: "pro", name: "Proverbios", abbreviation: "Pv", testament: "old", order: 20 },
  { id: "ecc", name: "Eclesiastes", abbreviation: "Ec", testament: "old", order: 21 },
  { id: "sol", name: "Canticos", abbreviation: "Ct", testament: "old", order: 22 },
  { id: "isa", name: "Isaias", abbreviation: "Is", testament: "old", order: 23 },
  { id: "jer", name: "Jeremias", abbreviation: "Jr", testament: "old", order: 24 },
  { id: "lam", name: "Lamentacoes", abbreviation: "Lm", testament: "old", order: 25 },
  { id: "eze", name: "Ezequiel", abbreviation: "Ez", testament: "old", order: 26 },
  { id: "dan", name: "Daniel", abbreviation: "Dn", testament: "old", order: 27 },
  { id: "hos", name: "Oseias", abbreviation: "Os", testament: "old", order: 28 },
  { id: "joe", name: "Joel", abbreviation: "Jl", testament: "old", order: 29 },
  { id: "amo", name: "Amos", abbreviation: "Am", testament: "old", order: 30 },
  { id: "oba", name: "Obadias", abbreviation: "Ob", testament: "old", order: 31 },
  { id: "jon", name: "Jonas", abbreviation: "Jn", testament: "old", order: 32 },
  { id: "mic", name: "Miqueias", abbreviation: "Mq", testament: "old", order: 33 },
  { id: "nah", name: "Naum", abbreviation: "Na", testament: "old", order: 34 },
  { id: "hab", name: "Habacuque", abbreviation: "Hc", testament: "old", order: 35 },
  { id: "zep", name: "Sofonias", abbreviation: "Sf", testament: "old", order: 36 },
  { id: "hag", name: "Ageu", abbreviation: "Ag", testament: "old", order: 37 },
  { id: "zec", name: "Zacarias", abbreviation: "Zc", testament: "old", order: 38 },
  { id: "mal", name: "Malaquias", abbreviation: "Ml", testament: "old", order: 39 },
  { id: "mat", name: "Mateus", abbreviation: "Mt", testament: "new", order: 40 },
  { id: "mar", name: "Marcos", abbreviation: "Mc", testament: "new", order: 41 },
  { id: "luk", name: "Lucas", abbreviation: "Lc", testament: "new", order: 42 },
  { id: "joh", name: "Joao", abbreviation: "Jo", testament: "new", order: 43 },
  { id: "act", name: "Atos", abbreviation: "At", testament: "new", order: 44 },
  { id: "rom", name: "Romanos", abbreviation: "Rm", testament: "new", order: 45 },
  { id: "1co", name: "1 Corintios", abbreviation: "1Co", testament: "new", order: 46 },
  { id: "2co", name: "2 Corintios", abbreviation: "2Co", testament: "new", order: 47 },
  { id: "gal", name: "Galatas", abbreviation: "Gl", testament: "new", order: 48 },
  { id: "eph", name: "Efesios", abbreviation: "Ef", testament: "new", order: 49 },
  { id: "phi", name: "Filipenses", abbreviation: "Fp", testament: "new", order: 50 },
  { id: "col", name: "Colossenses", abbreviation: "Cl", testament: "new", order: 51 },
  { id: "1th", name: "1 Tessalonicenses", abbreviation: "1Ts", testament: "new", order: 52 },
  { id: "2th", name: "2 Tessalonicenses", abbreviation: "2Ts", testament: "new", order: 53 },
  { id: "1ti", name: "1 Timoteo", abbreviation: "1Tm", testament: "new", order: 54 },
  { id: "2ti", name: "2 Timoteo", abbreviation: "2Tm", testament: "new", order: 55 },
  { id: "tit", name: "Tito", abbreviation: "Tt", testament: "new", order: 56 },
  { id: "phm", name: "Filemom", abbreviation: "Fm", testament: "new", order: 57 },
  { id: "heb", name: "Hebreus", abbreviation: "Hb", testament: "new", order: 58 },
  { id: "jam", name: "Tiago", abbreviation: "Tg", testament: "new", order: 59 },
  { id: "1pe", name: "1 Pedro", abbreviation: "1Pe", testament: "new", order: 60 },
  { id: "2pe", name: "2 Pedro", abbreviation: "2Pe", testament: "new", order: 61 },
  { id: "1jo", name: "1 Joao", abbreviation: "1Jo", testament: "new", order: 62 },
  { id: "2jo", name: "2 Joao", abbreviation: "2Jo", testament: "new", order: 63 },
  { id: "3jo", name: "3 Joao", abbreviation: "3Jo", testament: "new", order: 64 },
  { id: "jud", name: "Judas", abbreviation: "Jd", testament: "new", order: 65 },
  { id: "rev", name: "Apocalipse", abbreviation: "Ap", testament: "new", order: 66 },
];

const bibleLoaders: Record<string, () => Promise<{ default: BibleJson }>> = {
  "1ch": () => import("@/app/data/bible/1ch.json"),
  "1co": () => import("@/app/data/bible/1co.json"),
  "1jo": () => import("@/app/data/bible/1jo.json"),
  "1ki": () => import("@/app/data/bible/1ki.json"),
  "1pe": () => import("@/app/data/bible/1pe.json"),
  "1sa": () => import("@/app/data/bible/1sa.json"),
  "1th": () => import("@/app/data/bible/1th.json"),
  "1ti": () => import("@/app/data/bible/1ti.json"),
  "2ch": () => import("@/app/data/bible/2ch.json"),
  "2co": () => import("@/app/data/bible/2co.json"),
  "2jo": () => import("@/app/data/bible/2jo.json"),
  "2ki": () => import("@/app/data/bible/2ki.json"),
  "2pe": () => import("@/app/data/bible/2pe.json"),
  "2sa": () => import("@/app/data/bible/2sa.json"),
  "2th": () => import("@/app/data/bible/2th.json"),
  "2ti": () => import("@/app/data/bible/2ti.json"),
  "3jo": () => import("@/app/data/bible/3jo.json"),
  act: () => import("@/app/data/bible/act.json"),
  amo: () => import("@/app/data/bible/amo.json"),
  col: () => import("@/app/data/bible/col.json"),
  dan: () => import("@/app/data/bible/dan.json"),
  deu: () => import("@/app/data/bible/deu.json"),
  ecc: () => import("@/app/data/bible/ecc.json"),
  eph: () => import("@/app/data/bible/eph.json"),
  est: () => import("@/app/data/bible/est.json"),
  eze: () => import("@/app/data/bible/eze.json"),
  ezr: () => import("@/app/data/bible/ezr.json"),
  gal: () => import("@/app/data/bible/gal.json"),
  gen: () => import("@/app/data/bible/gen.json"),
  hab: () => import("@/app/data/bible/hab.json"),
  hag: () => import("@/app/data/bible/hag.json"),
  heb: () => import("@/app/data/bible/heb.json"),
  hos: () => import("@/app/data/bible/hos.json"),
  isa: () => import("@/app/data/bible/isa.json"),
  jam: () => import("@/app/data/bible/jam.json"),
  jdg: () => import("@/app/data/bible/jdg.json"),
  jer: () => import("@/app/data/bible/jer.json"),
  job: () => import("@/app/data/bible/job.json"),
  joe: () => import("@/app/data/bible/joe.json"),
  joh: () => import("@/app/data/bible/joh.json"),
  jon: () => import("@/app/data/bible/jon.json"),
  jos: () => import("@/app/data/bible/jos.json"),
  jud: () => import("@/app/data/bible/jud.json"),
  lam: () => import("@/app/data/bible/lam.json"),
  lev: () => import("@/app/data/bible/lev.json"),
  luk: () => import("@/app/data/bible/luk.json"),
  mal: () => import("@/app/data/bible/mal.json"),
  mar: () => import("@/app/data/bible/mar.json"),
  mat: () => import("@/app/data/bible/mat.json"),
  mic: () => import("@/app/data/bible/mic.json"),
  nah: () => import("@/app/data/bible/nah.json"),
  neh: () => import("@/app/data/bible/neh.json"),
  num: () => import("@/app/data/bible/num.json"),
  oba: () => import("@/app/data/bible/oba.json"),
  phm: () => import("@/app/data/bible/phm.json"),
  phi: () => import("@/app/data/bible/phi.json"),
  pro: () => import("@/app/data/bible/pro.json"),
  psa: () => import("@/app/data/bible/psa.json"),
  rev: () => import("@/app/data/bible/rev.json"),
  rom: () => import("@/app/data/bible/rom.json"),
  rut: () => import("@/app/data/bible/rut.json"),
  sol: () => import("@/app/data/bible/sol.json"),
  tit: () => import("@/app/data/bible/tit.json"),
  zec: () => import("@/app/data/bible/zec.json"),
  zep: () => import("@/app/data/bible/zep.json"),
};

export async function getBibleBookData(bookId: string): Promise<BibleBookData> {
  const metadata = bibleCatalog.find((book) => book.id === bookId) ?? bibleCatalog[57];
  const loader = bibleLoaders[metadata.id] ?? bibleLoaders.heb;
  const json = (await loader()).default;
  const chapters = Object.keys(json.chapters)
    .map(Number)
    .sort((a, b) => a - b);
  const versesByChapter = chapters.reduce<Record<number, BibleVerse[]>>((acc, chapter) => {
    const verses = json.chapters[String(chapter)]?.verse ?? {};
    acc[chapter] = Object.entries(verses)
      .map(([verse, text]) => ({
        id: `${metadata.id}-${chapter}-${verse}`,
        bookId: metadata.id,
        bookName: metadata.name,
        chapter,
        verse: Number(verse),
        text,
        translation: "Livre",
      }))
      .sort((a, b) => a.verse - b.verse);
    return acc;
  }, {});

  return {
    ...metadata,
    chapters,
    versesByChapter,
  };
}

export function filterVerses(verses: BibleVerse[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return verses;
  }

  return verses.filter((verse) => verse.text.toLowerCase().includes(normalizedQuery));
}

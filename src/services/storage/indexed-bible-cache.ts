import type { BibleBook, BibleVerse } from "@/src/types/lumina";

const DATABASE_NAME = "lumina-bible";
const DATABASE_VERSION = 1;

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB indisponivel neste ambiente."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains("books")) {
        database.createObjectStore("books", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("verses")) {
        const verses = database.createObjectStore("verses", { keyPath: "id" });
        verses.createIndex("bookId", "bookId", { unique: false });
        verses.createIndex("chapter", "chapter", { unique: false });
      }

      if (!database.objectStoreNames.contains("metadata")) {
        database.createObjectStore("metadata", { keyPath: "version" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function cacheBibleBook(book: BibleBook, verses: BibleVerse[]) {
  try {
    const database = await openDatabase();
    const transaction = database.transaction(["books", "verses", "metadata"], "readwrite");
    transaction.objectStore("books").put(book);
    verses.forEach((verse) => transaction.objectStore("verses").put(verse));
    transaction.objectStore("metadata").put({
      version: "local-json-v1",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    // IndexedDB is a performance cache; the app can keep reading from bundled JSON.
  }
}

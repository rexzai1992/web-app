export interface SavedPhoto {
  id: string;
  timestamp: number;
  dataUrl: string;
}

const DB_NAME = 'DeepBlueDB';
const STORE_NAME = 'gallery';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
        reject(new Error("IndexedDB not supported"));
        return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const savePhotoToGallery = async (dataUrl: string): Promise<void> => {
  try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const photo: SavedPhoto = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        dataUrl
      };
      await new Promise((resolve, reject) => {
        const req = store.add(photo);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      console.log('Photo saved to IndexedDB');
  } catch (e) {
      console.error("Error saving photo:", e);
      throw e;
  }
};

export const getGallery = async (): Promise<SavedPhoto[]> => {
  try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => {
            const res = req.result as SavedPhoto[];
            // Sort by newest first
            res.sort((a, b) => b.timestamp - a.timestamp);
            resolve(res);
        };
        req.onerror = () => reject(req.error);
      });
  } catch (e) {
      console.error("Error fetching gallery:", e);
      return [];
  }
};

export const deletePhotoFromGallery = async (id: string): Promise<SavedPhoto[]> => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
            const req = store.delete(id);
            req.onsuccess = () => resolve(undefined);
            req.onerror = () => reject(req.error);
        });
        return await getGallery();
    } catch (e) {
        console.error("Error deleting photo:", e);
        return [];
    }
};

export const clearGallery = async (): Promise<void> => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
            const req = store.clear();
            req.onsuccess = () => resolve(undefined);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("Error clearing gallery:", e);
    }
};
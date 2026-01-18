export interface SavedPhoto {
  id: string;
  timestamp: number;
  dataUrl: string;
}

const STORAGE_KEY = 'deep_blue_gallery';

export const savePhotoToGallery = async (dataUrl: string): Promise<void> => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    const photos: SavedPhoto[] = json ? JSON.parse(json) : [];
    
    const newPhoto: SavedPhoto = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      dataUrl
    };
    
    // Add new photo to the beginning
    const updated = [newPhoto, ...photos];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('Photo saved to LocalStorage');
    } catch (e) {
      console.error("LocalStorage quota exceeded", e);
      alert("Gallery storage is full! The photo was downloaded, but could not be saved to the admin history.");
    }
  } catch (e) {
    console.error("Error saving photo:", e);
    throw e;
  }
};

export const getGallery = async (): Promise<SavedPhoto[]> => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const photos = JSON.parse(json) as SavedPhoto[];
    // Sort by newest first
    return photos.sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Error fetching gallery:", e);
    return [];
  }
};

export const deletePhotoFromGallery = async (id: string): Promise<SavedPhoto[]> => {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) return [];
        
        const photos = JSON.parse(json) as SavedPhoto[];
        const updated = photos.filter(p => p.id !== id);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error("Error deleting photo:", e);
        return [];
    }
};

export const clearGallery = async (): Promise<void> => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error("Error clearing gallery:", e);
    }
};
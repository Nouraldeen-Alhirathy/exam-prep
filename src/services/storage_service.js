import LocalStorageService from './localstorage_service.js';
import IndexedDBService from './indexed_db_service.js';

class StorageService {
    constructor() {
        if (!StorageService.instance) {
            this.storageService = window.indexedDB ? new IndexedDBService() : new LocalStorageService();
            StorageService.instance = this; // Store instance
        }
        return StorageService.instance;
    }

    getService() {
        return this.storageService;
    }
}

// Export a single instance of StorageService as storageService
const storageService = new StorageService();
Object.freeze(storageService); // Ensure instance is not modified

export default storageService;

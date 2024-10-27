import IStorage from './storage_interface.js';

class LocalStorageService extends IStorage {
    async save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    async get(key) {
        const storedValue = localStorage.getItem(key);
        
        return storedValue ? JSON.parse(storedValue) : null;
    }

    async remove(key) {
        localStorage.removeItem(key);
    }
}

export default LocalStorageService;

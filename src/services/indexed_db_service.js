import IStorage from './storage_interface.js';

class IndexedDBService extends IStorage {
    dbName = "ExamPrepDB";
    dbVersion = 1;
    qbStore = "QBankStore";

    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.qbStore)) {
                    db.createObjectStore(this.qbStore);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.errorCode);
        });
    }

    async save(key, value) {
        const db = await this.openDB();
        const transaction = db.transaction([this.qbStore], "readwrite");
        const store = transaction.objectStore(this.qbStore);
        return new Promise((resolve, reject) => {
            const request = store.put(value, key);  // store the value directly with the key
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.errorCode);
        });
    }

    async get(key) {
        const db = await this.openDB();
        const transaction = db.transaction([this.qbStore], "readonly");
        const store = transaction.objectStore(this.qbStore);
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result || null);  // return the result directly
            request.onerror = (event) => reject(event.target.errorCode);
        });
    }

    async remove(key) {
        const db = await this.openDB();
        const transaction = db.transaction([this.qbStore], "readwrite");
        const store = transaction.objectStore(this.qbStore);
        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.errorCode);
        });
    }
}

export default IndexedDBService;

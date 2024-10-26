export default class IStorage {
    async save(key, value) {
        throw new Error("Method 'save()' must be implemented.");
    }

    async get(key) {
        throw new Error("Method 'get()' must be implemented.");
    }
}

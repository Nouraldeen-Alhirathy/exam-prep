import { fetchAllQBankConfigs } from './controllers/qb_controller.js'
import storageService from './services/storage_service.js';
import { showSelectionDialog } from './common/select_dialog.js';

// parse qb-id from url
const urlParams = new URLSearchParams(window.location.search);
const storage = storageService.getService();
let qbId = urlParams.get('qb-id');
let qbConfigs = [];
let qbConfig;

// load qb config
async function loadQbConfig() {
    const storedId = await storage.get('qbId');
    const config = await storage.get('qbConfig');

    if (!config || !storedId || (qbId && storedId !== qbId)) {
        qbConfigs = await fetchAllQBankConfigs();
    } else {
        qbConfig = config;
        qbId = storedId;
        return;
    }
    // get qbconfigs object keys array
    const qbIds = Object.keys(qbConfigs);
    const qbTitles = qbIds.map(id => `${qbConfigs[id].title} - ${qbConfigs[id].count}`);

    if ((qbId && !qbConfigs[qbId]) || !qbId) {
        const selection = await showSelectionDialog(qbTitles, 'Select Question Bank');
        qbId = qbIds[selection];
    }
    qbConfig = qbConfigs[qbId];

    await storage.save('qbId', qbId);
    await storage.save('qbConfig', qbConfig);
}

await loadQbConfig();

export { qbConfig, qbId };
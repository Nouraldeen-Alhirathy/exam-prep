import { fetchAllQBankConfigs } from './controllers/qb_controller.js'
import storageService from './services/storage_service.js';

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
    const qbTitles = qbIds.map(id => qbConfigs[id].title);

    if ((qbId && !qbConfigs[qbId]) || !qbId) {
        const selection = await showSelectionDialog(qbTitles);
        qbId = qbIds[selection];
    }
    qbConfig = qbConfigs[qbId];

    await storage.save('qbId', qbId);
    await storage.save('qbConfig', qbConfig);
}

// display dialog with all available qbs for the user to select from
async function showSelectionDialog(options) {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('dialog-overlay'); // Add CSS class

        // Create dialog container
        const dialog = document.createElement('div');
        dialog.classList.add('dialog-container'); // Add CSS class

        // Title
        const title = document.createElement('h3');
        title.classList.add('dialog-title'); // Add CSS class
        title.innerText = 'Select Question Bank';
        dialog.appendChild(title);

        // Options
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.classList.add('dialog-button'); // Add CSS class
            button.innerText = option;

            button.addEventListener('click', () => {
                resolve(index); // Resolve the promise with selected option
                document.body.removeChild(overlay); // Remove overlay
            });

            dialog.appendChild(button);
        });

        // Append dialog to overlay and overlay to body
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    });
}

await loadQbConfig();

export { qbConfig, qbId };
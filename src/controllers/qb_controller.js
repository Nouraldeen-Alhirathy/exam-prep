// qb_controller.js

import { QBank } from '../models/qb.js';
import storageService from '../services/storage_service.js';

const configsUrl = 'https://raw.githubusercontent.com/Mohammed-Al-Zubiri/exam-prep-api/refs/heads/main/qb_configs.json';
const storage = storageService.getService();

async function fetchAllQBankConfigs() {
    try {
        const response = await fetch(configsUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error fetching qb configs:', error);
        throw error;
    }
    
}

async function fetchQBankData(url, qbId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const qb = QBank.parseQuestions(jsonData);

        console.log(qbId);
        
        await storage.save(qbId, qb);
        await storage.save('isShownFlags', []);
        await storage.save('showAllAnswers', false);

        console.log('QBank fetched from API and saved to storage.');
        return qb;
    } catch (error) {
        console.error('Error fetching qb from API:', error);
        throw error;
    }
}

async function loadQBankData(qbId, config) {
    const url = config["url"];
    const needsUpdate = await storage.get('needsUpdate');
    if (needsUpdate) {
        console.log(`New version of ${qbId} QB found, fetching from API...`);
        return await fetchQBankData(url, qbId);
    }

    const storedQBank = await storage.get(qbId);
    if (!storedQBank) {
        console.log(`No ${qbId} QB found in storage, fetching from API...`);
        await storage.save('needsUpdate', false);
        return await fetchQBankData(url, qbId);
    }

    console.log(`${qbId} QB loaded from storage.`);
    return storedQBank;
}

export { fetchAllQBankConfigs, loadQBankData };

import './common/imports.js';
import '../styles/components/generator_form.css';
import { qbConfig } from './qb_config.js';
import storageService from './services/storage_service.js';

const storage = storageService.getService();
await checkStoredQuizConfig();

// Get query params
const urlParams = new URLSearchParams(window.location.search);

// DOM Elements
const form = document.querySelector('form');
const qNumInput = document.getElementById('qnum');
const qNumRange = document.getElementById('qnum-range');
const isAllChb = document.getElementById('all');
const shQuesChb = document.getElementById('shuffle-questions');
const shChoicesChb = document.getElementById('shuffle-choices');

// Set UI
await restoreFormData();
handleInvalidQuantity(qbConfig);
qNumInput.setAttribute('max', qbConfig["count"]);
qNumInput.value = !qNumInput.value || qNumInput.value > qbConfig["count"] ? qbConfig["count"] : qNumInput.value;
qNumRange.textContent = `1-${qbConfig["count"]}:`;
if (isAllChb.checked) {
    qNumInput.setAttribute("disabled", "disabled");
} else {
    qNumInput.focus();
}

// Query params error handling
function handleInvalidQuantity(config) {
    const error = urlParams.get('error');
    if (error && error === 'invlid_quantity') {
        alert(`Error: Quantity must be between 1 and ${config["count"]}`);
    }
}

async function restoreFormData() {
    const formData = await storage.get('quizForm');
    
    if (formData) {
        qNumInput.value = formData[0];
        isAllChb.checked = formData[1];
        shQuesChb.checked = formData[2];
        shChoicesChb.checked = formData[3];
    }
}

async function checkStoredQuizConfig() {
    const quizConfig = await storage.get('quizConfig');
    if (quizConfig) {
        if (confirm("You have an unfinished quiz. Do you want to continue?\nCancel to start a new quiz.")) {
            // navigate to quiz
            window.location.href = './practice_quiz.html';
        } else {
            await storage.remove('quizConfig');
        }
    }
}

// Form Validation
const qnumRegex = /^\d+$/;
qNumInput.addEventListener('input', (e) => {
    const currentValue = e.target.value;

    if (!qnumRegex.test(currentValue)) {
        e.target.value = currentValue.slice(0, -1);
    } else if (currentValue && (parseInt(currentValue) < 1 || parseInt(currentValue) > qbConfig["count"])) {
        e.target.value = currentValue.slice(0, -1);
    }
});

// Event Listeners
isAllChb.addEventListener('change', async event => {
    if (event.target.checked) {
        qNumInput.value = qbConfig["count"];
        qNumInput.setAttribute("disabled", "disabled");
    } else {
        qNumInput.removeAttribute("disabled");
        qNumInput.focus();
    }
});


form.addEventListener('submit', async (e) => {
    let quizForm = [];
    quizForm.push(qNumInput.value);
    quizForm.push(isAllChb.checked);
    quizForm.push(shQuesChb.checked);
    quizForm.push(shChoicesChb.checked);
    
    await storage.save('quizForm', quizForm);
});

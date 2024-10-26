import './common/imports.js';
import '../styles/components/generator_form.css';
import { qbConfig } from './qb_config.js';

// Get query params
const urlParams = new URLSearchParams(window.location.search);

// DOM Elements
const qNumInput = document.getElementById('qnum');
const qNumRange = document.getElementById('qnum-range');
const isAllChb = document.getElementById('all');

// Get QBank Questions Number from config
handleInvalidQuantity(qbConfig);
qNumInput.setAttribute('max', qbConfig["count"]);
qNumInput.value = parseInt(qNumInput.value) > qbConfig["count"] ? qbConfig["count"] : qNumInput.value;
qNumRange.textContent = `1-${qbConfig["count"]}:`;

// Query params error handling
function handleInvalidQuantity(config) {
    const error = urlParams.get('error');
    if (error && error === 'invlid_quantity') {
        alert(`Error: Quantity must be between 1 and ${config["count"]}`);
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
isAllChb.addEventListener('change', event => {
    if (event.target.checked) {
        qNumInput.value = qbConfig["count"];
    } else {
        qNumInput.focus();
    }
    qNumInput.toggleAttribute('disabled');
});


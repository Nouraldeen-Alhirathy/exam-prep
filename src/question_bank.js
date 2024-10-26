import './common/imports.js';
import '../styles/components/mcq.css'
import { loadQBankData } from './controllers/qb_controller.js'
import storageService from './services/storage_service.js';
import { qbConfig, qbId } from './qb_config.js';

// Variables
const storage = storageService.getService();
const FLAGS_KEY = 'isShownFlags';
const SHOW_ALL_KEY = 'showAllAnswers';
let correctIndices = [];
let isShownFlags = [];
let showAllAnswers = false;

// SVG icons
const showAnswerIcon = `<svg width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 82 512 320"><path d="M0 226v32c128 192 384 192 512 0v-32C384 34 128 34 0 226m256 144c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128m0-200c0-8.3 1.7-16.1 4.3-23.6-1.5-.1-2.8-.4-4.3-.4-53 0-96 43-96 96s43 96 96 96 96-43 96-96c0-1.5-.4-2.8-.4-4.3-7.4 2.6-15.3 4.3-23.6 4.3-39.8 0-72-32.2-72-72"/></svg>`;
const hideAnswerIcon = `<svg width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 82 512 320"><path d="M0 226v32c128 192 384 192 512 0v-32C384 34 128 34 0 226m256 144c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128m0-200c0-8.3 1.7-16.1 4.3-23.6-1.5-.1-2.8-.4-4.3-.4-53 0-96 43-96 96s43 96 96 96 96-43 96-96c0-1.5-.4-2.8-.4-4.3-7.4 2.6-15.3 4.3-23.6 4.3-39.8 0-72-32.2-72-72"/><path stroke="#000" stroke-width="30" d="m0 82 512 320"/><path stroke="#fff" stroke-width="15" d="m0 67 522 325"/></svg>`;

// DOM Elements - Static
const subtitle = document.querySelector('.subtitle');
subtitle.textContent = `${qbConfig.title} QB`;
const main = document.getElementById('main');
const moreButton = document.getElementById('more');
const options = document.getElementById('options');
const showAnswersChb = document.getElementById('show-answers-chb');


// DOM Elements - Dynamic
let showAnswerButtons;
let choicesElements;

// Loading Data

// Load and display qb data
await loadQBankData(qbId, qbConfig)
    .then(async(qb) => {
        correctIndices = qb.questions.map(question => question.answer);
        isShownFlags = await storage.get(FLAGS_KEY);
        showAllAnswers = await storage.get(SHOW_ALL_KEY);
        displayQBank(qb);
    })
    .catch(error => {
        console.error('Error loading qb data:', error);
    });

// New DOM Elements
showAnswerButtons = document.querySelectorAll('.show-answer');
choicesElements = document.querySelectorAll('.choices');

// Set Default UI
showAnswersChb.checked = showAllAnswers;

// Functions
function displayQBank(qb) {
    const qbContainer = main;

    qb.questions.forEach((question, index) => {
        // Create the question element
        const questionElement = document.createElement('div');
        questionElement.classList.add('mcq');

        // Create the question title (the question itself)
        const questionTitle = document.createElement('p');
        questionTitle.classList.add('question');
        questionTitle.textContent = `${index + 1}. ${question.title}`;

        // Create the choices container
        const choicesContainer = document.createElement('div');
        choicesContainer.classList.add('choices');

        // Create choices
        question.choices.forEach((choice, choiceIndex) => {
            const choiceElement = document.createElement('div');
            choiceElement.classList.add('choice');

            choiceElement.textContent = `${choice}`;
            choicesContainer.appendChild(choiceElement);
        });

        const isShown = isShownFlags && isShownFlags[index];
        // Mark the correct answer
        if (isShown) {
            choicesContainer.children[question.answer].classList.add('correct');
        }

        // Create the "show answer" button
        const showAnswerButton = document.createElement('button');
        showAnswerButton.classList.add('show-answer');
        showAnswerButton.innerHTML = isShown ? hideAnswerIcon : showAnswerIcon;

        // Append the question title, choices, and show answer button to the question element
        questionElement.appendChild(questionTitle);
        questionElement.appendChild(choicesContainer);
        questionElement.appendChild(showAnswerButton);

        // Append the entire question element to the qb container
        qbContainer.appendChild(questionElement);
    });
}

// Event listeners
showAnswerButtons.forEach((button, index) => {
    button.addEventListener('click', event => {
        const question = event.currentTarget.parentElement;
        const correctIndex = correctIndices[index];

        // Hide/show the correct answer
        question.querySelector('.choices').children[correctIndex].classList.toggle('correct');

        // Toggle the button icon
        event.currentTarget.innerHTML = isShownFlags[index] ? showAnswerIcon : hideAnswerIcon;
        isShownFlags[index] = !isShownFlags[index];
    });
});

moreButton.addEventListener('click', event => {
    options.classList.toggle('hidden');
});

showAnswersChb.addEventListener('change', event => {
    showAllAnswers = event.target.checked;
    if (!showAllAnswers) {
        for (let i = 0; i < correctIndices.length; i++) {
            isShownFlags[i] = false;
            showAnswerButtons[i].innerHTML = showAnswerIcon;
            choicesElements[i].children[correctIndices[i]].classList.remove('correct');
        }
    } else {
        for (let i = 0; i < correctIndices.length; i++) {
            isShownFlags[i] = true;
            showAnswerButtons[i].innerHTML = hideAnswerIcon;
            choicesElements[i].children[correctIndices[i]].classList.add('correct');
        }
    }
});

window.addEventListener('click', (event) => {
    if (!moreButton.contains(event.target)) {
        options.classList.add('hidden');
    }
});

window.addEventListener('beforeunload', async () => {
    await storage.save(FLAGS_KEY, isShownFlags);
    await storage.save(SHOW_ALL_KEY, showAllAnswers);
});

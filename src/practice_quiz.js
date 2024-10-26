import './common/imports.js';
import '../styles/components/quiz_mcq.css'
import { loadQBankData } from './controllers/qb_controller.js';
import { qbConfig, qbId } from './qb_config.js';
import storageService from './services/storage_service.js';

const storage = storageService.getService();
const quizConfig = await storage.get('quizConfig');

// Parse query params
const urlParams = new URLSearchParams(window.location.search);
const quantity = parseInt(urlParams.get('qnum')) || qbConfig["count"];
const shuffleQuestions = urlParams.get('shuffle-questions');
const shuffleChoices = urlParams.get('shuffle-choices');

// Variables
let mcqs = [];
let correctIndices = [];
let mcqCounter = 0;
let isConfirmed = false;
let correctCount = 0;

// MCQ Elements
const moreButton = document.getElementById('more');
const options = document.getElementById('options');
const quizMcq = document.getElementById('quiz-mcq');
const question = quizMcq.querySelector('.question');
const choices = quizMcq.querySelector('.choices');
const choiceBtns = choices.children;
const next = document.getElementById('next');

// Quiz Result Elements
const quizResult = document.getElementById('quiz-result');
const resultFeedback = document.getElementById('feedback');
const resultScore = document.getElementById('score');
const resultTotal = document.getElementById('total');
const newQuiz = document.getElementById('new-quiz');
const mainMenu = document.getElementById('to-main');

// Load and display qb data
if (quizConfig) {
    validateQuantity(quizConfig["count"]);
    mcqs = getMcqs(quizConfig["mcqs"]);
    correctIndices = mcqs.map(question => question.answer);
    mcqCounter = quizConfig["mcqCounter"];
    correctCount = quizConfig["correctCount"];
    displayMcq(mcqs[mcqCounter]);
} else {
    await loadQBankData(qbId, qbConfig)
        .then(qb => {
            validateQuantity(qb.questions.length);
            mcqs = getMcqs(qb.questions);
            
            correctIndices = mcqs.map(question => question.answer);
            displayMcq(mcqs[mcqCounter]);
        })
        .catch(error => {
            console.error('Error loading qb data:', error);
        });

}

// Functions

// Validate quantity
function validateQuantity(max) {
    if (quantity < 1 || quantity > max) {
        window.location.href = `quiz_generator.html?error=invlid_quantity`;
    }
}

// Shuffle Questions

// Get MCQs
function getMcqs(questions) {
    let mcqs = shuffleQuestions ? randomSelectMcqs(questions, quantity) : questions.slice(0, quantity);

    if (shuffleChoices) {
        mcqs.forEach(mcq => {
            mcq.choices = randomizeChoices(mcq);
        });
    }

    return mcqs;
}

function randomizeChoices(mcq) {
    const arr = mcq.choices;
    const correctAnswer = arr[mcq.answer]; // Store initial index of the correct answer

    // Shuffle choices
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // Update mcq.answer to new index of the correct answer
    mcq.answer = arr.indexOf(correctAnswer);
    return arr;
}


function randomSelectMcqs(arr, max) {
    const copyArr = [...arr];
    const result = [];

    for (let i = 0; i < max; i++) {
        const randomIndex = Math.floor(Math.random() * copyArr.length);
        result.push(copyArr[randomIndex]);

        copyArr.splice(randomIndex, 1); // Remove the chosen element
    }

    return result;
}


// Initialize Quiz
async function resetQuiz() {
    mcqCounter = 0;
    correctCount = 0;
    isConfirmed = false;

    const quizConfig = null;

    await storage.save('quizConfig', quizConfig);
}

// Display Question
function displayMcq(mcq) {
    const counter = mcqCounter + 1;
    question.textContent = `${counter}. ${mcq.title}`;
    mcq.choices.forEach((choice, index) => {
        choiceBtns[index].textContent = choice;
    });
}

// Display Result
function displayResult() {
    resultFeedback.textContent = getResultFeedback(correctCount);
    resultScore.textContent = correctCount;
    resultTotal.textContent = mcqs.length;
}

function getResultFeedback(score) {
    if (score >= 0.9 * mcqs.length) {
        return 'Fantastic! You Are A Big Dafoor!';
    }

    if (score >= 0.7 * mcqs.length) {
        return 'Great job, keep going!';
    }

    if (score >= 0.5 * mcqs.length) {
        return 'Not bad, you just need more practice!';
    } else {
        return 'Nice try, study more and come back!';
    }
}

function getCorrectAnswer(qindex) {
    return mcqs[qindex].choices[correctIndices[qindex]];
}

// Event listeners
for (let i = 0; i < choiceBtns.length; i++) {
    choiceBtns[i].addEventListener('click', () => {
        if (isConfirmed) {
            return;
        }
        choices.querySelector('.selected')?.classList.remove('selected');
        choiceBtns[i].classList.add('selected');
    });
}

next.addEventListener('click', async () => {
    const selection = choices.querySelector('.selected');

    // Check if counter is at the end
    if (mcqCounter >= mcqs.length) {
        quizMcq.classList.add('hidden');
        quizResult.classList.remove('hidden');
        displayResult();
        await resetQuiz();
        return;
    }

    // Toggle from 'Next' to 'Confirm'
    if (isConfirmed) {
        next.textContent = 'Confirm';
        displayMcq(mcqs[mcqCounter]);
        choices.querySelector('.correct')?.classList.remove('correct');
        selection.className = '';
        isConfirmed = false;

        return;
    }

    // Check if the user has selected an answer
    if (!selection) {
        alert('Please select an answer!');
        return;
    }
    isConfirmed = true;

    if (selection.textContent === getCorrectAnswer(mcqCounter)) {
        selection.classList.add('correct');
        correctCount++;
    } else {
        selection.classList.add('incorrect');

        const correctAnswer = getCorrectAnswer(mcqCounter);
        choiceBtns[correctIndices[mcqCounter]].classList.add('correct');
    }

    if (++mcqCounter < mcqs.length) {
        next.textContent = 'Next';
    } else {
        next.textContent = 'Result';
    }
});

newQuiz.addEventListener('click', () => {
    window.location.href = 'quiz_generator.html';
});

mainMenu.addEventListener('click', () => {
    window.location.href = '/';
});

window.addEventListener('beforeunload', async () => {
    const quizConfig = {
        mcqs: mcqs,
        mcqCounter: mcqCounter,
        correctCount: correctCount
    };

    await storage.save('quizConfig', quizConfig);
});

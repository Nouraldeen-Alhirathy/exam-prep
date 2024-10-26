import './common/imports.js';
import { qbConfig } from './qb_config.js';

// DOM Elements
const header = document.querySelector('header');
const title = header.querySelector('h2');
const qbCardSubtitle = document.querySelector('#question-bank p');

// Set UI   


title.textContent = `${qbConfig["code"]} Exam Prep`;

qbCardSubtitle.textContent = `${qbConfig["title"]} Question Bank`;


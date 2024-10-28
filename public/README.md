# ExamPrep

## Project Description

ExamPrep is a simple app that turns written question banks into an interactive learning experience, allowing users to study and/or test their knowledge in the subject of the question bank. The app provides a variety of features to enhance the learning process:

- **Question Bank**: Users can study a collection of questions organized in a question bank. The questions are displayed with options to show or hide answers.
- **Quiz Generator**: Users can generate quizzes based on the question bank. The quizzes can be customized with options like the number of questions, shuffling questions, and shuffling choices.
- **Practice Quiz**: Users can take practice quizzes generated from the question bank. The result is displayed at the end of the quiz.
- **Storage Services**: The project uses IndexedDB or LocalStorage to save and retrieve quiz configurations and user preferences.
- **Responsive Design**: The project includes various CSS utilities and components to ensure a responsive and visually appealing user interface.

The project structure includes HTML files for different pages, JavaScript files for functionality, and CSS files for styling.

## Installation Instructions

1. **Install Node.js and npm**: Ensure you have Node.js and npm installed on your machine. You can download and install them from [nodejs.org](https://nodejs.org).

2. **Navigate to Project Directory**: Open a terminal and navigate to your project directory.
    ```sh
    cd c:\Users\CS-LEGEND\Documents\WebProjects\exam-prep
    ```

3. **Install Dependencies**: Run the following command to install the project dependencies listed in `package.json`.
    ```sh
    npm install
    ```

4. **Run Development Server**: Start the development server using Vite.
    ```sh
    npm run dev
    ```

5. **Build the Project**: To create a production build, run:
    ```sh
    npm run build
    ```

6. **Preview the Build**: To preview the production build, run:
    ```sh
    npm run preview
    ```

## Question Bank Format

Question banks are uploaded into another GitHub repository: [https://github.com/Mohammed-Al-Zubiri/exam-prep-api](https://github.com/Mohammed-Al-Zubiri/exam-prep-api).

### `qb_configs.json`

This file contains the configuration for the question banks. It is fetched from:
[https://raw.githubusercontent.com/Mohammed-Al-Zubiri/exam-prep-api/refs/heads/main/qb_configs.json](https://raw.githubusercontent.com/Mohammed-Al-Zubiri/exam-prep-api/refs/heads/main/qb_configs.json)

### Example Question Bank:
[https://raw.githubusercontent.com/Mohammed-Al-Zubiri/exam-prep-api/refs/heads/main/qbs/research.json](https://raw.githubusercontent.com/Mohammed-Al-Zubiri/exam-prep-api/refs/heads/main/qbs/research.json)


## Usage Instructions

Explore the live version of the app at:
[https://exam-prep-azure.vercel.app](https://exam-prep-azure.vercel.app)

## Contribution Guidelines

- **Code Style**: Follow the existing code style and conventions.
- **Testing**: Write unit tests for new features and bug fixes.
- **Documentation**: Update documentation to reflect your changes.
- **Review**: Be open to feedback and make necessary revisions.

## Contact Information

For any questions or support, please contact us via our Telegram Contact Bot: [https://t.me/ExamPrepContactBot](https://t.me/ExamPrepContactBot)
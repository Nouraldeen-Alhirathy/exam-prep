import { Question } from './question.js';

class QBank {
    constructor(questions = []) {
        this.questions = questions;
    }

    static parseQuestions(jsonArray) {
        return new QBank(
            jsonArray.map(json => {
                let question = new Question();
                question.fromJSON(json);
                return question;
            })
        );
    }
}

export { QBank };
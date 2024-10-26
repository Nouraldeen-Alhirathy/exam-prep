class Question {
    constructor(title, choices, answer) {
        this.title = title;
        this.choices = choices;
        this.answer = answer;
    }

    fromJSON(json) {
        this.title = json['t'];
        this.choices = json['c'];
        this.answer = json['a'];
    }
}

export { Question };
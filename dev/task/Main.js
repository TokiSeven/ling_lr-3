'use strict';

export default class Main{
    constructor(str = ""){
        this.setData(str);

        this.Operator = {
            ASSIGN: "ASSIGN",
            ADD: "ADD",
            SUBTRACT: "SUBTRACT",
            MULTIPLY: "MULTIPLY",
            DIVIDE: "DIVIDE"
        }

        this.NodeType = {
            OPERATOR: "OPERATOR",
            ID: "ID",
            CONSTANT: "CONSTANT"
        }

        this.ParserState = {
            INIT: "INIT",
            ID: "ID",
            CONST: "CONST",
            OP: "OP",
            OPENING: "OPENING",
            CLOSING: "CLOSING",
            ERROR: "ERROR"
        }
    }

    setData(str){
        this.data = str;
    }

    isLetter(str){
        return str.match(/[a-zA-Z]/i);
    }

    isDigit(str){
        return str.match(/[0-9]/i);
    }

    parse(exp) {
        console.log(exp);
        if (exp == null || exp.length == 0)
            return null;

        if (exp.match(/\\([a-zA-Z0-9+*-/]+\\)/))
            exp = exp.substr(1, exp.length - 1);
        if (exp[0] == "-") {
            let node = {
                type: this.Operator.SUBTRACT,
                left: this.parse(exp.substr(1)),
                right: null
            }
            return node;
        }

        let state = this.ParserState.INIT;
        let value = [];
        for (let i = exp.length - 1; i >= 0; i--) {
            let c = exp.charAt(i);
            if (this.isLetter(c)) {
                if (state == this.ParserState.OPENING)
                    return null;
                state = this.ParserState.ID;
                value.push(c);
            } else if (this.isDigit(c)) {
                switch (state) {
                    case this.ParserState.ID:
                        value.push(c);
                        break;
                    case this.ParserState.INIT:
                        state = this.ParserState.CONST;
                        value.push(c);
                        break;
                    case this.ParserState.OPENING:
                        return null;
                    default:
                        state = this.ParserState.CONST;
                        value.push(c);
                        break;
                }
            } else if (c == '=' || c == '+' || c == '-') {
                let operator;
                let node = {
                    left: null,
                    right: null,
                    type: null
                };
                switch (state) {
                    case this.ParserState.ID:
                        state = this.ParserState.OP;
                        operator = this.Operator.ASSIGN;
                        switch (c) {
                            case '=':
                                operator = this.Operator.ASSIGN;
                                break;
                            case '+':
                                operator = this.Operator.ADD;
                                break;
                            case '-':
                                operator = this.Operator.SUBTRACT;
                                break;
                            default:
                                break;
                        }
                        node = {
                            type: operator,
                            left: null,
                            right: null
                        };
                        if (0 - i == 0) {
                            value.push(c);
                        }
                        node.right = this.parse(value.join(""));
                        node.left = this.parse(exp.substr(0, i));
                        return node;
                    case this.ParserState.CONST:
                        state = this.ParserState.OP;
                        operator = this.Operator.ASSIGN;
                        switch (c) {
                            case '=':
                                operator = this.Operator.ASSIGN;
                                break;
                            case '+':
                                operator = this.Operator.ADD;
                                break;
                            case '-':
                                operator = this.Operator.SUBTRACT;
                                break;
                            default:
                                break;
                        }
                        node = {
                            type: operator,
                            left: null,
                            right: null
                        }
                        if (0 - i == 0) {
                            value.push(c);
                        }
                        node.right = this.parse(value.join(""));
                        node.left = this.parse(exp.substr(0, i));
                        return node;
                    case this.ParserState.OPENING:
                        state = this.ParserState.OP;
                        operator = this.Operator.ASSIGN;
                        switch (c) {
                            case '=':
                                operator = this.Operator.ASSIGN;
                                break;
                            case '+':
                                operator = this.Operator.ADD;
                                break;
                            case '-':
                                operator = this.Operator.SUBTRACT;
                                break;
                            default:
                                break;
                        }
                        node = {
                            type: operator,
                            left: null,
                            right: null
                        };
                        if (0 - i == 0) {
                            value.push(c);
                        }
                        node.right = this.parse(value.join(""));
                        node.left = this.parse(exp.substr(0, i));
                        return node;
                    case this.ParserState.INIT:
                        value.push(c);
                        break;
                    case this.ParserState.OP:
                        value.push(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == '*' || c == '/') {
                switch (state) {
                    case this.ParserState.ID:
                    case this.ParserState.CONST:
                    case this.ParserState.OPENING:
                        state = this.ParserState.OP;
                        value.push(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == '(') {
                switch (state) {
                    case this.ParserState.CONST:
                    case this.ParserState.ID:
                        state = this.ParserState.OPENING;
                        value.push(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == ')') {
                let j = i;
                switch (state) {
                    case this.ParserState.INIT:
                    case this.ParserState.OP:
                        while (c != '(' && i > 0) {
                            c = exp.charAt(--i);
                        }
                        if (i < 0) throw "Не сбалансированы скобки";
                        value.push(exp.substr(i, j));
                        state = this.ParserState.OPENING;
                        break;
                    default:
                        return null;
                }
            } else {
                throw "String is incorrect";
                return null;
            }
        }

        state = this.ParserState.INIT;
        value = [];
        for (let i = exp.length - 1; i >= 0; i--) {
            let c = exp.charAt(i);
            if (this.isLetter(c)) {
                switch (state) {
                    case this.ParserState.OPENING:
                        return null;
                    default:
                        state = this.ParserState.ID;
                        value.push(c);
                        break;
                }
            } else if (this.isDigit(c)) {
                switch (state) {
                    case this.ParserState.ID:
                        value.push(c);
                        break;
                    case this.ParserState.INIT:
                        state = this.ParserState.CONST;
                        value.push(c);
                        break;
                    case this.ParserState.OPENING:
                        return null;
                    default:
                        state = this.ParserState.CONST;
                        value.push(c);
                        break;
                }
            } else if (c == '-' || c == '+') {
                switch (state) {
                    case this.ParserState.INIT:
                        value.push(c);
                        break;
                    case this.ParserState.OP:
                        value.push(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == '*' || c == '/') {
                switch (state) {
                    case this.ParserState.ID:
                    case this.ParserState.CONST:
                    case this.ParserState.OPENING:
                        let operator = this.Operator.MULTIPLY;
                        switch (c) {
                            case '*': operator = this.Operator.MULTIPLY; break;
                            case '/': operator = this.Operator.DIVIDE; break;
                        }
                        return {
                            type: operator,
                            left: this.parse(exp.substr(0, i)),
                            right: this.parse(value.join(""))
                        };
                    default:
                        return null;
                }
            } else if (c == '(') {
                switch (state) {
                    case this.ParserState.CONST:
                    case this.ParserState.ID:
                        state = this.ParserState.OPENING;
                        value.push(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == ')') {
                let j = i + 1;
                switch (state) {
                    case this.ParserState.INIT:
                    case this.ParserState.OP:
                        while (c != '(' && i > 0) {
                            c = exp.charAt(--i);
                        }
                        if (i < 0) throw "Не сбалансированы скобки";
                        value.push(exp.substr(i, j));
                        state = this.ParserState.OPENING;
                        break;
                    default:
                        return null;
                }
            } else {
                return null;
            }
        }

        if (state == this.ParserState.ID) {
            if (value.join("")[0] == "-") {
                let node = {
                    type: this.Operator.SUBTRACT,
                    left: null,
                    right: null
                }
                node.left = {
                    type: value.join("").substr(1),
                    left: null,
                    right: null
                };
                return node;
            }
            return {
                type: value.join(""),
                left: null,
                right: null
            };
        }
        else if (state == this.ParserState.CONST) {
            if (value.join("")[0] == "-") {
                let node = {
                    type: this.Operator.SUBTRACT,
                    left: null,
                    right: null
                };
                node.left = {
                    type: value.join("").substr(1),
                    left: null,
                    right: null
                };
                return node;
            }
            return {
                type: value.join(""),
                left: null,
                right: null
            };
        }

        return null;
    }

    Do(){
        if (this.data.length >= 3){
            let eq = this.data.indexOf('=');
            let root = {
                left: this.parse(this.data.substr(0, eq)),
                right: this.parse(this.data.substr(eq + 1)),
                type: this.Operator.ASSIGN
            };
            console.log(root);
        }
    }
}
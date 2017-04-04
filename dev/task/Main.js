'use strict';

export default class Main{
    constructor(str = ""){
        this.setData(str);
    }

    setData(str){
        this.data = str;
        this.result = [];
    }

    parse(str){
        // это на случай, если наша строка пуста
        // (например, минус в начале исходной строки
        // стоит и сюда передалась одна его часть - пустая)
        if (!str || !str.length)
            return null;

        // сначала идем по плюсам и минусам вне скобок
        for (let i = str.length - 1; i >= 0; i--){
            if (str[i] == ')'){
                let cnt = 1;
                let nm = i;
                for(let j = i - 1; j >= 0 && cnt; j--)
                    if (str[j] == ')') cnt++;
                    else if (str[j] == '('){cnt--;nm = j;}
                if (cnt) throw "Скобки не сбалансированны";
                i = nm - 1;
            }
            if (str[i] == '+' || str[i] == '-'){
                return {
                    type: str[i],
                    left: this.parse(str.substr(0, i)),
                    right: this.parse(str.substr(i + 1))
                }
            }
        }

        // окей, плюсы и еденицы разобрали, значит, их нет
        // тогда пропарсим умножение и деление
        for (let i = str.length - 1; i >= 0; i--){
            if (str[i] == ')'){
                let cnt = 1;
                let nm = i;
                for(let j = i - 1; j >= 0 && cnt; j--)
                    if (str[j] == ')') cnt++;
                    else if (str[j] == '('){cnt--;nm = j;}
                if (cnt) throw "Скобки не сбалансированны";
                i = nm - 1;
            }
            if (str[i] == '*' || str[i] == '/'){
                return {
                    type: str[i],
                    left: this.parse(str.substr(0, i)),
                    right: this.parse(str.substr(i + 1))
                }
            }
        }

        // чтож... остались только скобки, да сами циферки и буковки
        // давайте начнем со скобок
        if (str[0] == '(' && str[str.length - 1] == ')')
            return this.parse(str.substr(1, str.length - 2));

        // хммм... нет ни операторов, ни скобок, пожалуй, это буковка или цифра, да пусть так оно и будет!
        return {
            type: str,
            left: null,
            right: null
        }
    }

    isOperator(s){
        return (s == '+' || s == '-' || s == '*' || s == '/' || s == '=');
    }

    op(operator, left, right){
        switch (operator) {
            case '=' : return ("mov " + left + ", eax");
            case '+' : return ("add " + left + ", " + right);
            case '-' : return ("sub " + left + ", " + right);
            case '*' : return ("imul " + left + ", " + right);
            case '/' : return ("idiv " + left + ", " + right);
            default: return null;
        }
    }

    generate(node){
        // нет смысла делать что-то для пустой вершины (или если она - цифра или буква)
        if (node === null || (node.left === null && node.right === null)) return;

        // 5 условие 
        let isCase5 = (node.left !== null && node.right !== null && this.isOperator(node.left.type) && this.isOperator(node.right.type));

        this.generate(node.right);
        if (isCase5) this.result.push("push eax");
        this.generate(node.left);
        if (isCase5){
            this.result.push("pop edx");
            this.result.push(this.op(node.type, "eax", "edx"));
        }

        if (this.isOperator(node.type)) {
            // условие 1
            if (node.right !== null && node.left !== null) {
                if (!this.isOperator(node.right.type) && !this.isOperator(node.left.type)) {
                    this.result.push("mov eax, " + node.left.type);
                    this.result.push(this.op(node.type, "eax", node.right.type));
                }
                // условие 2
                if (!this.isOperator(node.right.type) && this.isOperator(node.left.type)) {
                    this.result.push(this.op(node.type, "eax", node.right.type));
                }
                // условие 3
                if (!this.isOperator(node.left.type) && this.isOperator(node.right.type) && (node.type == '+' || node.type == '*')) {
                    this.result.push(this.op(node.type, "eax", node.left.type));
                }
                // условие 4
                if (!this.isOperator(node.left.type) && this.isOperator(node.right.type) &&
                        (node.type == '-'
                        || node.type == '/'
                        || node.type == '=')){
                    if (node.type == '='){
                        this.result.push("mov " + node.left.type + ", eax");
                    }else{
                        this.result.push("mov edx, " + node.left.type);
                        this.result.push("xchg eax, edx");
                        this.result.push(this.op(node.type, "eax", "edx"));
                    }
                }
            }
            // условие 6
            if (node.left === null){
                if (!this.isOperator(node.right.type))
                    this.result.push("mov eax, " + node.right.type);
                this.result.push("neg eax");
            }
            if (node.right === null){
                if (!this.isOperator(node.left.type))
                    this.result.push("mov eax, " + node.left.type);
                this.result.push("neg eax");
            }
        }
    }

    Do(){
        if (this.data.length >= 3){
            let brackets = 0;
            for (let i = 0; i < this.data.length; i++){
                if (this.data[i] == '(') brackets++;
                else if (this.data[i] == ')') brackets--;
            }
            if (brackets > 0) return "Скобки не сбалансированы";
            let eq = this.data.indexOf('=');
            if (eq == -1) return "Нет оператора равно";
            let root = null;
            try{
                root = {
                    left: this.parse(this.data.substr(0, eq)),
                    right: this.parse(this.data.substr(eq + 1)),
                    type: "="
                };
            }catch(e){
                return e;
            }
            this.generate(root);
            console.log(root);
            console.log(this.result);
            return this.result;
        }
    }
}
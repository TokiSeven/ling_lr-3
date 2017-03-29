import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class TaskSeven{

    private static int opCount = 0;

    private enum Operator {
        ASSIGN,
        ADD,
        SUBTRACT,
        MULTIPLY,
        DIVIDE
    }

    private enum NodeType {
        OPERATOR,
        ID,
        CONSTANT
    }

    private static class Node<T> {
        NodeType    type;
        Node        left;
        Node        right;
        T           value;

        private Node(T value) {
            if (value instanceof Operator)
                type = NodeType.OPERATOR;
            else if (value instanceof Number)
                type = NodeType.CONSTANT;
            else if (value instanceof String)
                type = NodeType.ID;
            this.value = value;
            left = null;
            right = null;
        }
    }

    private enum ParserState {
        INIT,
        ID,
        CONST,
        OP,
        OPENING,
        CLOSING,
        ERROR
    }

    public static void main(String[] args) {
        System.out.println("Input string for code generation:");
        Scanner scanner = new Scanner(System.in);
        String exp = scanner.nextLine();
        String[] exps = exp.split("=");
        Node root = new Node<Operator>(Operator.ASSIGN);
        root.left = parse(exps[0]);
        root.right = parse(exps[1]);
        mirrorIds(root.left, exps[0]);
        mirrorIds(root.right, exps[1]);
        makeNeo4j(root);
        generate(root);
        System.out.println("Optimized code:");
        for (String s: result)
            System.out.println(s);
    }

    private static Node parse(String exp) {
        if (exp == null || exp.length() == 0)
            return null;
        //System.out.println(exp);
        if (exp.matches("\\([a-zA-Z0-9+*-/]+\\)"))
            exp = exp.substring(1, exp.length() - 1);
        if (exp.startsWith("-")) {
            Node node = new Node<Operator>(Operator.SUBTRACT);
            node.left = parse(exp.substring(1));
            return node;
        }



        ParserState state = ParserState.INIT;
        StringBuilder value = new StringBuilder();
        for (int i = exp.length() - 1; i >= 0; i--) {
            char c = exp.charAt(i);
            if (Character.isLetter(c)) {
                switch (state) {
                    case OPENING:
                        return null;
                    default:
                        state = ParserState.ID;
                        value.append(c);
                        break;
                }
            } else if (Character.isDigit(c)) {
                switch (state) {
                    case ID:
                        value.append(c);
                        break;
                    case INIT:
                        state = ParserState.CONST;
                        value.append(c);
                        break;
                    case OPENING:
                        return null;
                    default:
                        state = ParserState.CONST;
                        value.append(c);
                        break;
                }
            } else if (c == '=' || c == '+' || c == '-') {
                Operator operator;
                Node node;
                switch (state) {
                    case ID:
                        state = ParserState.OP;
                        operator = Operator.ASSIGN;
                        switch (c) {
                            case '=':
                                operator = Operator.ASSIGN;
                                break;
                            case '+':
                                operator = Operator.ADD;
                                break;
                            case '-':
                                operator = Operator.SUBTRACT;
                                break;
                            default:
                                break;
                        }
                        node = new Node<Operator>(operator);
                        if (0 - i == 0) {
                            value.append(c);
                        }
                        node.right = parse(value.toString());
                        node.left = parse(exp.substring(0, i));
                        return node;
                    case CONST:
                        state = ParserState.OP;
                        operator = Operator.ASSIGN;
                        switch (c) {
                            case '=':
                                operator = Operator.ASSIGN;
                                break;
                            case '+':
                                operator = Operator.ADD;
                                break;
                            case '-':
                                operator = Operator.SUBTRACT;
                                break;
                            default:
                                break;
                        }
                        node = new Node<Operator>(operator);
                        if (0 - i == 0) {
                            value.append(c);
                        }
                        node.right = parse(value.toString());
                        node.left = parse(exp.substring(0, i));
                        return node;
                    case OPENING:
                        state = ParserState.OP;
                        operator = Operator.ASSIGN;
                        switch (c) {
                            case '=':
                                operator = Operator.ASSIGN;
                                break;
                            case '+':
                                operator = Operator.ADD;
                                break;
                            case '-':
                                operator = Operator.SUBTRACT;
                                break;
                            default:
                                break;
                        }
                        node = new Node<Operator>(operator);
                        if (0 - i == 0) {
                            value.append(c);
                        }
                        node.right = parse(value.toString());
                        node.left = parse(exp.substring(0, i));
                        return node;
                    case INIT:
                        value.append(c);
                        break;
                    case OP:
                        value.append(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == '*' || c == '/') {
                switch (state) {
                    case ID:
                        state = ParserState.OP;
                        value.append(c);
                        break;
                    case CONST:
                        state = ParserState.OP;
                        value.append(c);
                        break;
                    case OPENING:
                        state = ParserState.OP;
                        value.append(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == '(') {
                switch (state) {
                    case CONST:
                        state = ParserState.OPENING;
                        value.append(c);
                        break;
                    case ID:
                        state = ParserState.OPENING;
                        value.append(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == ')') {
                int j = i + 1;
                switch (state) {
                    case INIT:
                        while (c != '(') {
                            c = exp.charAt(--i);
                        }
                        value.append(exp.substring(i, j));
                        state = ParserState.OPENING;
                        break;
                    case OP:
                        while (c != '(') {
                            c = exp.charAt(--i);
                        }
                        value.append(exp.substring(i, j));
                        state = ParserState.OPENING;
                        break;
                    default:
                        return null;
                }
            } else {
                System.out.println("String is incorrect");
                return null;
            }
        }

        state = ParserState.INIT;
        value = new StringBuilder();
        for (int i = exp.length() - 1; i >= 0; i--) {
            char c = exp.charAt(i);
            if (Character.isLetter(c)) {
                switch (state) {
                    case OPENING:
                        return null;
                    default:
                        state = ParserState.ID;
                        value.append(c);
                        break;
                }
            } else if (Character.isDigit(c)) {
                switch (state) {
                    case ID:
                        value.append(c);
                        break;
                    case INIT:
                        state = ParserState.CONST;
                        value.append(c);
                        break;
                    case OPENING:
                        return null;
                    default:
                        state = ParserState.CONST;
                        value.append(c);
                        break;
                }
            } else if (c == '-' || c == '+') {
                switch (state) {
                    case INIT:
                        value.append(c);
                        break;
                    case OP:
                        value.append(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == '*' || c == '/') {
                Operator operator;
                Node node;
                switch (state) {
                    case ID:
                        operator = Operator.MULTIPLY;
                        switch (c) {
                            case '*':
                                operator = Operator.MULTIPLY;
                                break;
                            case '/':
                                operator = Operator.DIVIDE;
                                break;
                            default:
                                break;
                        }
                        node = new Node<Operator>(operator);
                        node.right = parse(value.toString());
                        node.left = parse(exp.substring(0, i));
                        return node;
                    case CONST:
                        operator = Operator.MULTIPLY;
                        switch (c) {
                            case '*':
                                operator = Operator.MULTIPLY;
                                break;
                            case '/':
                                operator = Operator.DIVIDE;
                                break;
                            default:
                                break;
                        }
                        node = new Node<Operator>(operator);
                        node.right = parse(value.toString());
                        node.left = parse(exp.substring(0, i));
                        return node;
                    case OPENING:
                        operator = Operator.MULTIPLY;
                        switch (c) {
                            case '*':
                                operator = Operator.MULTIPLY;
                                break;
                            case '/':
                                operator = Operator.DIVIDE;
                                break;
                            default:
                                break;
                        }
                        node = new Node<Operator>(operator);
                        node.right = parse(value.toString());
                        node.left = parse(exp.substring(0, i));
                        return node;
                    default:
                        return null;
                }
            } else if (c == '(') {
                switch (state) {
                    case CONST:
                        state = ParserState.OPENING;
                        value.append(c);
                        break;
                    case ID:
                        state = ParserState.OPENING;
                        value.append(c);
                        break;
                    default:
                        return null;
                }
            } else if (c == ')') {
                int j = i + 1;
                switch (state) {
                    case INIT:
                        while (c != '(') {
                            c = exp.charAt(--i);
                        }
                        value.append(exp.substring(i, j));
                        state = ParserState.OPENING;
                        break;
                    case OP:
                        while (c != '(') {
                            c = exp.charAt(--i);
                        }
                        value.append(exp.substring(i, j));
                        state = ParserState.OPENING;
                        break;
                    default:
                        return null;
                }
            } else {
                return null;
            }
        }

        if (state == ParserState.ID) {
            if (value.toString().startsWith("-")) {
                Node node = new Node<Operator>(Operator.SUBTRACT);
                node.left = new Node<String>(value.toString().substring(1));
                return node;
            }
            return new Node<String>(value.toString());
        }
        else if (state == ParserState.CONST) {
            if (value.toString().startsWith("-")) {
                Node node = new Node<Operator>(Operator.SUBTRACT);
                node.left = new Node<String>(value.toString().substring(1));
                return node;
            }
            return new Node<String>(value.toString());
        }

        return null;
    }

    private static List<String> result;

    private static void generate(Node<Operator> root) {
        result = new ArrayList<String>();
        traverse(root);
    }

    private static void traverse (Node node){

        if (node == null || (node.left == null && node.right == null)) return;
        //CASE 5
        boolean isCase5 = (node.left != null && node.right != null && node.left.type == NodeType.OPERATOR
                && node.right.type == NodeType.OPERATOR);
        //if(isCase5) result.add("-----------CASE 5: ");

        traverse(node.right);
        if (isCase5) result.add("push eax");
        traverse(node.left);
        if (isCase5){
            result.add("pop edx");
            result.add(op((Operator) node.value, "eax", "edx"));
        }


        if (node.type == NodeType.OPERATOR) {
            //CASE 1
            if (node.right != null && node.left != null) {
                if ((node.right.type == NodeType.CONSTANT || node.right.type == NodeType.ID) &&
                        (node.left.type == NodeType.CONSTANT || node.left.type == NodeType.ID)) {
                    //result.add("------------ CASE 1: ");
                    result.add("mov eax, " + node.left.value);
                    result.add(op((Operator) node.value, "eax", node.right.value.toString()));
                }
                //CASE 2
                if ((node.right.type == NodeType.CONSTANT || node.right.type == NodeType.ID) &&
                        node.left.type == NodeType.OPERATOR) {
                    //result.add("------------ CASE 2: ");
                    String right;

                    result.add(op((Operator) node.value, "eax", node.right.value.toString()));
                }
                //CASE 3
                if ((node.left.type == NodeType.CONSTANT || node.left.type == NodeType.ID) &&
                        (node.right.type == NodeType.OPERATOR) &&
                        (node.value.equals(Operator.ADD) || node.value.equals(Operator.MULTIPLY))) {
                    //result.add("------------ CASE 3: ");
                    result.add(op((Operator) node.value, "eax", node.left.value.toString()));
                }
                //CASE 4
                if ((node.left.type == NodeType.CONSTANT || node.left.type == NodeType.ID) &&
                        (node.right.type == NodeType.OPERATOR) &&
                        (node.value.equals(Operator.SUBTRACT)
                                || node.value.equals(Operator.DIVIDE)
                                || node.value.equals(Operator.ASSIGN))) {
                    //result.add("------------ CASE 4: ");
                    if (node.value == Operator.ASSIGN)
                        result.add("mov " + node.left.value + ", eax");
                    else {
                        result.add("mov edx, " + node.left.value);
                        result.add("xchg eax, edx");
                        result.add(op((Operator) node.value, "eax", "edx"));
                    }
                }
            }
            //CASE 6
            if (node.left == null){
                //result.add("------------ CASE 6: ");
                if (node.right.type == NodeType.CONSTANT || node.right.type == NodeType.ID)
                    result.add("mov eax, " + node.right.value);
                result.add("neg eax");
            }
            if (node.right == null){
                //result.add("------------ CASE 6: ");
                if (node.left.type == NodeType.CONSTANT || node.left.type == NodeType.ID)
                    result.add("mov eax, " + node.left.value);
                result.add("neg eax");
            }
        }
    }

    private static String op(Operator operator, String left, String right){
        switch (operator) {
            case ASSIGN : return ("mov " + left + ", eax");
            case ADD : return ("add " + left + ", " + right);
            case SUBTRACT : return ("sub " + left + ", " + right);
            case MULTIPLY : return ("imul " + left + ", " + right);
            case DIVIDE : return ("idiv " + left + ", " + right);
        }
        return null;
    }

    private static FiniteAutomaton finiteAutomaton;

    private static void makeNeo4j (Node node){
        finiteAutomaton = new FiniteAutomaton();
        finiteAutomaton.connectToDatabase();
        finiteAutomaton.deleteAll();
        finiteAutomaton.addState(node.value.toString(), "ROOT");
        neo4jNextNode(node);
        finiteAutomaton.disconnectFromDatabase();
    }

    private static void neo4jNextNode (Node node){
        if (node != null){
            if (node.right != null){
                String value =  node.right.value.toString();
                if (node.right.type == NodeType.OPERATOR) value += opCount++;
                finiteAutomaton.addState(value, "RIGHT");
                finiteAutomaton.connectStates(node.value.toString(), value, " ");
                neo4jNextNode(node.right);
            }
            if (node.left != null){
                String value =  node.left.value.toString();
                if (node.left.type == NodeType.OPERATOR) value += opCount++;
                finiteAutomaton.addState(value, "LEFT");
                finiteAutomaton.connectStates(node.value.toString(), value, " ");
                neo4jNextNode(node.left);
            }
        }
    }

    private static void mirrorIds(Node node, String string){
        if (node.type == NodeType.ID && !string.contains(node.value.toString())){
            node.value = new StringBuilder(node.value.toString()).reverse().toString();
        }
        if (node.left != null) mirrorIds(node.left, string);
        if (node.right != null) mirrorIds(node.right, string);
    }

}
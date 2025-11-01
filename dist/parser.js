"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    isAtEnd() {
        return this.current >= this.tokens.length;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    }
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    consume(type, message) {
        if (this.check(type))
            return this.advance();
        throw new Error(`${message} at line ${this.peek().line}, column ${this.peek().column}`);
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }
        return statements;
    }
    declaration() {
        try {
            if (this.match('KEYWORD', 'let', 'const')) {
                return this.variableDeclaration();
            }
            if (this.match('KEYWORD', 'function')) {
                return this.functionDeclaration();
            }
            return this.statement();
        }
        catch (error) {
            this.synchronize();
            throw error;
        }
    }
    variableDeclaration() {
        const isConst = this.previous().value === 'const';
        const name = this.consume('IDENTIFIER', 'Expected variable name').value;
        let initializer = null;
        if (this.match('=')) {
            initializer = this.expression();
        }
        this.consume(';', 'Expected \';\' after variable declaration');
        return {
            type: 'VariableDeclaration',
            kind: isConst ? 'const' : 'let',
            declarations: [{
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name },
                    init: initializer
                }]
        };
    }
    functionDeclaration() {
        const name = this.consume('IDENTIFIER', 'Expected function name').value;
        this.consume('(', 'Expected \'(\' after function name');
        const params = [];
        if (!this.check(')')) {
            do {
                if (params.length >= 255) {
                    throw new Error('Cannot have more than 255 parameters');
                }
                params.push({
                    type: 'Identifier',
                    name: this.consume('IDENTIFIER', 'Expected parameter name').value
                });
            } while (this.match(','));
        }
        this.consume(')', 'Expected \')\' after parameters');
        this.consume('{', 'Expected \'{\'');
        const body = [];
        while (!this.check('}') && !this.isAtEnd()) {
            body.push(this.declaration());
        }
        this.consume('}', 'Expected \'}\' after function body');
        return {
            type: 'FunctionDeclaration',
            id: { type: 'Identifier', name },
            params,
            body: {
                type: 'BlockStatement',
                body
            },
            generator: false,
            async: false
        };
    }
    statement() {
        if (this.match('KEYWORD', 'if'))
            return this.ifStatement();
        if (this.match('KEYWORD', 'for'))
            return this.forStatement();
        if (this.match('KEYWORD', 'while'))
            return this.whileStatement();
        if (this.match('KEYWORD', 'return'))
            return this.returnStatement();
        if (this.match('{'))
            return this.blockStatement();
        return this.expressionStatement();
    }
    ifStatement() {
        this.consume('(', 'Expected \'(\' after \'if\'');
        const test = this.expression();
        this.consume(')', 'Expected \')\' after if condition');
        const consequent = this.statement();
        let alternate = null;
        if (this.match('KEYWORD', 'else')) {
            alternate = this.statement();
        }
        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate
        };
    }
    forStatement() {
        this.consume('(', 'Expected \'(\' after \'for\'');
        let init;
        if (this.match(';')) {
            init = null;
        }
        else if (this.match('KEYWORD', 'let', 'const')) {
            init = this.variableDeclaration();
        }
        else {
            init = this.expressionStatement();
        }
        let test = null;
        if (!this.check(';')) {
            test = this.expression();
        }
        this.consume(';', 'Expected \';\' after loop condition');
        let update = null;
        if (!this.check(')')) {
            update = this.expression();
        }
        this.consume(')', 'Expected \')\' after for clauses');
        const body = this.statement();
        return {
            type: 'ForStatement',
            init,
            test,
            update,
            body
        };
    }
    whileStatement() {
        this.consume('(', 'Expected \'(\' after \'while\'');
        const test = this.expression();
        this.consume(')', 'Expected \')\' after while condition');
        const body = this.statement();
        return {
            type: 'WhileStatement',
            test,
            body
        };
    }
    returnStatement() {
        const argument = !this.check(';') ? this.expression() : null;
        this.consume(';', 'Expected \';\' after return value');
        return {
            type: 'ReturnStatement',
            argument
        };
    }
    blockStatement() {
        const body = [];
        while (!this.check('}') && !this.isAtEnd()) {
            body.push(this.declaration());
        }
        this.consume('}', 'Expected \'}\' after block');
        return {
            type: 'BlockStatement',
            body
        };
    }
    expressionStatement() {
        const expression = this.expression();
        this.consume(';', 'Expected \';\' after expression');
        return {
            type: 'ExpressionStatement',
            expression
        };
    }
    expression() {
        return this.assignment();
    }
    assignment() {
        const expr = this.equality();
        if (this.match('=')) {
            const equals = this.previous();
            const value = this.assignment();
            if (expr.type === 'Identifier') {
                return {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: expr,
                    right: value
                };
            }
            throw new Error(`Invalid assignment target at line ${equals.line}, column ${equals.column}`);
        }
        return expr;
    }
    equality() {
        let expr = this.comparison();
        while (this.match('==', '!=')) {
            const operator = this.previous().value;
            const right = this.comparison();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }
    comparison() {
        let expr = this.term();
        while (this.match('>', '>=', '<', '<=')) {
            const operator = this.previous().value;
            const right = this.term();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match('+', '-')) {
            const operator = this.previous().value;
            const right = this.factor();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match('*', '/', '%')) {
            const operator = this.previous().value;
            const right = this.unary();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }
    unary() {
        if (this.match('!', '-')) {
            const operator = this.previous().value;
            const right = this.unary();
            return {
                type: 'UnaryExpression',
                operator,
                argument: right,
                prefix: true
            };
        }
        return this.primary();
    }
    primary() {
        if (this.match('NUMBER', 'STRING', 'true', 'false', 'null')) {
            return {
                type: 'Literal',
                value: this.previous().value,
                raw: JSON.stringify(this.previous().value)
            };
        }
        if (this.match('IDENTIFIER')) {
            return {
                type: 'Identifier',
                name: this.previous().value
            };
        }
        if (this.match('(')) {
            const expr = this.expression();
            this.consume(')', 'Expected \')\' after expression');
            return {
                type: 'ExpressionStatement',
                expression: expr
            };
        }
        throw new Error(`Unexpected token: ${this.peek().value} at line ${this.peek().line}, column ${this.peek().column}`);
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().value === ';')
                return;
            switch (this.peek().value) {
                case 'function':
                case 'let':
                case 'const':
                case 'if':
                case 'for':
                case 'while':
                case 'return':
                    return;
            }
            this.advance();
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
class Generator {
    generate(node) {
        if (Array.isArray(node)) {
            return node.map(n => this.generate(n)).join('\n');
        }
        switch (node.type) {
            case 'Program':
                return this.generate(node.body);
            case 'FunctionDeclaration':
                return this.functionDeclaration(node);
            case 'VariableDeclaration':
                return this.variableDeclaration(node);
            case 'VariableDeclarator':
                return this.variableDeclarator(node);
            case 'BlockStatement':
                return this.blockStatement(node);
            case 'ReturnStatement':
                return this.returnStatement(node);
            case 'IfStatement':
                return this.ifStatement(node);
            case 'ForStatement':
                return this.forStatement(node);
            case 'WhileStatement':
                return this.whileStatement(node);
            case 'ExpressionStatement':
                return this.expressionStatement(node);
            case 'AssignmentExpression':
                return this.assignmentExpression(node);
            case 'BinaryExpression':
                return this.binaryExpression(node);
            case 'UnaryExpression':
                return this.unaryExpression(node);
            case 'Identifier':
                return this.identifier(node);
            case 'Literal':
                return this.literal(node);
            case 'CallExpression':
                return this.callExpression(node);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    functionDeclaration(node) {
        const id = this.generate(node.id);
        const params = node.params.map((p) => this.generate(p)).join(', ');
        const body = this.generate(node.body);
        return `function ${id}(${params}) ${body}`;
    }
    variableDeclaration(node) {
        const declarations = node.declarations
            .map((d) => this.generate(d))
            .join(', ');
        return `${node.kind} ${declarations};`;
    }
    variableDeclarator(node) {
        const id = this.generate(node.id);
        const init = node.init ? ` = ${this.generate(node.init)}` : '';
        return `${id}${init}`;
    }
    blockStatement(node) {
        const body = node.body
            .map((stmt) => {
            const code = this.generate(stmt);
            return stmt.type.endsWith('Statement') ? code : `${code};`;
        })
            .join('\n  ');
        return `{\n  ${body}\n}`;
    }
    returnStatement(node) {
        return `return${node.argument ? ' ' + this.generate(node.argument) : ''};`;
    }
    ifStatement(node) {
        const test = this.generate(node.test);
        const consequent = this.generate(node.consequent);
        const alternate = node.alternate ? ` else ${this.generate(node.alternate)}` : '';
        return `if (${test}) ${consequent}${alternate}`;
    }
    forStatement(node) {
        const init = node.init ? this.generate(node.init).replace(/;+$/, '') : '';
        const test = node.test ? this.generate(node.test) : '';
        const update = node.update ? this.generate(node.update) : '';
        const body = this.generate(node.body);
        return `for (${init}; ${test}; ${update}) ${body}`;
    }
    whileStatement(node) {
        const test = this.generate(node.test);
        const body = this.generate(node.body);
        return `while (${test}) ${body}`;
    }
    expressionStatement(node) {
        return `${this.generate(node.expression)};`;
    }
    assignmentExpression(node) {
        return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;
    }
    binaryExpression(node) {
        return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;
    }
    unaryExpression(node) {
        return `${node.operator}${this.generate(node.argument)}`;
    }
    identifier(node) {
        return node.name;
    }
    literal(node) {
        if (node.value === null)
            return 'null';
        if (typeof node.value === 'string')
            return `"${node.value}"`;
        return String(node.value);
    }
    callExpression(node) {
        const callee = this.generate(node.callee);
        const args = node.arguments.map((arg) => this.generate(arg)).join(', ');
        return `${callee}(${args})`;
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map
import { AstNode } from './types';
export declare class Generator {
    generate(node: AstNode | AstNode[]): string;
    private functionDeclaration;
    private variableDeclaration;
    private variableDeclarator;
    private blockStatement;
    private returnStatement;
    private ifStatement;
    private forStatement;
    private whileStatement;
    private expressionStatement;
    private assignmentExpression;
    private binaryExpression;
    private unaryExpression;
    private identifier;
    private literal;
    private callExpression;
}

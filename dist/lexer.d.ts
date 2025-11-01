import { Token } from './types';
export declare class Lexer {
    private input;
    private position;
    private line;
    private column;
    constructor(input: string);
    private isEof;
    private advance;
    private match;
    tokenize(): Token[];
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
// Russian JavaScript keywords mapping to English
const KEYWORDS = {
    'если': 'if',
    'иначе': 'else',
    'для': 'for',
    'пока': 'while',
    'функция': 'function',
    'вернуть': 'return',
    'константа': 'const',
    'переменная': 'let',
    'истина': 'true',
    'ложь': 'false',
    'неопределено': 'undefined',
    'нуль': 'null',
    'новый': 'new',
    'попробовать': 'try',
    'поймать': 'catch',
    'выбросить': 'throw',
    'наконец': 'finally',
    'класс': 'class',
    'расширяет': 'extends',
    'супер': 'super',
    'этот': 'this',
    'экспорт': 'export',
    'импорт': 'import',
    'из': 'from',
    'по': 'of',
    'в': 'in',
    'экземпляр': 'instanceof',
    'тип': 'typeof',
    'удалить': 'delete',
    'создать': 'new',
    'выполнить': 'do',
    'прервать': 'break',
    'продолжить': 'continue',
    'переключатель': 'switch',
    'случай': 'case',
    'по_умолчанию': 'default',
    'статика': 'static',
    'асинхронно': 'async',
    'ожидать': 'await',
    'вернуть_значение': 'yield'
};
// Token matchers with regex patterns
const TOKENS = [
    // Whitespace
    [/^\s+/, null],
    // Comments
    [/^\/\*[\s\S]*?\*\//, null],
    [/^\/\/.*/, null],
    // Symbols and delimiters
    [/^;/, ';'],
    [/^{/, '{'],
    [/^}/, '}'],
    [/^\(/, '('],
    [/^\)/, ')'],
    [/^\[/, '['],
    [/^\]/, ']'],
    [/^,/, ','],
    [/^\./, '.'],
    [/^:/, ':'],
    [/^\?/, '?'],
    // Operators
    [/^\+\+/, '++'],
    [/^--/, '--'],
    [/^\+/, '+'],
    [/^-/, '-'],
    [/^\*/, '*'],
    [/^\/\//, '//'],
    [/^\//, '/'],
    [/^%/, '%'],
    [/^===/, '==='],
    [/^!==/, '!=='],
    [/^==/, '=='],
    [/^=/, '='],
    [/^!+/, '!'],
    [/^>+/, '>'],
    [/^</, '<'],
    [/^>=/, '>='],
    [/^<=/, '<='],
    [/^&&/, '&&'],
    [/^\|\|/, '||'],
    [/^\|\|\|/, '|||'],
    [/^\|=/, '|='],
    [/^&=/, '&='],
    [/^\^=/, '^='],
    [/^\?\?/, '??'],
    [/^\?\?=/, '??='],
    // Numbers
    [/^\d+\.\d+/, 'NUMBER'],
    [/^\d+/, 'NUMBER'],
    // Strings
    [/^"[^"]*"/, 'STRING'],
    [/^'[^']*'/, 'STRING'],
    [/^`[^`]*`/, 'TEMPLATE_LITERAL'],
    // Identifiers and keywords
    [/^[а-яА-Яa-zA-Z_$][а-яА-Яa-zA-Z0-9_$]*/, 'IDENTIFIER']
];
class Lexer {
    constructor(input) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.input = input;
    }
    isEof() {
        return this.position >= this.input.length;
    }
    advance(n = 1) {
        for (let i = 0; i < n; i++) {
            if (this.input[this.position] === '\n') {
                this.line++;
                this.column = 1;
            }
            else {
                this.column++;
            }
            this.position++;
        }
    }
    match(regex, input) {
        const match = input.match(regex);
        return match ? match[0] : null;
    }
    tokenize() {
        const tokens = [];
        while (!this.isEof()) {
            const currentChar = this.input[this.position];
            let matched = false;
            for (const [pattern, tokenType] of TOKENS) {
                const value = this.match(pattern, this.input.slice(this.position));
                if (value === null)
                    continue;
                // Skip whitespace and comments
                if (tokenType === null) {
                    this.advance(value.length);
                    matched = true;
                    break;
                }
                // Handle identifiers and keywords
                let type = tokenType;
                let tokenValue = value;
                if (type === 'IDENTIFIER' && KEYWORDS[value]) {
                    type = 'KEYWORD';
                    tokenValue = KEYWORDS[value];
                }
                tokens.push({
                    type,
                    value: tokenValue,
                    line: this.line,
                    column: this.column
                });
                this.advance(value.length);
                matched = true;
                break;
            }
            if (!matched) {
                throw new Error(`Unexpected character: ${currentChar} at line ${this.line}, column ${this.column}`);
            }
        }
        return tokens;
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map
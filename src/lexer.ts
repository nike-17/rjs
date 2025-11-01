import { Token, TokenMatcher } from './types';

// Russian JavaScript keywords mapping to English
const RUSSIAN_KEYWORDS: Record<string, string> = {
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

// Standard JavaScript keywords
const JS_KEYWORDS: Record<string, string> = {
  'if': 'if',
  'else': 'else',
  'for': 'for',
  'while': 'while',
  'function': 'function',
  'return': 'return',
  'const': 'const',
  'let': 'let',
  'var': 'var',
  'true': 'true',
  'false': 'false',
  'undefined': 'undefined',
  'null': 'null',
  'new': 'new',
  'try': 'try',
  'catch': 'catch',
  'throw': 'throw',
  'finally': 'finally',
  'class': 'class',
  'extends': 'extends',
  'super': 'super',
  'this': 'this',
  'export': 'export',
  'import': 'import',
  'from': 'from',
  'of': 'of',
  'in': 'in',
  'instanceof': 'instanceof',
  'typeof': 'typeof',
  'delete': 'delete',
  'do': 'do',
  'break': 'break',
  'continue': 'continue',
  'switch': 'switch',
  'case': 'case',
  'default': 'default',
  'static': 'static',
  'async': 'async',
  'await': 'await',
  'yield': 'yield'
};

// Combined keywords
const KEYWORDS = { ...RUSSIAN_KEYWORDS, ...JS_KEYWORDS };

// Token matchers with regex patterns
const TOKENS: TokenMatcher[] = [
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

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(input: string) {
    this.input = input;
  }

  private isEof(): boolean {
    return this.position >= this.input.length;
  }

  private advance(n: number = 1): void {
    for (let i = 0; i < n; i++) {
      if (this.input[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  private match(regex: RegExp, input: string): string | null {
    const match = input.match(regex);
    return match ? match[0] : null;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (!this.isEof()) {
      const currentChar = this.input[this.position];
      let matched = false;

      // Skip whitespace
      const whitespaceMatch = this.match(/^\s+/, this.input.slice(this.position));
      if (whitespaceMatch) {
        this.advance(whitespaceMatch.length);
        continue;
      }

      // Skip comments
      const commentMatch = this.match(/^\/\*[\s\S]*?\*\//, this.input.slice(this.position)) || 
                          this.match(/^\/\/.*/, this.input.slice(this.position));
      if (commentMatch) {
        this.advance(commentMatch.length);
        continue;
      }

      // Try to match tokens
      for (const [pattern, tokenType] of TOKENS) {
        const value = this.match(pattern, this.input.slice(this.position));
        if (value === null) continue;

        // Handle identifiers and keywords
        let type = tokenType || 'IDENTIFIER';
        let tokenValue = value;

        if (type === 'IDENTIFIER') {
          // Check if it's a Russian or English keyword
          const lowerValue = value.toLowerCase();
          if (KEYWORDS[lowerValue]) {
            type = 'KEYWORD';
            tokenValue = KEYWORDS[lowerValue] || value; // Fallback to original value if not found
          }
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
        throw new Error(
          `Unexpected character: ${currentChar} at line ${this.line}, column ${this.column}`
        );
      }
    }

    return tokens;
  }
}

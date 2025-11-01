import { Lexer } from '../lexer';

describe('Lexer', () => {
  it('should tokenize Russian variable declaration', () => {
    const source = 'переменная имя = "Мир";';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    // Log tokens for debugging
    console.log('Tokens:', JSON.stringify(tokens, null, 2));
    
    // Check if the tokens contain the expected values
    expect(tokens.some(t => t.type === 'LET' && t.value === 'let')).toBe(true);
    expect(tokens.some(t => t.type === 'IDENTIFIER' && t.value === 'имя')).toBe(true);
    expect(tokens.some(t => t.type === 'EQUALS' && t.value === '=')).toBe(true);
    expect(tokens.some(t => t.type === 'STRING' && t.value === '"Мир"')).toBe(true);
    expect(tokens.some(t => t.type === 'SEMICOLON' && t.value === ';')).toBe(true);
  });

  it('should tokenize Russian if statement', () => {
    const source = 'если (истина) { консоль.лог("Привет!"); }';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    // Log tokens for debugging
    console.log('Tokens:', JSON.stringify(tokens, null, 2));
    
    // Check if the tokens contain the expected values
    expect(tokens.some(t => t.type === 'IF' && t.value === 'if')).toBe(true);
    expect(tokens.some(t => t.type === 'LEFT_PAREN' && t.value === '(')).toBe(true);
    expect(tokens.some(t => t.type === 'TRUE' && t.value === 'true')).toBe(true);
    expect(tokens.some(t => t.type === 'RIGHT_PAREN' && t.value === ')')).toBe(true);
    expect(tokens.some(t => t.type === 'LEFT_BRACE' && t.value === '{')).toBe(true);
    expect(tokens.some(t => t.type === 'IDENTIFIER' && t.value === 'консоль')).toBe(true);
    expect(tokens.some(t => t.type === 'DOT' && t.value === '.')).toBe(true);
    expect(tokens.some(t => t.type === 'IDENTIFIER' && t.value === 'лог')).toBe(true);
    expect(tokens.some(t => t.type === 'LEFT_PAREN' && t.value === '(')).toBe(true);
    expect(tokens.some(t => t.type === 'STRING' && t.value === '"Привет!"')).toBe(true);
    expect(tokens.some(t => t.type === 'RIGHT_PAREN' && t.value === ')')).toBe(true);
    expect(tokens.some(t => t.type === 'SEMICOLON' && t.value === ';')).toBe(true);
    expect(tokens.some(t => t.type === 'RIGHT_BRACE' && t.value === '}')).toBe(true);
  });
});

import { Lexer } from '../lexer';

describe('Token Types', () => {
  it('should have consistent token types', () => {
    const source = 'переменная имя = "Мир";';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    // Log tokens for debugging
    console.log('Token Types:', tokens.map(t => `${t.type} (${t.value})`).join(', '));
    
    // Check if token types are as expected
    expect(tokens[0].type).toBe('LET'); // переменная -> let
    expect(tokens[1].type).toBe('IDENTIFIER'); // имя
    expect(tokens[2].type).toBe('EQUALS'); // =
    expect(tokens[3].type).toBe('STRING'); // "Мир"
    expect(tokens[4].type).toBe('SEMICOLON'); // SEMICOLON
  });
});

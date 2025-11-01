import { Lexer } from '../lexer';

const source = 'переменная имя = "Мир";';
const lexer = new Lexer(source);
const tokens = lexer.tokenize();

console.log('Tokens:', JSON.stringify(tokens, null, 2));

// Print token types
console.log('Token Types:');
tokens.forEach((token, i) => {
  console.log(`${i}: ${token.type} (${token.value})`);
});

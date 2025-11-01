import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { Generator } from '../generator';

describe('Basic Transpiler Tests', () => {
  it('should handle simple variable declaration', () => {
    const source = 'переменная имя = "Мир";';
    
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    const generator = new Generator();
    const jsCode = generator.generate(ast);
    
    expect(jsCode).toContain('var imya = "Мир"');
  });

  it('should handle simple if statement', () => {
    const source = 'если (истина) { консоль.лог("Привет!"); }';
    
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    const generator = new Generator();
    const jsCode = generator.generate(ast);
    
    expect(jsCode).toContain('if (true)');
    expect(jsCode).toContain('console.log("Привет!")');
  });
});

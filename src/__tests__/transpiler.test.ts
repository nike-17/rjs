import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { Generator } from '../generator';

describe('Russian JS Transpiler', () => {
  it('should transpile simple Russian JS code to JavaScript', () => {
    const source = `
      переменная имя = "Мир";
      если (имя === "Мир") {
        консоль.лог("Привет, " + имя + "!");
      }
    `;

    // 1. Tokenization
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    expect(tokens).toBeDefined();
    expect(tokens.length).toBeGreaterThan(0);

    // 2. Parsing
    const parser = new Parser(tokens);
    const ast = parser.parse();
    expect(ast).toBeDefined();

    // 3. Code Generation
    const generator = new Generator();
    const jsCode = generator.generate(ast);
    expect(jsCode).toBeDefined();
    expect(jsCode).toContain('var imya = "Мир"');
    expect(jsCode).toContain('if (imya === "Мир")');
    expect(jsCode).toContain('console.log(("Привет, " + imya) + "!");');
  });

  it('should handle different Russian keywords and syntax', () => {
    const source = `
      функция привет(имя) {
        вернуть "Привет, " + имя;
      }
      
      консоль.лог(привет("Мир"));
    `;

    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const generator = new Generator();
    const jsCode = generator.generate(ast);

    expect(jsCode).toContain('function privet(imya)');
    expect(jsCode).toContain('return "Привет, " + imya');
    expect(jsCode).toContain('console.log(privet("Мир"))');
  });
});

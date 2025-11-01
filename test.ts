import { Lexer } from './src/lexer';
import { Parser } from './src/parser2';
import { Generator } from './src/generator';

// Test the transpiler with a simple Russian JS code
const source = `
переменная имя = "Мир";
если (имя === "Мир") {
    консоль.лог("Привет, " + имя + "!");
}
`;

console.log("Source code:");
console.log(source);

// 1. Tokenization
console.log("\n=== Tokenization ===");
const lexer = new Lexer(source);
const tokens = lexer.tokenize();
console.log(tokens);

// 2. Parsing
console.log("\n=== Parsing ===");
const parser = new Parser(tokens);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));

// 3. Code Generation
console.log("\n=== Generated JavaScript ===");
const generator = new Generator();
const jsCode = generator.generate(ast);
console.log(jsCode);

// 4. Execute the generated code (be careful with this in production!)
console.log("\n=== Execution Result ===");
const consoleLog = console.log;
const mockConsole = {
  log: (message: string) => console.log(`console.log: ${message}`)
};

try {
  // Replace the global console with our mock for testing
  (global as any).console = mockConsole;
  
  // Create a function with the generated code and call it
  const result = new Function(jsCode)();
  
  // Restore the original console
  (global as any).console = { log: consoleLog };
  
  console.log("Execution completed successfully!");
} catch (error) {
  // Restore the original console in case of error
  (global as any).console = { log: consoleLog };
  console.error("Error during execution:", error);
}

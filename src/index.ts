import { readFileSync, writeFileSync } from 'fs';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Generator } from './generator';

class RussianToJSTranspiler {
  public transpile(source: string): string {
    // Tokenize the source code
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    // Parse tokens into AST
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    // Generate JavaScript code from AST
    const generator = new Generator();
    return generator.generate(ast);
  }

  public transpileFile(inputFile: string, outputFile?: string): void {
    try {
      // Read the input file
      const source = readFileSync(inputFile, 'utf-8');
      
      // Transpile the code
      const jsCode = this.transpile(source);
      
      // Write the output file or log to console
      if (outputFile) {
        writeFileSync(outputFile, jsCode, 'utf-8');
        console.log(`Successfully transpiled ${inputFile} to ${outputFile}`);
      } else {
        console.log(jsCode);
      }
    } catch (error: any) {
      console.error('Error during transpilation:', error.message);
      process.exit(1);
    }
  }
}

// Export the transpiler for programmatic use
export const transpiler = new RussianToJSTranspiler();

export function transpile(source: string): string {
  return transpiler.transpile(source);
}

// If this file is run directly, use the CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Russian to JavaScript Transpiler

Usage:
  rjs <input_file> [output_file]
  
Options:
  --help    Show this help message
    `);
    process.exit(0);
  }
  
  const inputFile = args[0];
  const outputFile = args[1];
  
  if (!inputFile) {
    console.error('Error: No input file specified');
    process.exit(1);
  }
  
  transpiler.transpileFile(inputFile, outputFile);
}

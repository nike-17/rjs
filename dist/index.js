"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpile = exports.transpiler = void 0;
const fs_1 = require("fs");
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const generator_1 = require("./generator");
class RussianToJSTranspiler {
    transpile(source) {
        // Tokenize the source code
        const lexer = new lexer_1.Lexer(source);
        const tokens = lexer.tokenize();
        // Parse tokens into AST
        const parser = new parser_1.Parser(tokens);
        const ast = parser.parse();
        // Generate JavaScript code from AST
        const generator = new generator_1.Generator();
        return generator.generate(ast);
    }
    transpileFile(inputFile, outputFile) {
        try {
            // Read the input file
            const source = (0, fs_1.readFileSync)(inputFile, 'utf-8');
            // Transpile the code
            const jsCode = this.transpile(source);
            // Write the output file or log to console
            if (outputFile) {
                (0, fs_1.writeFileSync)(outputFile, jsCode, 'utf-8');
                console.log(`Successfully transpiled ${inputFile} to ${outputFile}`);
            }
            else {
                console.log(jsCode);
            }
        }
        catch (error) {
            console.error('Error during transpilation:', error.message);
            process.exit(1);
        }
    }
}
// Export the transpiler for programmatic use
exports.transpiler = new RussianToJSTranspiler();
function transpile(source) {
    return exports.transpiler.transpile(source);
}
exports.transpile = transpile;
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
    exports.transpiler.transpileFile(inputFile, outputFile);
}
//# sourceMappingURL=index.js.map
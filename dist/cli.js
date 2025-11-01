#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
// Get command line arguments
const args = process.argv.slice(2);
// Check if the user wants help
if (args.includes('--help') || args.length === 0) {
    console.log(`
Russian to JavaScript Transpiler (rjs)

Usage:
  rjs <input_file> [output_file]
  
Options:
  --help    Show this help message
  --version Show version information

Examples:
  rjs input.rjs output.js  # Transpile input.rjs to output.js
  rjs script.rjs           # Output transpiled code to console
  `);
    process.exit(0);
}
// Check for version flag
if (args.includes('--version')) {
    const pkg = require('../package.json');
    console.log(`rjs v${pkg.version}`);
    process.exit(0);
}
// Get input and output file paths
const inputFile = args[0];
const outputFile = args[1];
if (!inputFile) {
    console.error('Error: No input file specified');
    process.exit(1);
}
// Transpile the file
try {
    const source = require('fs').readFileSync(inputFile, 'utf-8');
    const jsCode = index_1.transpiler.transpile(source);
    if (outputFile) {
        require('fs').writeFileSync(outputFile, jsCode, 'utf-8');
        console.log(`Successfully transpiled ${inputFile} to ${outputFile}`);
    }
    else {
        console.log(jsCode);
    }
}
catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
//# sourceMappingURL=cli.js.map
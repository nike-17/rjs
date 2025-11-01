# Russian JavaScript Transpiler

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/russian-js-transpiler.svg)](https://badge.fury.io/js/russian-js-transpiler)
[![Build Status](https://github.com/nike-17/rjs/actions/workflows/ci.yml/badge.svg)](https://github.com/nike-17/rjs/actions)
[![codecov](https://codecov.io/gh/yourusername/russian-js-transpiler/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/yourusername/russian-js-transpiler)

A powerful transpiler that converts Russian JavaScript-like code to standard JavaScript, making programming more accessible to Russian speakers.

## Features

- Converts Russian keywords and syntax to standard JavaScript
- Supports modern JavaScript features
- Command-line interface for easy integration into your workflow
- Extensible architecture for adding custom transformations

## Installation

```bash
npm install -g russian-js-transpiler
```

## Usage

### CLI

```bash
russian-js-transpiler input.rjs output.js
```

### Programmatic API

```javascript
import { transpile } from 'russian-js-transpiler';

const russianCode = 'функция привет(имя) { вернуть `Привет, ${имя}!`; }';
const jsCode = transpile(russianCode);
console.log(jsCode);
// Output: function privet(imya) { return `Привет, ${imya}!`; }
```

## Examples

See the [examples](./examples) directory for more examples.

## Development

1. Clone the repository:
   ```bash
   git clone https://github.com/nike-17/rjs.git
   cd russian-js-transpiler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by similar language transpilers and educational tools
- Thanks to all contributors who have helped improve this project

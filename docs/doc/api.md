# API

## `transpile(code: string, options?: object): string`

Транспилирует код с русского JavaScript в стандартный JavaScript.

### Параметры

- `code` (строка): Исходный код на русском JavaScript
- `options` (объект, опционально): Настройки транспиляции
  - `preserveComments` (boolean): Сохранять ли комментарии (по умолчанию: `true`)
  - `sourceMap` (boolean): Генерировать ли source map (по умолчанию: `false`)

### Возвращает

Строку с транспилированным JavaScript кодом.

### Пример

```javascript
импортировать { transpile } from 'russian-js-transpiler';

const russianCode = `
  функция привет(имя) {
    вернуть \`Привет, \${имя}!\`;
  }
`;

const jsCode = transpile(russianCode);
console.log(jsCode);
// Output: function privet(imya) { return \`Привет, \${imya}!\`; }
```

## `compile(input: string, output?: string, options?: object): Promise<void>`

Компилирует файл или директорию с исходным кодом.

### Параметры

- `input` (строка): Путь к входному файлу или директории
- `output` (строка, опционально): Путь для выходного файла или директории
- `options` (объект, опционально): Настройки компиляции
  - `watch` (boolean): Следить за изменениями (по умолчанию: `false`)
  - `extensions` (массив строк): Расширения файлов для обработки (по умолчанию: `['.js', '.rjs']`)

### Пример

```javascript
импортировать { compile } from 'russian-js-transpiler/compiler';

// Компиляция одного файла
await compile('src/app.js', 'dist/app.js');

// Рекурсивная компиляция директории
await compile('src', 'dist');
```

## CLI

### Команды

#### `rjs compile [input] [output]`

Компилирует файл или директорию.

Опции:
- `-w, --watch`: Следить за изменениями файлов
- `-d, --dir`: Рекурсивно компилировать все файлы в директории
- `-e, --extensions <extensions>`: Расширения файлов для обработки (по умолчанию: .js,.rjs)
- `-o, --out-dir <dir>`: Выходная директория (только с --dir)
- `-s, --source-maps`: Генерировать source maps

#### `rjs run [file]`

Запускает файл напрямую без компиляции.

### Примеры

```bash
# Компиляция одного файла
rjs compile app.rjs app.js

# Рекурсивная компиляция директории
rjs compile src -d -o dist

# Запуск файла
rjs run app.rjs
```

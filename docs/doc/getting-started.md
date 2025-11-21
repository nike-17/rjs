# Начало работы

## Установка

Установите Russian JS глобально через npm:

```bash
npm install -g russian-js-transpiler
```

Или добавьте в свой проект как зависимость:

```bash
npm install --save-dev russian-js-transpiler
```

##  Использование

### Командная строка

```bash
# Базовое использование
russian-js-transpiler входной_файл.rjs выходной_файл.js

# Слежение за изменениями
russian-js-transpiler --watch src/ -d dist/

# Минификация вывода
russian-js-transpiler файл.rjs -o файл.min.js --minify

# Пакетная компиляция
russian-js-transpiler src/**/*.rjs -d dist/
```

### Использование в Node.js

```javascript
const { transpile } = require('russian-js-transpiler');
const fs = require('fs');

// Чтение исходного файла
const sourceCode = fs.readFileSync('script.rjs', 'utf-8');

// Транспиляция кода
const result = transpile(sourceCode, {
  // Опции (необязательно)
  minify: true,
  sourceMap: true,
  target: 'es2020'
});

// Сохранение результата
fs.writeFileSync('script.js', result.code);
if (result.map) {
  fs.writeFileSync('script.js.map', result.map);
}
```

##  Примеры

### Простой пример

`приветствие.rjs`:
```javascript
// Функция приветствия
функция приветствие(имя = 'Гость') {
  вернуть `Привет, ${имя}!`;
}

// Использование
консоль.лог(приветствие('Мир'));
```

После компиляции (`russian-js-transpiler приветствие.rjs приветствие.js`):

```javascript
// Функция приветствия
function приветствие(имя = 'Гость') {
  return `Привет, ${имя}!`;
}

// Использование
console.log(приветствие('Мир'));
```

### Интеграция с Webpack

1. Установите загрузчик:
```bash
npm install --save-dev russian-js-loader
```

2. Настройте `webpack.config.js`:
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.rjs$/,
        use: 'russian-js-loader',
        exclude: /node_modules/
      }
    ]
  }
};
```

3. Теперь вы можете импортировать `.rjs` файлы:
```javascript
import './app.rjs';
```

##  Настройка проекта

Создайте конфигурационный файл `rjs.config.js` в корне проекта:

```javascript
module.exports = {
  // Входные файлы
  input: 'src/**/*.rjs',
  
  // Выходная директория
  output: 'dist',
  
  // Минификация кода
  minify: process.env.NODE_ENV === 'production',
  
  // Генерация source maps
  sourceMap: true,
  
  // Целевая версия JavaScript
  target: 'es2020',
  
  // Плагины
  plugins: [
    // Пользовательские плагины
  ]
};
```

##  Отладка

Для отладки используйте source maps, которые генерируются при компиляции:

1. Включите source maps в настройках разработчика браузера
2. Используйте отладчик как с обычным JavaScript
3. Точки останова и пошаговое выполнение будут работать с исходным кодом на Russian JS

##  Производительность

Russian JS компилируется в чистый JavaScript, поэтому:
- Нет накладных расходов во время выполнения
- Такой же быстрый, как и нативный JavaScript
- Совместим со всеми современными браузерами и средами выполнения

##  Дополнительные ресурсы

- [Документация по API](./api)
- [Справочник по синтаксису](./syntax)
- [Примеры использования](https://github.com/nike-17/rjs/examples)

##  Получение помощи

Если у вас возникли вопросы или проблемы:
1. Ознакомьтесь с [документацией](./)
2. Проверьте [список проблем](https://github.com/nike-17/rjs/issues)
3. Задайте вопрос в [обсуждениях](https://github.com/nike-17/rjs/discussions)
4. Создайте [новую проблему](https://github.com/nike-17/rjs/issues/new)

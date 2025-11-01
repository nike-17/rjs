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
- Full TypeScript support
- Comprehensive test coverage

## RJS Syntax Reference

### Variables and Constants

```javascript
// Variable declaration
переменная имя = "Мир";
константа ВОЗРАСТ = 25;

// Multiple variables
переменная x = 10, y = 20, z = 30;

// Destructuring
переменная [первый, второй] = [1, 2];
переменная { имя, возраст } = пользователь;
```

### Control Flow

```javascript
// If-else statement
если (возраст >= 18) {
  консоль.лог("Вы совершеннолетний");
} иначе если (возраст >= 13) {
  консоль.лог("Вы подросток");
} иначе {
  консоль.лог("Вы ребенок");
}

// Switch statement
переключить (деньНедели) {
  случай 1:
    консоль.лог("Понедельник");
    перерыв;
  случай 2:
    консоль.лог("Вторник");
    перерыв;
  по_умолчанию:
    консоль.лог("Другой день");
}
```

### Loops

```javascript
// For loop
для (переменная i = 0; i < 10; i++) {
  консоль.лог(i);
}

// For...of loop
для (переменная элемент из массива) {
  консоль.лог(элемент);
}

// While loop
пока (условие) {
  // код
}

// Do-while loop
делать {
  // код
} пока (условие);
```

### Functions

```javascript
// Function declaration
функция приветствовать(имя) {
  вернуть "Привет, " + имя + "!";
}

// Arrow function
константа прибавить = (а, б) => а + б;

// Async function
асинхронная функция загрузитьДанные() {
  константа ответ = ждать fetch('https://api.example.com/data');
  константа данные = ждать ответ.вJson();
  вернуть данные;
}
```

### Classes

```javascript
класс Животное {
  конструктор(имя) {
    это.имя = имя;
  }

  говорить() {
    консоль.лог(это.имя + ' издает звук.');
  }
}

класс Собака расширяет Животное {
  говорить() {
    консоль.лог(это.имя + ' лает: Гав-гав!');
  }
}

константа пес = новый Собака('Рекс');
пес.говорить(); // Выведет: Рекс лает: Гав-гав!
```

### Error Handling

```javascript
попробовать {
  // Код, который может вызвать ошибку
  если (ошибка) {
    выбросить новая Ошибка("Что-то пошло не так");
  }
} поймать (ошибка) {
  консоль.ошибка("Произошла ошибка:", ошибка.сообщение);
} наконец {
  // Код, который выполнится в любом случае
  консоль.лог("Завершение обработки");
}
```

### Built-in Objects

```javascript
// Console methods
консоль.лог("Обычное сообщение");
консоль.ошибка("Сообщение об ошибке");
консоль.предупреждение("Предупреждение");
консоль.информация("Информационное сообщение");

// Arrays
константа числа = [1, 2, 3, 4, 5];
константа удвоенные = числа.отобразить(х => х * 2);
константа сумма = числа.редуцировать((а, б) => а + б, 0);

// Objects
константа пользователь = {
  имя: "Иван",
  возраст: 30,
  приветствовать() {
    вернуть `Привет, меня зовут ${это.имя}`;
  }
};
```

### Modules

```javascript
// Импорт
импортировать { функция1, функция2 } из './модуль';
импортировать * как utils из './утилиты';

// Экспорт
экспорт константа КОНСТАНТА = 42;
экспорт функция привет() { вернуть "Привет!"; };
```

### Template Literals

```javascript
константа имя = "Мир";
константа приветствие = `Привет, ${имя}!
Сегодня ${новая Дата().toLocaleDateString()}.`;

// Многострочные строки
константа html = `
  <div>
    <h1>${заголовок}</h1>
    <p>${текст}</p>
  </div>
`;
```

## Usage Examples

### Example 1: Simple Program

```javascript
// Приветствие пользователя
функция приветствовать(имя, возраст) {
  если (возраст >= 18) {
    вернуть `Здравствуйте, ${имя}! Вы совершеннолетний.`;
  } иначе {
    вернуть `Привет, ${имя}! Тебе всего ${возраст} лет.`;
  }
}

консоль.лог(приветствовать("Анна", 25));
```

### Example 2: Working with Arrays

```javascript
// Фильтрация и преобразование массива
константа числа = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Получить квадраты четных чисел
константа квадратыЧетных = числа
  .фильтровать(число => число % 2 === 0)
  .отобразить(число => число * число);

консоль.лог(квадратыЧетных); // [4, 16, 36, 64, 100]
```

### Example 3: Async/Await

```javascript
// Асинхронная загрузка данных
асинхронная функция загрузитьПользователя(id) {
  попробовать {
    константа ответ = ждать fetch(`/api/users/${id}`);
    если (!ответ.ок) {
      выбросить новая Ошибка('Не удалось загрузить пользователя');
    }
    вернуть ждать ответ.вJson();
  } поймать (ошибка) {
    консоль.ошибка('Ошибка:', ошибка.сообщение);
    вернуть ноль;
  }
}

// Использование
асинхронная функция показатьПользователя(id) {
  константа пользователь = ждать загрузитьПользователя(id);
  если (пользователь) {
    консоль.лог(`Пользователь: ${пользователь.имя}, Email: ${пользователь.почта}`);
  }
}
```

### Example 4: Class with Inheritance

```javascript
// Базовый класс
класс Фигура {
  конструктор(цвет) {
    это.цвет = цвет;
  }

  получитьПлощадь() {
    вернуть 0;
  }

  описать() {
    вернуть `Фигура цвета ${это.цвет}`;
  }
}

// Наследующий класс
класс Круг расширяет Фигура {
  конструктор(цвет, радиус) {
    супер(цвет);
    это.радиус = радиус;
  }

  получитьПлощадь() {
    вернуть Math.PI * это.радиус * это.радиус;
  }

  описать() {
    вернуть `${супер.описать()}, радиус: ${это.радиус}`;
  }
}

// Использование
константа круг = новый Круг("красный", 5);
консоль.лог(круг.описать()); // Фигура цвета красный, радиус: 5
консоль.лог(`Площадь: ${круг.получитьПлощадь().toFixed(2)}`); // Площадь: 78.54
```

## Installation

### Global Installation

```bash
npm install -g russian-js-transpiler
```

### Local Installation

```bash
npm install --save-dev russian-js-transpiler
```

## Usage

### Command Line

```bash
# Transpile a file
rjs compile input.rjs -o output.js

# Watch for changes
rjs watch src/ -o dist/

# Run directly
rjs run script.rjs
```

### Programmatic API

```javascript
const { transpile } = require('russian-js-transpiler');

const rjsCode = 'переменная привет = "Привет, мир!";';
const jsCode = transpile(rjsCode);

console.log(jsCode);
// Output: var privet = "Привет, мир!";
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by CoffeeScript and other compile-to-JS languages
- Special thanks to all contributors who have helped improve this project

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

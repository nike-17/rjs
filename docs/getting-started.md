# Начало работы

## Установка

Установите Russian JS глобально:

```bash
npm install -g russian-js-transpiler
```

Или как dev-зависимость в ваш проект:

```bash
npm install --save-dev russian-js-transpiler
```

## Использование

```bash
# Транспиляция файла
rjs compile input.js -o output.js

# Запуск напрямую
rjs run script.js
```

## Интеграция с проектом

Добавьте в ваш `package.json`:

```json
{
  "scripts": {
    "build": "rjs compile src -d dist",
    "start": "rjs run src/index.js"
  }
}
```

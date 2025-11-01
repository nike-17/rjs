/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Введение',
    },
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Начало работы',
    },
    {
      type: 'category',
      label: 'Руководство',
      items: [
        'syntax',
        'api',
      ],
    },
    {
      type: 'category',
      label: 'Примеры',
      items: [
        'examples/hello-world',
        'examples/calculator',
        'examples/todo-app',
      ],
    },
    {
      type: 'category',
      label: 'Продвинутые темы',
      items: [
        'advanced/plugins',
        'advanced/custom-transforms',
        'advanced/performance',
      ],
    },
    {
      type: 'doc',
      id: 'faq',
      label: 'Частые вопросы',
    },
    {
      type: 'doc',
      id: 'contributing',
      label: 'Вклад в проект',
    },
  ],
};

module.exports = sidebars;

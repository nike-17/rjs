import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { resolve, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  // Set the base URL for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/rjs/' : '/',
  title: 'Russian JS',
  description: 'Пишите JavaScript на русском',
  lang: 'ru-RU',

  // Ensure clean URLs
  cleanUrls: true,

  // Ignore dead links during build
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Начало работы', link: '/doc/getting-started' },
      {
        text: 'Документация',
        items: [
          { text: 'Синтаксис', link: '/doc/syntax' },
          { text: 'API', link: '/doc/api' },
        ]
      },
      { text: 'GitHub', link: 'https://github.com/nike-17/rjs' }
    ],

    sidebar: [
      {
        text: 'Руководство',
        items: [
          { text: 'Начало работы', link: '/doc/getting-started' },
          { text: 'Синтаксис', link: '/doc/syntax' },
          { text: 'API', link: '/doc/api' }
        ]
      }
    ],

    // Social links in the footer
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/nike-17/rjs',
        ariaLabel: 'GitHub repository'
      }
    ],

    // Footer configuration
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright ${new Date().getFullYear()} Russian JS Transpiler`
    },

    // Search functionality
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Поиск',
            buttonAriaLabel: 'Поиск по документации'
          },
          modal: {
            noResultsText: 'Ничего не найдено',
            resetButtonTitle: 'Сбросить поиск',
            footer: {
              selectText: 'для выбора',
              navigateText: 'для навигации',
              closeText: 'закрыть'
            }
          }
        }
      }
    }
  },

  // Internationalization
  locales: {
    root: {
      label: 'Русский',
      lang: 'ru',
      dir: 'ltr',
      title: 'Russian JS',
      description: 'Пишите JavaScript на русском',
      themeConfig: {
        // Russian translations for theme elements
        docFooter: {
          prev: 'Назад',
          next: 'Вперед'
        },
        outline: {
          label: 'На этой странице'
        },
        lastUpdated: {
          text: 'Обновлено',
          formatOptions: {
            dateStyle: 'full',
            timeStyle: 'medium'
          }
        },
        langMenuLabel: 'Язык',
        returnToTopLabel: 'Вернуться наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
        lastUpdatedText: 'Последнее обновление',
        editLink: {
          pattern: 'https://github.com/nike-17/rjs/edit/main/docs/:path',
          text: 'Редактировать эту страницу'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      dir: 'ltr',
      link: '/en/',
      title: 'Russian JS',
      description: 'Write JavaScript in Russian'
    }
  },

  // Markdown extensions
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },



  outDir: resolve(__dirname, 'dist'),

  // Vite configuration
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
        '@theme': fileURLToPath(new URL('./theme', import.meta.url))
      }
    },
    publicDir: resolve(__dirname, '../../public'),
    build: {
      emptyOutDir: false,
      sourcemap: true,
      minify: 'terser',
      target: 'esnext',
      cssCodeSplit: true
    },
    server: {
      port: 3000,
      open: true,
      fs: {
        allow: ['..']
      }
    }
  }
})

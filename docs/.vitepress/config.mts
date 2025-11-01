import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Russian JS',
  description: 'Пишите JavaScript на русском',
  base: '/rjs/',
  
  themeConfig: {
    nav: [
      { text: 'Начало работы', link: '/getting-started' },
      { text: 'Документация', 
        items: [
          { text: 'Синтаксис', link: '/syntax' },
          { text: 'API', link: '/api' },
        ]
      },
      { text: 'GitHub', link: 'https://github.com/nike-17/rjs' }
    ],
    
    sidebar: [
      {
        text: 'Руководство',
        items: [
          { text: 'Начало работы', link: '/getting-started' },
          { text: 'Синтаксис', link: '/syntax' },
          { text: 'API', link: '/api' }
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
      copyright: `Copyright © ${new Date().getFullYear()} Russian JS Transpiler`
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
        lightModeSwitchTitle: 'Переключить на светлую тему',
        darkModeSwitchTitle: 'Переключить на темную тему'
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
  
  // Development server options
  server: {
    port: 3000,
    open: true
  },
  
  // Build configuration
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    cssCodeSplit: true
  }
})

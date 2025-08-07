## WebChat

Pet-проект веб-мессенджера с поддержкой обмена сообщениями в реальном времени через Firestore.
Проект создан для демонстрации практических навыков frontend-разработки с использованием **React, TypeScript, Zustand и Firebase**.

Разработан самостоятельно — от архитектуры до стилизации. Основной фокус: **реальное время с использованием Firestore**, **аутентификация через Firebase**, **приватные диалоги** и **адаптивный дизайн**.

## Содержание

1. [Демонстрация](#демонстрация)
2. [Функционал](#функционал)
3. [Технологии](#технологии)
4. [Скриншоты](#скриншоты)
5. [Быстрый старт](#быстрый-старт)
6. [Переменные окружения](#переменные-окружения)

## Демонстрация:

Демо проекта доступно по ссылке: [WebChat demo](https://agilarin.github.io/webchat/)

## Функционал

- **Чат в реальном времени:** Обмен сообщениями в реальном времени реализован с помощью Firestore. При открытии чата подгружается история сообщений с поддержкой пагинации. Пользователи могут отправлять не только текст, но и эмодзи для более живого общения.

- **Приватные диалоги и управление сообщениями:** Возможность создавать приватные чаты с другими пользователями. Пользователь может редактировать свои сообщения после отправки. Звуковые уведомления при поступлении новых сообщений.

- **Аутентификация:** Регистрация и вход по email и паролю через Firebase Authentication. Реализована возможность сброса пароля.

- **Поиск пользователей:** быстрый поиск и добавление собеседников

- **Адаптивный и интуитивный интерфейс:** Интерфейс оптимизирован под десктоп и мобильные устройства. Ручное изменение размеров интерфейса на десктопе.

## Технологии

- TypeScript
- React
- React-router
- Zustand
- Zod
- Sass
- firebase
- Vite

## Скриншоты:

<details>
  <summary>Показать скриншоты</summary>

<div align="center">
  <img alt="Chat" src="https://github.com/vlagris/webchat/blob/main/screenshots/chat-open.png">
  <p><i>Чат</i></p>
  <img alt="Chat" src="https://github.com/vlagris/webchat/blob/main/screenshots/chat-info.png">
  <p><i>Информация о чате</i></p>
  <img alt="Edit user account" src="https://github.com/vlagris/webchat/blob/main/screenshots/edit-account.png">
  <p><i>Редактирование аккаунта</i></p>
  <img alt="Search" src="https://github.com/vlagris/webchat/blob/main/screenshots/search.png">
  <p><i>Поиск пользователей</i></p>
  <img alt="Login" src="https://github.com/vlagris/webchat/blob/main/screenshots/login-page.png">
  <p><i>Страница авторизации</i></p>
</div>

</details>

## Быстрый старт

#### Клонирование репозитория

```
git clone https://github.com/vlagris/webchat.git
cd webchat
```

#### npm

Установка и запуск:

```
npm install
npm run dev
```

#### pnpm

Установка и запуск:

```
pnpm install
pnpm dev
```

Откройте http://localhost:5173 в браузере.

## Переменные окружения

Перед запуском проекта создайте файл `.env.local` в корне и добавьте туда следующие переменные:

```dotenv
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

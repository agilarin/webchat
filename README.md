## WebChat

<p>
    <img alt="NPM Badge" src="https://img.shields.io/badge/v10.2.3-green?label=npm&color=blue">
</p>

WebChat - это веб приложение для общения между пользователями. Для использования приложения в нем нужно зарегистрироваться.


## Содержание

1. [Технологии](#технологии)
2. [Быстрый старт](#быстрый-старт)
2. [Функционал](#функционал)
3. [Ссылки](#ссылки)
4. [Скриншоты](#скриншоты)



## Технологии
Frontend:
- TypeScript
- React
- React-router
- Sass
- firebase
- Vite



## Функционал

**Система аутентификации:** аутентификации в приложении сделана с помощью [Firebase Authentication](https://firebase.google.com/docs/auth).

**Редактирование аккаунта:** возможность изменить информацию пользователя такую как имя, электронная почта,
имя пользователя и пароль.

**Поиск:** с помощью него можно найти других пользователей, чтобы начать общение.

**Чат:** с помощью него пользователи могут общаться друг с другом. Доступны только текстовые сообщения. Чат между пользователями создается при отправке первого сообщения.



## Быстрый старт


#### Клонирование репозитория
```
git clone https://github.com/vlagris/webchat.git
cd webchat
```

#### npm
Установить зависимости проекта:
```
npm install
```
Запустить проект:
```
npm run dev
```

#### pnpm
Установить зависимости проекта:
```
pnpm install
```
Запустить проект:
```
pnpm run dev
```
Откройте http://localhost:5173 в вашем браузере, чтобы просмотреть проект.



## Ссылки:

Проект запущен на [github pages](https://vlagris.github.io/webchat/)



## Скриншоты:
<div align="center"> 
  <img alt="Chat" src="https://github.com/vlagris/webchat/blob/main/screenshots/chat-open.png">
  <p><i>Чат</i></p>
  <img alt="Edit user account" src="https://github.com/vlagris/webchat/blob/main/screenshots/edit-account.png">
  <p><i>Редактирование аккаунта</i></p>
  <img alt="Search" src="https://github.com/vlagris/webchat/blob/main/screenshots/search.png">
  <p><i>Поиск пользователей</i></p>
  <img alt="Login" src="https://github.com/vlagris/webchat/blob/main/screenshots/login-page.png">
  <p><i>Страница авторизации</i></p>
</div>




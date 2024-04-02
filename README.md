# React + TypeScript + Express + Prisma + Bcrypt + Supabase

Backend часть проекта книжный магазин

Состоит из

Роутеры
Auth - login,register
Author - CRUD для справочника авторов
Book - CRUD и API для книг
Category - CRUD для справочника категорий
Currency - CRUD для справочника валют
Rating - CRUD и API для комментариев и рейтинга
User - личные пользовательские API (избранные книги и так далее)

Middleware с проверкой JWT токена пользователя.

В качестве базы данных используется Supabase

В качестве сессии используется express-session

Проект выложен на хостинге Vercel
https://book-backend-api.vercel.app/

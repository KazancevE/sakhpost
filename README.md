Основные возможности
Регистрация/логин/логаут (JWT)
Защищенные роуты (ProtectedRoute.tsx)
Профиль пользователя (Profile.tsx)
Админ-панель: список пользователей с поиском, пагинацией, сортировкой (Admin.tsx)
Роли: USER/ADMIN

| Компонент | Стек                                             |
| --------- | ------------------------------------------------ |
| Backend   | NestJS, TypeORM, PostgreSQL, JWT                 |
| Frontend  | React 18, TypeScript, Mantine UI, React Router   |
| DevOps    | Docker Compose, Nginx                            |
| Utils     | class-validator, AuthContext.tsxAuthContext.tsx​ |

Локальный запуск: 
  # Backend
  cd backend && npm i && npm run start:dev
  
  # Frontend  
  cd frontend && npm i && npm run dev

Или проще через докер
  docker compose up --build -d

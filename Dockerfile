# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json отдельно для кэширования
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы
COPY . .

# Открываем порт 4200
EXPOSE 4200

# Собираем приложение
RUN npm run build -- --configuration=production


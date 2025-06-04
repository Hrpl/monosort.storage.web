# Stage 1: BuildAdd commentMore actions
FROM node:18-alpine AS builder
WORKDIR /appAdd commentMore actions

# Копируем package.json отдельно для кэширования
COPY package.json package-lock.json ./
# Устанавливаем зависимостиAdd commentMore actions
RUN npm ci

# Копируем остальные файлы
COPY . .
EXPOSE 4200

# Собираем приложениеAdd commentMore actions
RUN npm run build -- --configuration=production

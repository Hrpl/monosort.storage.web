# Stage 1: BuildAdd commentMore actions
FROM node:18-alpine AS builder
WORKDIR /app
# Копируем package.json отдельно для кэширования
COPY package*.json ./
# Устанавливаем зависимостиAdd commentMore actions
RUN npm install

# Копируем остальные файлы
COPY . .
EXPOSE 4200

RUN npm run build
# Открыть порт 4200
EXPOSE 4200
# Установить команду для запуска приложения Angular при запуске контейнера
CMD ["ng", "serve", "--host=0.0.0.0"]

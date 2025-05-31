# Этап 1: Сборка Angular
FROM node:18 as angular-builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Этап 2: Сборка Electron
FROM node:18 as electron-builder

WORKDIR /app
COPY --from=angular-builder /app /app

# Устанавливаем зависимости Electron
RUN npm install electron --save-dev
RUN npm install @electron/remote --save

# Копируем electron-specific файлы
COPY electron/main.js ./electron/

# Этап 3: Финальный образ для разработки
FROM node:18

WORKDIR /app

# Копируем только нужные файлы
COPY --from=angular-builder /app/package.json /app/package-lock.json ./
COPY --from=angular-builder /app/dist /app/dist
COPY --from=electron-builder /app/node_modules /app/node_modules
COPY --from=electron-builder /app/electron /app/electron

# Устанавливаем Angular CLI глобально
RUN npm install -g @angular/cli

# Открываем порты
EXPOSE 4200 9229

# Команды для запуска
CMD ["sh", "-c", "ng serve --host 0.0.0.0 & npm run electron:dev"]

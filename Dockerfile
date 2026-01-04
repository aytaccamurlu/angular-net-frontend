# 1. Aşama: Derleme (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Bağımlılıkları yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala ve projeyi derle
COPY . .
RUN npm run build

# 2. Aşama: Sunucu (Nginx)
FROM nginx:stable-alpine

# Angular derleme çıktılarını Nginx'in yayın klasörüne kopyala
# NOT: "dist/frontend/browser" kısmını kendi proje yapınıza göre kontrol edin!
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Nginx özel yapılandırmasını kopyala (Sayfa yenileme hatasını önlemek için)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

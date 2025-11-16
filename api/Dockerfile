# Gunakan base image Node.js versi 18
FROM node:18-alpine

# Tentukan folder kerja di dalam kontainer
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan Docker cache agar 'npm install' tidak berjalan setiap kali kode berubah
COPY package*.json ./

# Instal dependencies
RUN npm install

# Salin sisa kode aplikasi kita ke dalam folder /app di kontainer
COPY . .

# Beri tahu Docker bahwa kontainer kita akan berjalan di port 3000
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat kontainer dimulai
CMD [ "node", "index.js" ]
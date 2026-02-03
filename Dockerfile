FROM node:20-alpine

WORKDIR /app

# ติดตั้ง dependencies ก่อน (เพื่อ cache ได้)
COPY package*.json ./
RUN npm install --production

# คัดลอกโค้ดทั้งหมด
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# CMD ["node", "app.js"]
CMD ["npm", "start"]
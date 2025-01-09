FROM node:8-alpine
WORKDIR /backend
COPY /backend/package*.json ./
RUN npm install --only=production
COPY /backend .
ENTRYPOINT ["node", "--inspect=9229", "app.js"]

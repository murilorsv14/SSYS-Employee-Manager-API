FROM node:alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
EXPOSE 8000
COPY . .
RUN npm run db:start
CMD ["npm", "start"]
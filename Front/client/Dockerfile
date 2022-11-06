FROM node:14.18.1

WORKDIR /client

COPY package.json .
RUN npm run build

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
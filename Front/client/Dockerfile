FROM node:14.18.1

WORKDIR /client
ENV PATH='./node_modules/.bin:$PATH'
COPY . .
RUN npm run build

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
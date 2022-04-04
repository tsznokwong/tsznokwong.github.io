FROM node:16-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json", "./"]
RUN npm install

ADD . /usr/src/app

CMD ["npm", "start"]
EXPOSE 3000
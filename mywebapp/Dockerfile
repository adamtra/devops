FROM node:alpine

WORKDIR /opt/app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm i

COPY . .

CMD [ "npm", "start" ]
FROM node:alpine

WORKDIR /opt/app

COPY package.json yarn.lock? ./

RUN yarn install

COPY . .

CMD ["yarn", "dev"]
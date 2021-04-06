FROM node:alpine

WORKDIR /app

COPY package.json /app

RUN yarn install --no-lockfile

COPY . /app

CMD ["yarn", "run", "start"]
FROM node:9.5

COPY . /src

WORKDIR /src

RUN yarn install && npm run build

CMD ["npm", "start"]
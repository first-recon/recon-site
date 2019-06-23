FROM recon-base:local

COPY . /src

WORKDIR /src

RUN yarn install && npm run build

CMD ["npm", "start"]
FROM node:12.13.0-alpine

WORKDIR /usr/src/app
COPY . .

RUN npm install

ARG NODE_ENV=production


COPY ./.env.${NODE_ENV} ./.env

EXPOSE 8080

ENTRYPOINT ["npm", "run"]

CMD ["serve"]


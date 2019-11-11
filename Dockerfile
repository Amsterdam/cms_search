# HACK: we need python to be installed in the container for now, because of deploy-cms_search.yml 'command' line in the Openstack repo
# FROM node:12.13.0-alpine
FROM node:12.13.0-buster

WORKDIR /usr/src/app
COPY . .

RUN npm install

ARG NODE_ENV=production


COPY ./.env.${NODE_ENV} ./.env

EXPOSE 8080

CMD ["npm", "run", "serve"]


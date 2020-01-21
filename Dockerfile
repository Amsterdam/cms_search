# HACK: we need python to be installed in the container for now, because of deploy-cms_search.yml 'command' line in the Openstack repo
# FROM node:12.13.0-alpine
FROM node:12.13.0-buster

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 8080

ENTRYPOINT [""]

CMD ["npm", "run", "serve"]


# HACK: we need python to be installed in the container for now, because of deploy-cms_search.yml 'command' line in the Openstack repo
# FROM node:12.13.0-alpine
FROM node:erbium-buster

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install project with a clean slate.
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm", "run", "serve"]
FROM node:16 as nodejs

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY assets ./assets
# Install project with a clean slate.
RUN npm ci --only=production --ignore-scripts

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm", "run", "serve"]

################################
# Deploy
################################
FROM nginx:1.20.2-alpine as nginx

COPY ./internals/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./internals/nginx/default.conf /etc/nginx/conf.d/



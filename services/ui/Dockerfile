### STAGE 1: Build ###

# We label our stage as ‘modules’
FROM node:10 as modules

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

FROM node:10 as base
WORKDIR /usr/src/app

COPY --from=modules /usr/ /usr/
COPY . .

# For dev purposes
FROM base as dev

ENV PORT=80
ENV CI=true
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 80

CMD ["npm", "run", "start"]

# We label our stage as ‘builder’
FROM base as builder

WORKDIR /usr/src/app

RUN npm run build

### STAGE 2: Setup ###

FROM nginx:1.15-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

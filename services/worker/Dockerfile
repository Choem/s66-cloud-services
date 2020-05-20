FROM node:12 as base

# Set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json* .


RUN npm ci
COPY . .

FROM base as dev
CMD ["npm", "run", "start:dev"]

# Buid environment (production only)
FROM base as build

WORKDIR /usr/src/app

RUN npm run build

### STAGE 3: API ###
FROM build
WORKDIR /usr/src/app

ENV NODE_ICU_DATA node_modules/full-icu

EXPOSE 3333

CMD [ "node", "dist/main.js" ]
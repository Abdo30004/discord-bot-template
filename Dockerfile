# stage 1 - build environment
FROM node:22.14-alpine3.21  AS build

WORKDIR /app


COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

# Stage 2 - the production environment

FROM node:22.14-alpine3.21 AS production

WORKDIR /app

COPY --from=build /app/dist /app/dist 
COPY --from=build /app/assets /app/assets
COPY --from=build /app/package.json /app
COPY --from=build /app/package-lock.json /app/package-lock.json


RUN npm ci --omit=dev

ENV NODE_ENV=production



CMD ["npm","start"]






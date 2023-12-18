FROM node:18.17-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm ci
COPY --chown=node:node ./dist .
CMD ["node", "index.js"]
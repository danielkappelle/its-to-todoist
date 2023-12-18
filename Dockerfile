FROM endeveit/docker-jq AS deps

# https://stackoverflow.com/a/58487433
# To prevent cache invalidation from changes in fields other than dependencies

COPY package.json /tmp

RUN jq '{ dependencies, devDependencies }' < /tmp/package.json > /tmp/deps.json


FROM node:18.17-slim

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --from=deps /tmp/deps.json ./package.json
COPY package-lock.json .
USER node
RUN npm ci
COPY --chown=node:node ./dist .
CMD ["node", "index.js"]
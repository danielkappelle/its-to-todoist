# Itslearning to Todoist

Please note that this is primarily a personal project, but it may be used/forked if it is of any use to anyone.

## Set up

Use the correct version of node (I suggest to use nvm)

```sh
nvm use
```

Install dependencies

```sh
npm i
```

Set up the environment vars. Copy the `.env.example` to `.env` and fill in the necessary data. Todoist api key (for development usage) can be retrieved by logging in to [todoist](https://app.todoist.com), go to settings > integrations > Developer. There you can find you API token.

The base url of the ITS page is just the url without the trailing `/`.

Start the project

```sh
npm start
```

## Build Docker

Set the docker url or tag in the `.env` file, i.e. `ghcr.io/youruser/yourpackage`.

Building

```sh
npm run docker:build
```

Pushing

```sh
npm run docker:push
```

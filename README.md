# o2r contentbutler

![Travis CI](https://api.travis-ci.org/o2r-project/o2r-contentbutler.svg)

Node.js implementation of the `/api/v1/compendium/:id/data` and `/api/v1/job/:id/data` resources in the [o2r web api](http://o2r.info/o2r-web-api).

## Requirements

Besides Node.js (`>= 6.x`), this project requires the ImageMagick tool `convert`.

## Configuration

The configuration can be done via environment variables.

- `CONTENTBUTLER_PORT`
  Define on which port the service should listen. Defaults to `8081`.
- `CONTENTBUTLER_MONGODB` __Required__
  Location for MongoDB. Defaults to `mongodb://localhost/`.
- `CONTENTBUTLER_MONGODB_DATABASE`
  Which database inside the mongo db should be used. Defaults to `muncher`.
- `CONTENTBUTLER_BASEPATH`
  Base path for the compendia storage. Defaults to `/tmp/o2r`.
- `SESSION_SECRET`
  String used to sign the session ID cookie, must match other microservices' configurations.

## Run locally

```
mkdir mongodbdata
mongod --dbpath ./.mongodbdata

npm install
npm start
```

Open the application at http://localhost:8081/api/v1/compendium/1234/test

To show logs in the console, replace the last command with `DEBUG=* npm start`. There you can also see if requests are handled while not having any real data yet.

To add some content to your local database, use [o2r-muncher](https://github.com/o2r-project/o2r-muncher).

Inspect your local MongoDB with [adminMongo](https://mrvautin.com/adminmongo/).

## Debug locally

```
npm run-script debug
```

The start statement in this script sets the DEBUG variable for the [debug library](https://www.npmjs.com/package/debug) to `*` (show all logs).
Direct the log into a file using `DEBUG=* npm start > log.txt`.

## Test

Tests need a completely new environment (empty database), which is preferably started with the docker-compose file `docker-compose.yml`. The Docker compose configuration also pulls the latest contentbutler from Docker Hub, but we can just ignore that for our local tests.

```
npm install
npm install -g mocha
docker-compose up -d
sleep 10
npm test
docker-compose down -v
```

## Dockerfile

The file `Dockerfile` describes the Docker image published at [Docker Hub](https://hub.docker.com/r/o2rproject/o2r-contentbutler/).

## License

o2r contentbutler is licensed under Apache License, Version 2.0, see file LICENSE.

Copyright (C) 2017 - o2r project.

![Travis CI](https://api.travis-ci.org/o2r-project/o2r-contentbutler.svg)
# o2r contentbutler

Node.js implementation of the `/api/v1/compendium/:id/data` and `/api/v1/job/:id/data` resources in the [o2r web api](http://o2r.info/o2r-web-api).

## Requirements

Besides Node.js, this project requires the Image Magick tool `convert`.

## Testing

Needs a completely new environment (empty database), preferably started with the docker-compose files.

```
npm install
npm install -g mocha
docker-compose up -d
sleep 10
mocha
docker-compose down -v

```

## License

o2r contentbutler is licensed under Apache License, Version 2.0, see file LICENSE.

Copyright (C) 2016 - o2r project.

FROM alpine:3.4
MAINTAINER o2r-project, https://o2r.info

RUN apk add --no-cache nodejs imagemagick git \
  && git clone --depth 1 -b master https://github.com/o2r-project/o2r-contentbutler /contentbutler \
  && rm -rf /var/cache
RUN cd /contentbutler && npm install
CMD cd /contentbutler && npm start

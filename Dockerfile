FROM node:alpine3.15

WORKDIR /usr/src/iprofiler-grpc-api

COPY ./ ./

RUN apk update && apk add bash

RUN npm install

# CMD ["/bin/bash"]

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
CMD bash  
FROM cypress/browsers:latest
ARG NPM_TOKEN
COPY .npmrc .npmrc
COPY package.json package.json
RUN npm install
RUN rm -f .npmrc

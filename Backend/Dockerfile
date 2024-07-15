FROM node:19-alpine
WORKDIR /app
RUN apk update && apk add --no-cache \
    g++ \
    python3 \
    py3-pip \
    openjdk11-jre \
    openjdk11-jdk \
    gcc \
    musl-dev
    
COPY package.json .
RUN npm i
COPY . .
EXPOSE 5000
CMD ["node","server.js"]
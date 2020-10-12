FROM node:14.4.0

#Create app directory
WORKDIR /usr/src/main

#Install app dependencies
COPY package*.json ./

RUN npm install

#Bundle app source
COPY . .

EXPOSE 3001
ENTRYPOINT ["npm", "start"]


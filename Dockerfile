FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
# Copy all other source code to work directory
COPY . . 

# TypeScript
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]

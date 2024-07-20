FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install client app dependencies
RUN cd client && npm ci

# Install server app dependencies
RUN cd server && npm ci && npm run build-client

WORKDIR /usr/src/app/server

# compile typscript on backend
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the app
CMD npm run start

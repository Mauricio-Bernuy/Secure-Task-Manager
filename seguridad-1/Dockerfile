FROM node:16.13.2-alpine3.15
WORKDIR /app
COPY package.json ./
RUN npm install --loglevel verbose
COPY . /app
EXPOSE 3000
# CMD ["npm", "run", "dev"]
CMD ["npm", "start"]

# // "start": "next start",

FROM node:18-alpine

WORKDIR /usr/src/app

# Install global nodemon
RUN npm install -g nodemon

# Install dependencies
COPY package*.json ./
# Install all dependencies (including devDeps) so `npm run dev` works inside the container
RUN npm install

# Copy source
COPY . .

ENV NODE_ENV=development

EXPOSE 3000

CMD ["npm", "run", "dev"]

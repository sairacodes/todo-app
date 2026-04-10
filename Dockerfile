FROM node:18

# Install PM2 globally
RUN npm install -g pm2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Run app with PM2
CMD ["pm2-runtime", "app.js"]

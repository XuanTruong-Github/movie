FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy remaining source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 (Next.js default)
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["npm", "start"]

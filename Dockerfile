# Base image
FROM node:25.6.1

RUN npm i -g pnpm

WORKDIR /app

# Copy lock + package trước để cache tốt hơn
COPY package.json pnpm-lock.yaml ./

# Install deps
RUN pnpm install

# Copy source
COPY . .

# Build Next
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
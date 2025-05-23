# Build stage
FROM node:20-alpine as build

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files and build
COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

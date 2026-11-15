# Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Firebase build-time configuration (pass via --build-arg)
ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_DATABASE_URL
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_MEASUREMENT_ID

ENV FIREBASE_API_KEY=$FIREBASE_API_KEY \
    FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN \
    FIREBASE_DATABASE_URL=$FIREBASE_DATABASE_URL \
    FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID \
    FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET \
    FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID \
    FIREBASE_APP_ID=$FIREBASE_APP_ID \
    FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID

# Build Angular application for production
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist/RamanathanSks-v2/browser /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

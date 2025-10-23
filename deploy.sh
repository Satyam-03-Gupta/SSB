#!/bin/bash

# Build React frontend
cd frontend
npm run build

# Copy build files to Nginx directory
sudo cp -r build/* /var/www/html/build/

# Install backend dependencies and start with PM2
cd ../backend
npm install --production
pm2 start server.js --name "ssb-backend"

# Copy and enable Nginx config
sudo cp ../nginx.conf /etc/nginx/sites-available/ssb
sudo ln -sf /etc/nginx/sites-available/ssb /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "Deployment complete!"
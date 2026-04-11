# Deploy Server (Node API) on Hostinger VPS

This runs your Express API on port 5000 and exposes it through Nginx.

## 1) Prepare server env
Create `/var/www/myshop/server/.env`:
```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/myshop
CORS_ORIGINS=https://shafisons.pk,https://admin.shafisons.pk
SERVER_URL=https://api.shafisons.pk
PAYFAST_DEBUG=true
```

## 2) Install and start API with PM2
```bash
cd /var/www/myshop/server
npm install
sudo npm install -g pm2
pm2 start index.js --name myshop-api
pm2 save
pm2 startup
```

## 3) Copy Nginx config
```bash
sudo cp /var/www/myshop/deploy/hostinger/server/nginx.conf /etc/nginx/sites-available/myshop-api
```

Edit domain in config:
- Replace `api.shafisons.pk 31.97.98.13` with your real domain (for example `api.shafisons.pk`) or VPS IP.

## 4) Enable site
```bash
sudo ln -s /etc/nginx/sites-available/myshop-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5) Optional SSL
```bash
sudo certbot --nginx -d api.shafisons.pk
```

## 6) Verify
```bash
curl http://127.0.0.1:5000/api/health
curl https://api.shafisons.pk/api/health
pm2 logs myshop-api
```


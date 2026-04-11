# Deploy Admin Panel on Hostinger VPS

This serves your React admin app from Nginx static files.

## 1) Build admin
```bash
cd /var/www/myshop/admin
npm install
npm run build
```

## 2) Set API URL for admin (important)
Create `admin/.env` before build:
```bash
VITE_API_URL="https://api.shafisons.pk"
```
Then rebuild:
```bash
npm run build
```

## 3) Copy Nginx config
```bash
sudo cp /var/www/myshop/deploy/hostinger/admin/nginx.conf /etc/nginx/sites-available/myshop-admin
```

Edit domain in config:
- Replace `admin.shafisons.pk 31.97.98.13` with your real domain (for example `admin.shafisons.pk`) or VPS IP.

## 4) Enable site
```bash
sudo ln -s /etc/nginx/sites-available/myshop-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5) Optional SSL
```bash
sudo certbot --nginx -d admin.shafisons.pk
```

## Notes
- App root is `/var/www/myshop/admin/dist`
- SPA routing is included
- Preferred setup: admin uses `VITE_API_URL` to call API domain directly


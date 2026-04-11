# Deploy Client (Main Website) on Hostinger VPS

This serves your React client from Nginx static files.

## 1) Build client
```bash
cd /var/www/myshop/client
npm install
npm run build
```

## 2) Copy Nginx config
```bash
sudo cp /var/www/myshop/deploy/hostinger/client/nginx.conf /etc/nginx/sites-available/myshop-client
```

Edit domain in config:
- Replace `shafisons.pk 31.97.98.13` with your real domain (for example `shafisons.pk`) or VPS IP.

## 3) Enable site
```bash
sudo ln -s /etc/nginx/sites-available/myshop-client /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4) Optional SSL (Let's Encrypt)
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d shafisons.pk
```

## Notes
- App root is `/var/www/myshop/client/dist`
- SPA routing is already configured with `try_files ... /index.html`
- If you want same-domain `/api`, uncomment API proxy block in `nginx.conf`


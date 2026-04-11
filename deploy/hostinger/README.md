# Hostinger VPS Deployment Pack

Use these folders:

- `deploy/hostinger/server/` -> API server setup + Nginx reverse proxy
- `deploy/hostinger/client/` -> Main website static hosting + Nginx
- `deploy/hostinger/admin/` -> Admin panel static hosting + Nginx

## Recommended order
1. Deploy API first (`server/README.md`)
2. Deploy client (`client/README.md`)
3. Deploy admin (`admin/README.md`)
4. Configure SSL for each domain

## Suggested domains
- Client: `shafisons.pk`
- Admin: `admin.shafisons.pk`
- API: `api.shafisons.pk`

## Important
- In admin and client, set API URL to your API domain before build:
  - `VITE_API_URL="https://api.shafisons.pk"`
- In server `.env`, keep:
  - `PORT=5000` (without spaces/semicolon)
  - `CORS_ORIGINS=https://shafisons.pk,https://admin.shafisons.pk`


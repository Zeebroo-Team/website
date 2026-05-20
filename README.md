# Zeebroo Website

Marketing landing page built with the Melt HTTP server.

## Run

From the melting-lang project root:

```bash
./build/melt zeebroo-website/main.melt
```

Open **http://localhost:8788**

## Pages

- `/` — Home (single-page marketing site)
- `/about` — About Zeebroo

## Structure

- `main.melt` — HTTP handler entry
- `config/app.melt` — Site name and port
- `routes.melt` — URL routing + static files (`public/css`, `public/js`, `public/images`)
- `controllers/` — Home and 404 handlers
- `views/layout.html` — Shared header, footer, and navbar
- `views/home_content.html` — Home page sections
- `views/about_content.html` — About page content
- `public/images/` — Logo, hero poster, and demo video (served at `/images/…`)

## Deploy (Ubuntu + Nginx + systemd)

Auto-deploy on push to `main` via GitHub Actions. See **[docs/DEPLOY.md](docs/DEPLOY.md)** for server setup, SSH keys, and GitHub secrets.

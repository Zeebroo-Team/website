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

## Structure

- `main.melt` — HTTP handler entry
- `config/app.melt` — Site name and port
- `routes.melt` — URL routing + static files (`public/css`, `public/js`, `public/images`)
- `controllers/` — Home and 404 handlers
- `views/home.html` — Full landing page
- `public/images/` — Logo, hero poster, and demo video (served at `/images/…`)

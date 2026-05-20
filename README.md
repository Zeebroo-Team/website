# Zeebroo Website

A simple marketing-style site built with the Melt HTTP server and MVC-style structure.

## Run

From the melting-lang project root:

```bash
./build/melt zeebroo-website/main.melt
```

Open **http://localhost:8788**

## Pages

- `/` — Home
- `/about` — About
- `/contact` — Contact form (POST shows a thank-you message)

## Structure

- `main.melt` — HTTP handler entry
- `config/app.melt` — Site name and port
- `routes.melt` — URL routing + static files (`public/css`, `public/js`, `public/images`)
- `controllers/` — Page logic
- `views/` — HTML templates (`{{ var }}`, `{!! raw !!}`)
- `public/css/style.css` — Stylesheet

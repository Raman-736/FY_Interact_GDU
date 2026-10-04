# GDU Studio Sprint

Team quiz game for the first-year meet (React + Vite). 2-3 people share one phone.

## Run locally
```
npm install
npm run dev        # opens on http://localhost:5173 and on your Wi-Fi IP (for phones)
```

## Build and deploy
```
npm run build      # creates dist/
```
Upload the **dist** folder to Netlify Drop (app.netlify.com/drop), GitHub Pages, Vercel, or any static host / sub-folder of your site.

## Edit content
- Questions, timers, categories: `src/data/questions.js`
- Collect every team's score (optional): set `SUBMIT_URL` in `src/data/questions.js`
- Colours / layout: `src/styles.css`
- Logo: `public/gdu_logo.png`

`legacy/` holds the earlier single-file HTML versions.

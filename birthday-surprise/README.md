# 🌸 Birthday Surprise Website

A cinematic, emotional birthday journey website built with React + Tailwind CSS + Framer Motion.

---

## Quick Start

```bash
npm install
npm run dev
```

## Customize

1. **Add her name**: Open `src/data/timelineData.js`, set `CONFIG.herName`
2. **Add your photos**: Drop `photo1.jpg` through `photo10.jpg` into `public/images/`
3. **Add music**: Drop `music.mp3` into `public/music/`
4. **Edit messages**: Edit the `quote` and `subtext` in each timeline entry

## Deploy to GitHub Pages

### Step 1 — Create GitHub repo
Go to github.com → New repository → name it `birthday-surprise`

### Step 2 — Install and build
```bash
npm install
npm run build
```

### Step 3 — Update config
In `vite.config.js`, change `/birthday-surprise/` to match your repo name.
In `src/data/timelineData.js`, update `CONFIG.repoName` to match.

### Step 4 — Push code
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/birthday-surprise.git
git push -u origin main
```

### Step 5 — Deploy
```bash
npm run deploy
```

### Step 6 — Enable GitHub Pages
Go to your repo → Settings → Pages → Source: `gh-pages` branch → Save

Your site will be live at:
`https://YOUR_USERNAME.github.io/birthday-surprise/`

---

## Folder Structure

```
birthday-surprise/
├── public/
│   ├── images/          ← Add photo1.jpg ... photo10.jpg here
│   └── music/           ← Add music.mp3 here
├── src/
│   ├── App.jsx          ← Main app with all screens
│   ├── data/
│   │   └── timelineData.js   ← Edit quotes & image paths here
│   ├── styles/
│   │   └── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Music Suggestions (royalty-free)
- pixabay.com → search "lofi piano"
- freemusicarchive.org
- uppbeat.io

## Tech Stack
- React 18
- Framer Motion (animations)
- Tailwind CSS (styling)
- Vite (build tool)
- gh-pages (deployment)
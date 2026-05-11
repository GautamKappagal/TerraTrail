# TerraTrail

TerraTrail is a modern travel log frontend where you can save destinations and visualize them on an interactive map.

**Tech stack**
- React + Vite
- Tailwind CSS (utility-first styling)
- React Leaflet + OpenStreetMap tiles
- LocalStorage persistence (no backend)
- React Icons

## Features
- Click anywhere on the map to add a destination (lat/lng captured automatically)
- Modal form: place name, travel date, notes, image URL
- Markers + popups: image, name, date, notes
- Responsive sidebar with destination cards (search + delete)
- Clicking a card recenters the map and opens its popup
- Data persists across refresh with LocalStorage

## Getting started

**Install**
```bash
npm install
```

**Run locally**
```bash
npm run dev
```

**Production build**
```bash
npm run build
npm run preview
```

## Project structure
```txt
src/
  components/
    AddPlaceModal.jsx
    MapView.jsx
    Sidebar.jsx
    PlaceCard.jsx
  data/
    storage.js
  App.jsx
  main.jsx
  index.css
```

## Leaflet notes
- Leaflet CSS is imported in `src/main.jsx`.
- Default marker icon URLs are fixed in `src/main.jsx` (common issue with bundlers).
- Map tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

## Deploy to Vercel
1. Push this repo to GitHub.
2. In Vercel: **New Project** → Import the repo.
3. Build settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

No environment variables are required.

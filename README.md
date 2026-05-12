# TerraTrail 🌍

Terratrail is a modern interactive travel journal where users can pin destinations, attach memories, and explore trips on a beautifully designed world map.

**Tech stack**
- React + Vite
- Tailwind CSS (utility-first styling)
- React Leaflet + OpenStreetMap tiles
- LocalStorage persistence (no backend)
- React Icons

## Features

- 🌍 Interactive world map with custom destination markers
- 📍 Smart location pinning via map click or typed destination search
- 📝 Travel journal entries with notes, ratings, and images
- 🔎 Searchable sidebar with animated destination cards
- ✨ Smooth fly-to map animations and interactive popups
- 💾 Persistent storage using LocalStorage
- 📱 Responsive modern UI built with Tailwind CSS

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

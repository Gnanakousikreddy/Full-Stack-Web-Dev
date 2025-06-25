# 🎥 MiniTube – A Mini YouTube Clone (Frontend Only)

A responsive, feature-rich **YouTube-inspired video app** built using **React JS** and **Tailwind CSS**. This frontend-only clone showcases reusable components, state management with hooks, routing, UI interactivity, and session-based storage — all without a backend!

---

## ✨ Features

- 🧱 **Functional Components Only** – clean, reusable design
- 🧠 **React Hooks**
  - `useState` – likes, watch later, dark/light mode
  - `useEffect` – session storage sync, live timer
- 🌐 **Routing with `react-router-dom`**
  - `/` – Home page with video feed
  - `/watchlater` – Watch Later list
- 💡 **Dark / Light Mode Toggle**
- ⏱️ **Live Timer** – shows time spent on the app (session-based)
- ❤️ **Like Videos** – thumbs-up toggle with Font Awesome icons
- ➕ **Watch Later** – save/unsave videos using `sessionStorage`
- 📦 **Tailwind CSS Styling** – modern UI, hover effects, responsive grid

---

## 📁 Project Structure
```
src/
├── components/
│ ├── Navbar.jsx # Sticky nav with search, toggle, timer, watchlater
│ ├── VideoCard.jsx # Styled card with thumbnail, info, like, watchlater
│ ├── Timer.jsx # Live session timer
│
├── pages/
│ ├── Home.jsx # Video feed using dummy data
│ └── WatchLater.jsx # Filtered view of saved videos
│
├── data/
│ └── dummyVideos.js # Array of sample video objects
│
├── App.jsx # App layout with routing and theme state
└── index.js # Entry point
```

---



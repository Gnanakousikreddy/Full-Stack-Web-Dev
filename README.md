# Full-Stack-Web-Dev

A four-week, project-per-week walk through the full stack — from a hand-written
static portfolio page to a JWT-authenticated YouTube clone with a Django REST
Framework backend and a React frontend.

Each week is self-contained and builds on the last:

| Week | Project | Stack | What it adds |
|------|---------|-------|--------------|
| [1](#week-1--portfolio-site-htmlcssjs) | Personal portfolio site | HTML, CSS, vanilla JS | DOM, layout, animation, no build step |
| [2](#week-2--minitube-react--tailwind) | MiniTube (frontend-only YouTube) | React 19, Tailwind CSS, React Router | Components, hooks, routing, `sessionStorage` |
| [3](#week-3--django-practice-apps) | Four Django practice apps | Django 5.2, DRF | Models, templates, custom user models, first REST API |
| [4](#week-4--youtube-clone-django-rest--react) | YouTube clone (final project) | Django + DRF + SimpleJWT + PostgreSQL, React + Bootstrap | A real client/server split with token auth and file uploads |

---

## Repository layout

```
week1/                        static portfolio site
  index.html  style.css  script.js  images/  resume.pdf

week2/mini_youtube/           React + Tailwind frontend-only clone
  src/{components,pages,data}/

week3/
  practice/
    theme/                    static HTML/CSS mockup used as the design target
    mysite/                   "blog" — full Django app (rooms, messages, topics) + a small DRF API
    customusermodel/          minimal project: swapping in a custom AUTH_USER_MODEL
    rest_api/                 minimal project: function-based DRF CRUD views
  youtube_auth/               Django auth flow (register / login / verify / dashboard)

week4/youtube clone/
  backend/                    Django + DRF + SimpleJWT API
  frontend/                   React SPA that consumes it
```

Every Django project keeps its own `manage.py`, so commands below are always run
from that project's own directory.

---

## Week 1 — portfolio site (HTML/CSS/JS)

`week1/` is a single-page personal site with no dependencies and no build step.
`script.js` drives everything on load:

- staggered entrance animations for the navbar items and hero children
- a character-by-character typing effect for the intro line
- a horizontal gallery scroller with prev/next arrows and dot indicators
- section reveals plus a contact form

**Run it:** open `week1/index.html` in a browser, or serve the folder:

```bash
cd week1 && python3 -m http.server 8000   # http://localhost:8000
```

---

## Week 2 — MiniTube (React + Tailwind)

`week2/mini_youtube/` is a frontend-only YouTube clone rendered from a static
`src/data/dummyVideos.js` — no backend, no network calls. It exists to practice
component composition and hooks.

- functional components only: `Navbar`, `VideoCard`, `Timer`
- `useState` for likes, watch-later and dark/light theme; `useEffect` for the
  session timer and storage sync
- routes: `/` (feed) and `/watchlater` (filtered view)
- watch-later selections persist in `sessionStorage`
- styled with Tailwind CSS 3 (`tailwind.config.js` + `postcss.config.js`)

```bash
cd week2/mini_youtube
npm install
npm start          # http://localhost:3000
```

See `week2/readme.md` for the original per-file breakdown.

---

## Week 3 — Django practice apps

Four independent Django 5.2 projects, each isolating one concept. All use SQLite
and Django's development server.

### `practice/theme/`
A plain HTML/CSS/JS mockup (`index.html`, `room.html`, `profile.html`, …) that the
`mysite` templates were later ported from. Nothing to run — open the files directly.

### `practice/mysite/` — the "blog" app
The largest of the four: a discussion-rooms app.

- **Models** — a custom `User` (email as `USERNAME_FIELD`, with `bio` and `avatar`),
  plus `Topic`, `Room` (host, topic, participants, description) and `Message`.
- **Views** (`blog/views.py`) — register/login/logout, home feed with topic and
  search filtering, room detail with messaging, room create/update/delete, message
  delete, profile and profile update, topics page, activity page.
- **API** (`blog/api/`) — a read-only DRF surface: `GET /api/`, `/api/rooms/`,
  `/api/rooms/<pk>`.
- Templates live in `blog/templates/blog/`; the `*_old.html` files are the earlier
  pre-theme versions kept for comparison.

### `practice/customusermodel/`
The smallest possible project demonstrating a custom `AUTH_USER_MODEL` — a `User`
extending `AbstractUser` with `name`, `email` (unique, used for login) and `bio`,
plus the two migrations that introduce it.

### `practice/rest_api/`
Function-based DRF views over a trivial `User(name, age)` model:

| Method | Path | View |
|---|---|---|
| GET | `/users/` | `get_user` |
| POST | `/users/create/` | `create_user` |
| GET / PUT / DELETE | `/users/<pk>` | `user_detail` |

### `youtube_auth/`
A focused authentication flow with its own custom `User` (email login, uploadable
`avatar`): register → auto-login → a `urlsafe_base64` "verify" link → dashboard,
plus logout. Uses `django-widget-tweaks` for form rendering and serves uploaded
avatars from `MEDIA_ROOT`.

**Running any week-3 project:**

```bash
cd "week3/practice/mysite"          # or customusermodel / rest_api / ../youtube_auth
python -m venv .venv && source .venv/bin/activate
pip install django djangorestframework django-widget-tweaks
python manage.py migrate
python manage.py runserver          # http://127.0.0.1:8000
```

---

## Week 4 — YouTube clone (Django REST + React)

`week4/youtube clone/` is the final project: a decoupled SPA + API where the React
app talks to Django over JWT-authenticated JSON.

### Backend (`backend/`)

Django 5.2 + DRF, `rest_framework_simplejwt` for auth, `django-cors-headers`,
PostgreSQL as the database, and local disk (`MEDIA_ROOT`) for uploaded video files
and thumbnails.

**Models** (`api/models.py`)
- `Video` — owner, title, description, video file (uploaded to `user_<id>/`),
  thumbnail, timestamp, and a `likes` many-to-many
- `WatchLater` — one list per user, many-to-many onto videos
- `Comment` — per-video, per-user, timestamped

**Endpoints** (all under `/api/`)

| Method | Path | Purpose |
|---|---|---|
| POST | `register/` | create an account |
| POST | `login/` | obtain access + refresh tokens (username added to the payload) |
| POST | `token/refresh/` | refresh an expired access token |
| GET | `videos/` | public feed, newest first |
| POST | `videos/upload/` | upload a video (auth required) |
| GET | `videos/<pk>/` | video detail |
| GET | `videos/user/` | the caller's own uploads |
| POST | `videos/<id>/like-toggle/` | like / unlike |
| GET, POST | `videos/<id>/comments/` | read or add comments |
| GET | `watch-later/` | the caller's watch-later list |
| POST | `watch-later/toggle/` | add / remove a video |

`VideoSerializer` annotates each video with `like_count` and a request-aware
`is_liked`. DRF defaults to `IsAuthenticated`, with the public read endpoints
opting out via `AllowAny` / `IsAuthenticatedOrReadOnly`.

### Frontend (`frontend/`)

Create React App (React 19) + React Router 7 + Bootstrap 5 + Font Awesome.

- `axiosConfig.js` is the spine: a pre-configured axios instance pointed at
  `http://127.0.0.1:8000/api/` that attaches the bearer token on every request and,
  on a `401`, transparently refreshes the token once and retries — falling back to
  clearing storage and redirecting to `/login`.
- `SearchContext` shares the navbar's search query with the feed, which filters
  client-side by title.
- Theme (light/dark) is held in `App.js` and persisted to `localStorage`.
- Routes: `/`, `/upload`, `/dashboard`, `/watch-later`, `/login`, `/register`,
  `/videos/:id`.

### Running it

```bash
# 1. backend
cd "week4/youtube clone/backend"
python -m venv .venv && source .venv/bin/activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary

# create the PostgreSQL database, then supply its credentials via the environment:
cp .env.example .env        # fill in DB_PASSWORD, then export the vars, e.g.:
set -a && source .env && set +a

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver          # http://127.0.0.1:8000

# 2. frontend (separate terminal)
cd "week4/youtube clone/frontend"
npm install
npm start                           # http://localhost:3000
```

The backend expects a PostgreSQL database (`ytclone` by default). Its credentials
are read from `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` — see
`backend/.env.example`. Nothing sensitive belongs in `settings.py`.

---

## Notes

- Every Django project here ships with `DEBUG = True`, a development `SECRET_KEY`
  and permissive CORS. They are learning projects — none is production-configured.
- No `requirements.txt` is checked in; the `pip install` lines above list what each
  project actually imports.
- Node dependencies are not committed — run `npm install` in each JS project first.

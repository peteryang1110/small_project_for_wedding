# small_project_for_wedding

A tiny static website that lets wedding guests search their name to find their table and seat, and see who else is at their table.

## Files

- `index.html` – search page
- `style.css` – styling
- `script.js` – loads `seats.csv` and handles both search tabs
- `seats.csv` – seating data (edit this with your real guest list)
- `background.jpg` – page background image
- `netlify.toml` – Netlify deploy config

## Editing the seating chart

Open `seats.csv` and edit it (Excel/Google Sheets/Notepad all work). Keep the header row and these columns:

```
Name,Table,Seat
John Smith,1,A1
```

## Running locally

Browsers block `fetch()` on files opened directly (`file://`), so the page must be served over HTTP, not double-clicked. If you have Python or Node installed:

```
python -m http.server 8000
```

or

```
npx serve
```

then open http://localhost:8000.

## Deploying to Netlify

No build step is needed — `netlify.toml` just tells Netlify to publish the project root as-is and sets `seats.csv` to never be cached, so guest-list edits show up immediately.

**Option A — drag and drop (no git needed):**
1. Go to https://app.netlify.com/drop
2. Drag the whole project folder onto the page.
3. Netlify gives you a live URL right away. To update later (e.g. after editing `seats.csv`), just drag the folder again.

**Option B — connect the git repo (auto-deploys on every push):**
1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: "Add new site" → "Import an existing project" → pick the repo.
3. Build command: leave blank. Publish directory: `.` (already set in `netlify.toml`).
4. Every push to the connected branch redeploys automatically.

# raykondiff.github.io

My personal site — live at **https://raykondiff.github.io**

---

## Adding a project

There are two ways, and you'll mostly use the first one.

### 1. A GitHub repo — nothing to do

Any **public** repo on `github.com/raykondiff` shows up in the **From GitHub** section
automatically, newest first. Push a new repo and it appears on the site. No edits, no deploy.

To make a repo look good there, give it a **description** on GitHub (the box at the top right
of the repo page) — that's the text the card shows.

To *hide* a repo from the site, add its name to `hideRepos` in `data/profile.json`.

### 2. Something that isn't a repo — one file to edit

For a live site, a client project, a design job, anything without public code:
edit **`data/projects.json`** and add one block to the `projects` list.

**The one-click way:** open
[`data/projects.json` on GitHub](https://github.com/raykondiff/raykondiff.github.io/edit/main/data/projects.json),
click the pencil, paste a new block, hit **Commit changes**. The site updates in about a minute.

```json
{
  "title": "Project name",
  "blurb": "One or two sentences on what it is.",
  "year": "2026",
  "tags": ["WordPress", "PHP"],
  "url": "https://example.com",
  "urlLabel": "Visit site",
  "repo": "https://github.com/raykondiff/something",
  "image": "assets/screenshot.png",
  "featured": true
}
```

Only `title` is required — drop any line you don't need.
`featured: true` pins it to the top as a full-width card.
For `image`, drop the file in `assets/` and point at it.

---

## Editing your profile

Everything in the hero, About, Toolkit and Contact sections comes from **`data/profile.json`**.
Change the text there and commit — no HTML to touch.

---

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure. Rarely needs changing. |
| `style.css` | All styling. Colours are the two `:root` blocks at the top. |
| `app.js` | Loads the JSON files and the GitHub repo list. |
| `data/profile.json` | **Your bio, background, skills, links.** |
| `data/projects.json` | **Your hand-picked projects.** |
| `assets/` | Images for project cards. |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is. |

---

## Running it locally

```bash
python -m http.server 4173
```

Then open http://localhost:4173

---

## Publishing

The repo is named `raykondiff.github.io`, so GitHub Pages serves it at the root domain.
Settings → Pages → Source = **Deploy from a branch**, branch `main`, folder `/ (root)`.
Every push to `main` republishes automatically.

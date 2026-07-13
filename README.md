# Three Lions Archive — How to Publish This Site (No Coding Needed)

This is a complete, working website. Everything is plain files — no installs,
no terminal, no build step. You'll publish it using GitHub's website only.

## Step 1 — Create a repository
1. Go to https://github.com and log in with your free account.
2. Click the **+** icon (top right) → **New repository**.
3. Name it something like `three-lions-archive`.
4. Set it to **Public** (required for free GitHub Pages).
5. Leave everything else as default and click **Create repository**.

## Step 2 — Upload the files
1. On your new repository's page, click **"uploading an existing file"**
   (or **Add file → Upload files**).
2. Open the `three-lions-archive` folder on your computer (unzip it first
   if needed) and drag **the whole contents** of the folder — `index.html`,
   `story.html`, the `css`, `js`, `data` and `explore` folders — straight
   into the browser upload box.
   - Important: drag the *contents* of the folder in, not the folder itself,
     so that `index.html` sits at the top level of the repository.
3. Scroll down and click **Commit changes**.

## Step 3 — Turn on GitHub Pages
1. In your repository, click **Settings** (top menu).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **main** and folder **/ (root)**, then **Save**.
5. Wait about 1–2 minutes. Refresh the Pages settings screen and you'll see
   a green box with your live web address, something like:
   `https://yourusername.github.io/three-lions-archive/`

That's it — no terminal, no npm, no server. Anyone with that link can now
visit your digital museum.

## Making future updates
Everything the spec asked for holds here: nearly all future changes are just
editing the JSON files in `data/men/` (adding a new tournament, match, player,
manager, venue or collection) and re-uploading them the same way — via
**Add file → Upload files** on GitHub, replacing the existing file. GitHub
Pages republishes automatically within a minute or two of every commit.

Each JSON file is a plain list of entries with an `id` — copy an existing
entry as a template, change the details, and give it a new unique `id`. As
long as the `id`s you reference elsewhere (e.g. a `managerId` on a
tournament) match an `id` that actually exists in the relevant file, it will
link up automatically in Explore Mode.

## What's inside
- `index.html` — homepage with the tournament timeline ("the Thread")
- `story.html` — Story Mode, the editorial narrative
- `explore/index.html` — Explore Mode hub (browse by category)
- `explore/entity.html` — the page template every object (tournament, match,
  player, manager, venue, opponent, collection) renders through
- `data/men/*.json` — all the content. This is what you'll edit over time.
- `css/style.css`, `js/app.js` — the design and the logic that links
  everything together and powers search

## Current scope, honestly
This ships with a solid, accurate core: England men's tournament history
from 1966 through the live 2026 World Cup semi-final, ~11 players, 5
managers, 8 venues and 4 editorial collections, all fully cross-linked with
no dead ends. The `women/` data folder and a Men/Lionesses toggle aren't
built yet — the spec's structure supports adding them the same way, as a
next step, without touching the men's data.

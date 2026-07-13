/* Three Lions Archive — app.js
   Loads all JSON data, renders the shared header + search, and provides
   helpers used by every page to render "the Thread" of linked objects.
   No backend, no build step — pure static JSON + fetch. */

const TLA = (() => {
  const BASE = "data/men/";
  const FILES = ["tournaments","matches","players","managers","venues","opponents","collections"];
  let store = null;

  async function loadAll() {
    if (store) return store;
    const entries = await Promise.all(FILES.map(async f => {
      const res = await fetch(BASE + f + ".json");
      return [f, await res.json()];
    }));
    store = Object.fromEntries(entries);
    // index by id for quick lookup
    store._index = {};
    for (const key of FILES) {
      const type = singular(key);
      for (const item of store[key]) store._index[type + ":" + item.id] = item;
    }
    return store;
  }

  function singular(key) {
    const map = { tournaments:"tournament", matches:"match", players:"player",
      managers:"manager", venues:"venue", opponents:"opponent", collections:"collection" };
    return map[key];
  }

  function pluralOf(type){
    const map = { tournament:"tournaments", match:"matches", player:"players",
      manager:"managers", venue:"venues", opponent:"opponents", collection:"collections" };
    return map[type];
  }

  function get(type, id) {
    return store && store._index[type + ":" + id];
  }

  function entityUrl(type, id) {
    const prefix = location.pathname.includes("/explore/") ? "" : "explore/";
    return prefix + "entity.html?type=" + type + "&id=" + encodeURIComponent(id);
  }

  /* ---------- Search ---------- */
  function searchAll(query) {
    const q = query.trim().toLowerCase();
    if (!q || !store) return [];
    const results = [];
    const fields = {
      tournaments: t => [t.name, t.eyebrow, t.result],
      matches: m => [m.stage, m.score],
      players: p => [p.name, p.position],
      managers: m => [m.name],
      venues: v => [v.name, v.city],
      opponents: o => [o.name],
      collections: c => [c.title, c.eyebrow]
    };
    for (const key of FILES) {
      for (const item of store[key]) {
        const haystack = fields[key](item).filter(Boolean).join(" ").toLowerCase();
        if (haystack.includes(q)) {
          results.push({ type: singular(key), id: item.id, label: item.name || item.title || item.stage });
        }
      }
      if (results.length >= 40) break;
    }
    return results.slice(0, 8);
  }

  function wireSearch() {
    const input = document.getElementById("tla-search-input");
    const panel = document.getElementById("tla-search-results");
    if (!input || !panel) return;
    input.addEventListener("input", () => {
      const results = searchAll(input.value);
      if (!results.length) {
        panel.innerHTML = input.value.trim()
          ? '<div class="empty">No matches yet — try a player, tournament or venue.</div>' : "";
        panel.classList.toggle("show", !!input.value.trim());
        return;
      }
      panel.innerHTML = results.map(r =>
        `<a href="${entityUrl(r.type, r.id)}"><span class="kind">${r.type}</span><br>${r.label}</a>`
      ).join("");
      panel.classList.add("show");
    });
    document.addEventListener("click", e => {
      if (!panel.contains(e.target) && e.target !== input) panel.classList.remove("show");
    });
  }

  /* ---------- Shared header ---------- */
  function renderHeader() {
    const mount = document.getElementById("tla-header");
    if (!mount) return;
    const inExplore = location.pathname.includes("/explore/");
    const root = inExplore ? "../" : "";
    mount.innerHTML = `
      <div class="wrap">
        <a class="brand" href="${root}index.html">
          <span class="badge"></span> Three Lions Archive
        </a>
        <nav class="nav-links">
          <a href="${root}index.html">Home</a>
          <a href="${root}story.html">Story Mode</a>
          <a href="${root}explore/index.html">Explore Mode</a>
        </nav>
        <div class="search-box">
          <input id="tla-search-input" type="text" placeholder="Search players, matches, venues…" autocomplete="off">
          <div id="tla-search-results" class="search-results"></div>
        </div>
      </div>`;
    wireSearch();
  }

  /* ---------- Thread rail (homepage timeline) ---------- */
  function renderThreadRail(mountId, tournaments) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = `<div class="thread-track">${tournaments.map(t => `
      <a class="thread-node ${t.result.startsWith('In progress') ? 'current' : ''}" href="${entityUrl('tournament', t.id)}">
        <div class="dot"></div>
        <div class="year">${t.year}</div>
        <div class="label">${t.name.replace('FIFA ','').replace('UEFA ','')}</div>
        <div class="result">${t.result}</div>
      </a>`).join("")}</div>`;
  }

  /* ---------- Related chain renderer (used on entity pages) ---------- */
  function renderChain(mountId, title, refs) {
    const mount = document.getElementById(mountId);
    if (!mount || !refs.length) return;
    mount.innerHTML = `
      <div class="thread-related-title">${title}</div>
      <div class="thread-chain">${refs.map(r => {
        const item = get(r.type, r.id);
        if (!item) return "";
        const label = item.name || item.title || item.stage;
        return `<a class="thread-chip" href="${entityUrl(r.type, r.id)}"><span class="kind">${r.type}</span>${label}</a>`;
      }).join("")}</div>`;
  }

  return { loadAll, get, entityUrl, renderHeader, renderThreadRail, renderChain, pluralOf, FILES };
})();

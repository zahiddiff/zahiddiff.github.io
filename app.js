/* ==================================================
   zahiddiff.github.io
   Reads data/profile.json + data/projects.json and
   pulls public repos straight from the GitHub API,
   so a new repo shows up here with no edits at all.
   ================================================== */

const ICONS = {
  github: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
  link:   '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V3.7L7.35 9.85a.5.5 0 0 1-.7-.7L12.8 3H9.5a.5.5 0 0 1 0-1Z"/><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3H7a.5.5 0 0 1 0 1H4.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V9a.5.5 0 0 1 1 0v2.5A1.5 1.5 0 0 1 11.5 13h-7A1.5 1.5 0 0 1 3 11.5v-7Z"/></svg>',
  linkedin: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.632 13.635h-2.37V9.922c0-.886-.018-2.025-1.234-2.025-1.235 0-1.424.964-1.424 1.96v3.778h-2.37V6H8.51v1.04h.033c.317-.601 1.092-1.235 2.247-1.235 2.4 0 2.845 1.58 2.845 3.637v4.194ZM3.558 4.955a1.377 1.377 0 1 1 0-2.753 1.377 1.377 0 0 1 0 2.753Zm1.188 8.68H2.37V6h2.376v7.635ZM14.816 0H1.18C.528 0 0 .516 0 1.153v13.694C0 15.484.528 16 1.18 16h13.635c.652 0 1.185-.516 1.185-1.153V1.153C16 .516 15.467 0 14.816 0Z"/></svg>',
  repo:   '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>',
  star:   '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>'
};

/* Escape anything that comes from JSON or the GitHub API before it
   touches innerHTML. Repo descriptions are user-editable text. */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* Only allow links we control the shape of. */
function safeUrl(u) {
  if (!u) return null;
  try {
    const url = new URL(u, location.href);
    return (url.protocol === 'https:' || url.protocol === 'http:' || url.protocol === 'mailto:')
      ? url.href : null;
  } catch { return null; }
}

const $ = sel => document.querySelector(sel);

async function getJSON(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(path + ' -> ' + res.status);
  return res.json();
}

/* ------------------- THEME ------------------- */
function initTheme() {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch {}

  if (saved === 'light' || saved === 'dark') {
    root.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  $('#theme-toggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
  });
}

/* ------------------- PROFILE ------------------- */
function renderProfile(p) {
  document.title = p.name + ' — ' + (p.tagline || 'Portfolio');

  const nameEl = $('#p-name');
  nameEl.textContent = p.name || '';
  /* the glitch layers are ::before/::after rendering attr(data-text) */
  nameEl.setAttribute('data-text', p.name || '');

  $('#p-tagline').textContent  = p.tagline || '';
  $('#p-location').textContent = p.location || '';
  $('#p-available').textContent = p.available || '';
  $('#f-name').textContent     = '© ' + new Date().getFullYear() + ' ' + (p.name || '');
  if (p.handle) {
    /* only swap the text node - the glyph and caret are markup */
    document.querySelectorAll('.brand-text').forEach(el => {
      el.textContent = p.handle;
    });
  }

  $('#p-intro').innerHTML = (p.intro || []).map(t => '<p>' + esc(t) + '</p>').join('');

  $('#p-background').innerHTML = (p.background || []).map(b =>
    '<li>' +
      '<span class="tl-period">' + esc(b.period) + '</span>' +
      '<h3 class="tl-title">' + esc(b.title) + '</h3>' +
      '<p class="tl-detail">' + esc(b.detail) + '</p>' +
    '</li>'
  ).join('');

  $('#p-skills').innerHTML = (p.skills || []).map(g =>
    '<div class="skill-card reveal">' +
      '<h3>' + esc(g.group) + '</h3>' +
      '<ul>' + (g.items || []).map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>' +
    '</div>'
  ).join('');

  const linkHTML = (p.links || []).map(l => {
    const href = safeUrl(l.url);
    if (!href) return '';
    const icon = ICONS[l.icon] || ICONS.link;
    return '<a class="chip-link" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
             icon + esc(l.label) + '</a>';
  }).join('');

  $('#p-links').innerHTML   = linkHTML;
  $('#p-contact').innerHTML = linkHTML;
}

/* ------------------- MANUAL PROJECTS ------------------- */
function renderProjects(list) {
  const host = $('#p-projects');
  if (!list.length) {
    host.innerHTML = '<p class="muted">Nothing here yet — add an entry to <code>data/projects.json</code>.</p>';
    return;
  }

  const ordered = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  host.innerHTML = ordered.map(pr => {
    const site = safeUrl(pr.url);
    const repo = safeUrl(pr.repo);
    const img  = pr.image ? safeUrl(pr.image) : null;

    const actions = [
      site ? '<a class="card-link" href="' + esc(site) + '" target="_blank" rel="noopener noreferrer">' +
               ICONS.link + esc(pr.urlLabel || 'Visit') + '</a>' : '',
      repo ? '<a class="card-link" href="' + esc(repo) + '" target="_blank" rel="noopener noreferrer">' +
               ICONS.github + 'Source</a>' : ''
    ].join('');

    return '<article class="card reveal' + (pr.featured ? ' is-featured' : '') + '">' +
      (img ? '<img class="card-img" src="' + esc(img) + '" alt="" loading="lazy">' : '') +
      '<div class="card-top">' +
        '<h3 class="card-title">' + esc(pr.title) + '</h3>' +
        (pr.year ? '<span class="card-year">' + esc(pr.year) + '</span>' : '') +
      '</div>' +
      (pr.blurb ? '<p class="card-blurb">' + esc(pr.blurb) + '</p>' : '') +
      ((pr.tags || []).length
        ? '<div class="card-tags">' + pr.tags.map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div>'
        : '') +
      (actions ? '<div class="card-actions">' + actions + '</div>' : '') +
    '</article>';
  }).join('');
}

/* ------------------- GITHUB REPOS (auto) ------------------- */
async function renderRepos(cfg) {
  if (!cfg || cfg.showRepos === false || !cfg.user) return;

  const section = $('#repos-section');
  const host    = $('#p-repos');
  section.hidden = false;
  $('#gh-profile-link').href = 'https://github.com/' + encodeURIComponent(cfg.user);

  let repos;
  try {
    repos = await getJSON(
      'https://api.github.com/users/' + encodeURIComponent(cfg.user) +
      '/repos?sort=updated&per_page=100&type=owner'
    );
  } catch {
    host.innerHTML = '<p class="muted">Couldn’t reach the GitHub API right now. ' +
      'See everything at <a href="https://github.com/' + esc(cfg.user) + '" ' +
      'target="_blank" rel="noopener noreferrer">github.com/' + esc(cfg.user) + '</a>.</p>';
    return;
  }

  const hide = new Set((cfg.hideRepos || []).map(s => s.toLowerCase()));
  const list = repos
    .filter(r => !r.fork && !r.archived && !hide.has(String(r.name).toLowerCase()))
    .slice(0, cfg.maxRepos || 30);

  if (!list.length) {
    host.innerHTML = '<p class="muted">No public repositories to show yet.</p>';
    return;
  }

  host.innerHTML = list.map(r => {
    const url  = safeUrl(r.html_url) || '#';
    const when = new Date(r.pushed_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    return '<a class="repo reveal" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
      '<span class="repo-name">' + ICONS.repo + esc(r.name) + '</span>' +
      '<p class="repo-desc">' + esc(r.description || 'No description yet.') + '</p>' +
      '<span class="repo-meta">' +
        (r.language ? '<span class="repo-lang"><span class="lang-dot"></span>' + esc(r.language) + '</span>' : '') +
        (r.stargazers_count ? '<span class="repo-lang">' + ICONS.star + r.stargazers_count + '</span>' : '') +
        '<span>Updated ' + esc(when) + '</span>' +
      '</span>' +
    '</a>';
  }).join('');

  observeReveals();
}

/* ------------------- OCCASIONAL GLITCH -------------------
   A short stutter every so often, not a permanently moving
   headline. Off entirely when reduced motion is requested. */
function scheduleGlitch() {
  const el = $('#p-name');
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!el || (reduced && reduced.matches)) return;

  const tick = () => {
    if (document.hidden) { setTimeout(tick, 4000); return; }
    el.classList.add('pulse');
    setTimeout(() => el.classList.remove('pulse'), 700);
    setTimeout(tick, 5000 + Math.random() * 7000);
  };
  setTimeout(tick, 2500);
}

/* ------------------- SCROLL REVEAL ------------------- */
let revealObserver, revealFailsafe;
function observeReveals() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  }
  document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));

  /* Safety net. The reveal starts at opacity 0, so anything that stops
     the observer from ever firing (a tab that never paints, a throttled
     background render) would leave content permanently invisible.
     If nothing at all has revealed by now the observer is not working,
     so drop the effect and show everything - content being visible
     always beats content animating in. If something did fire, the
     observer is fine and the scroll reveal is left alone. */
  clearTimeout(revealFailsafe);
  revealFailsafe = setTimeout(() => {
    if (!document.querySelector('.reveal.in')) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }
  }, 3000);
}

/* ------------------- BOOT ------------------- */
(async function init() {
  initTheme();

  let profile = {};
  try {
    profile = await getJSON('data/profile.json');
    renderProfile(profile);
  } catch (err) {
    console.error('profile.json failed to load', err);
    $('#p-name').textContent = 'zahiddiff';
    $('#p-tagline').textContent = 'Could not load data/profile.json.';
  }

  try {
    const data = await getJSON('data/projects.json');
    renderProjects(Array.isArray(data) ? data : (data.projects || []));
  } catch (err) {
    console.error('projects.json failed to load', err);
    renderProjects([]);
  }

  observeReveals();
  scheduleGlitch();
  renderRepos(profile.github);
})();

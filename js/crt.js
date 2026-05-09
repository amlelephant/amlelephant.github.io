

const MENU_ITEMS = [
  { key: 'about',    label: 'ABOUT ME',  icon: '👤' },
  { key: 'projects', label: 'PROJECTS',  icon: '🚀' },
  { key: 'resume',   label: 'RESUME',    icon: '📄' },
  { key: 'contact',  label: 'CONTACT',   icon: '📬' },
];

// ── Build menu rows ────────────────────────────────────────
const menuEl = document.getElementById('crt-menu');
MENU_ITEMS.forEach((item, i) => {
  const row = document.createElement('div');
  row.className = 'crt-menu-row glow';
  row.dataset.key = item.key;
  row.innerHTML = `<span class="num">[${i+1}]</span>
                   <span class="arrow">▶</span>
                   <span>${item.label}</span>`;
  row.addEventListener('click', () => { setActive(i); openPage(item.key); });
  row.addEventListener('mouseenter', () => setActive(i));
  menuEl.appendChild(row);
});

// ── Active state ───────────────────────────────────────────
let activeIdx = 0;
function setActive(i) {
  const rows = document.querySelectorAll('.crt-menu-row');
  rows.forEach(r => r.classList.remove('active'));
  if (i < 0) i = rows.length - 1;
  if (i >= rows.length) i = 0;
  activeIdx = i;
  rows[activeIdx].classList.add('active');
}
setActive(0);

// ── Screens ────────────────────────────────────────────────
const screenHome = document.getElementById('screen-home');
const screenPage = document.getElementById('screen-page');
const nanoTitle  = document.getElementById('nano-topbar-title');
const nanoBody   = document.getElementById('nano-body');

function openPage(key) {
  const item = MENU_ITEMS.find(m => m.key === key);
  if (!item) return;
  nanoTitle.textContent = `  GNU nano  —  ${item.label}  `;
  nanoBody.innerHTML = buildContent(key);
  screenHome.style.display = 'none';
  screenPage.style.display = 'flex';
  nanoBody.scrollTop = 0;
}

function closeNano() {
  screenPage.style.display = 'none';
  screenHome.style.display = 'flex';
}

// ── Content builders ───────────────────────────────────────
function buildContent(key) {
  const p = PORTFOLIO;
  switch(key) {

    case 'about': return `
      <div class="nano-section">
        <div class="nano-h1">👤 About Me</div>
        <div class="nano-row"><span class="nano-key-label">NAME:</span><span class="nano-val">${p.name}</span></div>
        <div class="nano-row"><span class="nano-key-label">ROLE:</span><span class="nano-val">${p.tagline}</span></div>
        <div class="nano-row"><span class="nano-key-label">LOCATION:</span><span class="nano-val">${p.location}</span></div>
        <div class="nano-row"><span class="nano-key-label">EMAIL:</span><span class="nano-val">${p.email}</span></div>
        <div class="nano-row"><span class="nano-key-label">GITHUB:</span><span class="nano-val">${p.github.replace('https://','')}</span></div>
        <div class="nano-row"><span class="nano-key-label">LINKEDIN:</span><span class="nano-val">${p.linkedin.replace('https://','')}</span></div>
      </div>
      <hr class="nano-divider">
      <div class="nano-section">
        <div class="nano-h2">// Biography</div>
        <div class="nano-text">${p.bio}</div>
      </div>
      <hr class="nano-divider">
      <div class="nano-section">
        <div class="nano-h2">// Education</div>
        <div class="nano-row"><span class="nano-key-label">SCHOOL:</span><span class="nano-val">${p.education.school}</span></div>
        <div class="nano-row"><span class="nano-key-label">DEGREE:</span><span class="nano-val">${p.education.degree}</span></div>
        <div class="nano-row"><span class="nano-key-label">TIMELINE:</span><span class="nano-val">${p.education.dates}</span></div>
        <div class="nano-row"><span class="nano-key-label">GPA:</span><span class="nano-val">${p.education.gpa}</span></div>
        <div class="nano-row"><span class="nano-key-label">DETAILS:</span><span class="nano-val">${p.education.details}</span></div>
      </div>
      <hr class="nano-divider">
      <div class="nano-section">
        <div class="nano-h2">// Technical Skills</div>
        <div>${p.skills.map(s=>`<span class="nano-tag">${s}</span>`).join('')}</div>
      </div>`;

    case 'projects': return `
      <div class="nano-section"><div class="nano-h1">🚀 Projects</div></div>` +
      p.projects.map((proj, i) => `
        <div class="nano-card">
          <div class="nano-card-title">${i+1}. ${proj.name}</div>
          <div class="nano-card-meta">YEAR: ${proj.year} &nbsp;|&nbsp; STACK: ${proj.tech.join(', ')}</div>
          <div class="nano-text" style="margin-bottom:8px;">${proj.description}</div>
          <a href="${proj.github}" class="nano-link" target="_blank">[GITHUB]</a>
          ${proj.live !== '#' ? `<a href="${proj.live}" class="nano-link" target="_blank">[LIVE]</a>` : ''}
        </div>`).join('');

    case 'resume': return `
      <div class="nano-section"><div class="nano-h1">📄 Resume</div></div>
      ${PORTFOLIO.resume_pdf !== '#'
        ? `<div style="margin-bottom:14px;"><a href="${PORTFOLIO.resume_pdf}" class="nano-link" target="_blank">[⬇ DOWNLOAD PDF]</a></div>`
        : ''}
      <div class="nano-section">
        <div class="nano-h2">// Experience</div>
        ${PORTFOLIO.experience.map(e=>`
          <div class="nano-card">
            <div class="nano-card-title">${e.role}</div>
            <div class="nano-card-meta">${e.company} &nbsp;|&nbsp; ${e.dates}</div>
            ${e.bullets.map(b=>`<div class="nano-text">▸ ${b}</div>`).join('')}
          </div>`).join('')}
      </div>
      <hr class="nano-divider">
      <div class="nano-section">
        <div class="nano-h2">// Education</div>
        <div class="nano-card">
          <div class="nano-card-title">${PORTFOLIO.education.school}</div>
          <div class="nano-card-meta">${PORTFOLIO.education.degree} &nbsp;|&nbsp; ${PORTFOLIO.education.dates}</div>
          <div class="nano-text">GPA: ${PORTFOLIO.education.gpa} &nbsp;|&nbsp; ${PORTFOLIO.education.details}</div>
        </div>
      </div>`;

    case 'contact': return `
      <div class="nano-section"><div class="nano-h1">📬 Contact</div></div>
      <div class="nano-section">
        <div class="nano-text" style="margin-bottom:16px;">${PORTFOLIO.contact_message}</div>
        <div class="nano-row"><span class="nano-key-label">EMAIL:</span>
          <a href="mailto:${PORTFOLIO.email}" class="nano-link">${PORTFOLIO.email}</a></div>
        <div class="nano-row"><span class="nano-key-label">GITHUB:</span>
          <a href="${PORTFOLIO.github}" class="nano-link" target="_blank">${PORTFOLIO.github.replace('https://','')}</a></div>
        <div class="nano-row"><span class="nano-key-label">LINKEDIN:</span>
          <a href="${PORTFOLIO.linkedin}" class="nano-link" target="_blank">${PORTFOLIO.linkedin.replace('https://','')}</a></div>
      </div>`;

    default: return '<div class="nano-text">No content.</div>';
  }
}

// ── Keyboard ───────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const onPage = screenPage.style.display === 'flex';

  if (onPage) {
    if (e.key==='Escape' || e.key==='x' || e.key==='q' || (e.ctrlKey && e.key==='x')) {
      e.preventDefault(); closeNano();
    }
    if (e.key==='ArrowDown') { e.preventDefault(); nanoBody.scrollBy(0, 40); }
    if (e.key==='ArrowUp')   { e.preventDefault(); nanoBody.scrollBy(0,-40); }
    if (e.key==='PageDown')  { e.preventDefault(); nanoBody.scrollBy(0, 220); }
    if (e.key==='PageUp')    { e.preventDefault(); nanoBody.scrollBy(0,-220); }
    return;
  }

  // Home navigation
  switch(e.key) {
    case 'ArrowDown': e.preventDefault(); setActive(activeIdx + 1); break;
    case 'ArrowUp':   e.preventDefault(); setActive(activeIdx - 1); break;
    case 'Enter':     e.preventDefault(); openPage(MENU_ITEMS[activeIdx].key); break;
    default:
      const n = parseInt(e.key);
      if (!isNaN(n) && n >= 1 && n <= MENU_ITEMS.length) {
        setActive(n - 1);
        setTimeout(() => openPage(MENU_ITEMS[n-1].key), 60);
      }
  }
});

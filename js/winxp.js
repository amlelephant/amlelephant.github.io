// ═══════════════════════════════════════════════════════════
//  WINDOWS XP WINDOW MANAGER
//  Reads content from PORTFOLIO (data.js), no server needed
// ═══════════════════════════════════════════════════════════

// ── Page definitions ───────────────────────────────────────
const PAGES = {
  about: {
    title: "About Me",
    icon:  "👤",
    render: renderAbout,
  },
  projects: {
    title: "Projects",
    icon:  "🚀",
    render: renderProjects,
  },
  resume: {
    title: "Resume",
    icon:  "📄",
    render: renderResume,
  },
  contact: {
    title: "Contact",
    icon:  "📬",
    render: renderContact,
  },
  mycomputer: {
    title: "My Computer",
    icon:  "🖥️",
    render: renderMyComputer,
  },
};

function profileImg(fallback, style = "") {
  const img = new Image();
  img.src = "images/profile.jpg";
  const el = document.createElement("div");
  el.innerHTML = `<img src="images/profile.jpg" style="width:100%;height:100%;object-fit:cover;${style}">`;
  img.onerror = () => { el.innerHTML = fallback; };
  return el.outerHTML;
}

// ── Build desktop icons & start menu ──────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Populate name in start menu
  document.getElementById('sm-name').textContent = PORTFOLIO.name;

  // Desktop icons
  const iconContainer = document.getElementById('desktop-icons');
  const smLeft = document.getElementById('sm-left');

  const desktopPages = ['about', 'projects', 'resume', 'contact'];

  desktopPages.forEach(key => {
    const pg = PAGES[key];

    // Desktop icon
    const icon = document.createElement('div');
    icon.className = 'xp-icon';
    icon.id = `icon-${key}`;
    icon.innerHTML = `<div class="xp-icon-img">${pg.icon}</div>
                      <div class="xp-icon-label">${pg.title}</div>`;
    icon.addEventListener('click',   () => selectIcon(key));
    icon.addEventListener('dblclick', () => openWindow(key));
    iconContainer.appendChild(icon);

    // Start menu entry
    const smItem = document.createElement('div');
    smItem.className = 'xp-startmenu-item';
    smItem.innerHTML = `<span>${pg.icon}</span><span>${pg.title}</span>`;
    smItem.addEventListener('click', () => { openWindow(key); toggleStartMenu(); });
    smLeft.appendChild(smItem);
  });

  // My Computer icon
  const mcIcon = document.createElement('div');
  mcIcon.className = 'xp-icon';
  mcIcon.id = 'icon-mycomputer';
  mcIcon.innerHTML = `<div class="xp-icon-img">🖥️</div><div class="xp-icon-label">My Computer</div>`;
  mcIcon.addEventListener('click',   () => selectIcon('mycomputer'));
  mcIcon.addEventListener('dblclick', () => openWindow('mycomputer'));
  iconContainer.appendChild(mcIcon);
  /*
  // Easter egg CRT icon — no label, just a mysterious device
  const crtIcon = document.createElement('div');
  crtIcon.className = 'xp-icon';
  crtIcon.id = 'icon-crt';
  crtIcon.innerHTML = `<div class="xp-icon-img">📟</div><div class="xp-icon-label">Terminal</div>`;
  crtIcon.title = 'Double-click to find out...';
  crtIcon.addEventListener('click',   () => selectIcon('crt'));
  crtIcon.addEventListener('dblclick', () => { window.location.href = 'crt.html'; });
  iconContainer.appendChild(crtIcon);
  */
});

// ── Clock ──────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const el = document.getElementById('xp-clock');
  if (el) el.textContent = `${h}:${m.toString().padStart(2,'0')} ${ampm}`;
}
updateClock();
setInterval(updateClock, 10000);

// ── Icon selection ─────────────────────────────────────────
let selectedIcon = null;
function selectIcon(id) {
  if (selectedIcon) document.getElementById('icon-' + selectedIcon)?.classList.remove('selected');
  selectedIcon = id;
  document.getElementById('icon-' + id)?.classList.add('selected');
}

document.getElementById('desktop').addEventListener('click', e => {
  if (e.target.closest('.xp-icon')) return;
  if (selectedIcon) {
    document.getElementById('icon-' + selectedIcon)?.classList.remove('selected');
    selectedIcon = null;
  }
  closeStartMenu();
  closeContextMenu();
});

// ── Window management ──────────────────────────────────────
let zCounter = 20;
const openWindows = {};

async function openWindow(pageId) {
  closeStartMenu();
  if (openWindows[pageId]) {
    const e = openWindows[pageId];
    if (e.minimized) { e.el.style.display = 'flex'; e.minimized = false; }
    focusWindow(e.el);
    return;
  }

  const pg = PAGES[pageId];
  if (!pg) return;

  const offset = Object.keys(openWindows).length * 24;
  const w = Math.min(740, window.innerWidth  - 100);
  const h = Math.min(550, window.innerHeight - 100);

  const win = document.createElement('div');
  win.className = 'xp-window focused';
  win.id = `win-${pageId}`;
  win.style.cssText = `left:${90+offset}px;top:${30+offset}px;width:${w}px;height:${h}px;position:absolute;display:flex;flex-direction:column;`;
  win.innerHTML = buildWindowShell(pageId, pg);
  document.getElementById('windows-container').appendChild(win);

  //Inject Content
  const contentEl = win.querySelector('.xp-window-content');
  contentEl.innerHTML = `<div style="padding:20px;color:#888;font-size:12px;font-family:Tahoma,sans-serif;">Loading...</div>`;
  const html = await pg.render();
  contentEl.innerHTML = `<div class="page-body">${html}</div>`;

  win.addEventListener('mousedown', () => focusWindow(win));
  focusWindow(win);

  const taskBtn = document.createElement('div');
  taskBtn.className = 'xp-task-btn active';
  taskBtn.innerHTML = `<span>${pg.icon}</span><span>${pg.title}</span>`;
  taskBtn.onclick = () => toggleWindowFromTaskbar(pageId);
  document.getElementById('taskbar-tasks').appendChild(taskBtn);

  openWindows[pageId] = { el: win, taskBtn, minimized: false, maximized: false, savedStyle: null };
  setupDrag(win);
}

function buildWindowShell(pageId, pg) {
  return `
    <div class="xp-titlebar" ondblclick="maximizeWindow('${pageId}')">
      <span class="xp-title-icon">${pg.icon}</span>
      <span class="xp-title-text">${pg.title}</span>
      <div class="xp-title-buttons">
        <div class="xp-btn minimize" onclick="minimizeWindow('${pageId}')" title="Minimize">_</div>
        <div class="xp-btn maximize" id="maxbtn-${pageId}" onclick="maximizeWindow('${pageId}')" title="Maximize">□</div>
        <div class="xp-btn close"    onclick="closeWindow('${pageId}')"    title="Close">✕</div>
      </div>
    </div>
    <div class="xp-menubar">
      <span class="xp-menu-item">File</span>
      <span class="xp-menu-item">Edit</span>
      <span class="xp-menu-item">View</span>
      <span class="xp-menu-item">Help</span>
    </div>
    <div class="xp-toolbar">
      <button class="xp-toolbar-btn" onclick="openWindow('about')">🏠 Home</button>
    </div>
    <div class="xp-addressbar">
      <span class="xp-address-label">Address</span>
      <input class="xp-address-input" value="C:\\Portfolio\\${pg.title}"
             onkeydown="if(event.key==='Enter'){ const k=Object.keys(PAGES).find(k=>PAGES[k].title.toLowerCase()===this.value.toLowerCase()); if(k) openWindow(k); }">
    </div>
    <div class="xp-window-content" style="flex:1;overflow-y:auto;position:relative;"></div>
    <div class="xp-statusbar">
      <span>${pg.title}</span>
      <div class="xp-status-sep"></div>
      <span>Local intranet</span>
    </div>`;
}

// ── Content renderers ──────────────────────────────────────
function renderAbout() {
  const p = PORTFOLIO;

  const sch = PORTFOLIO.education.map((proj, i) => `
    <div class="xp-project-card">
      <div class="xp-project-title">${proj.school}</div>
              <div style="color:#555;">${proj.degree} &nbsp;|&nbsp; ${proj.dates}</div>
              <div style="margin-top:4px;">GPA: ${proj.gpa} &nbsp;|&nbsp; ${proj.details}</div>
    </div>`).join('');
  return `
    <div class="xp-page-title">👤 About Me</div>
    <div class="xp-profile-grid">
      <div class="xp-profile-card">
        <img src="images/profile.jpg"
     style="width:100%;border-radius:4px;margin-bottom:8px;"
     onerror="this.replaceWith(Object.assign(document.createElement('div'), {textContent:'👤', style:'font-size:60px;margin-bottom:8px;'}))">
        <div style="font-weight:700;font-size:14px;color:#003c74;">${p.name}</div>
        <div style="font-size:11px;color:#555;margin-top:4px;">${p.tagline}</div>
      </div>
      <div>
        <div class="xp-section">
          <div class="xp-section-title">📋 Bio</div>
          <p style="color:#333;">${p.bio}</p>
        </div>
        <div class="xp-section" style="margin-top:12px;">
          <div class="xp-info-row"><span class="xp-info-key">📍 Location:</span>${p.location}</div>
          <div class="xp-info-row"><span class="xp-info-key">✉️ Email:</span>
            <a href="mailto:${p.email}" class="xp-link">${p.email}</a></div>
          <div class="xp-info-row"><span class="xp-info-key">💻 GitHub:</span>
            <a href="${p.github}" class="xp-link" target="_blank">${p.github.replace('https://','')}</a></div>
          <div class="xp-info-row"><span class="xp-info-key">🔗 LinkedIn:</span>
            <a href="${p.linkedin}" class="xp-link" target="_blank">${p.linkedin.replace('https://','')}</a></div>
        </div>
      </div>
    </div>
    <div class="xp-section">
      
      <div class="xp-section">
            <div class="xp-section-title">🎓 Education</div>${sch}
          </div>
    
    <div class="xp-section">
      <div class="xp-section-title">🔧 Technical Skills</div>
      <div>${p.skills.map(s => `<span class="xp-skill-tag">${s}</span>`).join('')}</div>
    </div>`;
}

async function renderProjects() {
  const repos = await fetchGitHubProjects();
 
  // If GitHub fetch returned nothing, show a friendly message
  if (!repos.length) {
    return `<div class="xp-page-title">🚀 Projects</div>
            <p style="color:#888;font-size:12px;">Could not load projects from GitHub. Check your username in data.js.</p>`;
  }
 
  const cards = repos.map((proj, i) => `
    <div class="xp-project-card">
      <div class="xp-project-title">${i+1}. ${proj.name}
        <span style="font-size:10px;font-weight:400;color:#666;margin-left:8px;">${proj.year}</span>
        ${proj.stars > 0 ? `<span style="font-size:10px;color:#888;margin-left:8px;">⭐ ${proj.stars}</span>` : ''}
      </div>
      <p style="color:#333;margin-bottom:6px;">${proj.description}</p>
      <div style="margin-bottom:6px;">${proj.tech.map(t => `<span class="xp-skill-tag">${t}</span>`).join('')}</div>
      <a href="${proj.github}" class="xp-link" target="_blank">📁 GitHub</a>
      ${proj.live !== '#' ? `<a href="${proj.live}" class="xp-link" target="_blank">🌐 Live Demo</a>` : ''}
    </div>`).join('');
 
  return `<div class="xp-page-title">🚀 Projects</div>
          <p style="color:#555;margin-bottom:14px;">
            ${repos.length} public repo${repos.length !== 1 ? 's' : ''} from
            <a href="${PORTFOLIO.github}" class="xp-link" target="_blank">GitHub</a>
          </p>${cards}`;
}

function renderResume() {
  const p = PORTFOLIO;
  const exp = p.experience.map(e => `
    <div class="xp-project-card">
      <div class="xp-project-title">${e.role}</div>
      <div style="color:#555;margin-bottom:6px;">${e.company} &nbsp;|&nbsp; ${e.dates}</div>
      ${e.bullets.map(b=>`<div style="margin:2px 0;">▸ ${b}</div>`).join('')}
    </div>`).join('');

  const pdfBtn = p.resume_pdf !== '#'
    ? `<a href="${p.resume_pdf}" target="_blank" class="xp-link"
          style="display:inline-block;padding:4px 12px;background:linear-gradient(180deg,#e8f4ff,#c8dff8);border:1px solid #7f9db9;border-radius:2px;text-decoration:none;margin-bottom:14px;">
        ⬇ Download Resume PDF
       </a>` : '';

  
  const sch = PORTFOLIO.education.map((proj, i) => `
    <div class="xp-project-card">
      <div class="xp-project-title">${proj.school}</div>
              <div style="color:#555;">${proj.degree} &nbsp;|&nbsp; ${proj.dates}</div>
              <div style="margin-top:4px;">GPA: ${proj.gpa} &nbsp;|&nbsp; ${proj.details}</div>
    </div>`).join('');

  return `<div class="xp-page-title">📄 Resume</div>
          ${pdfBtn}
          <div class="xp-section">
            <div class="xp-section-title">💼 Experience</div>${exp}
          </div>
          <div class="xp-section">
            <div class="xp-section-title">🎓 Education</div>${sch}
          </div>`;
}

function renderContact() {
  const p = PORTFOLIO;
  return `
    <div class="xp-page-title">📬 Contact</div>
    <p style="color:#333;margin-bottom:18px;">${p.contact_message}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;">
      <a href="mailto:${p.email}" style="text-decoration:none;">
        <div class="xp-project-card" style="text-align:center;cursor:pointer;">
          <div style="font-size:32px;margin-bottom:6px;">✉️</div>
          <div style="font-weight:700;color:#003c74;">Email</div>
          <div class="xp-link" style="margin:0;">${p.email}</div>
        </div>
      </a>
      <a href="${p.github}" target="_blank" style="text-decoration:none;">
        <div class="xp-project-card" style="text-align:center;cursor:pointer;">
          <div style="font-size:32px;margin-bottom:6px;">💻</div>
          <div style="font-weight:700;color:#003c74;">GitHub</div>
          <div class="xp-link" style="margin:0;">View my projects</div>
        </div>
      </a>
      <a href="${p.linkedin}" target="_blank" style="text-decoration:none;">
        <div class="xp-project-card" style="text-align:center;cursor:pointer;">
          <div style="font-size:32px;margin-bottom:6px;">🔗</div>
          <div style="font-weight:700;color:#003c74;">LinkedIn</div>
          <div class="xp-link" style="margin:0;">Connect with me</div>
        </div>
      </a>
    </div>`;
}

function renderMyComputer() {
  const icons = Object.entries(PAGES)
    .filter(([k]) => k !== 'mycomputer')
    .map(([k, pg]) => `
      <div style="text-align:center;cursor:pointer;padding:10px 14px;border:1px solid transparent;border-radius:2px;width:90px;"
           ondblclick="openWindow('${k}')"
           onmouseover="this.style.background='#ddeeff';this.style.borderColor='#7ab0d8'"
           onmouseout="this.style.background='';this.style.borderColor='transparent'">
        <div style="font-size:34px;">${pg.icon}</div>
        <div style="font-size:11px;margin-top:4px;">${pg.title}</div>
      </div>`).join('');
  return `
    <div class="xp-page-title">🖥️ My Computer</div>
    <div class="xp-section-title" style="margin-bottom:10px;">Portfolio Pages</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">${icons}</div>
    <div class="xp-section-title" style="margin-bottom:10px;">Drives</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      ${[{icon:'💿',label:'Local Disk (C:)',detail:'420 GB free'},{icon:'📀',label:'CD Drive (D:)',detail:'Portfolio v1.0'}]
        .map(d=>`<div style="text-align:center;cursor:pointer;padding:10px 14px;border:1px solid transparent;border-radius:2px;"
                      onmouseover="this.style.background='#ddeeff';this.style.borderColor='#7ab0d8'"
                      onmouseout="this.style.background='';this.style.borderColor='transparent'">
                  <div style="font-size:34px;">${d.icon}</div>
                  <div style="font-size:11px;font-weight:700;">${d.label}</div>
                  <div style="font-size:10px;color:#555;">${d.detail}</div>
                 </div>`).join('')}
    </div>`;
}

// ── Focus ──────────────────────────────────────────────────
function focusWindow(win) {
  document.querySelectorAll('.xp-window').forEach(w => {
    w.classList.remove('focused'); w.classList.add('unfocused');
  });
  win.classList.remove('unfocused'); win.classList.add('focused');
  win.style.zIndex = ++zCounter;
  Object.values(openWindows).forEach(({ taskBtn }) => taskBtn.classList.remove('active'));
  const id = win.id.replace('win-', '');
  if (openWindows[id]) openWindows[id].taskBtn.classList.add('active');
}

// ── Minimize ───────────────────────────────────────────────
function minimizeWindow(id) {
  const e = openWindows[id]; if (!e) return;
  e.el.style.display = 'none'; e.minimized = true;
  e.taskBtn.classList.remove('active');
}

// ── Maximize / Restore ─────────────────────────────────────
function maximizeWindow(id) {
  const e = openWindows[id]; if (!e) return;
  const win = e.el;
  const btn = document.getElementById(`maxbtn-${id}`);
  if (e.maximized) {
    const s = e.savedStyle;
    win.style.left = s.left; win.style.top = s.top;
    win.style.width = s.width; win.style.height = s.height;
    win.style.borderRadius = '';
    e.maximized = false;
    if (btn) btn.textContent = '□';
  } else {
    e.savedStyle = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height };
    const desk = document.getElementById('desktop');
    win.style.left = '0'; win.style.top = '0';
    win.style.width = desk.offsetWidth + 'px';
    win.style.height = desk.offsetHeight + 'px';
    win.style.borderRadius = '0';
    e.maximized = true;
    if (btn) btn.textContent = '❐';
  }
  focusWindow(win);
}

// ── Close ──────────────────────────────────────────────────
function closeWindow(id) {
  const e = openWindows[id]; if (!e) return;
  e.el.remove(); e.taskBtn.remove();
  delete openWindows[id];
}

// ── Taskbar toggle ─────────────────────────────────────────
function toggleWindowFromTaskbar(id) {
  const e = openWindows[id]; if (!e) return;
  if (e.minimized) {
    e.el.style.display = 'flex'; e.minimized = false; focusWindow(e.el);
  } else if (e.el.classList.contains('focused')) {
    minimizeWindow(id);
  } else {
    focusWindow(e.el);
  }
}

// ── Drag ───────────────────────────────────────────────────
function setupDrag(win) {
  const tb = win.querySelector('.xp-titlebar');
  let dragging = false, ox = 0, oy = 0;
  tb.addEventListener('mousedown', e => {
    if (e.target.closest('.xp-title-buttons')) return;
    const id = win.id.replace('win-', '');
    if (openWindows[id]?.maximized) return;
    dragging = true; ox = e.clientX - win.offsetLeft; oy = e.clientY - win.offsetTop;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const desk = document.getElementById('desktop');
    win.style.left = Math.max(-win.offsetWidth+100, Math.min(e.clientX-ox, desk.offsetWidth-100))  + 'px';
    win.style.top  = Math.max(0,                    Math.min(e.clientY-oy, desk.offsetHeight-28)) + 'px';
  });
  document.addEventListener('mouseup', () => { dragging = false; });
}

// ── Start Menu ─────────────────────────────────────────────
function toggleStartMenu() { document.getElementById('startmenu').classList.toggle('open'); }
function closeStartMenu()   { document.getElementById('startmenu').classList.remove('open'); }

// ── Context Menu ───────────────────────────────────────────
function showContextMenu(e) {
  e.preventDefault();
  const cm = document.getElementById('contextmenu');
  cm.style.left = Math.min(e.clientX, window.innerWidth  - 180) + 'px';
  cm.style.top  = Math.min(e.clientY, window.innerHeight - 120) + 'px';
  cm.classList.add('open');
}
function closeContextMenu() { document.getElementById('contextmenu').classList.remove('open'); }

document.addEventListener('click', e => {
  if (!e.target.closest('#contextmenu'))                            closeContextMenu();
  if (!e.target.closest('.xp-start') && !e.target.closest('#startmenu')) closeStartMenu();
});

// ── Keyboard ───────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter'  && selectedIcon && selectedIcon !== 'crt') openWindow(selectedIcon);
  if (e.key === 'Escape') { closeStartMenu(); closeContextMenu(); }
});

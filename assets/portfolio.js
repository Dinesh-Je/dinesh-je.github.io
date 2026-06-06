/* ===================================================
   DINESH JE — PORTFOLIO SHARED JS
   =================================================== */

(function(){
  const PAGE = document.body.dataset.page || 'home';

  /* ===== ACTIVE NAV HIGHLIGHT ===== */
  document.querySelectorAll('.titlebar .tabs a').forEach(a => {
    if (a.dataset.nav === PAGE) a.classList.add('active');
  });

  /* ===== BOOT SEQUENCE (landing page only) ===== */
  if (PAGE === 'home') {
    const bootLines = [
      { t: "[<span class='info'>boot</span>] initializing portfolio system v2.1.0...", d: 60 },
      { t: "[<span class='ok'>  ok</span>] loading user profile: Dinesh Je", d: 80 },
      { t: "[<span class='ok'>  ok</span>] mounting /skills, /experience, /projects", d: 70 },
      { t: "[<span class='ok'>  ok</span>] connecting to sage.intacct.cloud .... <span class='ok'>[ ONLINE ]</span>", d: 90 },
      { t: "[<span class='ok'>  ok</span>] connecting to powerbi.local ........ <span class='ok'>[ ONLINE ]</span>", d: 90 },
      { t: "[<span class='ok'>  ok</span>] connecting to dynamics365.azure .... <span class='ok'>[ ONLINE ]</span>", d: 90 },
      { t: "[<span class='warn'>warn</span>] coffee.service: caffeine levels nominal", d: 70 },
      { t: "[<span class='ok'>  ok</span>] session established — welcome, visitor.", d: 100 },
    ];
    const bootEl = document.getElementById('bootLog');
    if (bootEl) {
      let i = 0;
      (function next() {
        if (i >= bootLines.length) return;
        const line = document.createElement('div');
        line.innerHTML = bootLines[i].t;
        bootEl.appendChild(line);
        bootEl.scrollTop = bootEl.scrollHeight;
        setTimeout(next, bootLines[i++].d);
      })();
    }
  }

  /* ===== CLOCK ===== */
  function tickClock() {
    const c = document.getElementById('clock');
    if (!c) return;
    const d = new Date();
    const p = n => String(n).padStart(2,'0');
    c.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  setInterval(tickClock, 1000); tickClock();

  /* ===== SCROLL REVEAL ===== */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ===== LINE NUMBER ON SCROLL ===== */
  window.addEventListener('scroll', () => {
    const ln = document.getElementById('lnNum');
    if (!ln) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max ? window.scrollY / max : 0;
    ln.textContent = String(Math.round(pct * 999)).padStart(3,'0');
  });

  /* ===== MINI TERMINAL ===== */
  const mtBody = document.getElementById('mtBody');
  const mtInput = document.getElementById('mtInput');

  const pageMap = {
    home: 'index.html', about: 'about.html', skills: 'skills.html',
    experience: 'experience.html', projects: 'projects.html',
    insights: 'insights.html', contact: 'contact.html',
  };

  const commands = {
    help: () => [
      "available commands:",
      "  home        — go to landing page",
      "  about       — about page",
      "  skills      — skills matrix",
      "  experience  — career timeline",
      "  projects    — project gallery",
      "  insights    — writing & insights",
      "  contact     — contact page",
      "  whoami      — display identity",
      "  date        — current date/time",
      "  socials     — list social links",
      "  ls          — list pages",
      "  pwd         — print current path",
      "  clear       — clear terminal",
      "  sudo        — try it :)",
    ],
    home:       () => { go('home'); return ["→ navigating to /"]; },
    about:      () => { go('about'); return ["→ navigating to /about"]; },
    skills:     () => { go('skills'); return ["→ loading /skills"]; },
    experience: () => { go('experience'); return ["→ loading /experience"]; },
    projects:   () => { go('projects'); return ["→ git checkout projects"]; },
    insights:   () => { go('insights'); return ["→ cat /insights"]; },
    contact:    () => { go('contact'); return ["→ opening contact channel"]; },
    whoami:     () => [
                  "Dinesh Je — Sage Intacct Admin &amp; Consultant @ Brand Finance",
                  "MSc. in Data Science · 11+ years experience",
                  "stack: Sage Intacct · Power BI · D365 · Power Platform · NetSuite · SQL"
                ],
    date:       () => [new Date().toString()],
    socials:    () => [
                  "linkedin: linkedin.com/in/dinesh-jebamalai",
                  "github:   github.com/Dinesh-Je",
                  "location: Matale, Sri Lanka"
                ],
    ls:         () => ["index.html  about.html  skills.html  experience.html  projects.html  insights.html  contact.html"],
    pwd:        () => [`/home/visitor/portfolio/${PAGE === 'home' ? '' : PAGE}`],
    clear:      () => { if (mtBody) mtBody.innerHTML = ''; return null; },
    sudo:       () => ["[<span class='err'>err</span>] permission denied: nice try though"],
    exit:       () => ["[<span class='err'>err</span>] cannot exit — you're stuck with me"],
  };

  function go(key) {
    const target = pageMap[key];
    if (target) setTimeout(() => window.location.href = target, 350);
  }

  function mtLog(text, cls) {
    if (!mtBody) return;
    const d = document.createElement('div');
    d.className = 'mt-line ' + (cls || '');
    d.innerHTML = text;
    mtBody.appendChild(d);
    mtBody.scrollTop = mtBody.scrollHeight;
  }

  if (mtInput) {
    mtInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const cmd = mtInput.value.trim().toLowerCase();
      if (!cmd) return;
      mtLog(cmd, 'in');
      mtInput.value = '';
      if (commands[cmd]) {
        const out = commands[cmd]();
        if (out) out.forEach(l => mtLog(l));
      } else {
        mtLog(`command not found: ${cmd} — type 'help'`, 'err');
      }
    });
  }

  /* ===== CONTACT FORM (only on contact page) ===== */
  const cf = document.getElementById('contactForm');
  if (cf) {
    cf.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = cf.querySelector('.send-btn');
      btn.textContent = '› transmitting...';
      setTimeout(() => {
        btn.textContent = '✓ message_sent';
        btn.style.background = 'var(--green)';
        btn.style.color = 'var(--bg)';
      }, 800);
    });
  }

  /* ===== RESUME BUTTON ===== */
  const db = document.getElementById('downloadBtn');
  if (db) {
    db.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Replace this with the path to your actual resume.pdf — see the HTML source.");
    });
  }
})();

/* ===================================================
   DINESH JE — PORTFOLIO SHARED JS (with AI bot)
   =================================================== */

// ⚠️ EDIT THIS LINE — paste your Cloudflare Worker URL here.
const BOT_ENDPOINT = 'https://dinesh-portfolio-bot.dinesh-je94.workers.dev';

(function(){
  const PAGE = document.body.dataset.page || 'home';

  /* ===== ACTIVE NAV HIGHLIGHT ===== */
  document.querySelectorAll('.titlebar .tabs a').forEach(a => {
    if (a.dataset.nav === PAGE) a.classList.add('active');
  });

  /* ===== BOOT SEQUENCE (landing page only) ===== */
  if (PAGE === 'home') {
    const bootLines = [
      { t: "[<span class='info'>boot</span>] initializing portfolio system v2.2.0...", d: 60 },
      { t: "[<span class='ok'>  ok</span>] loading user profile: Dinesh Je", d: 80 },
      { t: "[<span class='ok'>  ok</span>] mounting /skills, /experience, /projects", d: 70 },
      { t: "[<span class='ok'>  ok</span>] connecting to sage.intacct.cloud .... <span class='ok'>[ ONLINE ]</span>", d: 90 },
      { t: "[<span class='ok'>  ok</span>] connecting to powerbi.local ........ <span class='ok'>[ ONLINE ]</span>", d: 90 },
      { t: "[<span class='ok'>  ok</span>] connecting to dynamics365.azure .... <span class='ok'>[ ONLINE ]</span>", d: 90 },
      { t: "[<span class='ok'>  ok</span>] initializing ai_assistant.service ... <span class='ok'>[ READY ]</span>", d: 90 },
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

  /* ===== MINI TERMINAL + AI BOT ===== */
  const mtBody = document.getElementById('mtBody');
  const mtInput = document.getElementById('mtInput');

  // Update the placeholder hint
  if (mtInput) mtInput.placeholder = "type a command or ask anything...";

  // Update the welcome line if it's the default
  if (mtBody && mtBody.children.length > 0) {
    const first = mtBody.children[0];
    if (first.textContent && first.textContent.includes("type 'help'")) {
      first.innerHTML = "welcome — type 'help' for commands, or just ask me anything about Dinesh.";
    }
  }

  const pageMap = {
    home: 'index.html', about: 'about.html', skills: 'skills.html',
    experience: 'experience.html', projects: 'projects.html',
    insights: 'insights.html', contact: 'contact.html',
  };

  // Conversation memory for the bot (last 8 turns kept by server)
  const conversation = [];

  const commands = {
    help: () => [
      "available commands:",
      "  home / about / skills / experience    — navigate pages",
      "  projects / insights / contact         — navigate pages",
      "  whoami      — display identity",
      "  date        — current date/time",
      "  socials     — list social links",
      "  ls          — list pages",
      "  pwd         — print current path",
      "  clear       — clear terminal",
      "  ─────────────────────────────────────",
      "  or just type a question — the AI",
      "  assistant will answer about Dinesh.",
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
    clear:      () => { if (mtBody) mtBody.innerHTML = ''; conversation.length = 0; return null; },
    sudo:       () => ["[<span class='err'>err</span>] permission denied: nice try though"],
    exit:       () => ["[<span class='err'>err</span>] cannot exit — you're stuck with me"],
  };

  function go(key) {
    const target = pageMap[key];
    if (target) setTimeout(() => window.location.href = target, 350);
  }

  function mtLog(text, cls) {
    if (!mtBody) return null;
    const d = document.createElement('div');
    d.className = 'mt-line ' + (cls || '');
    d.innerHTML = text;
    mtBody.appendChild(d);
    mtBody.scrollTop = mtBody.scrollHeight;
    return d;
  }

  /* ===== ASK THE BOT ===== */
  async function askBot(message) {
    conversation.push({ role: 'user', content: message });

    // Show thinking indicator with animated dots
    const thinking = mtLog("<span class='thinking'>thinking</span><span class='dots'>...</span>", 'bot-thinking');
    if (mtInput) mtInput.disabled = true;

    try {
      const res = await fetch(BOT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation }),
      });

      if (thinking) thinking.remove();

      if (!res.ok) {
        mtLog("[<span class='err'>err</span>] bot returned " + res.status + " — try again or check console", 'err');
        conversation.pop(); // remove the failed user message
        return;
      }

      const data = await res.json();
      if (data.error) {
        mtLog("[<span class='err'>err</span>] " + data.error, 'err');
        conversation.pop();
        return;
      }

      const reply = (data.reply || '').trim();
      if (!reply) {
        mtLog("[<span class='err'>err</span>] empty response", 'err');
        conversation.pop();
        return;
      }

      conversation.push({ role: 'assistant', content: reply });

      // Output line-by-line for that terminal feel
      reply.split('\n').forEach(line => {
        if (line.trim()) mtLog(escapeHtml(line), 'bot');
      });
    } catch (err) {
      if (thinking) thinking.remove();
      mtLog("[<span class='err'>err</span>] connection failed — bot offline?", 'err');
      conversation.pop();
      console.error('Bot fetch failed:', err);
    } finally {
      if (mtInput) {
        mtInput.disabled = false;
        mtInput.focus();
      }
    }
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  if (mtInput) {
    mtInput.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') return;
      const raw = mtInput.value.trim();
      if (!raw) return;
      const cmd = raw.toLowerCase();
      mtLog(escapeHtml(raw), 'in');
      mtInput.value = '';

      // Built-in command?
      if (commands[cmd]) {
        const out = commands[cmd]();
        if (out) out.forEach(l => mtLog(l));
        return;
      }

      // Anything else — ask Claude
      await askBot(raw);
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

  /* ===== RESUME BUTTON — now links directly to Drive ===== */
})();

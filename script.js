// ================= NEW SMOOTH LOADER =================
document.addEventListener('DOMContentLoaded', () => {
  const ldPct = document.getElementById('ldPct');
  const ldBar = document.querySelector('.ld-progress-bar');
  let pct = 0;
  
  // Smoother interval for premium feel
  const tick = setInterval(() => {
    pct += Math.random() * 4 + 1; 
    if (pct >= 100) pct = 100;
    
    ldPct.textContent = Math.floor(pct) + '%';
    ldBar.style.width = pct + '%';
    
    if (pct === 100) {
      clearInterval(tick);
      setTimeout(() => document.getElementById('loader').classList.add('done'), 400);
    }
  }, 40);
});

// ================= CUSTOM CURSOR =================
const dot = document.getElementById('dot');
const ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

setInterval(() => {
  rx += (mx - rx) * 0.10;
  ry += (my - ry) * 0.10;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
}, 13);

document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width = '13px'; dot.style.height = '13px';
    ring.style.width = '48px'; ring.style.height = '48px';
    ring.style.background = 'rgba(76,159,227,0.07)';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width = '7px'; dot.style.height = '7px';
    ring.style.width = '30px'; ring.style.height = '30px';
    ring.style.background = 'transparent';
  });
});

// ================= NAVBAR SCROLL =================
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// ================= SCROLL REVEAL =================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ================= STAT COUNTERS =================
function countUp(el, target, suffix, duration = 1800) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    countUp(document.getElementById('stat1'), 80, '×');
    countUp(document.getElementById('stat2'), 10, 'yr');
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });
statsObserver.observe(document.getElementById('stats'));

// ================= HERO CANVAS =================
const isMobile = window.innerWidth <= 860;
if (!isMobile) {
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let nodes = [], W, H, animId;

    function resizeHero() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      nodes = Array.from({length: 80}, () => ({ // Increased nodes slightly for larger width
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 2.2 + 1.2,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '76,159,227' : '197,221,255'
      }));
    }

    function drawHero() {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.phase += 0.018;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 150) { // Increased connection distance slightly
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(76,159,227,${0.16 * (1 - d / 150)})`;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        const a = Math.abs(Math.sin(n.phase)) * 0.35 + 0.55;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color},${a})`; ctx.fill();
      });
      animId = requestAnimationFrame(drawHero);
    }
    window.addEventListener('resize', resizeHero);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(drawHero);
    });
    resizeHero(); drawHero();
  }
}

// ================= ARCHITECTURE CANVAS =================
const gc = document.getElementById('graphCanvas');
if (gc) {
  const gx = gc.getContext('2d');
  const LABELS = ['Core','Emotion','Memory','Context','Intent','Meaning','Self','Time','Empathy','Recall'];
  let gNodes = [], gW, gH, gAnimId;

  function initGraph() {
    gW = gc.width = gc.offsetWidth;
    gH = gc.height = gc.offsetHeight;
    const cx = gW / 2, cy = gH / 2;
    gNodes = LABELS.map((lbl, i) => {
      let x, y;
      if (i === 0) { x = cx; y = cy; }
      else {
        const ring = i <= 4 ? 1 : 2;
        const count = ring === 1 ? 4 : 5;
        const offset = ring === 1 ? 0 : 1;
        const idx = ring === 1 ? i - 1 : i - 5;
        const angle = ((idx + offset * 0.5) / count) * Math.PI * 2 - Math.PI / 2;
        const radius = ring === 1 ? Math.min(gW, gH) * 0.26 : Math.min(gW, gH) * 0.42;
        x = cx + Math.cos(angle) * radius; y = cy + Math.sin(angle) * radius;
      }
      return { x, bx: x, y, by: y, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4,
               r: i === 0 ? 12 : 7, phase: Math.random() * Math.PI * 2, label: lbl };
    });
  }

  function drawGraph() {
    gx.clearRect(0, 0, gW, gH);
    gNodes.forEach((n, i) => {
      if (i > 0) {
        n.x += n.vx; n.y += n.vy;
        if (Math.abs(n.x - n.bx) > 20) n.vx *= -1;
        if (Math.abs(n.y - n.by) > 20) n.vy *= -1;
      }
      n.phase += 0.02;
    });
    
    gNodes.slice(1).forEach(n => {
      gx.beginPath(); gx.moveTo(gNodes[0].x, gNodes[0].y); gx.lineTo(n.x, n.y);
      gx.strokeStyle = 'rgba(76,159,227,0.22)'; gx.lineWidth = 1.4; gx.stroke();
    });
    
    const edges = isMobile ? [[1,4],[2,6],[3,7]] : [[1,4],[2,6],[3,7],[5,9],[8,2]];
    edges.forEach(([a,b]) => {
      if (!gNodes[a] || !gNodes[b]) return;
      gx.beginPath(); gx.moveTo(gNodes[a].x, gNodes[a].y); gx.lineTo(gNodes[b].x, gNodes[b].y);
      gx.strokeStyle = 'rgba(197,221,255,0.38)'; gx.lineWidth = 0.8; gx.stroke();
    });
    
    gNodes.forEach((n, i) => {
      const pulse = Math.abs(Math.sin(n.phase)) * 0.22 + 0.78;
      const scale = 1 + Math.sin(n.phase) * 0.07;
      gx.beginPath(); gx.arc(n.x, n.y, n.r * scale, 0, Math.PI * 2);
      gx.fillStyle = i === 0 ? '#4c9fe3' : `rgba(76,159,227,${pulse * 0.72})`;
      gx.globalAlpha = pulse; gx.fill(); gx.globalAlpha = 1;
      gx.fillStyle = i === 0 ? '#fff' : '#1a5fa0';
      gx.font = `500 ${i===0 ? 10.5 : 9.5}px 'DM Sans', sans-serif`;
      gx.textAlign = 'center';
      gx.fillText(n.label, n.x, i === 0 ? n.y + 4 : n.y + n.r + 13);
    });
    gAnimId = requestAnimationFrame(drawGraph);
  }

  window.addEventListener('resize', initGraph);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(gAnimId);
    else gAnimId = requestAnimationFrame(drawGraph);
  });
  initGraph(); drawGraph();
}

// ================= CONTACT FORM =================
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type=submit]');
  const originalText = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.cursor = 'wait';
  btn.style.opacity = '0.8';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      btn.textContent = 'Message Sent ✓';
      btn.classList.add('btn-success'); 
      form.reset(); 

      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('btn-success');
        btn.disabled = false;
        btn.style.cursor = 'none'; 
        btn.style.opacity = '1';
      }, 4000);

    } else {
      btn.textContent = 'Error. Try again';
      btn.disabled = false;
      btn.style.cursor = 'none';
      btn.style.opacity = '1';
    }
  } catch (error) {
    btn.textContent = 'Network Error. Try again';
    btn.disabled = false;
    btn.style.cursor = 'none';
    btn.style.opacity = '1';
  }
});
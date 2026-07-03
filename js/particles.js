// Two canvas systems: ambient bioluminescent bubbles + one-shot confetti cannon.
const Particles = (() => {
  const bubbleCanvas = document.getElementById("bubbles");
  const confettiCanvas = document.getElementById("confetti");
  const bctx = bubbleCanvas.getContext("2d");
  const cctx = confettiCanvas.getContext("2d");

  let W, H;
  function resize() {
    W = bubbleCanvas.width = confettiCanvas.width = window.innerWidth;
    H = bubbleCanvas.height = confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // ---- ambient bubbles (subnautica energy) ----
  let bubbleHue = "cyan"; // flips to "gold" at the legendary moment
  const bubbles = Array.from({ length: 40 }, () => spawnBubble(true));

  function spawnBubble(anywhere = false) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: 1 + Math.random() * 3.5,
      vy: 0.2 + Math.random() * 0.7,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: 0.15 + Math.random() * 0.45,
    };
  }

  function drawBubbles() {
    bctx.clearRect(0, 0, W, H);
    const color = bubbleHue === "gold" ? "255, 201, 51" : "255, 214, 150";
    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      b.y -= b.vy;
      b.x += b.drift + Math.sin(b.y * 0.01) * 0.3;
      if (b.y < -10) bubbles[i] = spawnBubble();
      bctx.beginPath();
      bctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      bctx.fillStyle = `rgba(${color}, ${b.alpha})`;
      bctx.fill();
    }
  }

  // ---- confetti cannon ----
  const confetti = [];
  const CONFETTI_COLORS = ["#ffc933", "#ffe58a", "#35e0ff", "#f4f8ff", "#ff4655"];

  function burst(count = 160) {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = 6 + Math.random() * 11;
      confetti.push({
        x: W / 2, y: H * 0.6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 4 + Math.random() * 6,
        h: 6 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        life: 1,
      });
    }
  }

  function drawConfetti() {
    cctx.clearRect(0, 0, W, H);
    for (let i = confetti.length - 1; i >= 0; i--) {
      const p = confetti[i];
      p.vy += 0.18;           // gravity
      p.vx *= 0.99;           // air drag
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.004;
      if (p.life <= 0 || p.y > H + 30) { confetti.splice(i, 1); continue; }
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.globalAlpha = Math.min(1, p.life * 2);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    }
  }

  function loop() {
    drawBubbles();
    drawConfetti();
    requestAnimationFrame(loop);
  }
  loop();

  return {
    burst,
    goGold() { bubbleHue = "gold"; },
  };
})();

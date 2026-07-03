// The whole page is one async timeline: box → fake-out → legendary pull.
const $ = (sel) => document.querySelector(sel);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- pour config into the DOM ----
const T = CONFIG.text;
// the key can ride in the URL fragment (#XXXXX-XXXXX-XXXXX) so it never has
// to be committed to a public repo; config.js is the fallback
const STEAM_KEY = location.hash.length > 5
  ? decodeURIComponent(location.hash.slice(1))
  : CONFIG.steamKey;
$(".idle-line").textContent = T.idleLine;
$(".idle-hint").textContent = T.idleHint;
$(".legendary-tag").textContent = T.legendaryTag;
$(".happy-prefix").textContent = T.happyLine;
$(".happy-name").textContent = CONFIG.cousinName;
$(".code-label").textContent = T.codeLabel;
$(".game-name").textContent = CONFIG.gameName;
$("#steam-key").textContent = STEAM_KEY;
$("#copy-btn").textContent = T.copyLabel;
$(".footer-line").textContent = T.footerLine;
// Auto-strip a white background if the export lost its transparency.
// Flood-fills from the image borders so whites INSIDE the subject survive.
function stripWhiteBackground(img) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, w, h);
  const p = d.data;
  const isWhite = (i) => p[i] > 226 && p[i + 1] > 226 && p[i + 2] > 226;

  // only bother if all four corners are white (i.e. bg really is white)
  const corners = [0, (w - 1), (h - 1) * w, h * w - 1];
  if (!corners.every((n) => isWhite(n * 4))) return null;

  const visited = new Uint8Array(w * h);
  const stack = [];
  for (let i = 0; i < w; i++) stack.push(i, i + (h - 1) * w);
  for (let i = 0; i < h; i++) stack.push(i * w, i * w + w - 1);
  while (stack.length) {
    const n = stack.pop();
    if (visited[n]) continue;
    visited[n] = 1;
    const i = n * 4;
    if (!isWhite(i)) continue;
    p[i + 3] = 0;
    const cx = n % w, cy = (n / w) | 0;
    if (cx > 0) stack.push(n - 1);
    if (cx < w - 1) stack.push(n + 1);
    if (cy > 0) stack.push(n - w);
    if (cy < h - 1) stack.push(n + w);
  }
  x.putImageData(d, 0, 0);
  return c.toDataURL("image/png");
}

const face = $("#face");
face.src = CONFIG.images.face;
face.onerror = () => { face.src = "assets/face-placeholder.svg"; };
face.addEventListener("load", () => {
  if (face.src.startsWith("data:")) return; // already processed
  try {
    const cleaned = stripWhiteBackground(face);
    if (cleaned) face.src = cleaned;
  } catch { /* canvas can fail on file:// — the raw image still shows */ }
});

const redeem = $("#redeem-link");
redeem.textContent = T.redeemLabel;
redeem.href = "https://store.steampowered.com/account/registerkey?key=" + encodeURIComponent(STEAM_KEY);

// ---- scene helpers ----
const stage = $("#stage");
function show(sceneId) {
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("is-active"));
  $(sceneId).classList.add("is-active");
}
async function shakeScreen() {
  stage.classList.add("shake");
  await sleep(500);
  stage.classList.remove("shake");
}

// ---- THE TIMELINE ----
let opened = false;
async function openBox() {
  if (opened) return;
  opened = true;
  SFX.ensure();

  const gift = $("#gift");
  const giftScene = $("#gift-scene");
  giftScene.style.cursor = "default";

  // beat 1: the box says no
  gift.classList.add("violent");
  SFX.rattle(0.7);
  await sleep(700);
  gift.classList.remove("violent");

  // beat 1.5: it grows legs. oh no.
  SFX.boing();
  giftScene.classList.add("legs-out");
  await sleep(650);

  // beat 2: ...and dips. sprints off into the sunset.
  SFX.whoosh();
  giftScene.classList.add("flee", "running");
  await sleep(2000);
  giftScene.classList.add("gone");
  $(".idle-line").textContent = T.fleeLine;
  $(".idle-hint").textContent = T.fleeHint;

  // beat 3: empty beach. tumbleweed energy.
  await sleep(3200);

  // beat 4: it's coming back around
  $(".idle-line").textContent = " ";
  $(".idle-hint").textContent = " ";
  SFX.whoosh();
  giftScene.classList.remove("flee", "gone");
  giftScene.classList.add("come-back");
  await sleep(1500);

  // beat 4.5: legs retract. it accepts its fate.
  giftScene.classList.remove("running");
  giftScene.classList.remove("legs-out");
  SFX.boing();
  await sleep(400);

  // beat 5: fine. FINE. it opens.
  gift.classList.add("violent");
  giftScene.classList.add("violent");
  SFX.rattle(1.2);
  await sleep(1200);
  gift.classList.add("popped");
  gift.classList.remove("violent");
  giftScene.classList.remove("violent");
  SFX.boom();
  shakeScreen();
  await sleep(600);

  // beat 6: dark. quiet. wait for it...
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("is-active"));
  SFX.riser(1.1);
  await sleep(1100);

  // beat 7: THE LEGENDARY PULL
  document.body.classList.add("gold-hour");
  $("#rays").classList.add("on");
  Particles.goGold();
  Particles.burst(180);
  SFX.boom();
  SFX.fanfare();
  show("#scene-legendary");
  shakeScreen();
  await sleep(900);
  Particles.burst(90); // second confetti wave for good measure
}

// listen on the flat wrapper, not the 3D faces — hit-testing on
// preserve-3d transforms is flaky, and a bigger target is friendlier anyway
const giftScene = $("#gift-scene");
giftScene.addEventListener("click", openBox);
$("#gift").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openBox();
});

// ---- code copy ----
$("#copy-btn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(STEAM_KEY);
  } catch {
    // clipboard API can fail on http:// — fall back to selecting the code
    const range = document.createRange();
    range.selectNodeContents($("#steam-key"));
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  $("#copy-btn").textContent = CONFIG.text.copiedLabel;
  setTimeout(() => ($("#copy-btn").textContent = CONFIG.text.copyLabel), 2000);
});

// ---- mouse parallax: scenery layers + box tilt read these vars ----
document.addEventListener("pointermove", (e) => {
  const dx = e.clientX / window.innerWidth - 0.5;
  const dy = e.clientY / window.innerHeight - 0.5;
  document.documentElement.style.setProperty("--dx", dx.toFixed(3));
  document.documentElement.style.setProperty("--dy", dy.toFixed(3));
});

// ---- press R to replay (handy while tuning; harmless to leave in) ----
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r" && opened) location.reload();
});

// ---- mute toggle ----
$("#mute").addEventListener("click", () => {
  const muted = SFX.toggleMute();
  $("#mute").textContent = muted ? "🔇" : "🔊";
});

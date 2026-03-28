/**
 * 네온 스피너 — 실루엣은 피젯 스피너 참고 시트(A–P) 스타일로
 * 중앙 허브 원 + 추(웨이트) 원 + 날(스트럿) 원들의 합집합으로 근사합니다.
 */

const TAU = Math.PI * 2;

function insideAny(x, y, disks) {
  for (const d of disks) {
    const dx = x - d.cx;
    const dy = y - d.cy;
    if (dx * dx + dy * dy <= d.r * d.r + 1e-10) return true;
  }
  return false;
}

/** 원점에서 방향 theta로 나가며 합집합의 가장 바깥 경계까지 거리 */
function outerRadius(theta, disks) {
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  if (!insideAny(0, 0, disks)) return 0;
  let lo = 0;
  let hi = 2.6;
  for (let i = 0; i < 56; i++) {
    const mid = (lo + hi) / 2;
    if (insideAny(mid * ux, mid * uy, disks)) lo = mid;
    else hi = mid;
  }
  return lo;
}

function traceSilhouette(ctx, cx, cy, scale, disks, points = 720) {
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * TAU;
    const r = outerRadius(theta, disks) * scale;
    const x = cx + Math.cos(theta) * r;
    const y = cy + Math.sin(theta) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/** n개 팔, 허브·추·그 사이 스트럿(가는 원들) */
function buildSymmetricArms(n, hubR, dist, weightR, strutSteps, strutScale) {
  const disks = [{ cx: 0, cy: 0, r: hubR }];
  const hubEdge = hubR * 0.88;
  const weightMeet = Math.max(hubEdge + 0.02, dist - weightR * 0.82);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * TAU) / n;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    disks.push({ cx: ux * dist, cy: uy * dist, r: weightR });
    for (let s = 1; s < strutSteps; s++) {
      const t = hubEdge + (weightMeet - hubEdge) * (s / strutSteps);
      const u = s / strutSteps;
      const rr =
        (hubR * (1 - u) + weightR * u) *
        strutScale *
        (0.55 + 0.45 * Math.sin((u * Math.PI) / 2));
      disks.push({ cx: ux * t, cy: uy * t, r: Math.max(0.022, rr) });
    }
  }
  return disks;
}

function disksBar() {
  const hubR = 0.13;
  const wR = 0.125;
  const d = 0.39;
  const disks = [
    { cx: 0, cy: 0, r: hubR },
    { cx: -d, cy: 0, r: wR },
    { cx: d, cy: 0, r: wR },
  ];
  for (let i = 1; i < 14; i++) {
    const x = -d + wR * 0.85 + (2 * d - wR * 1.7) * (i / 14);
    disks.push({
      cx: x,
      cy: 0,
      r: 0.055 + 0.02 * Math.sin((i / 14) * Math.PI),
    });
  }
  return disks;
}

function disksPeanut() {
  const hubR = 0.12;
  const r = 0.125;
  const p1 = { cx: -0.31, cy: 0.075 };
  const p2 = { cx: 0.31, cy: -0.075 };
  const disks = [
    { cx: 0, cy: 0, r: hubR },
    { cx: p1.cx, cy: p1.cy, r },
    { cx: p2.cx, cy: p2.cy, r },
  ];
  for (const p of [p1, p2]) {
    const len = Math.hypot(p.cx, p.cy);
    const ux = p.cx / len;
    const uy = p.cy / len;
    for (let s = 1; s < 12; s++) {
      const t = hubR * 0.85 + (len - r * 0.82 - hubR * 0.85) * (s / 12);
      disks.push({
        cx: ux * t,
        cy: uy * t,
        r: 0.05 + 0.03 * Math.sin((s / 12) * Math.PI),
      });
    }
  }
  return disks;
}

/**
 * 참고 시트 A–P에 대응 (이름 옆 괄호가 시트 라벨)
 */
const SHAPES = [
  {
    id: "A",
    name: "수리검 블레이드 (A)",
    ref: "A",
    desc: "날카로운 곡선 날이 돌출된 닌자·수리검형.",
    segments: 3,
    getDisks: () => buildSymmetricArms(3, 0.1, 0.44, 0.11, 16, 0.42),
  },
  {
    id: "B",
    name: "플라워 5날 (B)",
    ref: "B",
    desc: "가는 스트럿으로 추를 연결한 5추 플라워.",
    segments: 5,
    getDisks: () => buildSymmetricArms(5, 0.09, 0.42, 0.105, 18, 0.38),
  },
  {
    id: "C",
    name: "콤팩트 트라이 (C)",
    ref: "C",
    desc: "추가 크고 팔이 짧아 덩어진 3추.",
    segments: 3,
    getDisks: () => buildSymmetricArms(3, 0.13, 0.29, 0.165, 5, 0.82),
  },
  {
    id: "D",
    name: "슬림 십자 (D)",
    ref: "D",
    desc: "가는 스트럿의 4추 십자.",
    segments: 4,
    getDisks: () => buildSymmetricArms(4, 0.09, 0.4, 0.105, 15, 0.36),
  },
  {
    id: "E",
    name: "스노우 6 (E)",
    ref: "E",
    desc: "6추가 촘촘히 모여 꽃·눈송이처럼 보이는 형태.",
    segments: 6,
    getDisks: () => buildSymmetricArms(6, 0.1, 0.33, 0.125, 9, 0.72),
  },
  {
    id: "F",
    name: "하트·스페이드 (F)",
    ref: "F",
    desc: "둥글고 두꺼운 3날(하트·스페이드 실루엣).",
    segments: 3,
    getDisks: () => buildSymmetricArms(3, 0.14, 0.37, 0.175, 7, 0.88),
  },
  {
    id: "G",
    name: "스퀘어 콤팩트 (G)",
    ref: "G",
    desc: "짧고 두꺼운 연결로 추가 모서리에 가깝게 붙은 4추.",
    segments: 4,
    getDisks: () => buildSymmetricArms(4, 0.13, 0.28, 0.165, 3, 0.84),
  },
  {
    id: "H",
    name: "S·땅콩 2추 (H)",
    ref: "H",
    desc: "두 추가 대각으로 벌어진 바형 변형.",
    segments: 2,
    getDisks: () => disksPeanut(),
  },
  {
    id: "I",
    name: "클래식 3날 (I)",
    ref: "I",
    desc: "가장 흔한 두꺼운 라운드 3추.",
    segments: 3,
    getDisks: () => buildSymmetricArms(3, 0.135, 0.29, 0.155, 4, 0.78),
  },
  {
    id: "J",
    name: "라운드 십자 (J)",
    ref: "J",
    desc: "둥근 4추 십자.",
    segments: 4,
    getDisks: () => buildSymmetricArms(4, 0.12, 0.35, 0.145, 3, 0.82),
  },
  {
    id: "K",
    name: "필 바 (K)",
    ref: "K",
    desc: "허브와 양끝 추가 일직선인 막대형.",
    segments: 3,
    getDisks: () => disksBar(),
  },
  {
    id: "L",
    name: "핀치 슬림 3 (L)",
    ref: "L",
    desc: "허브와 추 사이가 잘록하게 오목한 3추.",
    segments: 3,
    getDisks: () => buildSymmetricArms(3, 0.1, 0.39, 0.125, 10, 0.52),
  },
  {
    id: "M",
    name: "펜타 5날 (M)",
    ref: "M",
    desc: "둥근 5추 펜타곤 실루엣.",
    segments: 5,
    getDisks: () => buildSymmetricArms(5, 0.1, 0.39, 0.115, 6, 0.68),
  },
  {
    id: "N",
    name: "울트라 슬림 3 (N)",
    ref: "N",
    desc: "스트럿이 매우 가늘고 추가 도드라진 3추.",
    segments: 3,
    getDisks: () => buildSymmetricArms(3, 0.09, 0.42, 0.115, 20, 0.4),
  },
  {
    id: "O",
    name: "실드 트라이 (O)",
    ref: "O",
    desc: "짧고 넓은 삼각 실루엣에 추가 박힌 형태.",
    segments: 3,
    getDisks: () => buildSymmetricArms(3, 0.145, 0.31, 0.175, 6, 0.9),
  },
  {
    id: "P",
    name: "헥스 스타 (P)",
    ref: "P",
    desc: "6추가 별처럼 뻗은 콤팩트형.",
    segments: 6,
    getDisks: () => buildSymmetricArms(6, 0.095, 0.4, 0.095, 11, 0.44),
  },
];

const NEON_PRESETS = [
  "#ff2a6d",
  "#05d9e8",
  "#d1f7ff",
  "#caff00",
  "#b967ff",
  "#ff6c11",
  "#00f5a0",
  "#ff00ff",
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const s = Math.max(0, Math.min(255, x | 0)).toString(16);
        return s.length === 1 ? "0" + s : s;
      })
      .join("")
  );
}

function hslToHex(h, s, l) {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(1, s));
  const ll = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * ll - 1)) * ss;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = ll - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hh < 60) {
    rp = c;
    gp = x;
  } else if (hh < 120) {
    rp = x;
    gp = c;
  } else if (hh < 180) {
    gp = c;
    bp = x;
  } else if (hh < 240) {
    gp = x;
    bp = c;
  } else if (hh < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }
  return rgbToHex(
    Math.round((rp + m) * 255),
    Math.round((gp + m) * 255),
    Math.round((bp + m) * 255),
  );
}

function lightenHex(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + amt, g + amt, b + amt);
}

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const shapeSelect = document.getElementById("shapeSelect");
const shapeHint = document.getElementById("shapeHint");
const colorList = document.getElementById("colorList");
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");

let currentShape = SHAPES[0];
let colors = [];
let rotation = 0;
let spinning = false;

function ensureColors(n) {
  while (colors.length < n) {
    colors.push(NEON_PRESETS[colors.length % NEON_PRESETS.length]);
  }
  colors.length = n;
}

/** 팔 중심부에 맞춘 구역: 포인터(위쪽)가 그 구역의 중심각 근처에 오도록 */
function winningIndex(rot, n) {
  let t = (-Math.PI / 2 - rot) % TAU;
  if (t < 0) t += TAU;
  const rel = (t + Math.PI / 2) % TAU;
  return Math.floor((rel + TAU / (2 * n)) / (TAU / n)) % n;
}

/** 끝 추(베어링) 원 — 안쪽은 메탈, 색은 바깥 테두리 링에만 */
function drawBearingRing(wx, wy, rOuter, color, baseR) {
  ctx.beginPath();
  ctx.arc(wx, wy, rOuter * 0.86, 0, TAU);
  const g = ctx.createRadialGradient(
    wx - rOuter * 0.2,
    wy - rOuter * 0.2,
    0,
    wx,
    wy,
    rOuter,
  );
  g.addColorStop(0, "#4a4a5c");
  g.addColorStop(0.45, "#25252f");
  g.addColorStop(1, "#101018");
  ctx.fillStyle = g;
  ctx.fill();

  const ringW = Math.max(3.2, baseR * 0.038);
  ctx.beginPath();
  ctx.arc(wx, wy, rOuter * 0.9, 0, TAU);
  ctx.strokeStyle = color;
  ctx.lineWidth = ringW;
  ctx.lineJoin = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(wx, wy, rOuter * 0.82, 0, TAU);
  ctx.strokeStyle = lightenHex(color, 65);
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.55;
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.arc(wx, wy, rOuter * 0.68, 0, TAU);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function weightOutlineCenters(shape, disks) {
  const n = shape.segments;
  if (shape.id === "K") {
    const d = 0.39;
    return [
      { x: -d, y: 0, r: 0.125 },
      { x: 0, y: 0, r: 0.13 },
      { x: d, y: 0, r: 0.125 },
    ];
  }
  if (shape.id === "H") {
    return [
      { x: -0.31, y: 0.075, r: 0.125 },
      { x: 0.31, y: -0.075, r: 0.125 },
    ];
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * TAU) / n;
    let best = null;
    let bestLen = 0;
    for (const d of disks) {
      if (d.cx === 0 && d.cy === 0) continue;
      const ang = Math.atan2(d.cy, d.cx);
      let da = Math.abs(ang - a);
      if (da > Math.PI) da = TAU - da;
      if (da > 0.4) continue;
      const len = Math.hypot(d.cx, d.cy);
      if (len > bestLen) {
        bestLen = len;
        best = d;
      }
    }
    if (best) out.push({ x: best.cx, y: best.cy, r: best.r });
    else {
      const ux = Math.cos(a);
      const uy = Math.sin(a);
      out.push({ x: ux * 0.4, y: uy * 0.4, r: 0.11 });
    }
  }
  return out;
}

function renderWheel() {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const baseR = Math.min(w, h) * 0.44;
  const n = currentShape.segments;
  const disks = currentShape.getDisks();

  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.translate(-cx, -cy);

  ctx.save();
  traceSilhouette(ctx, cx, cy, baseR, disks);
  const bodyG = ctx.createRadialGradient(
    cx - baseR * 0.12,
    cy - baseR * 0.12,
    baseR * 0.05,
    cx,
    cy,
    baseR * 1.05,
  );
  bodyG.addColorStop(0, "#2a2a36");
  bodyG.addColorStop(0.55, "#16161e");
  bodyG.addColorStop(1, "#0c0c12");
  ctx.fillStyle = bodyG;
  ctx.fill();

  traceSilhouette(ctx, cx, cy, baseR, disks);
  ctx.strokeStyle = "rgba(0,245,212,0.22)";
  ctx.lineWidth = 1.75;
  ctx.shadowColor = "rgba(0,245,212,0.35)";
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  const hubR = baseR * 0.12;
  const g = ctx.createRadialGradient(
    cx - hubR * 0.2,
    cy - hubR * 0.2,
    0,
    cx,
    cy,
    hubR * 1.35,
  );
  g.addColorStop(0, "#2e2e3a");
  g.addColorStop(1, "#0a0a10");
  ctx.beginPath();
  ctx.arc(cx, cy, hubR, 0, TAU);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,245,212,0.55)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#00f5d4";
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const wc = weightOutlineCenters(currentShape, disks);
  wc.forEach((p, wi) => {
    const wr = (p.r || 0.11) * baseR;
    const col = colors[wi % n] || "#00f5d4";
    const wx = cx + p.x * baseR;
    const wy = cy + p.y * baseR;
    drawBearingRing(wx, wy, wr, col, baseR);
  });

  ctx.fillStyle = "rgba(230,230,255,0.9)";
  ctx.font = "600 11px Orbitron, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    const mid = -Math.PI / 2 + (i * TAU) / n;
    const labelR = baseR * 0.52;
    let lx = cx + Math.cos(mid) * labelR;
    let ly = cy + Math.sin(mid) * labelR;
    if (wc[i]) {
      lx = cx + wc[i].x * baseR * 0.78;
      ly = cy + wc[i].y * baseR * 0.78;
    }
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(mid + Math.PI / 2);
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 5;
    ctx.fillText(String(i + 1), 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function buildColorRows() {
  colorList.innerHTML = "";
  const n = currentShape.segments;
  ensureColors(n);
  for (let i = 0; i < n; i++) {
    const row = document.createElement("div");
    row.className = "color-row";
    const idx = document.createElement("span");
    idx.className = "idx";
    idx.textContent = `${i + 1}`;
    const input = document.createElement("input");
    input.type = "color";
    input.value = colors[i];
    input.setAttribute("aria-label", `추 ${i + 1} 테두리 색`);
    input.addEventListener("input", () => {
      colors[i] = input.value;
      renderWheel();
    });
    row.appendChild(idx);
    row.appendChild(input);
    colorList.appendChild(row);
  }
}

function populateShapes() {
  SHAPES.forEach((s, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `${s.ref}. ${s.name}`;
    shapeSelect.appendChild(opt);
  });
}

function applyShape(index) {
  currentShape = SHAPES[index];
  shapeHint.textContent = `${currentShape.desc} (참고 시트 ${currentShape.ref})`;
  ensureColors(currentShape.segments);
  buildColorRows();
  renderWheel();
}

function randomNeon() {
  const n = currentShape.segments;
  for (let i = 0; i < n; i++) {
    const hue = Math.random() * 360;
    colors[i] = hslToHex(
      hue,
      0.92 + Math.random() * 0.08,
      0.52 + Math.random() * 0.1,
    );
  }
  buildColorRows();
  renderWheel();
}

function equalSplit() {
  const n = currentShape.segments;
  for (let i = 0; i < n; i++) {
    const hue = (360 / n) * i;
    colors[i] = hslToHex(hue, 0.9, 0.56);
  }
  buildColorRows();
  renderWheel();
}

/** 빠르게 돌다가 마지막에 길게 서서히 멈추는 느낌 (스피너·뽑기용) */
function easeOutExpo(t) {
  if (t >= 1) return 1;
  return 1 - Math.pow(2, -10 * t);
}

function spin() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  resultEl.textContent = "뽑는 중…";

  const n = currentShape.segments;
  const extra = 7 + Math.floor(Math.random() * 6);
  const targetRot = rotation + extra * TAU + Math.random() * TAU;
  const start = rotation;
  const delta = targetRot - start;
  const duration = 5200 + Math.random() * 2200;
  const t0 = performance.now();

  function frame(now) {
    const u = Math.min(1, (now - t0) / duration);
    rotation = start + delta * easeOutExpo(u);
    renderWheel();
    if (u < 1) {
      requestAnimationFrame(frame);
    } else {
      rotation = targetRot;
      renderWheel();
      spinning = false;
      spinBtn.disabled = false;
      const idx = winningIndex(rotation, n);
    }
  }

  requestAnimationFrame(frame);
}

populateShapes();
shapeSelect.addEventListener("change", () => {
  applyShape(Number(shapeSelect.value));
});

document.getElementById("randomColors").addEventListener("click", randomNeon);
document.getElementById("equalSplit").addEventListener("click", equalSplit);
spinBtn.addEventListener("click", spin);

applyShape(0);

window.addEventListener("resize", () => {
  renderWheel();
});

"use strict";
/* Parceriza — site v3. Sem rastreamento, sem cookies, sem armazenamento local. */

const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- cabeçalho e menu ---------- */
const header = $(".site-header");
const onScroll = () => header && header.classList.toggle("scrolled", scrollY > 24);
addEventListener("scroll", onScroll, { passive: true });
onScroll();
const toggle = $(".menu-toggle");
const nav = $("#menu");
if (toggle && nav) {
  const fecha = () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const abre = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(abre));
    nav.classList.toggle("open", abre);
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) fecha(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { fecha(); toggle.focus(); } });
}

/* ---------- entradas ao rolar ---------- */
const io = new IntersectionObserver((itens) => {
  for (const it of itens) if (it.isIntersecting) { it.target.classList.add("in"); io.unobserve(it.target); }
}, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
$$("[data-reveal], [data-in]").forEach((el) => io.observe(el));

/* contadores */
const fmt = new Intl.NumberFormat("pt-BR");
const contIO = new IntersectionObserver((itens) => {
  for (const it of itens) {
    if (!it.isIntersecting) continue;
    contIO.unobserve(it.target);
    const el = it.target, alvo = Number(el.dataset.count), dur = 2200, t0 = performance.now();
    if (reduz) { el.textContent = fmt.format(alvo); continue; }
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt.format(Math.round(alvo * e));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }
}, { threshold: 0.5 });
$$("[data-count]").forEach((el) => contIO.observe(el));

/* "sozinhos." se desfaz em partículas */
for (const el of $$(".dissolve")) {
  const txt = el.textContent;
  el.textContent = "";
  el.setAttribute("aria-label", txt);
  [...txt].forEach((c, i) => {
    const s = document.createElement("span");
    s.textContent = c;
    s.setAttribute("aria-hidden", "true");
    s.style.setProperty("--i", i);
    s.style.setProperty("--dx", ((Math.random() - 0.5) * 320).toFixed(0) + "px");
    s.style.setProperty("--dy", ((Math.random() - 0.85) * 240).toFixed(0) + "px");
    el.append(s);
  });
  new IntersectionObserver((it, o) => { if (it[0].isIntersecting) { el.classList.add("go"); o.disconnect(); } }, { threshold: 0.8 }).observe(el);
}

/* perfis que acendem em sequência */
for (const grupo of $$("[data-cycle]")) {
  const chips = $$(".chip", grupo);
  let i = 0;
  if (!reduz && chips.length) setInterval(() => { chips.forEach((c, k) => c.classList.toggle("on", k === i)); i = (i + 1) % chips.length; }, 900);
}

/* ---------- vídeo de apresentação ---------- */
for (const bloco of $$("[data-video]")) {
  const v = $("video", bloco);
  const som = $(".sound", bloco);
  const caps = $$(".chapters button", bloco.closest("section") || document);
  new IntersectionObserver((it) => {
    if (it[0].isIntersecting) { if (!reduz) v.play().catch(() => {}); } else v.pause();
  }, { threshold: 0.45 }).observe(v);
  som && som.addEventListener("click", () => {
    v.muted = !v.muted;
    som.textContent = v.muted ? "🔇 Ativar som" : "🔊 Som ligado";
    if (!v.muted) v.play().catch(() => {});
  });
  for (const b of caps) b.addEventListener("click", () => { v.currentTime = Number(b.dataset.t); v.play().catch(() => {}); });
  if (caps.length) v.addEventListener("timeupdate", () => {
    let ativo = caps[0];
    for (const b of caps) if (v.currentTime >= Number(b.dataset.t) - 0.05) ativo = b;
    caps.forEach((b) => b.classList.toggle("on", b === ativo));
  });
}

/* ---------- fluxo IA: pulso percorrendo o caminho ---------- */
for (const svg of $$(".flow")) {
  const caminho = $(".draw", svg), pulso = $(".pulse", svg);
  if (!caminho || !pulso || reduz) continue;
  const L = caminho.getTotalLength();
  svg.style.setProperty("--len", L);
  let u = 0;
  const anda = () => { u = (u + 0.0028) % 1; const p = caminho.getPointAtLength(u * L); pulso.setAttribute("cx", p.x); pulso.setAttribute("cy", p.y); requestAnimationFrame(anda); };
  setTimeout(anda, 2600);
}
for (const svg of $$(".flow")) { const c = $(".draw", svg); if (c) svg.style.setProperty("--len", c.getTotalLength()); }

/* ---------- órbita da turma ---------- */
const orbita = $(".orbit");
if (orbita) {
  const itens = $$(".orbit-item", orbita);
  const linhas = $(".orbit-ring svg", orbita);
  const n = itens.length;
  let svg = "";
  itens.forEach((it, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const x = 50 + Math.cos(a) * 41, y = 50 + Math.sin(a) * 41;
    it.style.setProperty("--x", x + "%");
    it.style.setProperty("--y", y + "%");
    svg += `<line x1="50" y1="50" x2="${x}" y2="${y}" vector-effect="non-scaling-stroke"/>`;
    if (!reduz) svg += `<circle class="p" r="0.9"><animateMotion dur="${2.6 + (i % 3) * 0.7}s" repeatCount="indefinite" path="M50 50 L${x} ${y}"/><animate attributeName="opacity" values="0;1;0" dur="${2.6 + (i % 3) * 0.7}s" repeatCount="indefinite"/></circle>`;
  });
  linhas.innerHTML = svg;
  const painel = $(".persona");
  const mostra = (b) => {
    $$(".orbit-item button", orbita).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".kicker", painel).textContent = b.dataset.tema;
    $("h3", painel).textContent = b.dataset.titulo;
    $("p", painel).textContent = b.dataset.texto;
  };
  $$(".orbit-item button", orbita).forEach((b) => { b.addEventListener("click", () => mostra(b)); b.addEventListener("mouseenter", () => mostra(b)); b.addEventListener("focus", () => mostra(b)); });
}

/* ---------- infográfico ponta a ponta: linha desenhada pelo scroll ---------- */
const e2e = $(".e2e");
if (e2e) {
  const barra = $(".e2e-line", e2e);
  const estacoes = $$(".station", e2e);
  const atualiza = () => {
    const r = e2e.getBoundingClientRect();
    const meio = innerHeight * 0.55;
    const p = Math.max(0, Math.min(1, (meio - r.top) / r.height));
    barra.style.setProperty("--p", p.toFixed(4));
    for (const s of estacoes) { const q = s.querySelector(".node").getBoundingClientRect(); s.classList.toggle("lit", q.top + q.height / 2 < meio + 10); }
  };
  addEventListener("scroll", atualiza, { passive: true });
  addEventListener("resize", atualiza);
  atualiza();
}

/* ---------- catálogo ---------- */
const catalogo = $("#catalogo-grid");
if (catalogo) {
  const busca = $("#cat-busca"), filtros = $("#cat-filtros"), mais = $("#cat-mais"), conta = $("#cat-conta");
  let dados = [], cats = {}, cat = "todas", limite = 9;
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const pinta = () => {
    const q = norm(busca.value.trim());
    const lista = dados.filter((s) => (cat === "todas" || s.category === cat) && (!q || norm(s.name + " " + s.description + " " + s.tags).includes(q)));
    catalogo.replaceChildren(...lista.slice(0, limite).map((s) => {
      const a = document.createElement("article");
      const viva = s.status === "available";
      a.className = "sol" + (viva ? " live" : "");
      a.innerHTML = `<div class="meta"><span></span><span class="status ${viva ? "live" : ""}">${viva ? "No ar" : "Buscamos parceiros"}</span></div><h3></h3><p></p>`;
      a.querySelector(".meta span").textContent = cats[s.category] || "";
      a.querySelector("h3").textContent = s.name;
      a.querySelector("p").textContent = s.description;
      return a;
    }));
    conta.textContent = `${lista.length} ${lista.length === 1 ? "frente" : "frentes"}`;
    mais.hidden = lista.length <= limite;
  };
  fetch("content/solutions.json").then((r) => r.json()).then((j) => {
    dados = j.solutions; cats = j.categories;
    const bts = [["todas", "Todas"], ...Object.entries(cats)].map(([k, v]) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "filter"; b.textContent = v; b.setAttribute("aria-pressed", String(k === "todas"));
      b.addEventListener("click", () => { cat = k; limite = 9; $$(".filter", filtros).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); pinta(); });
      return b;
    });
    filtros.replaceChildren(...bts);
    pinta();
  }).catch(() => { conta.textContent = "Catálogo indisponível no momento."; });
  busca.addEventListener("input", () => { limite = 9; pinta(); });
  mais.addEventListener("click", () => { limite += 9; pinta(); });
}

/* ---------- abas e formulários (solicitação por e-mail) ---------- */
function ativaAba(aba, foco = false) {
  const lista = aba.closest('[role="tablist"]');
  for (const it of $$('[role="tab"]', lista)) {
    const sel = it === aba;
    it.setAttribute("aria-selected", String(sel));
    it.tabIndex = sel ? 0 : -1;
    document.getElementById(it.getAttribute("aria-controls")).hidden = !sel;
  }
  if (foco) aba.focus();
  const res = $("#request-result");
  if (res) res.hidden = true;
}
for (const lista of $$('[role="tablist"]')) {
  const abas = $$('[role="tab"]', lista);
  for (const aba of abas) {
    aba.addEventListener("click", () => ativaAba(aba));
    aba.addEventListener("keydown", (e) => {
      let k;
      if (e.key === "ArrowRight") k = (abas.indexOf(aba) + 1) % abas.length;
      if (e.key === "ArrowLeft") k = (abas.indexOf(aba) + abas.length - 1) % abas.length;
      if (k !== undefined) { e.preventDefault(); ativaAba(abas[k], true); }
    });
  }
}
for (const l of $$("[data-form]")) l.addEventListener("click", () => { const t = document.getElementById("form-tab-" + l.dataset.form); if (t) ativaAba(t); });
if (location.hash === "#participar-solucao") { const t = $("#form-tab-parceiro"); if (t) { ativaAba(t); $("#participar").scrollIntoView(); } }
const abrePriv = () => { const d = $("#privacidade"); if (d && location.hash === "#privacidade") d.open = true; };
addEventListener("hashchange", abrePriv);
abrePriv();

const destino = "gustavo.pacher@preddita.com";
let preparada = "";
for (const form of $$("form[data-kind]")) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    for (const f of $$('input[required]:not([type="checkbox"]), textarea[required]', form)) f.setCustomValidity(f.value.trim() ? "" : "Preencha este campo.");
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const v = (n) => String(d.get(n) || "").trim();
    const adv = form.dataset.kind === "advogado";
    const assunto = adv ? "Parceriza — quero parcerizar (advogado)" : "Parceriza — apresentação de solução parceira";
    const linhas = adv
      ? ["Olá, equipe Parceriza!", "", "Quero participar da rede de advogados parceiros.", "", "Nome: " + v("nome"), "E-mail: " + v("email"), "OAB: " + v("oab") + "/" + v("uf"), "Como prefiro atuar: " + (v("atuacao") || "Ainda não sei")]
      : ["Olá, equipe Parceriza!", "", "Gostaria de apresentar uma solução para avaliação de parceria.", "", "Empresa / solução: " + v("empresa"), "E-mail: " + v("email"), "Site: " + (v("site") || "Não informado"), "", "Apresentação:", v("descricao")];
    linhas.push("", "Estou ciente do uso destas informações para avaliar minha solicitação e retornar o contato.", "", "Solicitação preparada em parceriza.com.br.");
    preparada = "Para: " + destino + "\nAssunto: " + assunto + "\n\n" + linhas.join("\n");
    $("#email-request").href = "mailto:" + destino + "?subject=" + encodeURIComponent(assunto) + "&body=" + encodeURIComponent(linhas.join("\r\n"));
    $("#request-text").value = preparada;
    $("#copy-status").textContent = "";
    const res = $("#request-result");
    res.hidden = false;
    res.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "nearest" });
  });
  form.addEventListener("input", (e) => { if (e.target.setCustomValidity) e.target.setCustomValidity(""); $("#request-result").hidden = true; });
}
const copia = $("#copy-request");
copia && copia.addEventListener("click", async () => {
  const st = $("#copy-status");
  try { await navigator.clipboard.writeText(preparada); st.textContent = " Mensagem copiada."; }
  catch { const f = $("#request-text"); f.focus(); f.select(); st.textContent = " Selecione e copie o texto acima."; }
});

/* =====================================================================
   Orbes de luz em canvas.
   modo "logo": uma galáxia de 2.200 pontos se organiza no símbolo P (o fecho do reel).
   modo "rede": orbes à deriva que se conectam e trocam pulsos (a rede em formação).
   ===================================================================== */
const CORES = [[20, 175, 177], [143, 234, 224], [232, 243, 246]];
function sprite(rgb, tam = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = tam;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(tam / 2, tam / 2, 0, tam / 2, tam / 2, tam / 2);
  grd.addColorStop(0, `rgba(255,255,255,1)`);
  grd.addColorStop(0.18, `rgba(${rgb},0.95)`);
  grd.addColorStop(0.45, `rgba(${rgb},0.28)`);
  grd.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grd;
  g.fillRect(0, 0, tam, tam);
  return c;
}
const SPR = CORES.map((c) => sprite(c.join(",")));

function iniciaCanvas(cv) {
  const ctx = cv.getContext("2d");
  const modo = cv.dataset.rede || "rede";
  let W = 0, H = 0, dpr = 1, vivo = true, t0 = performance.now();
  const mouse = { x: -9999, y: -9999 };
  let pts = [], logo = null;

  const mede = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (logo) monta();
  };

  function monta() {
    // onde o P vive: à direita no desktop, centralizado (atrás do texto) no celular
    const largo = W > 900;
    const escala = Math.min(H * (largo ? 0.105 : 0.075), W * (largo ? 0.085 : 0.16));
    const cx = largo ? W * 0.72 : W * 0.5, cy = largo ? H * 0.5 : H * 0.36;
    pts = [];
    const n = logo.length / 3;
    const passo = W < 600 ? 2 : 1; // metade dos pontos no celular
    for (let i = 0; i < n; i += passo) {
      const r = 0.6 + Math.pow(Math.random(), 0.75) * 9, ang = (i % 3) * 2.094 + r * 0.55 + (Math.random() - 0.5) * 0.9;
      pts.push({
        gx: cx + Math.cos(ang) * r * escala * 0.9, gy: cy + Math.sin(ang) * r * escala * 0.45,
        lx: cx + logo[i * 3] * escala, ly: cy - logo[i * 3 + 1] * escala,
        t: logo[i * 3 + 2], c: Math.random(), d: Math.random(), ph: Math.random() * 6.28,
        s: 2.2 + Math.random() * 3.2, x: 0, y: 0, vx: 0, vy: 0,
      });
    }
    for (const p of pts) { p.x = p.gx; p.y = p.gy; }
  }

  function montaRede() {
    const n = Math.round(Math.min(90, (W * H) / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, s: 3 + Math.random() * 7, c: Math.random(), ph: Math.random() * 6.28 }));
  }
  const pulsos = [];

  function quadroLogo(t) {
    const k = reduz ? 1 : Math.min(1, Math.max(0, (t - 600) / 2600));
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    ctx.globalCompositeOperation = "lighter";
    for (const p of pts) {
      const kk = Math.min(1, Math.max(0, (e - p.d * 0.25) / 0.75));
      const giro = (1 - kk) * t * 0.00012;
      const dx = p.gx - (W > 900 ? W * 0.72 : W * 0.5), dy = p.gy - (W > 900 ? H * 0.5 : H * 0.36);
      const gx = (W > 900 ? W * 0.72 : W * 0.5) + dx * Math.cos(giro) - dy * Math.sin(giro);
      const gy = (W > 900 ? H * 0.5 : H * 0.36) + dx * Math.sin(giro) + dy * Math.cos(giro);
      let tx = gx + (p.lx - gx) * kk + Math.sin(t * 0.0012 + p.ph) * 1.6 * kk;
      let ty = gy + (p.ly - gy) * kk + Math.cos(t * 0.0011 + p.ph) * 1.6 * kk;
      // o cursor afasta os pontos e eles voltam ao lugar
      const mx = tx - mouse.x, my = ty - mouse.y, d2 = mx * mx + my * my;
      if (d2 < 9000) { const f = (1 - d2 / 9000) * 34; const d = Math.sqrt(d2) || 1; p.vx += (mx / d) * f * 0.08; p.vy += (my / d) * f * 0.08; }
      p.vx *= 0.86; p.vy *= 0.86;
      if (reduz) { p.x = tx; p.y = ty; } else { p.x += (tx - p.x) * 0.16 + p.vx; p.y += (ty - p.y) * 0.16 + p.vy; }
      const spr = kk > 0.6 ? (p.t ? SPR[0] : SPR[2]) : SPR[p.c < 0.45 ? 0 : p.c < 0.7 ? 1 : 2];
      const tam = p.s * (1.2 + 0.25 * Math.sin(t * 0.002 + p.ph)) * 2.4;
      ctx.globalAlpha = 0.55 + 0.45 * kk;
      ctx.drawImage(spr, p.x - tam / 2, p.y - tam / 2, tam, tam);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function quadroRede(t) {
    const lim = Math.min(170, W * 0.16);
    ctx.lineWidth = 1;
    for (const p of pts) {
      if (!reduz) { p.x += p.vx; p.y += p.vy; }
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
      if (d < lim) {
        ctx.strokeStyle = `rgba(20,175,177,${(1 - d / lim) * 0.45})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (!reduz && Math.random() < 0.0009) pulsos.push({ a, b, u: 0 });
      }
    }
    ctx.globalCompositeOperation = "lighter";
    for (let k = pulsos.length - 1; k >= 0; k--) {
      const q = pulsos[k]; q.u += 0.012;
      if (q.u >= 1) { pulsos.splice(k, 1); continue; }
      const x = q.a.x + (q.b.x - q.a.x) * q.u, y = q.a.y + (q.b.y - q.a.y) * q.u;
      ctx.globalAlpha = Math.sin(Math.PI * q.u);
      ctx.drawImage(SPR[1], x - 9, y - 9, 18, 18);
    }
    for (const p of pts) {
      const tam = p.s * 3.2 * (1 + 0.15 * Math.sin(t * 0.0018 + p.ph));
      ctx.globalAlpha = 0.85;
      ctx.drawImage(SPR[p.c < 0.5 ? 0 : p.c < 0.8 ? 1 : 2], p.x - tam / 2, p.y - tam / 2, tam, tam);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function laco(agora) {
    if (!vivo) return;
    ctx.clearRect(0, 0, W, H);
    const t = agora - t0;
    if (modo === "logo") { if (logo) quadroLogo(t); } else quadroRede(t);
    if (!reduz || (modo === "logo" && !logo)) requestAnimationFrame(laco);
  }

  addEventListener("resize", () => { mede(); if (modo !== "logo") montaRede(); });
  const alvo = cv.parentElement;
  alvo.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  alvo.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  new IntersectionObserver((it) => {
    const era = vivo; vivo = it[0].isIntersecting;
    if (vivo && !era) requestAnimationFrame(laco);
  }).observe(cv);

  mede();
  if (modo === "logo") {
    fetch("assets/logo-pontos.json").then((r) => r.json()).then((j) => { logo = j; monta(); t0 = performance.now(); if (reduz) requestAnimationFrame(laco); });
  } else montaRede();
  requestAnimationFrame(laco);
}
$$("canvas[data-rede]").forEach(iniciaCanvas);

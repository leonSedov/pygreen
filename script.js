// Número do WhatsApp da PyGreen (55 + DDD + número). Ex.: "5584999999999"
const WHATSAPP = "";
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Menu no celular
const burger = document.querySelector(".burger"), menu = document.querySelector(".menu");
if (burger && menu) {
  const fecharMenu = () => {
    menu.classList.remove("aberto");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
  };
  burger.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    burger.setAttribute("aria-expanded", String(aberto));
    burger.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", fecharMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") fecharMenu();
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".topo")) fecharMenu();
  });
  addEventListener("resize", () => {
    if (innerWidth > 860) fecharMenu();
  });
}

// Editor que digita código (início)
const cod = document.getElementById("codigo"), saida = document.getElementById("saida");
if (cod) {
  const html = '<span class="c"># o próximo curso é perto de você</span>\n<span class="k">cidade</span> = <span class="s">"Ceará-Mirim"</span>\n<span class="k">print</span>(<span class="s">"Olá,"</span>, cidade + <span class="s">"!"</span>)\n<span class="k">print</span>(<span class="s">"PyGreen chegando..."</span>)';
  const texto = html.replace(/<[^>]+>/g, "");
  const mostrar = n => { let c = 0; cod.innerHTML = html.replace(/<[^>]+>|[^<]/g, m => m[0] === "<" ? m : (c++ < n ? m : "")); };
  const fim = () => { saida.textContent = "Olá, Ceará-Mirim !\nPyGreen chegando..."; cod.classList.remove("cursor"); };
  if (reduz) { mostrar(texto.length); fim(); }
  else { let n = 0; cod.classList.add("cursor"); (function t() { mostrar(++n); n < texto.length ? setTimeout(t, 45) : setTimeout(fim, 400); })(); }
}

// Barra de carregamento (Ceará-Mirim)
const carga = document.querySelector(".carga");
if (carga) {
  for (let i = 0; i < 20; i++) carga.appendChild(document.createElement("b"));
  const bs = [...carga.children];
  new IntersectionObserver((e, o) => { if (!e[0].isIntersecting) return; o.disconnect();
    bs.forEach((b, i) => i < 15 && setTimeout(() => b.classList.add("on"), reduz ? 0 : i * 110)); }, { threshold: .5 }).observe(carga);
}

// Formulário
const form = document.getElementById("aviso-form");
if (form) form.addEventListener("submit", e => {
  e.preventDefault();
  const nome = form.nome.value.trim(), contato = form.contato.value.trim(), av = document.getElementById("aviso");
  if (!nome || !contato) return void (av.textContent = "Preencha seu nome e WhatsApp.");
  if (!WHATSAPP) { av.textContent = "Obrigado, " + nome + "! Entraremos em contato."; return form.reset(); }
  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(`Olá! Sou ${nome} (${contato}). Quero ser avisado sobre os cursos da PyGreen em Ceará-Mirim.`), "_blank");
  av.textContent = "Abrindo o WhatsApp...";
});

// A cobra da PyGreen percorre a página conforme você rola
(function cobra() {
  const main = document.querySelector("main");
  const NS = "http://www.w3.org/2000/svg";
  const box = document.createElement("div"); box.className = "trilha"; box.setAttribute("aria-hidden", "true");
  box.innerHTML = `<svg><path id="c-b" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round"/><path id="c-v" fill="none" stroke="#50ba4c" stroke-width="13" stroke-linecap="round"/>
  <g id="c-h"><rect x="-17" y="-14" width="34" height="28" rx="8" fill="#50ba4c" stroke="#fff" stroke-width="4"/><circle cx="-6" cy="-1" r="2.6" fill="#fff"/><circle cx="6" cy="-1" r="2.6" fill="#fff"/></g></svg>`;
  main.prepend(box);
  const pb = box.querySelector("#c-b"), pv = box.querySelector("#c-v"), hd = box.querySelector("#c-h");
  let L = 0;
  function montar() {
    const W = main.clientWidth, secs = [...main.querySelectorAll(":scope > section")];
    const gut = (W - 1080) / 2, largo = gut >= 70;
    const pq = W < 860, xa = largo ? gut * .32 : pq ? 7 : 14, xb = largo ? gut - 34 : xa;
    const pts = secs.map((s, i) => [i % 2 ? xb : xa, s.offsetTop + s.offsetHeight / 2]);
    pts[0] = [xa, 40];
    let d = `M${xa} -20 L${xa} 40`;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1], [x2, y2] = pts[i], m = (y1 + y2) / 2;
      d += ` C${x1} ${m} ${x2} ${m} ${x2} ${y2}`;
    }
    const f = pts[pts.length - 1]; d += ` L${f[0]} ${f[1] + 200}`;
    pb.setAttribute("d", d); pv.setAttribute("d", d);
    L = pv.getTotalLength(); pb.style.strokeDasharray = pv.style.strokeDasharray = L; atualizar();
  }
  function atualizar() {
    const topo = main.getBoundingClientRect().top;
    const p = reduz ? 1 : Math.max(0, Math.min(1, (innerHeight * .6 - topo) / main.offsetHeight));
    const len = Math.max(1, p * L);
    pb.style.strokeDashoffset = pv.style.strokeDashoffset = L - len;
    const a = pv.getPointAtLength(len), b = pv.getPointAtLength(Math.max(0, len - 4));
    const ang = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI - 90;
    hd.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang})`);
  }
  addEventListener("scroll", atualizar, { passive: true });
  addEventListener("resize", montar);
  new ResizeObserver(montar).observe(main);
  document.fonts && document.fonts.ready.then(montar);
  montar();
})();

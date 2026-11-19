
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- DATA ---------------- */
const projects = [
  {
    n:'01', name:"Moriyama's House", meta:'Casa unifamiliar — 2023', cat:'Residencial',
    img:'assets/asset-01.jpg',
    conceito:'Ambiente de introspecção, elegância, conexão e desconstrução.',
    partido:'Casa com ambientes separados, desconstruídos, porém conectados pela simetria e espelhamento. Uso de concreto, aberturas para passagem de luz e ventilação, e como forma de privacidade: ambientes amplos com áreas centrais e jardins de inverno.',
    extra:'Partiu da ideia da Moriyama\'s House — ambientes totalmente separados, em blocos distantes entre si, conectados apenas pelo banheiro. Foram incorporadas as necessidades dos clientes: loft, integração com a natureza, jardins de inverno e uso de luz e ventilação natural durante todo o dia.'
  },
  {
    n:'02', name:'Capela Ecumênica', meta:'Capela — 2022', cat:'Institucional',
    img:'assets/asset-02.jpg',
    conceito:'Complexidade, força e comunidade.',
    partido:'Inspirado na vitória-régia, cuja flor só abre à noite. Formas complexas como o hexágono, escadas em espiral, estruturas de concreto armado e ferro, e a distribuição de capelas e praças reforçam o senso de comunidade.',
    extra:'A capela se sobrepõe à parte administrativa; à noite, uma grande iluminação evoca a abertura noturna da flor. Aberturas do pavimento superior até o térreo deixam a água cair suavemente, representando a raiz profunda da planta.'
  },
  {
    n:'03', name:'Albergue para Pessoas em Situação de Rua', shortName:'Albergue', meta:'Equipamento social — 2023', cat:'Institucional',
    img:'assets/asset-03.jpg',
    conceito:'Amplitude, aconchego e profissionalismo.',
    partido:'Uso de madeira e tijolos aparentes, luzes amareladas nos locais de permanência, pé-direito duplo, pequenas praças internas, brises e aberturas para ventilação — espaços funcionais, acolhedores e bem ventilados.',
    extra:'Partindo da ideia de uma "casa de música" — um lugar de amplitude, aconchego e senso de comunidade — o projeto busca gerar profissionalismo sem abrir mão do acolhimento.'
  },
  {
    n:'04', name:'Escritório Independente', shortName:'Escritório', meta:'Escritório + mobiliário autoral — 2024', cat:'Comercial',
    video:'assets/asset-04.mp4', poster:'assets/asset-05.jpg',
    img:'assets/asset-06.jpg',
    conceito:'Flutuação, anatomia e contraste de materiais.',
    partido:'Projeto de escritório modelado integralmente, acompanhado do desenho de quatro peças de mobiliário autorais: mesa, cadeira, luminária de piso e luminária de mesa — cada uma com um conceito narrativo próprio.',
    extra:'O espaço foi pensado como suporte para peças que desafiam convenções — estrutura, anatomia e material tratados como narrativa, não apenas função.',
    furniture:[
      {name:'A Mesa — Uma Experiência de Flutuação', img:'assets/asset-07.jpg', desc:'O tampo toca apenas os apoios das extremidades e uma pirâmide central, evitando contato com os gaveteiros — rompendo a estrutura linear tradicional com linhas diagonais.'},
      {name:'A Cadeira — Homenagem ao Corpo Humano', img:'assets/asset-08.jpg', desc:'Inspirada na caixa torácica e na coluna vertebral: os "ossos" abraçam o assento como costelas em torno de um pulmão, sustentando o encosto até o topo.'},
      {name:'A Luminária — Leveza e Brutalismo', img:'assets/asset-09.jpg', desc:'Topo em papel e madeira, evocando o design oriental; base em mármore esculpido, contrastando leveza com um toque brutalista.'},
      {name:'Luminária de Mesa — Toque Mitológico', img:'assets/asset-10.jpg', desc:'Esboços inspirados no Cthulhu de H.P. Lovecraft — tentáculos que parecem se mover ao redor de um núcleo de cristal esculpido.'}
    ]
  },
  {
    n:'05', name:'Praça da Lembrança', shortName:'Praça', meta:'Espaço público — 2024', cat:'Urbanismo',
    img:'assets/asset-11.jpg',
    conceito:'Biofilia, refúgio e nostalgia da orla.',
    partido:'Grama e flores espalhadas, água no balizamento e mobiliário fluido em materiais naturais. Pequenos recantos alinhados à escala humana criam refúgios de aconchego, enquanto a pedra portuguesa da orla resgata a memória urbana de Cabedelo.',
    extra:'A cafeteria usa pedra portuguesa no piso para evocar a orla, modernizando o padrão tradicional sem perder a essência histórica — equilibrando memória afetiva e contemporaneidade.'
  },
];

/* ----------------------------------------------------------------------
   LANDING "STAGE" -- mecanismo real do vanholtz.co, conforme o PRD v2
   (extraido do app.js/app.css de producao, nao mais da reconstrucao de
   terceiros usada antes). Resumo do que mudou:
     - Um bloco unico (.stage) translada verticalmente via lerp 0.05 --
       nao ha rotacao individual continua calculada pela distancia ao
       centro de cada item.
     - Cada item tem so 3 estados discretos de rotateY: repouso -45deg,
       hover -35deg, selecionado 0deg (tudo via transicao CSS).
     - fill->outline e hover puro (:hover / isHovered), nunca funcao da
       posicao de scroll.
     - Ano e traco diagonal sao pseudo-elementos (::before com data-info,
       ::after fixo em 25deg), nao elementos DOM separados.
     - Sem parallax de mouse em lugar nenhum (nao existe no mecanismo real).
---------------------------------------------------------------------- */
const landingEl = document.getElementById('landing');
const stagePerspective = document.getElementById('stagePerspective');
const stageContainer = document.getElementById('stageContainer');
const stage = document.getElementById('stage');
const projectsList = document.getElementById('projectsList');

const yearTagEntries = [];
projects.forEach((p, i)=>{
  const year = p.meta.match(/\d{4}/)?.[0] || '';
  const li = document.createElement('li');
  li.className = 'projectsLi';
  // delay decrescente por item, igual ao site real: primeiro item = maior delay,
  // entra por ultimo; os seguintes entram cada vez mais cedo.
  const delay = Math.max(0.9 - i * 0.1, 0.1);
  li.style.setProperty('--stagger-delay', delay + 's');

  const container = document.createElement('div');
  container.className = 'projectContainer';

  // O rotateY 3D no .projectContainer faz o clique real (mouse) "acertar" outra
  // linha da lista, não o texto visualmente clicado -- elementFromPoint confirma
  // que, perto da borda de cada linha, quem recebe o clique é o <li> vizinho, não
  // o <li> certo (a caixa 2D achatada de cada linha não bate com a posição visual
  // do texto girado em 3D). Por isso o <a> vira só decoração (aria-hidden,
  // pointer-events:none via CSS) e um <button> achatado -- sem transform 3D nenhum,
  // ocupando exatamente a caixa "flat" do <li> -- é quem recebe o clique de verdade.
  const a = document.createElement('a');
  a.href = '#proj-' + p.n;
  a.textContent = p.shortName || p.name;
  a.setAttribute('tabindex', '-1');
  a.setAttribute('aria-hidden', 'true');

  // ano + traço: elemento plano à parte (ver comentário no CSS), não pseudo-elemento do <a>
  const yearTag = document.createElement('div');
  yearTag.className = 'year-tag';
  yearTag.setAttribute('aria-hidden', 'true');
  yearTag.innerHTML = `<span class="tick"></span><span class="year">${year}</span>`;

  const catcher = document.createElement('button');
  catcher.type = 'button';
  catcher.className = 'click-catcher';
  catcher.setAttribute('aria-label', `Ver projeto ${p.n}: ${p.name}`);
  catcher.addEventListener('click', ()=>{ selectLandingProject(li, '#proj-' + p.n); });

  container.appendChild(a);
  li.appendChild(container);
  li.appendChild(yearTag);
  li.appendChild(catcher);
  projectsList.appendChild(li);

  yearTagEntries.push({ li, a, yearTag });

  li.addEventListener('mouseenter', ()=>{ projectsList.classList.add('isHovering'); li.classList.add('isHovered'); });
  li.addEventListener('mouseleave', ()=>{ projectsList.classList.remove('isHovering'); li.classList.remove('isHovered'); });
});

// Posiciona cada data colada à palavra dela (nao numa coluna fixa). Roda em rAF continuo
// (nao um setTimeout unico) para: (1) nunca ficar invisivel para sempre se a 1a medicao
// falhar (a cada frame tenta de novo ate aRect ter tamanho valido); (2) acompanhar o
// rotateY do projectContainer mudando no hover e o scroll/lerp da .stage, que movem a
// palavra a cada frame. Enquanto a medicao ainda nao rendeu nada com largura > 0, o
// elemento fica na posicao de fallback definida no CSS (coluna fixa a esquerda), entao
// a data nunca some -- so refina a posicao quando ha algo real para medir.
const yearTagRange = document.createRange();
function measureYearTags(){
  // Abaixo de 420px o CSS já joga a data pra um fallback empilhado, relativo
  // (@media max-width:420px .year-tag{position:relative;...}), porque não sobra
  // espaço à esquerda da palavra pra colar a data sem cortar. Style inline
  // sempre vence CSS de media query, então media medir/posicionar aqui embaixo
  // desse limite anulava esse fallback e jogava a data pra fora da tela. Por
  // isso: em tela estreita nem mede, nem seta left/top/transform -- deixa o CSS
  // cuidar sozinho.
  if(window.innerWidth <= 420){
    // limpa qualquer inline style que tenha sobrado de uma medição anterior (ex.:
    // a janela foi redimensionada de largo pra estreito) -- sem isso o CSS do
    // fallback empilhado não consegue assumir, já que style inline sempre vence.
    yearTagEntries.forEach(({ yearTag })=>{
      yearTag.classList.remove('is-measured');
      yearTag.style.left = ''; yearTag.style.top = ''; yearTag.style.transform = '';
    });
    return;
  }
  yearTagEntries.forEach(({ li, a, yearTag })=>{
    // a.getClientRects() no <a> (display:block) devolve so a caixa inteira do
    // bloco, nao uma por linha -- titulos em portugues quebram em 2 linhas e isso
    // jogava a data pro meio das 2 linhas em vez de colada na 1a. Um Range sobre o
    // texto continua devolvendo um retangulo por linha mesmo dentro de um bloco,
    // entao pega-se so a 1a linha visual dali.
    const textNode = a.firstChild;
    if(!textNode) return;
    yearTagRange.selectNodeContents(textNode);
    const lineRects = yearTagRange.getClientRects();
    const aRect = lineRects.length ? lineRects[0] : a.getBoundingClientRect();
    if(aRect.width === 0 || aRect.height === 0) return;
    const liRect = li.getBoundingClientRect();
    const tagRect = yearTag.getBoundingClientRect();
    const left = Math.round((aRect.left - liRect.left) - tagRect.width - 14);
    const top = Math.round((aRect.top - liRect.top) + (aRect.height / 2) - (tagRect.height / 2));
    yearTag.style.left = left + 'px';
    yearTag.style.top = top + 'px';
    yearTag.style.transform = 'none';
    yearTag.classList.add('is-measured');
  });
}

const isMobileLanding = window.innerWidth < 768;
if(isMobileLanding) landingEl.classList.add('isMobile');

let stageScrollHeight = 0, stageScrollPercent = 0, stagePosition = 0;
function lerp(a, b, t){ return (1 - t) * a + t * b; }

function resizeStage(){
  stageScrollHeight = stage.offsetHeight;
  stageContainer.style.height = stageScrollHeight + 'px';
}

function loopStage(){
  stagePosition = lerp(stagePosition, stageScrollPercent, 0.05);
  stagePosition = Math.floor(stagePosition * 1e4) / 1e4;
  stage.style.transform = `translate3d(0, ${stagePosition}px, 0)`;
  measureYearTags();
  requestAnimationFrame(loopStage);
}

function onStageScroll(){
  stageScrollPercent = -stagePerspective.scrollTop;
}

// loop dedicado so pra medir as datas, usado quando o loop de scroll acima nao
// roda (reduced-motion / mobile) -- assim a data ainda acompanha resize, troca
// de orientacao e o layout assentando (fontes, etc.), sem depender de um
// timeout fixo que pode disparar cedo demais.
function loopYearTagsOnly(){
  measureYearTags();
  requestAnimationFrame(loopYearTagsOnly);
}

if(reduceMotion){
  landingEl.classList.add('reduced-motion');
  loopYearTagsOnly();
} else if(!isMobileLanding){
  resizeStage();
  loopStage();
  window.addEventListener('resize', resizeStage);
  stagePerspective.addEventListener('scroll', onStageScroll, {passive:true});
} else {
  loopYearTagsOnly();
}

// clique num projeto: dispara a saida (outro) igual ao site real -- o item
// clicado achata e encolhe, os outros giram ainda mais pra longe e somem --
// so depois disso entra no site, na secao do projeto escolhido.
function selectLandingProject(li, target){
  if(landingEl.classList.contains('outro')) return;
  li.classList.add('isSelected');
  landingEl.classList.add('outro');
  const delay = reduceMotion ? 0 : 2200;
  setTimeout(()=>{
    landingEl.classList.remove('outro');
    li.classList.remove('isSelected');
    enterSite(target);
  }, delay);
}

// fim do intro (mesmo timing do site real: ~2.9s, 0 se reduced-motion)
setTimeout(()=>{ landingEl.classList.remove('intro'); }, reduceMotion ? 0 : 2900);

gsap.from('.landing-mast > *',{opacity:0,y:16,duration:.8,ease:'power2.out',stagger:.06,delay:.5});

/* ----------------------------------------------------------------------
   LANDING COMO GATE — o resto do site (#mainSite) só fica acessível
   depois de uma ação explícita (cue ou clique num projeto), nunca por
   scroll contínuo.

   Por que isso já resolve o "vazamento" sem precisar interceptar scroll:
   #mainSite começa com display:none, e o scroll da landing agora vive
   inteiramente dentro de #stagePerspective (overflow-y:auto, 100vh) —
   não é mais o scroll do documento. Não tem como "vazar" pro resto do
   site rolando, porque a página em si nunca rola enquanto não se entra.
---------------------------------------------------------------------- */
const landingCue = document.getElementById('landingCue');
const gateTransition = document.getElementById('gate-transition');
const mainSite = document.getElementById('mainSite');
let gateReady = false;
let gateEntered = false;

// deep-link: se a página carregou com #work/#about/#contato etc, guarda o alvo
// e limpa o hash da URL — não deixa o navegador pular direto ignorando o gate.
let pendingHash = null;
if(location.hash){
  pendingHash = location.hash;
  history.replaceState(null, '', location.pathname + location.search);
}

function updateGateCue(){
  // o botão agora funciona a qualquer momento (não precisa mais rolar até o
  // fim da roda) — isso só mantém o estado visual "pronto" sempre ligado.
  if(!landingCue.classList.contains('is-ready')){
    landingCue.classList.add('is-ready');
    landingCue.setAttribute('aria-label', 'Entrar no site');
  }
}
window.addEventListener('scroll', updateGateCue, {passive:true});

function enterSite(targetSelector){
  if(gateEntered) return;
  gateEntered = true;

  const finish = ()=>{
    document.body.classList.add('entered');
    mainSite.removeAttribute('aria-hidden');
    playHeroIntro();
    // sem isso o ScrollTrigger mediu tudo com #mainSite em display:none —
    // as posições de todas as seções precisam ser recalculadas agora que
    // o conteúdo existe de verdade no layout.
    ScrollTrigger.refresh();
    const sel = targetSelector || pendingHash;
    const target = sel ? document.querySelector(sel) : null;
    if(target){
      target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    } else {
      window.scrollTo(0, 0); // topo do mainSite = topo do documento a partir daqui
    }
  };

  if(reduceMotion){
    finish();
  } else {
    gsap.timeline()
      .to(gateTransition, {opacity:1, duration:.35, ease:'power2.inOut', pointerEvents:'auto'})
      .call(finish)
      .to(gateTransition, {opacity:0, duration:.4, ease:'power2.out', pointerEvents:'none'});
  }
}

landingCue.addEventListener('click', ()=>enterSite());

function goToLanding(){
  if(!gateEntered) return;
  // esconde qualquer UI flutuante que só faz sentido dentro do #mainSite -- sem isso,
  // o preview de hover de um work-row (ou o painel de temas) ficava "grudado" na tela,
  // sobrepondo a landing, porque nada os escondia ao sair do site.
  hidePreview();
  if(typeof panelOpen !== 'undefined' && panelOpen) closePanel();
  const finish = ()=>{
    document.body.classList.remove('entered');
    mainSite.setAttribute('aria-hidden', 'true');
    gateEntered = false;
    window.scrollTo(0, 0);
  };
  if(reduceMotion){
    finish();
  } else {
    gsap.timeline()
      .to(gateTransition, {opacity:1, duration:.35, ease:'power2.inOut', pointerEvents:'auto'})
      .call(finish)
      .to(gateTransition, {opacity:0, duration:.4, ease:'power2.out', pointerEvents:'none'});
  }
}
const navMark = document.getElementById('navMark');
navMark.addEventListener('click', goToLanding);
navMark.addEventListener('keydown', e=>{
  if(e.key==='Enter' || e.key===' '){ e.preventDefault(); goToLanding(); }
});
landingCue.addEventListener('keydown', e=>{
  if(e.key==='Enter' || e.key===' '){ e.preventDefault(); enterSite(); }
});

updateGateCue(); // caso a página já carregue com scroll restaurado pelo navegador

/* ---------------- WORK LIST ---------------- */
const list = document.getElementById('workList');
projects.forEach((p,i)=>{
  const row = document.createElement('div');
  row.className = 'work-row';
  row.dataset.img = p.img;
  row.setAttribute('role', 'button');
  row.setAttribute('tabindex', '0');
  row.setAttribute('aria-label', `Ver projeto ${p.n}: ${p.name}`);
  row.innerHTML = `<span class="n mono">${p.n}</span><h3 class="display">${p.name}</h3><span class="meta mono">${p.meta}</span>`;
  const goToProject = ()=>{ smoothScrollTo(document.getElementById('proj-'+p.n)); };
  row.addEventListener('click', goToProject);
  row.addEventListener('keydown', e=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); goToProject(); }
  });
  list.appendChild(row);
});

/* ---------------- PROJECT DETAIL SECTIONS ---------------- */
const details = document.getElementById('projectDetails');
projects.forEach(p=>{
  const sec = document.createElement('section');
  sec.className = 'project';
  sec.id = 'proj-'+p.n;
  let furnitureHtml = '';
  if(p.furniture){
    furnitureHtml = `<div class="furniture-grid">` + p.furniture.map(f=>`
      <div class="f-item reveal">
        <img src="${f.img}" alt="${f.name}">
        <div class="fname display">${f.name}</div>
        <div class="fdesc">${f.desc}</div>
      </div>`).join('') + `</div>`;
  }
  // hero do projeto: quando existe vídeo, ele substitui a imagem estática direto ali
  // (em vez de repetir o mesmo clipe duas vezes na página, numa seção separada mais abaixo).
  const mediaHtml = p.video
    ? `<div class="project-media reveal-media">
        <video data-scroll-video src="${p.video}" poster="${p.img}" muted loop playsinline preload="metadata"></video>
        <button class="v-mute" data-v-mute title="Ativar/desativar som">🔇</button>
      </div>`
    : `<div class="project-media reveal-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>`;
  sec.innerHTML = `
    ${mediaHtml}
    <div class="project-tag">
      <span>${p.n} / ${String(projects.length).padStart(2,'0')}</span>
      <span class="cat">${p.cat} — ${p.meta.split('—')[1]?.trim()||''}</span>
    </div>
    <h3 class="title display">${p.name}</h3>
    <div class="callouts">
      <div class="callout reveal"><div class="k">Conceito</div><p>${p.conceito}</p></div>
      <div class="callout reveal"><div class="k">Partido</div><p>${p.partido}</p></div>
    </div>
    <div class="callout reveal" style="max-width:900px;margin-top:10px;"><p>${p.extra}</p></div>
    ${furnitureHtml}
  `;
  details.appendChild(sec);
});

/* ---------------- MARQUEE ---------------- */
const words = ['GÓTICO','RENDERIZAÇÃO 3D','MOBILIÁRIO AUTORAL','UNREAL ENGINE 5','ARQUITETURA COMO ARTE'];
const mq = document.getElementById('mqTrack');
for(let r=0;r<2;r++){
  words.forEach(w=>{ mq.innerHTML += `<span>${w} <b>—</b></span>`; });
}

/* ---------------- CURSOR ---------------- */
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
const qx = gsap.quickTo(cursor,'x',{duration:.12,ease:'power2.out'});
const qy = gsap.quickTo(cursor,'y',{duration:.12,ease:'power2.out'});
const rqx = gsap.quickTo(ring,'x',{duration:.28,ease:'power2.out'});
const rqy = gsap.quickTo(ring,'y',{duration:.28,ease:'power2.out'});
window.addEventListener('mousemove', e=>{
  qx(e.clientX); qy(e.clientY); rqx(e.clientX); rqy(e.clientY);
});
/* Delegação (não uma lista fixa de elementos) -- assim TUDO que for clicável já
   nasce coberto, incluindo o que é criado depois deste ponto no carregamento
   (work-row, os botões dos projetos do gate, as opções do menu de tema etc.),
   sem precisar religar listener nenhum quando esse conteúdo é montado. */
const CURSOR_CLICKABLE_SEL = 'a, button, [role="button"], .work-row, [tabindex]:not([tabindex="-1"])';
const ringSpin = document.querySelector('.cursor-ring-spin');
const ringSvg = document.querySelector('.cursor-ring-svg');
let cursorHoverTarget = null;
function bloomRosette(){
  gsap.killTweensOf(ringSvg);
  gsap.fromTo(ringSvg, {scale:1}, {scale:1.4, duration:.22, ease:'power2.out', yoyo:true, repeat:1, transformOrigin:'50% 50%'});
}
document.addEventListener('pointerover', e=>{
  const el = e.target.closest?.(CURSOR_CLICKABLE_SEL);
  if(!el || el === cursorHoverTarget) return;
  cursorHoverTarget = el;
  ring.classList.add('is-active');
  gsap.to(ring,{width:68,height:68,duration:.3});
  ringSpin.style.animationDuration = '3s';
  bloomRosette();
});
document.addEventListener('pointerout', e=>{
  if(!cursorHoverTarget) return;
  const stillInside = e.relatedTarget && e.relatedTarget.closest?.(CURSOR_CLICKABLE_SEL) === cursorHoverTarget;
  if(stillInside) return;
  cursorHoverTarget = null;
  ring.classList.remove('is-active');
  gsap.to(ring,{width:40,height:40,duration:.3});
  ringSpin.style.animationDuration = '14s';
});

/* ---------------- CURSOR CLICK FEEDBACK ---------------- */
window.addEventListener('mousedown', ()=>{ gsap.to([cursor,ring],{scale:.7,duration:.2,ease:'power2.out'}); });
window.addEventListener('mouseup', ()=>{ gsap.to([cursor,ring],{scale:1,duration:.3,ease:'back.out(3)'}); });

/* ---------------- SMOOTH ANCHOR SCROLL (GSAP, com offset da nav fixa) ----------------
   Unifica o comportamento de todo link #âncora do site: se ainda está na landing
   (gate não aberto), abre o site na seção-alvo (mesma lógica dos itens da roda);
   se já entrou, rola com easing consistente com o resto das animações. Corrige de
   quebra um bug latente: os links do mast-nav da landing apontavam pra IDs que só
   existem dentro de #mainSite (display:none antes de entrar), então cliques neles
   não faziam nada visível. */
function smoothScrollTo(target){
  if(!target) return;
  if(reduceMotion){ target.scrollIntoView(); return; }
  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto'; // evita o scroll-behavior:smooth nativo brigar com o tween do GSAP
  gsap.to(window,{ duration:1.1, ease:'power3.inOut', scrollTo:{ y:target, offsetY:70 },
    onComplete:()=>{ html.style.scrollBehavior = prevBehavior; } });
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  if(a.closest('#projectsList')) return; // tratado à parte (selectLandingProject, com outro animado)
  const id = a.getAttribute('href').slice(1);
  if(!id) return;
  a.addEventListener('click', e=>{
    e.preventDefault();
    if(!document.body.classList.contains('entered')){ enterSite('#'+id); return; }
    smoothScrollTo(document.getElementById(id));
  });
});

/* ---------------- SCROLL PROGRESS RAIL ---------------- */
const progressFill = document.getElementById('progressFill');
function updateScrollProgress(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const p = max > 0 ? (doc.scrollTop || window.scrollY) / max : 0;
  progressFill.style.height = (Math.max(0, Math.min(1, p)) * 100) + '%';
}
window.addEventListener('scroll', updateScrollProgress, {passive:true});
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

/* ---------------- BACK TO TOP ---------------- */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{
  backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight*0.8);
}, {passive:true});
backToTop.addEventListener('click', ()=>{
  if(reduceMotion){ window.scrollTo(0,0); return; }
  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  gsap.to(window,{ duration:1, ease:'power3.inOut', scrollTo:{y:0},
    onComplete:()=>{ html.style.scrollBehavior = prevBehavior; } });
});

/* ---------------- HOVER PREVIEW ON WORK ROWS ---------------- */
const preview = document.getElementById('hoverPreview');
const previewImg = document.getElementById('hoverImg');
const pqx = gsap.quickTo(preview,'x',{duration:.35,ease:'power3.out'});
const pqy = gsap.quickTo(preview,'y',{duration:.35,ease:'power3.out'});
let hoveringWorkRow = false;

function hidePreview(){
  hoveringWorkRow = false;
  gsap.to(preview,{opacity:0,scale:.9,duration:.25});
}

document.querySelectorAll('.work-row').forEach(row=>{
  row.addEventListener('mouseenter', ()=>{
    hoveringWorkRow = true;
    previewImg.src = row.dataset.img;
    previewImg.alt = row.getAttribute('aria-label') || '';
    gsap.to(preview,{opacity:1,scale:1,duration:.4,ease:'power3.out'});
  });
  row.addEventListener('mouseleave', hidePreview);
  row.addEventListener('mousemove', e=>{ pqx(e.clientX); pqy(e.clientY); });
});

// bug corrigido: rolar a página (scroll wheel/trackpad) NÃO dispara mouseleave,
// porque o cursor não se move — o preview ficava "grudado" na tela mostrando a
// imagem do último projeto sobre o qual o mouse tinha passado. Qualquer scroll
// agora esconde o preview, já que o contexto de hover deixou de fazer sentido.
window.addEventListener('scroll', ()=>{ if(hoveringWorkRow) hidePreview(); }, {passive:true});

/* ---------------- SCROLL REVEALS ---------------- */
function splitChars(el){
  const text = el.textContent;
  el.textContent = '';
  const spans = [];
  text.split('').forEach(ch=>{
    const s = document.createElement('span');
    // espaço de verdade (não \u00A0) -- tem que continuar sendo um ponto de
    // quebra de linha válido pro navegador, senão o título vira uma sequência
    // só de inline-block sem quebra nenhuma e estoura a largura da coluna em
    // telas estreitas (títulos longos tipo "Moriyama's House" cortavam no
    // mobile). display:inline-block só nas letras evita quebra NO MEIO da
    // palavra; o espaço em si continua quebrável entre palavras.
    if(ch === ' '){ s.textContent = ' '; }
    else { s.style.display = 'inline-block'; s.textContent = ch; }
    el.appendChild(s);
    spans.push(s);
  });
  return spans;
}
// preserva markup interno (ex: <b> de destaque) — cada palavra vira um span pro stagger,
// mas elementos filhos (como <b>) são tratados como uma unidade só, sem perder o estilo deles.
function splitWordsPreserveMarkup(el){
  const spans = [];
  Array.from(el.childNodes).forEach(node=>{
    if(node.nodeType === 3){
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part=>{
        if(part.trim()===''){ frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.style.display = 'inline-block';
        s.textContent = part;
        frag.appendChild(s);
        spans.push(s);
      });
      node.replaceWith(frag);
    } else if(node.nodeType === 1){
      node.style.display = node.style.display || 'inline-block';
      spans.push(node);
    }
  });
  return spans;
}

if(reduceMotion){
  // pula direto pro estado final em tudo, sem stagger nem interpolação
  gsap.set('.reveal',{opacity:1,y:0});
  gsap.utils.toArray('.reveal-media').forEach(el=>{
    gsap.set(el,{clipPath:'inset(0 0 0% 0)'});
    gsap.set(el.querySelector('img, video'),{scale:1.05});
  });
  document.querySelectorAll('.section-head').forEach(el=>{
    gsap.set(el,{opacity:1,y:0});
  });
  document.querySelectorAll('.work-row').forEach(row=>{
    const h3 = row.querySelector('h3');
    gsap.set(splitChars(h3),{opacity:1,y:0});
    gsap.set(row,{opacity:1,x:0,skewX:0});
  });
  document.querySelectorAll('.manifesto p').forEach(p=>{
    gsap.set(splitWordsPreserveMarkup(p),{opacity:1});
  });
  gsap.set('.f-item',{opacity:1,scale:1,rotate:0});
  gsap.utils.toArray('.fact').forEach(el=>{
    gsap.set(el,{opacity:1,x:0,'--scaleX':1});
  });
} else {
  gsap.utils.toArray('.section-head').forEach(el=>{
    gsap.from(el,{opacity:0,y:18,duration:1.05,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 95%',toggleActions:'play none none reverse'}});
  });
  gsap.utils.toArray('.reveal').forEach(el=>{
    gsap.fromTo(el,{opacity:0,y:28},{opacity:1,y:0,duration:1.05,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 92%',end:'top 65%',scrub:.45}});
  });
  gsap.utils.toArray('.reveal-media').forEach(el=>{
    gsap.fromTo(el,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',ease:'power4.inOut',
      scrollTrigger:{trigger:el,start:'top 90%',end:'top 40%',scrub:.5}});
    const img = el.querySelector('img, video');
    gsap.fromTo(img,{scale:1.32},{scale:1.05,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 90%',end:'top 40%',scrub:.5}});
    // parallax contínuo — a imagem/vídeo continua se movendo devagar enquanto a seção passa pela tela,
    // não só no momento em que entra (dá sensação de profundidade/vida à página).
    gsap.to(img,{yPercent:8,ease:'none',
      scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.6}});
  });

  /* work-row: nome do projeto "digitado" letra por letra ao rolar, linha desliza com leve skew.
     Timeline inteira presa a scrub — sobe reverte a letra-a-letra na ordem inversa. */
  document.querySelectorAll('.work-row').forEach((row,i)=>{
    const h3 = row.querySelector('h3');
    const chars = splitChars(h3);
    gsap.set(chars,{opacity:0,y:14});
    gsap.set(row,{opacity:0,x:-36,skewX:4});
    gsap.timeline({
      scrollTrigger:{trigger:row,start:'top 92%',end:'top 62%',scrub:.5}
    })
      .to(row,{opacity:1,x:0,skewX:0,ease:'power3.out'})
      .to(chars,{opacity:1,y:0,ease:'power2.out',stagger:.06},'-=.7');
  });

  /* manifesto: revelado palavra por palavra, ligado ao scroll (mesma linguagem dos dots).
     Usa splitWordsPreserveMarkup pra não perder o <b> de destaque dentro do parágrafo. */
  document.querySelectorAll('.manifesto p').forEach(p=>{
    const words = splitWordsPreserveMarkup(p);
    gsap.set(words,{opacity:.15});
    gsap.to(words,{opacity:1,stagger:.04,ease:'none',
      scrollTrigger:{trigger:p,start:'top 85%',end:'bottom 60%',scrub:.4}});
  });

  /* furniture grid: entra com leve rotação assentando + escala, staggered — back.out funciona
     normalmente com scrub (é só uma curva de easing amostrada pelo progresso do scroll,
     continua 100% reversível) */
  gsap.utils.toArray('.f-item').forEach((el,i)=>{
    gsap.fromTo(el,{opacity:0,scale:.85,rotate:i%2?2.5:-2.5},
      {opacity:1,scale:1,rotate:0,ease:'back.out(1.6)',
       scrollTrigger:{trigger:el,start:'top 95%',end:'top 65%',scrub:.5}});
  });

  /* fact rows (Sobre): deslizam da esquerda + linha superior "desenha" da esquerda pra direita — scrub */
  gsap.utils.toArray('.fact').forEach(el=>{
    gsap.fromTo(el,{opacity:0,x:-28},{opacity:1,x:0,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 95%',end:'top 70%',scrub:.5}});
    gsap.fromTo(el,{'--scaleX':0},{'--scaleX':1,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 95%',end:'top 70%',scrub:.5}});
  });
}

/* ---------------- NAV MOBILE (hamburger) ---------------- */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
function closeNavMenu(){
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navLinksEl.classList.remove('is-open');
}
navToggle.addEventListener('click', ()=>{
  const open = navToggle.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  navLinksEl.classList.toggle('is-open', open);
});
navLinksEl.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeNavMenu));
window.addEventListener('resize', ()=>{ if(window.innerWidth > 620) closeNavMenu(); });

/* ---------------- NAV ACTIVE STATE ---------------- */
['work','about','contact'].forEach((id,i)=>{
  ScrollTrigger.create({
    trigger:'#'+id, start:'top 50%', end:'bottom 50%',
    onToggle:self=>{
      document.querySelectorAll('.nav-link').forEach(a=>a.classList.remove('active'));
      if(self.isActive) document.querySelector(`.nav-link[data-i="${i}"]`).classList.add('active');
    }
  });
});

/* ---------------- FUNDO DO HERO EM VÍDEO ---------------- */
// Reaproveita o mesmo vídeo já cadastrado no projeto (não duplica o base64 no HTML --
// só aponta o <video> do hero pro mesmo data URI que já existe em memória).
(function(){
  const heroBgVideo = document.getElementById('heroBgVideo');
  const videoProject = projects.find(p=>p.video);
  if(videoProject){
    heroBgVideo.poster = videoProject.img;
    heroBgVideo.src = videoProject.video;
    if(!reduceMotion){
      heroBgVideo.play().catch(()=>{});
    }
  }
})();

/* ---------------- HERO INTRO ----------------
   Antes isso rodava direto no load da página com um delay fixo de .2s -- só que o
   hero fica por trás do gate (#landing cobrindo a tela inteira) até o usuário
   clicar pra entrar, e a timeline (delay + 1.1s + stagger) sempre terminava bem
   antes disso. Resultado: quem entra no site nunca via o texto do hero
   "descendo" pra posição -- já chegava parado. Agora só dispara quando o usuário
   realmente entra (dentro de enterSite), e só uma vez. */
let heroIntroPlayed = false;
function playHeroIntro(){
  if(heroIntroPlayed) return;
  heroIntroPlayed = true;
  if(reduceMotion){
    gsap.set('.hero-name .line span',{y:'0%'});
    gsap.set('.hero-tags .role, .hero-tags .softwares',{opacity:1});
    return;
  }
  gsap.timeline({delay:.15})
    .to('.hero-name .line span',{y:'0%',duration:1.1,ease:'power4.out',stagger:.12})
    .to('.hero-tags .role',{opacity:1,duration:.8},'-=.5')
    .to('.hero-tags .softwares',{opacity:1,duration:.8},'-=.55');
}

gsap.to('.hero-bg',{scale:1,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.hero-crest',{y:-28,rotation:24,ease:'none',
  scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.scroll-cue',{y:24,opacity:0.32,ease:'none',
  scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

/* ---------------- BRASÃO ANIMADO (hero) ---------------- */
const crestPaths = gsap.utils.toArray('.crest-path');
crestPaths.forEach(p=>{
  const len = p.getTotalLength();
  p.style.strokeDasharray = len;
  p.style.strokeDashoffset = reduceMotion ? 0 : len;
});
gsap.set('#heroCrest circle', {opacity: reduceMotion ? 1 : 0, transformOrigin:'50% 50%'});
if(!reduceMotion){
  gsap.timeline({delay:.6})
    .to(crestPaths, {strokeDashoffset:0, duration:1.6, ease:'power2.inOut', stagger:.18})
    .to('#heroCrest circle', {opacity:1, duration:.4}, '-=.3')
    .to('#heroCrest', {rotation:360, duration:120, ease:'none', repeat:-1, transformOrigin:'50% 50%'}, 0);
}

/* ---------------- TILT 3D NAS PEÇAS DE MOBILIÁRIO ---------------- */
if(!reduceMotion && window.matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.f-item').forEach(item=>{
    const qx = gsap.quickTo(item, 'rotationY', {duration:.4, ease:'power2.out'});
    const qy = gsap.quickTo(item, 'rotationX', {duration:.4, ease:'power2.out'});
    item.addEventListener('mousemove', e=>{
      const r = item.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      qx(px * 16);
      qy(py * -16);
    });
    item.addEventListener('mouseleave', ()=>{ qx(0); qy(0); });
  });
}

/* ---------------- GLOW AMBIENTE (manifesto) ---------------- */
if(!reduceMotion){
  gsap.to('#manifestoGlow', {
    x:'+=60', y:'-=40', scale:1.15, duration:9, ease:'sine.inOut',
    repeat:-1, yoyo:true
  });
}

/* ============================================================================
   THEME PROVIDER — config-driven, ver comentário HTML acima
   ============================================================================ */
const isLowPerf = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || /Mobi|Android/i.test(navigator.userAgent);

// "Vermelho & Preto" não é mais uma opção própria do menu -- virou as cores da
// página principal (mainSite) dentro do tema "Padrão" (ver mainSiteVars abaixo).
// Fica guardado à parte só pra não duplicar os hex em dois lugares.
const REDBLACK_VARS = { ink:'#000000', stone:'#0a0000', bone:'#f5eaea', boneDim:'#8a6a6a',
  oxblood:'#b3001f', oxbloodBright:'#ff0033', oxbloodSolid:'#8a0000', hair:'#1a0000', font:"'Libre Franklin',sans-serif" };

const THEMES = {
  // "Padrão" já nasce com o comportamento que antes era só do extinto tema "Heavy
  // Motion" (scramble/magnético/grain) -- não é mais uma opção separada no menu.
  // Paleta do gate (:root) continua a mesma de sempre; a página principal
  // (#mainSite, depois do gate) usa a paleta do extinto "Vermelho & Preto".
  default:{
    name:'Padrão', id:'default',
    vars:{ ink:'#0a0908', stone:'#171512', bone:'#eae4d8', boneDim:'#a39d8f',
           oxblood:'#7a2020', oxbloodBright:'#a83030', oxbloodSolid:'#b53a2e', hair:'#2c2924', font:"'Libre Franklin',sans-serif" },
    mainSiteVars: REDBLACK_VARS,
    behaviors:{ cyberFX:false, customCursor:false, magnetic:true, scramble:true, grain:true },
    heavy:true, // exige fallback automático de performance
  },
  cyberpunk:{
    name:'Cyberpunk', id:'cyberpunk',
    vars:{ ink:'#07030f', stone:'#120a24', bone:'#eafcff', boneDim:'#7a8ea3',
           oxblood:'#ff00e6', oxbloodBright:'#00fff2', oxbloodSolid:'#2a1a5e', hair:'#241645', font:"'Space Mono',monospace" },
    behaviors:{ cyberFX:true, customCursor:true, magnetic:false, scramble:false, grain:false },
    heavy:false,
  },
  grayscale:{
    name:'Preto, Branco e Cinza', id:'grayscale',
    vars:{ ink:'#050505', stone:'#141414', bone:'#f2f2f2', boneDim:'#8a8a8a',
           oxblood:'#3a3a3a', oxbloodBright:'#c9c9c9', oxbloodSolid:'#2b2b2b', hair:'#1f1f1f', font:"'Libre Franklin',sans-serif" },
    behaviors:{ cyberFX:false, customCursor:false, magnetic:true, scramble:false, grain:false },
    heavy:false,
  },
};
const THEME_ORDER = ['default','cyberpunk','grayscale'];

let currentTheme = null;

function loadSavedTheme(){
  try{ const s = localStorage.getItem('site-theme'); if(s && THEMES[s]) return s; }catch(e){}
  return 'default';
}

function effectiveConfig(themeId){
  const base = THEMES[themeId] || THEMES.default;
  // Cada tema tem seu próprio fallback de reduced-motion — aqui isso
  // significa desligar scramble/magnético/grain, mas manter a paleta.
  if(reduceMotion){
    return { ...base, behaviors:{ cyberFX:base.behaviors.cyberFX, customCursor:false, magnetic:false, scramble:false, grain:false } };
  }
  if(base.heavy && isLowPerf){
    showPerfToast('Dispositivo com recursos limitados — "Padrão" simplificado.');
    return { ...base, behaviors:{ cyberFX:false, customCursor:false, magnetic:false, scramble:false, grain:false } };
  }
  return base;
}

function applyTheme(themeId, immediate=false){
  const cfg = effectiveConfig(themeId);
  currentTheme = cfg;
  const dur = immediate ? 0 : .5;

  gsap.to(document.documentElement, {
    '--ink':cfg.vars.ink, '--stone':cfg.vars.stone, '--bone':cfg.vars.bone,
    '--bone-dim':cfg.vars.boneDim, '--oxblood':cfg.vars.oxblood, '--oxblood-bright':cfg.vars.oxbloodBright,
    '--oxblood-solid':cfg.vars.oxbloodSolid, '--hair':cfg.vars.hair, '--font-body':cfg.vars.font,
    duration:dur, ease:'power2.inOut'
  });

  // #mainSite recebe as próprias custom properties, sobrescrevendo o que herdaria
  // do :root -- é assim que o gate (fora do #mainSite) e a página principal podem
  // ter paletas diferentes dentro do mesmo tema "Padrão". Nos outros temas
  // (uniformes) isso só reaplica os mesmos valores do :root, sem efeito visual,
  // mas limpa qualquer override antigo que tenha ficado de uma troca anterior.
  const mainVars = cfg.mainSiteVars || cfg.vars;
  gsap.to('#mainSite', {
    '--ink':mainVars.ink, '--stone':mainVars.stone, '--bone':mainVars.bone,
    '--bone-dim':mainVars.boneDim, '--oxblood':mainVars.oxblood, '--oxblood-bright':mainVars.oxbloodBright,
    '--oxblood-solid':mainVars.oxbloodSolid, '--hair':mainVars.hair, '--font-body':mainVars.font,
    duration:dur, ease:'power2.inOut'
  });

  document.body.classList.toggle('theme-cyberpunk', cfg.behaviors.cyberFX);
  document.getElementById('cyber-cursor').style.opacity = cfg.behaviors.customCursor ? 1 : 0;
  gsap.to('#grain-overlay', { opacity: cfg.behaviors.grain ? .4 : 0, duration:dur });
  setMagnetic(cfg.behaviors.magnetic);
  setScramble(cfg.behaviors.scramble);

  try{ localStorage.setItem('site-theme', cfg.id); }catch(e){}
  renderThemePanel(cfg.id);
}

/* ---- painel ---- */
const fab = document.getElementById('theme-fab');
const panel = document.getElementById('theme-panel');
let panelOpen = false;
function renderThemePanel(activeId){
  panel.innerHTML = '';
  THEME_ORDER.forEach(id=>{
    const t = THEMES[id];
    const row = document.createElement('div');
    row.className = 'theme-opt' + (id===activeId ? ' active' : '');
    row.setAttribute('role', 'option');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-selected', id===activeId ? 'true' : 'false');
    row.setAttribute('aria-label', `Tema ${t.name}`);
    const swatchVars = t.mainSiteVars || t.vars;
    row.innerHTML = `<span class="swatch" style="background:${swatchVars.oxbloodBright}"></span><span>${t.name}</span><span class="check">✓</span>`;
    const pick = ()=>{ applyTheme(id); closePanel(); };
    row.addEventListener('click', pick);
    row.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); pick(); }
    });
    panel.appendChild(row);
  });
}
function openPanel(){ panelOpen=true; fab.setAttribute('aria-expanded','true'); gsap.to(panel,{opacity:1,y:0,scale:1,duration:.35,ease:'power3.out',pointerEvents:'auto'}); }
function closePanel(){ panelOpen=false; fab.setAttribute('aria-expanded','false'); gsap.to(panel,{opacity:0,y:12,scale:.96,duration:.25,ease:'power2.in',pointerEvents:'none'}); }
fab.addEventListener('click', e=>{ e.stopPropagation(); panelOpen ? closePanel() : openPanel(); });
document.addEventListener('click', e=>{ if(panelOpen && !panel.contains(e.target) && e.target!==fab) closePanel(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && panelOpen) closePanel(); });

function showPerfToast(msg){
  const el = document.getElementById('perf-toast');
  el.textContent = msg;
  gsap.timeline().to(el,{opacity:1,y:0,duration:.4,ease:'power2.out'}).to(el,{opacity:0,y:20,duration:.4,ease:'power2.in'},'+=3');
}

/* ---- cursor cyberpunk ---- */
window.addEventListener('mousemove', e=>{
  if(!currentTheme?.behaviors.customCursor) return;
  gsap.to('#cyber-cursor', { x:e.clientX, y:e.clientY, duration:.12, ease:'power2.out' });
});

/* ---- magnético (Heavy Motion) — alvos reais da página, não classes inventadas ---- */
let magneticEls = [];
function setMagnetic(enabled){
  magneticEls.forEach(el=>el.__cleanup?.());
  magneticEls = [];
  if(!enabled) return;
  document.querySelectorAll('.nav-links a, .contact-big a, #theme-fab').forEach(el=>{
    const qx = gsap.quickTo(el,'x',{duration:.3,ease:'power3.out'});
    const qy = gsap.quickTo(el,'y',{duration:.3,ease:'power3.out'});
    const onMove = e=>{
      const r = el.getBoundingClientRect();
      const dx = e.clientX-(r.left+r.width/2), dy = e.clientY-(r.top+r.height/2);
      const dist = Math.hypot(dx,dy);
      if(dist<80){ qx(dx*.3); qy(dy*.3); } else { qx(0); qy(0); }
    };
    window.addEventListener('mousemove', onMove);
    el.__cleanup = ()=>{ window.removeEventListener('mousemove', onMove); gsap.set(el,{x:0,y:0}); };
    magneticEls.push(el);
  });
}

/* ---- scramble (Heavy Motion) — nos títulos de seção reais [data-scramble] ---- */
const SCRAMBLE_CHARS = 'アイウエオカキクケコ#$%&*01';
function scrambleInto(el, finalText, duration=.7){
  let frame=0; const total=Math.round(duration*60);
  const timer = setInterval(()=>{
    frame++;
    el.textContent = finalText.split('').map((ch,i)=> i<frame/3 ? finalText[i] : SCRAMBLE_CHARS[Math.floor(Math.random()*SCRAMBLE_CHARS.length)]).join('');
    if(frame>=total){ el.textContent=finalText; clearInterval(timer); }
  }, 1000/60);
}
let scrambleObserver = null;
function setScramble(enabled){
  scrambleObserver?.disconnect();
  document.querySelectorAll('[data-scramble]').forEach(el=>{ delete el.dataset.done; });
  if(!enabled) return;
  scrambleObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !entry.target.dataset.done){
        scrambleInto(entry.target, entry.target.textContent.trim());
        entry.target.dataset.done = '1';
      }
    });
  }, {threshold:.6});
  document.querySelectorAll('[data-scramble]').forEach(el=>scrambleObserver.observe(el));
}

/* ---- glitch no cyberpunk ao trocar de SEÇÃO ativa (equivalente ao "beat" da katana) ---- */
let lastActiveSection = null;
['work','about','contact'].forEach(id=>{
  ScrollTrigger.create({
    trigger:'#'+id, start:'top 50%', end:'bottom 50%',
    onToggle: self=>{
      if(self.isActive && currentTheme?.behaviors.cyberFX && lastActiveSection!==id){
        gsap.fromTo('body.theme-cyberpunk .display, body.theme-cyberpunk h2, body.theme-cyberpunk h3',
          {opacity:.4}, {opacity:1,duration:.3,ease:'power2.out'});
      }
      if(self.isActive) lastActiveSection = id;
    }
  });
});

applyTheme(loadSavedTheme(), true);

/* ---------------- VÍDEO DO PROJETO (hero) — ativado por rolagem ---------------- */
document.querySelectorAll('[data-scroll-video]').forEach(video=>{
  const wrap = video.closest('.project-media');
  const muteBtn = wrap.querySelector('[data-v-mute]');

  muteBtn.addEventListener('click', ()=>{
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? 'ðŸ”Š' : 'ðŸ”‡';
  });

  const videoObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        video.play().catch(()=>{});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.4 }); // só ativa quando ~40% do vídeo está visível

  videoObserver.observe(video);
});

/* ---------------- SOFTWARE PROFICIENCY BADGES ---------------- */
const SOFTWARE_LEVELS = [
  { name:'Revit', level:5 },
  { name:'Archicad', level:2 },
  { name:'Rhinoceros', level:3.5 },
  { name:'Unreal Engine 5', level:3.5 },
  { name:'Promob', level:4.5 },
  { name:'SketchUp', level:3.5 },
];
const tagsContainer = document.getElementById('softwareTags');
const allDotEls = []; // flat list, in badge-then-dot order, for the sequential timeline
let globalDotIndex = 0;

SOFTWARE_LEVELS.forEach(sw=>{
  const badge = document.createElement('span');
  badge.className = 'tag-badge';

  const label = document.createElement('span');
  label.textContent = sw.name;
  badge.appendChild(label);

  const dotsWrap = document.createElement('span');
  dotsWrap.className = 'tag-dots';
  dotsWrap.setAttribute('role','img');
  dotsWrap.setAttribute('aria-label', `${sw.name}: nível ${sw.level} de 5`);

  const badgeDots = [];
  for(let i=0;i<5;i++){
    const dot = document.createElement('i');
    dot.className = 'dot';
    const fill = document.createElement('i');
    fill.className = 'dot-fill';
    dot.appendChild(fill);
    const remaining = sw.level - i; // >=1 full, ==0.5 half, <=0 empty
    dot.dataset.fill = remaining>=1 ? '1' : (remaining===0.5 ? '0.5' : '0');
    dot.style.setProperty('--echo-delay', (globalDotIndex%6)*0.25 + 's');
    globalDotIndex++;
    dotsWrap.appendChild(dot);
    badgeDots.push(dot);
  }
  badge.appendChild(dotsWrap);
  tagsContainer.appendChild(badge);
  allDotEls.push(badgeDots);
});

function applyDotFillInstant(dot){
  const f = dot.dataset.fill;
  const fillEl = dot.querySelector('.dot-fill');
  if(f==='1'){ dot.classList.add('filled'); if(fillEl) fillEl.style.clipPath='inset(0 0% 0 0)'; }
  else if(f==='0.5'){ dot.classList.add('half'); if(fillEl) fillEl.style.clipPath='inset(0 50% 0 0)'; }
}

if(reduceMotion){
  // reduced motion: estado final direto, sem stagger nem pulso
  allDotEls.flat().forEach(applyDotFillInstant);
} else {
  // timeline ligada ao SCROLL (scrub) — cada dot "se desenha" da esquerda pra direita
  // (clip-path no overlay de preenchimento) conforme o usuário rola a página, um de
  // cada vez, badge por badge — como um traço sendo escrito. Rolar pra cima desfaz o
  // desenho na mesma cadência (comportamento nativo do scrub, sem lógica extra).
  const dotsTl = gsap.timeline({
    scrollTrigger:{
      trigger:'#softwareTags',
      start:'top 95%', // começa assim que o bloco encosta na base da tela
      end:'top 15%',   // termina só quando ele quase alcança o topo — ou seja,
                        // a sequência inteira acontece enquanto o elemento está visível
      scrub:0.5
    }
  });
  allDotEls.forEach((badgeDots, badgeIdx)=>{
    badgeDots.forEach(dot=>{
      if(dot.dataset.fill === '0') return; // dots vazios não animam, só ficam no estado neutro
      const fillEl = dot.querySelector('.dot-fill');
      const target = dot.dataset.fill === '0.5' ? 50 : 0; // % ainda escondido à direita
      const activeClass = dot.dataset.fill === '0.5' ? 'half' : 'filled';
      dotsTl.fromTo(fillEl, { clipPath:'inset(0 100% 0 0)' }, {
              clipPath:`inset(0 ${target}% 0 0)`, duration:.5, ease:'power2.inOut',
              onUpdate:function(){ dot.classList.toggle(activeClass, this.progress()>0); }
            }, '>')
            .fromTo(dot, { scale:1 }, { scale:1.6, duration:.16, ease:'back.out(3)' }, '<')
            .to(dot, { scale:1, duration:.2, ease:'power2.out' }, '<25%');
      // espaço entre dots — devagar o suficiente pra ler como "sendo escrito", não instantâneo
      dotsTl.to({}, { duration:.35 });
    });
    // pausa extra ao trocar de badge, pra separar visualmente um badge do próximo
    if(badgeIdx < allDotEls.length-1) dotsTl.to({}, { duration:.3 });
  });
}

/* ---------------- WEBGL: fundo generativo tipo prancheta de desenho técnico ----------------
   WebGL puro (sem Three.js/lib externa) pra não somar mais uma dependência de CDN a um
   arquivo que já carrega tudo via CDN do GSAP -- só um shader leve (1 triângulo cobrindo
   a tela) com uma grade fina rotacionada + uma varredura diagonal de luz bem sutil. Usado
   no gate (opaco, substitui o fundo chapado) e no hero (transparente, mix-blend-mode por
   cima do vídeo). As cores são lidas ao vivo das custom properties --bg-var/--line-var a
   cada frame (não fixas), pra acompanhar automaticamente a troca de tema (o site tem 3
   paletas -- default/cyberpunk/grayscale -- animadas via gsap.to() nas CSS
   vars); assim o shader nunca fica com a cor errada depois de um theme switch. Reaproveita
   o mesmo isLowPerf que já existia pro fallback do tema "Heavy Motion": em dispositivo
   fraco o canvas nem inicializa. Se o navegador não tiver WebGL, o canvas some
   (display:none) e o fundo sólido/gradiente que já existia por trás continua funcionando
   normalmente -- nunca é a única fonte de fundo. */
function initBlueprintGL(canvas, opts){
  if(!canvas || !window.WebGLRenderingContext) return;
  if(isLowPerf){ canvas.style.display = 'none'; return; }
  const ctxAttrs = {alpha:opts.alpha, antialias:false, premultipliedAlpha:false, depth:false};
  const gl = canvas.getContext('webgl', ctxAttrs) || canvas.getContext('experimental-webgl', ctxAttrs);
  if(!gl){ canvas.style.display = 'none'; return; }

  const vsSrc = 'attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }';
  const fsSrc = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec3 u_bg;
    uniform vec3 u_line;
    uniform float u_opaque;

    float hash(vec2 p){
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = uv - 0.5;
      p.x *= u_resolution.x / u_resolution.y;
      p += u_mouse * 0.025;
      float ang = 0.5236;
      float cs = cos(ang), sn = sin(ang);
      vec2 rp = vec2(p.x * cs - p.y * sn, p.x * sn + p.y * cs);
      float dist = length(p);
      // vinheta suave -- some perto dos cantos extremos, mais presente no
      // centro/topo onde os títulos ficam
      float vign = 1.0 - smoothstep(0.15, 1.15, dist);

      // meio-tom rasterizado (tipo impressão risografada) -- o raio de cada
      // ponto varia com o vinheteamento e com um sorteio por célula, em vez de
      // uma grade uniforme de linhas finas. Pontos pequenos e esparsos --
      // textura, não um padrão gráfico chamativo.
      vec2 cellUv = rp * 24.0;
      vec2 cellId = floor(cellUv);
      vec2 cellF = fract(cellUv) - 0.5;
      float rnd = hash(cellId + floor(u_time * 1.6));
      float radius = mix(0.03, 0.2, vign) * (0.5 + rnd * 0.5);
      float dotMask = 1.0 - smoothstep(radius - 0.08, radius, length(cellF));

      // varredura diagonal de luz, bem discreta
      float sweepD = abs(fract((p.x + p.y) * 0.55 + u_time * 0.05) - 0.5);
      float sweep = (1.0 - smoothstep(0.0, 0.5, sweepD)) * 0.06 * vign;

      float glow = clamp(dotMask * 0.4 * vign + sweep, 0.0, 1.0);
      vec3 col = mix(u_bg, u_line, glow);

      // grão de filme -- ruído puro por pixel, recalculado every frame (não
      // travado na grade), pra dar a textura granulada das referências
      float grain = hash(uv * u_resolution.xy * 0.6 + u_time * 60.0);
      col += (grain - 0.5) * 0.035;

      float a = mix(clamp(glow * 1.4, 0.0, 0.9), 1.0, u_opaque);
      gl_FragColor = vec4(col, a);
    }
  `;

  function compile(type, src){
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){ gl.deleteShader(sh); return null; }
    return sh;
  }
  const vs = compile(gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
  if(!vs || !fs){ canvas.style.display = 'none'; return; }
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){ canvas.style.display = 'none'; return; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const u_res = gl.getUniformLocation(prog, 'u_resolution');
  const u_time = gl.getUniformLocation(prog, 'u_time');
  const u_mouse = gl.getUniformLocation(prog, 'u_mouse');
  const u_bg = gl.getUniformLocation(prog, 'u_bg');
  const u_line = gl.getUniformLocation(prog, 'u_line');
  const u_opaque = gl.getUniformLocation(prog, 'u_opaque');

  if(opts.alpha){ gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); }

  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e=>{
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  }, {passive:true});

  let visible = true;
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{ visible = entries[0].isIntersecting; }, {threshold:0}).observe(canvas);
  }

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if(canvas.width !== w || canvas.height !== h){
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  const rootStyle = getComputedStyle(document.documentElement);
  function draw(t){
    const bg = hexToRgb01(rootStyle.getPropertyValue(opts.bgVar).trim() || opts.bgFallback);
    const line = hexToRgb01(rootStyle.getPropertyValue(opts.lineVar).trim() || opts.lineFallback);
    gl.uniform2f(u_res, canvas.width, canvas.height);
    gl.uniform1f(u_time, t * 0.001);
    gl.uniform2f(u_mouse, mouseX, mouseY);
    gl.uniform3f(u_bg, bg[0], bg[1], bg[2]);
    gl.uniform3f(u_line, line[0], line[1], line[2]);
    gl.uniform1f(u_opaque, opts.alpha ? 0.0 : 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function render(t){
    resize();
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;
    if(visible) draw(t);
    if(!reduceMotion) requestAnimationFrame(render);
  }

  resize();
  draw(0);
  if(!reduceMotion) requestAnimationFrame(render);
  window.addEventListener('resize', resize);
}

function hexToRgb01(hex){
  const n = parseInt(String(hex).replace('#',''), 16) || 0;
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

initBlueprintGL(document.getElementById('landingGL'), {
  alpha:false,
  bgVar:'--oxblood-solid', bgFallback:'#b53a2e',
  lineVar:'--ink', lineFallback:'#0a0908'
});

ScrollTrigger.refresh();


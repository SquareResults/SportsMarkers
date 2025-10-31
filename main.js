(function(){
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav toggle + elevate header when scrolling
  const header = $(".nav-bar");
  const toggle = $(".nav-toggle");
  if (toggle && header) toggle.addEventListener("click", () => header.classList.toggle("nav-open"));
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 4);
  onScroll(); window.addEventListener("scroll", onScroll, { passive:true });

  // HERO slider + dots + link to Athletes?sport=
  const slides = $$(".hero .slide");
  const dotsWrap = $("#heroDots");
  const heroSportLink = $("#heroSportLink");
  if (slides.length && dotsWrap){
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role","tab");
      b.addEventListener("click", () => { idx = i; show(idx); });
      dotsWrap.appendChild(b);
    });

    let idx = 0, timer;
    const setDot = i => Array.from(dotsWrap.children)
      .forEach((d,j)=>d.setAttribute("aria-selected", j===i ? "true":"false"));

    const show = i => {
      slides.forEach((s,j)=>s.classList.toggle("active", j===i));
      const sport = slides[i].dataset.sport || "Basketball";
      if (heroSportLink) heroSportLink.href = `Athletes.html?sport=${encodeURIComponent(sport)}`;
      setDot(i); resetAuto();
    };

    const next = () => { idx = (idx+1) % slides.length; show(idx); };
    const prev = () => { idx = (idx-1+slides.length) % slides.length; show(idx); };
    const resetAuto = () => { clearInterval(timer); timer = setInterval(next, 5000); };

    show(idx); resetAuto();
    const nextBtn = $(".hero .next"), prevBtn = $(".hero .prev");
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);
    document.addEventListener("keydown", e => { if(e.key==="ArrowRight") next(); if(e.key==="ArrowLeft") prev(); });
  }
})();

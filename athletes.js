(function(){
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav toggle
  const header = $(".nav-bar");
  const toggle = $(".nav-toggle");
  if (toggle && header) toggle.addEventListener("click", () => header.classList.toggle("nav-open"));

  const form = $("#filters");
  if (!form) return;

  const nameInput = $("#nameSearch");
  const sportSel  = $("#sportFilter");
  const posSel    = $("#positionFilter");
  const yearSel   = $("#yearFilter");
  const locSel    = $("#locationFilter");
  const clearBtn  = $("#clearFilters");
  const cards     = $$("#athleteGrid .athlete-card");
  const resultEl  = $("#resultCount");

  // Preselect from URL ?sport=
  const params = new URLSearchParams(location.search);
  const presetSport = params.get("sport");
  if (presetSport && sportSel) sportSel.value = presetSport;

  function apply(e){
    if (e) e.preventDefault();
    let shown = 0;
    cards.forEach(card => {
      const okName  = !nameInput.value || (card.dataset.name||"").toLowerCase().includes(nameInput.value.toLowerCase());
      const okSport = !sportSel.value || card.dataset.sport === sportSel.value;
      const okPos   = !posSel.value   || card.dataset.position === posSel.value;
      const okYear  = !yearSel.value  || card.dataset.year === yearSel.value;
      const okLoc   = !locSel.value   || card.dataset.location === locSel.value;
      const on = okName && okSport && okPos && okYear && okLoc;
      card.style.display = on ? "" : "none";
      if (on) shown++;
    });
    resultEl.textContent = `${shown} athlete${shown===1?'':'s'} found`;
  }

  form.addEventListener("submit", apply);
  if (clearBtn) clearBtn.addEventListener("click", () => {
    nameInput.value = sportSel.value = posSel.value = yearSel.value = locSel.value = "";
    history.replaceState({}, "", "Athletes.html");
    apply();
  });

  apply();
})();

const $ = (selector) => document.querySelector(selector);
const grid = $("#sign-grid");
let horoscopeData = null;
const snippets = {
  Ariete:"Un mese per scegliere le tue battaglie e dare spazio alle idee migliori.",
  Toro:"La costanza può diventare il terreno fertile per qualcosa di nuovo.",
  Gemelli:"Conversazioni, curiosità e nuove prospettive chiedono spazio.",
  Cancro:"Ascoltare ciò che senti può aiutarti a mettere a fuoco le priorità.",
  Leone:"È il momento di condividere il tuo entusiasmo senza dimenticare te stesso.",
  Vergine:"Un passo alla volta: anche i dettagli possono aprire nuove strade.",
  Bilancia:"Relazioni e piccoli equilibri invitano a una maggiore chiarezza.",
  Scorpione:"Una prospettiva diversa può cambiare il modo in cui leggi una situazione.",
  Sagittario:"La voglia di esplorare trova forza quando diventa un primo passo concreto.",
  Capricorno:"La pazienza conta, ma anche riconoscere la strada già percorsa.",
  Acquario:"Un'idea originale merita ascolto e un'occasione per essere provata.",
  Pesci:"Sensibilità e creatività possono accompagnarti verso scelte più consapevoli."
};
function render(data) {
  horoscopeData = data;
  $("#month-title").textContent = data.month ? `Oroscopo di ${data.month}` : "Il tuo oroscopo del mese";
  $("#month-intro").textContent = data.intro || "Scegli il tuo segno e prenditi un momento per te.";
  grid.innerHTML = "";
  data.signs.forEach((sign) => {
    const button = document.createElement("button");
    button.className = "sign-card";
    button.type = "button";
    button.style.setProperty("--tone", colorFor(sign.color));
    button.style.setProperty("--tint", tintFor(sign.color));
    button.setAttribute("aria-label", `Leggi l'oroscopo di ${sign.name}`);
    const left = document.createElement("div");
    left.className = "sign-symbol";
    left.textContent = sign.symbol;
    const content = document.createElement("div");
    const title = document.createElement("h3"); title.textContent = sign.name;
    const dates = document.createElement("p"); dates.className = "dates"; dates.textContent = sign.dates;
    const teaser = document.createElement("p"); teaser.className = "teaser"; teaser.textContent = sign.love || snippets[sign.name] || "Un nuovo spunto per il mese che comincia.";
    const more = document.createElement("span"); more.className = "read-more"; more.textContent = "Leggi l'oroscopo  →";
    content.append(title, dates, teaser, more); button.append(left, content);
    button.addEventListener("click", () => openSign(sign));
    grid.append(button);
  });
}
function colorFor(color) { return ({coral:"#c94d59",teal:"#267d79",gold:"#b77a13",blue:"#386bb1",orange:"#c16a1e",green:"#4d8140",purple:"#8057a7",plum:"#664080",cyan:"#278b9b",brown:"#8b583f",sky:"#287caa",mint:"#298c83"})[color] || "#6f5b8b"; }
function tintFor(color) { return ({coral:"#ffe3e3",teal:"#d8f1ec",gold:"#fff0c9",blue:"#e1ecff",orange:"#ffead2",green:"#e4f1d9",purple:"#efe3f7",plum:"#eee3f5",cyan:"#d8f3f7",brown:"#f4e4d9",sky:"#dcefff",mint:"#d9f3ed"})[color] || "#f0e8f5"; }
function openSign(sign) {
  const dialog = $("#sign-dialog"), content = $("#dialog-content");
  content.innerHTML = "";
  const symbol = document.createElement("div"); symbol.className = "sign-symbol"; symbol.style.cssText = `--tone:${colorFor(sign.color)};--tint:${tintFor(sign.color)};width:58px;height:58px;font-size:32px`; symbol.textContent = sign.symbol;
  const title = document.createElement("h2"); title.className = "dialog-title"; title.textContent = sign.name;
  const dates = document.createElement("p"); dates.className = "dialog-dates"; dates.textContent = `${sign.dates} · ${horoscopeData.month || "Oroscopo del mese"}`;
  content.append(symbol,title,dates);
  [["In amore",sign.love],["Lavoro e progetti",sign.work],["Benessere",sign.wellbeing],["Una nota di fortuna",sign.fortune]].forEach(([heading,body]) => {
    if (!body) return;
    const section = document.createElement("section"); section.className = "dialog-section";
    const h = document.createElement("h4"); h.textContent = heading;
    const p = document.createElement("p"); p.textContent = body;
    section.append(h,p); content.append(section);
  });
  const advice = document.createElement("p"); advice.className = "advice-box"; advice.textContent = `Il consiglio del mese: ${sign.advice || "Fai spazio a ciò che conta davvero."}`; content.append(advice);
  dialog.showModal();
}
$("#dialog-close").addEventListener("click", () => $("#sign-dialog").close());
$("#sign-dialog").addEventListener("click", (event) => { if (event.target === $("#sign-dialog")) $("#sign-dialog").close(); });
$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#form-message").textContent = "Grazie! Il modulo è una demo: collega un servizio newsletter per attivare le iscrizioni.";
});
$("#year").textContent = new Date().getFullYear();
fetch("horoscopes.json").then(response => { if (!response.ok) throw new Error("JSON non disponibile"); return response.json(); })
  .then(render).catch(() => {
    $("#month-title").textContent = "Il tuo oroscopo del mese";
    $("#month-intro").textContent = "Non siamo riusciti a caricare i testi. Riprova tra poco.";
    grid.innerHTML = "<p>Contenuti temporaneamente non disponibili.</p>";
  });
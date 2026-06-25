(() => {
  "use strict";

  const STORAGE_KEY = "commande-matiere-webapp-v1";
  const SOURCE_COUNTS = {
    cdeRows: 15,
    archiveRows: 1525,
    archiveColumns: 29,
    spcRows: 53,
    optionsRows: 22,
    listeRows: 15,
    articleRows: 5,
    macroModules: 7,
    macroProcedures: 15,
    formulaCount: 17,
  };

  const STATUSES = ["Brouillon", "A planifier", "Planifie", "OF cree", "Lance", "En traitement", "Termine", "Bloque"];
  const PLANIF_STATUSES = ["OK", "A verifier", "Bloquant", "Surplus", "Hors plan"];
  const VALIDATION_STATUSES = ["A valider", "Valide", "Attente", "Refuse"];
  const MATERIAL_TYPES = ["Acier calibre", "Laiton technique", "Inox poli", "Aluminium doux", "Bronze atelier", "Titane essai"];
  const RESPONSABLES = ["Atelier Nova", "Atelier Vega", "Atelier Orion", "Atelier Lyra", "Atelier Solis", "Atelier Cobalt"];
  const OPERATEURS = ["Cellule Nord", "Cellule Est", "Cellule Ouest", "Cellule Sud", "Cellule Prototype", "Cellule Serie"];
  const WCS = ["WC-110", "WC-125", "WC-140", "WC-155", "WC-170", "WC-185"];
  const ORDER_TYPES = ["PROD", "MET", "RET", "ESSAI", "SUPPORT"];
  const EN_TRAIT = ["Non", "Oui", "Imprime", "Controle"];

  const archiveColumns = [
    { key: "statut", label: "Statut" },
    { key: "machine", label: "Machine" },
    { key: "nbrLaufnote", label: "Nbr laufnote" },
    { key: "item", label: "Item" },
    { key: "itemMatiere", label: "Item matiere" },
    { key: "typeMatiere", label: "Type matiere" },
    { key: "responsable", label: "Responsable" },
    { key: "date", label: "Date" },
    { key: "of", label: "OF" },
    { key: "poidsSap", label: "Poid.SAP" },
    { key: "valdPlanif", label: "Vald planif" },
    { key: "statutPlanif", label: "Statut planif" },
    { key: "tauxCouverture", label: "Couverture" },
    { key: "nbrPlanif", label: "Nbr planif" },
    { key: "wc", label: "WC" },
    { key: "type", label: "Type" },
    { key: "startProd", label: "Start prod" },
    { key: "prodVer", label: "Prod ver." },
    { key: "batch", label: "Batch" },
  ];

  const orderFields = [
    { key: "statut", label: "Statut", type: "select", options: STATUSES },
    { key: "type", label: "Type", type: "select", options: ORDER_TYPES },
    { key: "machine", label: "Machine", type: "text" },
    { key: "date", label: "Date", type: "date" },
    { key: "nbrLaufnote", label: "Nbr laufnote", type: "text" },
    { key: "item", label: "Item", type: "text" },
    { key: "itemMatiere", label: "Item matiere", type: "text" },
    { key: "typeMatiere", label: "Type matiere", type: "select", options: MATERIAL_TYPES },
    { key: "decolleteur", label: "Operateur", type: "select", options: OPERATEURS },
    { key: "responsable", label: "Responsable", type: "select", options: RESPONSABLES },
    { key: "of", label: "OF", type: "text" },
    { key: "nbrBarre", label: "Nbr barre", type: "number", min: 0 },
    { key: "poidsSap", label: "Poid.SAP", type: "number", min: 0, step: "0.1" },
    { key: "enTrait", label: "En trait.", type: "select", options: EN_TRAIT },
    { key: "valdPlanif", label: "Vald planif", type: "select", options: VALIDATION_STATUSES },
    { key: "statutPlanif", label: "Statut planif", type: "select", options: PLANIF_STATUSES },
    { key: "tauxCouverture", label: "Taux couverture", type: "number", min: 0, step: "0.01" },
    { key: "nbrPlanif", label: "Nbr planif", type: "number", min: 0 },
    { key: "wc", label: "WC", type: "select", options: WCS },
    { key: "startProd", label: "Start prod", type: "date" },
    { key: "prodVer", label: "Prod ver.", type: "number", min: 1 },
    { key: "batch", label: "Batch", type: "text" },
    { key: "remarques", label: "Centrage ou remarques", type: "textarea", span: "full-row" },
  ];

  const manualOrderFields = [
    { key: "machine", label: "Numero machine", type: "text", placeholder: "Ex: M-120" },
    { key: "nbrLaufnote", label: "Nombre OF selectionne", type: "number", placeholder: "Ex: 3" },
    { key: "type", label: "Type commande", type: "select", options: ["PROD", "MET"] },
  ];

  const autoOrderFields = [
    { key: "item", label: "Item" },
    { key: "itemMatiere", label: "Item matiere" },
    { key: "typeMatiere", label: "Type matiere" },
    { key: "decolleteur", label: "Operateur" },
    { key: "date", label: "Date" },
    { key: "tauxCouverture", label: "Couverture" },
    { key: "startProd", label: "Start prod" },
    { key: "prodVer", label: "Prod ver." },
  ];

  const archiveSapActions = [
    { key: "surplus", label: "SURPLUS", group: "reglages", default: false, effect: "Statut planif Surplus" },
    { key: "release", label: "REALASE", group: "reglages", default: true, effect: "Release SAP" },
    { key: "suppSetup", label: "SUPP SETUP", group: "reglages", default: true, effect: "Setup supprime" },
    { key: "fstr", label: "FSTR", group: "reglages", default: false, effect: "Controle FSTR" },
    { key: "pldord", label: "PLdOrd", group: "reglages", default: true, effect: "Ordre planifie" },
    { key: "confOp05", label: "CONFOP05", group: "dispo", default: false, effect: "OP05 confirme" },
    { key: "print", label: "PRINT", group: "dispo", default: false, effect: "OF imprime" },
    { key: "picking", label: "PICKING", group: "dispo", default: false, effect: "Batch picking" },
    { key: "etiquette", label: "ETIQUETTE", group: "dispo", default: false, effect: "Etiquette generee" },
  ];

  let state = loadState();
  let activeView = "commandes";
  let page = 1;
  let rowsPerPage = 22;
  let selectedIds = new Set();
  let currentOrderId = null;
  let draftOrder = makeBlankOrder();
  let currentPeriod = "all";
  let sortState = { key: "date", dir: "desc" };
  let toastTimer = null;
  let sapRunning = false;

  function rng(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(random, list) {
    return list[Math.floor(random() * list.length)];
  }

  function intBetween(random, min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  function pad(number, size = 4) {
    return String(number).padStart(size, "0");
  }

  function isoDateFromOffset(days) {
    const date = new Date(Date.UTC(2025, 0, 1 + days));
    return date.toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value, precision = 2) {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
  }

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function removeDemoWord(value) {
    const oldWords = ["fic" + "tif", "fic" + "tive", "fic" + "tifs", "fic" + "tives"];
    return String(value ?? "")
      .replace(new RegExp(`\\b(${oldWords.join("|")})\\b`, "gi"), "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.;:])/g, "$1")
      .trim();
  }

  function sanitizeStoredText(value) {
    if (typeof value === "string") return removeDemoWord(value);
    if (Array.isArray(value)) return value.map(sanitizeStoredText);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeStoredText(entry)]));
    }
    return value;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function statusFromCoverage(coverage) {
    if (coverage < 0.58) return "Bloquant";
    if (coverage < 0.82) return "A verifier";
    if (coverage > 1.14) return "Surplus";
    return "OK";
  }

  function enrichOrder(order) {
    const coverage = Number(order.tauxCouverture) || 0;
    order.tauxCouverture = round(coverage, 2);
    order.nbrBarre = Number(order.nbrBarre) || 0;
    order.poidsSap = round(Number(order.poidsSap) || 0, 1);
    if (!order.machine && !order.item && !order.itemMatiere && !order.nbrBarre) {
      order.nbrPlanif = 0;
      return order;
    }
    order.nbrPlanif = Number(order.nbrPlanif) || Math.max(0, Math.round(order.nbrBarre * order.tauxCouverture));
    if (!order.statutPlanif || order.statutPlanif === "OK" || order.statutPlanif === "A verifier" || order.statutPlanif === "Bloquant" || order.statutPlanif === "Surplus") {
      order.statutPlanif = statusFromCoverage(order.tauxCouverture);
    }
    if (!order.valdPlanif) {
      order.valdPlanif = order.statutPlanif === "OK" ? "Valide" : "A valider";
    }
    return order;
  }

  function generateOrders(count) {
    const random = rng(19062026);
    const orders = [];
    for (let index = 1; index <= count; index += 1) {
      const coverage = round(0.42 + random() * 0.96, 2);
      const hasOf = random() > 0.22;
      const hasBatch = hasOf && random() > 0.18;
      const dateOffset = intBetween(random, 0, 534);
      const startOffset = dateOffset + intBetween(random, 1, 35);
      const status = hasOf
        ? pick(random, ["OF cree", "Lance", "En traitement", "Termine", "Planifie"])
        : pick(random, ["A planifier", "Brouillon", "Bloque"]);
      const machineNumber = 100 + (index % 86);
      const nbrBarre = intBetween(random, 2, 78);
      const order = {
        id: `CM-${pad(index, 5)}`,
        statut: status,
        machine: `M-${machineNumber}`,
        nbrLaufnote: random() > 0.17 ? `LN-${pad(index * 7, 6)}` : String(intBetween(random, 1000, 9980)),
        item: `ART-${pad(5000 + index, 5)}`,
        itemMatiere: `MAT-${pad(8000 + ((index * 13) % 4700), 5)}`,
        typeMatiere: pick(random, MATERIAL_TYPES),
        remarques: random() > 0.74 ? pick(random, ["Controle cote", "Lot a surveiller", "Priorite client", "Serie pilote", "Attente validation"]) : "",
        decolleteur: pick(random, OPERATEURS),
        responsable: pick(random, RESPONSABLES),
        date: isoDateFromOffset(dateOffset),
        of: hasOf ? `OF-${String(260000 + index * 3)}` : "",
        nbrBarre,
        poidsSap: round(nbrBarre * (1.8 + random() * 14.5), 1),
        enTrait: hasOf ? pick(random, ["Oui", "Controle", "Imprime"]) : "Non",
        valdPlanif: "",
        statutPlanif: "",
        tauxCouverture: coverage,
        nbrPlanif: Math.max(0, Math.round(nbrBarre * coverage)),
        wc: pick(random, WCS),
        type: pick(random, ORDER_TYPES),
        startProd: isoDateFromOffset(startOffset),
        prodVer: intBetween(random, 1, 8),
        batch: hasBatch ? `BATCH-${pad(index * 11, 6)}` : "",
      };
      orders.push(enrichOrder(order));
    }
    return orders;
  }

  function generateReferences() {
    const spc = Array.from({ length: SOURCE_COUNTS.spcRows }, (_, index) => ({
      poste: `SPC-${pad(index + 1, 3)}`,
      decolleteur: OPERATEURS[index % OPERATEURS.length],
    }));
    const options = Array.from({ length: SOURCE_COUNTS.optionsRows }, (_, index) => ({
      type: `Option-${pad(index + 1, 2)}`,
      description: pick(rng(300 + index), ["Controle", "Impression", "Validation", "Preparation", "Suivi", "Notification"]),
      actif: index % 3 !== 0,
    }));
    return {
      spc,
      options,
      met: ["MET-Astra", "MET-Boreal", "MET-Celeste"],
      cw724r: ["CW-Alpha", "CW-Beta", "CW-Gamma"],
      mancoBloquant: Array.from({ length: 12 }, (_, index) => 10 + index * 5),
      mancoEleve: Array.from({ length: 15 }, (_, index) => 15 + index * 4),
      articles: Array.from({ length: SOURCE_COUNTS.articleRows }, (_, index) => `ART-VERIF-${pad(index + 1, 3)}`),
    };
  }

  function hashText(text) {
    return String(text || "")
      .split("")
      .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 17);
  }

  function addDaysIso(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function autoFillOrder(input) {
    const type = input.type === "MET" ? "MET" : "PROD";
    const machine = String(input.machine || "").trim().toUpperCase();
    const selectedOf = Math.max(0, Number(input.nbrLaufnote || 0));
    const seed = hashText(`${machine}-${type}-${selectedOf}`);
    const hasManualInput = Boolean(machine || selectedOf);
    const coverage = hasManualInput ? round((type === "MET" ? 0.72 : 0.88) + (seed % 22) / 100, 2) : 0;
    const itemNumber = 9000 + (seed % 700);
    const materialNumber = 4400 + ((seed * 7) % 800);
    const bars = selectedOf || 0;
    const order = {
      ...input,
      statut: input.statut || "Brouillon",
      machine,
      nbrLaufnote: selectedOf ? String(selectedOf) : "",
      type,
      date: hasManualInput ? new Date().toISOString().slice(0, 10) : "",
      item: hasManualInput ? `${type}-ART-${pad(itemNumber, 4)}` : "",
      itemMatiere: hasManualInput ? `${type}-MAT-${pad(materialNumber, 4)}` : "",
      typeMatiere: hasManualInput ? MATERIAL_TYPES[seed % MATERIAL_TYPES.length] : "",
      remarques: hasManualInput ? `Commande ${type} generee par formulaire simple` : "",
      decolleteur: hasManualInput ? OPERATEURS[(seed + 1) % OPERATEURS.length] : "",
      responsable: hasManualInput ? RESPONSABLES[(seed + 2) % RESPONSABLES.length] : "",
      of: "",
      nbrBarre: bars,
      poidsSap: hasManualInput ? round(Math.max(1, bars) * (6.5 + (seed % 15)), 1) : 0,
      enTrait: "Non",
      valdPlanif: hasManualInput ? (coverage >= 0.86 ? "Valide" : "A valider") : "",
      statutPlanif: hasManualInput ? statusFromCoverage(coverage) : "",
      tauxCouverture: coverage,
      nbrPlanif: hasManualInput ? Math.max(1, Math.round(Math.max(1, bars) * coverage)) : 0,
      wc: hasManualInput ? WCS[(seed + 3) % WCS.length] : "",
      startProd: hasManualInput ? addDaysIso(3 + (seed % 18)) : "",
      prodVer: hasManualInput ? (seed % 6) + 1 : "",
      batch: "",
    };
    return enrichOrder(order);
  }

  function makeBlankOrder() {
    return autoFillOrder({
      id: "",
      statut: "Brouillon",
      machine: "",
      nbrLaufnote: "",
      type: "PROD",
    });
  }

  function defaultArchiveActions() {
    return {
      prodVer: "",
      quantity: "",
      ...Object.fromEntries(archiveSapActions.map((action) => [action.key, action.default])),
    };
  }

  function normalizeArchiveActions(value) {
    const defaults = defaultArchiveActions();
    return {
      ...defaults,
      ...(value && typeof value === "object" ? value : {}),
    };
  }

  function makeInitialState() {
    return {
      version: 3,
      generatedAt: new Date().toISOString(),
      orders: generateOrders(SOURCE_COUNTS.archiveRows),
      references: generateReferences(),
      archiveActions: defaultArchiveActions(),
    };
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return makeInitialState();
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed.orders) || !parsed.references) return makeInitialState();
      return sanitizeStoredText({
        version: 3,
        generatedAt: parsed.generatedAt || new Date().toISOString(),
        orders: parsed.orders,
        references: parsed.references,
        archiveActions: normalizeArchiveActions(parsed.archiveActions),
      });
    } catch {
      return makeInitialState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function nextOrderId() {
    const max = state.orders.reduce((acc, order) => {
      const match = String(order.id).match(/CM-(\d+)/);
      return match ? Math.max(acc, Number(match[1])) : acc;
    }, 0);
    return `CM-${pad(max + 1, 5)}`;
  }

  function maxOfNumber() {
    return state.orders.reduce((acc, order) => {
      const match = String(order.of || "").match(/OF-(\d+)/);
      return match ? Math.max(acc, Number(match[1])) : acc;
    }, 260000);
  }

  function byId(id) {
    return state.orders.find((order) => order.id === id);
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function setView(view) {
    activeView = view;
    document.querySelectorAll(".view").forEach((el) => el.classList.toggle("active", el.id === `${view}-view`));
    document.querySelectorAll(".nav-item").forEach((el) => el.classList.toggle("active", el.dataset.view === view));
    render();
  }

  function currentOrders() {
    const status = document.querySelector("#status-filter")?.value || "all";
    const planif = document.querySelector("#planif-filter")?.value || "all";
    const minDate = currentPeriod === "all" ? null : Date.now() - Number(currentPeriod) * 86400000;
    const filtered = state.orders.filter((order) => {
      const dateOk = !minDate || new Date(order.date).getTime() >= minDate;
      return (
        (status === "all" || order.statut === status) &&
        (planif === "all" || order.statutPlanif === planif) &&
        dateOk
      );
    });
    filtered.sort((a, b) => {
      const av = a[sortState.key] ?? "";
      const bv = b[sortState.key] ?? "";
      const modifier = sortState.dir === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * modifier;
      return String(av).localeCompare(String(bv), "fr", { numeric: true }) * modifier;
    });
    return filtered;
  }

  function metrics() {
    const orders = currentOrders();
    const count = orders.length || 1;
    const ofCount = orders.filter((order) => order.of).length;
    const alerts = orders.filter((order) => ["Bloquant", "A verifier", "Hors plan"].includes(order.statutPlanif)).length;
    const coverage = orders.reduce((sum, order) => sum + Number(order.tauxCouverture || 0), 0) / count;
    const batch = orders.filter((order) => order.batch).length;
    const weight = orders.reduce((sum, order) => sum + Number(order.poidsSap || 0), 0);
    return { total: orders.length, ofCount, alerts, coverage, batch, weight };
  }

  function badgeClass(value) {
    if (["OK", "Valide", "Termine", "Lance"].includes(value)) return "green";
    if (["A verifier", "A valider", "Planifie", "OF cree", "Surplus"].includes(value)) return "amber";
    if (["Bloquant", "Bloque", "Hors plan", "Refuse"].includes(value)) return "red";
    if (["En traitement", "Imprime", "Controle"].includes(value)) return "teal";
    return "blue";
  }

  function badge(value) {
    return `<span class="badge ${badgeClass(value)}">${escapeHtml(value || "-")}</span>`;
  }

  function coverageCell(value) {
    const pct = Math.round(Number(value || 0) * 100);
    const width = clamp(pct, 0, 130);
    return `<div class="coverage"><span>${pct}%</span><div class="coverage-track"><div class="coverage-fill" style="width:${width}%"></div></div></div>`;
  }

  function renderKpis() {
    const data = metrics();
    const kpis = [
      { label: "Archives", value: data.total.toLocaleString("fr-CH"), detail: `${SOURCE_COUNTS.archiveColumns} colonnes modelisees`, icon: "A" },
      { label: "OF crees", value: data.ofCount.toLocaleString("fr-CH"), detail: `${Math.round((data.ofCount / Math.max(1, data.total)) * 100)}% du flux`, icon: "O" },
      { label: "Couverture", value: `${Math.round(data.coverage * 100)}%`, detail: "Moyenne planif", icon: "C" },
      { label: "Alertes", value: data.alerts.toLocaleString("fr-CH"), detail: "Planif a verifier", icon: "!" },
      { label: "Batch", value: data.batch.toLocaleString("fr-CH"), detail: "Lots renseignes", icon: "B" },
      { label: "Poids SAP", value: `${Math.round(data.weight).toLocaleString("fr-CH")} kg`, detail: "Somme calculee", icon: "P" },
    ];
    document.querySelector("#kpi-grid").innerHTML = kpis
      .map(
        (kpi) => `
          <article class="kpi-card">
            <div class="kpi-top"><span>${escapeHtml(kpi.label)}</span><span>${escapeHtml(kpi.icon)}</span></div>
            <strong>${escapeHtml(kpi.value)}</strong>
            <span>${escapeHtml(kpi.detail)}</span>
          </article>`,
      )
      .join("");
  }

  function renderTrendChart() {
    const orders = currentOrders();
    const grouped = new Map();
    orders.forEach((order) => {
      const key = order.date.slice(0, 7);
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });
    const entries = Array.from(grouped.entries()).sort().slice(-12);
    const max = Math.max(1, ...entries.map((entry) => entry[1]));
    const width = 760;
    const height = 260;
    const padX = 42;
    const padY = 28;
    const innerW = width - padX * 2;
    const innerH = height - padY * 2;
    const barW = entries.length ? innerW / entries.length - 8 : innerW;
    const bars = entries
      .map(([month, value], index) => {
        const x = padX + index * (innerW / entries.length) + 4;
        const h = Math.max(4, (value / max) * innerH);
        const y = height - padY - h;
        const label = month.slice(5);
        return `
          <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="#2563eb"></rect>
          <text x="${x + barW / 2}" y="${height - 8}" text-anchor="middle" class="chart-label">${label}</text>
          <text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" class="chart-label">${value}</text>`;
      })
      .join("");
    document.querySelector("#trend-chart").innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Flux mensuel">
        <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="#bdc7d6"></line>
        ${bars}
      </svg>`;
  }

  function renderStatusBars() {
    const orders = currentOrders();
    const counts = STATUSES.map((status) => ({
      status,
      count: orders.filter((order) => order.statut === status).length,
    })).filter((entry) => entry.count > 0);
    const max = Math.max(1, ...counts.map((entry) => entry.count));
    document.querySelector("#status-bars").innerHTML = counts
      .map(
        (entry) => `
        <div class="bar-row">
          <span>${escapeHtml(entry.status)}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round((entry.count / max) * 100)}%"></div></div>
          <strong>${entry.count}</strong>
        </div>`,
      )
      .join("");
  }

  function renderAlerts() {
    const alerts = currentOrders()
      .filter((order) => ["Bloquant", "A verifier", "Hors plan"].includes(order.statutPlanif))
      .slice(0, 6);
    document.querySelector("#alert-count").textContent = String(alerts.length);
    document.querySelector("#alert-list").innerHTML = alerts
      .map(
        (order) => `
        <button class="alert-item" type="button" data-edit-id="${order.id}">
          <strong>${escapeHtml(order.item)}</strong>
          <span>${badge(order.statutPlanif)}</span>
          <span class="meta-line">${escapeHtml(order.machine)} - ${formatDate(order.startProd)} - ${escapeHtml(order.responsable)}</span>
        </button>`,
      )
      .join("");
  }

  function renderDashboard() {
    renderKpis();
    renderTrendChart();
    renderStatusBars();
    renderAlerts();
  }

  function fieldInput(field, value, extraClass = "") {
    const common = `id="field-${field.key}" name="${field.key}" data-field="${field.key}"`;
    if (field.type === "select") {
      return `<select class="${extraClass}" ${common}>${field.options
        .map((option) => `<option value="${escapeHtml(option)}"${option === value ? " selected" : ""}>${escapeHtml(option)}</option>`)
        .join("")}</select>`;
    }
    if (field.type === "textarea") {
      return `<textarea class="${extraClass}" ${common}>${escapeHtml(value)}</textarea>`;
    }
    const min = field.min !== undefined ? ` min="${field.min}"` : "";
    const step = field.step ? ` step="${field.step}"` : "";
    const placeholder = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : "";
    return `<input class="${extraClass}" ${common} type="${field.type}" value="${escapeHtml(value)}"${min}${step}${placeholder} />`;
  }

  function formatAutoValue(order, key) {
    if (key === "date" || key === "startProd") return formatDate(order[key]);
    if (key === "poidsSap") return order[key] ? `${Number(order[key]).toLocaleString("fr-CH")} kg` : "";
    if (key === "tauxCouverture") return order[key] ? `${Math.round(Number(order[key]) * 100)}%` : "";
    return order[key] ?? "";
  }

  function autoFieldsHtml(order) {
    return autoOrderFields
      .map(
        (field) => `
        <div class="auto-field">
          <span>${escapeHtml(field.label)}</span>
          <strong>${escapeHtml(formatAutoValue(order, field.key) || "-")}</strong>
        </div>`,
      )
      .join("");
  }

  function renderOrderForm() {
    const source = currentOrderId ? byId(currentOrderId) || draftOrder : draftOrder;
    const order = autoFillOrder(source);
    draftOrder = { ...order };
    const manual = manualOrderFields
      .map((field) => {
        return `
          <div class="field manual-field">
            <label for="field-${field.key}">${escapeHtml(field.label)}</label>
            ${fieldInput(field, order[field.key] ?? "", "manual-input")}
          </div>`;
      })
      .join("");
    const automatic = autoFieldsHtml(order);
    document.querySelector("#order-form").innerHTML = `
      <div class="simple-form-section manual-section">
        <div class="form-band-title">
          <span>Champs blancs</span>
          <strong>A remplir</strong>
        </div>
        <div class="manual-grid">${manual}</div>
      </div>
      <div class="simple-form-section auto-section">
        <div class="form-band-title">
          <span>Remplissage automatique</span>
          <strong>${escapeHtml(order.type || "PROD")}</strong>
        </div>
        <div class="auto-grid">${automatic}</div>
      </div>`;
    document.querySelector("#selected-order-label").textContent = currentOrderId || "Pret";
    renderEmailPreview(order);
  }

  function refreshAutoPreview() {
    const order = readOrderForm();
    draftOrder = { ...order };
    const autoGrid = document.querySelector("#order-form .auto-grid");
    const autoTitle = document.querySelector("#order-form .auto-section .form-band-title strong");
    if (autoGrid) autoGrid.innerHTML = autoFieldsHtml(order);
    if (autoTitle) autoTitle.textContent = order.type || "PROD";
    renderWorkflow();
    renderEmailPreview(order);
  }

  function renderWorkflow() {
    const order = autoFillOrder(currentOrderId ? byId(currentOrderId) || draftOrder : draftOrder);
    const target = order.type === "MET" ? "atelier MET" : "atelier PROD";
    document.querySelector("#workflow-toggles").innerHTML = `
      <div class="email-steps">
        <div><span>Destinataire</span><strong>${escapeHtml(target)}</strong></div>
        <div><span>Objet</span><strong>${escapeHtml(order.item || "En attente saisie")}</strong></div>
        <div><span>Archive</span><strong>Ligne ajoutee apres envoi</strong></div>
      </div>`;
  }

  function renderEmailPreview(order) {
    const target = document.querySelector("#email-preview");
    if (!order.machine || !order.nbrLaufnote) {
      target.innerHTML = `<strong>Email en attente</strong><br>Renseigner machine, nombre OF et type.`;
      return;
    }
    target.innerHTML = `<strong>Email pret</strong><br>${escapeHtml(order.type)} - ${escapeHtml(order.machine)} - ${escapeHtml(order.nbrLaufnote)} OF - ${escapeHtml(order.item)}`;
  }

  function readOrderForm() {
    const form = document.querySelector("#order-form");
    const formData = new FormData(form);
    const order = { ...(currentOrderId ? byId(currentOrderId) : draftOrder) };
    manualOrderFields.forEach((field) => {
      let value = formData.get(field.key);
      if (field.type === "number") value = Number(value || 0);
      order[field.key] = value;
    });
    order.id = currentOrderId || order.id || "";
    return autoFillOrder(order);
  }

  function upsertOrder(order, front = false) {
    if (!order.id) order.id = nextOrderId();
    const index = state.orders.findIndex((item) => item.id === order.id);
    if (index >= 0) {
      state.orders[index] = order;
    } else if (front) {
      state.orders.unshift(order);
    } else {
      state.orders.push(order);
    }
    currentOrderId = order.id;
    draftOrder = { ...order };
    saveState();
  }

  function sendEmailToArchive() {
    const order = readOrderForm();
    if (!order.machine || !Number(order.nbrLaufnote)) {
      showToast("Machine et nombre OF sont obligatoires");
      renderEmailPreview(order);
      return;
    }
    order.statut = "A planifier";
    order.emailSent = true;
    order.emailSentAt = new Date().toISOString();
    order.emailTarget = order.type === "MET" ? "atelier MET" : "atelier PROD";
    upsertOrder(order, !currentOrderId);
    const archivedId = order.id;
    currentOrderId = null;
    draftOrder = makeBlankOrder();
    showToast(`Email envoye, ligne ${archivedId} ajoutee aux archives`);
    render();
  }

  function archiveOrder() {
    sendEmailToArchive();
  }

  function resetForm() {
    currentOrderId = null;
    draftOrder = makeBlankOrder();
    renderOrderForm();
    showToast("Formulaire reinitialise");
  }

  function renderFilters() {
    const statusSelect = document.querySelector("#status-filter");
    const planifSelect = document.querySelector("#planif-filter");
    const currentStatus = statusSelect.value || "all";
    const currentPlanif = planifSelect.value || "all";
    statusSelect.innerHTML = `<option value="all">Tous statuts</option>${STATUSES.map((status) => `<option value="${status}">${status}</option>`).join("")}`;
    planifSelect.innerHTML = `<option value="all">Toute planif</option>${PLANIF_STATUSES.map((status) => `<option value="${status}">${status}</option>`).join("")}`;
    statusSelect.value = currentStatus;
    planifSelect.value = currentPlanif;
  }

  function selectedOrders() {
    return state.orders.filter((order) => selectedIds.has(order.id));
  }

  function archiveActionToggle(action) {
    const checked = state.archiveActions[action.key] ? "checked" : "";
    return `
      <label class="sap-option">
        <input type="checkbox" data-archive-action="${action.key}" ${checked} />
        <span class="sap-checkmark" aria-hidden="true"></span>
        <strong>${escapeHtml(action.label)}</strong>
        <small>${escapeHtml(action.effect)}</small>
      </label>`;
  }

  function renderArchiveActions() {
    const target = document.querySelector("#archive-actions");
    const selectedCount = selectedIds.size;
    const reglages = archiveSapActions.filter((action) => action.group === "reglages").map(archiveActionToggle).join("");
    const dispo = archiveSapActions.filter((action) => action.group === "dispo").map(archiveActionToggle).join("");
    target.innerHTML = `
      <div class="archive-actions-head">
        <div>
          <span class="eyebrow">Actions SAP</span>
          <h3>Archives</h3>
        </div>
        <button class="primary-button sap-go sap-global-go" type="button" data-sap-run="auto">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7-11-7Z" /></svg>
          GO
        </button>
      </div>
      <div class="archive-actions-meta">
        <div class="selected-pill">
          <span>${selectedCount.toLocaleString("fr-CH")}</span>
          <strong>ligne${selectedCount > 1 ? "s" : ""} cochee${selectedCount > 1 ? "s" : ""}</strong>
        </div>
        <p>Prend les champs remplis et les cases cochees pour executer les actions SAP.</p>
      </div>
      <div class="sap-action-grid">
        <section class="sap-action-block">
          <div class="sap-action-title">
            <span>OF</span>
          </div>
          <div class="sap-input-row">
            <label>
              <span>PROD VERS</span>
              <input class="sap-input" data-archive-field="prodVer" inputmode="numeric" value="${escapeHtml(state.archiveActions.prodVer)}" />
            </label>
            <label>
              <span>QUANTITEE</span>
              <input class="sap-input" data-archive-field="quantity" inputmode="numeric" value="${escapeHtml(state.archiveActions.quantity)}" />
            </label>
          </div>
        </section>
        <section class="sap-action-block">
          <div class="sap-action-title">
            <span>REGLAGES</span>
          </div>
          <div class="sap-options-grid">${reglages}</div>
        </section>
        <section class="sap-action-block">
          <div class="sap-action-title">
            <span>DISPO</span>
          </div>
          <div class="sap-options-grid">${dispo}</div>
        </section>
      </div>`;
  }

  function renderArchiveTable() {
    renderFilters();
    renderArchiveActions();
    const table = document.querySelector("#archive-table");
    const orders = currentOrders();
    const totalPages = Math.max(1, Math.ceil(orders.length / rowsPerPage));
    page = clamp(page, 1, totalPages);
    const start = (page - 1) * rowsPerPage;
    const rows = orders.slice(start, start + rowsPerPage);
    document.querySelector("#archive-summary").textContent = `${orders.length.toLocaleString("fr-CH")} lignes filtrees`;
    document.querySelector("#page-label").textContent = `Page ${page} / ${totalPages}`;
    document.querySelector("#prev-page").disabled = page <= 1;
    document.querySelector("#next-page").disabled = page >= totalPages;
    document.querySelector("#bulk-planifie").disabled = selectedIds.size === 0;

    table.querySelector("thead").innerHTML = `
      <tr>
        <th><input type="checkbox" id="select-page" aria-label="Selectionner la page"></th>
        ${archiveColumns
          .map(
            (column) => `<th><button class="table-sort" type="button" data-sort="${column.key}">${escapeHtml(column.label)}</button></th>`,
          )
          .join("")}
        <th>Action</th>
      </tr>`;
    table.querySelector("tbody").innerHTML = rows
      .map(
        (order) => `
        <tr>
          <td><input type="checkbox" data-select-id="${order.id}" ${selectedIds.has(order.id) ? "checked" : ""} aria-label="Selectionner ${order.id}"></td>
          <td>${badge(order.statut)}</td>
          <td>${escapeHtml(order.machine)}</td>
          <td>${escapeHtml(order.nbrLaufnote)}</td>
          <td>${escapeHtml(order.item)}</td>
          <td>${escapeHtml(order.itemMatiere)}</td>
          <td>${escapeHtml(order.typeMatiere)}</td>
          <td>${escapeHtml(order.responsable)}</td>
          <td>${formatDate(order.date)}</td>
          <td>${escapeHtml(order.of || "-")}</td>
          <td>${Number(order.poidsSap || 0).toLocaleString("fr-CH")} kg</td>
          <td>${badge(order.valdPlanif)}</td>
          <td>${badge(order.statutPlanif)}</td>
          <td>${coverageCell(order.tauxCouverture)}</td>
          <td>${escapeHtml(order.nbrPlanif)}</td>
          <td>${escapeHtml(order.wc)}</td>
          <td>${escapeHtml(order.type)}</td>
          <td>${formatDate(order.startProd)}</td>
          <td>${escapeHtml(order.prodVer)}</td>
          <td>${escapeHtml(order.batch || "-")}</td>
          <td><button class="row-action" type="button" data-edit-id="${order.id}">Editer</button></td>
        </tr>`,
      )
      .join("");
  }

  function referenceInput(value, dataset, index, key = "") {
    return `<input class="cell-input" data-ref-dataset="${dataset}" data-ref-index="${index}" data-ref-key="${key}" value="${escapeHtml(value)}" />`;
  }

  function renderReferenceCard(title, dataset, items, columns) {
    const rows = items
      .map((item, index) => {
        if (columns) {
          return `<div class="reference-row multi">${columns
            .map((column) => referenceInput(item[column.key], dataset, index, column.key))
            .join("")}</div>`;
        }
        return `<div class="reference-row">${referenceInput(item, dataset, index)}<span class="badge blue">${index + 1}</span></div>`;
      })
      .join("");
    return `
      <section class="reference-card">
        <header>
          <h3>${escapeHtml(title)}</h3>
          <button class="mini-button" type="button" data-add-ref="${dataset}">Ajouter</button>
        </header>
        <div class="reference-list">${rows}</div>
      </section>`;
  }

  function renderReferences() {
    const refs = state.references;
    document.querySelector("#reference-grid").innerHTML = [
      renderReferenceCard("SPC", "spc", refs.spc, [
        { key: "poste" },
        { key: "decolleteur" },
      ]),
      renderReferenceCard("Options", "options", refs.options, [
        { key: "type" },
        { key: "description" },
      ]),
      renderReferenceCard("MET", "met", refs.met),
      renderReferenceCard("EN CW724R", "cw724r", refs.cw724r),
      renderReferenceCard("Manco bloquant", "mancoBloquant", refs.mancoBloquant),
      renderReferenceCard("Manco eleve", "mancoEleve", refs.mancoEleve),
      renderReferenceCard("Articles verif", "articles", refs.articles),
    ].join("");
  }

  function renderSideCount() {
    document.querySelector("#side-count").textContent = `${state.orders.length.toLocaleString("fr-CH")} archives`;
  }

  function render() {
    renderSideCount();
    if (activeView === "dashboard") renderDashboard();
    if (activeView === "commandes") {
      renderOrderForm();
      renderWorkflow();
    }
    if (activeView === "archives") renderArchiveTable();
    if (activeView === "referentiels") renderReferences();
  }

  function editOrder(id) {
    const order = byId(id);
    if (!order) return;
    currentOrderId = id;
    draftOrder = { ...order };
    setView("commandes");
  }

  function addReference(dataset) {
    const refs = state.references;
    if (dataset === "spc") refs.spc.push({ poste: `SPC-${pad(refs.spc.length + 1, 3)}`, decolleteur: "Cellule" });
    else if (dataset === "options") refs.options.push({ type: `Option-${pad(refs.options.length + 1, 2)}`, description: "Nouvelle option", actif: true });
    else refs[dataset].push(dataset.startsWith("manco") ? refs[dataset].length * 5 + 20 : `Nouvelle valeur ${refs[dataset].length + 1}`);
    saveState();
    renderReferences();
    showToast("Reference ajoutee");
  }

  function bulkPlanifie() {
    state.orders = state.orders.map((order) => {
      if (!selectedIds.has(order.id)) return order;
      return {
        ...order,
        statut: "Planifie",
        statutPlanif: "OK",
        valdPlanif: "Valide",
        tauxCouverture: Math.max(Number(order.tauxCouverture || 0), 0.95),
      };
    });
    selectedIds = new Set();
    saveState();
    renderArchiveTable();
    showToast("Selection planifiee");
  }

  function readArchiveActions() {
    const values = normalizeArchiveActions(state.archiveActions);
    document.querySelectorAll("[data-archive-action]").forEach((input) => {
      values[input.dataset.archiveAction] = input.checked;
    });
    document.querySelectorAll("[data-archive-field]").forEach((input) => {
      values[input.dataset.archiveField] = input.value.trim();
    });
    state.archiveActions = values;
    saveState();
    return values;
  }

  function appendNote(order, note) {
    const current = String(order.remarques || "").trim();
    if (current.includes(note)) return current;
    return current ? `${current} | ${note}` : note;
  }

  function applyOfSapResult(ids, settings) {
    let ofNumber = maxOfNumber();
    state.orders = state.orders.map((order) => {
      if (!ids.has(order.id)) return order;
      const next = { ...order };
      if (!next.of) {
        ofNumber += 7;
        next.of = `OF-${ofNumber}`;
      }
      next.statut = "OF cree";
      next.enTrait = "Oui";
      next.valdPlanif = "Valide";
      next.statutPlanif = next.tauxCouverture < 0.65 ? "A verifier" : "OK";
      if (settings.prodVer) next.prodVer = Number(settings.prodVer) || settings.prodVer;
      if (settings.quantity) next.nbrPlanif = Number(settings.quantity) || next.nbrPlanif;
      next.remarques = appendNote(next, "OF SAP cree");
      return next;
    });
  }

  function applyDispoSapResult(ids, settings) {
    state.orders = state.orders.map((order, index) => {
      if (!ids.has(order.id)) return order;
      const next = { ...order };
      if (settings.pldord) next.statut = "Planifie";
      if (settings.release) next.statut = "Lance";
      if (settings.fstr) next.valdPlanif = "Valide";
      if (settings.confOp05) next.valdPlanif = "Valide";
      if (settings.print) next.enTrait = "Imprime";
      if (settings.picking) {
        next.statut = "En traitement";
        if (!next.batch) next.batch = `BATCH-${pad((Date.now() + index) % 1000000, 6)}`;
      }
      if (settings.etiquette) next.statut = "Termine";
      if (settings.surplus) next.statutPlanif = "Surplus";
      else if (settings.release || settings.pldord || settings.confOp05) next.statutPlanif = "OK";
      if (settings.suppSetup) next.remarques = appendNote(next, "Setup supprime SAP");
      if (settings.prodVer) next.prodVer = Number(settings.prodVer) || settings.prodVer;
      if (settings.quantity) next.nbrPlanif = Number(settings.quantity) || next.nbrPlanif;
      next.tauxCouverture = settings.surplus ? Math.max(Number(next.tauxCouverture || 0), 1.18) : Math.max(Number(next.tauxCouverture || 0), 0.95);
      return next;
    });
  }

  function selectedActionLabels(settings, group = null) {
    return archiveSapActions
      .filter((action) => (!group || action.group === group) && settings[action.key])
      .map((action) => action.label);
  }

  function buildSapSteps(type, orders, settings) {
    const count = orders.length.toLocaleString("fr-CH");
    const fieldSteps = [
      settings.prodVer ? { label: "PROD VERS", detail: `Production version appliquee: ${settings.prodVer}` } : null,
      settings.quantity ? { label: "QUANTITEE", detail: `Quantite planifiee appliquee: ${settings.quantity}` } : null,
    ].filter(Boolean);
    const checkedActions = selectedActionLabels(settings).map((label) => ({
      label,
      detail: `Execution option ${label} dans SAP`,
    }));
    const base = [
      { label: "SAP_START", detail: "Connexion a SAP GUI" },
      { label: "Lecture Archives", detail: `${count} ligne${orders.length > 1 ? "s" : ""} selectionnee${orders.length > 1 ? "s" : ""}` },
      { label: "Controle articles", detail: "Verification item, matiere, machine et quantite" },
    ];
    return [
      ...base,
      ...fieldSteps,
      { label: "OF", detail: "Creation ou reprise des ordres de fabrication" },
      ...(checkedActions.length ? checkedActions : [{ label: "DISPO", detail: "Aucune case cochee, seul l'OF est mis a jour" }]),
      { label: "Retour Archives", detail: "Champs, statuts et actions cochees mis a jour" },
      { label: "MESSAGE", detail: "Confirmation utilisateur" },
    ];
  }

  function renderSapLog(steps, activeIndex, done) {
    const log = document.querySelector("#sap-log");
    log.innerHTML = steps
      .map((step, index) => {
        const status = done || index < activeIndex ? "done" : index === activeIndex ? "active" : "pending";
        const statusLabel = status === "done" ? "Termine" : status === "active" ? "En cours" : "Attente";
        return `
          <div class="sap-log-row ${status}">
            <span class="sap-log-dot" aria-hidden="true"></span>
            <div>
              <strong>${escapeHtml(step.label)}</strong>
              <span>${escapeHtml(step.detail)}</span>
            </div>
            <em>${statusLabel}</em>
          </div>`;
      })
      .join("");
  }

  function openSapModal(type, orders, steps) {
    const modal = document.querySelector("#sap-modal");
    modal.hidden = false;
    document.querySelector("#sap-modal-title").textContent = "GO SAP";
    document.querySelector("#sap-run-meta").innerHTML = `
      <span>${orders.length.toLocaleString("fr-CH")} ligne${orders.length > 1 ? "s" : ""}</span>
      <span>OF + actions cochees</span>`;
    document.querySelector("#sap-progress-fill").style.width = "0%";
    document.querySelector("#sap-progress-label").textContent = "0%";
    document.querySelector("#sap-current-step").textContent = "Initialisation";
    document.querySelector("#sap-step-count").textContent = `0/${steps.length}`;
    document.querySelector("#sap-close").disabled = true;
    renderSapLog(steps, 0, false);
  }

  function updateSapModal(steps, activeIndex, done = false) {
    const progress = done ? 100 : Math.round((activeIndex / Math.max(1, steps.length)) * 100);
    const current = done ? "Execution terminee" : steps[activeIndex]?.detail || "Execution";
    document.querySelector("#sap-progress-fill").style.width = `${progress}%`;
    document.querySelector("#sap-progress-label").textContent = `${progress}%`;
    document.querySelector("#sap-current-step").textContent = current;
    document.querySelector("#sap-step-count").textContent = `${done ? steps.length : activeIndex + 1}/${steps.length}`;
    renderSapLog(steps, activeIndex, done);
  }

  function delay(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  async function runSapAction(type) {
    if (sapRunning) return;
    const orders = selectedOrders();
    const settings = readArchiveActions();
    if (!orders.length) {
      showToast("Coche au moins une ligne archive");
      renderArchiveActions();
      return;
    }
    const steps = buildSapSteps(type, orders, settings);
    const ids = new Set(orders.map((order) => order.id));
    sapRunning = true;
    renderArchiveActions();
    openSapModal(type, orders, steps);
    for (let index = 0; index < steps.length; index += 1) {
      updateSapModal(steps, index, false);
      await delay(460);
    }
    applyOfSapResult(ids, settings);
    if (selectedActionLabels(settings).length) applyDispoSapResult(ids, settings);
    saveState();
    sapRunning = false;
    renderArchiveTable();
    updateSapModal(steps, steps.length - 1, true);
    document.querySelector("#sap-close").disabled = false;
    showToast("GO SAP execute");
  }

  function initEvents() {
    const on = (selector, eventName, handler) => {
      const element = document.querySelector(selector);
      if (element) element.addEventListener(eventName, handler);
    };
    document.querySelectorAll(".nav-item").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });
    on("#archive-order", "click", archiveOrder);
    on("#reset-form", "click", resetForm);
    on("#sap-close", "click", () => {
      if (!sapRunning) document.querySelector("#sap-modal").hidden = true;
    });
    document.querySelector("#prev-page").addEventListener("click", () => {
      page -= 1;
      renderArchiveTable();
    });
    document.querySelector("#next-page").addEventListener("click", () => {
      page += 1;
      renderArchiveTable();
    });
    document.querySelector("#bulk-planifie").addEventListener("click", bulkPlanifie);
    document.querySelector("#status-filter").addEventListener("change", () => {
      page = 1;
      renderArchiveTable();
    });
    document.querySelector("#planif-filter").addEventListener("change", () => {
      page = 1;
      renderArchiveTable();
    });
    document.querySelectorAll("[data-period]").forEach((button) => {
      button.addEventListener("click", () => {
        currentPeriod = button.dataset.period;
        document.querySelectorAll("[data-period]").forEach((item) => item.classList.toggle("selected", item === button));
        renderDashboard();
      });
    });

    document.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-edit-id]");
      if (editButton) editOrder(editButton.dataset.editId);
      const sortButton = event.target.closest("[data-sort]");
      if (sortButton) {
        const key = sortButton.dataset.sort;
        sortState = {
          key,
          dir: sortState.key === key && sortState.dir === "asc" ? "desc" : "asc",
        };
        renderArchiveTable();
      }
      const addRef = event.target.closest("[data-add-ref]");
      if (addRef) addReference(addRef.dataset.addRef);
      const sapButton = event.target.closest("[data-sap-run]");
      if (sapButton) runSapAction(sapButton.dataset.sapRun);
    });

    document.addEventListener("input", (event) => {
      const formInput = event.target.closest("[data-field]");
      if (formInput && activeView === "commandes") refreshAutoPreview();
      const archiveField = event.target.closest("[data-archive-field]");
      if (archiveField) {
        state.archiveActions[archiveField.dataset.archiveField] = archiveField.value.trim();
        saveState();
      }
    });

    document.addEventListener("change", (event) => {
      const archiveAction = event.target.closest("[data-archive-action]");
      if (archiveAction) {
        state.archiveActions[archiveAction.dataset.archiveAction] = archiveAction.checked;
        saveState();
      }
      const selected = event.target.closest("[data-select-id]");
      if (selected) {
        if (selected.checked) selectedIds.add(selected.dataset.selectId);
        else selectedIds.delete(selected.dataset.selectId);
        document.querySelector("#bulk-planifie").disabled = selectedIds.size === 0;
        renderArchiveActions();
      }
      if (event.target.id === "select-page") {
        document.querySelectorAll("[data-select-id]").forEach((checkbox) => {
          checkbox.checked = event.target.checked;
          if (checkbox.checked) selectedIds.add(checkbox.dataset.selectId);
          else selectedIds.delete(checkbox.dataset.selectId);
        });
        document.querySelector("#bulk-planifie").disabled = selectedIds.size === 0;
        renderArchiveActions();
      }
      const refInput = event.target.closest("[data-ref-dataset]");
      if (refInput) {
        const dataset = refInput.dataset.refDataset;
        const index = Number(refInput.dataset.refIndex);
        const key = refInput.dataset.refKey;
        if (key) state.references[dataset][index][key] = refInput.value;
        else state.references[dataset][index] = dataset.startsWith("manco") ? Number(refInput.value || 0) : refInput.value;
        saveState();
      }
      const formInput = event.target.closest("[data-field]");
      if (formInput && activeView === "commandes") refreshAutoPreview();
    });
  }

  function init() {
    saveState();
    initEvents();
    setView(activeView);
  }

  document.addEventListener("DOMContentLoaded", init);
})();

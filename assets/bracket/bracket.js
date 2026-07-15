// Bracket — a config-driven, pairwise ranking engine (Swiss-system tournament).
//
// This file is media-agnostic. It ranks any list of items by repeatedly asking
// the user to pick a winner between two of them. Instead of a full sort
// (~n*log2(n) comparisons), it runs a fixed number of Swiss rounds where items
// with similar records are paired against each other. After all rounds, items
// bucket into tiers by win count; a Buchholz tiebreaker (sum of opponents'
// wins) orders items within a tier.
//
//   For 64 items: 5 rounds = 160 comparisons (vs ~296 for a full sort).
//   Fewer rounds = fewer comparisons, coarser tiers.
//
// To make a ranker, provide three globals before loading this script:
//   window.ITEMS   — array of { id, title, ... } (see config.js / README).
//   window.ART     — optional map of id -> image URL (see fetch-art.js).
//   window.BRACKET — config describing labels + how to render each item.
//
// The config contract (all fields optional except where noted):
//   noun          singular label, e.g. "album"            (default "item")
//   nounPlural    plural label, e.g. "albums"             (default noun + "s")
//   prompt        matchup heading, e.g. "Which do you prefer?"
//   defaultRounds default value of the rounds slider      (default 5)
//   maxRounds     cap on the rounds slider                (default 10)
//   cardLines(item)  -> [ { text, className } ]  extra lines under the title
//   link(item)       -> { href, label, site } | null  external link pill
//   listLine(item)   -> string  suffix after the title in standings/results
//   jsonFields       -> [ "field", ... ]  extra keys included in JSON export
//
// All item-derived text is escaped by the engine, so config functions return
// plain strings/data, never HTML.

// --- Config ---
const CFG = window.BRACKET || {};
const NOUN = CFG.noun || "item";
const NOUN_PLURAL = CFG.nounPlural || NOUN + "s";
const PROMPT = CFG.prompt || "Which do you prefer?";
const DEFAULT_ROUNDS = CFG.defaultRounds || 5;
const MAX_ROUNDS_CAP = CFG.maxRounds || 10;
const cardLinesFn = typeof CFG.cardLines === "function" ? CFG.cardLines : () => [];
const linkFn = typeof CFG.link === "function" ? CFG.link : () => null;
const listLineFn = typeof CFG.listLine === "function" ? CFG.listLine : () => "";
const JSON_FIELDS = Array.isArray(CFG.jsonFields) ? CFG.jsonFields : [];

const ITEMS = Array.isArray(window.ITEMS) ? window.ITEMS : [];
const ART = window.ART || {};

// --- DOM refs ---
const setupSection = document.getElementById("setup-section");
const itemCountEl = document.getElementById("item-count");
const itemNounEl = document.getElementById("item-noun");
const roundSlider = document.getElementById("round-slider");
const roundDisplay = document.getElementById("round-display");
const comparisonEstimate = document.getElementById("comparison-estimate");
const startBtn = document.getElementById("start-btn");

const progressSection = document.getElementById("progress-section");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const matchupSection = document.getElementById("matchup-section");
const matchupPrompt = document.getElementById("matchup-prompt");
const roundInfo = document.getElementById("round-info");
const cardA = document.getElementById("card-a");
const cardB = document.getElementById("card-b");

const standingsSection = document.getElementById("standings-section");
const standingsEl = document.getElementById("standings");

const resultsSection = document.getElementById("results-section");
const finalTiersEl = document.getElementById("final-tiers");
const jsonOutput = document.getElementById("json-output");
const copyBtn = document.getElementById("copy-json");
const emailBtn = document.getElementById("email-results");
const restartBtn = document.getElementById("restart");

// --- State ---
let stats = new Map(); // itemId -> { wins, opponents[], hadBye, buchholz }
let comparisonsDone = 0;
let totalComparisons = 0;
let currentRound = 0;
let totalRounds = 0;
let roundMatchups = 0;
let roundMatchupsDone = 0;
let pendingResolve = null;
let lastRanking = null;

// --- Utilities ---
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

function escAttr(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// --- Swiss pairing ---
// Groups items by win count, shuffles within groups, pairs adjacent items,
// avoids rematches when possible. Gives a bye to the lowest-ranked item
// if the count is odd.
function swissPair(items) {
  const groups = new Map();
  for (const a of items) {
    const w = stats.get(a.id).wins;
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(a);
  }
  const sorted = [];
  for (const k of [...groups.keys()].sort((a, b) => b - a)) {
    sorted.push(...shuffle([...groups.get(k)]));
  }

  // Handle odd count: bye goes to the lowest item that hasn't had one yet.
  let byeItem = null;
  if (sorted.length % 2 !== 0) {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (!stats.get(sorted[i].id).hadBye) {
        byeItem = sorted.splice(i, 1)[0];
        break;
      }
    }
    if (!byeItem) {
      byeItem = sorted.pop();
    }
    stats.get(byeItem.id).wins++;
    stats.get(byeItem.id).hadBye = true;
  }

  // Pair adjacent items, preferring no rematch.
  const pairs = [];
  const used = new Set();

  for (let i = 0; i < sorted.length; i++) {
    if (used.has(sorted[i].id)) continue;
    const faced = new Set(stats.get(sorted[i].id).opponents);
    let bestJ = -1;

    for (let j = i + 1; j < sorted.length; j++) {
      if (used.has(sorted[j].id)) continue;
      if (!faced.has(sorted[j].id)) { bestJ = j; break; }
      if (bestJ === -1) bestJ = j; // fallback: allow rematch
    }

    if (bestJ !== -1) {
      pairs.push([sorted[i], sorted[bestJ]]);
      used.add(sorted[i].id);
      used.add(sorted[bestJ].id);
    }
  }

  return { pairs, byeItem };
}

// --- UI: matchup ---
function artImg(item, cls) {
  if (ART[item.id]) {
    return `<img class="${cls}" src="${escAttr(ART[item.id])}" alt="" onerror="this.remove()">`;
  }
  return "";
}

function linesHtml(item) {
  const lines = cardLinesFn(item) || [];
  return lines
    .filter((l) => l && l.text != null && String(l.text).length > 0)
    .map((l) => `<div class="${escAttr(l.className || "meta")}">${esc(l.text)}</div>`)
    .join("");
}

function linkHtml(item) {
  const link = linkFn(item);
  if (!link || !link.href) return "";
  const site = link.site || link.label || "link";
  return `<a class="ext-link" href="${escAttr(link.href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escAttr(item.title)} on ${escAttr(site)}">${esc(link.label || site)}</a>`;
}

function cardHtml(item) {
  return `${artImg(item, "card-art")}<div class="card-text"><div class="title">${esc(item.title)}</div>${linesHtml(item)}</div>${linkHtml(item)}`;
}

function renderCard(cardEl, item) {
  cardEl.innerHTML = cardHtml(item);
  cardEl.classList.toggle("card--link", !!linkFn(item));
  cardEl.setAttribute("aria-label", `Choose ${item.title}`);
  cardEl.onclick = () => choose(item);
  cardEl.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(item);
    }
  };
  const link = cardEl.querySelector(".ext-link");
  if (link) link.addEventListener("click", (e) => e.stopPropagation());
}

function renderMatchup(a, b) {
  renderCard(cardA, a);
  renderCard(cardB, b);
}

function choose(item) {
  if (!pendingResolve) return;
  const r = pendingResolve;
  pendingResolve = null;
  comparisonsDone++;
  updateProgress();
  r(item);
}

function pickWinner(a, b) {
  renderMatchup(a, b);
  return new Promise((resolve) => { pendingResolve = resolve; });
}

// --- UI: progress ---
function buildProgressBar(numRounds) {
  progressBar.innerHTML = "";
  for (let i = 1; i <= numRounds; i++) {
    const seg = document.createElement("div");
    seg.className = "progress-segment";
    seg.dataset.round = i;
    const fill = document.createElement("div");
    fill.className = "segment-fill";
    const label = document.createElement("span");
    label.className = "segment-label";
    label.textContent = i;
    seg.appendChild(fill);
    seg.appendChild(label);
    progressBar.appendChild(seg);
  }
}

function updateProgress() {
  const segments = progressBar.querySelectorAll(".progress-segment");
  segments.forEach((seg) => {
    const r = parseInt(seg.dataset.round, 10);
    const fill = seg.querySelector(".segment-fill");
    if (r < currentRound) {
      fill.style.width = "100%";
      seg.classList.add("completed");
      seg.classList.remove("active");
    } else if (r === currentRound) {
      const pct = roundMatchups > 0 ? Math.round((roundMatchupsDone / roundMatchups) * 100) : 0;
      fill.style.width = pct + "%";
      seg.classList.add("active");
      seg.classList.remove("completed");
    } else {
      fill.style.width = "0%";
      seg.classList.remove("active", "completed");
    }
  });
  progressText.textContent = `Round ${currentRound} of ${totalRounds} — ${comparisonsDone} of ${totalComparisons} comparisons`;
}

// --- UI: standings (updates after each round) ---
function tierListHtml(items, tag) {
  const groups = new Map();
  for (const a of items) {
    const w = stats.get(a.id).wins;
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(a);
  }

  const sortedKeys = [...groups.keys()].sort((a, b) => b - a);
  let html = "";
  let rank = 1;
  let tierNum = 1;

  for (const w of sortedKeys) {
    const tier = groups.get(w);
    if (tag === "ul") {
      const stars = w > 0 ? "\u2605".repeat(w) : "\u2606";
      html += `<div class="tier-group"><div class="tier-label">${stars} ${w} win${w !== 1 ? "s" : ""} (${tier.length})</div><ul>`;
    } else {
      html += `<div class="tier-group"><h3>Tier ${tierNum} \u2014 ${w} win${w !== 1 ? "s" : ""}</h3><ol start="${rank}">`;
    }
    for (const a of tier) {
      const thumb = artImg(a, "list-art");
      const sub = listLineFn(a) || "";
      html += `<li>${thumb}<strong>${esc(a.title)}</strong>${sub ? `<span class="list-sub">${esc(sub)}</span>` : ""}</li>`;
    }
    html += tag === "ul" ? "</ul></div>" : "</ol></div>";
    rank += tier.length;
    tierNum++;
  }
  return html;
}

function renderStandings(items) {
  standingsEl.innerHTML = tierListHtml(items, "ul");
}

// --- UI: final results ---
function showFinalResults(ranked) {
  matchupSection.classList.add("hidden");
  standingsSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  finalTiersEl.innerHTML = tierListHtml(ranked, "ol");

  // JSON output
  const groups = new Map();
  for (const a of ranked) {
    const w = stats.get(a.id).wins;
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(a);
  }
  const sortedKeys = [...groups.keys()].sort((a, b) => b - a);

  let rank = 1;
  let tierNum = 1;
  const json = [];
  for (const w of sortedKeys) {
    for (const a of groups.get(w)) {
      const entry = { rank: rank++, tier: tierNum, id: a.id, title: a.title, wins: w };
      for (const f of JSON_FIELDS) {
        if (a[f] !== undefined) entry[f] = a[f];
      }
      json.push(entry);
    }
    tierNum++;
  }
  jsonOutput.value = JSON.stringify(json, null, 2);
  lastRanking = json;
}

// --- Main tournament ---
async function runTournament(items, numRounds) {
  stats = new Map();
  for (const a of items) {
    stats.set(a.id, { wins: 0, opponents: [], hadBye: false, buchholz: 0 });
  }

  comparisonsDone = 0;
  totalRounds = numRounds;
  totalComparisons = Math.floor(items.length / 2) * numRounds;
  buildProgressBar(numRounds);
  updateProgress();

  for (let round = 1; round <= numRounds; round++) {
    currentRound = round;
    const { pairs } = swissPair(items);
    roundMatchups = pairs.length;
    roundMatchupsDone = 0;
    updateProgress();

    for (let m = 0; m < pairs.length; m++) {
      const [a, b] = pairs[m];
      roundInfo.textContent = `Round ${round} of ${numRounds} \u2014 Matchup ${m + 1} of ${pairs.length}`;

      const winner = await pickWinner(a, b);

      stats.get(winner.id).wins++;
      stats.get(a.id).opponents.push(b.id);
      stats.get(b.id).opponents.push(a.id);
      roundMatchupsDone++;
      updateProgress();
    }

    renderStandings(items);
  }

  // Buchholz tiebreaker: sum of opponents' final win counts.
  for (const a of items) {
    const s = stats.get(a.id);
    s.buchholz = s.opponents.reduce((sum, oppId) => sum + stats.get(oppId).wins, 0);
  }

  // Sort: wins desc, then Buchholz desc.
  const ranked = [...items].sort((a, b) => {
    const sa = stats.get(a.id);
    const sb = stats.get(b.id);
    if (sb.wins !== sa.wins) return sb.wins - sa.wins;
    return sb.buchholz - sa.buchholz;
  });

  showFinalResults(ranked);
}

// --- Setup ---
function updateEstimate() {
  const n = ITEMS.length;
  const r = parseInt(roundSlider.value, 10);
  const est = Math.floor(n / 2) * r;
  roundDisplay.textContent = r;
  comparisonEstimate.textContent = `~${est} comparisons \u2192 up to ${r + 1} tiers`;
}

roundSlider.addEventListener("input", updateEstimate);

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy JSON"), 1500);
  } catch {
    jsonOutput.select();
    document.execCommand("copy");
  }
});

// Build a compact, tier-grouped ranking for the email body, capped to a length
// that most mail clients accept in a mailto: URL (~2000 chars encoded).
function buildEmailContent() {
  const subject = `My ${NOUN} ranking`;
  const lines = [`My ${NOUN_PLURAL} ranking (${lastRanking.length})`, ""];
  let lastTier = null;
  for (const e of lastRanking) {
    if (e.tier !== lastTier) {
      lines.push(`Tier ${e.tier} \u2014 ${e.wins} win${e.wins !== 1 ? "s" : ""}`);
      lastTier = e.tier;
    }
    lines.push(`${e.rank}. ${e.title}`);
  }
  let body = lines.join("\n");
  const MAX = 1900;
  const overhead = subject.length + 30;
  if (encodeURIComponent(body).length + overhead > MAX) {
    const note = "\n\u2026 (truncated \u2014 use Copy JSON for the full ranking)";
    while (body.length && encodeURIComponent(body + note).length + overhead > MAX) {
      const cut = body.lastIndexOf("\n");
      if (cut < 0) break;
      body = body.slice(0, cut);
    }
    body += note;
  }
  return { subject, body };
}

if (emailBtn) {
  emailBtn.addEventListener("click", () => {
    if (!lastRanking || !lastRanking.length) return;
    const { subject, body } = buildEmailContent();
    window.location.href =
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

restartBtn.addEventListener("click", () => location.reload());

startBtn.addEventListener("click", () => {
  setupSection.classList.add("hidden");
  progressSection.classList.remove("hidden");
  matchupSection.classList.remove("hidden");
  standingsSection.classList.remove("hidden");

  const shuffled = shuffle([...ITEMS]);
  const numRounds = parseInt(roundSlider.value, 10);
  runTournament(shuffled, numRounds);
});

// --- Boot ---
function init() {
  if (itemNounEl) itemNounEl.textContent = NOUN_PLURAL;
  if (matchupPrompt) matchupPrompt.textContent = PROMPT;

  if (ITEMS.length === 0) {
    itemCountEl.textContent = "0";
    comparisonEstimate.textContent = `No ${NOUN_PLURAL} loaded. Edit the data file.`;
    startBtn.disabled = true;
    return;
  }
  if (ITEMS.length === 1) {
    itemCountEl.textContent = "1";
    comparisonEstimate.textContent = `Only one ${NOUN} — nothing to compare.`;
    startBtn.disabled = true;
    return;
  }

  itemCountEl.textContent = ITEMS.length;
  const maxRounds = Math.min(MAX_ROUNDS_CAP, ITEMS.length - 1);
  roundSlider.min = 2;
  roundSlider.max = maxRounds;
  roundSlider.value = Math.min(DEFAULT_ROUNDS, maxRounds);
  updateEstimate();
}

init();

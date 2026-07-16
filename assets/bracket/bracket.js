// Bracket — a config-driven, pairwise ranking engine (Swiss-system tournament).
//
// This file is media-agnostic. It ranks any list of items by repeatedly asking
// the user to pick a winner between two of them. It runs Swiss rounds where
// items with similar records are paired against each other; after each round
// items bucket into tiers by win count (Buchholz tiebreaker within a tier), and
// the user can play another round for more accuracy.
//
//   Each round is floor(n/2) comparisons. More rounds = finer tiers.
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
//   intro         one-line explanation shown in the Setup box
//   accent        brand color (hex); text/contrast variants are auto-derived
//   recommendedRounds  suggested rounds before the "recommended" note clears
//   maxRounds     cap on rounds (defaults to items-1, the round-robin max)
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
const RECOMMENDED_ROUNDS_CFG = CFG.recommendedRounds;
const MAX_ROUNDS_CFG = CFG.maxRounds;
const cardLinesFn = typeof CFG.cardLines === "function" ? CFG.cardLines : () => [];
const linkFn = typeof CFG.link === "function" ? CFG.link : () => null;
const listLineFn = typeof CFG.listLine === "function" ? CFG.listLine : () => "";
const JSON_FIELDS = Array.isArray(CFG.jsonFields) ? CFG.jsonFields : [];

const ITEMS = Array.isArray(window.ITEMS) ? window.ITEMS : [];
const ART = window.ART || {};

// --- DOM refs ---
const setupSection = document.getElementById("setup-section");
const setupIntroEl = document.getElementById("setup-intro");
const itemCountEl = document.getElementById("item-count");
const itemNounEl = document.getElementById("item-noun");
const comparisonEstimate = document.getElementById("comparison-estimate");
const startBtn = document.getElementById("start-btn");

const progressSection = document.getElementById("progress-section");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const progressSub = document.getElementById("progress-sub");

const matchupSection = document.getElementById("matchup-section");
const matchupPrompt = document.getElementById("matchup-prompt");
const cardA = document.getElementById("card-a");
const cardB = document.getElementById("card-b");

const standingsSection = document.getElementById("standings-section");
const standingsEl = document.getElementById("standings");

const resultsSection = document.getElementById("results-section");
const resultsHeading = document.getElementById("results-heading");
const finalTiersEl = document.getElementById("final-tiers");
const roundsNote = document.getElementById("rounds-note");
const anotherRoundBtn = document.getElementById("another-round");
const copyBtn = document.getElementById("copy-json");
const emailBtn = document.getElementById("email-results");
const restartBtn = document.getElementById("restart");

// --- State ---
let stats = new Map(); // itemId -> { wins, opponents[], hadBye, buchholz }
let comparisonsDone = 0;
let currentRound = 0;
let roundMatchups = 0;
let roundMatchupsDone = 0;
let pendingResolve = null;
let lastRanking = null;
let lastJsonText = "";
let maxRounds = 0;
let recommendedRounds = 0;
let currentRoundHeader = null;
let tourneyItems = [];

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
  const label = `Open ${item.title} on ${site}`;
  return `<a class="ext-link" href="${escAttr(link.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escAttr(label)}" title="${escAttr(label)}"><svg class="ext-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>`;
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
function addRoundPill(roundNum) {
  const seg = document.createElement("div");
  seg.className = "progress-segment";
  seg.dataset.round = roundNum;
  const fill = document.createElement("div");
  fill.className = "segment-fill";
  const label = document.createElement("span");
  label.className = "segment-label";
  label.textContent = roundNum;
  seg.appendChild(fill);
  seg.appendChild(label);
  progressBar.appendChild(seg);
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
  progressText.textContent = `Round ${currentRound} \u00B7 ${comparisonsDone} comparison${comparisonsDone !== 1 ? "s" : ""}`;
}

// --- UI: comparison log (newest at the top, dividers between rounds) ---
function logRoundDivider(n) {
  const div = document.createElement("div");
  div.className = "log-round";
  div.textContent = `Round ${n}`;
  standingsEl.prepend(div);
  currentRoundHeader = div;
  standingsEl.scrollTop = 0;
}

function logComparison(n, winner, loser) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML =
    `<span class="log-index">${n}.</span> ` +
    `<span class="log-win">${esc(winner.title)}</span> ` +
    `<span class="log-vs">vs</span> ` +
    `<span class="log-lose">${esc(loser.title)}</span>`;
  if (currentRoundHeader) {
    currentRoundHeader.after(entry);
  } else {
    standingsEl.prepend(entry);
  }
  standingsEl.scrollTop = 0;
}

// --- UI: final tier list ---
function tierListHtml(items) {
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
    html += `<div class="tier-group"><h3>Tier ${tierNum} \u00B7 ${w} win${w !== 1 ? "s" : ""}</h3><ol start="${rank}">`;
    for (const a of tier) {
      const thumb = artImg(a, "list-art");
      const sub = listLineFn(a) || "";
      html += `<li>${thumb}<span class="tier-title">${esc(a.title)}</span>${sub ? `<span class="list-sub">${esc(sub)}</span>` : ""}</li>`;
    }
    html += "</ol></div>";
    rank += tier.length;
    tierNum++;
  }
  return html;
}

// --- Ranking + results ---
function computeRanking(items) {
  for (const a of items) {
    const s = stats.get(a.id);
    s.buchholz = s.opponents.reduce((sum, oppId) => sum + stats.get(oppId).wins, 0);
  }
  return [...items].sort((a, b) => {
    const sa = stats.get(a.id);
    const sb = stats.get(b.id);
    if (sb.wins !== sa.wins) return sb.wins - sa.wins;
    return sb.buchholz - sa.buchholz;
  });
}

function buildJson(ranked) {
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
  return json;
}

function showRoundResults() {
  const ranked = computeRanking(tourneyItems);
  lastRanking = buildJson(ranked);
  lastJsonText = JSON.stringify(lastRanking, null, 2);

  finalTiersEl.innerHTML = tierListHtml(ranked);
  if (resultsHeading) {
    resultsHeading.textContent = `Ranking after round ${currentRound}`;
  }

  const maxed = currentRound >= maxRounds;
  if (anotherRoundBtn) anotherRoundBtn.classList.toggle("hidden", maxed);
  if (roundsNote) {
    if (maxed) {
      roundsNote.textContent = "Maximum rounds reached. This is as accurate as it gets.";
    } else if (currentRound < recommendedRounds) {
      const remaining = recommendedRounds - currentRound;
      roundsNote.textContent = `${remaining} more round${remaining !== 1 ? "s" : ""} recommended for accuracy.`;
    } else {
      roundsNote.textContent = "Enough for solid tiers. Add rounds to refine further.";
    }
  }

  matchupSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
}

// --- Main tournament (one round at a time; user adds rounds for accuracy) ---
async function runRound() {
  currentRound++;
  addRoundPill(currentRound);
  logRoundDivider(currentRound);

  const { pairs } = swissPair(tourneyItems);
  roundMatchups = pairs.length;
  roundMatchupsDone = 0;
  updateProgress();

  for (let m = 0; m < pairs.length; m++) {
    const [a, b] = pairs[m];

    const winner = await pickWinner(a, b);
    const loser = winner === a ? b : a;

    stats.get(winner.id).wins++;
    stats.get(a.id).opponents.push(b.id);
    stats.get(b.id).opponents.push(a.id);
    roundMatchupsDone++;
    updateProgress();
    logComparison(comparisonsDone, winner, loser);
  }

  showRoundResults();
}

function startTournament() {
  stats = new Map();
  for (const a of ITEMS) {
    stats.set(a.id, { wins: 0, opponents: [], hadBye: false, buchholz: 0 });
  }
  comparisonsDone = 0;
  currentRound = 0;
  standingsEl.innerHTML = "";
  currentRoundHeader = null;
  progressBar.innerHTML = "";
  const perRound = Math.floor(ITEMS.length / 2);
  if (progressSub) {
    progressSub.textContent = `${perRound} comparison${perRound !== 1 ? "s" : ""} per round`;
  }
  tourneyItems = shuffle([...ITEMS]);

  setupSection.classList.add("hidden");
  progressSection.classList.remove("hidden");
  standingsSection.classList.remove("hidden");
  matchupSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  runRound();
}

// --- Actions ---
copyBtn.addEventListener("click", async () => {
  const label = copyBtn.querySelector(".btn-label");
  const text = lastJsonText;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }
  if (label) {
    const prev = label.textContent;
    label.textContent = "Copied!";
    setTimeout(() => (label.textContent = prev), 1500);
  }
});

// Build a compact, tier-grouped ranking for the email body, capped to a length
// that most mail clients accept in a mailto: URL (~2000 chars encoded).
function buildEmailContent() {
  const subject = `My ${NOUN} ranking`;
  const lines = [];
  let lastTier = null;
  for (const e of lastRanking) {
    if (e.tier !== lastTier) {
      if (lines.length) lines.push("");
      lines.push(`## ${e.wins} Win${e.wins !== 1 ? "s" : ""}`);
      lastTier = e.tier;
    }
    lines.push(e.title);
  }
  let body = lines.join("\n");
  // Cap the whole mailto for broad client support. Modern clients handle far
  // more; this just keeps a clean truncation instead of a silent mid-item cut.
  const MAX = 4000;
  const overhead = subject.length + 30;
  if (encodeURIComponent(body).length + overhead > MAX) {
    const note = "\n(truncated, use Copy JSON for the full ranking)";
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

restartBtn.addEventListener("click", () => {
  if (window.confirm("Start over? The current ranking will be lost.")) {
    location.reload();
  }
});

if (anotherRoundBtn) {
  anotherRoundBtn.addEventListener("click", () => {
    if (currentRound >= maxRounds) return;
    resultsSection.classList.add("hidden");
    matchupSection.classList.remove("hidden");
    runRound();
  });
}

startBtn.addEventListener("click", startTournament);

// --- Accent color (optional) ---
function hexToRgb(hex) {
  const s = String(hex).replace("#", "");
  const full = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  if (full.length !== 6 || /[^0-9a-fA-F]/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function relLuminance(rgb) {
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

function darkenHex(hex, factor) {
  const c = hexToRgb(hex);
  if (!c) return hex;
  const d = (v) => Math.round(v * (1 - factor)).toString(16).padStart(2, "0");
  return `#${d(c.r)}${d(c.g)}${d(c.b)}`;
}

// Applies config.accent by setting CSS variables on the wrapper. The text
// variant (readable on light) and the on-accent contrast color are derived
// from the accent's luminance unless the config overrides them.
function applyAccent() {
  const accent = CFG.accent;
  if (!accent) return;
  const root = document.querySelector(".bracket") || document.getElementById("bracket");
  if (!root) return;
  const rgb = hexToRgb(accent);
  const lum = rgb ? relLuminance(rgb) : 0.5;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-ink", CFG.accentInk || (lum > 0.45 ? darkenHex(accent, 0.55) : accent));
  root.style.setProperty("--on-accent", CFG.onAccent || (lum > 0.6 ? "#1a1a1d" : "#ffffff"));
  if (rgb) root.style.setProperty("--accent-tint", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
}

// --- Boot ---
function init() {
  if (itemNounEl) itemNounEl.textContent = NOUN_PLURAL;
  if (matchupPrompt) matchupPrompt.textContent = PROMPT;
  if (setupIntroEl && CFG.intro) setupIntroEl.textContent = CFG.intro;
  applyAccent();

  if (ITEMS.length === 0) {
    itemCountEl.textContent = "0";
    comparisonEstimate.textContent = `No ${NOUN_PLURAL} loaded. Edit the data file.`;
    startBtn.disabled = true;
    return;
  }
  if (ITEMS.length === 1) {
    itemCountEl.textContent = "1";
    comparisonEstimate.textContent = `Only one ${NOUN}, nothing to compare.`;
    startBtn.disabled = true;
    return;
  }

  itemCountEl.textContent = ITEMS.length;
  const hardMax = ITEMS.length - 1;
  maxRounds = Math.max(1, Math.min(MAX_ROUNDS_CFG || hardMax, hardMax));
  const recDefault = Math.max(2, Math.ceil(Math.log2(ITEMS.length)));
  recommendedRounds = Math.min(RECOMMENDED_ROUNDS_CFG || recDefault, maxRounds);
  const perRound = Math.floor(ITEMS.length / 2);
  comparisonEstimate.textContent = `${perRound} comparison${perRound !== 1 ? "s" : ""} per round \u00B7 ${recommendedRounds} rounds recommended`;
}

init();

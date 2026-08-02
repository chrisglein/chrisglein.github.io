// Bracket — a config-driven, pairwise ranking engine (Swiss-system tournament).
//
// This file is the UI layer: rendering, event wiring, and progress display.
// The ranking itself — pairing, scoring, tiers, elimination, export — lives in
// bracket-core.js, which is DOM-free and unit tested.
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
//   storageKey    suffix for the saved-progress key; set it when several
//                 rankers share one origin
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
const TITLE_COUNTS = new Map();
for (const item of ITEMS) {
  TITLE_COUNTS.set(item.title, (TITLE_COUNTS.get(item.title) || 0) + 1);
}
const ART = window.ART || {};

// --- DOM refs ---
const setupSection = document.getElementById("setup-section");
const setupIntroEl = document.getElementById("setup-intro");
const itemCountEl = document.getElementById("item-count");
const itemNounEl = document.getElementById("item-noun");
const comparisonEstimate = document.getElementById("comparison-estimate");
const startBtn = document.getElementById("start-btn");
const resumeBtn = document.getElementById("resume-btn");
const resumePanel = document.getElementById("resume-panel");
const resumeText = document.getElementById("resume-text");
const resumeImportBtn = document.getElementById("resume-import");
const resumeError = document.getElementById("resume-error");

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
const eliminatedTiersEl = document.getElementById("eliminated-tiers");
const roundsNote = document.getElementById("rounds-note");
const anotherRoundBtn = document.getElementById("another-round");
const copyBtn = document.getElementById("copy-json");
const emailBtn = document.getElementById("email-results");
const restartBtn = document.getElementById("restart");

const elimSection = document.getElementById("elimination-section");
const elimHintEl = document.getElementById("elim-hint");
const elimListEl = document.getElementById("elimination-list");
const eliminateBtn = document.getElementById("eliminate-btn");
const keepAllBtn = document.getElementById("keep-all-btn");

// --- State ---
const Core = window.BracketCore;
let T = null; // current tournament state, owned by bracket-core.js
let roundMatchups = 0;
let roundMatchupsDone = 0;
let pendingResolve = null;
let lastRanking = null;
let lastJsonText = "";
let maxRounds = 0;
let recommendedRounds = 0;
let currentRoundHeader = null;
let pendingEliminationCandidates = [];
let keptIds = new Set(); // candidates the user opted to rescue from a trim
let currentPairs = [];
let currentPairIndex = 0;
let roundHistory = [];

// Suffixed so several rankers hosted on one origin keep separate saved progress.
const STORAGE_KEY = "bracket-state-v2" + (CFG.storageKey ? ":" + CFG.storageKey : "");
const ITEM_INDEX = new Map(ITEMS.map((item) => [String(item.id), item]));

// --- Utilities ---
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

function itemSummary(item) {
  const suffix = listLineFn(item) || "";
  return suffix ? `${item.title} — ${suffix}` : item.title;
}

function rankingSummary(entry) {
  const item = itemById(entry.id) || entry;
  return (TITLE_COUNTS.get(item.title) || 0) > 1 ? itemSummary(item) : item.title;
}

function setResumeError(message) {
  if (!resumeError) return;
  if (message) {
    resumeError.textContent = message;
    resumeError.classList.remove("hidden");
  } else {
    resumeError.textContent = "";
    resumeError.classList.add("hidden");
  }
}

function resetTournamentUi() {
  standingsEl.innerHTML = "";
  currentRoundHeader = null;
  progressBar.innerHTML = "";
  pendingResolve = null;
  roundMatchups = 0;
  roundMatchupsDone = 0;
}

function renderCompletedProgress(roundsCompleted, comparisonCount, exactComparisonCount) {
  progressBar.innerHTML = "";
  for (let round = 1; round <= roundsCompleted; round++) {
    addRoundPill(round);
  }
  const segments = progressBar.querySelectorAll(".progress-segment");
  segments.forEach((seg) => {
    const fill = seg.querySelector(".segment-fill");
    fill.style.width = "100%";
    seg.classList.add("completed");
    seg.classList.remove("active");
  });
  progressText.textContent = exactComparisonCount
    ? `Round ${roundsCompleted} · ${comparisonCount} comparison${comparisonCount !== 1 ? "s" : ""}`
    : `Round ${roundsCompleted} · imported ranking`;
}

function itemById(id) {
  return ITEM_INDEX.get(String(id)) || null;
}

function clearSavedState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures and keep the app usable without persistence.
  }
}

function saveState(view) {
  if (!T) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Core.snapshotSession(T, {
      view,
      roundMatchups,
      roundMatchupsDone,
      currentPairIndex,
      currentPairs,
      roundHistory,
      eliminationPromptVisible: !!(elimSection && !elimSection.classList.contains("hidden")),
      keptIds,
    })));
  } catch {
    // Ignore storage failures and keep the app usable without persistence.
  }
}

function loadSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
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
    if (r < T.round) {
      fill.style.width = "100%";
      seg.classList.add("completed");
      seg.classList.remove("active");
    } else if (r === T.round) {
      const pct = roundMatchups > 0 ? Math.round((roundMatchupsDone / roundMatchups) * 100) : 0;
      fill.style.width = pct + "%";
      seg.classList.add("active");
      seg.classList.remove("completed");
    } else {
      fill.style.width = "0%";
      seg.classList.remove("active", "completed");
    }
  });
  const n = T.comparisons;
  progressText.textContent = `Round ${T.round} \u00B7 ${n} comparison${n !== 1 ? "s" : ""}`;
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
    `<span class="log-index">${esc(n)}.</span> ` +
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
function tierListHtml(groups) {
  let html = "";
  for (const group of groups) {
    html += `<div class="tier-group"><h3>Tier ${group.tier} \u00B7 ${group.wins} win${group.wins !== 1 ? "s" : ""}</h3><ol start="${group.startRank}">`;
    for (const a of group.items) {
      const thumb = artImg(a, "list-art");
      const sub = listLineFn(a) || "";
      html += `<li>${thumb}<span class="tier-title">${esc(a.title)}</span>${sub ? `<span class="list-sub">${esc(sub)}</span>` : ""}</li>`;
    }
    html += "</ol></div>";
  }
  return html;
}

// --- Elimination ---

function selectedForElimination() {
  return pendingEliminationCandidates.filter((item) => !keptIds.has(String(item.id)));
}

function updateEliminateButton() {
  const total = pendingEliminationCandidates.length;
  const n = selectedForElimination().length;
  const label = eliminateBtn.querySelector(".btn-label");
  if (label) label.textContent = n === total ? `Eliminate ${total}` : `Eliminate ${n} of ${total}`;
  eliminateBtn.disabled = n === 0;
}

function showEliminationPrompt(candidates, keptIdList) {
  if (!elimSection) return;
  if (candidates.length === 0) {
    elimSection.classList.add("hidden");
    pendingEliminationCandidates = [];
    keptIds.clear();
    return;
  }
  pendingEliminationCandidates = candidates;
  keptIds = new Set((keptIdList || []).map(String));
  const n = candidates.length;
  elimHintEl.textContent =
    `After ${T.round} rounds, ${n} ${n === 1 ? "item" : "items"} still ${n === 1 ? "has" : "have"} ` +
    `0 wins and cannot reach the top tiers. Eliminating them reduces future comparisons; ` +
    `they will still appear at the bottom of the final ranking. ` +
    `Uncheck any you want to keep in play.`;
  elimListEl.innerHTML = candidates
    .map((item) => {
      const sub = listLineFn(item);
      const checked = keptIds.has(String(item.id)) ? "" : " checked";
      const keeping = keptIds.has(String(item.id)) ? " class=\"keeping\"" : "";
      return `<li${keeping}><label><input type="checkbox"${checked} data-id="${escAttr(item.id)}">` +
        `<span class="elim-name">${esc(item.title)}</span>` +
        `${sub ? `<span class="elim-sub">${esc(sub)}</span>` : ""}</label></li>`;
    })
    .join("");
  updateEliminateButton();
  elimSection.classList.remove("hidden");
}

function renderEliminatedSection() {
  if (!eliminatedTiersEl) return;
  if (T.eliminated.length === 0) {
    eliminatedTiersEl.classList.add("hidden");
    eliminatedTiersEl.innerHTML = "";
    return;
  }
  let html = `<div class="tier-group elim-tier-group"><h3>Eliminated (${T.eliminated.length})</h3><ol>`;
  for (const a of T.eliminated) {
    const w = T.stats.get(a.id).wins;
    const thumb = artImg(a, "list-art");
    const sub = listLineFn(a) || "";
    html += `<li class="elim-item">${thumb}<span class="tier-title">${esc(a.title)}</span>${sub ? `<span class="list-sub">${esc(sub)}</span>` : ""}<span class="elim-badge">${w} win${w !== 1 ? "s" : ""}</span></li>`;
  }
  html += "</ol></div>";
  eliminatedTiersEl.innerHTML = html;
  eliminatedTiersEl.classList.remove("hidden");
}

function roundCapFor(itemCount) {
  const hardMax = Math.max(1, itemCount - 1);
  return Math.max(1, Math.min(MAX_ROUNDS_CFG || hardMax, hardMax));
}

function updateProgressSubtext() {
  if (!T || !progressSub) return;
  const perRound = Core.comparisonsPerRound(T);
  const n = T.active.length;
  let text = `${perRound} comparison${perRound !== 1 ? "s" : ""} per round`;
  if (T.eliminated.length) {
    text += ` · ${n} item${n !== 1 ? "s" : ""} remaining`;
  }
  progressSub.textContent = text;
}

function applyElimination(candidates) {
  Core.eliminate(T, candidates);
  // A smaller pool supports fewer distinct opponents, so the cap moves too.
  maxRounds = roundCapFor(T.active.length);
  updateProgressSubtext();
}

function refreshRankingDisplay() {
  lastRanking = Core.buildJson(T, { jsonFields: JSON_FIELDS });
  lastJsonText = JSON.stringify(lastRanking, null, 2);
  finalTiersEl.innerHTML = tierListHtml(Core.tiers(T));
  renderEliminatedSection();
}

function renderResultsView(options) {
  const opts = options || {};
  refreshRankingDisplay();
  if (resultsHeading) {
    resultsHeading.textContent = `Ranking after round ${T.round}`;
  }

  const maxed = T.round >= maxRounds;
  if (anotherRoundBtn) anotherRoundBtn.classList.toggle("hidden", maxed);
  if (roundsNote) {
    if (maxed) {
      roundsNote.textContent = "Maximum rounds reached. This is as accurate as it gets.";
    } else if (T.round < recommendedRounds) {
      const remaining = recommendedRounds - T.round;
      roundsNote.textContent = `${remaining} more round${remaining !== 1 ? "s" : ""} recommended for accuracy.`;
    } else {
      roundsNote.textContent = "Enough for solid tiers. Add rounds to refine further.";
    }
  }

  const candidates = Core.eliminationCandidates(T);
  if (opts.eliminationPromptVisible && candidates.length) {
    showEliminationPrompt(candidates, opts.keptIds);
  } else if (elimSection) {
    elimSection.classList.add("hidden");
    pendingEliminationCandidates = [];
    keptIds.clear();
  }

  matchupSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
  saveState("results");
}

// --- Main tournament (one round at a time; user adds rounds for accuracy) ---
async function playCurrentRound() {
  while (currentPairIndex < currentPairs.length) {
    const [a, b] = currentPairs[currentPairIndex];
    saveState("matchup");

    const winner = await pickWinner(a, b);
    const loser = winner.id === a.id ? b : a;

    Core.recordResult(T, winner, loser);
    roundMatchupsDone++;
    currentPairIndex++;
    updateProgress();
    logComparison(T.comparisons, winner, loser);
    const roundEntry = roundHistory[roundHistory.length - 1];
    if (roundEntry) {
      roundEntry.comparisons.push({
        n: T.comparisons,
        winnerId: winner.id,
        loserId: loser.id,
      });
    }
    saveState(currentPairIndex < currentPairs.length ? "matchup" : "results");
  }

  renderResultsView({ eliminationPromptVisible: true });
}

function runRound() {
  const { pairs } = Core.startRound(T);
  addRoundPill(T.round);
  logRoundDivider(T.round);
  currentPairs = pairs;
  currentPairIndex = 0;
  roundMatchups = pairs.length;
  roundMatchupsDone = 0;
  roundHistory.push({ round: T.round, comparisons: [] });
  updateProgress();
  saveState("matchup");
  playCurrentRound();
}

function restoreRoundHistory(history) {
  standingsEl.innerHTML = "";
  currentRoundHeader = null;

  for (const entry of history) {
    logRoundDivider(entry.round);
    for (const comparison of entry.comparisons) {
      logComparison(comparison.n, itemById(comparison.winnerId), itemById(comparison.loserId));
    }
  }
}

function restoreTournament(saved) {
  const session = Core.restoreSession(ITEMS, saved);
  if (!session) return false;

  T = session.tournament;
  // A trimmed pool supports fewer rounds, matching what applyElimination set.
  maxRounds = roundCapFor(T.active.length);
  roundMatchups = session.roundMatchups;
  roundMatchupsDone = session.roundMatchupsDone;
  currentPairIndex = session.currentPairIndex;
  currentPairs = session.currentPairs;
  roundHistory = session.roundHistory;
  lastRanking = null;
  lastJsonText = "";
  pendingResolve = null;
  pendingEliminationCandidates = [];
  keptIds = new Set();

  const perRound = Core.comparisonsPerRound(T);
  if (progressSub) {
    progressSub.textContent = `${perRound} comparison${perRound !== 1 ? "s" : ""} per round`;
  }
  if (T.active.length !== ITEMS.length && progressSub) {
    const n = T.active.length;
    progressSub.textContent = `${perRound} comparison${perRound !== 1 ? "s" : ""} per round \u00B7 ${n} item${n !== 1 ? "s" : ""} remaining`;
  }

  progressBar.innerHTML = "";
  for (let round = 1; round <= T.round; round++) addRoundPill(round);
  restoreRoundHistory(roundHistory);
  updateProgress();

  setupSection.classList.add("hidden");
  progressSection.classList.remove("hidden");
  standingsSection.classList.remove("hidden");

  if (session.view === "results") {
    renderResultsView({
      eliminationPromptVisible: session.eliminationPromptVisible,
      keptIds: session.keptIds,
    });
  } else {
    if (elimSection) elimSection.classList.add("hidden");
    resultsSection.classList.add("hidden");
    matchupSection.classList.remove("hidden");
    playCurrentRound();
  }
  return true;
}

function resetTournament() {
  clearSavedState();
  T = null;
  roundMatchups = 0;
  roundMatchupsDone = 0;
  pendingResolve = null;
  lastRanking = null;
  lastJsonText = "";
  currentRoundHeader = null;
  pendingEliminationCandidates = [];
  keptIds.clear();
  currentPairs = [];
  currentPairIndex = 0;
  roundHistory = [];

  standingsEl.innerHTML = "";
  progressBar.innerHTML = "";
  finalTiersEl.innerHTML = "";
  if (elimSection) elimSection.classList.add("hidden");
  if (eliminatedTiersEl) {
    eliminatedTiersEl.classList.add("hidden");
    eliminatedTiersEl.innerHTML = "";
  }
  setupSection.classList.remove("hidden");
  progressSection.classList.add("hidden");
  matchupSection.classList.add("hidden");
  standingsSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  init();
}

function startTournament() {
  clearSavedState();
  T = Core.createTournament(ITEMS);
  maxRounds = roundCapFor(ITEMS.length);
  pendingEliminationCandidates = [];
  keptIds.clear();
  currentPairs = [];
  currentPairIndex = 0;
  roundHistory = [];
  lastRanking = null;
  lastJsonText = "";
  resetTournamentUi();
  updateProgressSubtext();
  if (elimSection) elimSection.classList.add("hidden");
  if (eliminatedTiersEl) {
    eliminatedTiersEl.classList.add("hidden");
    eliminatedTiersEl.innerHTML = "";
  }

  setupSection.classList.add("hidden");
  progressSection.classList.remove("hidden");
  standingsSection.classList.remove("hidden");
  matchupSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  runRound();
}

function resumeTournamentFromText(text) {
  clearSavedState();
  const restored = Core.importRanking(text, ITEMS, {
    noun: NOUN,
    nounPlural: NOUN_PLURAL,
    listLine: listLineFn,
    maxRounds: roundCapFor(ITEMS.length),
  });

  T = restored.tournament;
  maxRounds = roundCapFor(T.active.length);
  pendingEliminationCandidates = [];
  keptIds.clear();
  currentPairs = [];
  currentPairIndex = 0;
  roundHistory = [];
  lastRanking = null;
  lastJsonText = "";
  resetTournamentUi();
  updateProgressSubtext();
  if (elimSection) elimSection.classList.add("hidden");
  if (eliminatedTiersEl) {
    eliminatedTiersEl.classList.add("hidden");
    eliminatedTiersEl.innerHTML = "";
  }
  renderCompletedProgress(T.round, T.comparisons, restored.exactComparisonCount);

  setupSection.classList.add("hidden");
  progressSection.classList.remove("hidden");
  standingsSection.classList.add("hidden");
  matchupSection.classList.add("hidden");
  resultsSection.classList.add("hidden");

  renderResultsView({ eliminationPromptVisible: false });
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

if (emailBtn) {
  emailBtn.addEventListener("click", () => {
    if (!lastRanking || !lastRanking.length) return;
    const { subject, body } = Core.buildEmailContent(lastRanking, {
      noun: NOUN,
      entryLine: rankingSummary,
    });
    window.location.href =
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

restartBtn.addEventListener("click", () => {
  if (window.confirm("Start over? The current ranking and saved progress will be lost.")) {
    resetTournament();
  }
});

if (elimListEl) {
  elimListEl.addEventListener("change", (e) => {
    const box = e.target;
    if (!box || box.type !== "checkbox") return;
    if (box.checked) keptIds.delete(String(box.dataset.id));
    else keptIds.add(String(box.dataset.id));
    box.closest("li").classList.toggle("keeping", !box.checked);
    updateEliminateButton();
    saveState("results");
  });
}

if (eliminateBtn) {
  eliminateBtn.addEventListener("click", () => {
    const selected = selectedForElimination();
    if (!selected.length) return;
    applyElimination(selected);
    pendingEliminationCandidates = [];
    keptIds.clear();
    renderResultsView({ eliminationPromptVisible: false });
  });
}

if (keepAllBtn) {
  keepAllBtn.addEventListener("click", () => {
    pendingEliminationCandidates = [];
    keptIds.clear();
    renderResultsView({ eliminationPromptVisible: false });
  });
}

if (anotherRoundBtn) {
  anotherRoundBtn.addEventListener("click", () => {
    if (T.round >= maxRounds) return;
    resultsSection.classList.add("hidden");
    matchupSection.classList.remove("hidden");
    standingsSection.classList.remove("hidden");
    runRound();
  });
}

startBtn.addEventListener("click", startTournament);

if (resumeBtn && resumePanel) {
  resumeBtn.addEventListener("click", () => {
    resumePanel.classList.toggle("hidden");
    setResumeError("");
    if (!resumePanel.classList.contains("hidden") && resumeText) {
      resumeText.focus();
    }
  });
}

if (resumeImportBtn && resumeText) {
  resumeImportBtn.addEventListener("click", () => {
    setResumeError("");
    try {
      resumeTournamentFromText(resumeText.value);
    } catch (error) {
      setResumeError(error instanceof Error ? error.message : "Could not parse the pasted export.");
    }
  });
}

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
    if (resumeBtn) resumeBtn.disabled = true;
    return;
  }
  if (ITEMS.length === 1) {
    itemCountEl.textContent = "1";
    comparisonEstimate.textContent = `Only one ${NOUN}, nothing to compare.`;
    startBtn.disabled = true;
    if (resumeBtn) resumeBtn.disabled = true;
    return;
  }

  itemCountEl.textContent = ITEMS.length;
  maxRounds = roundCapFor(ITEMS.length);
  const recDefault = Math.max(2, Math.ceil(Math.log2(ITEMS.length)));
  recommendedRounds = Math.min(RECOMMENDED_ROUNDS_CFG || recDefault, maxRounds);
  const perRound = Math.floor(ITEMS.length / 2);
  comparisonEstimate.textContent = `${perRound} comparison${perRound !== 1 ? "s" : ""} per round \u00B7 ${recommendedRounds} rounds recommended`;

  if (!restoreTournament(loadSavedState())) {
    clearSavedState();
  }
}

init();

// Board Game Ranker — Swiss-system tournament.
//
// Instead of a full merge sort (~n*log2(n) comparisons), this runs a fixed
// number of Swiss rounds where games with similar records are paired against
// each other. After all rounds, games bucket into tiers by win count.
// Buchholz tiebreaker (sum of opponents' wins) orders within tiers.
//
// For 32 games: 5 rounds = 80 comparisons (vs ~120 for full sort).
// Fewer rounds = fewer comparisons, coarser tiers.

// --- DOM refs ---
const setupSection = document.getElementById("setup-section");
const gameCountEl = document.getElementById("game-count");
const roundSlider = document.getElementById("round-slider");
const roundDisplay = document.getElementById("round-display");
const comparisonEstimate = document.getElementById("comparison-estimate");
const startBtn = document.getElementById("start-btn");

const progressSection = document.getElementById("progress-section");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const matchupSection = document.getElementById("matchup-section");
const roundInfo = document.getElementById("round-info");
const cardA = document.getElementById("card-a");
const cardB = document.getElementById("card-b");

const standingsSection = document.getElementById("standings-section");
const standingsEl = document.getElementById("standings");

const resultsSection = document.getElementById("results-section");
const finalTiersEl = document.getElementById("final-tiers");
const jsonOutput = document.getElementById("json-output");
const copyBtn = document.getElementById("copy-json");
const restartBtn = document.getElementById("restart");

// --- State ---
let stats = new Map(); // gameId -> { wins, opponents[], hadBye, buchholz }
let comparisonsDone = 0;
let totalComparisons = 0;
let currentRound = 0;
let totalRounds = 0;
let roundMatchups = 0;
let roundMatchupsDone = 0;
let pendingResolve = null;

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
  d.textContent = str;
  return d.innerHTML;
}

// --- Swiss pairing ---
// Groups games by win count, shuffles within groups, pairs adjacent items,
// avoids rematches when possible. Gives a bye to the lowest-ranked game
// if the count is odd.
function swissPair(games) {
  // Group by wins descending
  const groups = new Map();
  for (const a of games) {
    const w = stats.get(a.id).wins;
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(a);
  }
  const sorted = [];
  for (const k of [...groups.keys()].sort((a, b) => b - a)) {
    sorted.push(...shuffle([...groups.get(k)]));
  }

  // Handle odd count: bye goes to lowest game that hasn't had one yet
  let byeGame = null;
  if (sorted.length % 2 !== 0) {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (!stats.get(sorted[i].id).hadBye) {
        byeGame = sorted.splice(i, 1)[0];
        break;
      }
    }
    if (!byeGame) {
      byeGame = sorted.pop();
    }
    stats.get(byeGame.id).wins++;
    stats.get(byeGame.id).hadBye = true;
  }

  // Pair adjacent games, preferring no rematch
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

  return { pairs, byeGame };
}

// --- UI: matchup ---
function artImg(game, cls) {
  if (typeof GAME_ART !== 'undefined' && GAME_ART[game.id]) {
    return `<img class="${cls}" src="${esc(GAME_ART[game.id])}" alt="" onerror="this.remove()">`;
  }
  return '';
}

function cardMeta(game) {
  const parts = [];
  if (game.players) parts.push(`${esc(game.players)} players`);
  if (game.time != null) parts.push(`${esc(String(game.time))} min`);
  return parts.join(' \u00B7 ');
}

function renderMatchup(a, b) {
  cardA.innerHTML = `${artImg(a, 'card-art')}<div class="card-text"><div class="title">${esc(a.title)}</div><div class="meta">${cardMeta(a)}</div></div>`;
  cardB.innerHTML = `${artImg(b, 'card-art')}<div class="card-text"><div class="title">${esc(b.title)}</div><div class="meta">${cardMeta(b)}</div></div>`;
  cardA.onclick = () => choose(a);
  cardB.onclick = () => choose(b);
}

function choose(game) {
  if (!pendingResolve) return;
  const r = pendingResolve;
  pendingResolve = null;
  comparisonsDone++;
  updateProgress();
  r(game);
}

function pickWinner(a, b) {
  renderMatchup(a, b);
  return new Promise(resolve => { pendingResolve = resolve; });
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
  // Update segment fills
  const segments = progressBar.querySelectorAll(".progress-segment");
  segments.forEach(seg => {
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

// --- UI: standings (shown during tournament, updates after each round) ---
function renderStandings(games) {
  const groups = new Map();
  for (const a of games) {
    const w = stats.get(a.id).wins;
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(a);
  }

  let html = "";
  for (const w of [...groups.keys()].sort((a, b) => b - a)) {
    const tier = groups.get(w);
    const stars = w > 0 ? "\u2605".repeat(w) : "\u2606";
    html += `<div class="tier-group"><div class="tier-label">${stars} ${w} win${w !== 1 ? "s" : ""} (${tier.length})</div><ul>`;
    for (const a of tier) {
      const thumb = artImg(a, 'list-art');
      const meta = cardMeta(a);
      html += `<li>${thumb}<strong>${esc(a.title)}</strong>${meta ? ` \u2014 <span class="list-meta">${meta}</span>` : ''}</li>`;
    }
    html += "</ul></div>";
  }
  standingsEl.innerHTML = html;
}

// --- UI: final results ---
function showFinalResults(ranked) {
  matchupSection.classList.add("hidden");
  standingsSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  // Group into tiers by wins
  const groups = new Map();
  for (const a of ranked) {
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
    html += `<div class="tier-group"><h3>Tier ${tierNum} \u2014 ${w} win${w !== 1 ? "s" : ""}</h3><ol start="${rank}">`;
    for (const a of tier) {
      const thumb = artImg(a, 'list-art');
      const meta = cardMeta(a);
      html += `<li>${thumb}<strong>${esc(a.title)}</strong>${meta ? ` \u2014 <span class="list-meta">${meta}</span>` : ''}</li>`;
    }
    html += "</ol></div>";
    rank += tier.length;
    tierNum++;
  }

  finalTiersEl.innerHTML = html;

  // JSON output
  rank = 1;
  tierNum = 1;
  const json = [];
  for (const w of sortedKeys) {
    for (const a of groups.get(w)) {
      json.push({
        rank: rank++,
        tier: tierNum,
        id: a.id,
        title: a.title,
        players: a.players,
        time: a.time,
        wins: w,
      });
    }
    tierNum++;
  }
  jsonOutput.value = JSON.stringify(json, null, 2);
}

// --- Main tournament ---
async function runTournament(games, numRounds) {
  stats = new Map();
  for (const a of games) {
    stats.set(a.id, { wins: 0, opponents: [], hadBye: false, buchholz: 0 });
  }

  comparisonsDone = 0;
  totalRounds = numRounds;
  totalComparisons = Math.floor(games.length / 2) * numRounds;
  buildProgressBar(numRounds);
  updateProgress();

  for (let round = 1; round <= numRounds; round++) {
    currentRound = round;
    const { pairs } = swissPair(games);
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

    renderStandings(games);
  }

  // Buchholz tiebreaker: sum of opponents' final win counts
  for (const a of games) {
    const s = stats.get(a.id);
    s.buchholz = s.opponents.reduce((sum, oppId) => sum + stats.get(oppId).wins, 0);
  }

  // Sort: wins desc, then Buchholz desc
  const ranked = [...games].sort((a, b) => {
    const sa = stats.get(a.id);
    const sb = stats.get(b.id);
    if (sb.wins !== sa.wins) return sb.wins - sa.wins;
    return sb.buchholz - sa.buchholz;
  });

  showFinalResults(ranked);
}

// --- Setup ---
function updateEstimate() {
  const n = GAMES.length;
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

restartBtn.addEventListener("click", () => location.reload());

startBtn.addEventListener("click", () => {
  setupSection.classList.add("hidden");
  progressSection.classList.remove("hidden");
  matchupSection.classList.remove("hidden");
  standingsSection.classList.remove("hidden");

  const shuffled = shuffle([...GAMES]);
  const numRounds = parseInt(roundSlider.value, 10);
  runTournament(shuffled, numRounds);
});

// --- Boot ---
function init() {
  if (!Array.isArray(GAMES) || GAMES.length === 0) {
    gameCountEl.textContent = "0";
    comparisonEstimate.textContent = "No games loaded. Edit games.js.";
    startBtn.disabled = true;
    return;
  }
  if (GAMES.length === 1) {
    gameCountEl.textContent = "1";
    comparisonEstimate.textContent = "Only one game — nothing to compare.";
    startBtn.disabled = true;
    return;
  }

  gameCountEl.textContent = GAMES.length;
  const defaultRounds = 4;
  const maxRounds = Math.min(10, GAMES.length - 1);
  roundSlider.min = 2;
  roundSlider.max = maxRounds;
  roundSlider.value = Math.min(defaultRounds, maxRounds);
  updateEstimate();
}

init();

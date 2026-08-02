// Bracket core — the DOM-free ranking engine.
//
// Everything here is pure data transformation: Swiss pairing, win tallying,
// Buchholz, tier grouping, elimination, and JSON export. No `document`, no
// event handling, no rendering. bracket.js owns all of that.
//
// Two seams make the engine testable:
//   rng     — injectable randomness, so a run is reproducible from a seed.
//   decide  — injectable "who wins this matchup", so a tournament can be
//             played by a script instead of by a human clicking cards.
//
// Loaded as a plain <script> in the browser (sets window.BracketCore) and as
// a CommonJS module in tests. Deliberately not an ES module: `type="module"`
// is CORS-blocked over file://, and opening index.html directly from disk is
// a headline feature of this project.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.BracketCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Rounds completed before a 0-win item may be offered up for elimination.
  // Earlier than this is just the normal Swiss distribution: half the field is
  // winless after round 1 and a quarter after round 2. By round 3 a winless
  // item has lost every chance to show quality. Note a bye counts as a win, so
  // an item that sat out a round is shielded.
  const ELIMINATION_MIN_ROUND = 3;
  // A matchup needs two items, so never trim the pool below this.
  const MIN_ACTIVE_AFTER_ELIMINATION = 2;

  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createTournament(items, options) {
    const opts = options || {};
    const rng = typeof opts.rng === "function" ? opts.rng : Math.random;
    const stats = new Map();
    for (const item of items) {
      stats.set(item.id, { wins: 0, byes: 0, opponents: [], hadBye: false, buchholz: 0 });
    }
    return {
      all: items.slice(),
      active: shuffle(items.slice(), rng),
      eliminated: [],
      stats,
      rng,
      round: 0,
      comparisons: 0,
      byesAwarded: 0,
      eliminationMinRound: opts.eliminationMinRound || ELIMINATION_MIN_ROUND,
      minActiveAfterElimination: opts.minActiveAfterElimination || MIN_ACTIVE_AFTER_ELIMINATION,
    };
  }

  function snapshotTournament(t) {
    const stats = {};
    for (const [id, s] of t.stats.entries()) {
      stats[id] = {
        wins: s.wins,
        byes: s.byes,
        opponents: s.opponents.slice(),
        hadBye: s.hadBye,
        buchholz: s.buchholz,
      };
    }
    return {
      activeIds: t.active.map((item) => item.id),
      eliminatedIds: t.eliminated.map((item) => item.id),
      stats,
      round: t.round,
      comparisons: t.comparisons,
      byesAwarded: t.byesAwarded,
      eliminationMinRound: t.eliminationMinRound,
      minActiveAfterElimination: t.minActiveAfterElimination,
    };
  }

  function restoreTournament(items, snapshot, options) {
    if (!snapshot || typeof snapshot !== "object") return null;

    const opts = options || {};
    const rng = typeof opts.rng === "function" ? opts.rng : Math.random;
    const activeIds = Array.isArray(snapshot.activeIds) ? snapshot.activeIds : null;
    const eliminatedIds = Array.isArray(snapshot.eliminatedIds) ? snapshot.eliminatedIds : null;
    const savedStats = snapshot.stats;
    if (!activeIds || !eliminatedIds || !savedStats || typeof savedStats !== "object") return null;

    const byKey = new Map(items.map((item) => [String(item.id), item]));
    const idByKey = new Map(items.map((item) => [String(item.id), item.id]));
    const allIds = activeIds.concat(eliminatedIds);
    if (allIds.length !== items.length) return null;

    const seen = new Set();
    const restoreItems = (ids) => {
      const restored = [];
      for (const id of ids) {
        const key = String(id);
        if (seen.has(key) || !byKey.has(key)) return null;
        seen.add(key);
        restored.push(byKey.get(key));
      }
      return restored;
    };

    const active = restoreItems(activeIds);
    const eliminated = restoreItems(eliminatedIds);
    if (!active || !eliminated || seen.size !== items.length) return null;

    const stats = new Map();
    for (const item of items) {
      const saved = savedStats[item.id];
      if (!saved || !Array.isArray(saved.opponents)) return null;
      const opponents = [];
      for (const oppId of saved.opponents) {
        const key = String(oppId);
        if (!idByKey.has(key) || key === String(item.id)) return null;
        opponents.push(idByKey.get(key));
      }
      stats.set(item.id, {
        wins: Number(saved.wins) || 0,
        byes: Number(saved.byes) || 0,
        opponents,
        hadBye: !!saved.hadBye,
        buchholz: Number(saved.buchholz) || 0,
      });
    }

    return {
      all: items.slice(),
      active,
      eliminated,
      stats,
      rng,
      round: Number(snapshot.round) || 0,
      comparisons: Number(snapshot.comparisons) || 0,
      byesAwarded: Number(snapshot.byesAwarded) || 0,
      eliminationMinRound: Number(snapshot.eliminationMinRound) || ELIMINATION_MIN_ROUND,
      minActiveAfterElimination:
        Number(snapshot.minActiveAfterElimination) || MIN_ACTIVE_AFTER_ELIMINATION,
    };
  }

  // --- Session persistence ---
  // A snapshot alone cannot resume a half-played round, so a session also
  // carries the in-round cursor, the pairings on screen, and the log. The
  // rules for what survives a reload live here, free of storage and DOM.

  // Identifies the item list a session was played against. A different or
  // edited list invalidates the session rather than silently mismatching.
  function itemFingerprint(items) {
    return items.map((item) => `${item.id}\u001e${item.title}`).join("\u001f");
  }

  function snapshotSession(t, session) {
    const s = session || {};
    return {
      itemFingerprint: itemFingerprint(t.all),
      view: s.view === "results" ? "results" : "matchup",
      core: snapshotTournament(t),
      roundMatchups: Number(s.roundMatchups) || 0,
      roundMatchupsDone: Number(s.roundMatchupsDone) || 0,
      currentPairIndex: Number(s.currentPairIndex) || 0,
      currentPairs: (s.currentPairs || []).map(([a, b]) => [a.id, b.id]),
      roundHistory: s.roundHistory || [],
      eliminationPromptVisible: !!s.eliminationPromptVisible,
      keptIds: [...(s.keptIds || [])],
    };
  }

  function restoreSession(items, saved) {
    if (!saved || typeof saved !== "object") return null;
    if (saved.itemFingerprint !== itemFingerprint(items)) return null;

    const tournament = restoreTournament(items, saved.core);
    if (!tournament) return null;

    const byKey = new Map(items.map((item) => [String(item.id), item]));
    const savedPairs = Array.isArray(saved.currentPairs) ? saved.currentPairs : [];
    const currentPairs = [];
    for (const pair of savedPairs) {
      if (!Array.isArray(pair) || pair.length !== 2) return null;
      const a = byKey.get(String(pair[0]));
      const b = byKey.get(String(pair[1]));
      if (!a || !b || a.id === b.id) return null;
      currentPairs.push([a, b]);
    }

    // The cursor is how far into currentPairs the player got; landing exactly
    // at the end means the round finished and results are due.
    const currentPairIndex = Number(saved.currentPairIndex) || 0;
    if (!Number.isInteger(currentPairIndex) || currentPairIndex < 0) return null;
    if (currentPairIndex > currentPairs.length) return null;

    // A damaged log costs history, not the ranking, so bad entries drop.
    const savedHistory = Array.isArray(saved.roundHistory) ? saved.roundHistory : [];
    const roundHistory = [];
    for (const entry of savedHistory) {
      if (!entry || !Number.isInteger(entry.round)) continue;
      const savedComparisons = Array.isArray(entry.comparisons) ? entry.comparisons : [];
      const comparisons = [];
      for (const c of savedComparisons) {
        if (!c || !Number.isFinite(c.n)) continue;
        const winner = byKey.get(String(c.winnerId));
        const loser = byKey.get(String(c.loserId));
        if (!winner || !loser || winner.id === loser.id) continue;
        comparisons.push({ n: c.n, winnerId: winner.id, loserId: loser.id });
      }
      roundHistory.push({ round: entry.round, comparisons });
    }

    return {
      tournament,
      view: saved.view === "results" ? "results" : "matchup",
      currentPairs,
      currentPairIndex,
      roundMatchups: currentPairs.length || Number(saved.roundMatchups) || 0,
      roundMatchupsDone: Number(saved.roundMatchupsDone) || 0,
      roundHistory,
      eliminationPromptVisible: !!saved.eliminationPromptVisible,
      keptIds: (Array.isArray(saved.keptIds) ? saved.keptIds : []).map(String),
    };
  }

  // --- Swiss pairing ---
  // Groups items by win count, shuffles within groups, pairs adjacent items,
  // avoids rematches when possible. Gives a bye to the lowest-ranked item if
  // the count is odd.
  function swissPair(t) {
    const groups = new Map();
    for (const item of t.active) {
      const w = t.stats.get(item.id).wins;
      if (!groups.has(w)) groups.set(w, []);
      groups.get(w).push(item);
    }
    const sorted = [];
    for (const k of [...groups.keys()].sort((a, b) => b - a)) {
      sorted.push(...shuffle([...groups.get(k)], t.rng));
    }

    let byeItem = null;
    if (sorted.length % 2 !== 0) {
      for (let i = sorted.length - 1; i >= 0; i--) {
        if (!t.stats.get(sorted[i].id).hadBye) {
          byeItem = sorted.splice(i, 1)[0];
          break;
        }
      }
      if (!byeItem) byeItem = sorted.pop();
      const s = t.stats.get(byeItem.id);
      s.wins++;
      s.byes++;
      s.hadBye = true;
      t.byesAwarded++;
    }

    const pairs = [];
    const used = new Set();
    for (let i = 0; i < sorted.length; i++) {
      if (used.has(sorted[i].id)) continue;
      const faced = new Set(t.stats.get(sorted[i].id).opponents);
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

  function startRound(t) {
    t.round++;
    return swissPair(t);
  }

  function recordResult(t, winner, loser) {
    t.stats.get(winner.id).wins++;
    t.stats.get(winner.id).opponents.push(loser.id);
    t.stats.get(loser.id).opponents.push(winner.id);
    t.comparisons++;
  }

  // Plays one full round, asking `decide(a, b)` for each matchup. `decide` may
  // return a winner or a promise of one, which is how the browser parks on a
  // click and a test returns instantly.
  async function playRound(t, decide, hooks) {
    const h = hooks || {};
    const { pairs, byeItem } = startRound(t);
    if (h.onRoundStart) h.onRoundStart(t, pairs, byeItem);
    for (const [a, b] of pairs) {
      const winner = await decide(a, b);
      const loser = winner.id === a.id ? b : a;
      recordResult(t, winner, loser);
      if (h.onResult) h.onResult(t, winner, loser);
    }
    if (h.onRoundEnd) h.onRoundEnd(t);
    return t;
  }

  // --- Ranking ---
  function computeRanking(t) {
    for (const item of t.active) {
      const s = t.stats.get(item.id);
      s.buchholz = s.opponents.reduce((sum, oppId) => sum + t.stats.get(oppId).wins, 0);
    }
    return [...t.active].sort((a, b) => {
      const sa = t.stats.get(a.id);
      const sb = t.stats.get(b.id);
      if (sb.wins !== sa.wins) return sb.wins - sa.wins;
      return sb.buchholz - sa.buchholz;
    });
  }

  // Ranked items bucketed by win count. The single source of tier numbering —
  // both the rendered tier list and the JSON export read from this.
  function tiers(t) {
    const ranked = computeRanking(t);
    const groups = new Map();
    for (const item of ranked) {
      const w = t.stats.get(item.id).wins;
      if (!groups.has(w)) groups.set(w, []);
      groups.get(w).push(item);
    }
    const out = [];
    let rank = 1;
    let tierNum = 1;
    for (const w of [...groups.keys()].sort((a, b) => b - a)) {
      const items = groups.get(w);
      out.push({ tier: tierNum, wins: w, startRank: rank, items });
      rank += items.length;
      tierNum++;
    }
    return out;
  }

  function buildJson(t, options) {
    const jsonFields = (options && options.jsonFields) || [];
    const json = [];
    const withExtras = (item, entry) => {
      for (const f of jsonFields) {
        if (item[f] !== undefined) entry[f] = item[f];
      }
      return entry;
    };
    for (const group of tiers(t)) {
      let rank = group.startRank;
      for (const item of group.items) {
        json.push(withExtras(item, {
          rank: rank++,
          tier: group.tier,
          id: item.id,
          title: item.title,
          wins: group.wins,
        }));
      }
    }
    for (const item of t.eliminated) {
      json.push(withExtras(item, {
        rank: null,
        tier: null,
        id: item.id,
        title: item.title,
        wins: t.stats.get(item.id).wins,
        eliminated: true,
      }));
    }
    return json;
  }

  function itemSummary(item, options) {
    const line = options && typeof options.listLine === "function" ? options.listLine(item) : "";
    return line ? `${item.title} — ${line}` : item.title;
  }

  // Builds a compact, tier-grouped ranking for an email body. Capped so the
  // whole mailto: URL stays within what mail clients accept; truncation lands
  // on a line break rather than cutting an item in half.
  function buildEmailContent(ranking, options) {
    const opts = options || {};
    const noun = opts.noun || "item";
    const maxLength = opts.maxLength || 4000;
    const subject = `My ${noun} ranking`;
    const entryLine = typeof opts.entryLine === "function"
      ? opts.entryLine
      : (entry) => entry.title;

    const lines = [];
    let lastHeading = null;
    for (const e of ranking) {
      const heading = e.eliminated ? "Eliminated" : `${e.wins} Win${e.wins !== 1 ? "s" : ""}`;
      if (heading !== lastHeading) {
        if (lines.length) lines.push("");
        lines.push(`## ${heading}`);
        lastHeading = heading;
      }
      lines.push(entryLine(e) || e.title);
    }

    let body = lines.join("\n");
    const overhead = subject.length + 30;
    if (encodeURIComponent(body).length + overhead > maxLength) {
      const note = "\n(truncated, use Copy JSON for the full ranking)";
      while (body.length && encodeURIComponent(body + note).length + overhead > maxLength) {
        const cut = body.lastIndexOf("\n");
        if (cut < 0) break;
        body = body.slice(0, cut);
      }
      body += note;
    }
    return { subject, body };
  }

  function parseJsonImport(text, itemsById) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return null;
    }
    if (!Array.isArray(parsed)) {
      throw new Error("JSON exports must be an array of ranked entries.");
    }
    return parsed.map((entry) => {
      if (!entry || typeof entry !== "object") {
        throw new Error("JSON exports must contain objects for each ranked item.");
      }
      const item = itemsById.get(String(entry.id));
      if (!item) {
        throw new Error("The pasted JSON does not match the loaded items.");
      }
      return {
        item,
        wins: entry.wins,
        eliminated: !!entry.eliminated,
      };
    });
  }

  function parseEmailImport(text, items, options) {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length || !lines.some((line) => /^##\s+(\d+\s+wins?|eliminated)$/i.test(line))) {
      return null;
    }

    const itemsBySummary = new Map();
    const uniqueTitles = new Map();
    for (const item of items) {
      itemsBySummary.set(itemSummary(item, options), item);
      uniqueTitles.set(item.title, (uniqueTitles.get(item.title) || 0) + 1);
    }

    const entries = [];
    let current = null;
    for (const line of lines) {
      const winsHeader = line.match(/^##\s+(\d+)\s+wins?$/i);
      if (winsHeader) {
        current = { wins: Number(winsHeader[1]), eliminated: false };
        continue;
      }
      if (/^##\s+eliminated$/i.test(line)) {
        current = { wins: 0, eliminated: true };
        continue;
      }
      if (/^\(truncated,/i.test(line)) {
        throw new Error("Truncated email exports cannot be resumed. Use Copy JSON for the full ranking.");
      }
      if (!current) {
        throw new Error("Each email section must start with a '## N Wins' heading.");
      }
      const item =
        itemsBySummary.get(line) ||
        (uniqueTitles.get(line) === 1 ? items.find((candidate) => candidate.title === line) : null);
      if (!item) {
        throw new Error(`Could not match this imported line to a loaded item: ${line}`);
      }
      entries.push({
        item,
        wins: current.wins,
        eliminated: current.eliminated,
      });
    }

    return entries;
  }

  function validateImportedEntries(entries, items, options) {
    const opts = options || {};
    const noun = opts.noun || "item";
    const nounPlural = opts.nounPlural || `${noun}s`;

    if (!entries.length) {
      throw new Error("No ranking entries were found in the pasted export.");
    }
    if (entries.length !== items.length) {
      throw new Error(`Expected ${items.length} ${nounPlural} in the export, found ${entries.length}.`);
    }

    const seen = new Set();
    const winsById = new Map();
    const activeItems = [];
    const eliminatedItems = [];
    let maxWins = 0;
    let lastWins = Infinity;
    let sawEliminated = false;
    let totalWins = 0;

    for (const entry of entries) {
      if (!entry || !entry.item) {
        throw new Error("The pasted export does not match the loaded items.");
      }
      if (seen.has(entry.item.id)) {
        throw new Error(`Duplicate ${noun} found in the pasted export: ${entry.item.title}.`);
      }
      if (!Number.isInteger(entry.wins) || entry.wins < 0) {
        throw new Error("Each imported entry must include a whole-number win count.");
      }
      if (entry.eliminated) {
        sawEliminated = true;
        if (entry.wins !== 0) {
          throw new Error("Eliminated imports must stay at 0 wins.");
        }
        eliminatedItems.push(entry.item);
      } else {
        if (sawEliminated) {
          throw new Error("Eliminated imports must come after the ranked results.");
        }
        if (entry.wins > lastWins) {
          throw new Error("Imported rankings must stay sorted from most wins to fewest wins.");
        }
        activeItems.push(entry.item);
        maxWins = Math.max(maxWins, entry.wins);
        lastWins = entry.wins;
      }
      seen.add(entry.item.id);
      winsById.set(entry.item.id, entry.wins);
      totalWins += entry.wins;
    }

    if (maxWins < 1) {
      throw new Error("The pasted export does not include any completed rounds to resume from.");
    }

    return {
      maxWins,
      winsById,
      activeItems,
      eliminatedItems,
      hasEliminated: sawEliminated,
      totalWins,
    };
  }

  // An export records wins, not rounds. While the pool is intact every round
  // hands out exactly ceil(n/2) wins — floor(n/2) matchups plus a bye when the
  // count is odd — so the round count and the bye count divide back out. The
  // top score alone would undercount: a lone leader who is paired down and
  // loses leaves the whole field a win short of the round number.
  //
  // A trimmed pool breaks the arithmetic, since the round it shrank in is not
  // recorded. There the top score is the best available floor, and the split
  // between matchups and byes is unknowable — hence `exact`.
  function inferProgress(validated, itemCount) {
    const winsPerRound = Math.ceil(itemCount / 2);
    const rounds = validated.totalWins / winsPerRound;
    if (validated.hasEliminated || !Number.isInteger(rounds) || rounds < validated.maxWins) {
      return {
        rounds: validated.maxWins,
        comparisons: validated.totalWins,
        byesAwarded: 0,
        exact: false,
      };
    }
    const byesAwarded = (itemCount % 2) * rounds;
    return {
      rounds,
      comparisons: validated.totalWins - byesAwarded,
      byesAwarded,
      exact: true,
    };
  }

  function importRanking(text, items, options) {
    const opts = options || {};
    const trimmed = String(text == null ? "" : text).trim();
    if (!trimmed) {
      throw new Error("Paste exported JSON or email text to resume.");
    }

    const itemList = Array.isArray(items) ? items : [];
    const itemsById = new Map(itemList.map((item) => [String(item.id), item]));
    const entries =
      parseJsonImport(trimmed, itemsById) ||
      parseEmailImport(trimmed, itemList, options);
    if (!entries) {
      throw new Error("Paste exported JSON or the email body generated by this app.");
    }

    const validated = validateImportedEntries(entries, itemList, options);
    const progress = inferProgress(validated, itemList.length);
    const maxRounds = opts.maxRounds == null ? Math.max(1, itemList.length - 1) : opts.maxRounds;
    if (progress.rounds > maxRounds) {
      throw new Error(`This export shows ${progress.rounds} rounds, but the loaded setup only supports ${maxRounds}.`);
    }

    const tournament = createTournament(itemList);
    tournament.active = validated.activeItems.slice();
    tournament.eliminated = validated.eliminatedItems.slice();
    tournament.round = progress.rounds;
    tournament.comparisons = progress.comparisons;
    tournament.byesAwarded = progress.byesAwarded;

    // Wins are all an export carries. Who played whom, and who sat out, is
    // gone, so a resumed run can repeat a matchup and Buchholz restarts from
    // the rounds still to come.
    for (const item of itemList) {
      const s = tournament.stats.get(item.id);
      s.wins = validated.winsById.get(item.id) || 0;
      s.byes = 0;
      s.opponents = [];
      s.hadBye = false;
      s.buchholz = 0;
    }

    return {
      tournament,
      roundsCompleted: progress.rounds,
      exactComparisonCount: progress.exact,
    };
  }

  // --- Elimination ---
  function eliminationCandidates(t) {
    if (t.round < t.eliminationMinRound) return [];
    const candidates = t.active.filter((item) => t.stats.get(item.id).wins === 0);
    if (t.active.length - candidates.length < t.minActiveAfterElimination) return [];
    return candidates;
  }

  function eliminate(t, candidates) {
    const ids = new Set(candidates.map((i) => i.id));
    const removed = t.active.filter((i) => ids.has(i.id));
    t.eliminated.push(...removed);
    t.active = t.active.filter((i) => !ids.has(i.id));
    return removed;
  }

  function comparisonsPerRound(t) {
    return Math.floor(t.active.length / 2);
  }

  return {
    ELIMINATION_MIN_ROUND,
    MIN_ACTIVE_AFTER_ELIMINATION,
    shuffle,
    createTournament,
    snapshotTournament,
    restoreTournament,
    itemFingerprint,
    snapshotSession,
    restoreSession,
    swissPair,
    startRound,
    recordResult,
    playRound,
    computeRanking,
    tiers,
    buildJson,
    buildEmailContent,
    importRanking,
    eliminationCandidates,
    eliminate,
    comparisonsPerRound,
  };
});

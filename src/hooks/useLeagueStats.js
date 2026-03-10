import { useState, useCallback } from "react";
import { API_KEY, BASE_URL } from "../data/config";

const cache = {};
const CACHE_TTL = 15 * 60 * 1000;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function getCached(key) {
  const e = cache[key];
  if (e && Date.now() - e.ts < CACHE_TTL) return e.value;
  return null;
}
function setCached(key, value) {
  cache[key] = { value, ts: Date.now() };
}
function deleteCached(key) {
  delete cache[key];
}

const TOP5 = {
  PL:  [
    { id: 64,  shortName: "Liverpool",  crest: "https://crests.football-data.org/64.png"  },
    { id: 57,  shortName: "Arsenal",    crest: "https://crests.football-data.org/57.png"  },
    { id: 65,  shortName: "Man City",   crest: "https://crests.football-data.org/65.png"  },
    { id: 61,  shortName: "Chelsea",    crest: "https://crests.football-data.org/61.png"  },
    { id: 73,  shortName: "Spurs",      crest: "https://crests.football-data.org/73.png"  },
  ],
  PD:  [
    { id: 86,  shortName: "R. Madrid",  crest: "https://crests.football-data.org/86.png"  },
    { id: 81,  shortName: "Barcelona",  crest: "https://crests.football-data.org/81.png"  },
    { id: 78,  shortName: "Atlético",   crest: "https://crests.football-data.org/78.png"  },
    { id: 95,  shortName: "Villarreal", crest: "https://crests.football-data.org/95.png"  },
    { id: 77,  shortName: "Athletic",   crest: "https://crests.football-data.org/77.png"  },
  ],
  SA:  [
    { id: 108, shortName: "Inter",      crest: "https://crests.football-data.org/108.png" },
    { id: 113, shortName: "Napoli",     crest: "https://crests.football-data.org/113.png" },
    { id: 109, shortName: "Juventus",   crest: "https://crests.football-data.org/109.png" },
    { id: 98,  shortName: "AC Milan",   crest: "https://crests.football-data.org/98.png"  },
    { id: 100, shortName: "Atalanta",   crest: "https://crests.football-data.org/100.png" },
  ],
  BL1: [
    { id: 5,   shortName: "Bayern",     crest: "https://crests.football-data.org/5.png"   },
    { id: 4,   shortName: "Leverkusen", crest: "https://crests.football-data.org/4.png"   },
    { id: 721, shortName: "Leipzig",    crest: "https://crests.football-data.org/721.png" },
    { id: 3,   shortName: "Dortmund",   crest: "https://crests.football-data.org/3.png"   },
    { id: 19,  shortName: "Frankfurt",  crest: "https://crests.football-data.org/19.png"  },
  ],
  FL1: [
    { id: 524, shortName: "PSG",        crest: "https://crests.football-data.org/524.png" },
    { id: 548, shortName: "Monaco",     crest: "https://crests.football-data.org/548.png" },
    { id: 514, shortName: "Marseille",  crest: "https://crests.football-data.org/514.png" },
    { id: 516, shortName: "Nice",       crest: "https://crests.football-data.org/516.png" },
    { id: 511, shortName: "Lyon",       crest: "https://crests.football-data.org/511.png" },
  ],
};

function calcStats(matches, teamId) {
  const finished = [...matches]
    .filter((m) => m.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 10);

  if (!finished.length) return null;

  const last5Home = finished.filter((m) => m.homeTeam?.id === teamId).slice(0, 5);
  const last5Away = finished.filter((m) => m.awayTeam?.id === teamId).slice(0, 5);

  let wins = 0, draws = 0, losses = 0;
  let goalsFor = 0, goalsAgainst = 0;
  let goalsForHome = 0, goalsAgainstHome = 0;
  let goalsForAway = 0, goalsAgainstAway = 0;

  finished.forEach((m) => {
    const isHome = m.homeTeam?.id === teamId;
    const gf = isHome ? (m.score?.fullTime?.home ?? 0) : (m.score?.fullTime?.away ?? 0);
    const ga = isHome ? (m.score?.fullTime?.away ?? 0) : (m.score?.fullTime?.home ?? 0);
    goalsFor     += gf;
    goalsAgainst += ga;
    const w = m.score?.winner;
    if (w === "DRAW") draws++;
    else if ((w === "HOME_TEAM" && isHome) || (w === "AWAY_TEAM" && !isHome)) wins++;
    else losses++;
  });

  last5Home.forEach((m) => { goalsForHome += m.score?.fullTime?.home ?? 0; goalsAgainstHome += m.score?.fullTime?.away ?? 0; });
  last5Away.forEach((m) => { goalsForAway += m.score?.fullTime?.away ?? 0; goalsAgainstAway += m.score?.fullTime?.home ?? 0; });

  const n  = finished.length;
  const nh = last5Home.length || 1;
  const na = last5Away.length || 1;

  return {
    n, wins, draws, losses,
    winPct:  Math.round((wins  / n) * 100),
    drawPct: Math.round((draws / n) * 100),
    lossPct: Math.round((losses / n) * 100),
    avgGoalsFor:         (goalsFor     / n).toFixed(1),
    avgGoalsAgainst:     (goalsAgainst / n).toFixed(1),
    avgGoalsForHome:     (goalsForHome     / nh).toFixed(1),
    avgGoalsAgainstHome: (goalsAgainstHome / nh).toFixed(1),
    avgGoalsForAway:     (goalsForAway     / na).toFixed(1),
    avgGoalsAgainstAway: (goalsAgainstAway / na).toFixed(1),
    form: finished.map((m) => {
      const isHome = m.homeTeam?.id === teamId;
      const w = m.score?.winner;
      if (w === "DRAW") return "D";
      if ((w === "HOME_TEAM" && isHome) || (w === "AWAY_TEAM" && !isHome)) return "W";
      return "L";
    }),
  };
}

// Carga UN equipo con reintentos automáticos
async function fetchTeamMatches(teamId, { maxRetries = 3, baseDelay = 4000 } = {}) {
  const headers = { "X-Auth-Token": API_KEY };
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(
        `${BASE_URL}/teams/${teamId}/matches?status=FINISHED&limit=15`,
        { headers }
      );
      if (res.status === 429) {
        // Rate limit: esperar más antes de reintentar
        const retryAfter = (attempt * 8000);
        await wait(retryAfter);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data?.matches || [];
    } catch (e) {
      if (attempt === maxRetries) throw e;
      await wait(baseDelay * attempt); // backoff exponencial
    }
  }
  throw new Error("Sin respuesta tras reintentos");
}

export function useLeagueStats() {
  const [statsByLeague, setStatsByLeague] = useState({});
  const [loadingLeague, setLoadingLeague] = useState({});
  const [errorLeague,   setErrorLeague]   = useState({});
  const [progress,      setProgress]      = useState(0);
  const [totalTeams]                      = useState(25);

  const loadLeagueStats = useCallback(async (leagueCode, { retryFailed = false } = {}) => {
    const cacheKey = `lstats3_${leagueCode}`;

    // Si es retry, limpiar cache para recargar desde cero solo los fallidos
    if (retryFailed) deleteCached(cacheKey);

    const cached = getCached(cacheKey);
    if (cached) {
      // Si hay fallidos y no es retry explícito, no recargar
      const hasFailed = cached.some(e => !e.stats);
      if (!hasFailed) {
        setStatsByLeague((prev) => ({ ...prev, [leagueCode]: cached }));
        return;
      }
    }

    setLoadingLeague((prev) => ({ ...prev, [leagueCode]: true }));
    setErrorLeague((prev)   => ({ ...prev, [leagueCode]: null }));

    const teams = TOP5[leagueCode] || [];

    // Partir de resultados existentes si los hay (para no perder los que ya cargaron)
    const existing = statsByLeague[leagueCode] || [];
    const results  = teams.map((team, i) => ({
      team, position: i + 1,
      stats: existing[i]?.stats || null, // conservar los que ya cargaron
    }));

    for (let i = 0; i < teams.length; i++) {
      // Si ya tiene stats y no es retry de fallidos, saltear
      if (results[i].stats && !retryFailed) {
        continue;
      }
      // En retry: solo recargar los que fallaron (stats === null)
      if (retryFailed && results[i].stats) {
        continue;
      }

      const team = teams[i];
      try {
        const matches = await fetchTeamMatches(team.id);
        results[i] = { team, position: i + 1, stats: calcStats(matches, team.id) };
      } catch (e) {
        results[i] = { team, position: i + 1, stats: null, error: e.message };
      }

      setStatsByLeague((prev) => ({ ...prev, [leagueCode]: [...results] }));
      setProgress((prev) => prev + 1);

      if (i < teams.length - 1) await wait(3500);
    }

    // Solo cachear si todos cargaron bien
    const allLoaded = results.every(r => r.stats !== null);
    if (allLoaded) setCached(cacheKey, results);

    setLoadingLeague((prev) => ({ ...prev, [leagueCode]: false }));
  }, [statsByLeague]);

  // Reintenta solo los equipos fallidos de todas las ligas
  const retryFailed = useCallback(async () => {
    const BIG_LEAGUES = ["PL", "PD", "SA", "BL1", "FL1"];
    const leaguesWithFailed = BIG_LEAGUES.filter((code) => {
      const teams = statsByLeague[code];
      return teams?.some(t => !t.stats);
    });

    for (const code of leaguesWithFailed) {
      await loadLeagueStats(code, { retryFailed: true });
      await wait(3000);
    }
  }, [statsByLeague, loadLeagueStats]);

  // Cuántos equipos fallaron en total
  const failedCount = Object.values(statsByLeague)
    .flat()
    .filter(e => e && !e.stats).length;

  return { statsByLeague, loadingLeague, errorLeague, loadLeagueStats, retryFailed, progress, totalTeams, failedCount };
}

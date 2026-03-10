import { useState, useCallback } from "react";
import { API_KEY, BASE_URL } from "../data/config";

const cache = {};
const CACHE_TTL = 20 * 60 * 1000;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function getCached(key) {
  const e = cache[key];
  if (e && Date.now() - e.ts < CACHE_TTL) return e.value;
  return null;
}
function setCached(key, value) {
  cache[key] = { value, ts: Date.now() };
}

// Top 10 por liga — 50 equipos totales
const ALL_TEAMS = [
  // Premier League
  { id: 64,  shortName: "Liverpool",    crest: "https://crests.football-data.org/64.png",  league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 57,  shortName: "Arsenal",      crest: "https://crests.football-data.org/57.png",  league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 65,  shortName: "Man City",     crest: "https://crests.football-data.org/65.png",  league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 61,  shortName: "Chelsea",      crest: "https://crests.football-data.org/61.png",  league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 73,  shortName: "Spurs",        crest: "https://crests.football-data.org/73.png",  league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 66,  shortName: "Man United",   crest: "https://crests.football-data.org/66.png",  league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 563, shortName: "Newcastle",    crest: "https://crests.football-data.org/563.png", league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 397, shortName: "Aston Villa",  crest: "https://crests.football-data.org/397.png", league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 354, shortName: "Brighton",     crest: "https://crests.football-data.org/354.png", league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 341, shortName: "Bournemouth",  crest: "https://crests.football-data.org/341.png", league: "PL",  leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  // La Liga
  { id: 86,  shortName: "R. Madrid",    crest: "https://crests.football-data.org/86.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 81,  shortName: "Barcelona",    crest: "https://crests.football-data.org/81.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 78,  shortName: "Atlético",     crest: "https://crests.football-data.org/78.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 95,  shortName: "Villarreal",   crest: "https://crests.football-data.org/95.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 77,  shortName: "Athletic",     crest: "https://crests.football-data.org/77.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 90,  shortName: "Real Betis",   crest: "https://crests.football-data.org/90.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 87,  shortName: "Rayo",         crest: "https://crests.football-data.org/87.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 94,  shortName: "Valencia",     crest: "https://crests.football-data.org/94.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 92,  shortName: "Real Socied.", crest: "https://crests.football-data.org/92.png",  league: "PD",  leagueFlag: "🇪🇸" },
  { id: 264, shortName: "Sevilla",      crest: "https://crests.football-data.org/264.png", league: "PD",  leagueFlag: "🇪🇸" },
  // Serie A
  { id: 108, shortName: "Inter",        crest: "https://crests.football-data.org/108.png", league: "SA",  leagueFlag: "🇮🇹" },
  { id: 113, shortName: "Napoli",       crest: "https://crests.football-data.org/113.png", league: "SA",  leagueFlag: "🇮🇹" },
  { id: 109, shortName: "Juventus",     crest: "https://crests.football-data.org/109.png", league: "SA",  leagueFlag: "🇮🇹" },
  { id: 98,  shortName: "AC Milan",     crest: "https://crests.football-data.org/98.png",  league: "SA",  leagueFlag: "🇮🇹" },
  { id: 100, shortName: "Atalanta",     crest: "https://crests.football-data.org/100.png", league: "SA",  leagueFlag: "🇮🇹" },
  { id: 107, shortName: "Fiorentina",   crest: "https://crests.football-data.org/107.png", league: "SA",  leagueFlag: "🇮🇹" },
  { id: 99,  shortName: "Lazio",        crest: "https://crests.football-data.org/99.png",  league: "SA",  leagueFlag: "🇮🇹" },
  { id: 102, shortName: "Roma",         crest: "https://crests.football-data.org/102.png", league: "SA",  leagueFlag: "🇮🇹" },
  { id: 586, shortName: "Torino",       crest: "https://crests.football-data.org/586.png", league: "SA",  leagueFlag: "🇮🇹" },
  { id: 103, shortName: "Bologna",      crest: "https://crests.football-data.org/103.png", league: "SA",  leagueFlag: "🇮🇹" },
  // Bundesliga
  { id: 5,   shortName: "Bayern",       crest: "https://crests.football-data.org/5.png",   league: "BL1", leagueFlag: "🇩🇪" },
  { id: 4,   shortName: "Leverkusen",   crest: "https://crests.football-data.org/4.png",   league: "BL1", leagueFlag: "🇩🇪" },
  { id: 721, shortName: "Leipzig",      crest: "https://crests.football-data.org/721.png", league: "BL1", leagueFlag: "🇩🇪" },
  { id: 3,   shortName: "Dortmund",     crest: "https://crests.football-data.org/3.png",   league: "BL1", leagueFlag: "🇩🇪" },
  { id: 19,  shortName: "Frankfurt",    crest: "https://crests.football-data.org/19.png",  league: "BL1", leagueFlag: "🇩🇪" },
  { id: 18,  shortName: "Stuttgart",    crest: "https://crests.football-data.org/18.png",  league: "BL1", leagueFlag: "🇩🇪" },
  { id: 10,  shortName: "Mönchengladb.",crest: "https://crests.football-data.org/10.png",  league: "BL1", leagueFlag: "🇩🇪" },
  { id: 11,  shortName: "Freiburg",     crest: "https://crests.football-data.org/11.png",  league: "BL1", leagueFlag: "🇩🇪" },
  { id: 16,  shortName: "Augsburg",     crest: "https://crests.football-data.org/16.png",  league: "BL1", leagueFlag: "🇩🇪" },
  { id: 1,   shortName: "Werder",       crest: "https://crests.football-data.org/1.png",   league: "BL1", leagueFlag: "🇩🇪" },
  // Ligue 1
  { id: 524, shortName: "PSG",          crest: "https://crests.football-data.org/524.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 548, shortName: "Monaco",       crest: "https://crests.football-data.org/548.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 514, shortName: "Marseille",    crest: "https://crests.football-data.org/514.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 516, shortName: "Nice",         crest: "https://crests.football-data.org/516.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 511, shortName: "Lyon",         crest: "https://crests.football-data.org/511.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 523, shortName: "Lens",         crest: "https://crests.football-data.org/523.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 521, shortName: "Rennes",       crest: "https://crests.football-data.org/521.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 512, shortName: "Brest",        crest: "https://crests.football-data.org/512.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 529, shortName: "Reims",        crest: "https://crests.football-data.org/529.png", league: "FL1", leagueFlag: "🇫🇷" },
  { id: 518, shortName: "Strasbourg",   crest: "https://crests.football-data.org/518.png", league: "FL1", leagueFlag: "🇫🇷" },
];

function calcGoalProbs(matches, teamId) {
  const finished = [...matches]
    .filter((m) => m.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 10);

  if (finished.length < 3) return null; // muy pocos datos

  let over05For = 0, over05Ag = 0, over15 = 0, over25 = 0, btts = 0;

  finished.forEach((m) => {
    const isHome = m.homeTeam?.id === teamId;
    const gf = isHome ? (m.score?.fullTime?.home ?? 0) : (m.score?.fullTime?.away ?? 0);
    const ga = isHome ? (m.score?.fullTime?.away ?? 0) : (m.score?.fullTime?.home ?? 0);
    const total = gf + ga;
    if (gf >= 1)    over05For++;
    if (ga >= 1)    over05Ag++;
    if (total >= 2) over15++;
    if (total >= 3) over25++;
    if (gf >= 1 && ga >= 1) btts++;
  });

  const n = finished.length;
  return {
    n,
    prob05For:   Math.round((over05For / n) * 100),
    prob05Ag:    Math.round((over05Ag  / n) * 100),
    prob15:      Math.round((over15    / n) * 100),
    prob25:      Math.round((over25    / n) * 100),
    probBTTS:    Math.round((btts      / n) * 100),
  };
}

export function useGoalRankings() {
  const [teamData,  setTeamData]  = useState({}); // { teamId: { probs, team } }
  const [progress,  setProgress]  = useState(0);  // 0-50
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState(null);

  const loadRankings = useCallback(async () => {
    const cacheKey = "goal_rankings_v1";
    const cached = getCached(cacheKey);
    if (cached) {
      setTeamData(cached);
      setDone(true);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    const headers = { "X-Auth-Token": API_KEY };
    const result  = {};

    // De a 2 en paralelo con 2.5s entre lotes
    for (let i = 0; i < ALL_TEAMS.length; i += 2) {
      const batch = ALL_TEAMS.slice(i, i + 2);

      await Promise.all(batch.map(async (team) => {
        try {
          const res = await fetch(
            `${BASE_URL}/teams/${team.id}/matches?status=FINISHED&limit=15`,
            { headers }
          );
          if (!res.ok) return;
          const data    = await res.json();
          const matches = data?.matches || [];
          const probs   = calcGoalProbs(matches, team.id);
          if (probs) result[team.id] = { team, probs };
        } catch (_) { /* skip */ }
      }));

      setProgress(Math.min(i + 2, ALL_TEAMS.length));
      // Actualizar ranking parcial en tiempo real
      setTeamData({ ...result });

      if (i + 2 < ALL_TEAMS.length) await wait(2500);
    }

    setCached(cacheKey, result);
    setTeamData(result);
    setLoading(false);
    setDone(true);
  }, []);

  // Rankings derivados ordenados — top 10 de cada categoría
  const getRanking = (metric) =>
    Object.values(teamData)
      .filter((e) => e.probs)
      .sort((a, b) => b.probs[metric] - a.probs[metric])
      .slice(0, 10);

  return { teamData, progress, loading, done, error, loadRankings, getRanking, total: ALL_TEAMS.length };
}

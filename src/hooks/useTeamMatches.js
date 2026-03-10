import { useState, useCallback } from "react";
import { API_KEY, BASE_URL } from "../data/config";

const cache = {};
const CACHE_TTL = 10 * 60 * 1000;

function getCached(key) {
  const e = cache[key];
  if (e && Date.now() - e.ts < CACHE_TTL) return e.value;
  return null;
}
function setCached(key, value) {
  cache[key] = { value, ts: Date.now() };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const FREE_COMP_IDS = new Set([2021, 2014, 2019, 2002, 2015, 2003, 2017, 2016, 2013, 2001, 2018, 2000]);

function getCompetitionIds(teamData) {
  return (teamData?.runningCompetitions || [])
    .map((c) => c.id)
    .filter((id) => FREE_COMP_IDS.has(id))
    .slice(0, 2);
}

export function calcProbabilities(matches, teamId) {
  const finished  = matches.filter((m) => m.status === "FINISHED");
  const last10    = finished.slice(0, 10);
  const last5Home = finished.filter((m) => m.homeTeam?.id === teamId).slice(0, 5);
  const last5Away = finished.filter((m) => m.awayTeam?.id === teamId).slice(0, 5);

  if (last10.length === 0) return null;

  let wins = 0, draws = 0, losses = 0;
  let goalsFor = 0, goalsAgainst = 0;

  // Contadores para las probabilidades de goles
  let over05For    = 0; // partidos con ≥1 gol a favor
  let over05Ag     = 0; // partidos con ≥1 gol en contra
  let over15Total  = 0; // partidos con ≥2 goles totales
  let over25Total  = 0; // partidos con ≥3 goles totales
  let btts         = 0; // ambos equipos marcaron

  last10.forEach((m) => {
    const isHome = m.homeTeam?.id === teamId;
    const gf = isHome ? (m.score?.fullTime?.home ?? 0) : (m.score?.fullTime?.away ?? 0);
    const ga = isHome ? (m.score?.fullTime?.away ?? 0) : (m.score?.fullTime?.home ?? 0);
    const total = gf + ga;

    goalsFor     += gf;
    goalsAgainst += ga;

    const winner = m.score?.winner;
    if (winner === "DRAW") draws++;
    else if ((winner === "HOME_TEAM" && isHome) || (winner === "AWAY_TEAM" && !isHome)) wins++;
    else losses++;

    if (gf >= 1)   over05For++;
    if (ga >= 1)   over05Ag++;
    if (total >= 2) over15Total++;
    if (total >= 3) over25Total++;
    if (gf >= 1 && ga >= 1) btts++;
  });

  const n = last10.length;

  return {
    wins, draws, losses, n,
    winPct:  Math.round((wins  / n) * 100),
    drawPct: Math.round((draws / n) * 100),
    lossPct: Math.round((losses / n) * 100),
    avgGoalsFor:     (goalsFor     / n).toFixed(1),
    avgGoalsAgainst: (goalsAgainst / n).toFixed(1),
    // Probabilidades de goles (% basado en últimos 10)
    prob05For:   Math.round((over05For   / n) * 100), // +0.5 goles a favor
    prob05Ag:    Math.round((over05Ag    / n) * 100), // +0.5 goles en contra
    prob15Total: Math.round((over15Total / n) * 100), // +1.5 goles totales
    prob25Total: Math.round((over25Total / n) * 100), // +2.5 goles totales
    probBTTS:    Math.round((btts        / n) * 100), // ambos marcan
    // raw para mostrar fracción
    over05ForRaw:   `${over05For}/${n}`,
    over05AgRaw:    `${over05Ag}/${n}`,
    over15TotalRaw: `${over15Total}/${n}`,
    over25TotalRaw: `${over25Total}/${n}`,
    bttRaw:         `${btts}/${n}`,
    form: last10.map((m) => {
      const isHome = m.homeTeam?.id === teamId;
      const w = m.score?.winner;
      if (w === "DRAW") return "D";
      if ((w === "HOME_TEAM" && isHome) || (w === "AWAY_TEAM" && !isHome)) return "W";
      return "L";
    }),
  };
}

export function useTeamMatches() {
  const [teamMatches,   setTeamMatches]   = useState([]);
  const [teamInfo,      setTeamInfo]      = useState(null);
  const [probabilities, setProbabilities] = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);

  const loadTeamMatches = useCallback(async (teamId) => {
    const cacheKey = `team_${teamId}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setTeamMatches(cached.matches);
      setTeamInfo(cached.team);
      setProbabilities(calcProbabilities(cached.matches, teamId));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const baseHeaders   = { "X-Auth-Token": API_KEY };
      const unfoldHeaders = { ...baseHeaders, "X-Unfold-Goals": "true" };

      const teamRes = await fetch(`${BASE_URL}/teams/${teamId}`, { headers: baseHeaders });
      const team    = await teamRes.json();
      await wait(1500);

      const compIds = getCompetitionIds(team);
      let allMatches = [];

      if (compIds.length > 0) {
        for (const compId of compIds) {
          try {
            const res = await fetch(
              `${BASE_URL}/competitions/${compId}/matches?status=FINISHED&limit=15`,
              { headers: unfoldHeaders }
            );
            if (!res.ok) continue;
            const data = await res.json();
            const compMatches = (data?.matches || [])
              .filter((m) => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId);
            allMatches = [...allMatches, ...compMatches];
          } catch (e) { /* silent */ }
          if (compIds.indexOf(compId) < compIds.length - 1) await wait(1500);
        }
        allMatches = allMatches
          .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
          .slice(0, 10);
      }

      if (allMatches.length === 0) {
        await wait(1500);
        const fallbackRes = await fetch(
          `${BASE_URL}/teams/${teamId}/matches/?status=FINISHED&limit=10`,
          { headers: unfoldHeaders }
        );
        const fallbackData = await fallbackRes.json();
        allMatches = fallbackData?.matches || [];
      }

      setCached(cacheKey, { matches: allMatches, team });
      setTeamMatches(allMatches);
      setTeamInfo(team);
      setProbabilities(calcProbabilities(allMatches, teamId));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setTeamMatches([]);
    setTeamInfo(null);
    setProbabilities(null);
    setError(null);
  }, []);

  return { teamMatches, teamInfo, probabilities, loading, error, loadTeamMatches, clear };
}

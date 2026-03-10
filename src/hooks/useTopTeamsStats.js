import { useState, useCallback } from "react";
import { ALL_TOP_TEAMS, SEASON } from "../data/topTeams";

// Proxy configurado en vite.config.js → apunta a https://v3.football.api-sports.io
const BASE = "/apisports";

const statsCache = {};
let loadingStarted = false;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function parseCards(cardsObj) {
  // cards.yellow / cards.red vienen como { "0-15": { total: 2 }, "16-30": { total: 1 }, ... }
  return Object.values(cardsObj || {}).reduce((acc, v) => acc + (v?.total || 0), 0);
}

function parseStats(response, teamId) {
  const r = response;
  if (!r) return null;

  const played     = r.fixtures?.played?.total || 1;
  const playedHome = r.fixtures?.played?.home  || 1;
  const playedAway = r.fixtures?.played?.away  || 1;

  // Corners — vienen en biggest o en cards según versión. En v3 están en statistics[]
  // El endpoint /teams/statistics devuelve corners dentro de "cards" no, sino que
  // los corners NO están en /teams/statistics — hay que usar /fixtures/statistics
  // Sin embargo sí devuelve: goals, cards (yellow/red por minuto), fixtures, form, lineups

  const yellowTotal = parseCards(r.cards?.yellow);
  const redTotal    = parseCards(r.cards?.red);

  return {
    played,
    // Goles
    avgGoalsFor:     r.goals?.for?.average?.total      || "0.0",
    avgGoalsAgainst: r.goals?.against?.average?.total  || "0.0",
    avgGoalsForHome: r.goals?.for?.average?.home       || "0.0",
    avgGoalsForAway: r.goals?.for?.average?.away       || "0.0",
    // Tarjetas
    yellowTotal,
    redTotal,
    avgYellow: (yellowTotal / played).toFixed(1),
    avgRed:    (redTotal    / played).toFixed(2),
    avgCards:  ((yellowTotal + redTotal) / played).toFixed(1),
    // Forma
    form:  r.form || "",
    wins:  r.fixtures?.wins?.total  || 0,
    draws: r.fixtures?.draws?.total || 0,
    losses: r.fixtures?.loses?.total || 0,
    // Clean sheets
    cleanSheets:     r.clean_sheet?.total || 0,
    cleanSheetsHome: r.clean_sheet?.home  || 0,
    cleanSheetsAway: r.clean_sheet?.away  || 0,
    // Penalty
    penGoals:   r.penalty?.scored?.total  || 0,
    penMissed:  r.penalty?.missed?.total  || 0,
  };
}

export function useTopTeamsStats(apiKey) {
  const [stats,    setStats]    = useState({ ...statsCache });
  const [progress, setProgress] = useState({ done: 0, total: ALL_TOP_TEAMS.length });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const fetchOne = useCallback(async (team) => {
    const key = `${team.leagueCode}_${team.apiId}`;
    if (statsCache[key]) return;

    const res = await fetch(
      `${BASE}/teams/statistics?league=${team.leagueApiId}&season=${SEASON}&team=${team.apiId}`,
      { headers: { "x-apisports-key": apiKey } }
    );

    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${team.name}`);

    const data    = await res.json();
    const parsed  = parseStats(data?.response, team.apiId);
    if (!parsed) return;

    statsCache[key] = { ...team, ...parsed };
  }, [apiKey]);

  const loadAll = useCallback(async () => {
    if (loadingStarted) return;
    if (Object.keys(statsCache).length >= ALL_TOP_TEAMS.length) {
      setStats({ ...statsCache });
      return;
    }

    loadingStarted = true;
    setLoading(true);
    setError(null);

    let done = 0;
    for (const team of ALL_TOP_TEAMS) {
      try {
        await fetchOne(team);
      } catch (e) {
        if (e.message === "RATE_LIMIT") {
          setError("Límite de API-Football alcanzado (100/día). Intentá mañana.");
          break;
        }
        console.warn(`Error ${team.name}:`, e.message);
      }
      done++;
      setProgress({ done, total: ALL_TOP_TEAMS.length });
      setStats({ ...statsCache });
      if (done < ALL_TOP_TEAMS.length) await wait(700);
    }

    setLoading(false);
    loadingStarted = false;
  }, [fetchOne]);

  // Busca stats de un equipo por nombre (fuzzy) y liga
  const getTeamStats = useCallback((teamName, leagueCode) => {
    const name = (teamName || "").toLowerCase();
    return Object.values(statsCache).find((s) => {
      const match = s.name.toLowerCase() === name ||
                    name.includes(s.name.toLowerCase()) ||
                    s.name.toLowerCase().includes(name);
      return match && (!leagueCode || s.leagueCode === leagueCode);
    }) || null;
  }, []);

  return { stats, loading, error, progress, loadAll, getTeamStats };
}

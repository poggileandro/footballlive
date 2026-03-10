import { useState, useCallback } from "react";
import { API_KEY, BASE_URL } from "../data/config";
import { calcProbabilities } from "./useTeamMatches";

const cache = {};
const CACHE_TTL = 15 * 60 * 1000;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function getCached(key) {
  const e = cache[key];
  if (e && Date.now() - e.ts < CACHE_TTL) return e.value;
  return null;
}
function setCached(key, value) { cache[key] = { value, ts: Date.now() }; }

async function fetchTeam(teamId) {
  const headers = { "X-Auth-Token": API_KEY };
  const [infoRes, matchRes] = await Promise.all([
    fetch(`${BASE_URL}/teams/${teamId}`, { headers }),
    fetch(`${BASE_URL}/teams/${teamId}/matches?status=FINISHED&limit=15`, { headers }),
  ]);
  const info    = await infoRes.json();
  const matches = (await matchRes.json())?.matches || [];
  return { info, matches };
}

export function useMatchPreview() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const loadPreview = useCallback(async (homeTeam, awayTeam) => {
    const key = `preview_${homeTeam.id}_${awayTeam.id}`;
    const cached = getCached(key);
    if (cached) { setPreview(cached); return; }

    setLoading(true);
    setError(null);
    try {
      const [homeData] = await Promise.all([fetchTeam(homeTeam.id)]);
      await wait(2000);
      const [awayData] = await Promise.all([fetchTeam(awayTeam.id)]);

      const homeProbs = calcProbabilities(homeData.matches, homeTeam.id);
      const awayProbs = calcProbabilities(awayData.matches, awayTeam.id);

      // Calcular probabilidad de victoria cruzada simple (método ELO simplificado)
      // Basado en % victorias recientes ponderado por rivales
      const homeWinBase = homeProbs?.winPct || 33;
      const awayWinBase = awayProbs?.winPct || 33;
      const total = homeWinBase + awayWinBase;
      const homeWinPct = Math.round((homeWinBase / total) * 60); // cap al 60% máximo
      const awayWinPct = Math.round((awayWinBase / total) * 60);
      const drawPct    = 100 - homeWinPct - awayWinPct;

      // Goles esperados del partido
      const expGoalsHome = ((parseFloat(homeProbs?.avgGoalsFor || 1.2) + parseFloat(awayProbs?.avgGoalsAgainst || 1.2)) / 2).toFixed(1);
      const expGoalsAway = ((parseFloat(awayProbs?.avgGoalsFor || 1.0) + parseFloat(homeProbs?.avgGoalsAgainst || 1.0)) / 2).toFixed(1);
      const expTotal     = (parseFloat(expGoalsHome) + parseFloat(expGoalsAway)).toFixed(1);

      // Probabilidad over/under
      const over25 = Math.round((homeProbs?.prob25Total + awayProbs?.prob25Total) / 2);
      const btts    = Math.round((homeProbs?.probBTTS    + awayProbs?.probBTTS)    / 2);

      const result = {
        home: { team: homeTeam, probs: homeProbs, info: homeData.info, matches: homeData.matches },
        away: { team: awayTeam, probs: awayProbs, info: awayData.info, matches: awayData.matches },
        prediction: { homeWinPct, drawPct, awayWinPct, expGoalsHome, expGoalsAway, expTotal, over25, btts },
      };

      setCached(key, result);
      setPreview(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => { setPreview(null); setError(null); }, []);

  return { preview, loading, error, loadPreview, clear };
}

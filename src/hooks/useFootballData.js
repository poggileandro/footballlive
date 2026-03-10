import { useState, useCallback, useRef } from "react";
import { API_KEY, BASE_URL } from "../data/config";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cache = {};
const CACHE_TTL = 10 * 60 * 1000;

export function useFootballData() {
  const [data, setData] = useState({
    results: [], upcoming: [], standings: {}, compResults: {},
  });
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);
  const isLoadingRef = useRef(false);

  const fetchEndpoint = useCallback(async (endpoint, options = {}) => {
    if (cache[endpoint] && Date.now() - cache[endpoint].timestamp < CACHE_TTL) {
      return cache[endpoint].value;
    }
    const headers = { "X-Auth-Token": API_KEY };
    if (options.unfold) {
      headers["X-Unfold-Goals"]    = "true";
      headers["X-Unfold-Subs"]     = "true";
      headers["X-Unfold-Bookings"] = "true";
    }
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (res.status === 429) throw new Error("Límite de requests alcanzado. Esperá un minuto.");
    if (res.status === 403) throw new Error("API key inválida o sin permisos.");
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    const json = await res.json();
    cache[endpoint] = { value: json, timestamp: Date.now() };
    return json;
  }, []);

  // 2 requests: resultados + próximos (sin live)
  const loadMatches = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const today    = new Date().toISOString().split("T")[0];
      const weekAgo  = new Date(Date.now() - 7 * 864e5).toISOString().split("T")[0];
      const nextWeek = new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0];
      const ids      = "PL,PD,SA,BL1,FL1";

      const resultsRes = await fetchEndpoint(
        `/matches?status=FINISHED&dateFrom=${weekAgo}&dateTo=${today}&competitions=${ids}`,
        { unfold: true }
      );
      await wait(2000);
      const upcomingRes = await fetchEndpoint(
        `/matches?status=SCHEDULED&dateFrom=${today}&dateTo=${nextWeek}&competitions=${ids}`
      );

      setData((prev) => ({
        ...prev,
        results:  resultsRes?.matches?.slice(0, 50)  || [],
        upcoming: upcomingRes?.matches?.slice(0, 50) || [],
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchEndpoint]);

  const loadStandings = useCallback(async (leagueId) => {
    if (isLoadingRef.current) return;
    const endpoint = `/competitions/${leagueId}/standings`;
    if (cache[endpoint] && Date.now() - cache[endpoint].timestamp < CACHE_TTL) {
      const table = cache[endpoint].value?.standings?.[0]?.table;
      if (table) setData((prev) => ({ ...prev, standings: { ...prev.standings, [leagueId]: table } }));
      return;
    }
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const r = await fetchEndpoint(endpoint);
      if (r?.standings?.[0]?.table) {
        setData((prev) => ({
          ...prev,
          standings: { ...prev.standings, [leagueId]: r.standings[0].table },
        }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchEndpoint]);

  const loadCompetitionResults = useCallback(async (leagueCode) => {
    if (isLoadingRef.current) return;
    const COMP_IDS = { PL: 2021, PD: 2014, SA: 2019, BL1: 2002, FL1: 2015, DED: 2003, PPL: 2017, ELC: 2016, BSB: 2013, CL: 2001, EC: 2018, WC: 2000 };
    const compId = COMP_IDS[leagueCode];
    if (!compId) return;

    const endpoint = `/competitions/${compId}/matches?status=FINISHED`;
    if (cache[endpoint] && Date.now() - cache[endpoint].timestamp < CACHE_TTL) {
      const matches = cache[endpoint].value?.matches || [];
      const maxMatchday = Math.max(...matches.map(m => m.matchday || 0));
      const lastRound = matches.filter(m => m.matchday === maxMatchday);
      setData((prev) => ({
        ...prev,
        compResults: { ...prev.compResults, [leagueCode]: lastRound },
      }));
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const r = await fetchEndpoint(endpoint, { unfold: true });
      const matches = r?.matches || [];
      const maxMatchday = Math.max(...matches.map(m => m.matchday || 0));
      const lastRound = matches.filter(m => m.matchday === maxMatchday);
      setData((prev) => ({
        ...prev,
        compResults: { ...prev.compResults, [leagueCode]: lastRound },
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchEndpoint]);

  const forceRefresh = useCallback(() => {
    Object.keys(cache).forEach((k) => delete cache[k]);
    loadMatches();
  }, [loadMatches]);

  return { data, loading, error, loadMatches, loadStandings, loadCompetitionResults, forceRefresh };
}

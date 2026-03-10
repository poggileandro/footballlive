import { useState, useCallback } from "react";

const KEY = "football_favorites_v1";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
function save(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => load());

  const toggle = useCallback((team) => {
    setFavorites((prev) => {
      const exists = prev.some((t) => t.id === team.id);
      const next   = exists ? prev.filter((t) => t.id !== team.id) : [...prev, { id: team.id, name: team.name || team.shortName, shortName: team.shortName || team.name, crest: team.crest }];
      save(next);
      return next;
    });
  }, []);

  const isFav = useCallback((id) => favorites.some((t) => t.id === id), [favorites]);

  return { favorites, toggle, isFav };
}

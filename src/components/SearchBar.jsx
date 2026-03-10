import { useState, useRef, useEffect } from "react";

const KNOWN_TEAMS = [
  { id: 64,  shortName: "Liverpool",    crest: "https://crests.football-data.org/64.png",  league: "Premier League" },
  { id: 57,  shortName: "Arsenal",      crest: "https://crests.football-data.org/57.png",  league: "Premier League" },
  { id: 65,  shortName: "Man City",     crest: "https://crests.football-data.org/65.png",  league: "Premier League" },
  { id: 61,  shortName: "Chelsea",      crest: "https://crests.football-data.org/61.png",  league: "Premier League" },
  { id: 73,  shortName: "Spurs",        crest: "https://crests.football-data.org/73.png",  league: "Premier League" },
  { id: 66,  shortName: "Man United",   crest: "https://crests.football-data.org/66.png",  league: "Premier League" },
  { id: 563, shortName: "Newcastle",    crest: "https://crests.football-data.org/563.png", league: "Premier League" },
  { id: 397, shortName: "Aston Villa",  crest: "https://crests.football-data.org/397.png", league: "Premier League" },
  { id: 354, shortName: "Brighton",     crest: "https://crests.football-data.org/354.png", league: "Premier League" },
  { id: 86,  shortName: "R. Madrid",    crest: "https://crests.football-data.org/86.png",  league: "La Liga" },
  { id: 81,  shortName: "Barcelona",    crest: "https://crests.football-data.org/81.png",  league: "La Liga" },
  { id: 78,  shortName: "Atlético",     crest: "https://crests.football-data.org/78.png",  league: "La Liga" },
  { id: 95,  shortName: "Villarreal",   crest: "https://crests.football-data.org/95.png",  league: "La Liga" },
  { id: 77,  shortName: "Athletic",     crest: "https://crests.football-data.org/77.png",  league: "La Liga" },
  { id: 90,  shortName: "Real Betis",   crest: "https://crests.football-data.org/90.png",  league: "La Liga" },
  { id: 264, shortName: "Sevilla",      crest: "https://crests.football-data.org/264.png", league: "La Liga" },
  { id: 108, shortName: "Inter",        crest: "https://crests.football-data.org/108.png", league: "Serie A" },
  { id: 113, shortName: "Napoli",       crest: "https://crests.football-data.org/113.png", league: "Serie A" },
  { id: 109, shortName: "Juventus",     crest: "https://crests.football-data.org/109.png", league: "Serie A" },
  { id: 98,  shortName: "AC Milan",     crest: "https://crests.football-data.org/98.png",  league: "Serie A" },
  { id: 100, shortName: "Atalanta",     crest: "https://crests.football-data.org/100.png", league: "Serie A" },
  { id: 107, shortName: "Fiorentina",   crest: "https://crests.football-data.org/107.png", league: "Serie A" },
  { id: 99,  shortName: "Lazio",        crest: "https://crests.football-data.org/99.png",  league: "Serie A" },
  { id: 102, shortName: "Roma",         crest: "https://crests.football-data.org/102.png", league: "Serie A" },
  { id: 5,   shortName: "Bayern",       crest: "https://crests.football-data.org/5.png",   league: "Bundesliga" },
  { id: 4,   shortName: "Leverkusen",   crest: "https://crests.football-data.org/4.png",   league: "Bundesliga" },
  { id: 721, shortName: "Leipzig",      crest: "https://crests.football-data.org/721.png", league: "Bundesliga" },
  { id: 3,   shortName: "Dortmund",     crest: "https://crests.football-data.org/3.png",   league: "Bundesliga" },
  { id: 19,  shortName: "Frankfurt",    crest: "https://crests.football-data.org/19.png",  league: "Bundesliga" },
  { id: 18,  shortName: "Stuttgart",    crest: "https://crests.football-data.org/18.png",  league: "Bundesliga" },
  { id: 524, shortName: "PSG",          crest: "https://crests.football-data.org/524.png", league: "Ligue 1" },
  { id: 548, shortName: "Monaco",       crest: "https://crests.football-data.org/548.png", league: "Ligue 1" },
  { id: 514, shortName: "Marseille",    crest: "https://crests.football-data.org/514.png", league: "Ligue 1" },
  { id: 516, shortName: "Nice",         crest: "https://crests.football-data.org/516.png", league: "Ligue 1" },
  { id: 511, shortName: "Lyon",         crest: "https://crests.football-data.org/511.png", league: "Ligue 1" },
];

export default function SearchBar({ onSelectTeam }) {
  const [query,   setQuery]   = useState("");
  const [open,    setOpen]    = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);

  const results = query.length > 1
    ? KNOWN_TEAMS.filter((t) => t.shortName.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClick = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative", flex: 1, maxWidth: 240 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: focused ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 12, padding: "7px 12px",
        transition: "all 0.2s",
      }}>
        <span style={{ fontSize: 13, opacity: 0.5 }}>🔍</span>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder="Buscar equipo…"
          style={{
            background: "none", border: "none", outline: "none",
            color: "#f1f5f9", fontSize: 13, width: "100%",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }}
            style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 13, padding: 0 }}>✕</button>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
          background: "#141b2d", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}>
          {results.map((t) => (
            <div key={t.id}
              onClick={() => { onSelectTeam(t); setQuery(""); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <img src={t.crest} alt="" style={{ width: 22, height: 22, objectFit: "contain" }} onError={(e) => e.target.style.display = "none"} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{t.shortName}</div>
                <div style={{ fontSize: 10, color: "#334155" }}>{t.league}</div>
              </div>
              <span style={{ fontSize: 11, color: "#475569" }}>Ver stats →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

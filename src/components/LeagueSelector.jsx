import { LEAGUES } from "../data/config";

export default function LeagueSelector({ activeLeague, onLeagueChange }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {LEAGUES.map((l) => (
        <button
          key={l.id}
          onClick={() => onLeagueChange(l.id)}
          style={{
            background:
              activeLeague === l.id ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)",
            border:
              activeLeague === l.id
                ? "1px solid rgba(99,102,241,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 30,
            padding: "7px 14px",
            color: activeLeague === l.id ? "#a5b4fc" : "#64748b",
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{l.flag}</span>
          <span>{l.name}</span>
        </button>
      ))}
    </div>
  );
}

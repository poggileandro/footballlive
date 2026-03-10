import { LEAGUES } from "../data/config";

export default function ResultsFilter({ selectedComp, onSelect }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => onSelect("ALL")}
          style={{
            background: selectedComp === "ALL" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${selectedComp === "ALL" ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 20, padding: "5px 14px",
            color: selectedComp === "ALL" ? "#a5b4fc" : "#64748b",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Todos
        </button>

        <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

        {LEAGUES.map((l) => {
          const active = selectedComp === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onSelect(active ? "ALL" : l.id)}
              style={{
                background: active ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20, padding: "5px 12px",
                color: active ? "#a5b4fc" : "#64748b",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

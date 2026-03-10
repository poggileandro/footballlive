import LivePulse from "./LivePulse";
import { formatDate } from "../utils/helpers";

export default function MatchCard({ match, type, onOpenMatch, onOpenTeam, onPreview }) {
  const isLive     = type === "live";
  const isUpcoming = type === "upcoming";
  const home       = match.homeTeam;
  const away       = match.awayTeam;
  const scoreHome  = match.score?.fullTime?.home;
  const scoreAway  = match.score?.fullTime?.away;
  const competition = match.competition?.name || "—";
  const goals      = match.goals || [];

  const btnStyle = (side) => ({
    background: "none", border: "none", cursor: "pointer",
    fontWeight: 600, fontSize: 14, color: "#f1f5f9",
    fontFamily: "'DM Sans', sans-serif", padding: "2px 4px",
    borderRadius: 6, transition: "background 0.15s",
    flex: 1, textAlign: side === "home" ? "right" : "left",
  });

  return (
    <div
      onClick={() => !isUpcoming && onOpenMatch?.(match)}
      style={{
        background: isLive ? "linear-gradient(135deg, #0f2027 0%, #0d1f3c 100%)" : "rgba(255,255,255,0.04)",
        border: isLive ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "14px 18px",
        display: "flex", flexDirection: "column", gap: 8,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: isUpcoming ? "default" : "pointer",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Liga + estado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.5 }}>{competition}</span>
        {isLive
          ? <LivePulse />
          : <span style={{ fontSize: 10, color: "#64748b" }}>{formatDate(match.utcDate)}</span>
        }
      </div>

      {/* Equipos + marcador */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
          <button style={btnStyle("home")} onClick={(e) => { e.stopPropagation(); onOpenTeam?.(home); }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
            {home?.shortName || home?.name || "—"}
          </button>
          {home?.crest && <img src={home.crest} alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />}
        </div>

        {isUpcoming ? (
          <button
            onClick={(e) => { e.stopPropagation(); onPreview?.(match); }}
            title="Ver preview del partido"
            style={{
              padding: "5px 12px", background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 8, fontSize: 11, color: "#818cf8",
              fontWeight: 700, cursor: "pointer", minWidth: 54, textAlign: "center",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.22)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
          >
            🔮 Pre
          </button>
        ) : (
          <div style={{ padding: "5px 14px", minWidth: 64, textAlign: "center", background: isLive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)", borderRadius: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: 1, color: isLive ? "#22c55e" : "#f1f5f9" }}>
              {scoreHome ?? "—"} – {scoreAway ?? "—"}
            </span>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
          {away?.crest && <img src={away.crest} alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />}
          <button style={btnStyle("away")} onClick={(e) => { e.stopPropagation(); onOpenTeam?.(away); }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
            {away?.shortName || away?.name || "—"}
          </button>
        </div>
      </div>

      {isLive && match.minute && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>⏱ {match.minute}'</span>
        </div>
      )}

      {!isUpcoming && goals.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {goals.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
              <span>⚽</span>
              <span style={{ color: "#94a3b8", fontWeight: 500 }}>{g.scorer?.name}</span>
              <span>{g.minute}'</span>
              {g.type === "PENALTY" && <span style={{ color: "#f59e0b", fontSize: 10 }}>(P)</span>}
              {g.type === "OWN"     && <span style={{ color: "#f87171", fontSize: 10 }}>(OG)</span>}
            </div>
          ))}
        </div>
      )}

      {!isUpcoming && (
        <div style={{ textAlign: "center", fontSize: 10, color: "rgba(99,102,241,0.4)" }}>Ver estadísticas →</div>
      )}
    </div>
  );
}

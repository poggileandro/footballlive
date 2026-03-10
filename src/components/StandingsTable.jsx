import EmptyState from "./EmptyState";

const COLS = ["#", "Equipo", "PJ", "G", "E", "P", "GF", "GC", "DG", "Pts"];

export default function StandingsTable({ data, leagueCode, onOpenTeam }) {
  const rows = data?.[leagueCode] || [];
  if (!rows.length) return <EmptyState msg="Sin datos de posiciones" />;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {COLS.map((c) => (
              <th key={c} style={{
                padding: "8px 10px",
                textAlign: c === "Equipo" ? "left" : "center",
                color: "#64748b", fontWeight: 600, fontSize: 11, letterSpacing: 0.5,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isTop4       = row.position <= 4;
            const isRelegation = row.position >= rows.length - 2;
            const baseBg       = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent";

            return (
              <tr
                key={i}
                onClick={() => onOpenTeam?.({
                  id:        row.team?.id,
                  name:      row.team?.name,
                  shortName: row.team?.shortName || row.team?.name,
                  crest:     row.team?.crest,
                })}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: baseBg,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = baseBg)}
              >
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <span style={{
                    display: "inline-block", width: 22, height: 22, borderRadius: 6,
                    background: isTop4 ? "rgba(99,102,241,0.25)" : isRelegation ? "rgba(239,68,68,0.2)" : "transparent",
                    color: isTop4 ? "#818cf8" : isRelegation ? "#f87171" : "#94a3b8",
                    fontWeight: 700, fontSize: 12, lineHeight: "22px", textAlign: "center",
                  }}>
                    {row.position}
                  </span>
                </td>

                <td style={{ padding: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {row.team?.crest && (
                      <img src={row.team.crest} alt=""
                        style={{ width: 22, height: 22, objectFit: "contain" }}
                        onError={(e) => e.target.style.display = "none"}
                      />
                    )}
                    <span style={{ color: "#f1f5f9", fontWeight: 500 }}>
                      {row.team?.shortName || row.team?.name}
                    </span>
                    <span style={{ fontSize: 10, color: "#334155" }}>↗</span>
                  </div>
                </td>

                <td style={{ padding: "10px", textAlign: "center", color: "#94a3b8" }}>{row.playedGames}</td>
                <td style={{ padding: "10px", textAlign: "center", color: "#94a3b8" }}>{row.won}</td>
                <td style={{ padding: "10px", textAlign: "center", color: "#94a3b8" }}>{row.draw}</td>
                <td style={{ padding: "10px", textAlign: "center", color: "#94a3b8" }}>{row.lost}</td>
                <td style={{ padding: "10px", textAlign: "center", color: "#94a3b8" }}>{row.goalsFor}</td>
                <td style={{ padding: "10px", textAlign: "center", color: "#94a3b8" }}>{row.goalsAgainst}</td>
                <td style={{ padding: "10px", textAlign: "center",
                  color: row.goalDifference > 0 ? "#22c55e" : row.goalDifference < 0 ? "#f87171" : "#94a3b8"
                }}>
                  {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: "#f1f5f9" }}>{row.points}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 16, marginTop: 12, padding: "0 4px", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#818cf8" }}>■ Champions League</span>
        <span style={{ fontSize: 10, color: "#f87171" }}>■ Descenso</span>
        <span style={{ fontSize: 10, color: "#334155", marginLeft: "auto" }}>↗ clic para ver estadísticas</span>
      </div>
    </div>
  );
}

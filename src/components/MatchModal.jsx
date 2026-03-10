import { useEffect } from "react";

function StatBar({ label, home, away }) {
  const total = (home || 0) + (away || 0);
  const homePct = total === 0 ? 50 : Math.round((home / total) * 100);
  const awayPct = 100 - homePct;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
        <span style={{ color: "#a5b4fc", fontWeight: 700, minWidth: 30 }}>{home ?? "—"}</span>
        <span style={{ color: "#64748b", fontSize: 11 }}>{label}</span>
        <span style={{ color: "#f87171", fontWeight: 700, minWidth: 30, textAlign: "right" }}>{away ?? "—"}</span>
      </div>
      <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", height: 5, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ width: `${homePct}%`, background: "linear-gradient(90deg, #6366f1, #818cf8)", transition: "width 0.6s ease" }} />
        <div style={{ width: `${awayPct}%`, background: "linear-gradient(90deg, #f87171, #ef4444)", transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function GoalItem({ goal }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
      <span style={{ fontSize: 16 }}>⚽</span>
      <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{goal.scorer?.name}</span>
      {goal.assist && <span style={{ color: "#64748b", fontSize: 11 }}>({goal.assist.name})</span>}
      <span style={{ marginLeft: "auto", color: "#22c55e", fontWeight: 700 }}>{goal.minute}'</span>
      {goal.type === "PENALTY" && <span style={{ color: "#f59e0b", fontSize: 10, background: "rgba(245,158,11,0.15)", padding: "1px 6px", borderRadius: 4 }}>PEN</span>}
      {goal.type === "OWN" && <span style={{ color: "#f87171", fontSize: 10, background: "rgba(248,113,113,0.15)", padding: "1px 6px", borderRadius: 4 }}>OG</span>}
    </div>
  );
}

function BookingItem({ booking }) {
  const isRed = booking.card === "RED" || booking.card === "YELLOW_RED";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12 }}>
      <span style={{
        width: 10, height: 14, borderRadius: 2, flexShrink: 0,
        background: isRed ? "#ef4444" : "#f59e0b",
      }} />
      <span style={{ color: "#94a3b8" }}>{booking.player?.name}</span>
      <span style={{ marginLeft: "auto", color: "#475569" }}>{booking.minute}'</span>
    </div>
  );
}

export default function MatchModal({ match, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!match) return null;

  const home = match.homeTeam;
  const away = match.awayTeam;
  const score = match.score?.fullTime;
  const homeStats = home?.statistics;
  const awayStats = away?.statistics;
  const goals = match.goals || [];
  const bookings = match.bookings || [];
  const homeGoals = goals.filter((g) => g.team?.id === home?.id && g.type !== "OWN" || g.team?.id !== home?.id && g.type === "OWN");
  const awayGoals = goals.filter((g) => g.team?.id === away?.id && g.type !== "OWN" || g.team?.id !== away?.id && g.type === "OWN");
  const hasStats = homeStats || awayStats;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, width: "100%", maxWidth: 560,
          maxHeight: "85vh", overflowY: "auto",
          animation: "fadeIn 0.2s ease",
        }}
      >
        {/* Header del modal */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky", top: 0, background: "#0d1117", zIndex: 1,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontWeight: 600 }}>
                {match.competition?.name} · Jornada {match.matchday}
              </div>
              {/* Equipos y marcador */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {home?.crest && <img src={home.crest} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />}
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>{home?.shortName || home?.name}</span>
                </div>
                <div style={{
                  padding: "6px 16px", background: "rgba(255,255,255,0.08)",
                  borderRadius: 10, textAlign: "center",
                }}>
                  <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>
                    {score?.home ?? "—"} – {score?.away ?? "—"}
                  </div>
                  {match.score?.halfTime && (
                    <div style={{ fontSize: 10, color: "#475569" }}>
                      HT {match.score.halfTime.home} – {match.score.halfTime.away}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>{away?.shortName || away?.name}</span>
                  {away?.crest && <img src={away.crest} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.06)", border: "none",
              borderRadius: 8, width: 32, height: 32, cursor: "pointer",
              color: "#64748b", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "16px 24px" }}>
          {/* Goles */}
          {goals.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>GOLES</div>
              {goals.map((g, i) => <GoalItem key={i} goal={g} />)}
            </div>
          )}

          {/* Estadísticas */}
          {hasStats && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 12 }}>
                <span style={{ color: "#818cf8", fontWeight: 700 }}>{home?.shortName || home?.name}</span>
                <span style={{ color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>ESTADÍSTICAS</span>
                <span style={{ color: "#f87171", fontWeight: 700 }}>{away?.shortName || away?.name}</span>
              </div>
              <StatBar label="Posesión %" home={homeStats?.ball_possession} away={awayStats?.ball_possession} />
              <StatBar label="Tiros"      home={homeStats?.shots}           away={awayStats?.shots} />
              <StatBar label="Al arco"    home={homeStats?.shots_on_goal}   away={awayStats?.shots_on_goal} />
              <StatBar label="Córners"    home={homeStats?.corner_kicks}    away={awayStats?.corner_kicks} />
              <StatBar label="Faltas"     home={homeStats?.fouls}           away={awayStats?.fouls} />
              <StatBar label="Fuera de juego" home={homeStats?.offsides}   away={awayStats?.offsides} />
              <StatBar label="Amarillas"  home={homeStats?.yellow_cards}    away={awayStats?.yellow_cards} />
              <StatBar label="Atajadas"   home={homeStats?.saves}           away={awayStats?.saves} />
            </div>
          )}

          {/* Tarjetas */}
          {bookings.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>TARJETAS</div>
              {bookings.map((b, i) => <BookingItem key={i} booking={b} />)}
            </div>
          )}

          {!hasStats && !goals.length && !bookings.length && (
            <div style={{ textAlign: "center", color: "#475569", padding: "20px 0", fontSize: 13 }}>
              Sin datos detallados disponibles para este partido
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

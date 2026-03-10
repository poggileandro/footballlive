import { useEffect } from "react";
import { useTeamMatches } from "../hooks/useTeamMatches";
import { formatDate } from "../utils/helpers";
import { LoadingSpinner } from "./EmptyState";
import MiniLineChart from "./MiniLineChart";

function FormBadge({ result }) {
  const colors = {
    W: { bg: "rgba(34,197,94,0.2)",  border: "rgba(34,197,94,0.4)",  color: "#22c55e" },
    D: { bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.4)", color: "#f59e0b" },
    L: { bg: "rgba(239,68,68,0.2)",  border: "rgba(239,68,68,0.4)",  color: "#ef4444" },
  };
  const s = colors[result] || colors.D;
  return (
    <span style={{ width: 24, height: 24, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontWeight: 800, fontSize: 11 }}>
      {result}
    </span>
  );
}

function ProbBar({ label, pct, color }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Syne', sans-serif" }}>{pct}%</div>
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>{label}</div>
      <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function GoalProbRow({ label, pct, raw, emoji }) {
  const barColor = pct >= 70 ? "#22c55e" : pct >= 45 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>{emoji}</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#475569" }}>{raw}</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: barColor, minWidth: 40, textAlign: "right" }}>{pct}%</span>
        </div>
      </div>
      <div style={{ height: 5, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

export default function TeamModal({ team, onClose, isFav, onToggleFav }) {
  const { teamMatches, teamInfo, probabilities, loading, error, loadTeamMatches, clear } = useTeamMatches();

  useEffect(() => {
    if (team?.id) loadTeamMatches(team.id);
    return () => clear();
  }, [team?.id, loadTeamMatches, clear]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!team) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "88vh", overflowY: "auto", animation: "fadeIn 0.2s ease" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "#0d1117", zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}>
          {team.crest && <img src={team.crest} alt="" style={{ width: 44, height: 44, objectFit: "contain" }} />}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#f1f5f9" }}>
              {teamInfo?.name || team.name || team.shortName}
            </h2>
            {teamInfo?.venue && <div style={{ fontSize: 11, color: "#475569" }}>📍 {teamInfo.venue}</div>}
          </div>
          {/* Botón favorito */}
          {onToggleFav && (
            <button
              onClick={() => onToggleFav(team)}
              title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
              style={{ background: isFav ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${isFav ? "rgba(251,191,36,0.4)" : "transparent"}`, borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            >
              {isFav ? "⭐" : "☆"}
            </button>
          )}
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#64748b", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ padding: "16px 24px" }}>
          {loading && <LoadingSpinner />}
          {error   && <div style={{ color: "#f87171", fontSize: 13, padding: "12px 0" }}>⚠️ {error}</div>}

          {probabilities && !loading && (
            <>
              {/* Forma reciente */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
                  FORMA — ÚLTIMOS {probabilities.n} PARTIDOS
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[...probabilities.form].reverse().map((r, i) => <FormBadge key={i} result={r} />)}
                </div>
              </div>

              {/* Gráfico de rendimiento */}
              {teamMatches.length > 2 && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
                    📈 RENDIMIENTO — GF <span style={{ color: "#22c55e" }}>▬</span> GA <span style={{ color: "#ef4444" }}>▬</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <MiniLineChart matches={teamMatches} teamId={team.id} width={500} height={110} />
                  </div>
                </div>
              )}

              {/* V/E/D */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>PROBABILIDADES — ÚLTIMOS {probabilities.n} PARTIDOS</div>
                <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                  <ProbBar label="Victoria" pct={probabilities.winPct}  color="#22c55e" />
                  <ProbBar label="Empate"   pct={probabilities.drawPct} color="#f59e0b" />
                  <ProbBar label="Derrota"  pct={probabilities.lossPct} color="#ef4444" />
                </div>
                <div style={{ display: "flex", gap: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#22c55e" }}>{probabilities.avgGoalsFor}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>GF prom.</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f87171" }}>{probabilities.avgGoalsAgainst}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>GC prom.</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>{probabilities.wins}/{probabilities.n}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Victorias</div>
                  </div>
                </div>
              </div>

              {/* Probabilidades de goles */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px", marginBottom: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>PROBABILIDADES DE GOLES</div>
                <GoalProbRow emoji="⚽" label="+0.5 goles a favor"    pct={probabilities.prob05For}   raw={probabilities.over05ForRaw} />
                <GoalProbRow emoji="🥅" label="+0.5 goles en contra"  pct={probabilities.prob05Ag}    raw={probabilities.over05AgRaw} />
                <GoalProbRow emoji="🔢" label="+1.5 goles totales"    pct={probabilities.prob15Total} raw={probabilities.over15TotalRaw} />
                <GoalProbRow emoji="🔥" label="+2.5 goles totales"    pct={probabilities.prob25Total} raw={probabilities.over25TotalRaw} />
                <GoalProbRow emoji="🤝" label="Ambos marcan (BTTS)"   pct={probabilities.probBTTS}    raw={probabilities.bttRaw} />
              </div>

              {/* Últimos partidos */}
              <div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>ÚLTIMOS PARTIDOS</div>
                {teamMatches.map((m) => {
                  const isHome   = m.homeTeam?.id === team.id;
                  const opponent = isHome ? m.awayTeam : m.homeTeam;
                  const gf       = isHome ? m.score?.fullTime?.home : m.score?.fullTime?.away;
                  const ga       = isHome ? m.score?.fullTime?.away : m.score?.fullTime?.home;
                  const winner   = m.score?.winner;
                  const result   = winner === "DRAW" ? "D" : (winner === "HOME_TEAM" && isHome) || (winner === "AWAY_TEAM" && !isHome) ? "W" : "L";
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                      <FormBadge result={result} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#f1f5f9", fontWeight: 500 }}>{isHome ? "vs" : "@"} {opponent?.shortName || opponent?.name}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{m.competition?.name} · {formatDate(m.utcDate)}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: result === "W" ? "#22c55e" : result === "L" ? "#f87171" : "#f59e0b" }}>
                        {gf} – {ga}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

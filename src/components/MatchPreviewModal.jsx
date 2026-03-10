import { useEffect } from "react";
import { useMatchPreview } from "../hooks/useMatchPreview";
import { LoadingSpinner } from "./EmptyState";
import RadarChart from "./RadarChart";

function FormDots({ form }) {
  if (!form?.length) return null;
  const color = { W: "#22c55e", D: "#f59e0b", L: "#ef4444" };
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[...form].reverse().slice(0, 5).map((r, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: color[r] || "#475569" }} title={r} />
      ))}
    </div>
  );
}

function PredBar({ homeWin, draw, awayWin, homeColor = "#6366f1", awayColor = "#f87171" }) {
  return (
    <div>
      <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ width: `${homeWin}%`, background: homeColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{homeWin}%</span>
        </div>
        <div style={{ width: `${draw}%`, background: "rgba(245,158,11,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{draw}%</span>
        </div>
        <div style={{ width: `${awayWin}%`, background: awayColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{awayWin}%</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569" }}>
        <span>Local</span><span>Empate</span><span>Visitante</span>
      </div>
    </div>
  );
}

function StatRow({ label, homeVal, awayVal, higherIsBetter = true }) {
  const hNum = parseFloat(homeVal) || 0;
  const aNum = parseFloat(awayVal) || 0;
  const homeBetter = higherIsBetter ? hNum > aNum : hNum < aNum;
  const awayBetter = higherIsBetter ? aNum > hNum : aNum < hNum;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ textAlign: "right", fontWeight: homeBetter ? 800 : 500, color: homeBetter ? "#f1f5f9" : "#64748b", fontSize: 14 }}>{homeVal}</div>
      <div style={{ textAlign: "center", fontSize: 11, color: "#334155", minWidth: 110 }}>{label}</div>
      <div style={{ textAlign: "left", fontWeight: awayBetter ? 800 : 500, color: awayBetter ? "#f1f5f9" : "#64748b", fontSize: 14 }}>{awayVal}</div>
    </div>
  );
}

export default function MatchPreviewModal({ match, onClose }) {
  const { preview, loading, error, loadPreview, clear } = useMatchPreview();

  useEffect(() => {
    if (match) loadPreview(match.homeTeam, match.awayTeam);
    return () => clear();
  }, [match?.id]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!match) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 110,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, width: "100%", maxWidth: 600,
        maxHeight: "90vh", overflowY: "auto",
        animation: "fadeIn 0.2s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 22px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky", top: 0, background: "#0d1117", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: 1 }}>🔮 PREVIEW DEL PARTIDO</span>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "#64748b", fontSize: 15 }}>✕</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {match.homeTeam?.crest && <img src={match.homeTeam.crest} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />}
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>{match.homeTeam?.shortName}</span>
            </div>
            <span style={{ color: "#334155", fontWeight: 700, fontSize: 14 }}>vs</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>{match.awayTeam?.shortName}</span>
              {match.awayTeam?.crest && <img src={match.awayTeam.crest} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />}
            </div>
          </div>
          {match.competition?.name && (
            <div style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 6 }}>{match.competition.name}</div>
          )}
        </div>

        <div style={{ padding: "16px 22px" }}>
          {loading && <LoadingSpinner />}
          {error   && <div style={{ color: "#f87171", fontSize: 13 }}>⚠️ {error}</div>}

          {preview && !loading && (() => {
            const { home, away, prediction } = preview;
            return (
              <>
                {/* Barra de predicción */}
                <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>PROBABILIDAD DE RESULTADO</div>
                  <PredBar homeWin={prediction.homeWinPct} draw={prediction.drawPct} awayWin={prediction.awayWinPct} />
                </div>

                {/* Goles esperados */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "Goles locales esp.", value: prediction.expGoalsHome, color: "#818cf8" },
                    { label: "Total esperado", value: prediction.expTotal, color: "#f59e0b", big: true },
                    { label: "Goles visitante esp.", value: prediction.expGoalsAway, color: "#f87171" },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: item.big ? 26 : 22, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Over/BTTS */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "+2.5 goles totales", value: prediction.over25, color: prediction.over25 >= 60 ? "#22c55e" : prediction.over25 >= 40 ? "#f59e0b" : "#ef4444" },
                    { label: "Ambos marcan (BTTS)", value: prediction.btts, color: prediction.btts >= 60 ? "#22c55e" : prediction.btts >= 40 ? "#f59e0b" : "#ef4444" },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: item.color }}>{item.value}%</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{item.label}</div>
                      <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginTop: 8, overflow: "hidden" }}>
                        <div style={{ width: `${item.value}%`, height: "100%", background: item.color, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Radar comparativo */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>COMPARATIVA DE RENDIMIENTO</div>
                  <RadarChart
                    teamA={home.probs} teamB={away.probs}
                    labelA={home.team?.shortName} labelB={away.team?.shortName}
                    size={220}
                  />
                </div>

                {/* Stats cabeza a cabeza */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {home.team?.crest && <img src={home.team.crest} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />}
                      <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 600 }}>{home.team?.shortName}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#334155", textAlign: "center" }}>Estadísticas</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }}>{away.team?.shortName}</span>
                      {away.team?.crest && <img src={away.team.crest} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />}
                    </div>
                  </div>
                  <StatRow label="% Victorias" homeVal={`${home.probs?.winPct || 0}%`} awayVal={`${away.probs?.winPct || 0}%`} />
                  <StatRow label="Goles a favor prom." homeVal={home.probs?.avgGoalsFor || "-"} awayVal={away.probs?.avgGoalsFor || "-"} />
                  <StatRow label="Goles en contra prom." homeVal={home.probs?.avgGoalsAgainst || "-"} awayVal={away.probs?.avgGoalsAgainst || "-"} higherIsBetter={false} />
                  <StatRow label="+0.5 GF" homeVal={`${home.probs?.prob05For || 0}%`} awayVal={`${away.probs?.prob05For || 0}%`} />
                  <StatRow label="BTTS" homeVal={`${home.probs?.probBTTS || 0}%`} awayVal={`${away.probs?.probBTTS || 0}%`} />
                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#334155", marginBottom: 4 }}>Forma local (últ.5)</div>
                      <FormDots form={home.probs?.form} />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#334155", marginBottom: 4 }}>Forma visitante (últ.5)</div>
                      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                        {away.probs?.form && [...away.probs.form].reverse().slice(0, 5).map((r, i) => (
                          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: { W: "#22c55e", D: "#f59e0b", L: "#ef4444" }[r] || "#475569" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: "#1e293b", textAlign: "center", padding: "4px 0" }}>
                  ⚠️ Predicción basada en últimos 10 partidos — no es consejo de apuesta
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

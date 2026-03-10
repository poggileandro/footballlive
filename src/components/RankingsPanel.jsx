import { useEffect } from "react";

const METRICS = [
  { key: "prob05For",  label: "+0.5 Goles a favor",  emoji: "⚽", desc: "Marca al menos 1 gol" },
  { key: "prob05Ag",   label: "+0.5 Goles en contra", emoji: "🥅", desc: "Recibe al menos 1 gol" },
  { key: "prob15",     label: "+1.5 Goles totales",   emoji: "🔢", desc: "Más de 1 gol en el partido" },
  { key: "prob25",     label: "+2.5 Goles totales",   emoji: "🔥", desc: "Más de 2 goles en el partido" },
  { key: "probBTTS",   label: "Ambos marcan (BTTS)",  emoji: "🤝", desc: "Ambos equipos anotan" },
];

function ProgressBar({ progress, total }) {
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
        <span style={{ color: "#64748b" }}>Cargando equipos de a 2 por vez…</span>
        <span style={{ color: "#818cf8", fontWeight: 700 }}>{progress}/{total} ({pct}%)</span>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          borderRadius: 4, transition: "width 0.4s ease",
        }} />
      </div>
      {progress > 0 && progress < total && (
        <div style={{ fontSize: 11, color: "#334155", marginTop: 6, textAlign: "center" }}>
          Rankings parciales — se actualizan en tiempo real
        </div>
      )}
    </div>
  );
}

function RankingTable({ metric, getRanking }) {
  const rows = getRanking(metric.key);

  if (!rows.length) return (
    <div style={{ padding: "20px 0", textAlign: "center", color: "#334155", fontSize: 13 }}>
      Cargando datos…
    </div>
  );

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, overflow: "hidden", marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        background: "rgba(99,102,241,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 20 }}>{metric.emoji}</span>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>
            {metric.label}
          </div>
          <div style={{ fontSize: 11, color: "#475569" }}>{metric.desc} · últimos 10 partidos</div>
        </div>
      </div>

      {/* Filas */}
      {rows.map((entry, i) => {
        const pct   = entry.probs[metric.key];
        const color = pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
        const maxPct = rows[0]?.probs[metric.key] || 100;

        return (
          <div key={entry.team.id} style={{
            display: "grid",
            gridTemplateColumns: "30px 32px 1fr 52px",
            gap: 10, alignItems: "center",
            padding: "10px 16px",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            {/* Posición con medal para top 3 */}
            <div style={{ textAlign: "center" }}>
              {i === 0 ? <span style={{ fontSize: 16 }}>🥇</span>
               : i === 1 ? <span style={{ fontSize: 16 }}>🥈</span>
               : i === 2 ? <span style={{ fontSize: 16 }}>🥉</span>
               : <span style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>{i + 1}</span>}
            </div>

            {/* Escudo */}
            <img
              src={entry.team.crest} alt=""
              style={{ width: 28, height: 28, objectFit: "contain" }}
              onError={(e) => e.target.style.display = "none"}
            />

            {/* Nombre + liga + barra */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{entry.team.shortName}</span>
                <span style={{ fontSize: 11 }}>{entry.team.leagueFlag}</span>
                <span style={{ fontSize: 10, color: "#334155" }}>{entry.team.league}</span>
              </div>
              <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{
                  width: `${(pct / maxPct) * 100}%`, height: "100%",
                  background: color, borderRadius: 4, transition: "width 0.6s ease",
                }} />
              </div>
              <div style={{ fontSize: 10, color: "#334155", marginTop: 3 }}>
                {entry.probs.n} partidos analizados
              </div>
            </div>

            {/* % */}
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 20, color, textAlign: "right", lineHeight: 1,
            }}>
              {pct}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RankingsPanel({ loadRankings, getRanking, loading, done, progress, total }) {
  useEffect(() => {
    if (!done && !loading) loadRankings();
  }, [done, loading, loadRankings]);

  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: 13, color: "#64748b" }}>
        Top 10 de 50 equipos (10 por liga) ordenados por probabilidad en los últimos 10 partidos.
      </div>

      {(loading || (progress > 0 && progress < total)) && (
        <ProgressBar progress={progress} total={total} />
      )}

      {METRICS.map((metric) => (
        <RankingTable key={metric.key} metric={metric} getRanking={getRanking} />
      ))}
    </div>
  );
}

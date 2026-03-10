import { useState } from "react";

const BIG_LEAGUES = [
  { code: "PL",  name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "PD",  name: "La Liga",        flag: "🇪🇸" },
  { code: "SA",  name: "Serie A",        flag: "🇮🇹" },
  { code: "BL1", name: "Bundesliga",     flag: "🇩🇪" },
  { code: "FL1", name: "Ligue 1",        flag: "🇫🇷" },
];

function FormBadge({ r }) {
  const cfg = {
    W: ["rgba(34,197,94,0.2)",  "#22c55e"],
    D: ["rgba(245,158,11,0.2)", "#f59e0b"],
    L: ["rgba(239,68,68,0.2)",  "#ef4444"],
  }[r] || ["rgba(100,116,139,0.2)", "#64748b"];
  return (
    <span style={{ width: 20, height: 20, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", background: cfg[0], color: cfg[1], fontWeight: 800, fontSize: 10 }}>
      {r}
    </span>
  );
}

function Bar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.7s ease" }} />
    </div>
  );
}

function GlobalProgress({ progress, total, failedCount, onRetry, anyLoading }) {
  const pct      = total > 0 ? Math.round((progress / total) * 100) : 0;
  const loaded   = progress;
  const isDone   = loaded >= total;
  const hasError = failedCount > 0;

  let bgColor     = "rgba(99,102,241,0.07)";
  let borderColor = "rgba(99,102,241,0.2)";
  let barGrad     = "linear-gradient(90deg, #6366f1, #8b5cf6)";
  let statusText  = `⏳ Cargando de a 1 por vez (3.5s entre c/u)…`;
  let statusColor = "#818cf8";

  if (isDone && hasError) {
    bgColor     = "rgba(239,68,68,0.07)";
    borderColor = "rgba(239,68,68,0.2)";
    barGrad     = "linear-gradient(90deg, #ef4444, #f87171)";
    statusText  = `⚠️ ${failedCount} equipo${failedCount > 1 ? "s" : ""} sin datos (rate limit)`;
    statusColor = "#f87171";
  } else if (isDone && !hasError) {
    bgColor     = "rgba(34,197,94,0.07)";
    borderColor = "rgba(34,197,94,0.2)";
    barGrad     = "linear-gradient(90deg, #22c55e, #16a34a)";
    statusText  = "✅ Todos los equipos cargados";
    statusColor = "#22c55e";
  }

  return (
    <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: statusColor, fontWeight: 600 }}>{statusText}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isDone && hasError && !anyLoading && (
            <button
              onClick={onRetry}
              style={{
                background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: 8, padding: "4px 12px", color: "#f87171",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ↻ Reintentar fallidos
            </button>
          )}
          {anyLoading && !isDone && (
            <span style={{ fontSize: 11, color: "#334155" }}>
              ~{Math.ceil(((total - loaded) * 3.5) / 60)} min restantes
            </span>
          )}
          <span style={{ fontSize: 13, fontWeight: 800, color: statusColor }}>
            {Math.min(loaded, total)}/{total}
          </span>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barGrad, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function TeamRow({ entry, maxGoals, tab }) {
  const { team, position, stats } = entry;

  if (!stats) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 11, color: "#475569", width: 26, textAlign: "center" }}>{position}</span>
      {team.crest && <img src={team.crest} alt="" style={{ width: 26, height: 26, objectFit: "contain", opacity: 0.3 }} />}
      <span style={{ fontSize: 13, color: "#475569" }}>{team.shortName}</span>
      {entry.error
        ? <span style={{ fontSize: 11, color: "#ef4444", marginLeft: 4 }}>⚠️ {entry.error}</span>
        : <span style={{ fontSize: 11, color: "#334155", marginLeft: 4 }}>esperando…</span>
      }
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "26px 32px 1fr auto", gap: 10, alignItems: "center", padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 11, color: "#475569", fontWeight: 700, textAlign: "center" }}>{position}</span>
      <img src={team.crest} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} onError={(e) => e.target.style.display = "none"} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 5 }}>{team.shortName}</div>
        {tab === "Goles" && (
          <>
            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#64748b", marginBottom: 4 }}>
              <span>⚽ <span style={{ color: "#22c55e", fontWeight: 700 }}>{stats.avgGoalsFor}</span> / <span style={{ color: "#f87171" }}>{stats.avgGoalsAgainst}</span></span>
              <span>🏠 {stats.avgGoalsForHome}–{stats.avgGoalsAgainstHome}</span>
              <span>✈️ {stats.avgGoalsForAway}–{stats.avgGoalsAgainstAway}</span>
            </div>
            <Bar value={parseFloat(stats.avgGoalsFor)} max={maxGoals} color="#22c55e" />
          </>
        )}
        {tab === "Forma" && (
          <>
            <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#64748b", marginBottom: 5 }}>
              <span style={{ color: "#22c55e" }}>V {stats.wins}</span>
              <span style={{ color: "#f59e0b" }}>E {stats.draws}</span>
              <span style={{ color: "#ef4444" }}>D {stats.losses}</span>
              <span>· {stats.winPct}% victorias</span>
            </div>
            <Bar value={stats.winPct} max={100} color="#6366f1" />
          </>
        )}
        <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
          {[...stats.form].reverse().map((r, i) => <FormBadge key={i} r={r} />)}
        </div>
      </div>
      <div style={{ textAlign: "right", minWidth: 52 }}>
        {tab === "Goles" && (
          <>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#22c55e", lineHeight: 1 }}>{stats.avgGoalsFor}</div>
            <div style={{ fontSize: 11, color: "#f87171", fontWeight: 700 }}>{stats.avgGoalsAgainst} GC</div>
          </>
        )}
        {tab === "Forma" && (
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, lineHeight: 1, color: stats.winPct >= 60 ? "#22c55e" : stats.winPct >= 40 ? "#f59e0b" : "#ef4444" }}>
            {stats.winPct}%
          </div>
        )}
        <div style={{ fontSize: 10, color: "#334155", marginTop: 3 }}>últ.{stats.n}p</div>
      </div>
    </div>
  );
}

function LeagueBlock({ league, teams, loading, error, tab }) {
  const s = { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, marginBottom: 14, overflow: "hidden" };
  const header = (
    <div style={{ padding: "11px 16px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 18 }}>{league.flag}</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>{league.name}</span>
      <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>Top 5 · últ.10p</span>
    </div>
  );

  if (!teams?.length && !loading) return null;
  if (!teams?.length && loading) return (
    <div style={s}>{header}
      <div style={{ padding: "14px 16px", fontSize: 12, color: "#334155" }}>Esperando turno…</div>
    </div>
  );

  const loaded = teams.filter(t => t.stats).length;
  const failed = teams.filter(t => !t.stats && t.error).length;
  const maxGoals = Math.max(...teams.map(t => parseFloat(t.stats?.avgGoalsFor || 0)));

  return (
    <div style={s}>
      {header}
      {teams.map((entry, i) => <TeamRow key={entry.team?.id || i} entry={entry} maxGoals={maxGoals} tab={tab} />)}
      {(loading || failed > 0) && (
        <div style={{ padding: "8px 16px", fontSize: 11, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {loading
            ? <span style={{ color: "#475569" }}>⏳ {loaded}/{teams.length} cargados…</span>
            : failed > 0
            ? <span style={{ color: "#f87171" }}>⚠️ {failed} equipo{failed > 1 ? "s" : ""} fallaron — se reintentarán</span>
            : null
          }
        </div>
      )}
    </div>
  );
}

export default function StatsPanel({ statsByLeague, loadingLeague, errorLeague, progress, totalTeams, failedCount, onRetry }) {
  const [tab, setTab] = useState("Goles");

  const noneYet  = BIG_LEAGUES.every(l => !loadingLeague[l.code] && !statsByLeague[l.code]?.length);
  const anyLoading = BIG_LEAGUES.some(l => loadingLeague[l.code]);
  const showProgress = progress > 0 || anyLoading;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {["Goles", "Forma"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? "rgba(99,102,241,0.3)" : "transparent",
            border: tab === t ? "1px solid rgba(99,102,241,0.5)" : "1px solid transparent",
            borderRadius: 8, padding: "7px 18px",
            color: tab === t ? "#818cf8" : "#64748b",
            fontWeight: tab === t ? 700 : 500,
            fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
          }}>
            {t === "Goles" ? "⚽ " : "📊 "}{t}
          </button>
        ))}
      </div>

      {showProgress && (
        <GlobalProgress
          progress={progress}
          total={totalTeams}
          failedCount={failedCount}
          onRetry={onRetry}
          anyLoading={anyLoading}
        />
      )}

      {noneYet && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569", fontSize: 14 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
          Iniciando carga…
        </div>
      )}

      {BIG_LEAGUES.map((league) => (
        <LeagueBlock key={league.code} league={league} teams={statsByLeague[league.code]} loading={!!loadingLeague[league.code]} error={errorLeague[league.code]} tab={tab} />
      ))}
    </div>
  );
}

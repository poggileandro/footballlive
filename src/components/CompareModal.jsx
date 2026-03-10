import { useState, useEffect } from "react";
import { useMatchPreview } from "../hooks/useMatchPreview";
import { LoadingSpinner } from "./EmptyState";
import RadarChart from "./RadarChart";
import MiniLineChart from "./MiniLineChart";

// Lista de los 50 equipos conocidos para buscar
const KNOWN_TEAMS = [
  { id: 64,  shortName: "Liverpool",    crest: "https://crests.football-data.org/64.png",  league: "PL" },
  { id: 57,  shortName: "Arsenal",      crest: "https://crests.football-data.org/57.png",  league: "PL" },
  { id: 65,  shortName: "Man City",     crest: "https://crests.football-data.org/65.png",  league: "PL" },
  { id: 61,  shortName: "Chelsea",      crest: "https://crests.football-data.org/61.png",  league: "PL" },
  { id: 73,  shortName: "Spurs",        crest: "https://crests.football-data.org/73.png",  league: "PL" },
  { id: 66,  shortName: "Man United",   crest: "https://crests.football-data.org/66.png",  league: "PL" },
  { id: 563, shortName: "Newcastle",    crest: "https://crests.football-data.org/563.png", league: "PL" },
  { id: 397, shortName: "Aston Villa",  crest: "https://crests.football-data.org/397.png", league: "PL" },
  { id: 354, shortName: "Brighton",     crest: "https://crests.football-data.org/354.png", league: "PL" },
  { id: 86,  shortName: "R. Madrid",    crest: "https://crests.football-data.org/86.png",  league: "PD" },
  { id: 81,  shortName: "Barcelona",    crest: "https://crests.football-data.org/81.png",  league: "PD" },
  { id: 78,  shortName: "Atlético",     crest: "https://crests.football-data.org/78.png",  league: "PD" },
  { id: 95,  shortName: "Villarreal",   crest: "https://crests.football-data.org/95.png",  league: "PD" },
  { id: 77,  shortName: "Athletic",     crest: "https://crests.football-data.org/77.png",  league: "PD" },
  { id: 90,  shortName: "Real Betis",   crest: "https://crests.football-data.org/90.png",  league: "PD" },
  { id: 264, shortName: "Sevilla",      crest: "https://crests.football-data.org/264.png", league: "PD" },
  { id: 108, shortName: "Inter",        crest: "https://crests.football-data.org/108.png", league: "SA" },
  { id: 113, shortName: "Napoli",       crest: "https://crests.football-data.org/113.png", league: "SA" },
  { id: 109, shortName: "Juventus",     crest: "https://crests.football-data.org/109.png", league: "SA" },
  { id: 98,  shortName: "AC Milan",     crest: "https://crests.football-data.org/98.png",  league: "SA" },
  { id: 100, shortName: "Atalanta",     crest: "https://crests.football-data.org/100.png", league: "SA" },
  { id: 107, shortName: "Fiorentina",   crest: "https://crests.football-data.org/107.png", league: "SA" },
  { id: 99,  shortName: "Lazio",        crest: "https://crests.football-data.org/99.png",  league: "SA" },
  { id: 102, shortName: "Roma",         crest: "https://crests.football-data.org/102.png", league: "SA" },
  { id: 5,   shortName: "Bayern",       crest: "https://crests.football-data.org/5.png",   league: "BL1" },
  { id: 4,   shortName: "Leverkusen",   crest: "https://crests.football-data.org/4.png",   league: "BL1" },
  { id: 721, shortName: "Leipzig",      crest: "https://crests.football-data.org/721.png", league: "BL1" },
  { id: 3,   shortName: "Dortmund",     crest: "https://crests.football-data.org/3.png",   league: "BL1" },
  { id: 19,  shortName: "Frankfurt",    crest: "https://crests.football-data.org/19.png",  league: "BL1" },
  { id: 18,  shortName: "Stuttgart",    crest: "https://crests.football-data.org/18.png",  league: "BL1" },
  { id: 524, shortName: "PSG",          crest: "https://crests.football-data.org/524.png", league: "FL1" },
  { id: 548, shortName: "Monaco",       crest: "https://crests.football-data.org/548.png", league: "FL1" },
  { id: 514, shortName: "Marseille",    crest: "https://crests.football-data.org/514.png", league: "FL1" },
  { id: 516, shortName: "Nice",         crest: "https://crests.football-data.org/516.png", league: "FL1" },
  { id: 511, shortName: "Lyon",         crest: "https://crests.football-data.org/511.png", league: "FL1" },
];

function TeamPicker({ label, selected, onSelect }) {
  const [query, setQuery] = useState("");
  const [open,  setOpen]  = useState(false);
  const filtered = query.length > 1
    ? KNOWN_TEAMS.filter((t) => t.shortName.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {selected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, padding: "8px 12px" }}>
          <img src={selected.crest} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{selected.shortName}</span>
          <button onClick={() => { onSelect(null); setQuery(""); }} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar equipo…"
            style={{
              width: "100%", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              padding: "9px 12px", color: "#f1f5f9", fontSize: 13,
              outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
            }}
          />
          {open && filtered.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
              background: "#141b2d", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, overflow: "hidden", marginTop: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}>
              {filtered.map((t) => (
                <div key={t.id} onClick={() => { onSelect(t); setQuery(""); setOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <img src={t.crest} alt="" style={{ width: 20, height: 20, objectFit: "contain" }} />
                  <span style={{ fontSize: 13, color: "#f1f5f9" }}>{t.shortName}</span>
                  <span style={{ fontSize: 11, color: "#334155", marginLeft: "auto" }}>{t.league}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCompare({ label, homeVal, awayVal, higherIsBetter = true }) {
  const h = parseFloat(homeVal) || 0;
  const a = parseFloat(awayVal) || 0;
  const homeWins = higherIsBetter ? h > a : h < a;
  const awayWins = higherIsBetter ? a > h : a < h;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 6, alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontSize: 15, fontWeight: homeWins ? 800 : 500, color: homeWins ? "#818cf8" : "#64748b" }}>{homeVal}</span>
        {homeWins && <span style={{ marginLeft: 4, fontSize: 12 }}>◀</span>}
      </div>
      <div style={{ fontSize: 10, color: "#334155", textAlign: "center", minWidth: 100 }}>{label}</div>
      <div style={{ textAlign: "left" }}>
        {awayWins && <span style={{ marginRight: 4, fontSize: 12 }}>▶</span>}
        <span style={{ fontSize: 15, fontWeight: awayWins ? 800 : 500, color: awayWins ? "#f87171" : "#64748b" }}>{awayVal}</span>
      </div>
    </div>
  );
}

export default function CompareModal({ onClose, initialA, initialB }) {
  const [teamA, setTeamA] = useState(initialA || null);
  const [teamB, setTeamB] = useState(initialB || null);
  const { preview, loading, error, loadPreview, clear } = useMatchPreview();

  useEffect(() => {
    if (teamA && teamB) loadPreview(teamA, teamB);
    else clear();
  }, [teamA?.id, teamB?.id]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 110,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, width: "100%", maxWidth: 620,
        maxHeight: "90vh", overflowY: "auto",
        animation: "fadeIn 0.2s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "#0d1117", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: 1 }}>⚖️ COMPARADOR DE EQUIPOS</span>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "#64748b", fontSize: 15 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <TeamPicker label="Equipo A" selected={teamA} onSelect={setTeamA} />
            <div style={{ fontSize: 18, color: "#334155", paddingBottom: 8 }}>vs</div>
            <TeamPicker label="Equipo B" selected={teamB} onSelect={setTeamB} />
          </div>
        </div>

        <div style={{ padding: "16px 22px" }}>
          {!teamA && !teamB && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#334155", fontSize: 14 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚖️</div>
              Seleccioná dos equipos para comparar
            </div>
          )}
          {(teamA || teamB) && (!teamA || !teamB) && (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#475569", fontSize: 13 }}>
              Seleccioná el {!teamA ? "primer" : "segundo"} equipo para continuar
            </div>
          )}
          {loading && <LoadingSpinner />}
          {error   && <div style={{ color: "#f87171", fontSize: 13 }}>⚠️ {error}</div>}

          {preview && !loading && (() => {
            const { home: a, away: b, prediction: pred } = preview;
            return (
              <>
                {/* Radar */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, marginBottom: 8, textAlign: "center" }}>COMPARATIVA GENERAL</div>
                  <RadarChart teamA={a.probs} teamB={b.probs} labelA={teamA.shortName} labelB={teamB.shortName} size={230} />
                </div>

                {/* Stats */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <img src={teamA.crest} alt="" style={{ width: 20, height: 20, objectFit: "contain" }} />
                      <span style={{ fontSize: 13, color: "#818cf8", fontWeight: 700 }}>{teamA.shortName}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#334155", textAlign: "center", alignSelf: "center" }}>vs</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 13, color: "#f87171", fontWeight: 700 }}>{teamB.shortName}</span>
                      <img src={teamB.crest} alt="" style={{ width: 20, height: 20, objectFit: "contain" }} />
                    </div>
                  </div>
                  <StatCompare label="% Victorias" homeVal={`${a.probs?.winPct}%`} awayVal={`${b.probs?.winPct}%`} />
                  <StatCompare label="Goles a favor (prom.)" homeVal={a.probs?.avgGoalsFor} awayVal={b.probs?.avgGoalsFor} />
                  <StatCompare label="Goles en contra (prom.)" homeVal={a.probs?.avgGoalsAgainst} awayVal={b.probs?.avgGoalsAgainst} higherIsBetter={false} />
                  <StatCompare label="+0.5 GF" homeVal={`${a.probs?.prob05For}%`} awayVal={`${b.probs?.prob05For}%`} />
                  <StatCompare label="+2.5 total" homeVal={`${a.probs?.prob25Total}%`} awayVal={`${b.probs?.prob25Total}%`} />
                  <StatCompare label="BTTS" homeVal={`${a.probs?.probBTTS}%`} awayVal={`${b.probs?.probBTTS}%`} />
                </div>

                {/* Gráficos de línea */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {[{ data: a, team: teamA, color: "#6366f1" }, { data: b, team: teamB, color: "#f87171" }].map(({ data, team, color }) => (
                    <div key={team.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <img src={team.crest} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />
                        <span style={{ fontSize: 11, color, fontWeight: 700 }}>{team.shortName}</span>
                        <span style={{ fontSize: 9, color: "#334155", marginLeft: "auto" }}>⚽GF 🔴GA</span>
                      </div>
                      <MiniLineChart matches={data.matches} teamId={team.id} width={230} height={90} />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

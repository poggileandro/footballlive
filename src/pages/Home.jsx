import { useState, useEffect, useRef } from "react";
import { LEAGUES } from "../data/config";
import { useFootballData }   from "../hooks/useFootballData";
import { useLeagueStats }    from "../hooks/useLeagueStats";
import { useGoalRankings }   from "../hooks/useGoalRankings";
import { useFavorites }      from "../hooks/useFavorites";

import Header             from "../components/Header";
import LeagueSelector     from "../components/LeagueSelector";
import ResultsFilter      from "../components/ResultsFilter";
import MatchCard          from "../components/MatchCard";
import MatchModal         from "../components/MatchModal";
import TeamModal          from "../components/TeamModal";
import MatchPreviewModal  from "../components/MatchPreviewModal";
import CompareModal       from "../components/CompareModal";
import StandingsTable     from "../components/StandingsTable";
import StatsPanel         from "../components/StatsPanel";
import RankingsPanel      from "../components/RankingsPanel";
import FavoritesPanel     from "../components/FavoritesPanel";
import SearchBar          from "../components/SearchBar";
import { EmptyState, LoadingSpinner } from "../components/EmptyState";

const BIG_LEAGUES = ["PL", "PD", "SA", "BL1", "FL1"];
const STATS_TABS  = ["Por Liga", "Rankings"];
const SECTIONS    = ["Resultados", "Próximos", "Posiciones", "Estadísticas", "Favoritos"];

function ErrorBanner({ message }) {
  return (
    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{ fontSize: 20 }}>⚠️</span>
      <div style={{ fontSize: 13, color: "#fca5a5" }}>{message}</div>
    </div>
  );
}

function filterMatches(matches, filter) {
  if (filter === "ALL") return matches;
  return matches.filter((m) => m.competition?.code === filter);
}

function MatchList({ matches, type, onOpenMatch, onOpenTeam, onPreview }) {
  if (!matches.length) return <EmptyState msg="Sin partidos para este filtro" />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} type={type} onOpenMatch={onOpenMatch} onOpenTeam={onOpenTeam} onPreview={onPreview} />
      ))}
    </div>
  );
}

function SubTabs({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
      {STATS_TABS.map((t) => (
        <button key={t} onClick={() => onChange(t)} style={{
          background: active === t ? "rgba(99,102,241,0.2)" : "transparent",
          border: "none", borderBottom: active === t ? "2px solid #6366f1" : "2px solid transparent",
          padding: "8px 16px", color: active === t ? "#818cf8" : "#64748b",
          fontWeight: active === t ? 700 : 500, fontSize: 13, cursor: "pointer",
          borderRadius: "6px 6px 0 0", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
        }}>
          {t === "Por Liga" ? "🏆 " : "🏅 "}{t}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeSection,  setActiveSection]  = useState("Resultados");
  const [activeLeague,   setActiveLeague]   = useState("PL");
  const [resultsFilter,  setResultsFilter]  = useState("ALL");
  const [upcomingFilter, setUpcomingFilter] = useState("ALL");
  const [selectedMatch,  setSelectedMatch]  = useState(null);
  const [selectedTeam,   setSelectedTeam]   = useState(null);
  const [previewMatch,   setPreviewMatch]   = useState(null);
  const [showCompare,    setShowCompare]    = useState(false);
  const [statsTab,       setStatsTab]       = useState("Por Liga");

  const statsLoadingRef = useRef(false);
  const { favorites, toggle: toggleFav, isFav } = useFavorites();

  const { data, loading, error, loadMatches, loadStandings, loadCompetitionResults, forceRefresh } = useFootballData();
  const { statsByLeague, loadingLeague, errorLeague, loadLeagueStats, retryFailed, progress, totalTeams, failedCount } = useLeagueStats();
  const { progress: rankProgress, loading: rankLoading, done: rankDone, getRanking, loadRankings, total: rankTotal } = useGoalRankings();

  useEffect(() => { loadMatches(); }, [loadMatches]);

  useEffect(() => {
    if (activeSection === "Posiciones") loadStandings(activeLeague);
  }, [activeSection, activeLeague, loadStandings]);

  useEffect(() => {
    const isSpecific = resultsFilter !== "ALL";
    if (activeSection === "Resultados" && isSpecific) loadCompetitionResults(resultsFilter);
  }, [activeSection, resultsFilter, loadCompetitionResults]);

  useEffect(() => {
    if (activeSection !== "Estadísticas" || statsLoadingRef.current) return;
    statsLoadingRef.current = true;
    const loadSeq = async () => {
      for (const code of BIG_LEAGUES) {
        await loadLeagueStats(code);
        await new Promise((r) => setTimeout(r, 3000));
      }
    };
    loadSeq();
  }, [activeSection, loadLeagueStats]);

  const currentLeague    = LEAGUES.find((l) => l.id === activeLeague);
  const showLeagueSelect = activeSection === "Posiciones";

  const renderContent = () => {
    if (loading && activeSection !== "Favoritos") return <LoadingSpinner />;

    if (activeSection === "Resultados") {
      const isSpecific = resultsFilter !== "ALL";
      const compData   = data.compResults?.[resultsFilter];
      const matches    = isSpecific && compData?.length ? compData : filterMatches(data.results, resultsFilter);
      const subtitle   = isSpecific && compData?.length ? `Última jornada · ${compData.length} partidos` : null;
      return (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <ResultsFilter selectedComp={resultsFilter} onSelect={setResultsFilter} />
          {subtitle && <div style={{ fontSize: 12, color: "#6366f1", marginBottom: 12, fontWeight: 600 }}>📅 {subtitle}</div>}
          <MatchList matches={matches} type="result" onOpenMatch={setSelectedMatch} onOpenTeam={setSelectedTeam} />
        </div>
      );
    }

    if (activeSection === "Próximos") {
      return (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <ResultsFilter selectedComp={upcomingFilter} onSelect={setUpcomingFilter} />
          <MatchList matches={filterMatches(data.upcoming, upcomingFilter)} type="upcoming" onOpenMatch={setSelectedMatch} onOpenTeam={setSelectedTeam} onPreview={setPreviewMatch} />
        </div>
      );
    }

    if (activeSection === "Posiciones") {
      return (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <StandingsTable data={data.standings} leagueCode={activeLeague} onOpenTeam={setSelectedTeam} />
        </div>
      );
    }

    if (activeSection === "Estadísticas") {
      return (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <SubTabs active={statsTab} onChange={setStatsTab} />
          {statsTab === "Por Liga" && (
            <StatsPanel statsByLeague={statsByLeague} loadingLeague={loadingLeague} errorLeague={errorLeague} progress={progress} totalTeams={totalTeams} failedCount={failedCount} onRetry={retryFailed} />
          )}
          {statsTab === "Rankings" && (
            <RankingsPanel loadRankings={loadRankings} getRanking={getRanking} loading={rankLoading} done={rankDone} progress={rankProgress} total={rankTotal} />
          )}
        </div>
      );
    }

    if (activeSection === "Favoritos") {
      return (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {/* Botón comparador */}
          {favorites.length >= 2 && (
            <div style={{ marginBottom: 16 }}>
              <button
                onClick={() => setShowCompare(true)}
                style={{
                  background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 12, padding: "9px 18px", color: "#818cf8",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
              >
                ⚖️ Comparar equipos
              </button>
            </div>
          )}
          <FavoritesPanel favorites={favorites} onOpenTeam={setSelectedTeam} onCompare={() => setShowCompare(true)} />
        </div>
      );
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#060b14", minHeight: "100vh", color: "#f1f5f9", paddingBottom: 60 }}>
      {/* Header con barra de búsqueda */}
      <div style={{ background: "rgba(6,11,20,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "12px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#f1f5f9" }}>
              ⚽ FootballStats
            </div>
            <SearchBar onSelectTeam={(t) => { setSelectedTeam(t); }} />
            <button
              onClick={() => setShowCompare(true)}
              title="Comparar equipos"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 12px", color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#818cf8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#64748b"; }}
            >⚖️ Comparar</button>
            <button onClick={forceRefresh} title="Actualizar" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 10px", color: "#64748b", fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#818cf8"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
            >↻</button>
          </div>
          {/* Nav tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {SECTIONS.map((s) => {
              const icons = { Resultados: "📋", Próximos: "📅", Posiciones: "🏆", Estadísticas: "📊", Favoritos: "⭐" };
              const active = activeSection === s;
              const hasBadge = s === "Favoritos" && favorites.length > 0;
              return (
                <button key={s} onClick={() => setActiveSection(s)} style={{
                  background: active ? "rgba(99,102,241,0.2)" : "transparent",
                  border: "none", borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
                  padding: "6px 12px", color: active ? "#818cf8" : "#64748b",
                  fontWeight: active ? 700 : 500, fontSize: 12, cursor: "pointer",
                  borderRadius: "6px 6px 0 0", transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif", position: "relative",
                }}>
                  {icons[s]} {s}
                  {hasBadge && (
                    <span style={{ marginLeft: 4, background: "#f59e0b", borderRadius: 10, padding: "1px 5px", fontSize: 10, color: "#000", fontWeight: 800 }}>
                      {favorites.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0" }}>
        {error && <ErrorBanner message={error} />}
        {showLeagueSelect && <LeagueSelector activeLeague={activeLeague} onLeagueChange={setActiveLeague} />}

        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>{activeSection}</h2>
          {showLeagueSelect && <span style={{ fontSize: 13, color: "#475569" }}>· {currentLeague?.flag} {currentLeague?.name}</span>}
          {activeSection === "Estadísticas" && <span style={{ fontSize: 12, color: "#475569" }}>· 5 grandes ligas</span>}
        </div>

        {renderContent()}
      </div>

      {selectedMatch  && <MatchModal        match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
      {selectedTeam   && <TeamModal         team={selectedTeam}   onClose={() => setSelectedTeam(null)} isFav={isFav(selectedTeam?.id)} onToggleFav={toggleFav} />}
      {previewMatch   && <MatchPreviewModal match={previewMatch}  onClose={() => setPreviewMatch(null)} />}
      {showCompare    && <CompareModal                            onClose={() => setShowCompare(false)} />}
    </div>
  );
}

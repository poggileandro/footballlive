export default function FavoritesPanel({ favorites, onOpenTeam, onCompare }) {
  if (!favorites.length) return (
    <div style={{ textAlign: "center", padding: "30px 0", color: "#334155", fontSize: 13 }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
      <div>No tenés equipos favoritos todavía.</div>
      <div style={{ fontSize: 12, marginTop: 4 }}>Abrí cualquier equipo y tocá la ⭐ para agregarlo.</div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
      {favorites.map((team) => (
        <div key={team.id}
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "14px 12px", textAlign: "center",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          onClick={() => onOpenTeam(team)}
        >
          {team.crest && (
            <img src={team.crest} alt="" style={{ width: 42, height: 42, objectFit: "contain", marginBottom: 8 }}
              onError={(e) => e.target.style.display = "none"} />
          )}
          <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{team.shortName}</div>
          <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onOpenTeam(team); }}
              style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#818cf8", fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >Stats</button>
          </div>
        </div>
      ))}
    </div>
  );
}

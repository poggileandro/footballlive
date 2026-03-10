import { SECTIONS } from "../data/config";

export default function Header({ activeSection, onSectionChange, onRefresh }) {
  return (
    <header style={{
      background: "linear-gradient(180deg, #0d1117 0%, rgba(6,11,20,0) 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "20px 24px 0",
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(20px)",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>⚽</div>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: -0.5, lineHeight: 1, color: "#f1f5f9" }}>
              Football Live
            </h1>
            <span style={{ fontSize: 11, color: "#475569" }}>Datos en tiempo real</span>
          </div>
          <button
            onClick={onRefresh}
            style={{
              marginLeft: "auto",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 8, padding: "6px 14px",
              color: "#818cf8", fontSize: 12, cursor: "pointer",
              fontWeight: 600, transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
          >↻ Actualizar</button>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSectionChange(s)}
              style={{
                background: activeSection === s ? "rgba(99,102,241,0.2)" : "transparent",
                border: "none",
                borderBottom: activeSection === s ? "2px solid #6366f1" : "2px solid transparent",
                padding: "10px 16px",
                color: activeSection === s ? "#818cf8" : "#64748b",
                fontWeight: activeSection === s ? 700 : 500,
                fontSize: 13, cursor: "pointer",
                borderRadius: "6px 6px 0 0",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {s === "Estadísticas" && "📊 "}
              {s}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

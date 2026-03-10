export default function APIBanner({ isConfigured }) {
  if (isConfigured) return null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))",
        border: "1px solid rgba(245,158,11,0.3)",
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 20,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: 20 }}>🔑</span>
      <div>
        <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: 4, fontSize: 14 }}>
          Datos de demostración activos
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
          Para datos reales, obtenés tu API key gratuita en{" "}
          <a
            href="https://www.football-data.org/client/register"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}
          >
            football-data.org
          </a>{" "}
          y reemplazás{" "}
          <code
            style={{
              background: "rgba(99,102,241,0.2)",
              padding: "1px 6px",
              borderRadius: 4,
              color: "#a5b4fc",
            }}
          >
            YOUR_API_KEY_HERE
          </code>{" "}
          en <code style={{ color: "#a5b4fc" }}>src/data/config.js</code>.
        </div>
      </div>
    </div>
  );
}

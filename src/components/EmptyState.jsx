export function EmptyState({ msg }) {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", color: "#475569" }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>⚽</div>
      <div style={{ fontSize: 14 }}>{msg}</div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", color: "#475569" }}>
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid rgba(99,102,241,0.3)",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px",
        }}
      />
      <div style={{ fontSize: 13 }}>Cargando datos...</div>
    </div>
  );
}

export default function EmptyStateDefault({ msg }) {
  return <EmptyState msg={msg} />;
}

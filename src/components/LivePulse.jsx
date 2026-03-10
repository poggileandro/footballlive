export default function LivePulse() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 0 0 #22c55e",
          animation: "pulse 1.4s ease infinite",
          display: "inline-block",
        }}
      />
      <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
        EN VIVO
      </span>
    </span>
  );
}

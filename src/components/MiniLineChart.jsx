// Gráfico SVG puro — sin dependencias externas
export default function MiniLineChart({ matches, teamId, width = 340, height = 100 }) {
  if (!matches || matches.length < 2) return null;

  const finished = [...matches]
    .filter((m) => m.status === "FINISHED")
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
    .slice(-10);

  if (finished.length < 2) return null;

  const points = finished.map((m) => {
    const isHome = m.homeTeam?.id === teamId;
    return {
      gf: isHome ? (m.score?.fullTime?.home ?? 0) : (m.score?.fullTime?.away ?? 0),
      ga: isHome ? (m.score?.fullTime?.away ?? 0) : (m.score?.fullTime?.home ?? 0),
      result: (() => {
        const w = m.score?.winner;
        if (w === "DRAW") return "D";
        if ((w === "HOME_TEAM" && isHome) || (w === "AWAY_TEAM" && !isHome)) return "W";
        return "L";
      })(),
      label: `${isHome ? "vs" : "@"} ${(m.awayTeam?.shortName || m.awayTeam?.name || "").substring(0,8)}`,
    };
  });

  const maxG  = Math.max(...points.map((p) => Math.max(p.gf, p.ga)), 3);
  const padX  = 20, padY = 14;
  const W     = width  - padX * 2;
  const H     = height - padY * 2;
  const xStep = W / (points.length - 1);

  const toX = (i) => padX + i * xStep;
  const toY = (v) => padY + H - (v / maxG) * H;

  const buildPath = (key) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(p[key]).toFixed(1)}`).join(" ");

  const resColor = { W: "#22c55e", D: "#f59e0b", L: "#ef4444" };

  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      {/* Grid lines */}
      {[0, 1, 2, 3].map((v) => (
        <line key={v} x1={padX} x2={padX + W} y1={toY(v)} y2={toY(v)}
          stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}

      {/* Área GF */}
      <path
        d={`${buildPath("gf")} L ${toX(points.length - 1)} ${padY + H} L ${padX} ${padY + H} Z`}
        fill="rgba(34,197,94,0.07)" />
      {/* Área GA */}
      <path
        d={`${buildPath("ga")} L ${toX(points.length - 1)} ${padY + H} L ${padX} ${padY + H} Z`}
        fill="rgba(239,68,68,0.07)" />

      {/* Línea GF */}
      <path d={buildPath("gf")} fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* Línea GA */}
      <path d={buildPath("ga")} fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {/* Puntos con color por resultado */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(p.gf)} r={4} fill={resColor[p.result]} stroke="#0d1117" strokeWidth={1.5} />
          <circle cx={toX(i)} cy={toY(p.ga)} r={3} fill="#ef4444" stroke="#0d1117" strokeWidth={1} opacity={0.7} />
        </g>
      ))}

      {/* Labels en eje X (cada 2) */}
      {points.map((p, i) =>
        i % 2 === 0 ? (
          <text key={i} x={toX(i)} y={height - 2} textAnchor="middle"
            fontSize={9} fill="#334155">{p.label}</text>
        ) : null
      )}
    </svg>
  );
}

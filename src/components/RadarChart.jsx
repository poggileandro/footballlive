// Radar chart SVG puro para comparar dos equipos
export default function RadarChart({ teamA, teamB, labelA, labelB, size = 200 }) {
  // Ejes: Ataque, Defensa, Forma, Regularidad, BTTS
  const axes = [
    { key: "attack",  label: "Ataque"  },
    { key: "defense", label: "Defensa" },
    { key: "form",    label: "Forma"   },
    { key: "scoring", label: "Goles"   },
    { key: "btts",    label: "BTTS"    },
  ];

  // Normalizar valores 0-100 a partir de las probabilidades
  const normalize = (probs) => {
    if (!probs) return axes.map(() => 0);
    return [
      Math.min(parseFloat(probs.avgGoalsFor || 0) * 33, 100),   // Ataque
      Math.max(100 - parseFloat(probs.avgGoalsAgainst || 1) * 25, 0), // Defensa
      probs.winPct || 0,                                          // Forma
      probs.prob05For || 0,                                       // Goles
      probs.probBTTS  || 0,                                       // BTTS
    ];
  };

  const valA = normalize(teamA);
  const valB = normalize(teamB);

  const cx = size / 2, cy = size / 2;
  const r  = size * 0.38;
  const n  = axes.length;

  const angleOf = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point   = (i, pct) => ({
    x: cx + r * (pct / 100) * Math.cos(angleOf(i)),
    y: cy + r * (pct / 100) * Math.sin(angleOf(i)),
  });
  const outerPt = (i) => ({ x: cx + r * Math.cos(angleOf(i)), y: cy + r * Math.sin(angleOf(i)) });

  const toPath = (vals) =>
    vals.map((v, i) => { const p = point(i, v); return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ") + " Z";

  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
      {/* Anillos de referencia */}
      {[25, 50, 75, 100].map((lvl) => (
        <polygon key={lvl}
          points={axes.map((_, i) => { const p = point(i, lvl); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1}
        />
      ))}

      {/* Radios */}
      {axes.map((_, i) => {
        const op = outerPt(i);
        return <line key={i} x1={cx} y1={cy} x2={op.x} y2={op.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
      })}

      {/* Área equipo A */}
      <path d={toPath(valA)} fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth={2} />
      {/* Área equipo B */}
      <path d={toPath(valB)} fill="rgba(239,68,68,0.15)" stroke="#f87171" strokeWidth={2} />

      {/* Etiquetas */}
      {axes.map((ax, i) => {
        const op = outerPt(i);
        const dx = (op.x - cx) * 0.25;
        const dy = (op.y - cy) * 0.25;
        return (
          <text key={i} x={op.x + dx} y={op.y + dy}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fill="#64748b" fontWeight={600}>{ax.label}</text>
        );
      })}

      {/* Leyenda */}
      <rect x={4} y={size - 28} width={10} height={10} rx={2} fill="rgba(99,102,241,0.6)" />
      <text x={18} y={size - 20} fontSize={10} fill="#818cf8">{labelA}</text>
      <rect x={4} y={size - 14} width={10} height={10} rx={2} fill="rgba(239,68,68,0.6)" />
      <text x={18} y={size - 6} fontSize={10} fill="#f87171">{labelB}</text>
    </svg>
  );
}

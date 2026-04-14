type Conflict = {
  id: string;
  name: string;
  external_supporters: Array<{ country: string; flag: string; role: string }>;
};

const NODE_POSITIONS: Record<string, { x: number; y: number; color: string }> = {
  "Russia":         { x: 540, y: 80,  color: "#dc2626" },
  "United States":  { x: 100, y: 80,  color: "#2563eb" },
  "Iran":           { x: 320, y: 160, color: "#b45309" },
  "China":          { x: 680, y: 200, color: "#7c3aed" },
  "Turkey":         { x: 200, y: 280, color: "#0891b2" },
  "Saudi Arabia":   { x: 420, y: 300, color: "#15803d" },
  "UAE":            { x: 560, y: 320, color: "#15803d" },
  "NATO":           { x: 100, y: 220, color: "#1d4ed8" },
};

export default function NetworkDiagram({ conflicts }: { conflicts: Conflict[] }) {
  const edges: Array<{ from: string; to: string; label: string }> = [];

  for (const c of conflicts) {
    for (const s of c.external_supporters) {
      if (NODE_POSITIONS[s.country]) {
        edges.push({ from: s.country, to: c.id, label: c.name });
      }
    }
  }

  // Deduplicate edges by country
  const countryEdges: Array<{ from: string; to: string; count: number }> = [];
  const edgeMap: Record<string, number> = {};
  for (const e of edges) {
    const key = e.from;
    edgeMap[key] = (edgeMap[key] || 0) + 1;
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 800 420" className="w-full max-w-3xl mx-auto border border-gray-200 rounded-lg bg-gray-950">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#6b7280" />
          </marker>
        </defs>

        {/* Center label */}
        <text x="400" y="370" textAnchor="middle" fill="#6b7280" fontSize="11">
          Proxy Support Network — Lines show support relationships
        </text>

        {/* Draw edges between related nodes */}
        {Object.entries(NODE_POSITIONS).map(([country, pos]) =>
          Object.entries(NODE_POSITIONS).map(([other, opos]) => {
            if (country >= other) return null;
            // Find shared conflicts
            const shared = conflicts.filter(
              (c) =>
                c.external_supporters.some((s) => s.country === country) &&
                c.external_supporters.some((s) => s.country === other)
            );
            if (!shared.length) return null;
            return (
              <line
                key={`${country}-${other}`}
                x1={pos.x} y1={pos.y}
                x2={opos.x} y2={opos.y}
                stroke="#374151"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                markerEnd="url(#arrow)"
              />
            );
          })
        )}

        {/* Draw nodes */}
        {Object.entries(NODE_POSITIONS).map(([country, pos]) => {
          const count = edgeMap[country] || 0;
          return (
            <g key={country}>
              <circle
                cx={pos.x} cy={pos.y} r={count > 2 ? 32 : 24}
                fill={pos.color + "33"}
                stroke={pos.color}
                strokeWidth="2"
              />
              <text x={pos.x} y={pos.y - 2} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                {country.split(" ").map((w, i) => (
                  <tspan key={i} x={pos.x} dy={i === 0 ? 0 : 11}>{w}</tspan>
                ))}
              </text>
              {count > 0 && (
                <text x={pos.x} y={pos.y + 14} textAnchor="middle" fill="#9ca3af" fontSize="8">
                  {count} conflicts
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

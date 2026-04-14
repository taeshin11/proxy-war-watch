'use client'

type Conflict = {
  id: string;
  name: string;
  external_supporters: Array<{ country: string; flag: string; role: string; evidence_level?: string }>;
};

const NODE_POSITIONS: Record<string, { x: number; y: number; color: string; group: 'western' | 'russia' | 'arab' | 'other' }> = {
  "Russia":         { x: 580, y: 80,  color: "#dc2626", group: 'russia' },
  "United States":  { x: 100, y: 80,  color: "#2563eb", group: 'western' },
  "Iran":           { x: 380, y: 160, color: "#b45309", group: 'russia' },
  "China":          { x: 700, y: 210, color: "#7c3aed", group: 'other' },
  "Turkey":         { x: 220, y: 290, color: "#0891b2", group: 'other' },
  "Saudi Arabia":   { x: 450, y: 310, color: "#15803d", group: 'arab' },
  "UAE":            { x: 590, y: 330, color: "#059669", group: 'arab' },
  "NATO":           { x: 100, y: 230, color: "#1d4ed8", group: 'western' },
};

const GROUP_EDGE_COLOR: Record<string, string> = {
  western: "#3b82f6",
  russia: "#ef4444",
  arab: "#22c55e",
  other: "#a855f7",
};

export default function NetworkDiagram({ conflicts }: { conflicts: Conflict[] }) {
  const edgeMap: Record<string, number> = {};
  for (const c of conflicts) {
    for (const s of c.external_supporters) {
      if (NODE_POSITIONS[s.country]) {
        edgeMap[s.country] = (edgeMap[s.country] || 0) + 1;
      }
    }
  }

  const sharedEdges: Array<{ from: string; to: string; fromPos: { x: number; y: number; group: string }; toPos: { x: number; y: number } }> = [];
  const countriesList = Object.keys(NODE_POSITIONS);
  for (let i = 0; i < countriesList.length; i++) {
    for (let j = i + 1; j < countriesList.length; j++) {
      const a = countriesList[i];
      const b = countriesList[j];
      const shared = conflicts.filter(
        (c) =>
          c.external_supporters.some((s) => s.country === a) &&
          c.external_supporters.some((s) => s.country === b)
      );
      if (shared.length > 0) {
        sharedEdges.push({
          from: a,
          to: b,
          fromPos: NODE_POSITIONS[a],
          toPos: NODE_POSITIONS[b],
        });
      }
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4 overflow-hidden">
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Support alignment:</span>
          <span className="flex items-center gap-1.5 text-xs text-blue-400"><span className="w-3 h-0.5 bg-blue-500 inline-block"></span>Western</span>
          <span className="flex items-center gap-1.5 text-xs text-red-400"><span className="w-3 h-0.5 bg-red-500 inline-block"></span>Russia/Iran</span>
          <span className="flex items-center gap-1.5 text-xs text-green-400"><span className="w-3 h-0.5 bg-green-500 inline-block"></span>Arab states</span>
          <span className="flex items-center gap-1.5 text-xs text-purple-400"><span className="w-3 h-0.5 bg-purple-500 inline-block"></span>Other</span>
        </div>
        <svg viewBox="0 0 800 420" className="w-full max-w-3xl mx-auto">
          <defs>
            <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#3b82f6" opacity="0.7" />
            </marker>
            <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" opacity="0.7" />
            </marker>
            <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#22c55e" opacity="0.7" />
            </marker>
            <marker id="arrow-purple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#a855f7" opacity="0.7" />
            </marker>
          </defs>

          {/* Edges */}
          {sharedEdges.map(({ from, to, fromPos, toPos }) => {
            const color = GROUP_EDGE_COLOR[fromPos.group];
            const markerId = `arrow-${fromPos.group === 'western' ? 'blue' : fromPos.group === 'russia' ? 'red' : fromPos.group === 'arab' ? 'green' : 'purple'}`;
            return (
              <line
                key={`${from}-${to}`}
                x1={fromPos.x} y1={fromPos.y}
                x2={toPos.x} y2={toPos.y}
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.35"
                strokeDasharray="5 3"
                markerEnd={`url(#${markerId})`}
              />
            );
          })}

          {/* Nodes */}
          {Object.entries(NODE_POSITIONS).map(([country, pos]) => {
            const count = edgeMap[country] || 0;
            const r = count > 3 ? 36 : count > 1 ? 30 : 24;
            return (
              <g key={country}>
                <circle
                  cx={pos.x} cy={pos.y} r={r}
                  fill={pos.color + "22"}
                  stroke={pos.color}
                  strokeWidth="2"
                />
                <text x={pos.x} y={pos.y - 2} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                  {country.split(" ").map((w, i) => (
                    <tspan key={i} x={pos.x} dy={i === 0 ? 0 : 11}>{w}</tspan>
                  ))}
                </text>
                {count > 0 && (
                  <text x={pos.x} y={pos.y + (r > 30 ? 20 : 15)} textAnchor="middle" fill={pos.color} fontSize="8" fontWeight="bold">
                    {count}×
                  </text>
                )}
              </g>
            );
          })}

          <text x="400" y="400" textAnchor="middle" fill="#475569" fontSize="10">
            Proxy Support Network — node size reflects conflict involvement count
          </text>
        </svg>
      </div>
    </div>
  );
}

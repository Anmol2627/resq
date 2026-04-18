// Stylized SVG dark map. Not real tiles — purely visual.
export const MapCanvas = ({ height = 360 }: { height?: number }) => {
  return (
    <div className="relative w-full overflow-hidden bg-void" style={{ height }}>
      <svg viewBox="0 0 400 360" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* parks */}
        <rect x="20" y="40" width="90" height="70" fill="#0D1A0F" />
        <rect x="280" y="220" width="100" height="120" fill="#0D1A0F" rx="4" />
        {/* water */}
        <path d="M0 280 Q100 260 200 285 T400 270 L400 360 L0 360 Z" fill="#0A1628" />
        {/* roads */}
        <g stroke="#1A1F2C" strokeWidth="14" fill="none">
          <path d="M0 130 L400 130" />
          <path d="M0 200 L400 200" />
          <path d="M120 0 L120 360" />
          <path d="M260 0 L260 360" />
        </g>
        <g stroke="#141820" strokeWidth="6" fill="none">
          <path d="M0 80 L400 80" />
          <path d="M60 0 L60 360" />
          <path d="M340 0 L340 360" />
          <path d="M180 130 L180 280" />
        </g>
        {/* lane markers */}
        <g stroke="#2A3142" strokeWidth="1" strokeDasharray="6 8" fill="none">
          <path d="M0 130 L400 130" />
          <path d="M120 0 L120 360" />
        </g>

        {/* grid hint */}
        <g opacity="0.05" stroke="#3B82F6">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 36} x2="400" y2={i * 36} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 36} y1="0" x2={i * 36} y2="360" />
          ))}
        </g>

        {/* labels */}
        <g fill="#4A5568" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="1">
          <text x="30" y="60">QUEEN ST W</text>
          <text x="290" y="240">TRINITY PARK</text>
          <text x="20" y="320">LAKESHORE</text>
        </g>

        {/* Emergency hexagon center */}
        <g transform="translate(200 175)">
          <circle r="28" fill="hsl(var(--emergency) / 0.15)">
            <animate attributeName="r" values="22;38;22" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <polygon
            points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6"
            fill="hsl(var(--emergency))"
            stroke="hsl(var(--emergency))"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--emergency)))' }}
          />
        </g>

        {/* User location dot */}
        <g transform="translate(200 175)">
          <circle r="6" fill="hsl(var(--safe))" opacity="0">
            <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

      </svg>
    </div>
  );
};

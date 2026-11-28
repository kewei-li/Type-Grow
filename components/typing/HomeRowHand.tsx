interface HomeRowHandProps {
  side: 'left' | 'right';
}

// Fingers for the LEFT hand, from pinky to index. The right hand is the mirror image.
const FINGERS = [
  { cx: 38, top: 46, name: 'Pinky' },
  { cx: 61, top: 26, name: 'Ring' },
  { cx: 84, top: 18, name: 'Middle' },
  { cx: 107, top: 30, name: 'Index' },
];
const W = 19;          // finger width
const R = W / 2;
const VALLEY = 86;     // where fingers meet the palm
const VB_W = 160;
const VB_H = 160;

const LEFT_KEYS = ['A', 'S', 'D', 'F'];
const RIGHT_KEYS = [';', 'L', 'K', 'J']; // pinky → index, mirrored on screen

/** One continuous outline: palm, four fingers with rounded tips, and a thumb. */
function leftHandPath() {
  const f = FINGERS;
  let d = `M 34 140 L ${f[0].cx - R} ${VALLEY + 10}`;
  f.forEach((finger, i) => {
    const l = finger.cx - R;
    const r = finger.cx + R;
    d += ` L ${l} ${finger.top + R} A ${R} ${R} 0 0 1 ${r} ${finger.top + R}`;
    if (i < f.length - 1) {
      const nextL = f[i + 1].cx - R;
      d += ` L ${r} ${VALLEY} Q ${(r + nextL) / 2} ${VALLEY + 5} ${nextL} ${VALLEY}`;
    }
  });
  const last = f[f.length - 1].cx + R;
  // Thumb, angled in toward the space bar
  d += ` L ${last} 98 C ${last + 8} 94 ${last + 18} 92 ${last + 26} 98`;
  d += ` A 9 9 0 0 1 ${last + 22} 113 C ${last + 14} 118 ${last + 8} 124 ${last + 4} 132`;
  d += ` Q ${last} 146 ${last - 14} 146 L 46 146 Q 34 146 34 140 Z`;
  return d;
}

const PATH = leftHandPath();

export default function HomeRowHand({ side }: HomeRowHandProps) {
  const mirror = side === 'right';
  const keys = mirror ? RIGHT_KEYS : LEFT_KEYS;
  const x = (cx: number) => (mirror ? VB_W - cx : cx);

  return (
    <figure className="flex flex-col items-center m-0">
      <svg
        width={VB_W}
        height={VB_H + 2}
        viewBox={`0 -12 ${VB_W} ${VB_H + 2}`}
        className="text-green-500 overflow-visible"
        role="img"
        aria-label={`${mirror ? 'Right' : 'Left'} hand: fingers rest on ${keys.join(' ')}`}
      >
        <g transform={mirror ? `translate(${VB_W} 0) scale(-1 1)` : undefined}>
          <path
            d={PATH}
            fill="currentColor"
            fillOpacity={0.08}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeOpacity={0.85}
          />
          {/* Knuckle line, very light */}
          <path
            d={`M ${FINGERS[0].cx} ${VALLEY + 14} Q 72 ${VALLEY + 6} ${FINGERS[3].cx} ${VALLEY + 10}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </g>

        {FINGERS.map((finger, i) => {
          const cx = x(finger.cx);
          const key = keys[i];
          const home = finger.name === 'Index';
          const badgeY = finger.top - 26;
          return (
            <g key={finger.name}>
              {/* Fingertip resting on the key */}
              <circle cx={cx} cy={finger.top + R} r={3.5} fill="currentColor" />
              {/* Key cap above the fingertip */}
              <rect
                x={cx - 10}
                y={badgeY}
                width={20}
                height={20}
                rx={5}
                fill="currentColor"
                fillOpacity={0.15}
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <text
                x={cx}
                y={badgeY + 14.5}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill="currentColor"
              >
                {key}
              </text>
              {/* F and J have a bump you can feel */}
              {home && (
                <line
                  x1={cx - 4}
                  x2={cx + 4}
                  y1={badgeY + 17}
                  y2={badgeY + 17}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="text-sm text-muted-foreground mt-2">
        {mirror ? 'Right hand' : 'Left hand'}
      </figcaption>
    </figure>
  );
}

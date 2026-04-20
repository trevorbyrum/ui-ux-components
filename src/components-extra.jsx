/*
  ADDITIONAL COMPONENTS — each with 2-3 variations to choose from.
*/

/* ── Checkbox — card-matched style ── */
function Checkbox({ checked, onChange, label, theme }) {
  const t = theme;
  const dark = t.mode === 'dark';
  const cbs = cardBorderStyle(t);
  return (
    <div onClick={() => onChange && onChange(!checked)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: t.font }}>
      <div style={{
        width: 16, height: 16, borderRadius: 3, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms', flexShrink: 0,
        ...cbs,
        background: checked ? t.accentSolid : `oklch(0.07 0.002 ${t.hue})`,
        ...(checked
          ? { border: `1.5px solid ${t.accentSolid}`, borderTopWidth: '1.5px', borderLeftWidth: '1.5px', borderTopColor: t.accentSolid, borderLeftColor: t.accentSolid, borderRightColor: t.accentSolid, borderBottomColor: t.accentSolid }
          : { border: `1.5px solid ${t.accentSolid}`, borderTopWidth: '1.5px', borderLeftWidth: '1.5px', borderTopColor: t.accentSolid, borderLeftColor: t.accentSolid, borderRightColor: t.accentSolid, borderBottomColor: t.accentSolid }),
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4.5 7.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {label && <span style={{ fontSize: 13, color: t.fg1 }}>{label}</span>}
    </div>
  );
}

/* ── Radio — card-matched style, solid fill ── */
function Radio({ checked, onChange, label, theme }) {
  const t = theme;
  const dark = t.mode === 'dark';
  const cbs = cardBorderStyle(t);
  return (
    <div onClick={() => onChange && onChange()} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: t.font }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms', flexShrink: 0,
        ...cbs,
        borderRadius: '50%',
        background: checked ? t.accentSolid : `oklch(0.07 0.002 ${t.hue})`,
        border: `1.5px solid ${t.accentSolid}`,
        borderTopWidth: '1.5px', borderLeftWidth: '1.5px',
        borderTopColor: t.accentSolid, borderLeftColor: t.accentSolid,
        borderRightColor: t.accentSolid, borderBottomColor: t.accentSolid,
      }} />
      {label && <span style={{ fontSize: 13, color: t.fg1 }}>{label}</span>}
    </div>
  );
}

/* ── Textarea — default bordered ── */
function Textarea({ label, placeholder, rows = 3, theme }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: t.fg2, fontFamily: t.font }}>{label}</label>}
      <textarea placeholder={placeholder} rows={rows} style={{
        fontFamily: t.font, fontSize: 13, padding: '8px 10px', borderRadius: t.radius,
        border: `1px solid ${t.borderSoft}`, background: t.surfaceBg, color: t.fg1,
        outline: 'none', lineHeight: 1.5, resize: 'vertical', boxShadow: 'none',
      }} />
    </div>
  );
}

/* ── Tooltip — dark and accent variants kept ── */
function Tooltip({ text, position = 'top', variant = 'dark', theme, children }) {
  const t = theme;
  const dark = t.mode === 'dark';
  const cbs = cardBorderStyle(t);
  const tipStyles = {
    dark: { ...cbs, color: dark ? 'oklch(0.14 0.005 54)' : '#fff', background: dark ? 'oklch(0.92 0.003 54)' : 'oklch(0.18 0.01 54)' },
    accent: { ...cbs, background: t.accentSolid, color: t.accentOnSolid, border: `1px solid ${t.accentSolid}`, borderTopColor: t.accentSolid, borderLeftColor: t.accentSolid, borderRightColor: t.accentSolid, borderBottomColor: t.accentSolid },
  };
  const vs = tipStyles[variant];
  const pos = { top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 },
  };
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      <div style={{
        position: 'absolute', ...pos[position],
        padding: '4px 10px', borderRadius: t.radius, fontSize: 11, fontWeight: 500,
        whiteSpace: 'nowrap', fontFamily: t.font, pointerEvents: 'none',
        ...vs,
      }}>{text}</div>
    </div>
  );
}

/* ── Dropdown / Menu — raised ── */
function DropdownMenu({ items, theme }) {
  const t = theme;
  const dark = t.mode === 'dark';
  const cbs = cardBorderStyle(t);
  return (
    <div style={{
      width: 200, borderRadius: t.radiusLg, overflow: 'hidden', fontFamily: t.font, padding: 4,
      ...cbs,
      boxShadow: dark
        ? `0 8px 24px rgba(0,0,0,0.6), 0 2px 6px oklch(0.15 0.06 ${t.hue} / 0.5), inset 0 1px 0 rgba(255,255,255,0.04)`
        : '0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)',
    }}>
      {items.map((item, i) => (
        item === '-' ? <div key={i} style={{ height: 1, background: dark ? `oklch(0.24 0.006 ${t.hue})` : t.border, margin: '4px 0' }} />
        : <div key={i} style={{
            padding: '7px 10px', fontSize: 13, color: item.danger ? t.error : t.fg1,
            borderRadius: t.radius, cursor: 'pointer', fontWeight: item.danger ? 600 : (item.active ? 500 : 400),
            background: item.active ? t.accentSubtle : 'transparent',
          }}>
            {item.label || item}
          </div>
      ))}
    </div>
  );
}

/* ── Toast / Notification — default ── */
function Toast({ message, type = 'info', theme, onClose }) {
  const t = theme;
  const dark = t.mode === 'dark';
  const typeColors = { info: t.accentSolid, success: t.success, error: t.error };
  const cbs = cardBorderStyle(t);
  return (
    <div style={{
      width: 320, padding: '8px 14px', borderRadius: t.radiusLg, fontFamily: t.font,
      display: 'flex', alignItems: 'center', gap: 10,
      background: t.accentSubtle, border: 'none',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[type], flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: t.accentSolid, flex: 1 }}>{message}</span>
      <span onClick={onClose} style={{ fontSize: 16, color: t.accentSolid, cursor: 'pointer', lineHeight: 1, opacity: 0.5 }}>×</span>
    </div>
  );
}

/* ── Progress Bar — default 6px ── */
function Progress({ value = 50, theme }) {
  const t = theme;
  return (
    <div style={{ width: '100%', height: 6, borderRadius: 6, background: t.subtleBg, overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min(100, Math.max(0, value))}%`, height: '100%',
        background: t.accentSolid, borderRadius: 6,
        transition: 'width 300ms ease-out',
      }} />
    </div>
  );
}

/* ── Spinner ── */
function Spinner({ size = 20, variant = 'default', theme }) {
  const t = theme;
  if (variant === 'dots') {
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: size * 0.3, height: size * 0.3, borderRadius: '50%', background: t.accentSolid,
            animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            opacity: 0.4,
          }} />
        ))}
        <style>{`@keyframes dotPulse { 0%, 80%, 100% { opacity: 0.4; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    );
  }
  if (variant === 'orbital') {
    const s = size * 2;
    const d = Math.max(3, size * 0.2); // all dots same size
    const r1 = s * 0.18; // inner orbit radius — 20% closer
    const r2 = s * 0.34; // outer orbit radius — 20% closer
    return (
      <div style={{ width: s, height: s, position: 'relative' }}>
        {/* Center point */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: d, height: d, borderRadius: '50%',
          background: t.accentSolid, transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${d * 2}px ${t.accent[7]}`,
          animation: 'centerBlink 2.5s ease-in-out infinite',
        }} />
        {/* Inner orbit */}
        <svg width={s} height={s} style={{ position: 'absolute', inset: 0, animation: 'centerBlink 2.5s ease-in-out infinite' }}>
          <defs>
            <linearGradient id="t1">
              <stop offset="0%" stopColor={t.accentSolid} stopOpacity="1" />
              <stop offset="30%" stopColor={t.accentSolid} stopOpacity="0.3" />
              <stop offset="100%" stopColor={t.accentSolid} stopOpacity="0" />
            </linearGradient>
          </defs>
          <g style={{ animation: 'orbA 2s linear infinite', transformOrigin: `${s/2}px ${s/2}px` }}>
            <circle cx={s/2} cy={s/2 - r1} r={d/2} fill={t.accentSolid} />
            {/* Smooth tapering tail — 16 fine segments */}
            {Array.from({length: 16}, (_, i) => {
              const seg = 11;
              const startAngle = -90 - (i + 1) * seg;
              const endAngle = startAngle + seg + 0.5;
              const sa = startAngle * Math.PI / 180;
              const ea = endAngle * Math.PI / 180;
              const frac = i / 15;
              return <path key={i} d={`M ${s/2 + r1 * Math.cos(ea)} ${s/2 + r1 * Math.sin(ea)} A ${r1} ${r1} 0 0 0 ${s/2 + r1 * Math.cos(sa)} ${s/2 + r1 * Math.sin(sa)}`}
                fill="none" stroke={t.accentSolid} strokeWidth={d * (1 - frac * 0.9)} strokeLinecap="round" opacity={0.9 * (1 - frac * frac)} />;
            })}
          </g>
        </svg>
        {/* Outer orbit */}
        <svg width={s} height={s} style={{ position: 'absolute', inset: 0, animation: 'centerBlink 2.5s ease-in-out infinite' }}>
          <defs>
            <linearGradient id="t2">
              <stop offset="0%" stopColor={t.accentSolid} stopOpacity="0.8" />
              <stop offset="40%" stopColor={t.accentSolid} stopOpacity="0.2" />
              <stop offset="100%" stopColor={t.accentSolid} stopOpacity="0" />
            </linearGradient>
          </defs>
          <g style={{ animation: 'orbB 1.6s linear infinite', transformOrigin: `${s/2}px ${s/2}px` }}>
            <circle cx={s/2} cy={s/2 - r2} r={d/2} fill={t.accentSolid} opacity="0.9" />
            {/* Smooth tapering tail — 20 fine segments (longer) */}
            {Array.from({length: 20}, (_, i) => {
              const seg = 10;
              const startAngle = -90 - (i + 1) * seg;
              const endAngle = startAngle + seg + 0.5;
              const sa = startAngle * Math.PI / 180;
              const ea = endAngle * Math.PI / 180;
              const frac = i / 19;
              return <path key={i} d={`M ${s/2 + r2 * Math.cos(ea)} ${s/2 + r2 * Math.sin(ea)} A ${r2} ${r2} 0 0 0 ${s/2 + r2 * Math.cos(sa)} ${s/2 + r2 * Math.sin(sa)}`}
                fill="none" stroke={t.accentSolid} strokeWidth={d * 0.9 * (1 - frac * 0.9)} strokeLinecap="round" opacity={0.85 * (1 - frac * frac)} />;
            })}
          </g>
        </svg>
        <style>{`
          @keyframes orbA { to { transform: rotate(360deg); } }
          @keyframes orbB { to { transform: rotate(360deg); } }
          @keyframes centerBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        `}</style>
      </div>
    );
  }
  if (variant === 'blackhole') {
    const bhs = Math.round(size * 1.6);
    const id = 'bh' + Math.random().toString(36).slice(2, 6);
    return (
      <div style={{ width: bhs, height: bhs, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Accretion disk — tilted ellipse ring */}
        <svg width={bhs} height={bhs} viewBox="0 0 60 60" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <radialGradient id={`${id}dg`} cx="50%" cy="50%" r="50%">
              <stop offset="40%" stopColor="transparent" />
              <stop offset="55%" stopColor={t.accent[8]} stopOpacity="0.6" />
              <stop offset="70%" stopColor={t.accent[6]} stopOpacity="0.3" />
              <stop offset="85%" stopColor={t.accent[5]} stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <mask id={`${id}m`}>
              <rect width="60" height="60" fill="white" />
              <ellipse cx="30" cy="30" rx="8" ry="8" fill="black" />
            </mask>
          </defs>
          {/* Outer glow */}
          <ellipse cx="30" cy="30" rx="29" ry="12" fill="none" stroke={t.accent[5]} strokeWidth="4" opacity="0.55"
            style={{ animation: `${id}spin 4s linear infinite`, transformOrigin: '30px 30px' }} />
          <ellipse cx="30" cy="30" rx="29" ry="12" fill="none" stroke={t.accent[6]} strokeWidth="2.2" opacity="0.45" strokeDasharray="6 8"
            style={{ animation: `${id}spin 4s linear infinite`, transformOrigin: '30px 30px' }} />
          {/* Disk layer 1 — outermost */}
          <g style={{ animation: `${id}spin 3.25s linear infinite`, transformOrigin: '30px 30px' }}>
            <ellipse cx="30" cy="30" rx="26" ry="11" fill="none" 
              stroke={t.accent[6]} strokeWidth="5.5" opacity="0.45" />
            <ellipse cx="30" cy="30" rx="26" ry="11" fill="none"
              stroke={t.accent[7]} strokeWidth="2.7" opacity="0.55" strokeDasharray="8 12" />
          </g>
          {/* Disk layer 2 — mid */}
          <g style={{ animation: `${id}spin 2.5s linear infinite`, transformOrigin: '30px 30px' }}>
            <ellipse cx="30" cy="30" rx="22" ry="9" fill="none"
              stroke={t.accent[7]} strokeWidth="5" opacity="0.6" />
            <ellipse cx="30" cy="30" rx="22" ry="9" fill="none"
              stroke={t.accent[7]} strokeWidth="2.7" opacity="0.5" strokeDasharray="5 10" />
          </g>
          {/* Disk layer 3 — inner, brighter */}
          <g style={{ animation: `${id}spin 1.75s linear infinite`, transformOrigin: '30px 30px' }}>
            <ellipse cx="30" cy="30" rx="16" ry="6" fill="none"
              stroke={t.accent[8]} strokeWidth="4" opacity="0.75" />
            <ellipse cx="30" cy="30" rx="16" ry="6" fill="none"
              stroke={t.accent[7]} strokeWidth="2.2" opacity="0.6" strokeDasharray="3 7" />
          </g>
          {/* Hot inner ring */}
          <g style={{ animation: `${id}spin 1s linear infinite`, transformOrigin: '30px 30px' }}>
            <ellipse cx="30" cy="30" rx="11.5" ry="4.5" fill="none"
              stroke={t.accent[8]} strokeWidth="2.7" opacity="0.7" />
          </g>
          {/* Black hole center */}
          <circle cx="30" cy="30" r="6" fill={`oklch(0.05 0.005 ${t.hue})`} />
          <circle cx="30" cy="30" r="6" fill="black" opacity="0.7" />
          {/* Event horizon glow */}
          <circle cx="30" cy="30" r="7.5" fill="none" stroke={t.accentSolid} strokeWidth="0.8" opacity="0.25"
            style={{ animation: `${id}pulse 2.5s ease-in-out infinite` }} />
        </svg>
        <style>{`
          @keyframes ${id}spin { to { transform: rotate(360deg); } }
          @keyframes ${id}pulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.45; } }
        `}</style>
      </div>
    );
  }
  if (variant === 'marble') {
    const ms = Math.round(size * 1.4);
    const id = 'marble' + Math.random().toString(36).slice(2, 6);
    return (
      <div style={{ width: ms, height: ms, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
        <svg width={ms} height={ms} viewBox="0 0 40 40">
          <defs>
            <radialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={t.accent[7]} />
              <stop offset="80%" stopColor={t.accent[9]} />
              <stop offset="100%" stopColor={t.accent[10]} />
            </radialGradient>
            <clipPath id={`${id}c`}><circle cx="20" cy="20" r="20" /></clipPath>
          </defs>
          {/* Base sphere */}
          <circle cx="20" cy="20" r="20" fill={`url(#${id}g)`} />
          {/* Scrolling bands */}
          <g clipPath={`url(#${id}c)`}>
            <g style={{ animation: `${id}scroll 4s linear infinite` }}>
              {[0, 80].map(xOff => (
                <g key={xOff} transform={`translate(${xOff - 40}, 0)`}>
                  {/* Thin darker bands */}
                  {[
                    { y: 3, h: 2, o: 0.2 },
                    { y: 8, h: 1.5, o: 0.15 },
                    { y: 25, h: 2, o: 0.2 },
                    { y: 31, h: 1.5, o: 0.15 },
                    { y: 36, h: 2, o: 0.18 },
                  ].map((band, i) => (
                    <rect key={i} x="0" y={band.y} width="80" height={band.h}
                      fill={t.accent[10]} opacity={band.o} />
                  ))}
                  {/* Top wavy band */}
                  <path d={`M 0 5 Q 12 3, 22 6 Q 35 9, 45 5.5 Q 58 2, 70 6.5 L 80 5 L 80 10 Q 68 12, 55 8.5 Q 42 5, 30 9 Q 18 12, 5 8 L 0 10 Z`}
                    fill={t.accent[5]} opacity="0.2" />
                  {/* Middle wavy band — wider, irregular */}
                  <path d={`M 0 15 Q 8 13, 18 16 Q 28 19, 35 15.5 Q 45 12, 55 16.5 Q 65 20, 75 15 L 80 15 L 80 23 Q 72 26, 62 21 Q 50 17, 42 22.5 Q 30 27, 20 22 Q 10 18, 0 23 Z`}
                    fill={t.accent[5]} opacity="0.3" />
                  <path d={`M 0 16.5 Q 10 14, 22 17.5 Q 32 20, 40 16 Q 52 12.5, 62 18 Q 72 22, 80 17 L 80 21 Q 70 24, 58 19.5 Q 46 16, 36 20.5 Q 24 24, 12 19 Q 4 17, 0 20.5 Z`}
                    fill={t.accent[3]} opacity="0.2" />
                  {/* Bottom wavy band */}
                  <path d={`M 0 32 Q 15 30, 25 33.5 Q 38 37, 50 33 Q 62 29, 75 33 L 80 32 L 80 37 Q 65 39, 52 35.5 Q 40 32, 28 36 Q 15 39, 0 36 Z`}
                    fill={t.accent[5]} opacity="0.2" />
                  {/* Storm spots */}
                  <ellipse cx="50" cy="14" rx="4" ry="2" fill={t.accent[7]} opacity="0.25" />
                  <ellipse cx="22" cy="30" rx="3" ry="1.5" fill={t.accent[6]} opacity="0.15" />
                </g>
              ))}
            </g>
            {/* Dim overlay */}
            <rect x="0" y="0" width="40" height="40" fill="black"
              style={{ animation: `${id}dim 5s ease-in-out infinite` }} />
          </g>
        </svg>
        {/* Glare — HTML div overlay */}
        <div style={{
          position: 'absolute', top: '5%', left: 0, width: '40%', height: '90%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 65%)',
          animation: `${id}light 5s ease-in-out infinite`,
          pointerEvents: 'none',
        }} />
        <style>{`
          @keyframes ${id}scroll { from { transform: translateX(0); } to { transform: translateX(-80px); } }
          @keyframes ${id}light {
            0%   { transform: translateX(-80%); opacity: 0; }
            15%  { transform: translateX(-30%); opacity: 0.6; }
            40%  { transform: translateX(20%);  opacity: 1; }
            60%  { transform: translateX(60%);  opacity: 0.6; }
            80%  { transform: translateX(110%); opacity: 0; }
            100% { transform: translateX(110%); opacity: 0; }
          }
          @keyframes ${id}dim {
            0%   { opacity: 0.18; }
            15%  { opacity: 0.05; }
            40%  { opacity: 0; }
            60%  { opacity: 0; }
            80%  { opacity: 0.05; }
            95%  { opacity: 0.18; }
            100% { opacity: 0.18; }
          }
        `}</style>
      </div>
    );
  }
  // default ring spinner
  const borderStyle = variant === 'ring'
    ? { border: `2px solid ${t.border}`, borderTopColor: t.fg1 }
    : { border: `2px solid ${t.subtleBg}`, borderTopColor: t.accentSolid };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', ...borderStyle,
      animation: 'spin 0.8s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Breadcrumbs — custom 50° chevron ── */
function Breadcrumbs({ items, theme }) {
  const t = theme;
  const Chevron = () => (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" style={{ opacity: 0.5 }}>
      <path d="M1.5 1L6 6L1.5 11" stroke={t.fg3} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: t.font, fontSize: 13 }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Chevron />}
          <span style={{
            color: i === items.length - 1 ? t.fg1 : t.fg3,
            fontWeight: i === items.length - 1 ? 500 : 400,
            cursor: i < items.length - 1 ? 'pointer' : 'default',
            borderBottom: i === items.length - 1 ? `2px solid ${t.accentSolid}` : '2px solid transparent',
            paddingBottom: 2,
          }}>{item}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Pagination — minimal ── */
function Pagination({ current = 1, total = 5, theme, onChange }) {
  const t = theme;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontFamily: t.font }}>
      <span style={{ fontSize: 12, color: t.fg3, cursor: 'pointer', marginRight: 4 }}>←</span>
      {pages.map(p => (
        <div key={p} onClick={() => onChange && onChange(p)} style={{
          padding: '4px 8px', fontSize: 12, cursor: 'pointer',
          fontWeight: p === current ? 600 : 400,
          color: p === current ? t.fg1 : t.fg3,
          borderBottom: p === current ? `2px solid ${t.accentSolid}` : '2px solid transparent',
        }}>{p}</div>
      ))}
      <span style={{ fontSize: 12, color: t.fg3, cursor: 'pointer', marginLeft: 4 }}>→</span>
    </div>
  );
}

/* ── Alert / Banner — default ── */
function Alert({ message, type = 'info', theme }) {
  const t = theme;
  const typeColors = { info: t.accentSolid, success: t.success, error: t.error };
  const cbs = cardBorderStyle(t);
  return (
    <div style={{
      padding: '10px 14px', borderRadius: t.radius, fontFamily: t.font, fontSize: 13,
      display: 'flex', alignItems: 'center', gap: 10, color: t.fg1,
      ...cbs,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: typeColors[type], flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  );
}

/* ── Skeleton Loader ── */
function Skeleton({ variant = 'pulse', width = '100%', height = 14, radius, theme }) {
  const t = theme;
  const r = radius || t.radius;
  const bg = t.subtleBg;
  if (variant === 'pulse') {
    return (
      <div style={{ width, height, borderRadius: r, background: bg, animation: 'skPulse 1.5s ease-in-out infinite' }}>
        <style>{`@keyframes skPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  }
  // shimmer
  return (
    <div style={{ width, height, borderRadius: r, background: bg, overflow: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
        background: `linear-gradient(90deg, transparent, ${t.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'}, transparent)`,
        animation: 'skShimmer 1.5s ease-in-out infinite',
      }} />
      <style>{`@keyframes skShimmer { to { left: 100%; } }`}</style>
    </div>
  );
}

Object.assign(window, {
  Checkbox, Radio, Textarea, Tooltip, DropdownMenu, Toast,
  Progress, Spinner, Breadcrumbs, Pagination, Alert, Skeleton,
});

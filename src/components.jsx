/*
  CORE COMPONENTS — rebuilt for new token system.
  One accent. Neutral base. No color fights.
*/

/* ── Button ── */
function Button({ children, variant = 'primary', size = 'md', theme, ...props }) {
  const t = theme;
  const sizes = {
    sm: { fontSize: 12, padding: '5px 10px' },
    md: { fontSize: 13, padding: '7px 14px' },
    lg: { fontSize: 14, padding: '9px 18px' },
  };
  const dark = t.mode === 'dark';
  // Weighted border style matching cards
  const btnBorder = (variant) => {
    if (variant === 'accent') {
      return {
        borderStyle: 'solid',
        borderTopWidth: '1.2px', borderLeftWidth: '1.5px',
        borderRightWidth: '1px', borderBottomWidth: '1px',
        borderTopColor: dark ? `oklch(0.65 0.18 ${t.hue})` : 'rgba(255,255,255,0.3)',
        borderLeftColor: dark ? `oklch(0.65 0.18 ${t.hue})` : 'rgba(255,255,255,0.25)',
        borderRightColor: dark ? `oklch(0.40 0.14 ${t.hue})` : 'rgba(0,0,0,0.08)',
        borderBottomColor: dark ? `oklch(0.38 0.12 ${t.hue})` : 'rgba(0,0,0,0.1)',
      };
    }
    return {
      borderStyle: 'solid',
      borderTopWidth: '1.2px', borderLeftWidth: '1.5px',
      borderRightWidth: '1px', borderBottomWidth: '1px',
      borderTopColor: dark ? `oklch(0.30 0.01 ${t.hue})` : 'rgba(255,255,255,0.3)',
      borderLeftColor: dark ? `oklch(0.30 0.01 ${t.hue})` : 'rgba(255,255,255,0.25)',
      borderRightColor: dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)',
      borderBottomColor: dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)',
    };
  };
  const raised = dark
    ? '0 2px 4px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)'
    : '0 1px 3px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.25)';
  const raisedSec = dark
    ? '0 2px 4px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
    : '0 1px 3px rgba(0,0,0,0.08), 0 1px 1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)';
  const variants = {
    primary: { background: `oklch(0.88 0.005 ${t.hue})`, color: t.pageBg, ...btnBorder('primary'), boxShadow: raised },
    accent: { background: t.accentSolid, color: t.accentOnSolid, ...btnBorder('accent'), boxShadow: raised },
    secondary: { background: dark ? `oklch(0.12 0.004 ${t.hue})` : t.surfaceBg, color: t.fg1, ...btnBorder('secondary'), boxShadow: raisedSec },
    ghost: { background: t.subtleBg, color: t.fg2, border: 'none', boxShadow: 'none' },
    link: { background: 'none', color: t.accentText, border: 'none', textDecoration: 'underline', textUnderlineOffset: '2px', padding: '7px 4px', boxShadow: 'none' },
  };
  const s = { ...sizes[size], ...variants[variant] };
  return (
    <button style={{
      fontFamily: t.font, fontWeight: 500, borderRadius: t.radius, cursor: 'pointer',
      letterSpacing: '-0.01em', lineHeight: 1, display: 'inline-flex', alignItems: 'center', gap: 6,
      transition: 'all 150ms ease-out',
      ...s,
    }} {...props}>{children}</button>
  );
}

/* ── Input ── */
function Input({ label, placeholder, theme, type = 'text', ...props }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: t.fg2, fontFamily: t.font }}>{label}</label>}
      <input type={type} placeholder={placeholder} style={{
        fontFamily: t.font, fontSize: 13, padding: '8px 10px', borderRadius: t.radius,
        border: `1px solid ${t.borderSoft}`, background: t.surfaceBg, color: t.fg1,
        outline: 'none', lineHeight: 1.4,
      }} {...props} />
    </div>
  );
}

/* ── Select ── */
function Select({ label, options = [], theme }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: t.fg2, fontFamily: t.font }}>{label}</label>}
      <select style={{
        fontFamily: t.font, fontSize: 13, padding: '8px 14px', paddingRight: 28, borderRadius: t.radius,
        border: `1px solid ${t.borderSoft}`, background: t.surfaceBg, color: t.fg1,
        outline: 'none', appearance: 'auto',
      }}>
        {options.map((o, i) => <option key={i}>{o}</option>)}
      </select>
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ checked, onChange, theme }) {
  const t = theme;
  return (
    <div onClick={() => onChange && onChange(!checked)} style={{
      width: 32, height: 18, borderRadius: 9, cursor: 'pointer',
      background: checked ? t.accentSolid : t.subtleBg,
      border: `1px solid ${checked ? t.accentSolid : t.border}`,
      position: 'relative', transition: 'background 150ms',
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: 7,
        background: checked ? t.accentOnSolid : t.fg3,
        position: 'absolute', top: 1, left: checked ? 15 : 1,
        transition: 'left 150ms', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

/* ── Badge ── */
function Badge({ children, variant = 'default', theme }) {
  const t = theme;
  const variants = {
    default: { background: t.subtleBg, color: t.fg2, border: t.border },
    accent: { background: t.accentSubtle, color: t.accentSolid, border: 'transparent' },
  };
  const v = variants[variant];
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: t.radius,
      background: v.background, color: v.color, border: `1px solid ${v.border}`,
      fontFamily: t.font, display: 'inline-block',
    }}>{children}</span>
  );
}

/* ── Shared card-style border helper ── */
function cardBorderStyle(t) {
  const dark = t.mode === 'dark';
  const borderColor = dark ? `oklch(0.26 0.006 ${t.hue})` : t.accent[4];
  return {
    background: dark ? `oklch(0.21 0.006 ${t.hue})` : t.surfaceBg,
    border: `1px solid ${borderColor}`,
    borderTopWidth: '1.2px', borderLeftWidth: '1.5px',
    borderRightWidth: 1, borderBottomWidth: 1,
    borderStyle: 'solid',
    borderTopColor: dark ? `oklch(0.25 0.006 ${t.hue})` : borderColor,
    borderLeftColor: dark ? `oklch(0.25 0.006 ${t.hue})` : borderColor,
    borderRightColor: dark ? `oklch(0.22 0.004 ${t.hue})` : borderColor,
    borderBottomColor: dark ? `oklch(0.22 0.004 ${t.hue})` : borderColor,
    boxShadow: dark
      ? `0 2px 6px oklch(0.15 0.06 ${t.hue} / 0.6), 0 1px 2px oklch(0.12 0.04 ${t.hue} / 0.4), inset 0 1px 0 rgba(255,255,255,0.04)`
      : '0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)',
  };
}

/* ── Glass card style helper ── */
function glassStyle(t, { radius } = {}) {
  const H = t.hue;
  return {
    backgroundImage: `linear-gradient(155deg, oklch(0.42 0.13 ${H} / 0.4), oklch(0.26 0.05 ${H} / 0.3))`,
    backdropFilter: 'blur(16px) saturate(135%)',
    WebkitBackdropFilter: 'blur(16px) saturate(135%)',
    border: `1px solid oklch(0.7 0.16 ${H} / 0.4)`,
    borderTopColor: `oklch(0.85 0.16 ${H} / 0.6)`,
    borderRadius: radius ?? t.radiusLg,
    boxShadow: `0 8px 22px oklch(0.4 0.18 ${H} / 0.3), inset 0 1px 0 rgba(255,255,255,0.12)`,
  };
}

/* ── Glass Card ── */
function GlassCard({ children, theme, padding = 16, radius, style = {}, ...props }) {
  const t = theme;
  return (
    <div style={{
      position: 'relative',
      padding,
      fontFamily: t.font,
      ...glassStyle(t, { radius }),
      ...style,
    }} {...props}>{children}</div>
  );
}

/* ── Card ── */
function Card({ children, theme, padding = 16, raised, style = {}, ...props }) {
  const t = theme;
  return (
    <div style={{
      position: 'relative',
      borderRadius: t.radiusLg, padding,
      fontFamily: t.font,
      ...cardBorderStyle(t),
      ...style,
    }} {...props}>{children}</div>
  );
}

/* ── Divider ── */
function Divider({ theme }) {
  return <div style={{ height: 1, background: theme.border }} />;
}

/* ── ListItem ── */
function ListItem({ children, active, theme, onClick }) {
  const t = theme;
  return (
    <div onClick={onClick} style={{
      padding: '8px 10px', borderRadius: 0, cursor: onClick ? 'pointer' : 'default',
      background: 'transparent',
      color: active ? t.fg1 : `oklch(0.80 0.005 ${t.hue})`,
      fontWeight: active ? 500 : 400, fontSize: 13, fontFamily: t.font,
      display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: active ? `2px solid ${t.accentSolid}` : '2px solid transparent',
      paddingBottom: 6,
    }}>{children}</div>
  );
}

/* ── Tabs ── */
function Tabs({ items, active, onChange, theme }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${t.border}` }}>
      {items.map((item, i) => (
        <div key={i} onClick={() => onChange && onChange(i)} style={{
          padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontFamily: t.font,
          color: i === active ? t.fg1 : t.fg3,
          fontWeight: i === active ? 500 : 400,
          borderBottom: i === active ? `2px solid ${t.accentSolid}` : '2px solid transparent',
          marginBottom: -1,
        }}>{item}</div>
      ))}
    </div>
  );
}

/* ── Segmented Control ── */
function Segmented({ items, active, onChange, theme }) {
  const t = theme;
  const cbs = cardBorderStyle(t);
  return (
    <div style={{
      display: 'inline-flex', borderRadius: t.radius, padding: 2,
      ...cbs,
    }}>
      {items.map((item, i) => (
        <div key={i} onClick={() => onChange && onChange(i)} style={{
          padding: '4px 12px', fontSize: 12, borderRadius: 2, cursor: 'pointer',
          background: i === active ? t.accentSolid : 'transparent',
          color: i === active ? t.accentOnSolid : t.fg3,
          fontWeight: i === active ? 500 : 400, fontFamily: t.font,
        }}>{item}</div>
      ))}
    </div>
  );
}

/* ── Avatar ── */
function Avatar({ initials, size = 28, theme }) {
  const t = theme;
  return (
    <div style={{
      width: size, height: size, borderRadius: t.radius, background: t.accentSubtle,
      color: t.accentText, fontSize: size * 0.4, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.font,
    }}>{initials}</div>
  );
}

/* ── Dot indicator ── */
function Dot({ active, theme }) {
  return (
    <div style={{
      width: 6, height: 6, borderRadius: 2,
      background: active ? t.accentSolid : theme.fg3,
    }} />
  );
}

/* ── Stat card ── */
function Stat({ label, value, sub, theme }) {
  const t = theme;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, color: t.fg3, marginBottom: 4, fontFamily: t.font }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, fontFamily: t.font, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: t.accentText, fontWeight: 500, marginTop: 2, fontFamily: t.font }}>{sub}</div>}
    </div>
  );
}

/* ── Modal / Dialog ── */
function Modal({ title, children, theme, onClose }) {
  const t = theme;
  const dark = t.mode === 'dark';
  const cbs = cardBorderStyle(t);
  return (
    <div style={{
      position: 'relative', width: 360,
      borderRadius: t.radiusLg,
      fontFamily: t.font, overflow: 'hidden',
      ...cbs,
      boxShadow: dark
        ? `0 16px 48px rgba(0,0,0,0.5), 0 2px 6px oklch(0.15 0.06 ${t.hue} / 0.6), inset 0 1px 0 rgba(255,255,255,0.04)`
        : '0 16px 48px rgba(0,0,0,0.12)',
    }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${dark ? `oklch(0.24 0.006 ${t.hue})` : t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: t.fg1 }}>{title}</span>
        <span onClick={onClose} style={{ fontSize: 16, color: t.fg3, cursor: 'pointer', lineHeight: 1 }}>×</span>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

/* ── Table ── */
function Table({ columns, rows, theme }) {
  const t = theme;
  const dark = t.mode === 'dark';
  const cbs = cardBorderStyle(t);
  return (
    <div style={{ ...cbs, borderRadius: t.radiusLg, overflow: 'hidden', fontFamily: t.font }}>
      <div style={{ display: 'flex', background: 'transparent', borderBottom: `1px solid ${dark ? `oklch(0.24 0.006 ${t.hue})` : t.border}` }}>
        {columns.map((col, i) => (
          <div key={i} style={{ flex: col.flex || 1, padding: '8px 12px', fontSize: 11, fontWeight: 600, color: t.accentSolid, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{col.label}</div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', borderBottom: ri < rows.length - 1 ? `1px solid ${dark ? `oklch(0.22 0.005 ${t.hue})` : t.border}` : 'none' }}>
          {row.map((cell, ci) => (
            <div key={ci} style={{ flex: columns[ci]?.flex || 1, padding: '8px 12px', fontSize: 12, color: ci === 0 ? t.fg1 : t.fg2, fontWeight: ci === 0 ? 500 : 400 }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  Button, Input, Select, Toggle, Badge, Card, GlassCard, glassStyle, Divider, ListItem,
  Tabs, Segmented, Avatar, Dot, Stat, Modal, Table,
});

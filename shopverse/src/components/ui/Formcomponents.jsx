// src/components/ui/FormComponents.jsx
import { useState } from "react";
import { useTheme } from "../../hooks/app.hooks";

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────
export function InputField({ label, ...props }) {
  const t = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <div>
      {label && <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</label>}
      <input
        {...props}
        onFocus={e => { setFocus(true);  props.onFocus && props.onFocus(e); }}
        onBlur={e  => { setFocus(false); props.onBlur  && props.onBlur(e);  }}
        style={{ padding:"10px 14px", borderRadius:9, border:`1px solid ${focus ? t.gold : t.border}`, fontSize:14, width:"100%", background:t.bgSurface, color:t.textPrimary, boxShadow:focus ? `0 0 0 3px ${t.goldBg}` : "none", transition:"all 0.2s", letterSpacing:"0.01em", ...(props.style||{}) }}
      />
    </div>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export function Btn({ children, variant = "primary", fullWidth, size = "md", onClick, disabled, style: ex }) {
  const t = useTheme();
  const V = {
    primary: { background:"linear-gradient(135deg,#C9A84C,#A07830)", color:"#1A1410", border:"none", boxShadow:"0 4px 16px rgba(160,120,48,0.35)" },
    danger:  { background:t.dangerBg,  color:t.danger,         border:`1px solid ${t.danger}30`  },
    success: { background:t.successBg, color:t.success,        border:`1px solid ${t.success}30` },
    outline: { background:"transparent", color:t.gold,         border:`1px solid ${t.gold}`       },
    ghost:   { background:"transparent", color:t.textSecondary, border:`1px solid ${t.border}`    },
    muted:   { background:t.bgMuted,   color:t.textPrimary,    border:`1px solid ${t.border}`    },
  };
  const S = { sm:{padding:"6px 12px",fontSize:12}, md:{padding:"9px 18px",fontSize:13}, lg:{padding:"13px 24px",fontSize:15} };
  const v = V[variant] || V.primary;
  const s = S[size] || S.md;
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...v, ...s, borderRadius:9, fontWeight:500, letterSpacing:"0.03em", width:fullWidth?"100%":"auto", opacity:disabled?0.45:1, ...(ex||{}) }}>
      {children}
    </button>
  );
}

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label, desc }) {
  const t = useTheme();
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:`1px solid ${t.border}` }}>
      <div>
        <div style={{ fontSize:13, color:t.textPrimary }}>{label}</div>
        {desc && <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{desc}</div>}
      </div>
      <div onClick={() => onChange(!checked)} style={{ width:44, height:24, borderRadius:12, background:checked?`linear-gradient(135deg,${t.gold},${t.goldDark})`:t.bgMuted, cursor:"pointer", position:"relative", transition:"background 0.25s", border:`1px solid ${checked?t.gold:t.border}`, flexShrink:0 }}>
        <div style={{ position:"absolute", top:3, left:checked?22:3, width:16, height:16, borderRadius:"50%", background:checked?"#1A1410":"#fff", transition:"left 0.22s" }} />
      </div>
    </div>
  );
}

// ─── STAR RATING (display) ────────────────────────────────────────────────────
export function StarRating({ rating, size = 13 }) {
  return (
    <span style={{ fontSize:size, letterSpacing:2 }}>
      {[1,2,3,4,5].map(s => <span key={s} style={{ color:s<=Math.round(rating)?"#C9A84C":"#D4C9B0" }}>★</span>)}
    </span>
  );
}

// ─── STAR PICKER (interactive, for review form) ───────────────────────────────
export function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onChange(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} style={{ fontSize:28, cursor:"pointer", color:s<=(hovered||value)?"#C9A84C":"#D4C9B0", transition:"color 0.1s" }}>★</span>
      ))}
    </div>
  );
}
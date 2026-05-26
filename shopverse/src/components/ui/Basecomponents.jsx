// src/components/ui/BaseComponents.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../../hooks/app.hooks.jsx";
import { getInitials } from "../../utils/Helpers.jsx";

// ─── TOAST ────────────────────────────────────────────────────────────────────
export function Toast({ message, type = "info", onClose }) {
  const t = useTheme();
  const cfg = {
    success: { bg: t.successBg, col: t.success,  ic: "✦" },
    error:   { bg: t.dangerBg,  col: t.danger,   ic: "✕" },
    info:    { bg: t.infoBg,    col: t.info,      ic: "◆" },
    warning: { bg: t.warningBg, col: t.warning,   ic: "◈" },
  };
  const c = cfg[type] || cfg.info;
  useEffect(() => { const id = setTimeout(onClose, 3500); return () => clearTimeout(id); }, [onClose]);
  return (
    <div style={{ position:"fixed", top:76, right:20, zIndex:9999, background:t.bgCard, borderRadius:10, padding:"12px 16px", border:`1px solid ${c.col}30`, boxShadow:`0 8px 32px rgba(0,0,0,0.18)`, display:"flex", alignItems:"center", gap:10, minWidth:260, animation:"slideIn 0.25s ease" }}>
      <span style={{ color:c.col, fontSize:13, fontWeight:700 }}>{c.ic}</span>
      <span style={{ fontSize:13, color:t.textPrimary, flex:1 }}>{message}</span>
      <button onClick={onClose} style={{ background:"none", border:"none", color:t.textMuted, fontSize:16, padding:0 }}>×</button>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ title, children, onClose, width = 480 }) {
  const t = useTheme();
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}>
      <div style={{ background:t.bgCard, borderRadius:16, padding:28, width:"100%", maxWidth:width, maxHeight:"92vh", overflowY:"auto", boxShadow:`0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px ${t.border}`, animation:"fadeUp 0.25s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, paddingBottom:16, borderBottom:`1px solid ${t.border}` }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:t.textPrimary, letterSpacing:"0.02em" }}>{title}</h3>
          <button onClick={onClose} style={{ background:t.bgMuted, border:`1px solid ${t.border}`, borderRadius:8, width:32, height:32, color:t.textSecondary, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── COLLAPSIBLE ──────────────────────────────────────────────────────────────
export function Collapsible({ title, children, defaultOpen = false, icon }) {
  const [open, setOpen] = useState(defaultOpen);
  const t = useTheme();
  return (
    <div style={{ border:`1px solid ${t.border}`, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", padding:"13px 16px", background:open ? t.goldBg : t.bgCard, border:"none", display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:14, color:open ? t.textGold : t.textPrimary, transition:"all 0.2s" }}>
        <span style={{ display:"flex", alignItems:"center", gap:9 }}>{icon && <span style={{ fontSize:13 }}>{icon}</span>}{title}</span>
        <span style={{ color:t.gold, fontSize:11, transform:`rotate(${open?180:0}deg)`, transition:"transform 0.25s", display:"inline-block" }}>▾</span>
      </button>
      {open && <div style={{ padding:"14px 16px", background:t.bgSurface, borderTop:`1px solid ${t.border}` }}>{children}</div>}
    </div>
  );
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 36, gradient = false }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:gradient ? "linear-gradient(135deg,#C9A84C,#A07830)" : "linear-gradient(135deg,#2A1F3D,#1C1420)", color:"#F0D690", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600, fontSize:size*0.34, flexShrink:0, border:"1.5px solid rgba(201,168,76,0.3)", letterSpacing:"0.05em" }}>
      {getInitials(name)}
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "default" }) {
  const t = useTheme();
  const map = { green:{bg:t.successBg,col:t.success}, red:{bg:t.dangerBg,col:t.danger}, amber:{bg:t.warningBg,col:t.warning}, blue:{bg:t.infoBg,col:t.info}, gold:{bg:t.goldBg,col:t.gold}, default:{bg:t.bgMuted,col:t.textSecondary} };
  const c = map[variant] || map.default;
  return <span style={{ padding:"3px 9px", borderRadius:99, fontSize:10, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", background:c.bg, color:c.col }}>{children}</span>;
}

// ─── GOLD DIVIDER ─────────────────────────────────────────────────────────────
export function GoldDivider() {
  return <div style={{ height:1, background:"linear-gradient(90deg,transparent,#C9A84C40,#C9A84C80,#C9A84C40,transparent)", margin:"4px 0" }} />;
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, color }) {
  const t = useTheme();
  return (
    <div style={{ background:t.bgMuted, borderRadius:99, height:5, overflow:"hidden" }}>
      <div style={{ width:`${Math.min(100, max>0 ? (value/max)*100 : 0)}%`, height:"100%", background:color||t.gold, borderRadius:99, transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}
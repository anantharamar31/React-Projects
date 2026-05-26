// src/components/layout/TopNav.jsx
import { useState }            from "react";
import { useStore, ACTIONS }   from "../../store/store";
import { useTheme }             from "../../hooks/app.hooks";
import { Avatar }               from "../ui/BaseComponents";

export default function TopNav({ activeView }) {
  const { state, dispatch } = useStore();
  const t        = useTheme();
  const { user } = state.auth;
  const isSeller = user?.role === "seller";
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const unread    = state.notifications.filter(n => !n.read).length;
  const isDark    = state.ui.theme === "dark";
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div style={{ background:t.navBg, borderBottom:`1px solid ${t.navBorder}`, padding:"0 24px", height:60, display:"flex", alignItems:"center", gap:14, position:"sticky", top:0, zIndex:100, transition:"background 0.3s" }}>

      {/* Sidebar toggle */}
      <button onClick={() => dispatch({ type:ACTIONS.TOGGLE_SIDEBAR })} style={{ background:t.bgMuted, border:`1px solid ${t.border}`, borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:t.gold, fontSize:14 }}>☰</button>

      {/* Page title */}
      <div style={{ flex:1 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:t.textPrimary, textTransform:"capitalize", letterSpacing:"0.02em" }}>
          {activeView.replace(/-/g," ")}
        </h2>
      </div>

      {/* Search — customer only */}
      {!isSeller && (
        <div style={{ position:"relative", maxWidth:260 }}>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:t.textMuted, fontSize:12 }}>✦</span>
          <input placeholder="Search products…" value={state.ui.searchQuery} onChange={e => dispatch({ type:ACTIONS.SET_SEARCH, payload:e.target.value })} onFocus={e => e.target.style.borderColor=t.gold} onBlur={e => e.target.style.borderColor=t.border}
            style={{ padding:"8px 12px 8px 30px", borderRadius:9, border:`1px solid ${t.border}`, fontSize:13, background:t.bgMuted, color:t.textPrimary, width:220, fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }} />
        </div>
      )}

      {/* Theme toggle */}
      <button onClick={() => dispatch({ type:ACTIONS.SET_THEME, payload:isDark?"light":"dark" })} style={{ background:t.goldBg, border:`1px solid ${t.gold}30`, borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:t.gold }}>
        {isDark?"☀":"☽"}
      </button>

      {/* Notifications */}
      <div style={{ position:"relative" }}>
        <button onClick={() => setShowNotifs(!showNotifs)} style={{ background:t.bgMuted, border:`1px solid ${t.border}`, borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:t.textSecondary, position:"relative" }}>
          ◆
          {unread>0 && <span style={{ position:"absolute", top:5, right:5, width:12, height:12, background:t.gold, borderRadius:99, fontSize:8, color:"#1A1410", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{unread}</span>}
        </button>

        {showNotifs && (
          <div style={{ position:"absolute", right:0, top:46, background:t.bgCard, borderRadius:14, border:`1px solid ${t.border}`, boxShadow:"0 16px 48px rgba(0,0,0,0.2)", width:300, zIndex:200, overflow:"hidden", animation:"fadeUp 0.2s ease" }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:t.textPrimary }}>Notifications</div>
            {state.notifications.map(n => (
              <div key={n.id} onClick={() => { dispatch({ type:ACTIONS.MARK_NOTIFICATION_READ, payload:n.id }); setShowNotifs(false); }} style={{ padding:"10px 16px", borderBottom:`1px solid ${t.border}`, cursor:"pointer", background:n.read?t.bgCard:t.goldBg, display:"flex", gap:10, transition:"background 0.15s" }}>
                <span style={{ fontSize:12 }}>{n.type==="success"?"✦":n.type==="warning"?"◈":"◆"}</span>
                <div>
                  <div style={{ fontSize:12, color:t.textPrimary, lineHeight:1.5 }}>{n.message}</div>
                  <div style={{ fontSize:10, color:t.textMuted, marginTop:2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart — customer only */}
      {!isSeller && (
        <button onClick={() => dispatch({ type:ACTIONS.TOGGLE_CART })} style={{ background:"linear-gradient(135deg,#C9A84C,#A07830)", border:"none", borderRadius:9, padding:"8px 14px", fontSize:13, color:"#1A1410", fontWeight:600, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 14px rgba(160,120,48,0.3)" }}>
          ✦ Cart
          {cartCount>0 && <span style={{ background:"rgba(26,20,16,0.2)", borderRadius:99, width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{cartCount}</span>}
        </button>
      )}

      <Avatar name={user?.name} size={34} gradient />
    </div>
  );
}
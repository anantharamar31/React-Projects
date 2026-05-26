// src/pages/seller/SellerOrders.jsx
import { useState }            from "react";
import { useStore, ACTIONS }   from "../../store/store.jsx";
import { useTheme, useToast }  from "../../hooks/app.hooks.jsx";
import { Toast, Badge }        from "../../components/ui/BaseComponents.jsx";
import { Btn }                 from "../../components/ui/Formcomponents.jsx";

const FLOW         = ["pending","processing","shipped","delivered"];
const STATUS_COLOR = { pending:"gold", processing:"blue", shipped:"amber", delivered:"green", cancelled:"red" };

export default function SellerOrders() {
  const { state, dispatch }    = useStore();
  const t                      = useTheme();
  const { toast, showToast, clearToast } = useToast();
  const { user }               = state.auth;
  const [statusFilter, setStatusFilter] = useState("all");

  const myOrders = state.orders.filter(o => o.sellerId === user?.id);
  const filtered = myOrders.filter(o => statusFilter==="all" || o.status===statusFilter);

  return (
    <div className="fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary }}>Orders</h2>
        <div style={{ display:"flex", gap:6 }}>
          {["all","pending","processing","shipped","delivered"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding:"6px 12px", borderRadius:7, border:`1px solid ${statusFilter===s?t.gold:t.border}`, fontSize:11, fontWeight:500, background:statusFilter===s?t.goldBg:"transparent", color:statusFilter===s?t.gold:t.textMuted, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.04em", textTransform:"capitalize" }}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.map(order => {
        const step = FLOW.indexOf(order.status);
        return (
          <div key={order.id} style={{ background:t.bgCard, borderRadius:14, padding:20, border:`1px solid ${t.border}`, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:t.textPrimary, letterSpacing:"0.05em" }}>{order.id}</span>
                <Badge variant={STATUS_COLOR[order.status]||"default"}>{order.status}</Badge>
              </div>
              <span style={{ fontSize:12, color:t.textMuted }}>{order.date} · {order.address}</span>
            </div>

            {/* Status pipeline */}
            <div style={{ display:"flex", marginBottom:16, overflowX:"auto", paddingBottom:2 }}>
              {FLOW.map((s,i) => (
                <div key={s} style={{ display:"flex", alignItems:"center", flex:i<FLOW.length-1?1:0 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:i<=step?"linear-gradient(135deg,#C9A84C,#A07830)":t.bgMuted, border:`1px solid ${i<=step?t.gold:t.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:i<=step?"#1A1410":t.textMuted, fontWeight:700, flexShrink:0 }}>
                      {i<step?"✓":i+1}
                    </div>
                    <span style={{ fontSize:9, color:i<=step?t.gold:t.textMuted, textTransform:"capitalize", whiteSpace:"nowrap", letterSpacing:"0.04em", fontWeight:i===step?600:400 }}>{s}</span>
                  </div>
                  {i<FLOW.length-1 && <div style={{ flex:1, height:1, background:i<step?t.gold:t.border, margin:"0 4px", marginBottom:14 }} />}
                </div>
              ))}
            </div>

            {/* Order items */}
            <div style={{ background:t.bgMuted, borderRadius:10, padding:12, marginBottom:14 }}>
              {order.items.map(item => {
                const prod = state.products.find(p => p.id===item.productId);
                return (
                  <div key={item.productId} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:6, background:t.bgCard, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
                        {prod?.image ? <img src={prod.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:18 }}>{prod?.imageEmoji||"📦"}</span>}
                      </div>
                      <div>
                        <div style={{ fontSize:13, color:t.textPrimary }}>{prod?.name||"Product"}</div>
                        <div style={{ fontSize:11, color:t.textMuted }}>Qty: {item.qty}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:13, fontWeight:600, color:t.gold }}>${item.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:t.gold }}>Total: ${order.total.toFixed(2)}</span>
              {!["delivered","cancelled"].includes(order.status) && (
                <div style={{ display:"flex", gap:8 }}>
                  {step<FLOW.length-1 && <Btn size="sm" onClick={() => { dispatch({ type:ACTIONS.UPDATE_ORDER_STATUS, payload:{id:order.id,status:FLOW[step+1]} }); showToast(`Marked as ${FLOW[step+1]}`); }}>Mark as {FLOW[step+1]}</Btn>}
                  <Btn variant="danger" size="sm" onClick={() => dispatch({ type:ACTIONS.UPDATE_ORDER_STATUS, payload:{id:order.id,status:"cancelled"} })}>Cancel</Btn>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
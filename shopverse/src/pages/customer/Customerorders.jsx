// src/pages/customer/CustomerOrders.jsx
import { useStore }  from "../../store/store.jsx";
import { useTheme }   from "../../hooks/app.hooks.jsx";
import { Badge }      from "../../components/ui/BaseComponents.jsx";
import { Btn }        from "../../components/ui/Formcomponents.jsx";

const FLOW         = ["pending","processing","shipped","delivered"];
const STATUS_COLOR = { pending:"gold", processing:"blue", shipped:"amber", delivered:"green", cancelled:"red" };

export default function CustomerOrders() {
  const { state } = useStore();
  const t         = useTheme();
  const { user }  = state.auth;
  const myOrders  = state.orders.filter(o => o.customerId===user?.id);

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary, marginBottom:22 }}>My Orders</h2>

      {myOrders.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 0" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:60, color:t.border, marginBottom:12 }}>◆</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:t.textMuted }}>No orders yet</p>
        </div>
      ) : myOrders.map(order => {
        const step = FLOW.indexOf(order.status);
        return (
          <div key={order.id} style={{ background:t.bgCard, borderRadius:14, padding:20, border:`1px solid ${t.border}`, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:t.textPrimary, letterSpacing:"0.05em" }}>{order.id}</span>
                <Badge variant={STATUS_COLOR[order.status]||"default"}>{order.status}</Badge>
              </div>
              <span style={{ fontSize:12, color:t.textMuted }}>Ordered {order.date}</span>
            </div>

            {/* Pipeline */}
            <div style={{ display:"flex", marginBottom:14, overflowX:"auto" }}>
              {FLOW.map((s,i) => (
                <div key={s} style={{ display:"flex", alignItems:"center", flex:i<FLOW.length-1?1:0 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ width:24,height:24,borderRadius:"50%",background:i<=step?"linear-gradient(135deg,#C9A84C,#A07830)":t.bgMuted,border:`1px solid ${i<=step?t.gold:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:i<=step?"#1A1410":t.textMuted,margin:"0 auto",fontWeight:700 }}>
                      {i<step?"✓":i+1}
                    </div>
                    <div style={{ fontSize:9,color:i<=step?t.gold:t.textMuted,marginTop:3,textTransform:"capitalize",whiteSpace:"nowrap",letterSpacing:"0.04em" }}>{s}</div>
                  </div>
                  {i<FLOW.length-1 && <div style={{ flex:1,height:1,background:i<step?t.gold:t.border,margin:"0 3px",marginBottom:14 }} />}
                </div>
              ))}
            </div>

            <div style={{ background:t.bgMuted, borderRadius:10, padding:10, display:"flex", flexWrap:"wrap", gap:10, marginBottom:12 }}>
              {order.items.map(item => {
                const p = state.products.find(p=>p.id===item.productId);
                return <span key={item.productId} style={{ fontSize:12,color:t.textSecondary,display:"flex",alignItems:"center",gap:5 }}>{p?.imageEmoji||"📦"} {p?.name} ×{item.qty}</span>;
              })}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:t.gold }}>$ {order.total.toFixed(2)}</span>
              {order.status==="delivered" && <Btn variant="outline" size="sm">★ Leave Review</Btn>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
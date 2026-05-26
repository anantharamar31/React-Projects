// src/pages/seller/SellerCustomers.jsx
import { useStore }  from "../../store/store";
import { useTheme }   from "../../hooks/app.hooks";

const NAMES = ["Jamie Chen","Taylor Kim","Morgan Lee","Casey Park"];
const GRADS = [
  "linear-gradient(135deg,#C9A84C,#A07830)",
  "linear-gradient(135deg,#4ABA7C,#2A7A4B)",
  "linear-gradient(135deg,#5A9FD4,#1E4E82)",
  "linear-gradient(135deg,#D4A030,#8A6010)",
];

export default function SellerCustomers() {
  const { state } = useStore();
  const t         = useTheme();
  const { user }  = state.auth;
  const myOrders  = state.orders.filter(o => o.sellerId === user?.id);
  const uniqueCids = [...new Set(myOrders.map(o => o.customerId))];

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary, marginBottom:22 }}>Customers</h2>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {uniqueCids.map((cid, i) => {
          const cOrders = myOrders.filter(o => o.customerId===cid);
          const spent   = cOrders.reduce((s,o) => s+o.total, 0);
          const name    = NAMES[i % NAMES.length];
          const initials = name.split(" ").map(w=>w[0]).join("");

          return (
            <div key={cid} style={{ background:t.bgCard, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${t.border}` }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:GRADS[i%4], display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600, fontSize:14, color:"#fff", letterSpacing:"0.05em" }}>{initials}</div>
                <div>
                  <div style={{ fontWeight:500, fontSize:14, color:t.textPrimary }}>{name}</div>
                  <div style={{ fontSize:11, color:t.textMuted, marginTop:1 }}>ID: {cid}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ background:t.bgMuted, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:t.textPrimary }}>{cOrders.length}</div>
                  <div style={{ fontSize:10, color:t.textMuted, marginTop:2, letterSpacing:"0.04em" }}>ORDERS</div>
                </div>
                <div style={{ background:t.goldBg, borderRadius:10, padding:"12px 14px", border:`1px solid ${t.gold}20` }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:t.gold }}>${spent.toFixed(0)}</div>
                  <div style={{ fontSize:10, color:t.goldDark, marginTop:2, letterSpacing:"0.04em" }}>TOTAL SPENT</div>
                </div>
              </div>
              <div style={{ marginTop:10, fontSize:11, color:t.textMuted }}>Last order: {cOrders[cOrders.length-1]?.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
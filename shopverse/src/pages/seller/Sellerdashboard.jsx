// src/pages/seller/SellerDashboard.jsx
import { useStore }     from "../../store/store";
import { useTheme }     from "../../hooks/app.hooks";
import { Badge, ProgressBar } from "../../components/ui/BaseComponents";

export default function SellerDashboard() {
  const { state } = useStore();
  const t = useTheme();
  const { user }    = state.auth;
  const myProducts  = state.products.filter(p => p.sellerId === user?.id);
  const myOrders    = state.orders.filter(o => o.sellerId === user?.id);
  const revenue     = myOrders.filter(o => o.status==="delivered").reduce((s,o) => s+o.total, 0);
  const pending     = myOrders.filter(o => ["pending","processing"].includes(o.status)).length;
  const avgRat      = myProducts.length ? (myProducts.reduce((s,p) => s+(p.rating||0), 0)/myProducts.length).toFixed(1) : "—";

  const stats = [
    { label:"Total Revenue",    value:`$${revenue.toLocaleString()}`, sub:"+12.5% this month", icon:"◈", col:t.gold,    bg:t.goldBg    },
    { label:"Orders",           value:myOrders.length,               sub:`${pending} pending`, icon:"◆", col:t.info,    bg:t.infoBg    },
    { label:"Active Products",  value:myProducts.filter(p=>p.status==="active").length, sub:"live listings", icon:"✦", col:t.success, bg:t.successBg },
    { label:"Store Rating",     value:`${avgRat}★`,                  sub:"avg product score",  icon:"★", col:"#C9A84C", bg:t.goldBg    },
    { label:"Customers",        value:[...new Set(myOrders.map(o=>o.customerId))].length, sub:"unique buyers", icon:"○", col:t.warning,bg:t.warningBg },
    { label:"Pending Orders",   value:pending,                       sub:"need your action",   icon:"◇", col:t.danger,  bg:t.dangerBg  },
  ];

  const statusBadge = { delivered:"green", shipped:"blue", processing:"amber", pending:"gold", cancelled:"red" };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:400, color:t.textPrimary, marginBottom:4 }}>
          Good day, <em style={{ color:t.gold }}>{user?.name?.split(" ")[0]}</em>
        </h2>
        <p style={{ color:t.textMuted, fontSize:13 }}>{user?.storeName} · {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
      </div>

      {/* Stat grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:t.bgCard, borderRadius:14, padding:"18px 16px", border:`1px solid ${t.border}`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-10, right:-10, width:60, height:60, borderRadius:"50%", background:s.bg, opacity:0.5 }} />
            <div style={{ width:32, height:32, borderRadius:8, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:s.col, marginBottom:12 }}>{s.icon}</div>
            <div style={{ fontSize:24, fontWeight:600, color:s.col, letterSpacing:"-0.02em", marginBottom:2 }}>{s.value}</div>
            <div style={{ fontSize:12, color:t.textMuted }}>{s.label}</div>
            <div style={{ fontSize:10, color:t.textMuted, marginTop:3, opacity:0.7 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:16, marginBottom:16 }}>
        {/* Category bars */}
        <div style={{ background:t.bgCard, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, color:t.textPrimary, marginBottom:16 }}>Sales by Category</h3>
          {["Electronics","Clothing","Sports","Accessories","Home"].map((cat,i) => {
            const rev = myProducts.filter(p=>p.category===cat).reduce((s,p)=>s+p.sold*p.price,0);
            return (
              <div key={cat} style={{ marginBottom:13 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, color:t.textSecondary }}>{cat}</span>
                  <span style={{ fontSize:12, color:t.gold, fontWeight:500 }}>${rev.toLocaleString()}</span>
                </div>
                <ProgressBar value={rev} max={50000} color={[t.gold,"#4ABA7C","#5A9FD4","#D4A030","#E06055"][i]} />
              </div>
            );
          })}
        </div>

        {/* Recent orders */}
        <div style={{ background:t.bgCard, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, color:t.textPrimary, marginBottom:16 }}>Recent Orders</h3>
          {myOrders.slice(0,4).map(o => (
            <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${t.border}` }}>
              <div>
                <div style={{ fontSize:12, fontWeight:500, color:t.textPrimary }}>{o.id}</div>
                <div style={{ fontSize:10, color:t.textMuted, marginTop:2 }}>{o.date}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:600, color:t.gold }}>${o.total}</div>
                <Badge variant={statusBadge[o.status]||"default"}>{o.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div style={{ background:t.bgCard, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, color:t.textPrimary, marginBottom:16 }}>Top Performing Products</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
          {[...myProducts].sort((a,b)=>b.sold-a.sold).slice(0,4).map(p => (
            <div key={p.id} style={{ background:t.bgMuted, borderRadius:12, padding:14, border:`1px solid ${t.border}` }}>
              <div style={{ width:"100%", height:80, borderRadius:8, background:t.bgCard, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10, overflow:"hidden" }}>
                {p.image ? <img src={p.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:36 }}>{p.imageEmoji||"📦"}</span>}
              </div>
              <div style={{ fontSize:13, fontWeight:500, color:t.textPrimary, marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:11, color:t.textMuted, marginBottom:8 }}>{p.sold} sold · <span style={{ color:t.gold }}>${p.price}</span></div>
              <ProgressBar value={p.stock} max={200} />
              <div style={{ fontSize:10, color:t.textMuted, marginTop:4 }}>{p.stock} in stock</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// src/pages/seller/SellerAnalytics.jsx
import { useStore }         from "../../store/store.jsx";
import { useTheme }          from "../../hooks/app.hooks.jsx";
import { Collapsible, ProgressBar } from "../../components/ui/BaseComponents.jsx";
import { StarRating }        from "../../components/ui/Formcomponents.jsx";

export default function SellerAnalytics() {
  const { state } = useStore();
  const t         = useTheme();
  const { user }  = state.auth;
  const myP = state.products.filter(p => p.sellerId === user?.id);
  const myO = state.orders.filter(o => o.sellerId === user?.id);
  const rev = myO.filter(o => o.status==="delivered").reduce((s,o) => s+o.total, 0);
  const avgOrder = myO.length ? (myO.reduce((s,o)=>s+o.total,0)/myO.length).toFixed(2) : 0;

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary, marginBottom:22 }}>Analytics & Insights</h2>

      {/* KPI cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:20 }}>
        {[
          { label:"Total Revenue",   value:`$${rev.toLocaleString()}`, change:"+12.5%", up:true  },
          { label:"Conversion Rate", value:"12.0%",                    change:"+2.1%",  up:true  },
          { label:"Avg Order Value", value:`$${avgOrder}`,             change:"+5.3%",  up:true  },
          { label:"Return Rate",     value:"3.2%",                     change:"-0.8%",  up:true  },
        ].map(s => (
          <div key={s.label} style={{ background:t.bgCard, borderRadius:14, padding:18, border:`1px solid ${t.border}` }}>
            <div style={{ fontSize:12, color:t.textMuted, marginBottom:8 }}>{s.label}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:t.textPrimary, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:12, color:s.up?t.success:t.danger, fontWeight:500 }}>{s.change} vs last month</div>
          </div>
        ))}
      </div>

      <Collapsible title="Revenue by Product" defaultOpen icon="◈">
        {myP.map(p => (
          <div key={p.id} style={{ background:t.bgCard, borderRadius:10, padding:12, display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
            <div style={{ width:36, height:36, borderRadius:6, background:t.bgMuted, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
              {p.image ? <img src={p.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:20 }}>{p.imageEmoji||"📦"}</span>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:t.textPrimary, fontWeight:500 }}>{p.name}</span>
                <span style={{ fontSize:13, color:t.gold, fontWeight:600 }}>${(p.sold*p.price).toLocaleString()}</span>
              </div>
              <ProgressBar value={p.sold} max={700} />
              <div style={{ fontSize:10, color:t.textMuted, marginTop:3 }}>{p.sold} units sold</div>
            </div>
          </div>
        ))}
      </Collapsible>

      <Collapsible title="Monthly Performance" icon="◆">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
          {["Oct","Nov","Dec","Jan","Feb","Mar"].map((m,i) => {
            const h=[45,58,85,52,70,92][i];
            return (
              <div key={m} style={{ textAlign:"center" }}>
                <div style={{ height:80, display:"flex", alignItems:"flex-end", justifyContent:"center", marginBottom:6 }}>
                  <div style={{ width:"70%", height:`${h}%`, background:i===5?`linear-gradient(180deg,${t.gold},${t.goldDark})`:`${t.gold}25`, borderRadius:"4px 4px 0 0", transition:"height 0.5s" }} />
                </div>
                <div style={{ fontSize:11, color:i===5?t.gold:t.textMuted, fontWeight:i===5?600:400, letterSpacing:"0.04em" }}>{m}</div>
              </div>
            );
          })}
        </div>
      </Collapsible>

      <Collapsible title="Review Ratings" icon="★">
        {myP.map(p => (
          <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${t.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:6, background:t.bgMuted, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                {p.image ? <img src={p.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:18 }}>{p.imageEmoji||"📦"}</span>}
              </div>
              <div>
                <div style={{ fontSize:13, color:t.textPrimary }}>{p.name}</div>
                <StarRating rating={p.rating||0} />
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:15, fontWeight:600, color:t.gold }}>{p.rating||0}/5</div>
              <div style={{ fontSize:10, color:t.textMuted }}>{(p.reviewList||[]).length} reviews</div>
            </div>
          </div>
        ))}
      </Collapsible>
    </div>
  );
}
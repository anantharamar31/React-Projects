// src/components/layout/Sidebar.jsx
import { useStore, ACTIONS } from "../../store/store";
import { useTheme }           from "../../hooks/app.hooks";
import { Avatar }             from "../ui/BaseComponents";

const SELLER_NAV = [
  { id:"dashboard", icon:"◈", label:"Dashboard"  },
  { id:"products",  icon:"✦", label:"Products"   },
  { id:"orders",    icon:"◆", label:"Orders"     },
  { id:"analytics", icon:"◇", label:"Analytics"  },
  { id:"customers", icon:"○", label:"Customers"  },
  { id:"settings",  icon:"⊙", label:"Settings"   },
];

const CUSTOMER_NAV = [
  { id:"home",     icon:"◈", label:"Home"      },
  { id:"shop",     icon:"✦", label:"Shop"      },
  { id:"orders",   icon:"◆", label:"My Orders" },
  { id:"wishlist", icon:"♡", label:"Wishlist"  },
  { id:"profile",  icon:"○", label:"Profile"   },
];

export default function Sidebar({ activeView, setActiveView }) {
  const { state, dispatch } = useStore();
  const t         = useTheme();
  const { sidebarOpen } = state.ui;
  const { user }  = state.auth;
  const isSeller  = user?.role === "seller";
  const nav       = isSeller ? SELLER_NAV : CUSTOMER_NAV;

  return (
    <div style={{ width:sidebarOpen?252:64, minHeight:"100vh", background:"#090709", transition:"width 0.28s cubic-bezier(0.4,0,0.2,1)", flexShrink:0, display:"flex", flexDirection:"column", overflow:"hidden", position:"sticky", top:0, height:"100vh", borderRight:"1px solid rgba(201,168,76,0.08)" }}>

      {/* Logo */}
      <div style={{ padding:sidebarOpen?"20px 20px 16px":"20px 16px 16px", borderBottom:"1px solid rgba(201,168,76,0.08)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, background:"linear-gradient(135deg,#C9A84C,#A07830)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, boxShadow:"0 4px 12px rgba(160,120,48,0.4)" }}>✦</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#C9A84C", letterSpacing:"0.12em" }}>SHOPVERSE</div>
              <div style={{ fontSize:9, color:"rgba(201,168,76,0.4)", letterSpacing:"0.15em", marginTop:1 }}>{isSeller?"SELLER HUB":"MARKETPLACE"}</div>
            </div>
          )}
        </div>
      </div>

      {/* User mini-profile */}
      {sidebarOpen && (
        <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(201,168,76,0.06)", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Avatar name={user?.name} size={32} gradient />
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:13, fontWeight:500, color:"#F0EBE1", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.name}</div>
              <div style={{ fontSize:10, color:"rgba(201,168,76,0.5)", letterSpacing:"0.06em" }}>{isSeller?(user?.storeName||"My Store"):"Member"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => setActiveView(item.id)} style={{ width:"100%", padding:sidebarOpen?"10px 12px":"10px", marginBottom:2, borderRadius:8, border:"none", display:"flex", alignItems:"center", gap:10, background:activeView===item.id?"rgba(201,168,76,0.1)":"transparent", fontFamily:"'DM Sans',sans-serif", fontWeight:activeView===item.id?500:400, fontSize:13, transition:"all 0.18s", justifyContent:sidebarOpen?"flex-start":"center", position:"relative", overflow:"hidden" }}>
            {activeView===item.id && <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:2, background:"linear-gradient(180deg,#C9A84C,#A07830)", borderRadius:"0 2px 2px 0" }} />}
            <span style={{ fontSize:12, flexShrink:0, color:activeView===item.id?"#C9A84C":"rgba(255,255,255,0.35)", transition:"color 0.18s" }}>{item.icon}</span>
            {sidebarOpen && <span style={{ color:activeView===item.id?"#C9A84C":"rgba(255,255,255,0.45)", transition:"color 0.18s" }}>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding:"8px", borderTop:"1px solid rgba(201,168,76,0.06)", flexShrink:0 }}>
        <button onClick={() => dispatch({ type:ACTIONS.LOGOUT })} style={{ width:"100%", padding:sidebarOpen?"9px 12px":"9px", borderRadius:8, border:"none", display:"flex", alignItems:"center", gap:10, background:"transparent", fontFamily:"'DM Sans',sans-serif", fontSize:12, justifyContent:sidebarOpen?"flex-start":"center", color:"rgba(224,96,85,0.55)", transition:"all 0.18s" }}>
          <span>↩</span>{sidebarOpen&&"Sign Out"}
        </button>
      </div>
    </div>
  );
}
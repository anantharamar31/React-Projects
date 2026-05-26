// src/pages/customer/CustomerProfile.jsx
import { useState }           from "react";
import { useStore }            from "../../store/store.jsx";
import { useTheme, useToast }  from "../../hooks/app.hooks.jsx";
import { Toast, Avatar, Collapsible } from "../../components/ui/BaseComponents.jsx";
import { Btn, InputField, Toggle }    from "../../components/ui/Formcomponents.jsx";

export default function CustomerProfile() {
  const { state }  = useStore();
  const t          = useTheme();
  const { toast, showToast, clearToast } = useToast();
  const { user }   = state.auth;

  const [form,  setForm]  = useState({ name:user?.name||"", email:user?.email||"", phone:user?.phone||"", address:user?.address||"" });
  const [prefs, setPrefs] = useState({ orderEmails:true, promoEmails:false, smsAlerts:true });

  const myOrders = state.orders.filter(o => o.customerId===user?.id);
  const spent    = myOrders.filter(o => o.status==="delivered").reduce((s,o) => s+o.total, 0);

  return (
    <div className="fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Profile header card */}
      <div style={{ background:t.bgCard, borderRadius:16, padding:22, border:`1px solid ${t.border}`, marginBottom:18, display:"flex", alignItems:"center", gap:18 }}>
        <Avatar name={user?.name} size={58} gradient />
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:t.textPrimary, marginBottom:4 }}>{user?.name}</h2>
          <p style={{ fontSize:12, color:t.textMuted, marginBottom:12 }}>{user?.email} · Member since {user?.memberSince}</p>
          <div style={{ display:"flex", gap:10 }}>
            {[
              { v:myOrders.length,            l:"Orders", c:t.info   },
              { v:`$${spent.toFixed(0)}`,      l:"Spent",  c:t.gold   },
              { v:state.wishlist.length,       l:"Saved",  c:t.danger },
            ].map(s => (
              <div key={s.l} style={{ background:t.bgMuted, borderRadius:10, padding:"10px 16px", textAlign:"center", border:`1px solid ${t.border}` }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:s.c, fontWeight:600 }}>{s.v}</div>
                <div style={{ fontSize:10, color:t.textMuted, letterSpacing:"0.06em" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Collapsible title="Personal Information" defaultOpen icon="○">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <InputField label="Full Name" value={form.name}  onChange={e=>setForm({...form,name:e.target.value})} />
          <InputField label="Email"     value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <InputField label="Phone"     value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:11,fontWeight:600,color:t.textMuted,display:"block",marginBottom:5,letterSpacing:"0.08em",textTransform:"uppercase" }}>Delivery Address</label>
            <textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Your default address" rows={2}
              style={{ padding:"10px 14px",borderRadius:9,border:`1px solid ${t.border}`,width:"100%",resize:"none",background:t.bgSurface,color:t.textPrimary,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none" }} />
          </div>
        </div>
        <div style={{ marginTop:14 }}><Btn onClick={() => showToast("Profile saved.")}>Save Changes</Btn></div>
      </Collapsible>

      <Collapsible title="Notifications" icon="◆">
        <Toggle checked={prefs.orderEmails} onChange={v=>setPrefs({...prefs,orderEmails:v})} label="Order confirmation emails" desc="Receive email when order is placed" />
        <Toggle checked={prefs.promoEmails} onChange={v=>setPrefs({...prefs,promoEmails:v})} label="Promotional offers"        desc="Deals, discounts, and new arrivals" />
        <Toggle checked={prefs.smsAlerts}   onChange={v=>setPrefs({...prefs,smsAlerts:v})}   label="SMS delivery alerts"      desc="Text updates on shipments" />
      </Collapsible>

      <Collapsible title="Security" icon="◈">
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <InputField label="Current Password" type="password" placeholder="Enter current password" />
          <InputField label="New Password"     type="password" placeholder="Choose a strong password" />
          <div style={{ marginTop:4 }}><Btn onClick={() => showToast("Password updated.")}>Update Password</Btn></div>
        </div>
      </Collapsible>
    </div>
  );
}
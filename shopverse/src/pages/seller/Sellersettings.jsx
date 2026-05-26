// src/pages/seller/SellerSettings.jsx
import { useState }           from "react";
import { useStore }            from "../../store/store.jsx";
import { useTheme, useToast }  from "../../hooks/app.hooks.jsx";
import { Toast, Collapsible }  from "../../components/ui/Basecomponents.jsx";
import { Btn, InputField, Toggle } from "../../components/ui/Formcomponents.jsx";

export default function SellerSettings() {
  const { state }              = useStore();
  const t                      = useTheme();
  const { toast, showToast, clearToast } = useToast();
  const { user }               = state.auth;

  const [form,   setForm]   = useState({ name:user?.name||"", email:user?.email||"", phone:user?.phone||"", storeName:user?.storeName||"" });
  const [notifs, setNotifs] = useState({ orders:true, updates:true, lowStock:true, reviews:false, marketing:false });

  return (
    <div className="fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary, marginBottom:22 }}>Settings</h2>

      <Collapsible title="Profile Information" defaultOpen icon="○">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[["Full Name","name"],["Email","email"],["Phone","phone"],["Store Name","storeName"]].map(([label,key]) => (
            <div key={key}><InputField label={label} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} /></div>
          ))}
        </div>
        <div style={{ marginTop:16 }}><Btn onClick={() => showToast("Profile saved.")}>Save Changes</Btn></div>
      </Collapsible>

      <Collapsible title="Notification Preferences" icon="◆">
        <Toggle checked={notifs.orders}    onChange={v=>setNotifs({...notifs,orders:v})}    label="New order alerts"    desc="Notify when a new order is placed"  />
        <Toggle checked={notifs.updates}   onChange={v=>setNotifs({...notifs,updates:v})}   label="Order status updates" desc="Shipping and status changes"          />
        <Toggle checked={notifs.lowStock}  onChange={v=>setNotifs({...notifs,lowStock:v})}  label="Low stock warnings"  desc="Alert when stock falls below 10"    />
        <Toggle checked={notifs.reviews}   onChange={v=>setNotifs({...notifs,reviews:v})}   label="New reviews"         desc="When customers leave product reviews" />
        <Toggle checked={notifs.marketing} onChange={v=>setNotifs({...notifs,marketing:v})} label="Marketing updates"   desc="Platform promotions and campaigns"   />
      </Collapsible>

      <Collapsible title="Security" icon="◈">
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <InputField label="Current Password" type="password" placeholder="Enter current password" />
          <InputField label="New Password"     type="password" placeholder="Choose a strong password" />
          <div style={{ marginTop:4 }}><Btn onClick={() => showToast("Password updated.")}>Update Password</Btn></div>
        </div>
      </Collapsible>

      <Collapsible title="Store Policies" icon="✦">
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[["Return Policy","Returns accepted within 30 days in original condition."],["Shipping Policy","Free shipping on orders over $50. Delivery: 3–5 business days."]].map(([label,def]) => (
            <div key={label}>
              <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</label>
              <textarea defaultValue={def} rows={2} style={{ padding:"10px 14px", borderRadius:9, border:`1px solid ${t.border}`, width:"100%", resize:"vertical", background:t.bgSurface, color:t.textPrimary, fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none" }} />
            </div>
          ))}
          <div><Btn onClick={() => showToast("Policies saved.")}>Save Policies</Btn></div>
        </div>
      </Collapsible>
    </div>
  );
}
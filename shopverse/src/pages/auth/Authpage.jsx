// src/pages/auth/AuthPage.jsx
import { useState, useRef } from "react";
import { useStore, ACTIONS, DEMO_USERS } from "../../store/store";

export default function AuthPage() {
  const { dispatch }  = useStore();
  const [mode,    setMode]    = useState("login");
  const [role,    setRole]    = useState("customer");
  const [form,    setForm]    = useState({ email:"", password:"", name:"", storeName:"" });
  const [otp,     setOtp]     = useState(["","","","","",""]);
  const [genOtp,  setGenOtp]  = useState("");
  const [notice,  setNotice]  = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  const triggerOtp = async (user) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGenOtp(code);
    setMode("otp");
    setNotice(`Code sent! Demo: ${code}`);
  };

  const handleLogin = async () => {
    setLoading(true); setNotice("");
    await new Promise(r => setTimeout(r, 600));
    const user = DEMO_USERS[form.email];
    if (user && form.password === "demo123") {
      dispatch({ type:ACTIONS.SET_PENDING_USER, payload:form });
      await triggerOtp(user);
    } else {
      setNotice("Try seller@demo.com or customer@demo.com · password: demo123");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.email || !form.name || !form.password) { setNotice("Please fill in all fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    dispatch({ type:ACTIONS.SET_PENDING_USER, payload:{ ...form, role } });
    await triggerOtp(null);
    setLoading(false);
  };

  const handleOtpChange = (idx, val) => {
    const n=[...otp]; n[idx]=val.slice(-1); setOtp(n);
    if (val && idx<5) otpRefs.current[idx+1]?.focus();
  };

  const verifyOtp = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (otp.join("") === genOtp) {
      const user = DEMO_USERS[form.email] || {
        id:`u${Date.now()}`, name:form.name, email:form.email, role,
        phone:"", storeName:form.storeName, address:"",
        memberSince: new Date().toISOString().slice(0,7),
      };
      dispatch({ type:ACTIONS.LOGIN, payload:user });
    } else {
      setNotice("Incorrect code. Try again.");
      setOtp(["","","","","",""]);
    }
    setLoading(false);
  };

  const inp = { padding:"12px 16px", borderRadius:10, border:"1px solid rgba(201,168,76,0.2)", background:"rgba(255,255,255,0.04)", color:"#F0EBE1", fontSize:14, width:"100%", fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"all 0.2s" };
  const focus = e => e.target.style.borderColor="#C9A84C";
  const blur  = e => e.target.style.borderColor="rgba(201,168,76,0.2)";

  return (
    <div style={{ minHeight:"100vh", background:"#0D0B0F", display:"flex", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* Decorative orbs */}
      <div style={{ position:"absolute", top:-120, right:-80, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-80, left:-80, width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.05) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(201,168,76,0.03) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />

      {/* Brand panel */}
      <div style={{ flex:"0 0 42%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 56px", borderRight:"1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ animation:"fadeUp 0.6s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
            <div style={{ width:40, height:40, background:"linear-gradient(135deg,#C9A84C,#A07830)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>✦</div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"#C9A84C", letterSpacing:"0.1em" }}>SHOPVERSE</span>
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:52, fontWeight:400, color:"#F0EBE1", lineHeight:1.15, marginBottom:20 }}>
            Where luxury<br/><em style={{ color:"#C9A84C" }}>meets</em> commerce
          </h1>
          <p style={{ color:"rgba(240,235,225,0.45)", fontSize:15, lineHeight:1.7, fontFamily:"'DM Sans',sans-serif", fontWeight:300, maxWidth:360 }}>
            A curated marketplace for discerning buyers and visionary sellers. Quality without compromise.
          </p>
          <div style={{ marginTop:48, display:"flex", flexDirection:"column", gap:16 }}>
            {[["✦","50,000+ curated products"],["◆","Verified sellers worldwide"],["◈","Secure, seamless checkout"]].map(([ic,txt]) => (
              <div key={txt} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ color:"#C9A84C", fontSize:10 }}>{ic}</span>
                <span style={{ color:"rgba(240,235,225,0.5)", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp 0.5s 0.1s ease both" }}>

          {mode==="otp" ? (
            /* OTP Screen */
            <div>
              <div style={{ textAlign:"center", marginBottom:32 }}>
                <div style={{ fontSize:44, marginBottom:12, animation:"float 3s ease infinite" }}>📱</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:"#F0EBE1", marginBottom:8 }}>Verify Identity</h2>
                <p style={{ color:"rgba(240,235,225,0.4)", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Enter the 6-digit code sent to your device</p>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24 }}>
                {otp.map((d,i) => (
                  <input key={i} ref={el => otpRefs.current[i]=el} value={d} onChange={e => handleOtpChange(i,e.target.value)} onKeyDown={e => { if(e.key==="Backspace"&&!d&&i>0) otpRefs.current[i-1]?.focus(); }} maxLength={1}
                    style={{ width:50, height:58, textAlign:"center", fontSize:24, fontWeight:600, borderRadius:10, border:`1.5px solid ${d?"#C9A84C":"rgba(201,168,76,0.2)"}`, background:d?"rgba(201,168,76,0.06)":"rgba(255,255,255,0.03)", color:"#F0EBE1", outline:"none", fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s", boxShadow:d?"0 0 0 3px rgba(201,168,76,0.1)":"none" }} />
                ))}
              </div>
              {notice && <div style={{ background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#C9A84C", textAlign:"center" }}>{notice}</div>}
              <button onClick={verifyOtp} disabled={loading||otp.join("").length!==6} style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#C9A84C,#A07830)", border:"none", borderRadius:10, color:"#1A1410", fontWeight:600, fontSize:15, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.04em", boxShadow:"0 6px 24px rgba(160,120,48,0.4)", opacity:otp.join("").length!==6?0.45:1, marginBottom:12 }}>
                {loading?"Verifying…":"Confirm & Continue →"}
              </button>
              <button onClick={() => { setMode("login"); setOtp(["","","","","",""]); setNotice(""); }} style={{ width:"100%", background:"none", border:"none", color:"rgba(240,235,225,0.3)", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
            </div>

          ) : (
            /* Login / Register Screen */
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, color:"#F0EBE1", marginBottom:6 }}>{mode==="login"?"Welcome back":"Create account"}</h2>
              <p style={{ color:"rgba(240,235,225,0.35)", fontSize:13, fontFamily:"'DM Sans',sans-serif", marginBottom:28 }}>{mode==="login"?"Sign in to your account":"Join our curated marketplace"}</p>

              <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:3, marginBottom:24, border:"1px solid rgba(201,168,76,0.12)" }}>
                {["login","register"].map(m => (
                  <button key={m} onClick={() => { setMode(m); setNotice(""); }} style={{ flex:1, padding:"9px", borderRadius:8, border:"none", fontWeight:500, fontSize:13, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.03em", transition:"all 0.2s", background:mode===m?"linear-gradient(135deg,#C9A84C,#A07830)":"transparent", color:mode===m?"#1A1410":"rgba(240,235,225,0.4)" }}>
                    {m==="login"?"Sign In":"Register"}
                  </button>
                ))}
              </div>

              {mode==="register" && (
                <>
                  <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                    {["customer","seller"].map(r => (
                      <button key={r} onClick={() => setRole(r)} style={{ flex:1, padding:"10px", borderRadius:9, border:`1.5px solid ${role===r?"#C9A84C":"rgba(201,168,76,0.15)"}`, background:role===r?"rgba(201,168,76,0.1)":"transparent", color:role===r?"#C9A84C":"rgba(240,235,225,0.4)", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500 }}>
                        {r==="seller"?"🏛 Seller":"🛍 Customer"}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginBottom:12 }}><input placeholder="Full name"   value={form.name}      onChange={e => setForm({...form,name:e.target.value})}      style={inp} onFocus={focus} onBlur={blur} /></div>
                  {role==="seller" && <div style={{ marginBottom:12 }}><input placeholder="Store name" value={form.storeName} onChange={e => setForm({...form,storeName:e.target.value})} style={inp} onFocus={focus} onBlur={blur} /></div>}
                </>
              )}

              <div style={{ marginBottom:12 }}><input type="email"    placeholder="Email address" value={form.email}    onChange={e => setForm({...form,email:e.target.value})}    style={inp} onFocus={focus} onBlur={blur} /></div>
              <div style={{ marginBottom:20 }}><input type="password" placeholder="Password"      value={form.password} onChange={e => setForm({...form,password:e.target.value})} style={inp} onFocus={focus} onBlur={blur} /></div>

              {notice && <div style={{ background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#C9A84C" }}>{notice}</div>}

              <button onClick={mode==="login"?handleLogin:handleRegister} disabled={loading} style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#C9A84C,#A07830)", border:"none", borderRadius:10, color:"#1A1410", fontWeight:600, fontSize:15, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.04em", boxShadow:"0 6px 24px rgba(160,120,48,0.35)", marginBottom:20 }}>
                {loading?"Please wait…":mode==="login"?"Continue with OTP →":"Send Verification Code →"}
              </button>

              <div style={{ background:"rgba(201,168,76,0.05)", borderRadius:10, padding:"12px 16px", border:"1px solid rgba(201,168,76,0.1)" }}>
                <div style={{ fontSize:10, color:"rgba(201,168,76,0.5)", fontWeight:600, letterSpacing:"0.1em", marginBottom:6 }}>DEMO CREDENTIALS</div>
                <div style={{ fontSize:12, color:"rgba(240,235,225,0.4)", fontFamily:"'DM Sans',sans-serif", lineHeight:1.9 }}>🏛 seller@demo.com<br/>🛍 customer@demo.com<br/>Password: demo123</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
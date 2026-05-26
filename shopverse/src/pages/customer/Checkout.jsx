// src/pages/customer/Checkout.jsx
import { useState }           from "react";
import { useStore, ACTIONS }  from "../../store/store.jsx";
import { useTheme, useToast } from "../../hooks/app.hooks.jsx";
import { Toast, GoldDivider } from "../../components/ui/BaseComponents.jsx";
import { Btn, InputField }    from "../../components/ui/Formcomponents.jsx";

export default function Checkout({ setActiveView }) {
  const { state, dispatch } = useStore();
  const t = useTheme();
  const { toast, showToast, clearToast } = useToast();
  const { user } = state.auth;
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({ name:user?.name||"", street:"", city:"", state:"", zip:"", phone:user?.phone||"" });
  const [pay,  setPay]  = useState({ method:"card" });
  const total    = state.cart.reduce((s,i) => s+i.price*i.qty, 0);
  const shipping = total>50 ? 0 : 5.99;

  const placeOrder = () => {
    if (!addr.street) { showToast("Please enter delivery address.", "error"); return; }
    dispatch({
      type: ACTIONS.PLACE_ORDER,
      payload: {
        items:   state.cart.map(i => ({ productId:i.id, qty:i.qty, price:i.price, sellerId:i.sellerId })),
        total:   total+shipping,
        address: `${addr.street}, ${addr.city}`,
      },
    });
    dispatch({ type:ACTIONS.ADD_NOTIFICATION, payload:{ id:Date.now(), message:"Your order has been confirmed!", type:"success", read:false, time:"just now" } });
    setStep(4);
  };

  if (step===4) return (
    <div className="fade-up" style={{ textAlign:"center", padding:"80px 0" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:72, color:t.gold, marginBottom:16 }}>✦</div>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, color:t.textPrimary, marginBottom:8, fontWeight:400 }}>Order Confirmed</h2>
      <p style={{ color:t.textMuted, marginBottom:28, fontSize:14 }}>Your order is placed. Track it in My Orders.</p>
      <Btn onClick={() => setActiveView("orders")} style={{ marginRight:10 }}>Track Order</Btn>
      <Btn variant="ghost" onClick={() => setActiveView("shop")}>Continue Shopping</Btn>
    </div>
  );

  const STEPS = ["Delivery","Payment","Review"];

  return (
    <div className="fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      <Btn variant="ghost" size="sm" onClick={() => setActiveView("shop")} style={{ marginBottom:20 }}>← Back to Shop</Btn>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary, marginBottom:22 }}>Checkout</h2>

      {/* Stepper */}
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {STEPS.map((s,i) => (
          <div key={s} style={{ display:"flex", alignItems:"center", flex:i<2?1:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28,height:28,borderRadius:"50%",background:step>i+1?"linear-gradient(135deg,#C9A84C,#A07830)":step===i+1?t.goldBg:t.bgMuted,border:`1.5px solid ${step>=i+1?t.gold:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:step>i+1?"#1A1410":step===i+1?t.gold:t.textMuted,flexShrink:0 }}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{ fontSize:12,fontWeight:step===i+1?600:400,color:step===i+1?t.gold:t.textMuted,letterSpacing:"0.04em",whiteSpace:"nowrap" }}>{s}</span>
            </div>
            {i<2 && <div style={{ flex:1,height:1,background:step>i+1?t.gold:t.border,margin:"0 10px" }} />}
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20, alignItems:"start" }}>
        <div style={{ background:t.bgCard, borderRadius:14, padding:22, border:`1px solid ${t.border}` }}>

          {step===1 && (
            <div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:t.textPrimary, marginBottom:18 }}>Delivery Address</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
                {[["Full Name","name","1/-1"],["Phone","phone","auto"],["Street Address","street","1/-1"],["City","city","auto"],["State","state","auto"],["ZIP","zip","auto"]].map(([lbl,key,span]) => (
                  <div key={key} style={{ gridColumn:span||"auto" }}>
                    <InputField label={lbl} value={addr[key]} onChange={e => setAddr({...addr,[key]:e.target.value})} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop:18 }}><Btn onClick={() => setStep(2)}>Continue to Payment →</Btn></div>
            </div>
          )}

          {step===2 && (
            <div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:t.textPrimary, marginBottom:18 }}>Payment Method</h3>
              {["card","upi","cod"].map(m => (
                <label key={m} style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 14px",border:`1.5px solid ${pay.method===m?t.gold:t.border}`,borderRadius:11,marginBottom:10,cursor:"pointer",background:pay.method===m?t.goldBg:t.bgSurface,transition:"all 0.18s" }}>
                  <input type="radio" name="pay" checked={pay.method===m} onChange={() => setPay({...pay,method:m})} style={{ accentColor:t.gold }} />
                  <span style={{ fontSize:20 }}>{m==="card"?"💳":m==="upi"?"📲":"💵"}</span>
                  <div>
                    <div style={{ fontSize:13,fontWeight:500,color:t.textPrimary }}>{m==="card"?"Credit / Debit Card":m==="upi"?"UPI Payment":"Cash on Delivery"}</div>
                    <div style={{ fontSize:11,color:t.textMuted }}>{m==="card"?"Visa, Mastercard, Amex":m==="upi"?"GPay, PhonePe, Paytm":"Pay when delivered"}</div>
                  </div>
                </label>
              ))}
              {pay.method==="card" && (
                <div style={{ marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:13 }}>
                  <div style={{ gridColumn:"1/-1" }}><InputField label="Card Number" defaultValue="•••• •••• •••• 4242" readOnly /></div>
                  <InputField label="Expiry" defaultValue="12/26" readOnly />
                  <InputField label="CVV" type="password" placeholder="•••" />
                </div>
              )}
              <div style={{ display:"flex",gap:10,marginTop:18 }}>
                <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
                <Btn onClick={() => setStep(3)}>Review Order →</Btn>
              </div>
            </div>
          )}

          {step===3 && (
            <div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:t.textPrimary, marginBottom:18 }}>Review Order</h3>
              {state.cart.map(item => (
                <div key={item.id} style={{ display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${t.border}` }}>
                  <div style={{ width:44,height:44,borderRadius:8,background:t.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
                    {item.image ? <img src={item.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:24 }}>{item.imageEmoji||"📦"}</span>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,color:t.textPrimary,fontWeight:500 }}>{item.name}</div>
                    <div style={{ fontSize:11,color:t.textMuted }}>Qty: {item.qty}</div>
                  </div>
                  <span style={{ fontSize:14,fontWeight:600,color:t.gold,fontFamily:"'Cormorant Garamond',serif" }}>${(item.price*item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ background:t.bgMuted,borderRadius:9,padding:"10px 14px",marginTop:12,fontSize:12,color:t.textSecondary,lineHeight:1.6 }}>
                📍 {addr.street}, {addr.city} &nbsp;·&nbsp; {pay.method==="card"?"Card ····4242":pay.method==="upi"?"UPI":"Cash on Delivery"}
              </div>
              <div style={{ display:"flex",gap:10,marginTop:18 }}>
                <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
                <Btn variant="success" onClick={placeOrder} fullWidth>Place Order ✦</Btn>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div style={{ background:t.bgCard,borderRadius:14,padding:20,border:`1px solid ${t.border}`,position:"sticky",top:80 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:t.textPrimary,marginBottom:14 }}>Summary</h3>
          {state.cart.map(item => (
            <div key={item.id} style={{ display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",color:t.textSecondary }}>
              <span>{item.name} × {item.qty}</span>
              <span style={{ fontWeight:500,color:t.textPrimary }}>${(item.price*item.qty).toFixed(2)}</span>
            </div>
          ))}
          <GoldDivider />
          <div style={{ marginTop:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5 }}><span style={{ color:t.textMuted }}>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:10 }}><span style={{ color:t.textMuted }}>Shipping</span><span style={{ color:shipping===0?t.success:t.textPrimary }}>{shipping===0?"Free":`$${shipping}`}</span></div>
            <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"'Cormorant Garamond',serif",fontSize:22 }}>
              <span style={{ color:t.textPrimary }}>Total</span>
              <span style={{ color:t.gold }}>${(total+shipping).toFixed(2)}</span>
            </div>
          </div>
          {total<50 && <div style={{ background:t.warningBg,border:`1px solid ${t.warning}30`,borderRadius:8,padding:"8px 12px",marginTop:12,fontSize:11,color:t.warning }}>Add ${(50-total).toFixed(2)} more for free shipping</div>}
        </div>
      </div>
    </div>
  );
}
// src/components/layout/CartDrawer.jsx
import { useStore, ACTIONS } from "../../store/store.jsx";
import { useTheme }           from "../../hooks/app.hooks.jsx";
import { GoldDivider }        from "../ui/BaseComponents.jsx";
import { Btn }                from "../ui/Formcomponents.jsx";

export default function CartDrawer({ setActiveView }) {
  const { state, dispatch } = useStore();
  const t     = useTheme();
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!state.ui.cartOpen) return null;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500 }}>
      {/* Backdrop */}
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(3px)" }} onClick={() => dispatch({ type:ACTIONS.TOGGLE_CART })} />

      {/* Drawer */}
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"min(380px,92vw)", background:t.bgCard, display:"flex", flexDirection:"column", animation:"slideIn 0.25s ease", borderLeft:`1px solid ${t.border}` }}>

        <div style={{ padding:"18px 20px", borderBottom:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:t.textPrimary }}>Your Cart</h3>
          <button onClick={() => dispatch({ type:ACTIONS.TOGGLE_CART })} style={{ background:t.bgMuted, border:`1px solid ${t.border}`, borderRadius:8, width:30, height:30, color:t.textSecondary, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:20 }}>
          {state.cart.length===0 ? (
            <div style={{ textAlign:"center", padding:"50px 0" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, color:t.border, marginBottom:12 }}>✦</div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:t.textMuted }}>Your cart is empty</p>
            </div>
          ) : state.cart.map(item => (
            <div key={item.id} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:`1px solid ${t.border}` }}>
              <div style={{ width:52, height:52, borderRadius:10, background:t.bgMuted, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                {item.image ? <img src={item.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <span style={{ fontSize:26 }}>{item.imageEmoji||"📦"}</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:t.textPrimary, marginBottom:3 }}>{item.name}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:t.gold }}>${item.price}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:7 }}>
                <button onClick={() => dispatch({ type:ACTIONS.REMOVE_FROM_CART, payload:item.id })} style={{ background:"none", border:"none", color:t.danger, fontSize:13, padding:0, opacity:0.6 }}>✕</button>
                <div style={{ display:"flex", border:`1px solid ${t.border}`, borderRadius:7, overflow:"hidden" }}>
                  <button onClick={() => dispatch({ type:ACTIONS.UPDATE_CART_QTY, payload:{id:item.id,qty:item.qty-1} })} style={{ width:26, height:26, border:"none", background:t.bgMuted, color:t.textPrimary, fontSize:14 }}>−</button>
                  <span style={{ padding:"0 10px", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", background:t.bgCard, color:t.textPrimary }}>{item.qty}</span>
                  <button onClick={() => dispatch({ type:ACTIONS.UPDATE_CART_QTY, payload:{id:item.id,qty:item.qty+1} })} style={{ width:26, height:26, border:"none", background:t.bgMuted, color:t.textPrimary, fontSize:14 }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {state.cart.length>0 && (
          <div style={{ padding:"16px 20px", borderTop:`1px solid ${t.border}` }}>
            <GoldDivider />
            <div style={{ display:"flex", justifyContent:"space-between", margin:"12px 0" }}>
              <span style={{ color:t.textSecondary, fontSize:14 }}>Subtotal</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:t.gold, fontWeight:600 }}>${total.toFixed(2)}</span>
            </div>
            <Btn fullWidth size="lg" onClick={() => { dispatch({ type:ACTIONS.TOGGLE_CART }); setActiveView("checkout"); }}>Proceed to Checkout →</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
// src/pages/customer/CustomerWishlist.jsx
import { useStore, ACTIONS } from "../../store/store.jsx";
import { useTheme }           from "../../hooks/app.hooks.jsx";
import { Btn }                from "../../components/ui/Formcomponents.jsx";

export default function CustomerWishlist({ showDetail }) {
  const { state, dispatch } = useStore();
  const t = useTheme();
  const wishlistProducts = state.products.filter(p => state.wishlist.includes(p.id));

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary, marginBottom:22 }}>
        Wishlist <span style={{ color:t.gold }}>♥</span>
      </h2>

      {wishlistProducts.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 0" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:60, color:t.border, marginBottom:12 }}>♡</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:t.textMuted }}>Your wishlist is empty</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:14 }}>
          {wishlistProducts.map(p => (
            <div key={p.id} style={{ background:t.bgCard, borderRadius:16, border:`1px solid ${t.border}`, overflow:"hidden" }}>
              <div style={{ background:t.bgMuted, height:140, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden" }} onClick={() => showDetail(p)}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:52 }}>{p.imageEmoji||"📦"}</span>}
              </div>
              <div style={{ padding:14 }}>
                <div style={{ fontSize:13, fontWeight:500, color:t.textPrimary, marginBottom:6 }}>{p.name}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:t.gold, marginBottom:12 }}>${p.price}</div>
                <div style={{ display:"flex", gap:7 }}>
                  <Btn size="sm" fullWidth onClick={() => dispatch({ type:ACTIONS.ADD_TO_CART, payload:p })}>Add to Cart</Btn>
                  <Btn variant="danger" size="sm" onClick={() => dispatch({ type:ACTIONS.TOGGLE_WISHLIST, payload:p.id })} style={{ padding:"6px 10px" }}>✕</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
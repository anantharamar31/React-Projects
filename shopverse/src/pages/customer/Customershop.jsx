// src/pages/customer/CustomerShop.jsx
import { useStore, ACTIONS }  from "../../store/store.jsx";
import { useTheme, useToast } from "../../hooks/app.hooks.jsx";
import { Toast }              from "../../components/ui/BaseComponents.jsx";
import { StarRating }         from "../../components/ui/Formcomponents.jsx";
import { Btn }                from "../../components/ui/Formcomponents.jsx";

const CATEGORIES = ["All","Electronics","Clothing","Sports","Accessories","Home"];

export default function CustomerShop({ showDetail }) {
  const { state, dispatch } = useStore();
  const t = useTheme();
  const { toast, showToast, clearToast } = useToast();
  const { activeCategory, searchQuery, sortBy } = state.ui;

  let products = state.products.filter(p => {
    const mc = activeCategory==="All" || p.category===activeCategory;
    const ms = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return mc && ms;
  });
  products = [...products].sort((a,b) =>
    sortBy==="price_asc"  ? a.price-b.price  :
    sortBy==="price_desc" ? b.price-a.price  :
    sortBy==="rating"     ? b.rating-a.rating :
    b.sold-a.sold
  );

  return (
    <div className="fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Header row */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary, marginBottom:2 }}>Discover</h2>
            <p style={{ color:t.textMuted, fontSize:12, letterSpacing:"0.03em" }}>{products.length} curated products</p>
          </div>
          <select value={sortBy} onChange={e => dispatch({ type:ACTIONS.SET_SORT, payload:e.target.value })} style={{ padding:"8px 12px", borderRadius:9, border:`1px solid ${t.border}`, fontSize:12, background:t.bgSurface, color:t.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:4 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => dispatch({ type:ACTIONS.SET_CATEGORY, payload:cat })} style={{ padding:"7px 18px", borderRadius:20, border:`1px solid ${activeCategory===cat?t.gold:t.border}`, fontWeight:500, fontSize:12, whiteSpace:"nowrap", background:activeCategory===cat?t.goldBg:"transparent", color:activeCategory===cat?t.gold:t.textSecondary, fontFamily:"'DM Sans',sans-serif", transition:"all 0.18s", letterSpacing:"0.03em" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:14 }}>
        {products.map(p => {
          const inCart = state.cart.find(i => i.id===p.id);
          const inWish = state.wishlist.includes(p.id);
          const disc   = p.originalPrice>p.price ? Math.round((1-p.price/p.originalPrice)*100) : 0;

          return (
            <div key={p.id}
              style={{ background:t.bgCard, borderRadius:16, border:`1px solid ${t.border}`, overflow:"hidden", cursor:"pointer", transition:"transform 0.2s,box-shadow 0.2s,border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,0.14)"; e.currentTarget.style.borderColor=`${t.gold}40`; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor=t.border; }}
            >
              {/* Thumbnail */}
              <div style={{ background:t.bgMuted, height:160, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }} onClick={() => showDetail(p)}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:56 }}>{p.imageEmoji||"📦"}</span>}
                <button onClick={e => { e.stopPropagation(); dispatch({ type:ACTIONS.TOGGLE_WISHLIST, payload:p.id }); }} style={{ position:"absolute", top:8, right:8, background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:inWish?t.danger:t.textMuted, transition:"all 0.15s" }}>
                  {inWish?"♥":"♡"}
                </button>
                {disc>0 && <div style={{ position:"absolute", top:8, left:8, background:"linear-gradient(135deg,#C9A84C,#A07830)", color:"#1A1410", fontSize:9, fontWeight:700, padding:"3px 7px", borderRadius:5, letterSpacing:"0.06em" }}>−{disc}%</div>}
                {p.stock===0 && <div style={{ position:"absolute", inset:0, background:`${t.bgMuted}cc`, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:10, fontWeight:700, color:t.danger, letterSpacing:"0.1em" }}>OUT OF STOCK</span></div>}
              </div>

              <div style={{ padding:"14px 14px 16px" }}>
                <div style={{ fontSize:10, color:t.gold, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5 }}>{p.category}</div>
                <div style={{ fontSize:13, fontWeight:500, color:t.textPrimary, marginBottom:7, lineHeight:1.4 }} onClick={() => showDetail(p)}>{p.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10 }}>
                  <StarRating rating={p.rating||0} size={11} />
                  <span style={{ fontSize:10, color:t.textMuted }}>({(p.reviewList||[]).length})</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:12 }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:t.gold, fontWeight:600 }}>${p.price}</span>
                  {p.originalPrice>p.price && <span style={{ fontSize:11, color:t.textMuted, textDecoration:"line-through" }}>${p.originalPrice}</span>}
                </div>
                <Btn fullWidth disabled={p.stock===0} size="sm" variant={inCart?"success":"primary"} onClick={() => { dispatch({ type:ACTIONS.ADD_TO_CART, payload:p }); showToast(`${p.name} added to cart`); }}>
                  {p.stock===0?"Unavailable":inCart?`In Cart (${inCart.qty})`:"Add to Cart"}
                </Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
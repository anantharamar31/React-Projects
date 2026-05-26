// src/pages/customer/ProductDetail.jsx
import { useState }           from "react";
import { useStore, ACTIONS }  from "../../store/store.jsx";
import { useTheme, useToast, useMultiImageUpload } from "../../hooks/app.hooks.jsx";
import { Toast, Collapsible, GoldDivider, Badge }  from "../../components/ui/BaseComponents.jsx";
import { Btn, StarRating, StarPicker }             from "../../components/ui/Formcomponents.jsx";
import { MultiImageUpload }   from "../../components/ui/Imageuploadwidgets.jsx";

export default function ProductDetail({ product, onBack }) {
  const { state, dispatch } = useStore();
  const t = useTheme();
  const { toast, showToast, clearToast } = useToast();
  const { user } = state.auth;

  // Always read live product from store so reviews update instantly
  const live = state.products.find(p => p.id===product.id) || product;

  const [qty,        setQty]        = useState(1);
  const [showForm,   setShowForm]   = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating:0, comment:"" });

  const { previews, handleFiles, removeAt, reset:resetImgs, error:imgError } = useMultiImageUpload({ maxFiles:4 });

  const inWish = state.wishlist.includes(live.id);
  const disc   = live.originalPrice>live.price ? Math.round((1-live.price/live.originalPrice)*100) : 0;
  const alreadyReviewed = (live.reviewList||[]).some(r => r.userId===user?.id);

  const submitReview = () => {
    if (!reviewForm.rating)          { showToast("Please select a star rating.", "error"); return; }
    if (!reviewForm.comment.trim())   { showToast("Please write a comment.",      "error"); return; }
    dispatch({
      type: ACTIONS.ADD_REVIEW,
      payload: {
        productId: live.id,
        review: { userId:user?.id, userName:user?.name||"Anonymous", rating:reviewForm.rating, comment:reviewForm.comment.trim(), images:previews },
      },
    });
    showToast("Review submitted — thank you!");
    setReviewForm({ rating:0, comment:"" });
    resetImgs(); setShowForm(false);
  };

  return (
    <div className="fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <Btn variant="ghost" size="sm" onClick={onBack} style={{ marginBottom:20 }}>← Back to Shop</Btn>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28, alignItems:"start", marginBottom:32 }}>

        {/* Product image */}
        <div style={{ background:t.bgCard, borderRadius:20, border:`1px solid ${t.border}`, overflow:"hidden", position:"relative" }}>
          {live.image
            ? <img src={live.image} alt={live.name} style={{ width:"100%", height:360, objectFit:"cover", display:"block" }} />
            : <div style={{ height:360, display:"flex", alignItems:"center", justifyContent:"center", fontSize:120 }}>{live.imageEmoji||"📦"}</div>
          }
          {disc>0 && <div style={{ position:"absolute", top:16, left:16, background:"linear-gradient(135deg,#C9A84C,#A07830)", color:"#1A1410", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:7 }}>−{disc}% OFF</div>}
        </div>

        {/* Info panel */}
        <div>
          <div style={{ fontSize:10, color:t.gold, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:10 }}>{live.category}</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:400, color:t.textPrimary, marginBottom:14, lineHeight:1.15 }}>{live.name}</h1>

          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <StarRating rating={live.rating||0} size={15} />
            <span style={{ fontSize:14, fontWeight:600, color:t.gold }}>{live.rating||0}</span>
            <span style={{ color:t.border }}>·</span>
            <span style={{ fontSize:12, color:t.textMuted }}>{(live.reviewList||[]).length} reviews</span>
            <span style={{ color:t.border }}>·</span>
            <span style={{ fontSize:12, color:t.textMuted }}>{live.sold} sold</span>
          </div>

          <GoldDivider />
          <div style={{ margin:"16px 0" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, color:t.gold, fontWeight:600 }}>${live.price}</span>
            {live.originalPrice>live.price && <span style={{ fontSize:18, color:t.textMuted, textDecoration:"line-through", marginLeft:12 }}>${live.originalPrice}</span>}
          </div>
          <GoldDivider />

          <p style={{ color:t.textSecondary, fontSize:14, lineHeight:1.75, margin:"16px 0 20px" }}>{live.description}</p>

          {/* Qty */}
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:22 }}>
            <span style={{ fontSize:12, color:t.textMuted, letterSpacing:"0.04em" }}>QTY</span>
            <div style={{ display:"flex", alignItems:"center", border:`1px solid ${t.border}`, borderRadius:9, overflow:"hidden" }}>
              <button onClick={() => setQty(Math.max(1,qty-1))} style={{ width:36,height:36,border:"none",background:t.bgMuted,color:t.textPrimary,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
              <span style={{ padding:"0 18px",fontSize:14,fontWeight:600,color:t.textPrimary }}>{qty}</span>
              <button onClick={() => setQty(Math.min(live.stock,qty+1))} style={{ width:36,height:36,border:"none",background:t.bgMuted,color:t.textPrimary,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
            </div>
            <span style={{ fontSize:11, color:live.stock<10?t.danger:t.textMuted }}>{live.stock} available</span>
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            <Btn size="lg" fullWidth disabled={live.stock===0} onClick={() => { for(let i=0;i<qty;i++) dispatch({type:ACTIONS.ADD_TO_CART,payload:live}); showToast(`${qty}× ${live.name} added`); }}>
              {live.stock===0?"Out of Stock":"Add to Cart"}
            </Btn>
            <Btn variant="outline" size="lg" onClick={() => dispatch({type:ACTIONS.TOGGLE_WISHLIST,payload:live.id})} style={{ fontSize:18,padding:"13px 16px" }}>
              {inWish?"♥":"♡"}
            </Btn>
          </div>

          <Collapsible title="Shipping & Returns" icon="◈">
            <p style={{ fontSize:13,color:t.textSecondary,lineHeight:1.7 }}>Free shipping on orders over $50. Standard delivery 3–5 business days. Free returns within 30 days.</p>
          </Collapsible>
        </div>
      </div>

      {/* ── Reviews ────────────────────────────────────────────────────────── */}
      <div style={{ background:t.bgCard, borderRadius:16, padding:24, border:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:t.textPrimary }}>
            Customer Reviews <span style={{ color:t.gold, fontSize:18 }}>({(live.reviewList||[]).length})</span>
          </h2>
          {!alreadyReviewed && user && (
            <Btn variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm?"Cancel":"✦ Write a Review"}
            </Btn>
          )}
          {alreadyReviewed && <Badge variant="gold">You've reviewed this</Badge>}
        </div>

        {/* Review form */}
        {showForm && !alreadyReviewed && (
          <div style={{ background:t.bgMuted, borderRadius:12, padding:20, marginBottom:24, border:`1px solid ${t.border}` }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:t.textPrimary, marginBottom:16 }}>Your Review</h3>

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:8, letterSpacing:"0.08em", textTransform:"uppercase" }}>Rating *</label>
              <StarPicker value={reviewForm.rating} onChange={v => setReviewForm({...reviewForm,rating:v})} />
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>Comment *</label>
              <textarea value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm,comment:e.target.value})} placeholder="Share your experience with this product…" rows={4}
                style={{ padding:"10px 14px",borderRadius:9,border:`1px solid ${t.border}`,width:"100%",resize:"vertical",background:t.bgSurface,color:t.textPrimary,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none" }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <MultiImageUpload previews={previews} onFiles={handleFiles} onRemove={removeAt} error={imgError} maxFiles={4} />
            </div>

            <Btn onClick={submitReview}>Submit Review</Btn>
          </div>
        )}

        {/* Existing reviews */}
        {(live.reviewList||[]).length===0 ? (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, opacity:0.2, color:t.textPrimary, marginBottom:10 }}>★</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:t.textMuted }}>No reviews yet. Be the first!</p>
          </div>
        ) : [...live.reviewList].reverse().map((r, i) => (
          <div key={r.id} style={{ padding:"18px 0", borderBottom: i<live.reviewList.length-1?`1px solid ${t.border}`:"none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#2A1F3D,#1C1420)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color:"#C9A84C", border:"1.5px solid rgba(201,168,76,0.2)" }}>
                  {r.userName.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:t.textPrimary }}>{r.userName}</div>
                  <StarRating rating={r.rating} size={11} />
                </div>
              </div>
              <span style={{ fontSize:11, color:t.textMuted }}>{r.date}</span>
            </div>

            <p style={{ fontSize:14, color:t.textSecondary, lineHeight:1.65, marginBottom:(r.images||[]).length>0?12:0 }}>{r.comment}</p>

            {/* Review photos */}
            {(r.images||[]).length>0 && (
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {r.images.map((src,idx) => (
                  <img key={idx} src={src} alt="" style={{ width:72,height:72,objectFit:"cover",borderRadius:8,border:`1px solid ${t.border}`,cursor:"pointer" }}
                    onClick={() => window.open(src,"_blank")} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
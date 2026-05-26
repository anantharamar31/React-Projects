// src/pages/seller/SellerProducts.jsx
import { useState } from "react";
import { useStore, ACTIONS }           from "../../store/store.jsx";
import { useTheme, useToast, useImageUpload } from "../../hooks/app.hooks.jsx";
import { Toast, Modal, Badge, ProgressBar, GoldDivider } from "../../components/ui/BaseComponents.jsx";
import { Btn, InputField }             from "../../components/ui/Formcomponents.jsx";
import { ImageUpload }                 from "../../components/ui/Imageuploadwidgets.jsx";

const CATEGORIES  = ["Electronics","Clothing","Sports","Accessories","Home","Books","Beauty","Food"];
const EMOJI_LIST  = ["📦","🎧","👕","⌚","👛","👟","☕","🔋","📱","💻","🎮","📷","🛍","🏋","🌿","💄","🕶","🎒"];
const EMPTY_FORM  = { name:"", price:"", originalPrice:"", category:"Electronics", stock:"", description:"", imageEmoji:"📦" };
const STATUS_VARIANT = { active:"green", low_stock:"amber", out_of_stock:"red" };

export default function SellerProducts() {
  const { state, dispatch }  = useStore();
  const t                    = useTheme();
  const { toast, showToast, clearToast } = useToast();
  const { user }             = state.auth;

  const [showModal,   setShowModal]   = useState(false);
  const [editProd,    setEditProd]    = useState(null);
  const [filter,      setFilter]      = useState("all");
  const [sortBy,      setSortBy]      = useState("newest");
  const [confirmDel,  setConfirmDel]  = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);

  const { preview: imgPreview, handleFile, reset: resetImg, error: imgError } = useImageUpload();

  const myProducts = state.products.filter(p => p.sellerId === user?.id);
  const filtered   = myProducts.filter(p => filter==="all" || p.status===filter);
  const sorted     = [...filtered].sort((a,b) =>
    sortBy==="price_asc"  ? a.price-b.price  :
    sortBy==="price_desc" ? b.price-a.price  :
    sortBy==="sales"      ? b.sold-a.sold    :
    new Date(b.createdAt)-new Date(a.createdAt)
  );

  const openAdd = () => { setEditProd(null); setForm(EMPTY_FORM); resetImg(); setShowModal(true); };
  const openEdit = p => {
    setEditProd(p);
    setForm({ name:p.name, price:String(p.price), originalPrice:String(p.originalPrice), category:p.category, stock:String(p.stock), description:p.description, imageEmoji:p.imageEmoji||"📦" });
    resetImg(); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) { showToast("Name and price are required.", "error"); return; }
    const payload = { ...form, price:parseFloat(form.price), originalPrice:parseFloat(form.originalPrice||form.price), stock:parseInt(form.stock||0), image: imgPreview||(editProd?editProd.image:null) };
    if (editProd) dispatch({ type:ACTIONS.UPDATE_PRODUCT, payload:{...editProd,...payload} });
    else          dispatch({ type:ACTIONS.ADD_PRODUCT, payload });
    showToast(editProd?"Product updated.":"Product added!");
    setShowModal(false);
  };

  return (
    <div className="fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {confirmDel && (
        <Modal title="Delete Product" onClose={() => setConfirmDel(null)} width={360}>
          <p style={{ color:t.textSecondary, marginBottom:20, fontSize:14, lineHeight:1.6 }}>Permanently delete <strong style={{ color:t.textPrimary }}>{confirmDel.name}</strong>?</p>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost"  fullWidth onClick={() => setConfirmDel(null)}>Cancel</Btn>
            <Btn variant="danger" fullWidth onClick={() => { dispatch({ type:ACTIONS.DELETE_PRODUCT, payload:confirmDel.id }); setConfirmDel(null); showToast("Deleted.","info"); }}>Delete</Btn>
          </div>
        </Modal>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:t.textPrimary, marginBottom:2 }}>My Products</h2>
          <p style={{ color:t.textMuted, fontSize:13 }}>{myProducts.length} products · {myProducts.filter(p=>p.status==="active").length} active</p>
        </div>
        <Btn onClick={openAdd}>+ Add Product</Btn>
      </div>

      {/* Filters */}
      <div style={{ background:t.bgCard, borderRadius:12, padding:"12px 16px", border:`1px solid ${t.border}`, marginBottom:16, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:5 }}>
          {["all","active","low_stock","out_of_stock"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"6px 12px", borderRadius:7, border:`1px solid ${filter===f?t.gold:t.border}`, fontSize:11, fontWeight:500, background:filter===f?t.goldBg:"transparent", color:filter===f?t.gold:t.textMuted, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.04em" }}>
              {f==="all"?"All":f==="low_stock"?"Low Stock":f==="out_of_stock"?"Out of Stock":"Active"}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:"6px 10px", borderRadius:8, border:`1px solid ${t.border}`, fontSize:12, background:t.bgSurface, color:t.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="sales">Best Selling</option>
        </select>
      </div>

      {/* Product grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
        {sorted.map(p => (
          <div key={p.id} style={{ background:t.bgCard, borderRadius:14, border:`1px solid ${t.border}`, overflow:"hidden", transition:"transform 0.2s,box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
            <div style={{ background:t.bgMuted, height:140, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
              {p.image ? <img src={p.image} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:56 }}>{p.imageEmoji||"📦"}</span>}
              <div style={{ position:"absolute", top:10, right:10 }}>
                <Badge variant={STATUS_VARIANT[p.status]||"default"}>
                  {p.status==="active"?"Active":p.status==="low_stock"?"Low Stock":"Out of Stock"}
                </Badge>
              </div>
            </div>
            <div style={{ padding:14 }}>
              <div style={{ fontSize:14, fontWeight:500, color:t.textPrimary, marginBottom:3 }}>{p.name}</div>
              <div style={{ fontSize:11, color:t.textMuted, marginBottom:8 }}>{p.category}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:t.gold }}>${p.price}</span>
                <span style={{ fontSize:11, color:t.textMuted }}>{p.sold} sold</span>
              </div>
              <ProgressBar value={p.stock} max={200} color={p.stock===0?t.danger:p.stock<10?t.warning:t.success} />
              <div style={{ fontSize:10, color:t.textMuted, margin:"4px 0 10px" }}>{p.stock} in stock</div>
              <div style={{ display:"flex", gap:7 }}>
                <Btn variant="outline" size="sm" onClick={() => openEdit(p)} style={{ flex:1 }}>Edit</Btn>
                <Btn variant="danger"  size="sm" onClick={() => setConfirmDel(p)} style={{ flex:1 }}>Delete</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal title={editProd?"Edit Product":"New Product"} onClose={() => setShowModal(false)} width={560}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <ImageUpload
                label="Product Photo" hint="JPG, PNG or WEBP · max 5MB"
                preview={imgPreview||(editProd?.image||null)}
                onFile={handleFile} onReset={resetImg} error={imgError}
              />
            </div>

            {!imgPreview && !editProd?.image && (
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>Emoji Fallback</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {EMOJI_LIST.map(e => (
                    <button key={e} onClick={() => setForm({...form,imageEmoji:e})} style={{ width:36, height:36, fontSize:18, borderRadius:8, border:`1.5px solid ${form.imageEmoji===e?t.gold:t.border}`, background:form.imageEmoji===e?t.goldBg:t.bgMuted }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ gridColumn:"1/-1" }}><InputField label="Product Name *" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Silk Evening Dress" /></div>
            <InputField label="Sale Price *"   type="number" value={form.price}         onChange={e => setForm({...form,price:e.target.value})}         placeholder="0.00" />
            <InputField label="Original Price" type="number" value={form.originalPrice} onChange={e => setForm({...form,originalPrice:e.target.value})} placeholder="0.00" />
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>Category</label>
              <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={{ padding:"10px 14px", borderRadius:9, border:`1px solid ${t.border}`, width:"100%", background:t.bgSurface, color:t.textPrimary, fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <InputField label="Stock Qty" type="number" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} placeholder="0" />
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} rows={3} placeholder="Describe this product in detail…" style={{ padding:"10px 14px", borderRadius:9, border:`1px solid ${t.border}`, width:"100%", resize:"vertical", background:t.bgSurface, color:t.textPrimary, fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none" }} />
            </div>
          </div>
          <GoldDivider />
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <Btn variant="ghost" fullWidth onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn fullWidth onClick={handleSave}>{editProd?"Update Product":"Add Product"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
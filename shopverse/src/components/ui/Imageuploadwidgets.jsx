// src/components/ui/ImageUploadWidgets.jsx
import { useState } from "react";
import { useTheme } from "../../hooks/app.hooks";

// ─── SINGLE IMAGE UPLOAD ──────────────────────────────────────────────────────
// Used by sellers to upload a product photo (drag-and-drop + browse)
export function ImageUpload({
  preview, onFile, onReset,
  error,
  label = "Product Image",
  hint  = "JPG, PNG or WEBP · max 5MB",
}) {
  const t = useTheme();
  const [dragging, setDragging] = useState(false);

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div>
      {label && <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</label>}

      {preview ? (
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${t.border}` }}>
          <img src={preview} alt="Preview" style={{ width:"100%", maxHeight:200, objectFit:"cover", display:"block" }} />
          <button onClick={onReset} style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.6)", border:"none", borderRadius:6, color:"#fff", width:28, height:28, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
      ) : (
        <label
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"28px 20px", borderRadius:12, cursor:"pointer", textAlign:"center", border:`2px dashed ${dragging ? t.gold : t.border}`, background:dragging ? t.goldBg : t.bgMuted, transition:"all 0.2s" }}
        >
          <input type="file" accept="image/*" onChange={e => onFile(e.target.files[0])} style={{ display:"none" }} />
          <span style={{ fontSize:32, marginBottom:8, opacity:0.4 }}>📷</span>
          <span style={{ fontSize:13, color:t.textPrimary, fontWeight:500, marginBottom:3 }}>
            Drop image here or <span style={{ color:t.gold }}>browse</span>
          </span>
          <span style={{ fontSize:11, color:t.textMuted }}>{hint}</span>
        </label>
      )}

      {error && <p style={{ fontSize:11, color:t.danger, marginTop:5 }}>{error}</p>}
    </div>
  );
}

// ─── MULTI IMAGE UPLOAD ───────────────────────────────────────────────────────
// Used by customers to attach review photos (up to 4 images)
export function MultiImageUpload({ previews, onFiles, onRemove, error, maxFiles = 4 }) {
  const t = useTheme();
  const [dragging, setDragging] = useState(false);

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    onFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label style={{ fontSize:11, fontWeight:600, color:t.textMuted, display:"block", marginBottom:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>
        Photo Reviews ({previews.length}/{maxFiles})
      </label>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
        {previews.map((src, i) => (
          <div key={i} style={{ position:"relative", width:72, height:72, borderRadius:8, overflow:"hidden", border:`1px solid ${t.border}` }}>
            <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <button onClick={() => onRemove(i)} style={{ position:"absolute", top:2, right:2, background:"rgba(0,0,0,0.65)", border:"none", borderRadius:4, color:"#fff", width:20, height:20, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          </div>
        ))}

        {previews.length < maxFiles && (
          <label
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{ width:72, height:72, borderRadius:8, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:`2px dashed ${dragging ? t.gold : t.border}`, background:dragging ? t.goldBg : t.bgMuted, transition:"all 0.2s" }}
          >
            <input type="file" accept="image/*" multiple onChange={e => onFiles(e.target.files)} style={{ display:"none" }} />
            <span style={{ fontSize:20, opacity:0.4 }}>+</span>
            <span style={{ fontSize:9, color:t.textMuted, marginTop:2 }}>Add</span>
          </label>
        )}
      </div>

      {error && <p style={{ fontSize:11, color:t.danger }}>{error}</p>}
    </div>
  );
}
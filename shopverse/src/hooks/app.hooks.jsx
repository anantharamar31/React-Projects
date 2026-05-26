import { useState, useCallback } from "react";
import { THEMES }    from "../theme/theme.tokens";
import { useStore }  from "../store/store";

// ─── useTheme ─────────────────────────────────────────────────────────────────
// Returns the active theme token object based on Redux UI state
export function useTheme() {
  const { state } = useStore();
  return THEMES[state.ui.theme] || THEMES.light;
}

// ─── useToast ─────────────────────────────────────────────────────────────────
// Simple toast state manager — returns { toast, showToast, clearToast }
export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast  = useCallback((message, type = "success") => setToast({ message, type }), []);
  const clearToast = useCallback(() => setToast(null), []);
  return { toast, showToast, clearToast };
}

// ─── useImageUpload ───────────────────────────────────────────────────────────
// Single image → base64 — for product photos
// Returns { preview, handleFile, reset, error }
export function useImageUpload({ maxSizeMB = 5 } = {}) {
  const [preview, setPreview] = useState(null);
  const [error,   setError]   = useState(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select a valid image file (JPG, PNG, WEBP)."); return; }
    if (file.size / 1024 / 1024 > maxSizeMB) { setError(`Image must be smaller than ${maxSizeMB}MB.`); return; }
    setError(null);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }, [maxSizeMB]);

  const reset = useCallback(() => { setPreview(null); setError(null); }, []);
  return { preview, handleFile, reset, error };
}

// ─── useMultiImageUpload ──────────────────────────────────────────────────────
// Multiple images array — for review photos (up to 4)
// Returns { previews, handleFiles, removeAt, reset, error }
export function useMultiImageUpload({ maxFiles = 4, maxSizeMB = 5 } = {}) {
  const [previews, setPreviews] = useState([]);
  const [error,    setError]    = useState(null);

  const handleFiles = useCallback((files) => {
    const arr = Array.from(files);
    if (previews.length + arr.length > maxFiles) { setError(`Up to ${maxFiles} images allowed.`); return; }
    arr.forEach(file => {
      if (!file.type.startsWith("image/")) { setError("Images only."); return; }
      if (file.size / 1024 / 1024 > maxSizeMB) { setError(`Each image must be under ${maxSizeMB}MB.`); return; }
      setError(null);
      const reader = new FileReader();
      reader.onload = e => setPreviews(prev => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  }, [previews.length, maxFiles, maxSizeMB]);

  const removeAt = useCallback(idx => setPreviews(prev => prev.filter((_, i) => i !== idx)), []);
  const reset    = useCallback(() => { setPreviews([]); setError(null); }, []);
  return { previews, handleFiles, removeAt, reset, error };
}
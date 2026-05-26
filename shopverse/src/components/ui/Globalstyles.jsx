// src/components/ui/GlobalStyles.jsx
export default function GlobalStyles({ t }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      @keyframes slideIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
      @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

      body { font-family:'DM Sans',system-ui,sans-serif; }
      input, textarea, select { font-family:'DM Sans',system-ui,sans-serif; outline:none; }
      input::placeholder, textarea::placeholder { color:${t.textMuted}; }

      ::-webkit-scrollbar        { width:4px; height:4px; }
      ::-webkit-scrollbar-track  { background:transparent; }
      ::-webkit-scrollbar-thumb  { background:${t.border}; border-radius:2px; }

      button { font-family:'DM Sans',system-ui,sans-serif; cursor:pointer; transition:all 0.18s ease; }
      button:not(:disabled):hover  { opacity:0.88; transform:translateY(-1px); }
      button:not(:disabled):active { transform:translateY(0); }
      button:disabled { cursor:not-allowed; }

      .fade-up  { animation: fadeUp  0.35s cubic-bezier(0.4,0,0.2,1); }
      .slide-in { animation: slideIn 0.25s ease; }
    `}</style>
  );
}
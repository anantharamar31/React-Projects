// ─── SHOPVERSE DESIGN TOKENS ─────────────────────────────────────────────────
// Obsidian × Liquid Gold luxury palette — full light / dark support

export const THEMES = {
  light: {
    // ── Backgrounds ──────────────────────────────────────────────────────────
    bgPage:    "#F5F0E8",   // warm ivory
    bgSurface: "#FDFBF7",   // cream white
    bgCard:    "#FFFFFF",
    bgMuted:   "#F0EBE1",   // warm sand
    bgHover:   "#EDE6D8",

    // ── Sidebar (always dark) ─────────────────────────────────────────────────
    sidebarBg:         "#0D0B0F",
    sidebarAccent:     "#C9A84C",
    sidebarText:       "rgba(255,255,255,0.55)",
    sidebarTextActive: "#C9A84C",
    sidebarActiveBg:   "rgba(201,168,76,0.12)",

    // ── Text ─────────────────────────────────────────────────────────────────
    textPrimary:   "#1A1410",
    textSecondary: "#7A6E62",
    textMuted:     "#A89F93",
    textGold:      "#B8922A",

    // ── Borders ──────────────────────────────────────────────────────────────
    border:      "#E4DDD0",
    borderHover: "#C9A84C",

    // ── Gold Accent ───────────────────────────────────────────────────────────
    gold:      "#C9A84C",
    goldDark:  "#A07830",
    goldLight: "#F0D690",
    goldBg:    "#FBF3DC",

    // ── Semantic Colors ───────────────────────────────────────────────────────
    success: "#2A7A4B", successBg: "#D6F0E3",
    danger:  "#A83228", dangerBg:  "#F5DDD9",
    warning: "#8A6010", warningBg: "#FBF0D0",
    info:    "#1E4E82", infoBg:    "#D5E8F8",

    // ── Nav ───────────────────────────────────────────────────────────────────
    navBg:     "#FDFBF7",
    navBorder: "#E4DDD0",
  },

  dark: {
    // ── Backgrounds ──────────────────────────────────────────────────────────
    bgPage:    "#0D0B0F",   // obsidian
    bgSurface: "#141118",   // near-black purple
    bgCard:    "#1C1820",   // dark plum
    bgMuted:   "#231F28",   // muted dark
    bgHover:   "#2A2530",

    // ── Sidebar ───────────────────────────────────────────────────────────────
    sidebarBg:         "#090709",   // deeper obsidian
    sidebarAccent:     "#C9A84C",
    sidebarText:       "rgba(255,255,255,0.45)",
    sidebarTextActive: "#C9A84C",
    sidebarActiveBg:   "rgba(201,168,76,0.15)",

    // ── Text ─────────────────────────────────────────────────────────────────
    textPrimary:   "#F0EBE1",
    textSecondary: "#9B9097",
    textMuted:     "#5E5860",
    textGold:      "#C9A84C",

    // ── Borders ──────────────────────────────────────────────────────────────
    border:      "#2E2832",
    borderHover: "#C9A84C",

    // ── Gold Accent ───────────────────────────────────────────────────────────
    gold:      "#C9A84C",
    goldDark:  "#A07830",
    goldLight: "#F0D690",
    goldBg:    "rgba(201,168,76,0.12)",

    // ── Semantic Colors ───────────────────────────────────────────────────────
    success: "#4ABA7C", successBg: "rgba(74,186,124,0.15)",
    danger:  "#E06055", dangerBg:  "rgba(224,96,85,0.15)",
    warning: "#D4A030", warningBg: "rgba(212,160,48,0.15)",
    info:    "#5A9FD4", infoBg:    "rgba(90,159,212,0.15)",

    // ── Nav ───────────────────────────────────────────────────────────────────
    navBg:     "#141118",
    navBorder: "#2E2832",
  },
};

export const FONTS = {
  display: "'Cormorant Garamond', Georgia, serif",
  body:    "'DM Sans', system-ui, sans-serif",
};
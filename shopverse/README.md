# ShopVerse — Luxury E-Commerce Marketplace

Obsidian × Liquid Gold aesthetic · Full Seller & Customer portals ·
Image upload for products & reviews · OTP auth · Redux state · Dark/Light mode

---

## Setup Commands

```bash
# 1 — Create the Vite + React project scaffold
npm create vite@latest shopverse -- --template react
cd shopverse

# 2 — Install dependencies
npm install

# 3 — Remove the default Vite boilerplate
rm -rf src/App.jsx src/App.css src/assets src/index.css

# 4 — Copy all project source files into src/
#     (replace the src/ folder with the one provided)

# 5 — Start the dev server
npm run dev
```

Open http://localhost:3000

---

## Project File Tree

```
shopverse/
├── index.html                              ← HTML shell
├── package.json                            ← Dependencies & scripts
├── vite.config.js                          ← Vite configuration
│
└── src/
    ├── main.jsx                            ← React entry point
    ├── AppShell.jsx                        ← Root: StoreProvider + AuthGate + AppRouter
    │
    ├── theme/
    │   └── theme.tokens.js                 ← Light & dark color token objects
    │
    ├── store/
    │   └── store.js                        ← ACTIONS · appReducer · initialState
    │                                          StoreContext · useStore · StoreProvider · DEMO_USERS
    │
    ├── hooks/
    │   └── app.hooks.js                    ← useTheme · useToast
    │                                          useImageUpload · useMultiImageUpload
    │
    ├── utils/
    │   └── helpers.js                      ← formatPrice · discountPct · stockStatus
    │                                          truncate · getInitials · calcAvgRating
    │
    ├── components/
    │   ├── ui/
    │   │   ├── GlobalStyles.jsx            ← @keyframes, font imports, global resets
    │   │   ├── BaseComponents.jsx          ← Toast · Modal · Collapsible · Avatar
    │   │   │                                  Badge · GoldDivider · ProgressBar
    │   │   ├── FormComponents.jsx          ← InputField · Btn · Toggle
    │   │   │                                  StarRating · StarPicker
    │   │   └── ImageUploadWidgets.jsx      ← ImageUpload (single, drag-drop)
    │   │                                      MultiImageUpload (review photos, up to 4)
    │   │
    │   └── layout/
    │       ├── Sidebar.jsx                 ← Collapsible sidebar, role-aware nav
    │       ├── TopNav.jsx                  ← Search · theme toggle · notifications · cart
    │       └── CartDrawer.jsx              ← Slide-in cart panel
    │
    └── pages/
        ├── auth/
        │   └── AuthPage.jsx               ← Login · Register · 6-digit OTP verification
        │
        ├── seller/
        │   ├── SellerDashboard.jsx        ← KPI stats · category bars · recent orders · top products
        │   ├── SellerProducts.jsx         ← Grid + Add/Edit modal with IMAGE UPLOAD (drag-drop)
        │   ├── SellerOrders.jsx           ← Pipeline tracker · status updates
        │   ├── SellerAnalytics.jsx        ← Revenue charts · monthly bars · review ratings
        │   ├── SellerCustomers.jsx        ← Per-customer order & spend cards
        │   └── SellerSettings.jsx         ← Profile · notifications · security · policies
        │
        └── customer/
            ├── CustomerShop.jsx           ← Product grid · category pills · search · wishlist
            ├── ProductDetail.jsx          ← Full detail · REVIEWS with photo upload (up to 4)
            ├── Checkout.jsx               ← 3-step wizard (Address → Payment → Review)
            ├── CustomerOrders.jsx         ← Order history with status pipeline
            ├── CustomerWishlist.jsx       ← Saved products
            └── CustomerProfile.jsx       ← Edit profile · notifications · security
```

---

## Demo Accounts

| Role     | Email                | Password |
|----------|----------------------|----------|
| Seller   | seller@demo.com      | demo123  |
| Customer | customer@demo.com    | demo123  |

---

## Image Upload Details

| Feature             | Where                        | Limit                  |
|---------------------|------------------------------|------------------------|
| Product photo       | Seller → Add/Edit product    | 1 image · max 5 MB     |
| Review photos       | Customer → Product detail    | Up to 4 images · 5 MB each |

All images stored as **base64 data URLs** in Redux state (no backend required).
For production, swap `FileReader → base64` in `hooks/app.hooks.js` with an
S3 / Cloudinary presigned upload call.

---

## Key Features

- **Auth** — Login/Register with 6-digit OTP (individual input boxes, auto-focus, backspace navigation)
- **Seller Hub** — Dashboard, Products (image upload), Orders, Analytics, Customers, Settings
- **Customer Portal** — Shop, Product Detail (reviews + photos), Checkout, Orders, Wishlist, Profile
- **Redux State** — Single `store.js` with all ACTIONS, reducer, and StoreProvider
- **Theme System** — Full light/dark token objects in `theme.tokens.js`, toggled via TopNav
- **Luxury Design** — Obsidian sidebar · warm ivory light mode · Cormorant Garamond + DM Sans · liquid gold accents
- **Collapsibles, Toggles, Progress bars, Badges** — consistent UI primitives across both portals
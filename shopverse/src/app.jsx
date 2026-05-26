// src/AppShell.jsx
// Root component — assembles layout, router, and all pages
import { useState }       from "react";
import { StoreProvider }  from "./store/store.jsx";
import { useStore }       from "./store/store.jsx";
import { useTheme }       from "./hooks/app.hooks.jsx";

// Layout
import GlobalStyles       from "./components/ui/Globalstyles.jsx";
import Sidebar            from "./components/layout/Sidebar.jsx";
import TopNav             from "./components/layout/Topnav.jsx";
import CartDrawer         from "./components/layout/Cartdrawer.jsx";

// Auth
import AuthPage           from "./pages/auth/Authpage.jsx";

// Seller pages
import SellerDashboard    from "./pages/seller/Sellerdashboard.jsx";
import SellerProducts     from "./pages/seller/Selllerproducts.jsx";
import SellerOrders       from "./pages/seller/Sellerorders.jsx";
import SellerAnalytics    from "./pages/seller/Selleranalytics.jsx";
import SellerCustomers    from "./pages/seller/Sellercustomers.jsx";
import SellerSettings     from "./pages/seller/Sellersettings.jsx";

// Customer pages
import CustomerShop       from "./pages/customer/Customershop.jsx";
import ProductDetail      from "./pages/customer/Productdetail.jsx";
import Checkout           from "./pages/customer/Checkout.jsx";
import CustomerOrders     from "./pages/customer/Customerorders.jsx";
import CustomerWishlist   from "./pages/customer/Customerwishlist.jsx";
import CustomerProfile    from "./pages/customer/Customerprofile.jsx";

// ─── ROUTER ───────────────────────────────────────────────────────────────────
function AppRouter() {
  const { state }   = useStore();
  const t           = useTheme();
  const { user }    = state.auth;
  const isSeller    = user?.role === "seller";

  const [activeView,  setActiveView]  = useState(isSeller ? "dashboard" : "home");
  const [detailProd,  setDetailProd]  = useState(null);

  const openDetail = p => { setDetailProd(p); setActiveView("detail"); };
  const closeDetail = () => { setDetailProd(null); setActiveView("shop"); };

  const renderPage = () => {
    // ── Seller routes ─────────────────────────────────────────────────────────
    if (isSeller) {
      switch (activeView) {
        case "dashboard": return <SellerDashboard />;
        case "products":  return <SellerProducts />;
        case "orders":    return <SellerOrders />;
        case "analytics": return <SellerAnalytics />;
        case "customers": return <SellerCustomers />;
        case "settings":  return <SellerSettings />;
        default:          return <SellerDashboard />;
      }
    }
    // ── Customer routes ───────────────────────────────────────────────────────
    switch (activeView) {
      case "home":
      case "shop":     return <CustomerShop showDetail={openDetail} />;
      case "detail":   return detailProd ? <ProductDetail product={detailProd} onBack={closeDetail} /> : <CustomerShop showDetail={openDetail} />;
      case "checkout": return <Checkout setActiveView={setActiveView} />;
      case "orders":   return <CustomerOrders />;
      case "wishlist": return <CustomerWishlist showDetail={openDetail} />;
      case "profile":  return <CustomerProfile />;
      default:         return <CustomerShop showDetail={openDetail} />;
    }
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", background:t.bgPage, color:t.textPrimary, display:"flex", flexDirection:"column", transition:"background 0.3s,color 0.3s" }}>
      <GlobalStyles t={t} />
      <div style={{ display:"flex", flex:1, minHeight:"100vh" }}>
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          <TopNav activeView={activeView} />
          <div style={{ flex:1, padding:"24px", overflowX:"hidden" }}>
            {/* key triggers fade-up animation on route change */}
            <div key={activeView} className="fade-up">{renderPage()}</div>
          </div>
        </div>
      </div>
      {!isSeller && <CartDrawer setActiveView={setActiveView} />}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function AuthGate() {
  const { state } = useStore();
  return state.auth.isAuthenticated ? <AppRouter /> : <AuthPage />;
}

export default function App() {
  return (
    <StoreProvider>
      <AuthGate />
    </StoreProvider>
  );
}
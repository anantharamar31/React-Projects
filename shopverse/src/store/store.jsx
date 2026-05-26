import { createContext, useContext, useReducer } from "react";

// ─── ACTION TYPES ─────────────────────────────────────────────────────────────
export const ACTIONS = {
  LOGIN:            "LOGIN",
  LOGOUT:           "LOGOUT",
  SET_OTP_SENT:     "SET_OTP_SENT",
  SET_PENDING_USER: "SET_PENDING_USER",

  ADD_TO_CART:      "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_CART_QTY:  "UPDATE_CART_QTY",
  CLEAR_CART:       "CLEAR_CART",

  ADD_PRODUCT:    "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",

  PLACE_ORDER:         "PLACE_ORDER",
  UPDATE_ORDER_STATUS: "UPDATE_ORDER_STATUS",

  TOGGLE_WISHLIST: "TOGGLE_WISHLIST",
  ADD_REVIEW:      "ADD_REVIEW",

  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  TOGGLE_CART:    "TOGGLE_CART",
  SET_THEME:      "SET_THEME",
  SET_CATEGORY:   "SET_CATEGORY",
  SET_SEARCH:     "SET_SEARCH",
  SET_SORT:       "SET_SORT",

  MARK_NOTIFICATION_READ: "MARK_NOTIFICATION_READ",
  ADD_NOTIFICATION:       "ADD_NOTIFICATION",
};

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
export const DEMO_USERS = {
  "seller@demo.com": {
    id: "s1", name: "Alex Rivera", email: "seller@demo.com",
    role: "seller", phone: "+1 555-0101",
    storeName: "Maison Rivera", storeRating: 4.7,
  },
  "customer@demo.com": {
    id: "c1", name: "Jamie Chen", email: "customer@demo.com",
    role: "customer", phone: "+1 555-0202",
    address: "123 Main St, New York, NY 10001",
    memberSince: "2023-06",
  },
};

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
export const initialState = {
  auth: {
    user: null, isAuthenticated: false,
    otpSent: false, pendingUser: null,
  },

  products: [
    {
      id: 1, name: "Wireless Headphones Pro", price: 149.99, originalPrice: 199.99,
      category: "Electronics", stock: 45, sold: 230, sellerId: "s1",
      image: null, imageEmoji: "🎧",
      description: "Premium noise-cancelling wireless headphones with 40-hour battery life.",
      status: "active", createdAt: "2024-01-15",
      reviewList: [
        { id: 1, userId: "c1", userName: "Jamie Chen", rating: 5, comment: "Incredible sound quality. Worth every penny!", images: [], date: "2024-03-05" },
        { id: 2, userId: "c2", userName: "Taylor Kim", rating: 4, comment: "Very comfortable for long sessions.", images: [], date: "2024-03-08" },
      ],
    },
    {
      id: 2, name: "Organic Cotton T-Shirt", price: 29.99, originalPrice: 39.99,
      category: "Clothing", stock: 120, sold: 89, sellerId: "s1",
      image: null, imageEmoji: "👕",
      description: "100% organic cotton, GOTS certified. Buttery soft and eco-friendly.",
      status: "active", createdAt: "2024-02-10",
      reviewList: [
        { id: 1, userId: "c1", userName: "Jamie Chen", rating: 4, comment: "Super soft, fits perfectly.", images: [], date: "2024-02-20" },
      ],
    },
    {
      id: 3, name: "Smart Watch Series X", price: 299.99, originalPrice: 349.99,
      category: "Electronics", stock: 12, sold: 567, sellerId: "s2",
      image: null, imageEmoji: "⌚",
      description: "Advanced health tracking smartwatch with ECG and SpO2 monitoring.",
      status: "active", createdAt: "2024-01-20",
      reviewList: [
        { id: 1, userId: "c1", userName: "Jamie Chen", rating: 5, comment: "Best smartwatch I've ever owned.", images: [], date: "2024-03-10" },
      ],
    },
    {
      id: 4, name: "Leather Wallet Slim", price: 49.99, originalPrice: 59.99,
      category: "Accessories", stock: 78, sold: 156, sellerId: "s1",
      image: null, imageEmoji: "👛",
      description: "Genuine full-grain leather, RFID-blocking. Holds up to 12 cards.",
      status: "active", createdAt: "2024-03-01", reviewList: [],
    },
    {
      id: 5, name: "Running Shoes Ultra", price: 89.99, originalPrice: 119.99,
      category: "Sports", stock: 34, sold: 445, sellerId: "s2",
      image: null, imageEmoji: "👟",
      description: "Responsive foam midsole for maximum energy return on every stride.",
      status: "active", createdAt: "2024-02-28", reviewList: [],
    },
    {
      id: 6, name: "Coffee Maker Deluxe", price: 79.99, originalPrice: 99.99,
      category: "Home", stock: 5, sold: 78, sellerId: "s1",
      image: null, imageEmoji: "☕",
      description: "12-cup programmable with thermal carafe and built-in grinder.",
      status: "low_stock", createdAt: "2024-01-05", reviewList: [],
    },
    {
      id: 7, name: "Yoga Mat Premium", price: 39.99, originalPrice: 55.99,
      category: "Sports", stock: 0, sold: 321, sellerId: "s2",
      image: null, imageEmoji: "🧘",
      description: "6mm natural rubber, non-slip surface, alignment lines printed.",
      status: "out_of_stock", createdAt: "2024-03-10", reviewList: [],
    },
    {
      id: 8, name: "Portable Charger 20K", price: 34.99, originalPrice: 44.99,
      category: "Electronics", stock: 89, sold: 612, sellerId: "s1",
      image: null, imageEmoji: "🔋",
      description: "20000mAh with 65W USB-C PD fast charging for laptops and phones.",
      status: "active", createdAt: "2024-02-15", reviewList: [],
    },
  ],

  cart: [],

  orders: [
    { id: "ORD-001", customerId: "c1", sellerId: "s1", items: [{ productId: 1, qty: 1, price: 149.99 }], total: 149.99, status: "delivered",  date: "2024-03-01", address: "123 Main St, NY" },
    { id: "ORD-002", customerId: "c1", sellerId: "s2", items: [{ productId: 3, qty: 1, price: 299.99 }], total: 299.99, status: "shipped",    date: "2024-03-10", address: "123 Main St, NY" },
    { id: "ORD-003", customerId: "c2", sellerId: "s1", items: [{ productId: 2, qty: 2, price: 29.99 }, { productId: 4, qty: 1, price: 49.99 }], total: 109.97, status: "processing", date: "2024-03-12", address: "456 Oak Ave, CA" },
    { id: "ORD-004", customerId: "c2", sellerId: "s2", items: [{ productId: 5, qty: 1, price: 89.99 }], total: 89.99,  status: "pending",    date: "2024-03-14", address: "456 Oak Ave, CA" },
  ],

  wishlist: [],

  notifications: [
    { id: 1, message: "Your order ORD-001 has been delivered!",   type: "success", read: false, time: "2h ago" },
    { id: 2, message: "Flash sale: 30% off electronics today!",   type: "info",    read: false, time: "5h ago" },
    { id: 3, message: "An item in your wishlist is now on sale",  type: "warning", read: true,  time: "1d ago" },
  ],

  ui: {
    sidebarOpen: true, cartOpen: false, theme: "light",
    activeCategory: "All", searchQuery: "", sortBy: "popular",
  },
};

// ─── REDUCER ──────────────────────────────────────────────────────────────────
export function appReducer(state, { type, payload }) {
  switch (type) {

    case ACTIONS.SET_PENDING_USER: return { ...state, auth: { ...state.auth, pendingUser: payload } };
    case ACTIONS.SET_OTP_SENT:     return { ...state, auth: { ...state.auth, otpSent: payload } };
    case ACTIONS.LOGIN:            return { ...state, auth: { user: payload, isAuthenticated: true, otpSent: false, pendingUser: null } };
    case ACTIONS.LOGOUT:           return { ...state, auth: { user: null, isAuthenticated: false, otpSent: false, pendingUser: null }, cart: [], wishlist: [] };

    case ACTIONS.ADD_TO_CART: {
      const exists = state.cart.find(i => i.id === payload.id);
      return { ...state, cart: exists ? state.cart.map(i => i.id === payload.id ? { ...i, qty: i.qty + 1 } : i) : [...state.cart, { ...payload, qty: 1 }] };
    }
    case ACTIONS.REMOVE_FROM_CART: return { ...state, cart: state.cart.filter(i => i.id !== payload) };
    case ACTIONS.UPDATE_CART_QTY:  return { ...state, cart: state.cart.map(i => i.id === payload.id ? { ...i, qty: payload.qty } : i).filter(i => i.qty > 0) };
    case ACTIONS.CLEAR_CART:       return { ...state, cart: [] };

    case ACTIONS.ADD_PRODUCT: {
      const stock = parseInt(payload.stock || 0);
      return {
        ...state,
        products: [...state.products, {
          ...payload, id: Date.now(),
          sellerId: state.auth.user?.id, sold: 0, reviewList: [],
          status: stock === 0 ? "out_of_stock" : stock < 10 ? "low_stock" : "active",
          createdAt: new Date().toISOString().split("T")[0],
        }],
      };
    }
    case ACTIONS.UPDATE_PRODUCT: {
      const stock = parseInt(payload.stock || 0);
      return {
        ...state,
        products: state.products.map(p => p.id === payload.id
          ? { ...p, ...payload, status: stock === 0 ? "out_of_stock" : stock < 10 ? "low_stock" : "active" }
          : p
        ),
      };
    }
    case ACTIONS.DELETE_PRODUCT: return { ...state, products: state.products.filter(p => p.id !== payload) };

    case ACTIONS.PLACE_ORDER: {
      const order = {
        id: `ORD-${String(Date.now()).slice(-4)}`,
        customerId: state.auth.user?.id,
        sellerId:   payload.items[0]?.sellerId || "s1",
        items: payload.items, total: payload.total,
        status: "pending", date: new Date().toISOString().split("T")[0],
        address: payload.address,
      };
      return { ...state, orders: [...state.orders, order], cart: [] };
    }
    case ACTIONS.UPDATE_ORDER_STATUS: return { ...state, orders: state.orders.map(o => o.id === payload.id ? { ...o, status: payload.status } : o) };

    case ACTIONS.TOGGLE_WISHLIST: {
      const has = state.wishlist.includes(payload);
      return { ...state, wishlist: has ? state.wishlist.filter(id => id !== payload) : [...state.wishlist, payload] };
    }

    case ACTIONS.ADD_REVIEW: {
      const review = { ...payload.review, id: Date.now(), date: new Date().toISOString().split("T")[0] };
      return {
        ...state,
        products: state.products.map(p => {
          if (p.id !== payload.productId) return p;
          const list = [...(p.reviewList || []), review];
          const avg  = list.reduce((s, r) => s + r.rating, 0) / list.length;
          return { ...p, reviewList: list, rating: parseFloat(avg.toFixed(1)), reviews: list.length };
        }),
      };
    }

    case ACTIONS.TOGGLE_SIDEBAR: return { ...state, ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } };
    case ACTIONS.TOGGLE_CART:    return { ...state, ui: { ...state.ui, cartOpen: !state.ui.cartOpen } };
    case ACTIONS.SET_THEME:      return { ...state, ui: { ...state.ui, theme: payload } };
    case ACTIONS.SET_CATEGORY:   return { ...state, ui: { ...state.ui, activeCategory: payload } };
    case ACTIONS.SET_SEARCH:     return { ...state, ui: { ...state.ui, searchQuery: payload } };
    case ACTIONS.SET_SORT:       return { ...state, ui: { ...state.ui, sortBy: payload } };

    case ACTIONS.MARK_NOTIFICATION_READ: return { ...state, notifications: state.notifications.map(n => n.id === payload ? { ...n, read: true } : n) };
    case ACTIONS.ADD_NOTIFICATION:       return { ...state, notifications: [payload, ...state.notifications] };

    default: return state;
  }
}

// ─── CONTEXT + PROVIDER ───────────────────────────────────────────────────────
export const StoreContext = createContext(null);
export const useStore     = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}
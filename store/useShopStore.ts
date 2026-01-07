import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer"; 

/* =======================
   TYPES
======================= */

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  stock?: number;    
  quantity?: number; 
}

export interface Profile {
  id: string;
  full_name: string;
  address: string;
  role?: string; // 'admin' | 'user'
}

export interface Order {
  id: string;
  items: Product[];
  total: number;
  address: string;
  paymentMethod?: string;
  shipping_method?: string;
  shipping_cost?: number;
  createdAt: string;
}

interface PaymentMethod {
  id: string;
  name: string;
}

interface PaymentCategory {
  name: string;
  methods: PaymentMethod[];
}

/* =======================
   STORE STATE INTERFACE
======================= */

interface ShopState {
  /* --- AUTH & USER --- */
  user: any | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  /* --- PROFILE --- */
  profile: Profile | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (name: string, address: string) => Promise<void>;

  /* --- PRODUCT CRUD (ADMIN ONLY) --- */
  addProduct: (product: Omit<Product, "id">, imageUri?: string) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>, imageUri?: string) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;

  /* --- THEME --- */
  theme: "light" | "dark";
  toggleTheme: () => void;

  /* --- CART --- */
  cart: Product[];
  selectedCartItems: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleSelectCartItem: (id: string) => void;
  selectAllCartItems: () => void;
  deselectAllCartItems: () => void;
  fetchCart: () => Promise<void>;

  /* --- FAVORITES --- */
  favorites: Product[];
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorite: (id: string) => boolean;

  /* --- ORDERS --- */
  orders: Order[];
  fetchOrders: () => Promise<void>;

  /* --- CHECKOUT DATA --- */
  shippingMethod?: string;
  shippingCost: number;
  setShipping: (method: string, cost: number) => void;
  address: string;
  setAddress: (a: string) => void;
  paymentCategories: PaymentCategory[];
  selectedPayment?: PaymentMethod | null;
  setPaymentMethod: (m: PaymentMethod) => void;
  getTotalPrice: () => number;
  checkout: () => Promise<void>;
}

/* =======================
   HELPER: UPLOAD IMAGE
======================= */
const uploadImage = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`; 

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, arrayBuffer, {
        contentType: blob.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload failed exception:", error);
    return null;
  }
};

/* =======================
   STORE IMPLEMENTATION
======================= */

export const useShopStore = create<ShopState>((set, get) => ({
  /* ===== AUTH ===== */
  user: null,
  isAdmin: false,

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return false;

    set({ user: data.user });
    
    await get().fetchProfile(); 
    await get().fetchFavorites();
    await get().fetchCart();
    await get().fetchOrders();
    return true;
  },

  register: async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return !error;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      isAdmin: false,
      profile: null,
      cart: [],
      favorites: [],
      orders: [],
      selectedCartItems: [],
      address: "",
      selectedPayment: null,
    });
  },

  /* ===== PROFILE ===== */
  profile: null,

  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      set({ 
        profile: data,
        isAdmin: data.role === 'admin' 
      });
    }
  },

  updateProfile: async (full_name, address) => {
    const user = get().user;
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      full_name,
      address,
    });

    set((s) => ({
      profile: s.profile ? { ...s.profile, full_name, address } : null
    }));
  },

  /* ===== PRODUCT CRUD (ADMIN) ===== */
  
  addProduct: async (productData, imageUri) => {
    if (!get().isAdmin) return false;

    let finalImageUrl = productData.image || "";

    if (imageUri) {
        const uploadedUrl = await uploadImage(imageUri);
        if (uploadedUrl) {
            finalImageUrl = uploadedUrl;
        } else {
            console.error("Gagal upload gambar");
            return false; 
        }
    }
    const { error } = await supabase.from("products").insert({
      name: productData.name,
      price: productData.price,
      description: productData.description,
      category: productData.category || "General", 
      stock: productData.stock || 0,
      image: finalImageUrl,
    });

    if (error) {
        console.error("Error inserting product:", error);
    }

    return !error;
  },

  updateProduct: async (id, updates, imageUri) => {
    if (!get().isAdmin) return false;

    let finalImageUrl = updates.image;

    if (imageUri) {
        const uploadedUrl = await uploadImage(imageUri);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from("products")
      .update({ ...updates, image: finalImageUrl })
      .eq("id", id);

    if (error) console.error("Error updating product:", error);
    return !error;
  },

  deleteProduct: async (id) => {
    if (!get().isAdmin) return false;

    const { error } = await supabase.from("products").delete().eq("id", id);
    return !error;
  },

  /* ===== THEME ===== */
  theme: "light",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

  /* ===== CART ===== */
  cart: [],
  selectedCartItems: [],

  fetchCart: async () => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) {
      set({
        cart: data.map((c) => ({
          id: c.product_id,
          name: c.name,
          price: c.price,
          image: c.image,
          quantity: c.quantity,
          stock: 99,
        })),
      });
    }
  },

  addToCart: async (product) => {
    const user = get().user;
    if (!user) return;

    const existing = get().cart.find((c) => c.id === product.id);

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: (existing.quantity ?? 1) + 1 })
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      set((s) => ({
        cart: s.cart.map((c) =>
          c.id === product.id
            ? { ...c, quantity: (c.quantity ?? 1) + 1 }
            : c
        ),
      }));
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });

      set((s) => ({
        cart: [...s.cart, { ...product, quantity: 1 }],
      }));
    }
  },

  removeFromCart: (id) => {
      set((s) => ({
        cart: s.cart.filter((c) => c.id !== id),
        selectedCartItems: s.selectedCartItems.filter((sid) => sid !== id),
      }));
      
      const user = get().user;
      if (user) {
          supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", id).then();
      }
  },

  updateQuantity: (id, quantity) => {
    const newQty = Math.max(1, quantity);
    set((s) => ({
      cart: s.cart.map((c) =>
        c.id === id ? { ...c, quantity: newQty } : c
      ),
    }));

    const user = get().user;
    if (user) {
        supabase.from("cart_items").update({ quantity: newQty }).eq("user_id", user.id).eq("product_id", id).then();
    }
  },

  toggleSelectCartItem: (id) =>
    set((s) => ({
      selectedCartItems: s.selectedCartItems.includes(id)
        ? s.selectedCartItems.filter((sid) => sid !== id)
        : [...s.selectedCartItems, id],
    })),

  selectAllCartItems: () =>
    set((s) => ({ selectedCartItems: s.cart.map((c) => c.id) })),

  deselectAllCartItems: () => set({ selectedCartItems: [] }),

  /* ===== FAVORITES ===== */
  favorites: [],

  fetchFavorites: async () => {
    const user = get().user;
    if (!user) return;

    const { data: favs } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);

    if (!favs) return;
    const productIds = favs.map((f) => f.product_id);

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (products) {
      set({ favorites: products });
    }
  },

  toggleFavorite: async (product) => {
    const user = get().user;
    if (!user) return;

    const exists = get().favorites.some((f) => f.id === product.id);

    // Optimistic Update
    set((s) => ({
      favorites: exists
        ? s.favorites.filter((f) => f.id !== product.id)
        : [...s.favorites, product],
    }));

    if (exists) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);
    } else {
      await supabase.from("favorites").insert({
        user_id: user.id,
        product_id: product.id,
      });
    }
  },

  isFavorite: (id) => get().favorites.some((f) => f.id === id),

  /* ===== ORDERS ===== */
  orders: [],

  fetchOrders: async () => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id, total, address, payment_method, shipping_method, shipping_cost, created_at,
        order_items ( product_id, name, price, quantity )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      set({
        orders: data.map((o: any) => ({
          id: o.id,
          total: o.total,
          address: o.address,
          paymentMethod: o.payment_method,
          shipping_method: o.shipping_method,
          shipping_cost: o.shipping_cost,
          createdAt: o.created_at,
          items: o.order_items,
        })),
      });
    }
  },

  /* ===== CHECKOUT ===== */
  shippingMethod: undefined,
  shippingCost: 0,
  setShipping: (method, cost) => set({ shippingMethod: method, shippingCost: cost }),

  address: "",
  setAddress: (a) => set({ address: a }),

  paymentCategories: [
    {
      name: "E-Wallet",
      methods: [
        { id: "gopay", name: "GoPay" },
        { id: "ovo", name: "OVO" },
        { id: "dana", name: "DANA" },
      ],
    },
    {
      name: "Bank Transfer",
      methods: [
        { id: "bca", name: "BCA" },
        { id: "bni", name: "BNI" },
      ],
    },
  ],

  selectedPayment: null,
  setPaymentMethod: (m) => set({ selectedPayment: m }),

  getTotalPrice: () =>
    get()
      .cart.filter((c) => get().selectedCartItems.includes(c.id))
      .reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0),

  checkout: async () => {
    const user = get().user;
    if (!user) return;

    const {
      cart,
      selectedCartItems,
      address,
      selectedPayment,
      shippingMethod,
      shippingCost,
    } = get();

    const items = cart.filter((c) => selectedCartItems.includes(c.id));
    if (!items.length) return;

    const subtotal = items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
    const total = subtotal + (shippingCost ?? 0);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        address,
        payment_method: selectedPayment?.name,
        shipping_method: shippingMethod,
        shipping_cost: shippingCost,
      })
      .select()
      .single();

    if (error || !order) {
      console.error("Checkout Error:", error);
      return;
    }

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity ?? 1,
    }));

    await supabase.from("order_items").insert(orderItems);
    set({
      cart: [],
      selectedCartItems: [],
      address: "",
      selectedPayment: null,
      shippingMethod: undefined,
      shippingCost: 0,
    });
    await supabase.from("cart_items").delete().eq("user_id", user.id);
  },
}));

/* ===== SESSION RESTORE ===== */
supabase.auth.getSession().then(async ({ data }) => {
  if (data.session?.user) {
    useShopStore.setState({ user: data.session.user });
    
    const store = useShopStore.getState();
    await store.fetchProfile();
    await store.fetchFavorites();
    await store.fetchCart();
    await store.fetchOrders();
  }
});
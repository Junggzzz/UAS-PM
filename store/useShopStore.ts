import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  quantity?: number;
}

interface PaymentMethod {
  id: string;
  name: string;
}

interface PaymentCategory {
  name: string;
  methods: PaymentMethod[];
}

export interface Order {
  id: string;
  items: Product[];
  total: number;
  address: string;
  paymentMethod?: string;
  createdAt: string;
}

interface ShopState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (t: 'light' | 'dark') => void;

  cart: Product[];
  selectedCartItems: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;

  toggleSelectCartItem: (id: string) => void;
  selectAllCartItems: () => void;
  deselectAllCartItems: () => void;

  favorites: Product[];
  toggleFavorite: (product: Product) => void;

  orders: Order[];
  addOrder: (order: Order) => void;

  address: string;
  setAddress: (a: string) => void;

  paymentCategories: PaymentCategory[];
  selectedPayment?: PaymentMethod | null;
  setPaymentMethod: (m: PaymentMethod) => void;

  getTotalPrice: () => number;
  checkout: () => void;
  isFavorite: (id: string) => boolean;
}

export const useShopStore = create<ShopState>((set, get) => ({
  theme: 'light',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (t) => set({ theme: t }),

  cart: [],
  selectedCartItems: [],
  addToCart: (item) =>
    set((s) => {
      const existing = s.cart.find((c) => c.name === item.name); // samakan produk unik berdasarkan name
      if (existing) {
        return {
          cart: s.cart.map((c) =>
            c.id === existing.id ? { ...c, quantity: (c.quantity ?? 1) + 1 } : c
          ),
        };
      }
      const newItem = { ...item, id: nanoid(), quantity: 1 };
      return { cart: [...s.cart, newItem] };
    }),

  removeFromCart: (id) =>
    set((s) => ({
      cart: s.cart.filter((c) => c.id !== id),
      selectedCartItems: s.selectedCartItems.filter((sid) => sid !== id),
    })),

  clearCart: () => set({ cart: [], selectedCartItems: [] }),

  updateQuantity: (id, quantity) =>
    set((s) => ({
      cart: s.cart.map((c) =>
        c.id === id ? { ...c, quantity: quantity < 1 ? 1 : quantity } : c
      ),
    })),

  toggleSelectCartItem: (id) =>
    set((s) => ({
      selectedCartItems: s.selectedCartItems.includes(id)
        ? s.selectedCartItems.filter((sid) => sid !== id)
        : [...s.selectedCartItems, id],
    })),

  selectAllCartItems: () =>
    set((s) => ({ selectedCartItems: s.cart.map((c) => c.id) })),

  deselectAllCartItems: () => set({ selectedCartItems: [] }),

  favorites: [],
  toggleFavorite: (product) =>
    set((s) => {
      const exists = s.favorites.some((f) => f.id === product.id);
      return exists
        ? { favorites: s.favorites.filter((f) => f.id !== product.id) }
        : { favorites: [...s.favorites, product] };
    }),

  orders: [],
  addOrder: (order) => set((s) => ({ orders: [...s.orders, order] })),

  address: '',
  setAddress: (addr) => set({ address: addr }),

  paymentCategories: [
    {
      name: 'E-Wallet',
      methods: [
        { id: 'gopay', name: 'GoPay' },
        { id: 'ovo', name: 'OVO' },
        { id: 'dana', name: 'DANA' },
      ],
    },
    {
      name: 'Bank Transfer',
      methods: [
        { id: 'bca', name: 'BCA' },
        { id: 'bni', name: 'BNI' },
      ],
    },
  ],
  selectedPayment: null,
  setPaymentMethod: (method) => set({ selectedPayment: method }),

  getTotalPrice: () =>
    get().cart
      .filter((c) => get().selectedCartItems.includes(c.id))
      .reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0),

  checkout: () => {
    const { cart, orders, address, selectedPayment } = get();
    if (!cart.length) {
      console.warn('Keranjang kosong, tidak bisa checkout!');
      return;
    }
    const total = cart.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
    const newOrder: Order = {
      id: nanoid(),
      items: cart,
      total,
      address,
      paymentMethod: selectedPayment?.name,
      createdAt: new Date().toISOString(),
    };
    set({
      orders: [...orders, newOrder],
      cart: [],
      selectedCartItems: [],
      address: '',
      selectedPayment: null,
    });
    console.log('Checkout berhasil!', newOrder);
  },

  isFavorite: (id) => get().favorites.some((f) => f.id === id),
}));

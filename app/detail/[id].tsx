import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useShopStore, Product } from "@/store/useShopStore";
import { dark, light } from "@/theme/theme";
import Toast from "react-native-toast-message";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // --- STORE HOOKS ---
  const theme = useShopStore((s) => s.theme);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleFavorite = useShopStore((s) => s.toggleFavorite);
  const favorites = useShopStore((s) => s.favorites);
  const isAdmin = useShopStore((s) => s.isAdmin); 

  const themeObj = theme === "dark" ? dark : light;

  // --- LOCAL STATE ---
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // --- COMPUTED STATE (FAVORITE) ---
  const isFavorite = useMemo(() => {
    if (!product) return false;
    return favorites.some((item) => item.id === product.id);
  }, [favorites, product]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setProduct(data);
    } else {
      console.error("Error fetching product:", error);
    }
    setLoading(false);
  };

  /* ================= ACTIONS ================= */
  
  // 1. Tambah ke Keranjang
  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    
    Toast.show({
      type: "success_cart", 
      text1: "Berhasil!",
      text2: `${qty}x ${product.name} masuk keranjang`,
    });
  };

  // 2. Toggle Favorite
  const toggleFavoriteAction = async () => {
    if (!product) return;
    const willBeFavorite = !isFavorite;

    await toggleFavorite(product); 

    if (willBeFavorite) {
        Toast.show({
            type: "action_favorite",
            text1: "Disukai!",
            text2: "Produk disimpan ke favorit",
            visibilityTime: 1500,
        });
    } else {
        Toast.show({
            type: "remove_favorite",
            text1: "Dihapus",
            text2: "Produk dihapus dari favorit",
            visibilityTime: 1500,
        });
    }
  };

  // 3. Hapus Produk (ADMIN ONLY)
  const handleDelete = () => {
    Alert.alert(
      "Hapus Produk",
      "Apakah Anda yakin? Data yang dihapus tidak bisa dikembalikan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("products").delete().eq("id", id);
            
            if (error) {
                Alert.alert("Gagal", "Terjadi kesalahan saat menghapus.");
                return;
            }

            Toast.show({
              type: "remove_favorite", 
              text1: "Terhapus",
              text2: "Produk berhasil dihapus permanen",
            });
            
            router.replace("/home");
          },
        },
      ]
    );
  };

  // 4. Edit Produk (ADMIN ONLY)
  const handleEdit = () => {
    router.push({
        pathname: "/addproduct",
        params: { id: product?.id }
    });
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: themeObj.background }]}>
        <ActivityIndicator size="large" color={themeObj.accent} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: themeObj.background }]}>
        <Text style={{ color: themeObj.text }}>Produk tidak ditemukan</Text>
      </View>
    );
  }

  /* ================= RENDER UI ================= */
  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- IMAGE HEADER --- */}
        <View style={styles.imageContainer}>
            {product.image ? (
                <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
                />
            ) : (
                <View style={[styles.image, styles.center, {backgroundColor: '#EEE'}]}>
                    <Text style={{color: '#888'}}>No Image</Text>
                </View>
            )}
        </View>

        {/* --- PRODUCT INFO --- */}
        <Text style={[styles.name, { color: themeObj.text }]}>
            {product.name}
        </Text>

        <Text style={[styles.price, { color: themeObj.accent }]}>
            Rp {product.price.toLocaleString("id-ID")}
        </Text>

        {/* --- META DATA --- */}
        <View style={styles.metaRow}>
           <View style={[styles.badge, { backgroundColor: themeObj.subtext + '20' }]}>
              <Text style={{ color: themeObj.text, fontSize: 13, fontWeight: "600" }}>
                 📦 Stok: {product.stock ?? 0}
              </Text>
           </View>
        </View>

        {/* --- DESCRIPTION --- */}
        <Text style={[styles.sectionTitle, { color: themeObj.text }]}>Deskripsi Produk</Text>
        <Text style={[styles.desc, { color: themeObj.subtext }]}>
            {product.description ? product.description : "Tidak ada deskripsi untuk produk ini."}
        </Text>

        {/* --- CONTROLS --- */}
        
        {/* Quantity Selector */}
        <View style={styles.qtyRow}>
            <Text style={{color: themeObj.text, fontWeight:'bold', marginRight: 15}}>Jumlah:</Text>
            <View style={styles.qtyWrapper}>
                <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.qtyBtn}>
                    <Text style={styles.qtyText}>−</Text>
                </Pressable>
                
                <Text style={[styles.qtyValue, { color: themeObj.text }]}>
                    {qty}
                </Text>
                
                <Pressable onPress={() => setQty((q) => q + 1)} style={styles.qtyBtn}>
                    <Text style={styles.qtyText}>+</Text>
                </Pressable>
            </View>
        </View>

        {/* Action Buttons */}
        <View style={{gap: 12}}>
            <Pressable
                style={[styles.primaryBtn, { backgroundColor: themeObj.accent }]}
                onPress={handleAddToCart}
            >
                <Text style={styles.primaryText}>Tambah ke Keranjang</Text>
            </Pressable>

            <Pressable
                style={[styles.secondaryBtn, { backgroundColor: themeObj.subtext + '20' }]}
                onPress={toggleFavoriteAction}
            >
                <Text style={[styles.btnText, { color: themeObj.text }]}>
                {isFavorite ? "❤️ Sudah di Favorit" : "🤍 Tambah ke Favorit"}
                </Text>
            </Pressable>
        </View>

        {/* --- ADMIN AREA (Hanya Muncul Jika Admin) --- */}
        {isAdmin && (
            <View style={styles.adminSection}>
                <View style={styles.divider} />
                <Text style={{color: themeObj.subtext, marginBottom: 12, fontWeight:'bold', letterSpacing: 1}}>
                    ADMIN PANEL
                </Text>
                
                <View style={{flexDirection: 'row', gap: 10}}>
                    {/* Edit Button */}
                    <Pressable onPress={handleEdit} style={[styles.adminBtn, { backgroundColor: "#FFA000" }]}>
                        <Text style={styles.adminBtnText}>✏️ Edit</Text>
                    </Pressable>

                    {/* Delete Button */}
                    <Pressable onPress={handleDelete} style={[styles.adminBtn, { backgroundColor: "#D32F2F" }]}>
                        <Text style={styles.adminBtnText}>🗑️ Hapus</Text>
                    </Pressable>
                </View>
            </View>
        )}

        {/* Spacer */}
        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 280,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: "90%",
    height: "90%",
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    lineHeight: 30,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.8,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  qtyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: "bold",
    width: 40,
    textAlign: 'center',
  },
  primaryBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  primaryText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
  },
  secondaryBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    fontWeight: "600",
    fontSize: 15,
  },
  // ADMIN STYLES
  adminSection: {
    marginTop: 40,
  },
  divider: {
    height: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  adminBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  adminBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14
  }
});
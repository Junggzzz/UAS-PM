import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { Product, useShopStore } from "../store/useShopStore";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

type Props = {
  product: Product;
  cardWidth: number;
};

export default function ProductCard({ product, cardWidth }: Props) {
  const router = useRouter();

  const theme = useShopStore((s) => s.theme);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleFavorite = useShopStore((s) => s.toggleFavorite);

  /* ===== STATE FAVORITE ===== */
  const isFavLive = useShopStore((s) =>
    s.isFavorite(product.id)
  );

  const isDark = theme === "dark";

  const bgColor = isDark ? "#1E1E1E" : "#FFFFFF";
  const borderColor = isDark ? "#333333" : "#E0E0E0";
  const textColor = isDark ? "#FFFFFF" : "#000000";

  const handleAddToCart = () => {
    addToCart(product);

    Toast.show({
      type: "favorite",
      text1: "🛒 Ditambahkan ke Keranjang",
    });
  };

  const handleToggleFavorite = async () => {
    const willBeFavorite = !isFavLive;

    await toggleFavorite(product);

    Toast.show({
      type: "favorite",
      text1: willBeFavorite
        ? "❤️ Ditambahkan ke Favorit"
        : "💔 Dihapus dari Favorit",
    });
  };

  const goToDetail = () => {
    router.push(`/detail/${product.id}`);
  };

  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          backgroundColor: bgColor,
          borderColor,
        },
      ]}
    >
      {/* ===== KLIK KE DETAIL ===== */}
      <Pressable onPress={goToDetail}>
        <Image
          source={{
            uri: product.image || "https://via.placeholder.com/300",
          }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.info}>
          <Text
            style={[styles.name, { color: textColor }]}
            numberOfLines={1}
          >
            {product.name}
          </Text>

          <Text style={styles.price}>
            Rp {product.price.toLocaleString("id-ID")}
          </Text>
        </View>
      </Pressable>

      {/* ===== ACTIONS ===== */}
      <View style={[styles.actions, { padding: 12, paddingTop: 0 }]}>
        <Pressable
          style={styles.cartBtn}
          onPress={handleAddToCart}
        >
          <Text style={styles.cartText}>+ Keranjang</Text>
        </Pressable>

        {/* ===== FAVORITE ===== */}
        <Pressable onPress={handleToggleFavorite}>
          <Text style={{ fontSize: 18 }}>
            {isFavLive ? "❤️" : "🤍"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    margin: 8,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#F0F0F0",
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: "#B88E2F",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  cartText: {
    fontWeight: "700",
    color: "#000",
    fontSize: 13,
  },
});
import React from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Pressable,
  Text,
  Image,
} from "react-native";
import { useShopStore } from "../../store/useShopStore";
import EmptyState from "../../components/EmptyState";
import Toast from "react-native-toast-message";

export default function Favorites() {
  const theme = useShopStore((s) => s.theme);
  const favorites = useShopStore((s) => s.favorites);
  const cart = useShopStore((s) => s.cart);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleFavorite = useShopStore((s) => s.toggleFavorite);

  const isDark = theme === "dark";

  const colors = {
    background: isDark ? "#121212" : "#FFFFFF",
    card: isDark ? "#1E1E1E" : "#F4F4F4",
    text: isDark ? "#FFFFFF" : "#000000",
    subtext: isDark ? "#BBBBBB" : "#555555",
    accent: "#B88E2F",
    muted: "#CCCCCC",
  };

  if (!favorites.length) {
    return (
      <EmptyState
        text="Belum ada favorit"
        description="Produk favoritmu akan muncul di sini"
        actionText="Cari Produk"
        actionHref="/home"
      />
    );
  }

  const isInCart = (id: string) =>
    cart.some((c) => c.id === id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const alreadyInCart = isInCart(item.id);

          return (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {/* IMAGE */}
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
              />

              {/* INFO */}
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={{ color: colors.subtext }}>
                  Rp {item.price.toLocaleString("id-ID")}
                </Text>

                {/* ACTIONS */}
                <View style={styles.actions}>
                  <Pressable
                    disabled={alreadyInCart}
                    onPress={() => {
                      addToCart(item);
                      Toast.show({
                        type: "favorite",
                        text1: "🛒 Ditambahkan ke Keranjang",
                      });
                    }}
                    style={[
                      styles.cartBtn,
                      {
                        backgroundColor: alreadyInCart
                          ? colors.muted
                          : colors.accent,
                      },
                    ]}
                  >
                    <Text style={{ fontWeight: "700", color: "#000" }}>
                      {alreadyInCart
                        ? "✔ Sudah di Keranjang"
                        : "+ Keranjang"}
                    </Text>
                  </Pressable>

                  <Pressable onPress={() => toggleFavorite(item)}>
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: "#EEE",
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
  },
  actions: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
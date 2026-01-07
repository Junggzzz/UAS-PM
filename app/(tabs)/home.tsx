import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useShopStore, Product } from "@/store/useShopStore"; 
import { dark, light } from "@/theme/theme";
import ProductCardWithPopup from "@/components/ProductCard"; 
import { supabase } from "@/lib/supabase";

const CARD_MARGIN = 8;

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  // Store Data
  const theme = useShopStore((s) => s.theme);
  const isAdmin = useShopStore((s) => s.isAdmin);
  const themeObj = theme === "dark" ? dark : light;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
      RESPONSIVE GRID
  ====================== */
  const numColumns = width < 600 ? 2 : width < 900 ? 3 : width < 1200 ? 4 : 5;
  const cardWidth = (width - CARD_MARGIN * (numColumns * 2)) / numColumns;

  /* =====================
      FETCH PRODUCTS
  ====================== */
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  /* =====================
      UI STATES
  ====================== */
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: themeObj.background }]}>
        <ActivityIndicator size="large" color={themeObj.accent} />
        <Text style={{ color: themeObj.subtext, marginTop: 10 }}>
          Memuat produk...
        </Text>
      </View>
    );
  }

  /* =====================
      RENDER
  ====================== */
  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <FlatList
        data={products}
        numColumns={numColumns}
        key={numColumns} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCardWithPopup
            product={item}
            cardWidth={cardWidth}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: CARD_MARGIN,
          paddingTop: 10,
          paddingBottom: 100,
          alignItems: "center",
        }}
        ListEmptyComponent={
          <View style={styles.center}>
             <Text style={{ color: themeObj.subtext, marginTop: 50 }}>
               Produk belum tersedia
             </Text>
          </View>
        }
      />

      {/* === FLOATING ACTION BUTTON (ADMIN ONLY) === */}
      {isAdmin && (
        <Pressable
          style={[styles.fab, { backgroundColor: themeObj.accent }]}
          onPress={() => router.push("/addproduct")}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

/* =====================
   STYLES
====================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 999,
  },
  fabText: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },
});
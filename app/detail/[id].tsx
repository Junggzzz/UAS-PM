import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { products } from '../../data/products';
import { useShopStore } from '../../store/useShopStore';
import { dark, light } from '../../theme/theme';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const theme = useShopStore((s) => s.theme);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleFavorite = useShopStore((s) => s.toggleFavorite);
  const themeObj = theme === 'dark' ? dark : light;

  if (!product) return <Text>Produk tidak ditemukan</Text>;

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <Text style={[styles.name, { color: themeObj.text }]}>{product.name}</Text>
      <Text style={{ color: themeObj.subtext, marginBottom: 20 }}>
        Rp {product.price.toLocaleString('id-ID')}
      </Text>
      <Pressable
        style={[styles.btn, { backgroundColor: themeObj.accent }]}
        onPress={() => addToCart(product)}
      >
        <Text style={{ color: '#000', fontWeight: '700' }}>Tambah ke Keranjang</Text>
      </Pressable>
      <Pressable
        style={[styles.btn, { marginTop: 10, backgroundColor: themeObj.subtext }]}
        onPress={() => toggleFavorite(product)}
      >
        <Text style={{ color: themeObj.text, fontWeight: '700' }}>Tambah ke Favorit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  btn: { padding: 12, borderRadius: 10, alignItems: 'center' },
});

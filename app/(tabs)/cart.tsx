import React, { useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Animated } from 'react-native';
import { useShopStore } from '../../store/useShopStore';
import CartItemCard from '../../components/CartItemCard';
import EmptyState from '../../components/EmptyState';
import { useRouter } from 'expo-router';

export default function Cart() {
  const theme = useShopStore((s) => s.theme);
  const cart = useShopStore((s) => s.cart);
  const selectedItems = useShopStore((s) => s.selectedCartItems);
  const selectAll = useShopStore((s) => s.selectAllCartItems);
  const deselectAll = useShopStore((s) => s.deselectAllCartItems);

  const themeObj =
    theme === 'dark'
      ? { background: '#121212', text: '#fff', accent: '#B88E2F' }
      : { background: '#fff', text: '#000', accent: '#B88E2F' };

  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const totalSelectedPrice = cart
    .filter((i) => selectedItems.includes(i.id))
    .reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);

  if (!cart.length) return <EmptyState text="Keranjang kamu kosong." />;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: themeObj.background }}>
      <Pressable
        onPress={selectedItems.length === cart.length ? deselectAll : selectAll}
        style={[styles.selectAllBtn, { backgroundColor: themeObj.accent }]}
      >
        <Text style={{ color: '#000', fontWeight: '700' }}>
          {selectedItems.length === cart.length ? 'Deselect All' : 'Select All'}
        </Text>
      </Pressable>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItemCard item={item} />}
        extraData={selectedItems} // memastikan re-render ketika checkbox berubah
      />

      <View style={styles.totalContainer}>
        <Text style={{ color: themeObj.text, fontSize: 18 }}>
          Total: Rp {totalSelectedPrice.toLocaleString('id-ID')}
        </Text>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            style={[styles.btn, { backgroundColor: themeObj.accent }]}
            onPress={() => router.push('/checkout')}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={{ color: '#000', fontWeight: '700' }}>Checkout</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  totalContainer: { marginTop: 16, alignItems: 'center' },
  btn: { padding: 12, borderRadius: 10, marginTop: 8, width: '100%', alignItems: 'center' },
  selectAllBtn: { padding: 12, borderRadius: 10, marginBottom: 16, alignItems: 'center' },
});

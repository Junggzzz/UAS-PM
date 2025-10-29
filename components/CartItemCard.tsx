import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, TextInput } from 'react-native';
import { Product, useShopStore } from '../store/useShopStore';

type Props = { item: Product };

export default function CartItemCard({ item }: Props) {
  const theme = useShopStore((s) => s.theme);
  const themeObj =
    theme === 'dark'
      ? { background: '#1e1e1e', text: '#fff', accent: '#B88E2F' }
      : { background: '#fff', text: '#000', accent: '#B88E2F' };

  const updateQuantity = useShopStore((s) => s.updateQuantity);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const selectedItems = useShopStore((s) => s.selectedCartItems);
  const toggleSelectCartItem = useShopStore((s) => s.toggleSelectCartItem);

  const isSelected = selectedItems.includes(item.id);
  const [inputQty, setInputQty] = useState(item.quantity?.toString() ?? '1');

  // update input jika quantity berubah dari store
  useEffect(() => {
    setInputQty(item.quantity?.toString() ?? '1');
  }, [item.quantity]);

  const onChangeQty = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    setInputQty(sanitized);
    const n = parseInt(sanitized);
    if (!isNaN(n) && n > 0) updateQuantity(item.id, n);
  };

  return (
    <View style={[styles.card, { backgroundColor: themeObj.background }]}>
      <Pressable onPress={() => toggleSelectCartItem(item.id)} style={styles.checkbox}>
        <Text>{isSelected ? '☑️' : '⬜️'}</Text>
      </Pressable>

      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ color: themeObj.text, fontWeight: '600' }}>{item.name}</Text>
        <Text style={{ color: themeObj.text }}>Rp {item.price.toLocaleString('id-ID')}</Text>

        <View style={styles.qtyContainer}>
          <Pressable
            onPress={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
            style={styles.qtyBtn}
          >
            <Text>-</Text>
          </Pressable>

          <TextInput
            style={[styles.input, { color: themeObj.text }]}
            keyboardType="number-pad"
            value={inputQty}
            onChangeText={onChangeQty}
          />

          <Pressable
            onPress={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
            style={styles.qtyBtn}
          >
            <Text>+</Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
        <Text>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 10, borderRadius: 10 },
  checkbox: { marginRight: 8 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 8 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  qtyBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#ddd', borderRadius: 5 },
  input: { marginHorizontal: 8, borderBottomWidth: 1, minWidth: 40, textAlign: 'center' },
  deleteBtn: { marginLeft: 8 },
});

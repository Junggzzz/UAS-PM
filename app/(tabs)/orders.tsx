import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useShopStore } from '../../store/useShopStore';
import { dark, light } from '../../theme/theme';
import EmptyState from '../../components/EmptyState';

export default function Orders() {
  const theme = useShopStore((s) => s.theme);
  const orders = useShopStore((s) => s.orders);
  const themeObj = theme === 'dark' ? dark : light;

  if (!orders.length) return <EmptyState text="Belum ada pesanan." />;

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: themeObj.card }]}>
            <Text style={[styles.orderDate, { color: themeObj.subtext }]}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            {item.items.map((prod) => (
              <View key={prod.id} style={styles.itemRow}>
                <Text style={[styles.itemName, { color: themeObj.text }]}>{prod.name}</Text>
                <Text style={{ color: themeObj.subtext }}>
                  {prod.quantity ?? 1} x Rp {prod.price.toLocaleString('id-ID')}
                </Text>
              </View>
            ))}

            <Text style={[styles.total, { color: themeObj.text }]}>
              Total: Rp {item.total.toLocaleString('id-ID')}
            </Text>

            <Text style={{ color: themeObj.subtext }}>Alamat: {item.address}</Text>
            {item.paymentMethod && (
              <Text style={{ color: themeObj.subtext }}>Metode: {item.paymentMethod}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 12, borderRadius: 10, marginBottom: 10 },
  orderDate: { fontSize: 12, marginBottom: 6 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { fontWeight: '600', fontSize: 16 },
  total: { fontWeight: '700', fontSize: 16, marginTop: 6 },
});
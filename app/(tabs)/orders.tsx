import React, { useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { useShopStore } from "../../store/useShopStore";
import { dark, light } from "../../theme/theme";
import EmptyState from "../../components/EmptyState";

export default function Orders() {
  const theme = useShopStore((s) => s.theme);
  const orders = useShopStore((s) => s.orders);
  const fetchOrders = useShopStore((s) => s.fetchOrders);

  const themeObj = theme === "dark" ? dark : light;

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===== EMPTY STATE ===== */
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        text="Belum ada pesanan"
        description="Pesanan yang kamu buat akan muncul di sini"
        actionText="Belanja Sekarang"
        actionHref="/home"
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        renderItem={({ item }) => {
          /* ===== HITUNG SUBTOTAL ===== */
          const subtotal =
            Array.isArray(item.items)
              ? item.items.reduce(
                  (sum, p) => sum + p.price * (p.quantity ?? 1),
                  0
                )
              : 0;

          /* ===== ONGKIR ===== */
          const shippingCost = item.shipping_cost ?? 0;

          /* ===== Total ===== */
          const finalTotal = subtotal + shippingCost;

          return (
            <View style={[styles.card, { backgroundColor: themeObj.card }]}>
              {/* TANGGAL */}
              <Text style={[styles.orderDate, { color: themeObj.subtext }]}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>

              {/* ITEM */}
              {item.items?.map((prod, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={[styles.itemName, { color: themeObj.text }]}>
                    {prod.name}
                  </Text>
                  <Text style={{ color: themeObj.subtext }}>
                    {prod.quantity ?? 1} × Rp{" "}
                    {prod.price.toLocaleString("id-ID")}
                  </Text>
                </View>
              ))}

              {/* BREAKDOWN */}
              <View style={styles.divider} />

              <Row label="Subtotal" value={subtotal} theme={themeObj} />
              <Row label="Ongkir" value={shippingCost} theme={themeObj} />

              <View style={styles.divider} />

              <Row
                label="Total"
                value={finalTotal}
                theme={themeObj}
                bold
              />
              {item.shipping_method && (
                <Text style={[styles.meta, { color: themeObj.subtext }]}>
                  Metode Pengiriman: {item.shipping_method}
                </Text>
              )}

              {/* ALAMAT */}
              {item.address && (
                <Text style={[styles.meta, { color: themeObj.subtext }]}>
                  Alamat: {item.address}
                </Text>
              )}

              {/* METODE PEMBAYARAN */}
              {item.paymentMethod && (
                <Text style={[styles.meta, { color: themeObj.subtext }]}>
                  Metode: {item.paymentMethod}
                </Text>
              )}
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

/* ===== SMALL COMPONENT ===== */
const Row = ({
  label,
  value,
  theme,
  bold,
}: {
  label: string;
  value: number;
  theme: any;
  bold?: boolean;
}) => (
  <View style={styles.row}>
    <Text style={{ color: theme.text, fontWeight: bold ? "700" : "400" }}>
      {label}
    </Text>
    <Text style={{ color: theme.text, fontWeight: bold ? "700" : "400" }}>
      Rp {value.toLocaleString("id-ID")}
    </Text>
  </View>
);

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  orderDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: {
    fontWeight: "600",
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#00000020",
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
  },
});

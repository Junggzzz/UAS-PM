import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { useShopStore, Product } from "../store/useShopStore";
import { dark, light } from "../theme/theme";
import EmptyState from "../components/EmptyState";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

/* =======================
   TYPES
======================= */
type ShippingOption = {
  id: string;
  name: string;
  price: number;
};

export default function Checkout() {
  const router = useRouter();

  /* ===== STORE ===== */
  const theme = useShopStore((s) => s.theme);
  const cart = useShopStore((s) => s.cart);
  const selectedCartItems = useShopStore((s) => s.selectedCartItems);
  const selectedPayment = useShopStore((s) => s.selectedPayment);
  const setPaymentMethod = useShopStore((s) => s.setPaymentMethod);
  const checkout = useShopStore((s) => s.checkout);
  const setShipping = useShopStore((s) => s.setShipping);
  const profile = useShopStore((s) => s.profile);
  const address = useShopStore((s) => s.address);
  const setAddress = useShopStore((s) => s.setAddress);

  const themeObj = theme === "dark" ? dark : light;

  /* ===== PAYMENT ===== */
  const paymentCategories = [
    {
      name: "E-Wallet",
      methods: [
        { id: "gopay", name: "GoPay" },
        { id: "ovo", name: "OVO" },
        { id: "dana", name: "DANA" },
        { id: "shopeepay", name: "ShopeePay" },
      ],
    },
    {
      name: "Bank Transfer",
      methods: [
        { id: "bca", name: "BCA" },
        { id: "bni", name: "BNI" },
        { id: "bri", name: "BRI" },
        { id: "mandiri", name: "Mandiri" },
      ],
    },
    {
      name: "COD",
      methods: [{ id: "cod", name: "Bayar di Tempat (COD)" }],
    },
  ];

  /* ===== SHIPPING ===== */
  const shippingOptions: ShippingOption[] = [
    { id: "regular", name: "Reguler (3–5 hari)", price: 0 },
    { id: "express", name: "Express (1–2 hari)", price: 20000 },
    { id: "same-day", name: "Same Day", price: 40000 },
  ];

  /* ===== LOCAL STATE ===== */
  const [modalVisible, setModalVisible] = useState(false);
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);

  /* ===== SELECTED ITEMS ===== */
  const selectedItems = cart.filter((i) =>
    selectedCartItems.includes(i.id)
  );

  const subtotal = selectedItems.reduce(
    (sum, i) => sum + i.price * (i.quantity ?? 1),
    0
  );

  const shippingCost = selectedShipping?.price ?? 0;
  const total = subtotal + shippingCost;

  const canCheckout =
    selectedItems.length > 0 &&
    !!selectedShipping &&
    !!selectedPayment;

  /* ===== AUTOFILL PROFILE ===== */
  useEffect(() => {
    if (profile) {
      setShippingName(profile.full_name || "");
      setShippingAddress(profile.address || "");
    }
  }, [profile]);

  /* ===== CHECKOUT ===== */
  const handleCheckout = () => {
  if (!selectedItems.length)
    return Toast.show({ type: "error", text1: "Pilih produk terlebih dahulu" });

  if (!shippingName.trim())
    return Toast.show({ type: "error", text1: "Nama penerima wajib diisi" });

  if (!shippingAddress.trim())
    return Toast.show({ type: "error", text1: "Alamat wajib diisi" });

  if (!selectedShipping)
    return Toast.show({ type: "error", text1: "Pilih opsi pengiriman" });

  if (!selectedPayment)
    return Toast.show({ type: "error", text1: "Pilih metode pembayaran" });

  setAddress(shippingAddress);

  checkout();

  Toast.show({
    type: "favorite",
    text1: "✅ Pesanan berhasil dibuat",
  });

  router.replace("/checkout-success");
};


  return (
    <ScrollView style={[styles.container, { backgroundColor: themeObj.background }]}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.replace("/cart")}>
          <Text style={[styles.backText, { color: themeObj.accent }]}>
            ← Kembali
          </Text>
        </Pressable>
        <Text style={[styles.header, { color: themeObj.text }]}>Checkout</Text>
      </View>

      {/* NAMA */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeObj.subtext }]}>
          Nama Penerima
        </Text>
        <TextInput
          value={shippingName}
          onChangeText={setShippingName}
          style={[styles.input, { backgroundColor: themeObj.card, color: themeObj.text }]}
        />
      </View>

      {/* ALAMAT */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeObj.subtext }]}>
          Alamat Pengiriman
        </Text>
        <TextInput
          value={shippingAddress}
          onChangeText={setShippingAddress}
          multiline
          style={[
            styles.input,
            { minHeight: 70, backgroundColor: themeObj.card, color: themeObj.text },
          ]}
        />
      </View>

      {/* RINGKASAN */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeObj.subtext }]}>
          Ringkasan Pesanan
        </Text>

        {selectedItems.length === 0 ? (
          <EmptyState text="Tidak ada produk dipilih." />
        ) : (
          selectedItems.map((it: Product) => (
            <View key={it.id} style={[styles.cartRow, { backgroundColor: themeObj.card }]}>
              <Text style={{ color: themeObj.text }}>
                {it.name} x{it.quantity ?? 1}
              </Text>
              <Text style={{ color: themeObj.text }}>
                Rp {(it.price * (it.quantity ?? 1)).toLocaleString("id-ID")}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* OPSI PENGIRIMAN */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeObj.subtext }]}>
          Opsi Pengiriman
        </Text>

        {shippingOptions.map((opt) => {
          const active = selectedShipping?.id === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => {
                setSelectedShipping(opt);
                setShipping(opt.name, opt.price);
              }}
              style={[
                styles.shippingItem,
                {
                  backgroundColor: active ? themeObj.accent : themeObj.card,
                  borderColor: active ? themeObj.accent : themeObj.subtext,
                },
              ]}
            >
              <Text style={{ fontWeight: "700", color: active ? "#000" : themeObj.text }}>
                {opt.name}
              </Text>
              <Text style={{ color: active ? "#000" : themeObj.subtext }}>
                {opt.price === 0
                  ? "Gratis"
                  : `Rp ${opt.price.toLocaleString("id-ID")}`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* METODE PEMBAYARAN */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeObj.subtext }]}>
          Metode Pembayaran
        </Text>

        {selectedPayment ? (
          <View style={[styles.selectedPayment, { backgroundColor: themeObj.card }]}>
            <Text style={{ color: themeObj.text }}>{selectedPayment.name}</Text>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text style={{ color: themeObj.accent }}>Ganti</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.chooseBtn, { backgroundColor: themeObj.accent }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: "#000", fontWeight: "700" }}>
              Pilih Metode Pembayaran
            </Text>
          </Pressable>
        )}
      </View>

      {/* BREAKDOWN TOTAL */}
      <View style={[styles.section, styles.breakdown]}>
        <Row label="Subtotal" value={subtotal} theme={themeObj} />
        <Row label="Ongkir" value={shippingCost} theme={themeObj} />
        <View style={styles.divider} />
        <Row label="Total Pembayaran" value={total} theme={themeObj} bold />
      </View>

      {/* BAYAR */}
      <Pressable
        disabled={!canCheckout}
        onPress={handleCheckout}
        style={[
          styles.payBtn,
          {
            backgroundColor: canCheckout ? themeObj.accent : themeObj.subtext,
          },
        ]}
      >
        <Text style={{ color: "#000", fontWeight: "700" }}>
          Bayar Sekarang
        </Text>
      </Pressable>

      {/* MODAL PAYMENT */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: themeObj.card }]}>
            <FlatList
              data={paymentCategories}
              keyExtractor={(c) => c.name}
              renderItem={({ item }) => (
                <View>
                  <Text style={{ color: themeObj.subtext }}>{item.name}</Text>
                  {item.methods.map((m) => (
                    <Pressable
                      key={m.id}
                      style={styles.methodItem}
                      onPress={() => {
                        setPaymentMethod(m);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={{ color: themeObj.text }}>{m.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
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
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backText: { fontSize: 16, marginRight: 12 },
  header: { fontSize: 22, fontWeight: "700" },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 16, marginBottom: 8 },
  input: { borderRadius: 8, padding: 10 },
  cartRow: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shippingItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  chooseBtn: { padding: 12, borderRadius: 8, alignItems: "center" },
  selectedPayment: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breakdown: {
    backgroundColor: "#00000010",
    padding: 12,
    borderRadius: 10,
  },
  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 8 },
  payBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalBox: {
    padding: 16,
    maxHeight: "70%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  methodItem: { paddingVertical: 12 },
});

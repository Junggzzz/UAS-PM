import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useShopStore, Product } from '../../store/useShopStore';
import { dark, light } from '../../theme/theme';
import EmptyState from '../../components/EmptyState';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

export default function Checkout() {
  const {
    cart,
    address,
    setAddress,
    paymentCategories,
    selectedPayment,
    setPaymentMethod,
    checkout,
    getTotalPrice,
  } = useShopStore();
  const theme = useShopStore((s) => s.theme);
  const themeObj = theme === 'dark' ? dark : light;

  const [modalVisible, setModalVisible] = useState(false);
  const total = getTotalPrice();
  const router = useRouter();

  const handleCheckout = () => {
    if (!cart.length) return Toast.show({ type: 'error', text1: 'Keranjang kosong' });
    if (!address.trim()) return Toast.show({ type: 'error', text1: 'Alamat kosong' });
    if (!selectedPayment) return Toast.show({ type: 'error', text1: 'Pilih metode pembayaran' });

    checkout(); // kosongkan cart & simpan orders
    Toast.show({ type: 'success', text1: 'Pesanan berhasil dibuat!' });

    router.push('/checkout-success'); // redirect ke halaman sukses
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeObj.background }]}>
      <Text style={[styles.header, { color: themeObj.text }]}>Checkout</Text>

      {/* Alamat */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeObj.subtext }]}>Alamat Pengiriman</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeObj.card, color: themeObj.text }]}
          placeholder="Masukkan alamat lengkap..."
          placeholderTextColor={themeObj.subtext}
          multiline
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Ringkasan Pesanan */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeObj.subtext }]}>Ringkasan Pesanan</Text>
        {cart.length === 0 ? (
          <EmptyState text="Keranjang kosong." />
        ) : (
          cart.map((it: Product) => (
            <View key={it.id} style={[styles.cartRow, { backgroundColor: themeObj.card }]}>
              <Text style={{ color: themeObj.text }}>{it.name} x{it.quantity ?? 1}</Text>
              <Text style={{ color: themeObj.text }}>
                Rp {(it.price * (it.quantity ?? 1)).toLocaleString('id-ID')}
              </Text>
            </View>
          ))
        )}
        <View style={styles.totalRow}>
          <Text style={{ color: themeObj.text, fontWeight: '700' }}>Total</Text>
          <Text style={{ color: themeObj.text, fontWeight: '700' }}>Rp {total.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {/* Metode Pembayaran */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeObj.subtext }]}>Metode Pembayaran</Text>
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
            <Text style={{ color: '#000', fontWeight: '700' }}>Pilih Metode Pembayaran</Text>
          </Pressable>
        )}
      </View>

      {/* Tombol Bayar */}
      <Pressable
        style={[styles.payBtn, { backgroundColor: themeObj.accent }]}
        onPress={handleCheckout}
      >
        <Text style={{ color: '#000', fontWeight: '700' }}>Bayar Sekarang</Text>
      </Pressable>

      {/* Modal pilih pembayaran */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: themeObj.card }]}>
            <Text style={[styles.modalTitle, { color: themeObj.text }]}>Pilih Metode Pembayaran</Text>
            <FlatList
              data={paymentCategories}
              keyExtractor={(c) => c.name}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ color: themeObj.subtext, marginBottom: 6 }}>{item.name}</Text>
                  {item.methods.map((m) => (
                    <Pressable
                      key={m.id}
                      onPress={() => {
                        setPaymentMethod(m);
                        setModalVisible(false);
                      }}
                      style={[styles.methodItem, { backgroundColor: themeObj.background }]}
                    >
                      <Text style={{ color: themeObj.text }}>{m.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />
            <Pressable
              onPress={() => setModalVisible(false)}
              style={[styles.closeBtn, { backgroundColor: '#333' }]}
            >
              <Text style={{ color: '#fff' }}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 16, marginBottom: 8 },
  input: { borderRadius: 8, padding: 10, minHeight: 60 },
  cartRow: { padding: 10, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  chooseBtn: { padding: 12, borderRadius: 8, alignItems: 'center' },
  selectedPayment: { padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payBtn: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalBox: { padding: 16, maxHeight: '70%', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  methodItem: { padding: 12, borderRadius: 8, marginBottom: 6 },
  closeBtn: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
});

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useShopStore } from '../store/useShopStore';
import { dark, light } from '../theme/theme';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function CheckoutSuccess() {
  const theme = useShopStore((s) => s.theme);
  const themeObj = theme === 'dark' ? dark : light;
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <MaterialIcons name="check-circle" size={100} color="#4BB543" />
      <Text style={[styles.title, { color: themeObj.text }]}>Pesanan Berhasil!</Text>
      <Text style={[styles.subtitle, { color: themeObj.subtext }]}>
        Terima kasih sudah berbelanja.
      </Text>

      <Pressable
        style={[styles.btn, { backgroundColor: themeObj.accent }]}
        onPress={() => router.push('/home')}
      >
        <Text style={{ color: '#000', fontWeight: '700' }}>Kembali ke Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: '700', marginTop: 16 },
  subtitle: { fontSize: 16, marginTop: 8, textAlign: 'center' },
  btn: {
    marginTop: 32,
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
});

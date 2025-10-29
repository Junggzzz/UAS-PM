import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useShopStore } from '../../store/useShopStore';

export default function RootLayout() {
  const theme = useShopStore((s) => s.theme);
  const toggleTheme = useShopStore((s) => s.toggleTheme);
  const cartCount = useShopStore((s) => s.cart.length);
  const favCount = useShopStore((s) => s.favorites.length);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFF' },
        headerTintColor: theme === 'dark' ? '#FFF' : '#000',
        tabBarStyle: { backgroundColor: theme === 'dark' ? '#121212' : '#FFF' },
        tabBarActiveTintColor: theme === 'dark' ? '#FFD700' : '#000',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerRight: () => (
            <Pressable onPress={toggleTheme} style={{ marginRight: 16 }}>
              <Text style={{ color: theme === 'dark' ? '#FFD700' : '#000' }}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </Text>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorit',
          tabBarBadge: favCount > 0 ? favCount : undefined,
        }}
      />
      <Tabs.Screen name="orders" options={{ title: 'Pesanan' }} />
    </Tabs>
  );
}

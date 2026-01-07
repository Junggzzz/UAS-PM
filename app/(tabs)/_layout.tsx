import { Tabs, Redirect } from "expo-router";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShopStore } from "@/store/useShopStore";

export default function RootLayout() {
  /* ===== GLOBAL STATE ===== */
  const theme = useShopStore((s) => s.theme);
  const toggleTheme = useShopStore((s) => s.toggleTheme);
  const cartCount = useShopStore((s) => s.cart.length);
  const favCount = useShopStore((s) => s.favorites.length);
  const user = useShopStore((s) => s.user);

  /* ===== AUTH GUARD ===== */
  if (!user) {
    return <Redirect href="/login" />;
  }

  const isDark = theme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        },
        headerTintColor: isDark ? "#FFFFFF" : "#000000",
        tabBarStyle: {
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
        },
        tabBarActiveTintColor: isDark ? "#FFD700" : "#000000",
        tabBarInactiveTintColor: isDark ? "#888888" : "#777777",
      }}
    >
      {/* ===== HOME ===== */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <Pressable onPress={toggleTheme} style={{ marginRight: 16 }}>
              <Text style={{ fontSize: 18 }}>
                {isDark ? "🌙" : "☀️"}
              </Text>
            </Pressable>
          ),
        }}
      />

      {/* ===== CART ===== */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Keranjang",
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />

      {/* ===== FAVORITES ===== */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorit",
          tabBarBadge: favCount > 0 ? favCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />

      {/* ===== ORDERS ===== */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pesanan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />

      {/* ===== PROFILE ===== */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
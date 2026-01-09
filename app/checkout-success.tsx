import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useShopStore } from "../store/useShopStore";
import { dark, light } from "../theme/theme";

export default function CheckoutSuccess() {
  const theme = useShopStore((s) => s.theme);
  const themeObj = theme === "dark" ? dark : light;
  const router = useRouter();

  /* ===== SHOW POPUP (SAMA SEPERTI FAVORITE) ===== */
  useEffect(() => {
    Toast.show({
      type: "favorite",
      text1: "✅ Pesanan berhasil dibuat",
      position: "top",
      visibilityTime: 1500,
    });
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeObj.background },
      ]}
    >
      {/* ICON */}
      <MaterialIcons
        name="check-circle"
        size={96}
        color="#4BB543"
      />

      {/* TITLE */}
      <Text style={[styles.title, { color: themeObj.text }]}>
        Pesanan Berhasil
      </Text>

      {/* SUBTITLE */}
      <Text
        style={[
          styles.subtitle,
          { color: themeObj.subtext },
        ]}
      >
        Terima kasih sudah berbelanja 🙏
      </Text>

      {/* BUTTON */}
      <Pressable
        style={[
          styles.btn,
          { backgroundColor: themeObj.accent },
        ]}
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Text style={styles.btnText}>
          Kembali ke Home
        </Text>
      </Pressable>
    </View>
  );
}

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  btn: {
    marginTop: 32,
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#000",
    fontWeight: "700",
  },
});
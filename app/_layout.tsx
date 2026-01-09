import { toastConfig } from "@/components/ToastConfig";
import { useShopStore } from "@/store/useShopStore";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const theme = useShopStore((s) => s.theme);

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <Head>
        <title>GamingGearShop</title>
        <meta property="og:title" content="GamingGearShop" />
        <meta property="og:description" content="Toko Gaming Gear Terlengkap dan Terpercaya" />
        <meta property="og:image" content="https://listing-images-bucket.s3.amazonaws.com/default-preview.png" />
        <meta property="og:type" content="website" />
      </Head>
      <Toast
        config={toastConfig}
        position="top"
        topOffset={60}
      />

      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
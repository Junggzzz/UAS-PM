import { toastConfig } from "@/components/ToastConfig";
import { useShopStore } from "@/store/useShopStore";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const theme = useShopStore((s) => s.theme);

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <Toast
        config={toastConfig}
        position="top"
        topOffset={60}
      />

      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
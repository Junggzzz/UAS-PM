import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Verify() {
  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      try {
        const hashIndex = url.indexOf("#");
        const queryIndex = url.indexOf("?");

        let params: Record<string, string> = {};
        if (hashIndex !== -1) {
          const fragment = url.substring(hashIndex + 1);
          const pairs = fragment.split("&");
          pairs.forEach((pair) => {
            const [key, val] = pair.split("=");
            if (key && val) params[key] = decodeURIComponent(val);
          });
        }
        if (queryIndex !== -1) {
          const query = url.substring(queryIndex + 1).split("#")[0]; 
          const pairs = query.split("&");
          pairs.forEach((pair) => {
            const [key, val] = pair.split("=");
            if (key && val) params[key] = decodeURIComponent(val);
          });
        }

        const accessToken = params["access_token"];
        const refreshToken = params["refresh_token"];

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          Toast.show({
            type: "success",
            text1: "Email terverifikasi!",
            text2: "Login otomatis berhasil",
          });
          setTimeout(() => router.replace("/(tabs)/home"), 1000);
          return;
        }
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email_confirmed_at) {
          Toast.show({
            type: "success",
            text1: "Akun sudah aktif",
            text2: "Mengalihkan...",
          });
          setTimeout(() => router.replace("/(tabs)/home"), 1000);
        }

      } catch (e: any) {
        console.error("Deep link error:", e);
        Toast.show({
          type: "error",
          text1: "Verifikasi Gagal",
          text2: e.message || "Link tidak valid",
        });
      }
    };
    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600" }}>
        Memverifikasi akun...
      </Text>
      <Text style={{ marginTop: 8, color: "#666" }}>
        Silakan tunggu
      </Text>
    </View>
  );
}
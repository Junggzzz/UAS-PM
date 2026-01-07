import { View, Text } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";

export default function Verify() {
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user?.email_confirmed_at) {
        Toast.show({
          type: "success",
          text1: "Akun berhasil diverifikasi",
          text2: "Silakan login",
        });

        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    };

    checkSession();
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
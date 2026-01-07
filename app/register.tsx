import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useShopStore } from "@/store/useShopStore";

export default function Register() {
  const register = useShopStore((s) => s.register);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleRegister() {
    if (password !== confirm) {
      Alert.alert("Error", "Password tidak sama");
      return;
    }

    const ok = await register(email, password);
    if (!ok) {
      Alert.alert("Gagal", "Email tidak valid / sudah terdaftar");
      return;
    }

    Alert.alert(
      "Registrasi Berhasil",
      "Silakan cek email untuk verifikasi akun",
      [{ text: "OK", onPress: () => router.replace("/login") }]
    );
  }

  return (
    <View style={{ padding: 24, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
        Register
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Konfirmasi Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={{ borderWidth: 1, padding: 12, marginBottom: 16 }}
      />

      <Pressable
        onPress={handleRegister}
        style={{ backgroundColor: "#FFD700", padding: 14 }}
      >
        <Text style={{ textAlign: "center", fontWeight: "700" }}>
          Register
        </Text>
      </Pressable>
    </View>
  );
}

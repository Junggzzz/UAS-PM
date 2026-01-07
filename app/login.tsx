import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useShopStore } from "@/store/useShopStore";

export default function Login() {
  const login = useShopStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const ok = await login(email, password);
    if (!ok) {
      Alert.alert("Login gagal", "Email atau password salah");
      return;
    }
    router.replace("/(tabs)/home");
  }

  return (
    <View style={{ padding: 24, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, marginBottom: 16 }}
      />

      <Pressable
        onPress={handleLogin}
        style={{ backgroundColor: "#FFD700", padding: 14 }}
      >
        <Text style={{ textAlign: "center", fontWeight: "700" }}>
          Login
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/register")}>
        <Text style={{ textAlign: "center", marginTop: 12 }}>
          Belum punya akun? Register
        </Text>
      </Pressable>
    </View>
  );
}

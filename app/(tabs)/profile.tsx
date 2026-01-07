import { View, Text, Pressable, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useShopStore } from "@/store/useShopStore";
import Toast from "react-native-toast-message";

export default function Profile() {
  const user = useShopStore((s) => s.user);
  const logout = useShopStore((s) => s.logout);
  const theme = useShopStore((s) => s.theme);

  const profile = useShopStore((s) => s.profile);
  const fetchProfile = useShopStore((s) => s.fetchProfile);
  const updateProfile = useShopStore((s) => s.updateProfile);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  if (!user) return null;

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(name, address);

      Toast.show({
        type: "favorite",
        text1: "💾 Profil berhasil disimpan",
      });
    } catch {
      Toast.show({
        type: "favorite",
        text1: "❌ Gagal menyimpan profil",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: isDark ? "#121212" : "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: isDark ? "#fff" : "#000",
          marginBottom: 20,
        }}
      >
        Profile
      </Text>

      <Text style={{ color: "#aaa" }}>Email</Text>
      <Text style={{ color: isDark ? "#fff" : "#000", marginBottom: 16 }}>
        {user.email}
      </Text>

      <Text style={{ color: "#aaa" }}>Nama Lengkap</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          color: isDark ? "#fff" : "#000",
          marginBottom: 16,
        }}
      />

      <Text style={{ color: "#aaa" }}>Alamat</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          color: isDark ? "#fff" : "#000",
          marginBottom: 24,
          minHeight: 80,
        }}
      />

      <Pressable
        onPress={handleSaveProfile}
        disabled={saving}
        style={{
          backgroundColor: "#FFD700",
          padding: 14,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "700" }}>
          {saving ? "Menyimpan..." : "Simpan Profil"}
        </Text>
      </Pressable>

      <Pressable
        onPress={logout}
        style={{
          backgroundColor: "#FF4D4D",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}
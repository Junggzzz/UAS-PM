import { supabase } from "@/lib/supabase";
import { useShopStore } from "@/store/useShopStore";
import { dark, light } from "@/theme/theme";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id as string;
  const isEditMode = !!productId;

  const theme = useShopStore((s) => s.theme);
  const themeObj = theme === "dark" ? dark : light;
  const isAdmin = useShopStore((s) => s.isAdmin);

  const addProduct = useShopStore((s) => s.addProduct);
  const updateProduct = useShopStore((s) => s.updateProduct);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      Alert.alert("Akses Ditolak", "Hanya admin yang boleh masuk sini.");
      router.replace("/(tabs)/home");
      return;
    }

    if (isEditMode) {
      loadProductData();
    }
  }, [isAdmin, isEditMode]);

  const loadProductData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (data && !error) {
      setName(data.name);
      setPrice(data.price.toString());
      setDesc(data.description || "");
      setStock(data.stock ? data.stock.toString() : "0");
      setImage(data.image);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price) {
      Toast.show({ type: "error", text1: "Nama dan Harga wajib diisi!" });
      return;
    }

    setLoading(true);
    const payload = {
      name,
      price: parseFloat(price),
      description: desc,
      stock: parseInt(stock) || 0,
      category: "General",
    };

    let success = false;
    const newImageUri = image?.startsWith("file") ? image : undefined;

    try {
      if (isEditMode) {
        success = await updateProduct(productId, payload, newImageUri);
      } else {
        success = await addProduct({ ...payload, image: "" }, newImageUri);
      }
    } catch (err) {
      console.error("Error submit:", err);
      success = false;
    }

    setLoading(false);

    if (success) {
      Toast.show({
        type: "success",
        text1: isEditMode ? "Produk Diupdate" : "Produk Ditambahkan",
      });
      router.back();
    } else {
      Toast.show({
        type: "error",
        text1: "Gagal menyimpan",
        text2: "Cek koneksi atau izin database"
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: themeObj.text }]}>
          {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
        </Text>

        {/* IMAGE PICKER */}
        <Pressable onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={{ color: "#888" }}>+ Upload Foto Produk</Text>
            </View>
          )}
        </Pressable>

        {/* INPUT NAMA */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeObj.text }]}>Nama Produk</Text>
          <TextInput
            style={[styles.input, { color: themeObj.text, borderColor: themeObj.subtext }]}
            placeholder="Contoh: CRF Rally"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* INPUT HARGA & STOK */}
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: themeObj.text }]}>Harga (Rp)</Text>
            <TextInput
              style={[styles.input, { color: themeObj.text, borderColor: themeObj.subtext }]}
              placeholder="15000000"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: themeObj.text }]}>Stok</Text>
            <TextInput
              style={[styles.input, { color: themeObj.text, borderColor: themeObj.subtext }]}
              placeholder="1"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={stock}
              onChangeText={setStock}
            />
          </View>
        </View>

        {/* INPUT DESKRIPSI */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeObj.text }]}>Deskripsi</Text>
          <TextInput
            style={[styles.input, { color: themeObj.text, borderColor: themeObj.subtext, height: 100 }]}
            placeholder="Jelaskan detail produk..."
            placeholderTextColor="#888"
            multiline
            textAlignVertical="top"
            value={desc}
            onChangeText={setDesc}
          />
        </View>

        {/* TOMBOL SAVE */}
        <Pressable
          style={[styles.submitBtn, { backgroundColor: themeObj.accent }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.btnText}>
              {isEditMode ? "Simpan Perubahan" : "Buat Produk"}
            </Text>
          )}
        </Pressable>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  imagePicker: { alignItems: "center", marginBottom: 20 },
  imagePreview: { width: 150, height: 150, borderRadius: 12 },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#AAA",
  },
  formGroup: { marginBottom: 16 },
  row: { flexDirection: "row" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  submitBtn: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
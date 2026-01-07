import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useShopStore } from "@/store/useShopStore";

type Props = {
  text: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
};

export default function EmptyState({
  text,
  description,
  actionText,
  actionHref,
}: Props) {
  const router = useRouter();
  const theme = useShopStore((s) => s.theme);

  const isDark = theme === "dark";

  const colors = {
    background: isDark ? "#121212" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#000000",
    subtext: isDark ? "#BBBBBB" : "#666666",
    accent: "#FFD700",
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* ICON */}
      <Text style={styles.icon}>📦</Text>

      {/* TITLE */}
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        {text}
      </Text>

      {/* DESCRIPTION */}
      {description && (
        <Text
          style={[
            styles.description,
            { color: colors.subtext },
          ]}
        >
          {description}
        </Text>
      )}

      {/* ACTION BUTTON */}
      {actionText && actionHref && (
        <Pressable
          onPress={() => router.push(actionHref)}
          style={[
            styles.button,
            { backgroundColor: colors.accent },
          ]}
        >
          <Text style={styles.buttonText}>
            {actionText}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "700",
    color: "#000",
    fontSize: 14,
  },
});
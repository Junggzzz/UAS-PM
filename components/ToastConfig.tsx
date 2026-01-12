import { Text, View } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4CAF50" }}
      text1Style={{ fontSize: 15, fontWeight: "700" }}
      text2Style={{ fontSize: 13 }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{ fontSize: 15, fontWeight: "700" }}
      text2Style={{ fontSize: 13 }}
    />
  ),

  favorite: ({ text1 }: any) => (
    <View
      style={{
        backgroundColor: "#1E1E1E",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        minWidth: 220,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#FFD700",
          fontWeight: "700",
          fontSize: 14,
        }}
      >
        {text1}
      </Text>
    </View>
  ),
  remove_favorite: ({ text1, text2 }: any) => (
    <View
      style={{
        backgroundColor: "#1E1E1E",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        minWidth: 220,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#FF4444",
          fontWeight: "700",
          fontSize: 14,
        }}
      >
        {text1}
      </Text>
      {text2 && <Text style={{ color: "#FFF", fontSize: 12, marginTop: 4 }}>{text2}</Text>}
    </View>
  ),
  success_cart: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4CAF50" }}
      text1Style={{ fontSize: 15, fontWeight: "700" }}
      text2Style={{ fontSize: 13 }}
    />
  ),
  action_favorite: ({ text1, text2 }: any) => (
    <View
      style={{
        backgroundColor: "#1E1E1E",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        minWidth: 220,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#FFD700",
          fontWeight: "700",
          fontSize: 14,
        }}
      >
        {text1}
      </Text>
      {text2 && <Text style={{ color: "#FFF", fontSize: 12, marginTop: 4 }}>{text2}</Text>}
    </View>
  ),
};

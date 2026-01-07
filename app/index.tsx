import { Redirect } from "expo-router";
import { useShopStore } from "../store/useShopStore";

export default function Index() {
  const user = useShopStore((s) => s.user);

  if (!user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useShopStore } from '../../store/useShopStore';
import CartItemCard from '../../components/CartItemCard';
import EmptyState from '../../components/EmptyState';

export default function Favorites() {
  const theme = useShopStore((s) => s.theme);
  const favorites = useShopStore((s) => s.favorites);

  const themeObj =
    theme === 'dark'
      ? { background: '#121212', text: '#fff', accent: '#B88E2F', subtext: '#ccc', card: '#1e1e1e' }
      : { background: '#fff', text: '#000', accent: '#B88E2F', subtext: '#555', card: '#f2f2f2' };

  if (!favorites.length) return <EmptyState text="Belum ada favorit." />;

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}      
            noQuantity       
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

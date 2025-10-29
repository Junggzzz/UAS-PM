import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Product } from '../store/useShopStore';

type Props = {
  product: Product;
  cardWidth: number;
};

export default function ProductCard({ product, cardWidth }: Props) {
  return (
    <Pressable style={[styles.card, { width: cardWidth }]}>
      <Image
        source={{ uri: product.image || 'https://via.placeholder.com/300' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    margin: 8,

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    boxShadow: '0px 4px 8px rgba(0,0,0,0.25)',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#B88E2F',
    fontWeight: '700',
  },
});

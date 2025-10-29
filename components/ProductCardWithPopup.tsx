import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Product, useShopStore } from '../store/useShopStore';
import { dark, light } from '../theme/theme';

type Props = { product: Product; cardWidth: number };

export default function ProductCardWithPopup({ product, cardWidth }: Props) {
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleFavorite = useShopStore((s) => s.toggleFavorite);
  const favorites = useShopStore((s) => s.favorites);
  const theme = useShopStore((s) => s.theme);
  const themeObj = theme === 'dark' ? dark : light;
  const styles = getStyles(themeObj);

  const scale = useRef(new Animated.Value(1)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const [popupText, setPopupText] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const isFav = favorites.some((f) => f.id === product.id);
  const price = product.price ?? 0;
  const imageUri = product.image || 'https://via.placeholder.com/300';
  const category = product.category || 'Tidak ada kategori';

  const showPopup = (text: string) => {
    setPopupText(text);
    setPopupVisible(true);
    Animated.timing(popupOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(popupOpacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setPopupVisible(false));
    }, 1200);
  };

  const handleAddToCart = () => { addToCart(product); showPopup('🛒 Ditambahkan ke Keranjang!'); };
  const handleToggleFavorite = () => { toggleFavorite(product); showPopup(isFav ? '💔 Dihapus dari Favorit' : '❤️ Ditambahkan ke Favorit'); };

  const onPressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  return (
    <>
      {popupVisible && (
        <Animated.View style={[styles.popupContainer, { opacity: popupOpacity, pointerEvents: 'none' }]}>
          <Text style={styles.popupText}>{popupText}</Text>
        </Animated.View>
      )}
      <Animated.View style={[styles.card, { width: cardWidth, transform: [{ scale }], margin: 8 }]}>
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        </Pressable>
        <View style={{ padding: 10 }}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.price}>Rp {price.toLocaleString('id-ID')}</Text>
          <Text style={styles.cat}>{category}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={handleAddToCart}>
              <Text style={styles.buttonText}>+ Keranjang</Text>
            </Pressable>
            <Pressable style={styles.heart} onPress={handleToggleFavorite}>
              <Text style={{ fontSize: 18 }}>{isFav ? '❤️' : '🤍'}</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  card: { backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden',
    ...Platform.select({ ios:{shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.2,shadowRadius:4}, android:{elevation:4}, web:{boxShadow:'0px 2px 6px rgba(0,0,0,0.25)'} })},
  image: { width:'100%', aspectRatio:1, backgroundColor:'#f0f0f0' },
  name: { color: theme.text, fontSize:16, fontWeight:'700', marginTop:6 },
  price: { color: theme.accent, marginTop:4, fontWeight:'600' },
  cat: { color: theme.subtext, marginTop:2, fontSize:13 },
  actions: { marginTop:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  button: { backgroundColor: theme.accent, paddingVertical:6, paddingHorizontal:10, borderRadius:8, flex:1, marginRight:6, alignItems:'center' },
  buttonText: { color:'#000', fontWeight:'700', fontSize:13 },
  heart: { padding:6, alignItems:'center', justifyContent:'center' },
  popupContainer: { position:'absolute', top:60, left:20, right:20, alignItems:'center', backgroundColor:'#000000cc', paddingHorizontal:16, paddingVertical:10, borderRadius:12, zIndex:999 },
  popupText: { color:'#fff', fontWeight:'700', fontSize:14, textAlign:'center' },
});

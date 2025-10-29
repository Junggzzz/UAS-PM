import React from 'react';
import { FlatList, View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { products } from '../../data/products';
import { useShopStore } from '../../store/useShopStore';
import { dark, light } from '../../theme/theme';
import ProductCardWithPopup from '../../components/ProductCardWithPopup';

const CARD_MARGIN=8;

export default function Home(){
  const {width}=useWindowDimensions();
  const {theme,toggleTheme}=useShopStore();
  const themeObj=theme==='dark'?dark:light;

  const numColumns = width<600?2:width<900?3:width<1200?4:5;
  const cardWidth=(width-CARD_MARGIN*(numColumns*2))/numColumns;

  return (
    <View style={[styles.container,{backgroundColor:themeObj.background}]}>
      <View style={styles.header}>
        <Pressable onPress={toggleTheme} style={[styles.themeBtn,{backgroundColor:themeObj.accent}]}>
          <Text style={{color:'#000',fontWeight:'bold'}}>{theme==='dark'?'☀️ Light Mode':'🌙 Dark Mode'}</Text>
        </Pressable>
      </View>
      <FlatList
        data={products}
        numColumns={numColumns}
        keyExtractor={(item)=>item.id}
        renderItem={({item})=><ProductCardWithPopup product={item} cardWidth={cardWidth}/>}
        contentContainerStyle={{paddingHorizontal:CARD_MARGIN,paddingBottom:100,alignItems:'center'}}
      />
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1},
  header:{padding:16,alignItems:'flex-end'},
  themeBtn:{paddingVertical:8,paddingHorizontal:12,borderRadius:8},
});

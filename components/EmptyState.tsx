import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,alignItems:'center',justifyContent:'center'},
  text:{fontSize:16,color:'#666'}
});

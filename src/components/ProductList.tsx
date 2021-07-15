import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, FlatList, Image, StyleSheet } from 'react-native';
import Config from 'react-native-config';

interface Props {}

export const ProductList: React.FC<Props> = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const res = await fetch(`${Config.API_URL}/products/all/1?order=date-desc`);
    const data = await res.json();

    setProducts(data.products);
  };

  const renderItem = useCallback(({ item }) => {
    return <Image style={styles.mainImage} source={{ uri: item.mainImage }} />;
  }, []);

  const keyEctractor = (item: {}, index: number) => `${index}`;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        key={'1'}
        data={products}
        renderItem={renderItem}
        keyExtractor={keyEctractor}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainImage: {
    width: 100,
    height: 100,
  },
});

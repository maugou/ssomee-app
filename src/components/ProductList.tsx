import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  View,
} from 'react-native';
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
    const { mainImage, name, originalPrice, ssomeePrice, soldOut } = item;

    const getPriceWithComma = (price: number) => {
      return new Intl.NumberFormat().format(price);
    };

    return (
      <View style={styles.productBox}>
        <Image style={styles.mainImage} source={{ uri: mainImage }} />

        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>

        {originalPrice !== ssomeePrice && (
          <Text style={styles.originalPrice}>
            {getPriceWithComma(originalPrice)}
          </Text>
        )}

        <Text style={styles.ssomeePrice}>{getPriceWithComma(ssomeePrice)}</Text>

        {soldOut && <Text style={styles.soldOut}>Sold Out</Text>}
      </View>
    );
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

const deviceWidth = Dimensions.get('window').width;
const productWidth = deviceWidth / 2.4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productBox: {
    flexDirection: 'column',
    margin: (deviceWidth / 2 - productWidth) / 2,
  },
  mainImage: {
    width: productWidth,
    height: productWidth,
    borderWidth: 1,
    borderColor: 'rgb(220, 220, 220)',
  },
  productName: {
    width: productWidth,
    marginVertical: 10,
    textAlign: 'center',
  },
  originalPrice: {
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'line-through',
    color: 'rgb(170, 170, 170)',
  },
  ssomeePrice: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  soldOut: {
    position: 'absolute',
    backgroundColor: 'rgb(110, 110, 110)',
    color: 'rgb(255, 255, 255)',
    padding: 3,
    top: 5,
    right: 5,
  },
});

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';

interface Props {}

type Data = {
  category: {};
  products: Products[];
  maxPage: number;
  productCount: number;
};

type Products = {
  prefix: string;
  mainImage: string;
  name: string;
  productUrl: string;
  brand: {};
  orgininalPrice: number;
  ssomeePrice: number;
  soldOut: boolean;
};

const getAllProducts = async (productsPage: number) => {
  let data: Data = {
    category: {},
    products: [],
    maxPage: 0,
    productCount: 0,
  };

  try {
    const res = await fetch(
      `${Config.API_URL}/products/all/${productsPage}?order=date-desc`
    );

    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  return data;
};

const getPriceWithComma = (price: number) => {
  return new Intl.NumberFormat().format(price);
};

export const ProductList: React.FC<Props> = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    refresh();
  }, []);

  const getProducts = async () => {
    const data = await getAllProducts(1);

    setProductsPage(prevProductsPage => prevProductsPage + 1);

    setProducts(data.products);
  };

  const getMoreProducts = useCallback(async () => {
    if (maxPage !== productsPage) {
      setIsLoading(true);

      const data = await getAllProducts(productsPage);

      setProductsPage(prevProductsPage => prevProductsPage + 1);
      setMaxPage(data.maxPage);

      setIsLoading(false);
      setProducts(prevProducts => [...prevProducts, ...data.products]);
    }
  }, [maxPage, productsPage]);

  const refresh = useCallback(async () => {
    setIsRefresh(true);

    await getProducts();

    setIsRefresh(false);
  }, []);

  const renderItem = useCallback(({ item }) => {
    const { mainImage, name, originalPrice, ssomeePrice, soldOut, prefix } =
      item;

    return (
      <TouchableOpacity
        style={styles.productBox}
        onPress={() => navigation.navigate('ProductDetail', { prefix })}>
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
      </TouchableOpacity>
    );
  }, []);

  const keyEctractor = useCallback((item: {}, index: number) => `${index}`, []);

  const ListFooterComponent = useCallback(() => {
    return isLoading ? (
      <ActivityIndicator size="large" color="rgb(70, 70, 70)" />
    ) : null;
  }, [isLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        key={'1'}
        data={products}
        renderItem={renderItem}
        keyExtractor={keyEctractor}
        numColumns={2}
        onEndReachedThreshold={1}
        onEndReached={getMoreProducts}
        refreshing={isRefresh}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<ListFooterComponent />}
      />
    </SafeAreaView>
  );
};

const deviceWidth = Dimensions.get('window').width;
const productWidth = deviceWidth / 2.4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
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

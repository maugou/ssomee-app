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
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { getPriceWithComma } from '../common/constant';
import { getProducts } from '../redux/thunk';
import { RootState } from '../redux/store';

interface Props {}

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

export const ProductList: React.FC<Props> = () => {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState(1);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const productIds = useSelector((store: RootState) => store.productIds);
  const products = useSelector((store: RootState) => store.products);
  const maxPage = useSelector((store: RootState) => store.pagination.maxPage);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = useCallback(async () => {
    setIsRefresh(true);

    await dispatch(getProducts(1));
    setProductsPage(prevProductsPage => prevProductsPage + 1);

    setIsRefresh(false);
  }, [dispatch]);

  const getMoreProducts = useCallback(async () => {
    if (maxPage > productsPage) {
      setIsLoading(true);

      await dispatch(getProducts(productsPage));

      setProductsPage(prevProductsPage => prevProductsPage + 1);

      setIsLoading(false);
    }
  }, [maxPage, productsPage, dispatch]);

  const renderItem = useCallback(
    ({ item }) => {
      if (productIds.length !== 0) {
        const { mainImage, name, originalPrice, ssomeePrice, soldOut, prefix } =
          products[item];

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

            <Text style={styles.ssomeePrice}>
              {getPriceWithComma(ssomeePrice)}
            </Text>

            {soldOut && <Text style={styles.soldOut}>Sold Out</Text>}
          </TouchableOpacity>
        );
      } else {
        return null;
      }
    },
    [productIds, navigation, products]
  );

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
        data={productIds}
        renderItem={renderItem}
        keyExtractor={keyEctractor}
        numColumns={2}
        onEndReachedThreshold={0}
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

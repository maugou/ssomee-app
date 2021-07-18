import React, { useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { getPriceWithComma } from '../common/constant';
import { RootState } from '../redux/store';

export const PurchaseList = () => {
  const navigation = useNavigation();

  const purchaseList = useSelector((store: RootState) => store.purchaseList);
  const products = useSelector((store: RootState) => store.products);

  const renderItem = useCallback(({ item }) => {
    const { mainImage, name, originalPrice, ssomeePrice, soldOut, prefix } =
      products[item];

    return (
      <TouchableOpacity
        style={styles.productBox}
        onPress={() => navigation.navigate('ProductDetail', { prefix })}>
        <Image style={styles.mainImage} source={{ uri: mainImage }} />
        <View>
          <Text style={styles.productName}>{name}</Text>

          <View style={styles.price}>
            {originalPrice !== ssomeePrice && (
              <Text style={styles.originalPrice}>
                {getPriceWithComma(originalPrice)}
              </Text>
            )}

            <Text style={styles.ssomeePrice}>
              {getPriceWithComma(ssomeePrice)} 원
            </Text>
          </View>
        </View>
        {soldOut && <Text style={styles.soldOut}>Sold Out</Text>}
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = (item: string, index: number) => `${index}`;

  const ItemSeparatorComponent = () => {
    return <View style={styles.divideLine} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {purchaseList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.notice}>구매하신 상품이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={purchaseList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      )}
    </SafeAreaView>
  );
};

const deviceWidth = Dimensions.get('window').width;
const productWidth = deviceWidth / 3.2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notice: {
    fontSize: 20,
    textAlign: 'center',
    color: 'rgb(70, 70, 70)',
  },
  productBox: {
    width: deviceWidth - 20,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainImage: {
    width: productWidth,
    height: productWidth,
    borderWidth: 1,
    borderColor: 'rgb(220, 220, 220)',
  },
  productName: {
    width: deviceWidth / 1.8,
    marginHorizontal: 10,
  },
  price: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
  },
  originalPrice: {
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'line-through',
    color: 'rgb(170, 170, 170)',
    marginRight: 4,
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
    left: 5,
  },
  divideLine: {
    borderWidth: 2,
    borderColor: 'rgb(230, 230, 230)',
  },
});

import React, { useCallback, useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isEmpty } from 'lodash';

import { getPriceWithComma } from '../common/constant';
import { RootState } from '../redux/store';
import { removeFromCart, resetCart } from '../redux/slice';
import { purchaseProduct } from '../redux/thunk';

export const Cart = () => {
  const [price, setPrice] = useState({ originalPrice: 0, ssomeePrice: 0 });

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const cart = useSelector((store: RootState) => store.cart);
  const products = useSelector((store: RootState) => store.products);

  useEffect(() => {
    const cartPrice = cart.reduce(
      (calculateRes, id) => {
        if (isEmpty(calculateRes)) {
          calculateRes.originalPrice = products[id].originalPrice;
          calculateRes.ssomeePrice = products[id].ssomeePrice;
        } else {
          calculateRes.originalPrice += products[id].originalPrice;
          calculateRes.ssomeePrice += products[id].ssomeePrice;
        }

        return calculateRes;
      },
      {
        originalPrice: 0,
        ssomeePrice: 0,
      }
    );

    setPrice(cartPrice);
  }, [products, cart]);

  const renderItem = useCallback(
    ({ item, index }) => {
      const { mainImage, name, originalPrice, ssomeePrice, soldOut, prefix } =
        products[item];

      return (
        <>
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
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => dispatch(removeFromCart(index))}>
            <Icon name="close-outline" size={24} color="rgb(110, 110, 110)" />
          </TouchableOpacity>
        </>
      );
    },
    [products, navigation, dispatch]
  );

  const keyEctractor = useCallback((item, index) => `${index}`, []);

  const ItemSeparatorComponent = () => {
    return <View style={styles.divideLine} />;
  };

  const handleOrder = async () => {
    await Promise.all(cart.map(prefix => dispatch(purchaseProduct(prefix))));

    dispatch(resetCart());
  };

  return (
    <SafeAreaView style={styles.container}>
      {cart.length === 0 ? (
        <View style={emptyCartStyles.container}>
          <Text style={emptyCartStyles.notice}>
            장바구니에 담긴 상품이 없습니다.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={keyEctractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />

          <View style={styles.divideLine} />

          <View style={styles.checkPriceBox}>
            <Text>할인금액</Text>
            <Text>
              {getPriceWithComma(price.originalPrice - price.ssomeePrice)} 원
            </Text>
          </View>
          <View style={styles.checkPriceBox}>
            <Text style={styles.orderPriceText}>총 구매금액</Text>
            <Text style={styles.orderPriceText}>
              {getPriceWithComma(price.ssomeePrice)} 원
            </Text>
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
            <Text style={styles.orderText}>구매하기</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const deviceWidth = Dimensions.get('window').width;
const productWidth = deviceWidth / 3.2;

const emptyCartStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  notice: {
    fontSize: 20,
    textAlign: 'center',
    color: 'rgb(70, 70, 70)',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
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
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 6,
    paddingTop: 2,
  },
  checkPriceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  orderButton: {
    backgroundColor: 'rgb(102, 051, 255)',
    padding: 14,
    margin: 16,
  },
  orderPriceText: {
    fontWeight: 'bold',
  },
  orderText: {
    textAlign: 'center',
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

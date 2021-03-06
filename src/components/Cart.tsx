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
import Modal from 'react-native-modal';

import { getPriceWithComma } from '../common/constant';
import { RootState } from '../redux/store';
import { removeFromCart, resetCart } from '../redux/slice';
import { purchaseProduct } from '../redux/thunk';

export const Cart = () => {
  const [price, setPrice] = useState({ originalPrice: 0, ssomeePrice: 0 });
  const [isModalVisible, setModalVisible] = useState(false);

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
                  {getPriceWithComma(ssomeePrice)} ???
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
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {cart.length === 0 ? (
        <View style={emptyCartStyles.container}>
          <Text style={emptyCartStyles.notice}>
            ??????????????? ?????? ????????? ????????????.
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
            <Text>????????????</Text>
            <Text>
              {getPriceWithComma(price.originalPrice - price.ssomeePrice)} ???
            </Text>
          </View>
          <View style={styles.checkPriceBox}>
            <Text style={styles.orderPriceText}>??? ????????????</Text>
            <Text style={styles.orderPriceText}>
              {getPriceWithComma(price.ssomeePrice)} ???
            </Text>
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
            <Text style={styles.orderText}>????????????</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal isVisible={isModalVisible} style={styles.modalContainer}>
        <View style={styles.modalTextBox}>
          <Text style={styles.modalText}>?????? ?????????????????????.</Text>
          <View style={styles.modalButtonBox}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text>??????</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextBox: {
    width: deviceWidth / 1.6,
    height: 160,
    backgroundColor: 'rgb(240, 240, 240)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    flex: 1,
    fontSize: 18,
    paddingTop: 40,
  },
  modalButtonBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth / 1.6,
    borderWidth: 0.3,
  },
  modalButton: {
    marginHorizontal: 10,
    padding: 16,
    paddingHorizontal: 30,
  },
});

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import RenderHtml from 'react-native-render-html';
import { isEmpty } from 'lodash';

import { getPriceWithComma } from '../common/constant';
import { getProductsDetail } from '../redux/thunk';
import { RootState } from '../redux/store';
import { addToCart } from '../redux/slice';

interface Props {}

export const ProductDetail: React.FC<Props> = () => {
  const route = useRoute();
  const { prefix } = route.params;
  const dispatch = useDispatch();

  const product = useSelector((store: RootState) => store.products[prefix]);
  const description = useSelector(
    (store: RootState) => store.products[prefix].description
  );

  useEffect(() => {
    dispatch(getProductsDetail(prefix));
  }, []);

  const handleCart = () => {
    dispatch(addToCart(prefix));
  };

  const { mainImage, name, originalPrice, ssomeePrice } = product;

  return !isEmpty(description) ? (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: mainImage }} style={styles.mainImage} />
        <Text style={styles.name}>{name}</Text>
        <View style={styles.priceBox}>
          {originalPrice !== ssomeePrice && (
            <Text style={styles.originalPrice}>
              {getPriceWithComma(originalPrice)}
            </Text>
          )}

          <Text style={styles.ssomeePrice}>
            {getPriceWithComma(ssomeePrice)} 원
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.orderButtonBox}>
            <Text style={styles.orderText}>구매하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButtonBox} onPress={handleCart}>
            <Text style={styles.cartText}>장바구니 담기</Text>
          </TouchableOpacity>
        </View>

        <RenderHtml contentWidth={deviceWidth} source={{ html: description }} />
      </ScrollView>
    </SafeAreaView>
  ) : (
    <ActivityIndicator
      size="large"
      color="rgb(70, 70, 70)"
      style={styles.loading}
    />
  );
};

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  name: {
    margin: 30,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainImage: {
    width: deviceWidth,
    height: deviceWidth,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 4,
    borderColor: 'rgb(220, 220, 220)',
    padding: 20,
  },
  orderButtonBox: {
    backgroundColor: 'rgb(102, 051, 255)',
    padding: 10,
    marginVertical: 10,
    width: deviceWidth / 3,
  },
  orderText: {
    fontSize: 16,
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cartButtonBox: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgb(102, 051, 255)',
    width: deviceWidth / 3,
  },
  cartText: {
    fontSize: 16,
    color: 'rgb(70, 70, 70)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  priceBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 40,
    alignItems: 'flex-end',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: 'rgb(170, 170, 170)',
    marginHorizontal: 5,
  },
  ssomeePrice: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  loading: {
    ...StyleSheet.absoluteFill,
  },
});

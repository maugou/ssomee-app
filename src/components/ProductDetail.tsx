import React, { useState, useEffect } from 'react';
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
import Config from 'react-native-config';
import RenderHtml from 'react-native-render-html';
import { isEmpty } from 'lodash';

import { getPriceWithComma } from '../common/constant';

interface Props {}

type DetailData = {
  mainImage: string;
  name: string;
  originalPrice: number;
  ssomeePrice: number;
  description: string;
};

export const ProductDetail: React.FC<Props> = () => {
  const [productDetail, setProductDetail] = useState<DetailData>({});

  const route = useRoute();

  useEffect(() => {
    getProductsDetail();
  }, []);

  const getProductsDetail = async () => {
    const res = await fetch(
      `${Config.API_URL}/products/${route.params!.prefix}`
    );
    const data = await res.json();
    setProductDetail(data);
  };

  const { mainImage, name, originalPrice, ssomeePrice, description } =
    productDetail;

  return !isEmpty(productDetail) ? (
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
          <TouchableOpacity style={styles.basketButtonBox}>
            <Text style={styles.basketText}>장바구니</Text>
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
  basketButtonBox: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgb(102, 051, 255)',
    width: deviceWidth / 3,
  },
  basketText: {
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

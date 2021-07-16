import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';
import RenderHtml from 'react-native-render-html';

interface Props {}

export const ProductDetail: React.FC<Props> = () => {
  const [productDetail, setProductDetail] = useState({});

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: productDetail.mainImage }}
          style={styles.mainImage}
        />
        <Text>{productDetail.name}</Text>

        {productDetail.description && (
          <RenderHtml
            contentWidth={deviceWidth}
            source={{ html: productDetail.description }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  mainImage: {
    width: deviceWidth,
    height: deviceWidth,
  },
});

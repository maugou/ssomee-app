import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { getPriceWithComma } from '../common/constant';
import { getProducts } from '../redux/thunk';
import { RootState } from '../redux/store';
import { resetProductIds } from '../redux/slice';

interface Props {}

const filterObj: any = {
  '최신순': 'date-desc',
  '낮은 가격순': 'price-asc',
  '높은 가격순': 'price-desc',
};

export const ProductList: React.FC<Props> = () => {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [isFilter, setIsFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('최신순');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const productIds = useSelector((store: RootState) => store.productIds);
  const products = useSelector((store: RootState) => store.products);
  const maxPage = useSelector((store: RootState) => store.pagination.maxPage);

  const textInput = useRef(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = useCallback(async () => {
    setIsRefresh(true);

    await dispatch(getProducts({ page: 1, order: filterObj[selectedFilter] }));
    setProductsPage(prevProductsPage => prevProductsPage + 1);

    setIsRefresh(false);
  }, [dispatch, selectedFilter]);

  const getMoreProducts = useCallback(async () => {
    if (maxPage > productsPage) {
      setIsLoading(true);

      await dispatch(
        getProducts({ page: productsPage, order: filterObj[selectedFilter] })
      );

      setProductsPage(prevProductsPage => prevProductsPage + 1);

      setIsLoading(false);
    }
  }, [maxPage, productsPage, dispatch, selectedFilter]);

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

  const listFooterComponent = useCallback(() => {
    return isLoading ? (
      <ActivityIndicator size="large" color="rgb(70, 70, 70)" />
    ) : null;
  }, [isLoading]);

  const searchProduct = ({
    nativeEvent,
  }: {
    nativeEvent: { text: string };
  }) => {
    setSearchText(nativeEvent.text.toLowerCase());
  };

  const getSearchProductIds = () => {
    const values = Object.values(products);

    const searchRes = values.filter(value =>
      value.name.toLowerCase().includes(searchText)
    );

    searchRes.sort((a, b) => {
      return (
        a.name.toLowerCase().indexOf(searchText) -
        b.name.toLowerCase().indexOf(searchText)
      );
    });

    const sortPrefix = searchRes.map(res => res.prefix);

    return sortPrefix;
  };

  const refreshSearch = useCallback(() => {
    setSearchText('');
    setIsFilter(false);
    textInput.current?.clear();
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilter(prevIsFilter => !prevIsFilter);
  }, []);

  const renderFilterItem = ({ item }: { item: string }) => {
    const filterButtonStyles = [styles.filterButton];
    const filterTextStyles = [styles.filterText];
    if (selectedFilter === item) {
      filterButtonStyles.push({ backgroundColor: 'rgb(110, 110, 110)' });
      filterTextStyles.push({ color: 'rgb(255, 255, 255)' });
    }

    return (
      <>
        <TouchableOpacity
          style={filterButtonStyles}
          onPress={() => {
            dispatch(resetProductIds());
            setIsFilter(false);
            setSelectedFilter(item);

            dispatch(getProducts({ page: 1, order: filterObj[item] }));
            setProductsPage(2);
          }}>
          <Text style={filterTextStyles}>{item}</Text>
        </TouchableOpacity>
      </>
    );
  };

  const filterKeyEctractor = (item: string, index: number) => `${index}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBox}>
        <TextInput
          ref={textInput}
          style={styles.searchBox}
          returnKeyType="search"
          placeholder="찾으시는 상품을 검색해보세요."
          onSubmitEditing={searchProduct}
        />
        {searchText ? (
          <TouchableOpacity style={styles.button} onPress={refreshSearch}>
            <Icon name="refresh-outline" size={28} color="rgb(70, 70, 70)" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={toggleFilter}>
            <Icon name="filter-outline" size={28} color="rgb(70, 70, 70)" />
          </TouchableOpacity>
        )}
      </View>
      {isFilter && (
        <View style={styles.filterBox}>
          <FlatList
            key={'filter'}
            data={Object.keys(filterObj)}
            renderItem={renderFilterItem}
            keyExtractor={filterKeyEctractor}
            numColumns={3}
          />
        </View>
      )}
      <FlatList
        key={'productList'}
        data={searchText ? getSearchProductIds() : productIds}
        renderItem={renderItem}
        keyExtractor={keyEctractor}
        numColumns={2}
        onEndReachedThreshold={0}
        onEndReached={getMoreProducts}
        refreshing={isRefresh}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={listFooterComponent}
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
  topBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: (deviceWidth / 2 - productWidth) / 2,
    marginBottom: 0,
  },
  searchBox: {
    flex: 1,
    height: 40,
    marginRight: 16,
    borderWidth: 0.5,
    borderColor: 'rgb(170, 170, 170)',
    padding: 10,
  },
  button: {
    padding: 4,
  },
  filterBox: {
    alignItems: 'flex-end',
    marginHorizontal: (deviceWidth / 2 - productWidth) / 2,
    padding: 4,
  },
  filterButton: {
    padding: 6,
    marginHorizontal: 4,
    borderWidth: 0.5,
    borderColor: 'rgb(220, 220, 220)',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  filterText: {
    color: 'rgb(110, 110, 110)',
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

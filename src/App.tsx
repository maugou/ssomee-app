import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { store } from './redux/store';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const BottomTabRoute = () => {
  return (
    <BottomTab.Navigator
      tabBarOptions={{ activeTintColor: 'rgb(255, 102, 000)' }}>
      <BottomTab.Screen
        name="목록"
        component={ProductList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="reorder-four-outline" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="장바구니"
        component={Cart}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-outline" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="ProductList"
            component={BottomTabRoute}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={{
              headerTitle: () => <Text style={styles.header}>SSOMEE</Text>,
              headerBackTitleVisible: false,
              headerBackImage: () => (
                <Icon
                  name="arrow-back-outline"
                  size={26}
                  color="rgb(70, 70, 70)"
                  style={styles.backArrow}
                />
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(102, 051, 255)',
  },
  backArrow: {
    paddingHorizontal: 14,
  },
});

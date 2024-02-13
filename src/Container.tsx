import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Dashboard from './screens/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import DatabaseProvider from './Database/DatabaseProvider'
import NumberView from './screens/NumberView';
import SaleView from './screens/Sale/SaleView';
import SaleProvider from './context/SaleProvider';


const Stack = createStackNavigator();


const Container = () => {
  return (
    <NavigationContainer >
    <Stack.Navigator screenOptions={{
        headerShown: false
        
    }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Sale" component={SaleView} />
      <Stack.Screen name="AllNumber" component={NumberView} />

    </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return <DatabaseProvider><SaleProvider><Container /></SaleProvider></DatabaseProvider>;
}


export default App;
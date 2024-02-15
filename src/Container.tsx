import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Dashboard from './screens/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import DatabaseProvider from './Database/DatabaseProvider'
import NumberView from './screens/AllNumber/NumberView';
import SaleView from './screens/Sale/SaleView';
import SaleProvider from './context/SaleProvider';
import NumberDetail from './screens/AllNumber/NumberDetail';
import AllReport from './screens/AllReport/AllReport';
import Customer from './screens/Customer/Customer';
import CustomerDetail from './screens/Customer/CustomerDetail';
import ByCustomerDetail from './screens/Customer/ByCustomerDetail';
import VoucherView from './screens/Voucher/VoucherView';
import PrinterView from './screens/Printer/PrinterView';
import Login from './screens/Login';
import LoginProvider, { useLogin } from './context/LoginProvider';


const Stack = createStackNavigator();


const Container = () => {
  const { isLogged, setIsLogged } = useLogin();

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{
        headerShown: false

      }}>{!isLogged ?
        <Stack.Screen name="login" component={Login} />
        : <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Sale" component={SaleView} />
          <Stack.Screen name="AllNumber" component={NumberView} />
          <Stack.Screen name="AllReport" component={AllReport} />

          <Stack.Screen name="NumberDetail" component={NumberDetail} />
          <Stack.Screen name="Customer" component={Customer} />
          <Stack.Screen name="CustomerDetail" component={CustomerDetail} />
          <Stack.Screen name="ByCustomerDetail" component={ByCustomerDetail} />
          <Stack.Screen name="VoucherView" component={VoucherView} />
          <Stack.Screen name="PrinterView" component={PrinterView} />
        </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return <LoginProvider><DatabaseProvider><SaleProvider><Container /></SaleProvider></DatabaseProvider></LoginProvider>;
}


export default App;
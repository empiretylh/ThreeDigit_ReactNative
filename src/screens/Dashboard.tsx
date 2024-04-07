import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Image, Alert, Linking, ToastAndroid, Vibration , PermissionsAndroid} from 'react-native';
import { View, Button } from '@ant-design/react-native';
import { IMAGE, STYLES, appname } from '../config/config';
import salesTable from '../Database/salesTable';
import numbersTable from '../Database/numbersTable';

import Icons from 'react-native-vector-icons/Ionicons';
import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';

import EncryptedStorage from 'react-native-encrypted-storage';
import { useLogin } from '../context/LoginProvider';
const Dashboard: React.FC = ({ navigation }) => {

    const [isPrinterConnet, setIsPrinterConnet] = useState(false);

    const { isLogged, setIsLogged } = useLogin();

    const requestPermission = async () => {
        const granted = PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE])

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Bluetooth');
        } else {
            console.log('Bluetooth permission denied');
        }
    }

    useEffect(() => {

        requestPermission();
        EncryptedStorage.getItem('printer').then((encydata: any) => {
            BLEPrinter.init().then((data: any) => {
                BLEPrinter.connectPrinter(encydata).then((data: any) => {
                    ToastAndroid.show("Printer Connected", ToastAndroid.SHORT);
                    setIsPrinterConnet(true);
                });
            });
        });


    }, []);








   

    const DeleteAll = () => {
        Alert.alert('Delete All', 'Are you sure to delete all data?', [
            { text: 'No', onPress: () => { } },
            {
                text: 'Yes', onPress: () => {
                    salesTable.deletAllSales();
                    numbersTable.RemoveAllAmount();
                }
            }
        ]);

    }



    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                padding: 10,
                backgroundColor: 'white',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,

            }}>
                <Image source={IMAGE.icon} style={{ width: 40, height: 40, marginRight: 10 }} />
                <Text style={styles.title}>{appname}</Text>
                <TouchableOpacity
                    onPress={() => {
                        EncryptedStorage.removeItem('login');
                        setIsLogged(false);
                        Vibration.vibrate(100);
                    }}
                    style={{ marginLeft: 'auto' }}>
                    <Icons name="log-out-outline" size={30} color="red" />
                </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center' }}>

                <TouchableOpacity style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 100,
                    flexGrow: 2,
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'green',
                    borderRadius: 10,
                }}
                    onPress={() => navigation.navigate('Sale')}
                >
                    <Icons name="add-circle-outline" size={30} color="white" />

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center', marginLeft: 8 }}>Sale</Text>

                </TouchableOpacity>


                <TouchableOpacity style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    height: 100,
                    padding: 10,
                    margin: 5,
                    backgroundColor: '#03a1fc',
                    borderRadius: 10,
                }}
                    onPress={() => navigation.navigate('Customer')}
                >
                    <Icons name="people-outline" size={30} color="white" />
                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Customer</Text>

                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: '#3e04bd',
                    borderRadius: 10,
                    flex: 1,
                    height: 100,
                }}
                    onPress={() => navigation.navigate('AllNumber')}
                >
                    <Icons name="list-circle-outline" size={30} color="white" />

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Number</Text>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CustomerDetail')}
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        margin: 5,
                        backgroundColor: '#a84702',
                        borderRadius: 10,
                        height: 100,
                    }}>
                    <Icons name="person-circle-outline" size={30} color="white" />

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Customer Details</Text>

                </TouchableOpacity>





            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: '#e0c10d',
                    flex: 1,
                    height: 100,
                    borderRadius: 10,
                }}
                    onPress={() => navigation.navigate('AllReport')}
                >
                    <Icons name="document-text-outline" size={30} color="white" />

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center', marginLeft: 5 }}>All Report</Text>

                </TouchableOpacity>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: '#eb17cb',
                    borderRadius: 10,
                    flex: 1,
                    height: 100,
                }}
                    onPress={()=>{
                        navigation.navigate('ExportPDF');
                    }}
                >
                    <Icons name="document-text-outline" size={30} color="white" />
                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>PDF</Text>

                </TouchableOpacity>



                <TouchableOpacity onPress={DeleteAll} style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'red',
                    flex: 1,
                    height: 100,
                    borderRadius: 10,
                }}>
                    <Icons name="trash-outline" size={30} color="white" />
                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Delete All</Text>

                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: '#eb5e17',
                    borderRadius: 10,
                    flex: 1,
                    height: 100,
                }}
                    onPress={() => navigation.navigate('PrinterView')}
                >
                    <Icons name="print-outline" size={30} color="white" />
                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}> Printer</Text>
                </TouchableOpacity>


            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: 'white'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',

    },
    count: {
        fontSize: 36,
        margin: 20,
    },
    button: {
        fontSize: 24,
        color: 'blue',
    },
});


export default Dashboard;
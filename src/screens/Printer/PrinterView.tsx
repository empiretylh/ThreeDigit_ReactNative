import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../../config/config';
import ViewShot from "react-native-view-shot";
import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import EncryptedStorage from 'react-native-encrypted-storage'
import { ActivityIndicator } from '@ant-design/react-native';

const PrinterView = ({ navigation, route }) => {

    const [printers, setPrinters] = useState([]);
    const [connected, setConnected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paperWidth, setPaperWidth] = useState(384);

    const getAllDeviceList = async () => {
        setLoading(true);
        BLEPrinter.init().then((data: any) => {
            BLEPrinter.getDeviceList().then((data: any) => {
                console.log(data)
                setPrinters(data);
                setLoading(false);
            });
        });
    }

    const connectDevice = (device) => {
        BLEPrinter.connectPrinter(device.inner_mac_address).then((data: any) => {
            setConnected(device)
            EncryptedStorage.setItem('printer', device.inner_mac_address);
            Alert.alert("Success", "Printer connected successfully");
        }).catch(err => {
            Alert.alert("Error", "Unable to connect printer")
        })
    }

    const onPaperWidth = (width : number) => {
        EncryptedStorage.setItem('paperWidth', width);
        setPaperWidth(width);
    }

    useEffect(() => {
        console.log(BLEPrinter);
        getAllDeviceList();

    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 4,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: 'center', alignItems: 'center', padding: 5, margin: 5, borderRadius: 10 }}>
                    <Icons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ ...STYLES.title, fontSize: 25 }}>Printer</Text>
                <View style={{ marginLeft: 'auto' }}>
                    {/* Scan Button */}
                    <TouchableOpacity onPress={() => getAllDeviceList()} style={{ justifyContent: 'center', alignItems: 'center', padding: 5, margin: 5, borderRadius: 10, backgroundColor: 'blue', flexDirection: 'row' }}>
                        <Icons name="refresh" size={30} color="white" />
                        <Text style={{ ...STYLES.bold_text, color: 'white', marginLeft: 5 }}>Scan</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={{ ...STYLES.title, fontSize: 20, paddingHorizontal: 10, marginTop: 7 }}>Connected : </Text>
                {connected ? <TouchableOpacity style={{ padding: 10, margin: 5, backgroundColor: 'green', borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{connected.device_name}</Text>
                        <Text style={{ fontSize: 15, color: 'white' }}>{connected.inner_mac_address}</Text>
                    </View>
                </TouchableOpacity> : null}
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={{ ...STYLES.title, fontSize: 20, paddingHorizontal: 10, marginTop: 7 }}>Paper Width : </Text>
                 <TextInput 
                    style={{height: 40, width:120, borderColor: 'gray', borderWidth: 1,  paddingHorizontal: 10, marginTop: 7, marginHorizontal:10, fontSize:20, textAlign:'center'}}
                    onChangeText={text => onPaperWidth(text)}
                    value={paperWidth}
                    keyboardType="numeric"
                />
            </View>


            <View>
                <Text style={{ ...STYLES.title, fontSize: 20, paddingHorizontal: 10, marginTop: 7 }}>Bluetooth List</Text>
                <Text style={{ ...STYLES.normal_text, fontSize: 14, paddingHorizontal: 10 }}>Tap to Connect</Text>
            </View>
            <ScrollView style={{ flex: 1, padding: 5 }}>
                <ActivityIndicator toast text="Loading..." animating={loading} />
                {
                    printers.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => connectDevice(item)} style={{ padding: 10, margin: 5, backgroundColor: 'white', borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{item.device_name}</Text>
                                    <Text style={{ fontSize: 15, color: 'black' }}>{item.inner_mac_address}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>

        </View>
    );
}



export default PrinterView;
import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, FlatList, Vibration, PermissionsAndroid, ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import salesTable from '../../Database/salesTable';
import numbersTable from '../../Database/numbersTable';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../../config/config';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

const requestStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Storage Permission",
                message: "App needs access to your storage to download PDF",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the storage");
        } else {
            console.log("Storage permission denied");
        }
    } catch (err) {
        console.warn(err);
    }
};

const ExportPDF = ({ navigation }) => {

    const [numbers, setNumbers] = useState<any>([]);
    const [removeZero, setRemoveZero] =  useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [baEditShow, setbaEditShow] = useState(false);
    const baRef: any = useRef(null)


    const numbersFilter = useMemo(() => {
        let n = numbers.filter((number: any) => {
            if (removeZero) {
                return number.amount > 0;
            }
            return true;
        });

        return n;
    } , [removeZero, numbers]);


    useEffect(() => {
        numbersTable.getNumbers(setNumbers);
    }, []);




    useEffect(() => {
        if (baEditShow) {
            baRef.current.focus();

        }
    }, [baEditShow])

    const exportPDFNumberTable = async () => {
         await requestStoragePermission();

            let options = {
                html: '<div align="center"><table border="1"><tr><th>Number</th><th>Amount</th></tr>' + numbers.map((item: any) => {
                    if(removeZero && item.amount == 0) {
                        return '';
                    }
                
                    return '<tr><td>' + item.number + '</td><td>' + item.amount + '</td></tr>'
                }).join('') + '</table></div>',
                fileName: 'Number',
                directory: 'Documents',
            };

            setIsExporting(true);
            
            let file = await RNHTMLtoPDF.convert(options);

            setIsExporting(false);
            ToastAndroid.show("PDF Exported : " + file.filePath, ToastAndroid.SHORT);
            Alert.alert('PDF Exported', 'You file is exported in ' + file.filePath);

            FileViewer.open(file.filePath)
                .then(() => {
                   
                })
                .catch(error => {
                    // error
                });

    
    }
  

    const RenderNumberItem = (item: any, index: number) => {
        return (
            <TouchableOpacity  key={index} style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white', borderWidth: 1 }}>
                <Text style={{ ...STYLES.title, fontSize: 25, flex: 1, textAlign: 'center' }}>{item.number}</Text>
                <Text style={{ ...STYLES.title, fontSize: 25, flex: 1, textAlign: 'right' }}>{numberWithCommas(item.amount)}</Text>
                </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
           
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
                <TouchableOpacity onPress={() => {navigation.goBack(); Vibration.vibrate(100)}} style={{ justifyContent: 'center', alignItems: 'center', padding: 5, margin: 5, borderRadius: 10 }}>
                    <Icons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ ...STYLES.title, fontSize: 20 }}>Export PDF</Text>

                <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 10 }}>
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => exportPDFNumberTable()}>

                   {isExporting ? <ActivityIndicator size={'small'} color="black"/>:     <Icons name="document-outline" size={30} color="black" />}
                        <Text style={{ ...STYLES.title, fontSize: 20 }}>Export PDF</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search bar and filter button */}
            <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white', margin: 5, borderRadius: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                   
                </View>
                <TouchableOpacity onPress={() => setRemoveZero(prev=> !prev)} style={{ ...STYLES.button, backgroundColor: removeZero ? 'green' : '#f0f0f0', marginLeft: 5 }}>
                    <Icons name="close-circle-outline" size={20} color={removeZero ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white', margin: 5, borderRadius: 10 }}>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, textAlign: 'center' }}>Number</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, textAlign: 'center' }}>Amount</Text>
             </View>
            <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
                <FlatList
                    data={numbersFilter}
                    renderItem={({ item, index }) => RenderNumberItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    )
}

export default ExportPDF;


const computeExtraAmount = (amount: number, ba: number) => {
   
    if (amount > ba) {
        console.log("Break amount Compute :", ba , amount, amount - ba);
        return amount - ba;
    }
    return 0;
}


const numberWithCommas = (x: any) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


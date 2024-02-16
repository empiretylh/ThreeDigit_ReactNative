import React, { useMemo, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../../config/config';
import ViewShot from "react-native-view-shot";
import EncryptedStorage from 'react-native-encrypted-storage';
import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';
const VoucherView = ({ navigation, route }) => {

    const { customer, vcno, number } = route.params;

    const computePermutLength = (str: string) => {
        let num = getPermutations(str);
        console.log("R Length : ", num.length, num)
        return getPermutations(str).length;
    }

    const viewRef = useRef();
    const captureImage = async () => {
        const uri = await ViewShot.captureRef(viewRef, {
            result: "base64",
            format: "png",
            quality: 0.8,

        });
        return uri;
    }

    const printVoucher = async () => {
        const imageUri = await captureImage();
        // setImageUri(imgUri);
        // console.log(imgUri)
        // const imageUri = await capturePrint();

        let printer = await EncryptedStorage.getItem('printer');


        //get paper width from storage
        let paperWidth = await EncryptedStorage.getItem('paperWidth');
        if (paperWidth == null) {
            paperWidth = 384; // 574
        }

        paperWidth = parseInt(paperWidth);

        Image.getSize(`data:image/png;base64,${imageUri}`, (width, height) => {
            console.log(width, height);
            const printerAspectRatio = paperWidth / height;

            const imageAspectRatio = width / height;
            let newWidth, newHeight;

            if (imageAspectRatio > printerAspectRatio) {
                newWidth = paperWidth;
                newHeight = paperWidth / imageAspectRatio;
            } else {
                newHeight = height;
                newWidth = height * imageAspectRatio;
            }


            BLEPrinter.init();
            BLEPrinter.connectPrinter(printer);
            BLEPrinter.printImageBase64(imageUri, {
                imageWidth: newWidth,
                imageHeight: newHeight,
            });
        });

     


    };


    const computeTotal = useMemo(() => {
        let total = 0;
        number.map((item) => {
            if (item.isR) {
                total += parseInt(item.amount) * parseInt(computePermutLength(item.number));
            } else {
                total += parseInt(item.amount);
            }
        })
        return total;
    }, [number])


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
                <Text style={{ ...STYLES.title, fontSize: 25 }}>All Report</Text>

                {/* print button  */}
                <TouchableOpacity onPress={() => {
                    printVoucher();
                }} style={{ justifyContent: 'center', alignItems: 'center', padding: 10, marginLeft: 'auto', borderRadius: 10, backgroundColor: 'blue', flexDirection: 'row' }}>
                    <Icons name="print" size={30} color="white" />
                    <Text style={{ ...STYLES.bold_text, fontSize: 20, marginLeft: 5, color: 'white' }}> Print </Text>
                </TouchableOpacity>

            </View>

            <ViewShot ref={viewRef} style={{backgroundColor:'white', margin:15}} >
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 40,
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',
                        margin: 10
                    }}>မင်္ဂလာပါ</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', padding: 10 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'black',
                            textAlign: 'left',

                        }}>{customer}</Text>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'black',
                            textAlign: 'left',

                        }}>{new Date().toDateString()}</Text>
                    </View>

                    <View style={{ flexDirection: 'column', padding: 10 }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: 'black',
                            textAlign: 'right',

                        }}>Voucher Number  : {vcno}</Text>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'black',
                            textAlign: 'right',

                        }}>{new Date().toTimeString().slice(0, 5)}</Text>
                    </View>
                </View>

                <View style={{ borderBottomWidth: 2, borderColor: 'black', marginHorizontal: 15, borderStyle: 'dashed', marginBottom: 10, }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{
                        flex: 1,
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',

                    }}>No</Text>


                    <Text style={{
                        flex: 1,
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',

                    }}>Price</Text>
                </View>
                <View style={{ borderBottomWidth: 2, borderColor: 'black', marginHorizontal: 15, marginTop: 10, borderStyle: 'dashed' }} />

                {number.map((item, index) => {
                    return (
                        <View key={index} style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between', marginHorizontal: 20, alignItems: 'center' }}>
                            <Text style={{
                                flex: 1,
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: 'black',
                                textAlign: 'center',


                            }}>{item.number}{item.isR ? '(R)' : ''}</Text>

                            <Text style={{
                                flex: 1,
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: 'black',
                                textAlign: 'center',


                            }}>{item.amount}</Text>
                        </View>

                    )
                }
                )
                }
                <View style={{ borderBottomWidth: 2, borderColor: 'black', marginHorizontal: 15, marginTop: 10, borderStyle: 'dashed' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{
                        flex: 1,
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',

                    }}>Total</Text>


                    <Text style={{
                        flex: 1,
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',

                    }}>{computeTotal}</Text>
                </View>

                <View style={{marginBottom:20}}>
                    <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', color: 'black', marginTop: 15 }}>
                        ဘောင်ချာပျောက်လျှင်တာဝန်မယူပါ။
                    </Text>
                </View>
            </ViewShot>
        </View>
    );
}


function getPermutations(string: string) {
    if (string.length <= 1) {
        return [string];
    }

    const allCharsExceptLast = string.slice(0, -1);
    const lastChar = string.slice(-1);

    const permutationsOfAllCharsExceptLast = getPermutations(allCharsExceptLast);

    const permutations = new Set<string>(); // Use a Set to automatically avoid duplicates

    permutationsOfAllCharsExceptLast.forEach((permutationOfAllCharsExceptLast) => {
        for (let position = 0; position <= allCharsExceptLast.length; position++) {
            const permutation =
                permutationOfAllCharsExceptLast.slice(0, position) +
                lastChar +
                permutationOfAllCharsExceptLast.slice(position);
            permutations.add(permutation);
        }
    });

    return Array.from(permutations) // Convert the Set back to an Array
}

export default VoucherView;
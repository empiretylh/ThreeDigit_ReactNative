import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import salesTable from '../../Database/salesTable';
import numbersTable from '../../Database/numbersTable';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../../config/config';
import breakAmountTable from '../../Database/breakamount';
import { MessageModalNormal } from '../MessageModal';

const NumberDetail = ({ navigation, route }) => {

    const { number } = route.params;


    const [numbers, setNumbers] = useState<any>([]);
    const [ba, setBa] = useState<any>([]);

    const [baeditvalue, setbaEditValue] = useState<any>('');
    const [baEditShow, setbaEditShow] = useState(false);
    const baRef: any = useRef(null)




    const [searchText, setSearchText] = useState('');

    const numbersFilter = useMemo(() => {
        let n = numbers.filter((number: any) => {
            return number.vcno.includes(searchText);
        });

        return n;

    }, [numbers, searchText]);


    const AmountTotal = useMemo(() => {
        let total = 0;
        numbersFilter.map((number: any) => {
            total += number.amount;
        });
        return total;
    }, [numbersFilter]);

    const getBreakAmount = () => {
        let ba = numbersTable.getBreakAmountByNumber(number, setBa);
    }

    useEffect(() => {
        salesTable.getSaleByNumber(number, setNumbers);
        getBreakAmount();
    }, []);



    const insertBreakAmount = () => {
        let baValue = parseInt(baeditvalue);
        numbersTable.setBreakAmount(number, baValue);
        setbaEditShow(false);
        getBreakAmount();
    }

   




    let screenWidth = Dimensions.get('window').width;
    let tableWidth = [screenWidth * 0.25, screenWidth * 0.25, screenWidth * 0.25, screenWidth * 0.25]; // 4 columns


    const RenderNumberItem = (item: any, index: number) => {
        return (
            <View key={index} style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white', borderWidth: 1 }}>
                <Text style={{ ...STYLES.title, fontSize: 25, width: tableWidth[0], flex: 1, textAlign: 'center' }}>{item.number}</Text>
                <Text style={{ ...STYLES.title, fontSize: 25, width: tableWidth[1], flex: 1, textAlign: 'right' }}>{numberWithCommas(item.amount)}</Text>
                <Text style={{ ...STYLES.title, fontSize: 25, width: tableWidth[2], flex: 1, textAlign: 'center', color: 'black' }}>{item.vcno}</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, width: tableWidth[3], flex: 1, textAlign: 'center', color: 'black' }}>{new Date(item.date).toDateString()}</Text>

            </View>
        )
    }



    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <MessageModalNormal show={baEditShow} onClose={() => setbaEditShow(false)}>
                <View>
                    <Text style={{ ...STYLES.title, fontSize: 20, textAlign: 'center' }}>Edit Break Amount</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10 }}>

                        <TextInput
                            style={{ ...STYLES.bold_text, fontSize: 20, borderWidth: 1, flex: 1, color: 'black', textAlign: 'center' }}
                            value={baeditvalue}
                            ref={baRef}
                            placeholderTextColor={'#000'}
                            placeholder="Enter Break Amount"
                            onChangeText={(text) => setbaEditValue(text)}
                            keyboardType='numeric'
                            selectTextOnFocus={true}
                        />

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                        <TouchableOpacity onPress={() => setbaEditShow(false)} style={{ ...STYLES.button, backgroundColor: 'red', margin: 5 }}>
                            <Text style={{ ...STYLES.title, fontSize: 20, color: 'white' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => insertBreakAmount()} style={{ ...STYLES.button, flex: 1, backgroundColor: 'green', margin: 5 }}>
                            <Text style={{ ...STYLES.title, fontSize: 20, color: 'white' }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </MessageModalNormal>

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
                <Text style={{ ...STYLES.title, fontSize: 25 }}>{number}</Text>
                <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 10 }}>
                <Text style={{ ...STYLES.title, fontSize: 19, marginRight: 5 }}>Break Amount : {numberWithCommas(ba[0]?.breakamount)}</Text>
                <TouchableOpacity onPress={() => setbaEditShow(true)}>
                    <Icons name="create-outline" size={30} color="black" />
                </TouchableOpacity>
            </View>


            </View>

          

            {/* Search bar and filter button */}
            <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white', margin: 5, borderRadius: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        style={{ ...STYLES.bold_text, fontSize: 18, flex: 1, borderRadius: 15, color: 'black', backgroundColor: '#f0f0f0', paddingLeft: 10 }}
                        placeholderTextColor={'#000'}
                        placeholder="Search Voucher Number"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                </View>
                <TouchableOpacity style={{ ...STYLES.button, backgroundColor: 'green', marginLeft: 2 }}>
                    <Icons name="search" size={20} color="white" />
                </TouchableOpacity>

            </View>


            <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white', margin: 5, borderRadius: 10 }}>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, width: tableWidth[0], textAlign: 'center' }}>Number</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, width: tableWidth[0], textAlign: 'center' }}>Amount</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, width: tableWidth[0], textAlign: 'center' }}>VCNo</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, width: tableWidth[0], textAlign: 'center' }}>Date</Text>

            </View>
            <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
                <FlatList
                    data={numbersFilter}
                    renderItem={({ item, index }) => RenderNumberItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={{padding:10,alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                <Text style={{ ...STYLES.title, fontSize: 20 }}>Total Amount : {numberWithCommas(AmountTotal)}</Text>

            </View>

        </View>
    )
}

export default NumberDetail;


const computeExtraAmount = (amount: number, ba: number) => {
    if (amount > ba) {
        return amount - ba;
    }
    return 0;
}


const numberWithCommas = (x: any) => {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


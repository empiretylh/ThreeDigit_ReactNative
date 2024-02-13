import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, FlatList } from 'react-native';
import salesTable from '../Database/salesTable';
import numbersTable from '../Database/numbersTable';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../config/config';
import breakAmountTable from '../Database/breakamount';
import { MessageModalNormal } from './MessageModal';

const NumberView = ({ navigation }) => {

    const [numbers, setNumbers] = useState<any>([]);
    const [ba, setBa] = useState<any>([]);

    const [baeditvalue, setbaEditValue] = useState<any>('');
    const [baEditShow, setbaEditShow] = useState(false);
    const baRef: any = useRef(null)

    const getBreakAmount = async () => {
        let ba = await breakAmountTable.getLastBreakAmount();
        setBa(ba);
    }


    const [filterShow, setFilterShow] = useState<any>(false);
    const [filterType, setFilterType] = useState<any>('number-asc'); // amount asc, desc | number asc, desc | minus-amount asc, desc

    const [searchText, setSearchText] = useState('');

    const numbersFilter = useMemo(() => {
        let n = numbers.filter((number: any) => {
            return number.number.includes(searchText);
        });

        if (filterType == 'number-asc') {
            return n.sort((a: any, b: any) => a.number - b.number);
        }
        if (filterType == 'number-desc') {
            return n.sort((a: any, b: any) => b.number - a.number);
        }
        if (filterType == 'amount-asc') {
            return n.sort((a: any, b: any) => a.amount - b.amount);
        }
        if (filterType == 'amount-desc') {
            return n.sort((a: any, b: any) => b.amount - a.amount);
        }
        if (filterType == 'minus-amount-asc') {
            return n.sort((a: string, b: string) => computeExtraAmount(parseInt(a.amount),ba) - computeExtraAmount(parseInt(b.amount),ba));
        }
        if (filterType == 'minus-amount-desc') {
            return n.sort((a: any, b: any) =>computeExtraAmount(parseInt(b.amount), ba) - computeExtraAmount(parseInt(a.amount), ba));
        }
    }
        , [filterType, numbers, searchText]);


    useEffect(() => {
        getBreakAmount();
        numbersTable.getNumbers(setNumbers);
    }, []);

    useEffect(() => {
        if (baEditShow) {
            baRef.current.focus();

        }
    }, [baEditShow])

    const insertBreakAmount = async () => {
        if (baeditvalue == '') {
            return;
        }
        let ba = await breakAmountTable.getLastBreakAmount();
        if (ba == baeditvalue) {
            return;
        }
        await breakAmountTable.insertBreakAmount(baeditvalue);
        setbaEditShow(false);
        getBreakAmount();
    }

    const RenderNumberItem = (item: any, index: number) => {
        return (
            <View key={index} style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white', borderWidth: 1 }}>
                <Text style={{ ...STYLES.title, fontSize: 25, flex: 1, textAlign: 'center' }}>{item.number}</Text>
                <Text style={{ ...STYLES.title, fontSize: 25, flex: 1, textAlign: 'right' }}>{numberWithCommas(item.amount)}</Text>
                <Text style={{ ...STYLES.title, fontSize: 25, flex: 1, textAlign: 'right', color: parseInt(item.amount) > parseInt(ba) ? 'red' : 'black' }}>{numberWithCommas(computeExtraAmount(item.amount, ba))}</Text>
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
            <MessageModalNormal show={filterShow} onClose={() => setFilterShow(false)}>
                <View>
                    <Text style={{ ...STYLES.title, fontSize: 20, textAlign: 'left' }}>Filter Type</Text>
                    <TouchableOpacity onPress={() => { setFilterType('number-asc'); setFilterShow(false) }} style={{ ...STYLES.button, backgroundColor: filterType == 'number-asc' ? '#9cd9be' : '#f0f0f0', margin: 5 }}>
                        <Text style={{ ...STYLES.title, fontSize: 18, color: 'black' }}>Number Ascending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setFilterType('number-desc'); setFilterShow(false) }} style={{ ...STYLES.button, backgroundColor: filterType == 'number-desc' ? '#9cd9be' : '#f0f0f0', margin: 5 }}>
                        <Text style={{ ...STYLES.title, fontSize: 18, color: 'black' }}>Number Descending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setFilterType('amount-asc'); setFilterShow(false) }} style={{ ...STYLES.button, backgroundColor: filterType == 'amount-asc' ? '#9cd9be' : '#f0f0f0', margin: 5 }}>
                        <Text style={{ ...STYLES.title, fontSize: 18, color: 'black' }}>Amount Ascending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setFilterType('amount-desc'); setFilterShow(false) }} style={{ ...STYLES.button, backgroundColor: filterType == 'amount-desc' ? '#9cd9be' : '#f0f0f0', margin: 5 }}>
                        <Text style={{ ...STYLES.title, fontSize: 18, color: 'black' }}>Amount Descending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setFilterType('minus-amount-asc'); setFilterShow(false) }} style={{ ...STYLES.button, backgroundColor: filterType == 'minus-amount-asc' ? '#9cd9be' : '#f0f0f0', margin: 5 }}>
                        <Text style={{ ...STYLES.title, fontSize: 18, color: 'black' }}>Minus Amount Ascending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setFilterType('minus-amount-desc'); setFilterShow(false) }} style={{ ...STYLES.button, backgroundColor: filterType == 'minus-amount-desc' ? '#9cd9be' : '#f0f0f0', margin: 5 }}>
                        <Text style={{ ...STYLES.title, fontSize: 18, color: 'black' }}>Minus Amount Descending</Text>
                    </TouchableOpacity>
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
                <Text style={{ ...STYLES.title, fontSize: 20 }}>Numbers</Text>

                <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 10 }}>
                    <Text style={{ ...STYLES.title, fontSize: 19, marginRight: 5 }}>Break Amount : {numberWithCommas(ba)}</Text>
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
                        placeholder="Search Number"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                </View>
                <TouchableOpacity style={{ ...STYLES.button, backgroundColor: 'green', marginLeft: 2 }}>
                    <Icons name="search" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterShow(true)} style={{ ...STYLES.button, backgroundColor: '#f0f0f0', marginLeft: 5 }}>
                    <Icons name="filter" size={20} color="black" />
                </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white', margin: 5, borderRadius: 10 }}>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, textAlign: 'center' }}>Number</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, textAlign: 'center' }}>Amount</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, textAlign: 'center' }}>Extra</Text>
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

export default NumberView;


const computeExtraAmount = (amount: number, ba: number) => {
    if (amount > ba) {
        return amount - ba;
    }
    return 0;
}


const numberWithCommas = (x: any) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


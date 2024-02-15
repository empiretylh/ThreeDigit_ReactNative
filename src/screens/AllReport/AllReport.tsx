import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import salesTable from '../../Database/salesTable';
import numbersTable from '../../Database/numbersTable';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../../config/config';
import breakAmountTable from '../../Database/breakamount';
import { MessageModalNormal } from '../MessageModal';
import DatePicker from 'react-native-date-picker'

const AllReport = ({ navigation, route }) => {

    const [numbers, setNumbers] = useState<any>([]);

    const [date, setDate] = useState(new Date())
    const [ByDate, setByDate] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('')
    const [filterShow, setFilterShow] = useState(false);

    const numbersFilter = useMemo(() => {

        let n = numbers;
        // filter
        if (filterType == 'number-asc') {
            n.sort((a: any, b: any) => a.number - b.number);
        }
        if (filterType == 'number-desc') {
            n.sort((a: any, b: any) => b.number - a.number);
        }
        if (filterType == 'amount-asc') {
            n.sort((a: any, b: any) => a.amount - b.amount);
        }
        if (filterType == 'amount-desc') {
            n.sort((a: any, b: any) => b.amount - a.amount);
        }
        if (filterType == 'date-asc') {
            n.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        if (filterType == 'date-desc') {
            n.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        if (ByDate) {
            n = n.filter((number: any) => {
                return new Date(number.date).toDateString() == date.toDateString();
            });
        }

        if (searchText == '') return n;

        n = numbers.filter((number: any) => {
            return number.vcno == searchText;
        });
       

        return n;

    }, [numbers, setNumbers, searchText, filterType, ByDate, date ]);

  


    const AmountTotal = useMemo(() => {
        let total = 0;
        numbersFilter.map((number: any) => {
            total += number.amount;
        });
        return total;
    }, [numbersFilter]);

    useEffect(() => {
        salesTable.getAllSales(setNumbers);
    }, []);




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
            <MessageModalNormal
                show={filterShow}
                onClose={() => setFilterShow(false)}
            >
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
                    <TouchableOpacity onPress={() => { setFilterType('date-asc'); setFilterShow(false) }} style={{ ...STYLES.button, backgroundColor: filterType == 'date-asc' ? '#9cd9be' : '#f0f0f0', margin: 5 }}>
                        <Text style={{ ...STYLES.title, fontSize: 18, color: 'black' }}>Date Ascending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setFilterType('date-desc'); setFilterShow(false) }} style={{ ...STYLES.button, backgroundColor: filterType == 'date-desc' ? '#9cd9be' : '#f0f0f0', margin: 5 }}>
                        <Text style={{ ...STYLES.title, fontSize: 18, color: 'black' }}>Date Descending</Text>
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
                <Text style={{ ...STYLES.title, fontSize: 25 }}>All Report</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, marginLeft: 'auto', marginRight: 5 }}>Total Amount : {numberWithCommas(AmountTotal)}</Text>
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
                <TouchableOpacity onPress={() => setFilterShow(true)} style={{ ...STYLES.button, backgroundColor: 'green', marginLeft: 2 }}>
                    <Icons name="filter" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDateOpen(true)} style={{ ...STYLES.button, backgroundColor: 'green', marginLeft: 2 }}>
                    <Icons name="calendar" size={20} color="white" />
                </TouchableOpacity>
                <DatePicker
                    modal
                    mode="date"
                    open={dateOpen}
                    date={date}
                    onConfirm={(date) => {
                        console.log(date)
                        setDate(date)
                        setDateOpen(false);
                        setByDate(true);
                      
                    }
                    }
                    onCancel={() => { setDateOpen(false); setByDate(false) }}
                    
                    onDateChange={(date) => {
                        console.log(date)
                        setDate(date)
                        setDateOpen(false);
                        setByDate(true);
                    }}
               
               />

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
        </View>
    )
}

export default AllReport;


const computeExtraAmount = (amount: number, ba: number) => {
    if (amount > ba) {
        return amount - ba;
    }
    return 0;
}


const numberWithCommas = (x: any) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


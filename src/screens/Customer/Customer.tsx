import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, TouchableOpacity, Vibration, TextInput, Dimensions, FlatList, Alert } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../../config/config';
import customerTable from '../../Database/customerTable';


const Customer = ({ navigation }) => {
    const [data, setData] = useState<any>([]);
    const [name, setName] = useState('');
    const [phoneno, setPhoneNo] = useState('');

    const [searchText, setSearchText] = useState('');



    const getAllCustomer = async () => {
        await customerTable.getAllCustomer(setData);

    }

    const filterData = useMemo(() => {
        return data.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()));
    }, [searchText, data]);

    const saveCustomer = async (name: string, phone: string) => {
        if (name == '') {
            Alert.alert('Error', 'Name is required');
            return;
        }
        let isExist = data.filter((item: any) => item.name == name);
        if (isExist.length > 0) {
            Alert.alert('Error', 'Customer already exist');
            return;
        }


        await customerTable.insertCustomer(name, phone);
        getAllCustomer();
    }

    useEffect(() => {
        getAllCustomer();
    }, []);

    let screenWidth = Dimensions.get('window').width;
    let tableWidth = [screenWidth * 0.10, screenWidth * 0.9, screenWidth * 0.25, screenWidth * 0.25]; // 4 columns


    const RenderItem = (item: any, index: number) => {
        return (
            <View key={index} style={{ flexDirection: 'row',alignItems:'center', backgroundColor: 'white',  }}>
                <Text style={{ ...STYLES.title, fontSize: 20, width: tableWidth[0], flex: 1, borderWidth: 1, padding: 10, textAlign: 'center' }}>{index + 1}</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, width: tableWidth[1], flex: 1, borderWidth: 1, padding: 10, flexGrow: 2, textAlign: 'left' }}>{item.name}</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, width: tableWidth[2], flex: 1, borderWidth: 1, padding: 10, flexGrow: 2, textAlign: 'left', color: 'black' }}>{item.phone}</Text>
                <View style={{ ...STYLES.title, width: tableWidth[3], flex: 1, padding: 2, borderWidth: 1 }}>
                    <TouchableOpacity style={{ padding: 5, margin: 5, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                        onPress={() => {
                            Alert.alert('Delete', 'Are you sure to delete?', [
                                { text: 'No', onPress: () => { } },
                                { text: 'Yes', onPress: () => { customerTable.deleteCustomer(item.id); getAllCustomer(); Vibration.vibrate(100); } }
                            ]);

                        }}>
                        <Icons name='trash' size={17} color='white' />
                    </TouchableOpacity>

                </View>

            </View>
        )
    }


    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
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
                <TouchableOpacity onPress={() => { navigation.goBack(); Vibration.vibrate(100) }} style={{ justifyContent: 'center', alignItems: 'center', padding: 5, margin: 5, borderRadius: 10 }}>
                    <Icons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ ...STYLES.title, fontSize: 20 }}>Customer</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white', margin: 5, borderRadius: 10 }}>

                <View style={{ flexDirection: 'row',flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        style={{ ...STYLES.bold_text, fontSize: 18, flex: 1, borderRadius: 15, color: 'black', backgroundColor: '#f0f0f0', paddingLeft: 10 }}
                        placeholderTextColor={'#000'}
                        placeholder="Search Customer"
                      
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                    <TouchableOpacity style={{ ...STYLES.button, backgroundColor: 'green', marginLeft: 2 }}>
                        <Icons name="search" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white', margin: 5, borderRadius: 10 }}>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, width: tableWidth[0], textAlign: 'center' }}>No</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, width: tableWidth[1], flexGrow: 2, textAlign: 'center' }}>Name</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, width: tableWidth[2], flexGrow: 2, textAlign: 'center' }}>Phone</Text>
                <Text style={{ ...STYLES.title, fontSize: 20, flex: 1, width: tableWidth[3], textAlign: 'center' }}>Action</Text>

            </View>



            <FlatList
                data={filterData}
                contentContainerStyle={{  padding:5 }}
                renderItem={({ item, index }) => RenderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
            />


            <View style={{ backgroundColor: 'white', marginTop: 'auto',  padding: 10 }}>
                {/* customer name, phone TextInput */}
                <TextInput

                    onChangeText={(text) => setName(text)}
                    value={name}

                    style={{ padding: 10, margin: 10, borderWidth: 1, borderColor: 'black', fontSize: 20, fontWeight: 'bold' }} placeholder="Customer Name" />
                <TextInput onChangeText={(text) => setPhoneNo(text)}
                    value={phoneno} style={{ padding: 10, margin: 10, borderWidth: 1, borderColor: 'black', fontSize: 20, fontWeight: 'bold' }} placeholder="Phone" />

                <TouchableOpacity
                    onPress={() => {
                        saveCustomer(name, phoneno);
                        setName('');
                        setPhoneNo('');
                        Vibration.vibrate(100);
                    }}
                    style={{ padding: 10, margin: 10, backgroundColor: 'green', borderRadius: 10 }}>
                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Add</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default Customer;

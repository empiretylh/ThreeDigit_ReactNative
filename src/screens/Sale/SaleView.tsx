import react, { useEffect } from 'react'
import { View, Text } from '@ant-design/react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../../config/config';
import { TextInput, TouchableOpacity, Vibration, Alert } from 'react-native';
import NumberKeyboard from './NumberKeyboard';
import SaleTable from './SaleTable';
import salesTable from '../../Database/salesTable';
import { useSale } from '../../context/SaleProvider';
import customerTable from '../../Database/customerTable';
import { MessageModalNormal } from '../MessageModal';
import breakAmountTable from '../../Database/breakamount';

const SaleView = ({navigation}) => {

    const [vcno, setvcno]: react.SetStateAction<String> = react.useState('');
    const [customername, setCustomerName] = react.useState('');
    const [customers, setCustomers] = react.useState([]);
    const [cshow, setCShow] = react.useState(false);

    const [breakamount, setBreakAmount] = react.useState(0);
    const [actualba, setActualba] = react.useState(0);


    const getBreakAmount = () => {
       breakAmountTable.getLastBreakAmount().then((data: any) => {
            setActualba(parseInt(data));
        });
    }


    const { cart, clearCart }: any = useSale();

    const getAllCustomer = async () => {
        await customerTable.getAllCustomer(setCustomers);
    }

    const getLastVoucherNumber = () => {
        salesTable.getLastVoucherNumber().then((data: any) => {
            setvcno(parseInt(data) + 1);
        })
    }

    useEffect(() => {
        getLastVoucherNumber();
        getAllCustomer();
        getBreakAmount();
    }, [])

    const SaveToDatabase = () => {
        if (cart.length == 0) return Alert.alert('', 'Cart is Empty');
        Vibration.vibrate(100)
        let date = new Date();
        let formatdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        cart?.map((item: any) => {
            if (item.isR) {

                let permutation = getPermutations(item.number);

                permutation.map((num: any) => {
                    salesTable.insertSales(customername, num, item.amount, formatdate, vcno)
                });

            } else {
                salesTable.insertSales(customername, item.number, item.amount, formatdate, vcno)
            }
        })

        getLastVoucherNumber();
        navigation.navigate("VoucherView",{customer:customername,vcno:vcno,number:cart});
        clearCart();
        setCustomerName('')
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <MessageModalNormal
                show={cshow}
                onClose={() => setCShow(false)}
            >
                <View style={{ padding: 10 }}>
                    <Text style={{ ...STYLES.bold_text, fontSize: 20 }}>Customer List</Text>
                    {customers.map((item: any, index: any) => {
                        return (
                            <TouchableOpacity key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }} onPress={() => {
                                setCustomerName(item.name);
                                setCShow(false);
                                Vibration.vibrate(100)
                            }}>
                                <Text style={{ ...STYLES.normal_label }}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    })
                    }
                </View>
            </MessageModalNormal>
            <View style={{
                flexDirection: 'column', backgroundColor: 'white', shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: 0.25,
                shadowRadius: 0.84,
                elevation: 2,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Text style={{ ...STYLES.title }}>Sale  </Text>
                    <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', marginRight: 5, paddingRight: 5, borderRadius: 5 }}>
                            <TextInput
                                value={customername}
                                onChangeText={(text) => setCustomerName(text)}
                                placeholderTextColor={'#000'}
                                style={{ ...STYLES.bold_text, padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, width: 150, marginRight: 5 }} placeholder="Customer Name" />
                            <TouchableOpacity onPress={()=> setCShow(true)}>
                                <Icons name="person" size={18} color="black" />
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity style={{ ...STYLES.button, flexDirection: 'row' }} onPress={() => SaveToDatabase()}>
                            <Icons name="save-outline" size={20} color="white" />
                            <Text style={{ ...STYLES.normal_label, color: 'white', marginLeft: 5 }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    alignItems: 'center', padding: 10,
                    flexDirection: 'row'

                }}>
                    <Text style={{ ...STYLES.normal_label, alignItems: 'center', textAlign: 'center' }}>Break Amount : {breakamount} / {actualba}  </Text>
                    <Text style={{ ...STYLES.normal_label, alignItems: 'center', textAlign: 'center', marginLeft: 'auto' }}>Voucher No : {vcno}</Text>
                    <TouchableOpacity style={{
                        backgroundColor: 'red',
                        padding: 5,
                        borderRadius: 5,
                        marginLeft: 5

                    }}
                        onPress={() => {
                            clearCart();
                        }}
                    >
                        <Icons name="trash-outline" size={15} color="white" />
                    </TouchableOpacity>
                </View>


            </View>

            <SaleTable />

            <NumberKeyboard ba={breakamount} setBa={setBreakAmount}/>
        </View>
    )
}

export default SaleView;

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

    return Array.from(permutations); // Convert the Set back to an Array
}

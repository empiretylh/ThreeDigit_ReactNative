import react, { useEffect } from 'react'
import { View, Text } from '@ant-design/react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { STYLES } from '../../config/config';
import { TextInput, TouchableOpacity, Vibration, Alert } from 'react-native';
import NumberKeyboard from './NumberKeyboard';
import SaleTable from './SaleTable';
import salesTable from '../../Database/salesTable';
import { useSale } from '../../context/SaleProvider';

const SaleView = () => {

    const [vcno, setvcno] : react.SetStateAction<String> = react.useState('');
    const [customername, setCustomerName] = react.useState('');

    const { cart , clearCart } : any = useSale();

    const getLastVoucherNumber = () => {
        salesTable.getLastVoucherNumber().then((data: any) => {
            setvcno(parseInt(data) + 1);
        })
    }

    useEffect(() => {
        getLastVoucherNumber();
    }, [])

    const SaveToDatabase = ()=>{
        if(cart.length == 0) return Alert.alert('','Cart is Empty');
        Vibration.vibrate(100)
        let date = new Date();
        let formatdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      
        cart?.map((item : any)=>{
            if(item.isR){

                let permutation = getPermutations(item.number);

                permutation.map((num : any)=>{
                    salesTable.insertSales(customername, num, item.amount, formatdate, vcno)
                });
              
            }else{
                salesTable.insertSales(customername,item.number, item.amount, formatdate, vcno)
            }
        })

        getLastVoucherNumber();
        clearCart();
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
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
                    <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
                        <TextInput 
                        value={customername}
                        onChangeText={(text) => setCustomerName(text)}
                        placeholderTextColor={'#000'}
                        style={{ ...STYLES.bold_text, padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, width: 200, marginRight: 5 }} placeholder="Customer Name" />

                        <TouchableOpacity style={{ ...STYLES.button, flexDirection: 'row' }} onPress={()=> SaveToDatabase()}>
                            <Icons name="save-outline" size={20} color="white" />
                            <Text style={{ ...STYLES.normal_label, color: 'white', marginLeft: 5 }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    alignItems: 'center', padding: 10,
                    flexDirection: 'row'

                }}>
                    <Text style={{ ...STYLES.normal_label, alignItems: 'center', textAlign: 'center' }}>Break Amount : {33000}  </Text>
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

            <NumberKeyboard />
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

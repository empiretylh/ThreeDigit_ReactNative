import React, { useState, useEffect, useRef, useMemo } from 'react'
import { View, Text } from '@ant-design/react-native';
import { STYLES } from '../../config/config';
import { Alert, Keyboard, StyleSheet, TextInput, TouchableOpacity, Vibration } from 'react-native';
import { useSale } from '../../context/SaleProvider';
import salesTable from '../../Database/salesTable';
import breakAmountTable from '../../Database/breakamount';
import numbersTable from '../../Database/numbersTable';
import { MessageModalNormal } from '../MessageModal';

const styles = StyleSheet.create({
    num_button: {
        backgroundColor: 'blue',
        padding: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',

        justifyContent: 'center',
        flex: 1,
    },
    num_button_text: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    }

})

const NumberKeyboard = ({ ba, setBa }) => {

    const [breakAmount, setBreakAmount] = useState<any>(0);

    const [keyboardStatus, setKeyboardStatus] = useState(false);

    const [numbers_data, setnumbers_data] = useState([]);

    const [number, setNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [isR, setIsR] = useState(false);
    const [rmodalshow, setRModalShow] = useState(false);
    const [rnumberslist, setRnumberList] = useState<any>([]);

    const [isFoucsNumber, setIsFoucsNumber] = useState(false);
    const [isFoucsAmount, setIsFoucsAmount] = useState(false);

    const [vcno, setvcno] = useState(0);

    const numberinput: any = useRef();
    const amountinput: any = useRef();

    const { cart,
        addtoCart,
        removefromCart,
        clearCart } = useSale();

    const onPress = (value: string) => {
        if (isFoucsNumber) {
            setNumber(prev => prev + value);
        }
        if (isFoucsAmount) {
            setAmount(prev => prev + value);
        }
        Vibration.vibrate(100);
    }

    const onDel = () => {
        if (isFoucsNumber) {
            setNumber(prev => prev.slice(0, -1));
        }
        if (isFoucsAmount) {
            setAmount(prev => prev.slice(0, -1));
        }
        Vibration.vibrate(150);
    }

    const onEnter = async () => {
     
        const vcno: string | any = await salesTable.getLastVoucherNumber();

        if (ba < amount && isR == false) {
            Alert.alert('', 'You can sell amount is ' + ba);
            return;
        }

        if (vcno !== null) {
            addtoCart(number, amount, parseInt(vcno) + 1, isR);
        } else {
            console.error('vcno is null');
        }
        setNumber('');
        setAmount('');
        setIsR(false);
        numberinput?.current.focus();
        Vibration.vibrate(100);
       
    }

    const getBreakAmount = async () => {
        const breakAmount = await breakAmountTable.getLastBreakAmount();
        if (breakAmount !== null) {
            setBreakAmount(breakAmount);
        }
    }

    const getAllNumbers = () => {
        numbersTable.getNumbers(setnumbers_data);

    }

    useEffect(() => {
       
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardStatus(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardStatus(false);
            }
        );


        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (number.length >= 3) {
            setNumber(number.slice(0, 3));
            setIsFoucsAmount(true);
            amountinput?.current.focus();
        }

    }, [number, amount]);

    useEffect(() => {
        getBreakAmount();
        getAllNumbers();
    },[]);

    

    useEffect(() => {
        let filter = numbers_data.filter((item: any) => item.number == number);
        let incart = cart.filter((item: any) => item.number == number);
        console.log(incart, filter);
        let amount2 = incart.length > 0 ? incart.reduce((sum, item) => sum + parseInt((item?.amount || 0)), 0) : 0;

        let amount = filter.length > 0 ? filter.reduce((sum, item) => sum + parseInt((item?.amount || 0)), 0) : 0;


        let result = parseInt(breakAmount) - (parseInt(amount) + parseInt(amount2));
        console.log(result)
        if (result > 0) {
            setBa(result);
        } else { setBa(0); }

    }, [number, numbers_data, breakAmount, cart]);

    useEffect(() => {
        getAllNumbers();
    },[cart,removefromCart,clearCart])

    const onEnterR = () => {
        getAllNumbers();
        //filter of all permuted numbers by number
        setIsR(true);


        let permutenumber = getPermutations(number);

        let filter = numbers_data.filter((item: any) => permutenumber.includes(item.number));
        setRnumberList(filter);
        setRModalShow(true);


    }


    if (keyboardStatus) {
        return null;
    }





    return (
        <View>
            <MessageModalNormal show={rmodalshow} onClose={() => setRModalShow(false)}>
                <View>
                    <Text style={{ ...STYLES.normal_text, fontSize: 25, textAlign: 'center', fontWeight: 'bold' }}>Select Number</Text>
                    <View style={{ flexDirection: 'col', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {rnumberslist.map((item: any, index: number) => (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 10, marginTop: 5, borderRadius: 15 }}>
                                <Text style={{ ...STYLES.title, color:parseInt(item.amount) >= parseInt(breakAmount) ? 'red' :'black' }}>{item.number}</Text>
                                <Text style={{ ...STYLES.title , color:parseInt(item.amount) >= parseInt(breakAmount) ? 'red' :'black' }}>{item.amount}</Text>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity
                        onPress={()=>{
                            Vibration.vibrate(100);
                            setRModalShow(false);
                        }}
                        style={{
                            ...STYLES.button,
                            backgroundColor: 'green',
                            marginTop: 5,
                        }}>
                        <Text style={{ ...STYLES.normal_text, color: 'white' }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </MessageModalNormal>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                <View style={{ flex: 1, borderWidth: 1, flexDirection: 'row', borderRadius: 5 }}>
                    <TextInput
                        ref={numberinput}
                        style={{
                            ...STYLES.normal_text,
                            fontSize: 25,
                            padding: 10,
                            flex: 1,
                            fontWeight: 'bold',
                            textAlign: 'center'

                        }}
                        maxLength={3}
                        autoFocus={true}
                        onFocus={() => {
                            setIsFoucsNumber(true);
                            setIsFoucsAmount(false);
                        }
                        }
                        placeholder="Number"
                        showSoftInputOnFocus={false}

                        value={number}
                    />
                    <TouchableOpacity onPress={() => {setNumber(''); numberinput.current.focus(); setIsFoucsNumber(true)}} style={{ padding: 10, marginLeft: 'auto', backgroundColor: 'red', justifyContent: 'center' }}>
                        <Text style={{ ...STYLES.normal_label, color: 'white' }}>X</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, borderWidth: 1, flexDirection: 'row', borderRadius: 5, marginLeft: 3 }}>
                    <TextInput
                        ref={amountinput}
                        style={{
                            ...STYLES.normal_text,
                            padding: 10,
                            flex: 1,
                            fontSize: 25,
                            fontWeight: 'bold',
                            textAlign: 'right'


                        }}
                        onFocus={() => {
                            setIsFoucsNumber(false);
                            setIsFoucsAmount(true);
                        }
                        }
                        placeholder="Amount"
                        showSoftInputOnFocus={false}
                        value={amount}
                    />
                    <TouchableOpacity
                        onPress={() =>{ setAmount(''); amountinput.current.focus(); setIsFoucsAmount(true)}}
                        style={{ padding: 10, marginLeft: 'auto', backgroundColor: 'red', justifyContent: 'center' }}>
                        <Text style={{ ...STYLES.normal_label, color: 'white' }}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'column', backgroundColor: 'green', flex: 1, flexGrow: 4 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('7')}>
                            <Text style={styles.num_button_text}>7</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('8')}>
                            <Text style={styles.num_button_text}>8</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('9')}>
                            <Text style={styles.num_button_text}>9</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('4')}>
                            <Text style={styles.num_button_text}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('5')}>
                            <Text style={styles.num_button_text}>5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('6')}>
                            <Text style={styles.num_button_text}>6</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('1')}>
                            <Text style={styles.num_button_text}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('2')}>
                            <Text style={styles.num_button_text}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('3')}>
                            <Text style={styles.num_button_text}>3</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={styles.num_button} onPress={() => onEnterR()}>
                            <Text style={styles.num_button_text}>R</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('0')}>
                            <Text style={styles.num_button_text}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={() => onPress('00')}>
                            <Text style={styles.num_button_text}>00</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <TouchableOpacity style={styles.num_button} onPress={() => onDel()}>
                            <Text style={styles.num_button_text}>Del</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.num_button} onPress={onEnter}>
                            <Text style={styles.num_button_text}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default NumberKeyboard;



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

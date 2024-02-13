import React, { useState, useEffect, useRef } from 'react'
import { View, Text } from '@ant-design/react-native';
import { STYLES } from '../../config/config';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, Vibration } from 'react-native';
import { useSale } from '../../context/SaleProvider';
import salesTable from '../../Database/salesTable';

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

const NumberKeyboard = () => {



    const [keyboardStatus, setKeyboardStatus] = useState(false);

    const [number, setNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [isR, setIsR] = useState(false);

    const [isFoucsNumber, setIsFoucsNumber] = useState(false);
    const [isFoucsAmount, setIsFoucsAmount] = useState(false);
    const [vcno, setvcno] = useState(0);

    const numberinput : any = useRef();
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

        if (vcno !== null) {
            addtoCart(number, amount, parseInt(vcno) + 1, isR);
        } else {
            console.error('vcno is null');
        }
        setNumber('');
        setAmount('');
        setIsR(false);
        numberinput?.current.focus();
        Vibration.vibrate(150);
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

    if (keyboardStatus) {
        return null;
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                <View style={{ flex: 1, borderWidth: 1, flexDirection: 'row', borderRadius: 5 }}>
                    <TextInput
                    ref ={numberinput}
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
                    <TouchableOpacity onPress={() => setNumber('')} style={{ padding: 10, marginLeft: 'auto', backgroundColor: 'red', justifyContent: 'center' }}>
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
                        onPress={() => setAmount('')}
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
                        <TouchableOpacity style={styles.num_button} onPress={() => setIsR(true)}>
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


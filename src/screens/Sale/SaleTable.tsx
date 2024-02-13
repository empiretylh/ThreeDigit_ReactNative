import React from 'react';
import { View, Text } from '@ant-design/react-native';
import { STYLES } from '../../config/config';
import { useSale } from '../../context/SaleProvider';
import { FlatList, TouchableOpacity } from 'react-native';

const SaleTable = () => {

    const { cart,
        addtoCart,
        removefromCart,
        clearCart } = useSale();

    const RenderItem = (item: any, index: number) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomWidth: 1, borderBottomColor: '#707070' }}>
                <Text style={{ ...STYLES.normal_label, flex: 1, textAlign: 'left', fontSize: 23 }}>{item.number}  {item.isR ? '(R)' : ''}</Text>
                <Text style={{ ...STYLES.normal_label, flex: 1, textAlign: 'right', fontSize: 23 }}>{item.amount}</Text>
                <Text style={{ ...STYLES.normal_label, flex: 1, textAlign: 'center', fontSize: 23 }}>{item.vcno}</Text>
                <TouchableOpacity
                    onPress={() => {
                        removefromCart(item.number, item);
                    }}

                    style={{ backgroundColor: 'red', padding: 10, borderRadius: 15 }}>
                    <Text style={{ ...STYLES.normal_label, textAlign: 'center', color: 'white' }}>X</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <FlatList
                contentContainerStyle={{
                    flexDirection: 'column-reverse',
                    padding: 10,
                }}
                data={cart}
                renderItem={({ item, index }) => RenderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )

}

export default SaleTable;
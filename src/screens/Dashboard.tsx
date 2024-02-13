import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { View, Button } from '@ant-design/react-native';
import { IMAGE, STYLES, appname } from '../config/config';

const Dashboard: React.FC = ({ navigation }) => {
    const [count, setCount] = useState(0);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={IMAGE.icon} style={{ width: 50, height: 50, marginRight: 10 }} />
                <Text style={styles.title}>{appname}</Text>
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center' }}>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'blue',
                    borderRadius: 10,
                }}
                    onPress={() => navigation.navigate('Sale')}
                >

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Sale</Text>

                </TouchableOpacity>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'blue',
                    borderRadius: 10,
                }}
                onPress={()=> navigation.navigate('AllNumber')}
                >

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Number</Text>

                </TouchableOpacity>


            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'blue',
                    borderRadius: 10,
                }}>

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Customer အမည်</Text>

                </TouchableOpacity>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'blue',
                    borderRadius: 10,
                }}>

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Customer Details</Text>

                </TouchableOpacity>


            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'blue',
                    borderRadius: 10,
                }}>

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Customer အမည်</Text>

                </TouchableOpacity>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'blue',
                    borderRadius: 10,
                }}>

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Customer Details</Text>

                </TouchableOpacity>


            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'blue',
                    borderRadius: 10,
                }}>

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Customer အမည်</Text>

                </TouchableOpacity>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 5,
                    backgroundColor: 'blue',
                    borderRadius: 10,
                }}>

                    <Text style={{ ...STYLES.title, color: 'white', textAlign: 'center' }}>Customer Details</Text>

                </TouchableOpacity>


            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',

    },
    count: {
        fontSize: 36,
        margin: 20,
    },
    button: {
        fontSize: 24,
        color: 'blue',
    },
});


export default Dashboard;
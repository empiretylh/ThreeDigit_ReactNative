import React, { useEffect , useState} from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Vibration, ToastAndroid } from 'react-native';
import { IMAGE, STYLES, appname } from '../config/config';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import Icons from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-gesture-handler';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useLogin } from '../context/LoginProvider';
const Login = ({ navigation }) => {
    const copyToClipboard = () => {
        let deviceid = DeviceInfo.getUniqueIdSync();
        Clipboard.setString(deviceid);
        Vibration.vibrate(100);
        ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
    };

    const {isLogged, setIsLogged} = useLogin();

    const [logincode, setLoginCode] = useState('');

    const makecode = (st1: string, key: string) => {
        
        // combine this two string st1 and key to make a codee
        let code = st1 + key;
        let ciphertext = '';
        for (let i = 0; i < code.length; i++) {
            let char = code.charCodeAt(i);
            char = char + 1;
            ciphertext += String.fromCharCode(char);
        }
        return ciphertext;

    }

    const code = () => {
        let deviceid = DeviceInfo.getUniqueIdSync();
        let ciphertext = makecode(deviceid, '8f01036573a4081a60b6a67a9ddeeb561fe5d540')
        console.log(ciphertext, "Code ");
        return ciphertext;
    }

    useEffect(() => {
       code();
    },[]);

    const onLogin = () => {
        if(logincode == code()){
            EncryptedStorage.setItem('login', 'true');
            setIsLogged(true)
        }else{
            Alert.alert('Error', 'Invalid Login Code');
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ marginTop:50, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                <View style={{ padding: 15, borderWidth: 1, borderRadius: 100, marginBottom: 10 }}>
                    <Image
                        source={IMAGE.icon}
                        style={{ width: 100, height: 100 }}
                    />
                </View>


                <Text style={{ ...STYLES.title, marginBottom: 20 }}>{appname}</Text>

            </View>

            <View style={{ flex: 1, alignItems: 'center', marginTop:20 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', alignItems: 'center', padding: 10, borderRadius: 15 }}>
                    <Text style={{ fontSize: 18, color: 'blue' }}>{DeviceInfo.getUniqueIdSync()}</Text>
                    <TouchableOpacity onPress={copyToClipboard} style={{ flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: '#f0f0f0' }}>
                        <Icons name="copy" size={20} color="black" onPress={copyToClipboard} />
                        <Text style={{ ...STYLES.normal_label }}>Copy</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ ...STYLES.bold_text, marginTop: 10, fontSize: 20 }}> Enter Login Code </Text>
                <Text style={{ ...STYLES.normal_text }}>You wil need login code to use this app.</Text>
                <View style={{ flexDirection: 'column', padding: 10, marginHorizontal: 20,  width:'100%' }}>
                    <TextInput
                        style={{ borderColor: 'gray', borderWidth: 1,  fontSize: 18, marginTop: 10, padding: 10, borderRadius: 10}}
                        placeholder="Enter Login Code"
                        value={logincode}
                        onChangeText={(text) => setLoginCode(text)}
                    />

                    <TouchableOpacity onPress={onLogin} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10, marginTop: 10, justifyContent: 'center', marginLeft: 3 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Login</Text>
                    </TouchableOpacity>
                </View>
              
            </View>
        </View>
    );
}


export default Login;
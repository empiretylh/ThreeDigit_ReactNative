import { ActivityIndicator, View } from "@ant-design/react-native";
import { createContext, useEffect, useState, useContext } from "react";
import { Image, Text } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { IMAGE, appname } from "../config/config";

const loginContext = createContext();

const LoginProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(false);

    const getLogin = async () => {
        setLoading(true);
        const token = await EncryptedStorage.getItem("login");
        if (token == 'true') {
            setIsLogged(true);
        }
        setLoading(false)
    }
    useEffect(() => {
        getLogin();
    }, []);

    if (loading) {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ marginTop: 50, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                <View style={{ padding: 15, borderWidth: 1, borderRadius: 100, marginBottom: 10 }}>
                    <Image
                        source={IMAGE.icon}
                        style={{ width: 100, height: 100 }}
                    />
                </View>


                <Text style={{ color: 'black', fontSize: 20 }}>{appname}</Text>

            </View>
            <ActivityIndicator size="large" color="black" />

        </View>
    }


    return <loginContext.Provider value={{ isLogged, setIsLogged }}>{children}</loginContext.Provider>;
}

export const useLogin = () => {
    const context = useContext(loginContext);
    if (!context) {
        console.log("useLogin must be used within a LoginProvider")
    }
    return context;
}

export default LoginProvider;

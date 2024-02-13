import React,{ createContext, useState } from "react";

const SaleContext = createContext(null);

const SaleProvider = ({ children }) => {

    const [cart, setCart] = useState([]);

    const addtoCart = (number, amount, vcno, isR = false) => {
        let pd = {
            number: number,
            amount: amount,
            isR: isR,
            vcno: vcno,
        }

        setCart([...cart, pd]);
    }

    const removefromCart = (number,c = []) => {
        setCart(cart.filter((item) => item.number !== number));
    }

    const clearCart = () => {
        setCart([]);
    }


    const value = {
        cart,
        addtoCart,
        removefromCart,
        clearCart
    };

    return <SaleContext.Provider value={value}>{children}</SaleContext.Provider>;
}

export const useSale = () => {
    const context = React.useContext(SaleContext);
    if (!context) {
        throw new Error("useSale must be used within a SaleProvider");
    }
    return context;
}


export default SaleProvider;
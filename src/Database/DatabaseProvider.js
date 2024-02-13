import React, { useEffect } from 'react';
import db from './createdatabase';
import numbersTable from './numbersTable';
import breakAmount from './breakamount';
import customerTable from './customerTable';
import saleTable from './salesTable';


const DatabaseContext = React.createContext(null);

const DatabaseProvider = ({ children }) => {

    useEffect(() => {
        let dbs = db;
        numbersTable.createNumbersTable();
        numbersTable.insertNumbers();
        breakAmount.createBreakAmountTable();
        customerTable.createCustomerTable();
        saleTable.createSalesTable();
        console.log("created table ")
    }, [])

    return (
        <DatabaseContext.Provider value={{ numbersTable, breakAmount, customerTable, saleTable }}>
            {children}
        </DatabaseContext.Provider>
    );
};


export default DatabaseProvider;

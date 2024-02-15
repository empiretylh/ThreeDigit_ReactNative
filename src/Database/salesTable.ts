import db from "./createdatabase";
import customerTable from "./customerTable";
import numbersTable from "./numbersTable";
let updateAmount = numbersTable.updateAmount;

//Create Sales Table
// ID, Customer name, Number , Amount, Date, Vcno


const createSalesTable = () => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS sales (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        customer TEXT,
                        number TEXT,
                        amount INTEGER,
                        date TEXT,
                        vcno TEXT 
                )`,
                [],
                () => {
                    console.log('Sales Table created');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
    console.log(db)
};

const insertSales = (customer: string, number: string, amount: number, date: string, vcno: string) => {
    if (db) {

        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO sales (customer, number, amount, date, vcno) VALUES (?, ?, ?, ?, ?)`,
                [customer, number, amount, date, vcno],
                () => {
                    console.log('Sales inserted');
                },
                (error) => {
                    console.log(error);
                }
            );
        });

        updateAmount(number, amount);
        if (customer !== '') customerTable.insertCustomer(customer, '')

    }
}

const deleteSales = (id: number, number: string, amount: number) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM sales WHERE id = ?`,
                [id],
                () => {
                    console.log('Sales deleted');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }

    updateAmount(number, -amount);

}

const RemoveCustomerName = (name: string) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE sales set customer = '' WHERE customer = ?`,
                [name],
                () => {
                    console.log('Customer Updated');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}


const getLastVoucherNumber = () => {
    return new Promise((resolve, reject) => {
        if (db) {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT vcno FROM sales ORDER BY id DESC LIMIT 1`,
                    [],
                    (tx, results) => {
                        if (results.rows.length > 0) {
                            resolve(results.rows.item(0).vcno);
                        } else {
                            resolve('0');
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        }
    });
}



const getSaleByNumber = (number: string, setData: any) => {
    return new Promise((resolve, reject) => {
        if (db) {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM sales where number = ?`,
                    [number],
                    (tx, results) => {
                        setData(results.rows.raw);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        }
    });
}


const getCustomerSales = (setData: any) => {
    // group by customer name  and sum of amount
    // select customer, sum(amount) from sales group by customer

    return new Promise((resolve, reject) => {
        if (db) {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT customer, sum(amount) as total from sales group by customer `,
                    [],
                    (tx, results) => {
                        setData(results.rows.raw);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        }
    }
    );
}


const getAllSales = (setData: any) => {
    return new Promise((resolve, reject) => {
        if (db) {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM sales`,
                    [],
                    (tx, results) => {
                        setData(results.rows.raw);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        }
    });
}


const getAllSalesByCustomer = (setData: any, customer: string) => {
    return new Promise((resolve, reject) => {
        if (db) {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM sales where customer = ?`,
                    [customer],
                    (tx, results) => {
                        setData(results.rows.raw);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        }
    });
}

const deletAllSales = () => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM sales`,
                [],
                () => {
                    console.log('Sales deleted');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}
const salesTable = {
    createSalesTable,
    insertSales,
    deleteSales,
    deletAllSales,
    getLastVoucherNumber,
    getSaleByNumber,
    getAllSales,
    getCustomerSales,
    RemoveCustomerName,
    getAllSalesByCustomer


};


export default salesTable;
import db from "./createdatabase";
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
    }
}  

const deleteSales = (id: number, number : string, amount : number) => {
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
const salesTable = {
    createSalesTable,
    insertSales,
    deleteSales,
    getLastVoucherNumber,

};


export default salesTable;
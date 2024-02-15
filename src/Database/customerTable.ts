import db from "./createdatabase";

//Create Customer Table
const createCustomerTable = () => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS customer (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT unique,
                        phone TEXT
                )`,
                [],
                () => {
                    console.log('Customer Table created');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }

};

// Delete Customer 
const deleteCustomer = (id: number) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM customer WHERE id = ?`,
                [id],
                () => {
                    console.log('Customer deleted');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
};

// Insert Customer
const insertCustomer = (name: string, phone: string) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT OR IGNORE INTO customer (name, phone) VALUES (?, ?)`,
                [name, phone],
                () => {
                    console.log('Customer inserted');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}

// Select All Customer
const getAllCustomer = (setData) => {
    return new Promise((resolve, reject) => {
        if (db) {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM customer`,
                    [],
                    (tx, result) => {
                        setData(result.rows.raw);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        }
    });
};

// Update Customer
const updateCustomer = (id: number, name: string, phone: string) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE customer SET name = ?, phone = ? WHERE id = ?`,
                [name, phone, id],
                () => {
                    console.log('Customer updated');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}

const customerTable =  { createCustomerTable, deleteCustomer, insertCustomer, getAllCustomer, updateCustomer };

export default customerTable;
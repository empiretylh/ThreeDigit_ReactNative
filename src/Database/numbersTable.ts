import db from "./createdatabase";

//Create Numbers Table
// ID, Number (000 - 999), amount 
const createNumbersTable = () => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS numbers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        number TEXT UNIQUE,
                        amount INTEGER default 0
                )`,
                [],
                () => {
                    console.log('Numbers Table created');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
};


// iNSERT 000 TO  999
const insertNumbers = () => {
    if (db) {
        db.transaction((tx) => {
            for (let i = 0; i < 1000; i++) {
                let number = i.toString().padStart(3, '0');
                tx.executeSql(
                    `INSERT OR IGNORE INTO numbers (number) VALUES (?)`,
                    [number],
                    () => {
                        console.log('Number inserted');
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }
        });
    }
};

const updateAmount = (number: string, amount: number) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE numbers SET amount = amount + ? WHERE number = ?`,
                [amount, number],
                () => {
                    console.log('Amount updated');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}

const updateAmountMinus = (number: string, amount: number) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE numbers SET amount = amount - ? WHERE number = ?`,
                [amount, number],
                () => {
                    console.log('Amount updated');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}

const RemoveAllAmount = () => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE numbers SET amount = 0`,
                [],
                () => {
                    console.log('Amount removed');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}

const getNumbers = (setNumbers: any) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM numbers`,
                [],
                (_, { rows }) => {

                    setNumbers(rows.raw);
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
};

const numbersTable = { createNumbersTable, insertNumbers, getNumbers, updateAmount, updateAmountMinus, RemoveAllAmount };
export default numbersTable;
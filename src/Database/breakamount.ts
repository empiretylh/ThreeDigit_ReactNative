import db from "./createdatabase";

// db
// Create BreakAmount Table
// ID, Amount
const createBreakAmountTable = () => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS breakamount (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        amount INTEGER
                )`,
                [],
                () => {
                    console.log('BreakAmount Table created');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
};

// Insert BreakAmount
const insertBreakAmount = (amount: number) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO breakamount (amount) VALUES (?)`,
                [amount],
                () => {
                    console.log('BreakAmount inserted');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}

// Delete BreakAmount
const deleteBreakAmount = (id: number) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM breakamount WHERE id = ?`,
                [id],
                () => {
                    console.log('BreakAmount deleted');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
};

// Update BreakAmount
const updateBreakAmount = (id: number, amount: number) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE breakamount SET amount = ? WHERE id = ?`,
                [amount, id],
                () => {
                    console.log('BreakAmount updated');
                },
                (error) => {
                    console.log(error);
                }
            );
        });
    }
}

// get The Last BreakAmount if not return 0
const getLastBreakAmount = () => {
    return new Promise((resolve, reject) => {
        if (db) {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM breakamount ORDER BY id DESC LIMIT 1`,
                    [],
                    (tx, result) => {
                        if (result.rows.length > 0) {
                            resolve(result.rows.item(0).amount);
                        } else {
                            resolve(0);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        }
    });
};


const breakAmountTable =  { createBreakAmountTable, insertBreakAmount, deleteBreakAmount, updateBreakAmount, getLastBreakAmount };

export default breakAmountTable;
import SQLite from 'react-native-sqlite-storage';


const db = SQLite.openDatabase(
    {
        name: 'test5.db',
        location: 'default',
    },
    () => {
        console.log('Database opened');
    },
    (error) => {
        console.log(error);
    }
);

export default db;



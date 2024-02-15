import SQLite from 'react-native-sqlite-storage';


const db = SQLite.openDatabase(
    {
        name: 'test4.db',
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



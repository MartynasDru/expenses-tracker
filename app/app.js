const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

const mysqlConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'test123',
    database: 'expenses_tracker',
    port: 3307
};

const connection = mysql.createConnection(mysqlConfig);

app.get('/expenses', (req, res) => {
    connection.execute('SELECT * FROM expenses', (err, expenses) => {
        res.send(expenses);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
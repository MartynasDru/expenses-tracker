const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
};

const connection = mysql.createConnection(mysqlConfig);

// app.get('/expenses/:userId', (req, res) => {
//     const { userId } = req.params;
//     connection.execute('SELECT * FROM expenses WHERE userId=?', [userId], (err, expenses) => {
//         res.send(expenses);
//     });
// });

app.get('/expenses', (req, res) => {
    const { userId } = req.query;
    connection.execute('SELECT * FROM expenses WHERE userId=?', [userId], (err, expenses) => {
        res.send(expenses);
    });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
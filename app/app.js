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
    port: 3306
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
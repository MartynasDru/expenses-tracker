const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

const getUserFromToken = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return user;
}

const verifyToken = (req, res, next) => {
    try {
        getUserFromToken(req);
        next();
    } catch(e) {
        res.send({ error: 'Invalid Token' });
    }
}

app.get('/expenses', verifyToken, (req, res) => {
    const user = getUserFromToken(req);
    
    connection.execute('SELECT * FROM expenses WHERE userId=?', [user.id], (err, expenses) => {
        res.send(expenses);
    });
});

app.post('/expenses', verifyToken, (req, res) => {
    const { type, amount, timestamp } = req.body;
    const { id } = getUserFromToken(req);

    const sqlQuery = timestamp ?
    'INSERT INTO expenses (type, amount, userId, timestamp) VALUES (?, ?, ?, ?)' :
    'INSERT INTO expenses (type, amount, userId) VALUES (?, ?, ?)';

    const data = [type, amount, id];
    if (timestamp) {
        data.push(timestamp);
    }

    connection.execute(
        sqlQuery,
        data,
        () => {
            connection.execute(
                'SELECT * FROM expenses WHERE userId=?', 
                [id], 
                (err, expenses) => {
                    res.send(expenses);
                }
            )
        }
    )
});

app.delete('/expenses/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { id: userId } = getUserFromToken(req);

    connection.execute(
        'DELETE FROM expenses WHERE id=? AND userId=?',
        [id, userId],
        () => {
            connection.execute(
                'SELECT * FROM expenses WHERE userId=?', 
                [userId], 
                (err, expenses) => {
                    res.send(expenses);
                }
            )
        }
    )
});

app.post('/register', (req, res) => {
    const { name, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 12);

    connection.execute(
        'INSERT INTO users (name, password) VALUES (?, ?)', 
        [name, hashedPassword],
        (err, result) => {
            if (err?.code === 'ER_DUP_ENTRY') {
                res.sendStatus(400);
            }
            
            res.send(result);
        }
    )
});

app.post('/login', (req, res) => {
    const { name, password } = req.body;

    connection.execute(
        'SELECT * FROM users WHERE name=?',
        [name],
        (err, result) => {
            if (result.length === 0) {
                res.sendStatus(401);
            } else {
                const passwordHash = result[0].password
                const isPasswordCorrect = bcrypt.compareSync(password, passwordHash);
                if (isPasswordCorrect) {
                    const { id, name } = result[0];
                    const token = jwt.sign({ id, name }, process.env.JWT_SECRET_KEY);
                    res.send({ token, id, name });
                } else {
                    res.sendStatus(401);
                }
            }
        }
    );
});

app.get('/token/verify', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.send(user);
    } catch(e) {
        res.send({ error: 'Invalid Token' });
    }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
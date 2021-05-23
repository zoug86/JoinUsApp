const express = require('express');
const mysql = require('mysql');
const faker = require('faker');
const bodyParser = require('body-parser');


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

// connect to database:
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'join_us'
});

// Connect to database:
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MYSQL connected...')
});

// create database:
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE join_us';
    db.query(sql, (error, results, fields) => {
        if (error) throw error;
        res.send('Database created...');
    });
})

// create tables
app.get('/createuserstable', (req, res) => {
    let sql = 'create table users (email varchar(255) primary key, created_at timestamp default now());';
    db.query(sql, (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        res.send('Table created...');
    });
})

// insert data into the table:
app.get('/insertdata', (req, res) => {
    let data = [];
    for (let i = 0; i < 500; i++) {
        data.push([faker.internet.email(), faker.date.past()])
    }
    let sql = 'insert into users (email, created_at) values ?';
    db.query(sql, [data], (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        res.send('Data inserted...');
    });
})


app.get("/", function (req, res) {
    db.query('select count(*) as count from users', function (error, results, fields) {
        if (error) throw error;
        const count = results[0].count;
        res.render('home', { count });
    });
});

app.post('/register', (req, res) => {
    const person = {
        email: req.body.email
    }
    db.query('insert into users set ?', person, function (error, results, fields) {
        if (error) throw error;
        res.redirect('/');
    });

});

app.get("/joke", function (req, res) {
    let joke = 'What do you calla dog that does magic tricks? A labracadabrador.';
    res.render('home');
});

app.get("/random_num", function (req, res) {
    let rand_num = Math.floor(Math.random() * 10);
    res.send('Your lucky number is: ' + rand_num);
});

//connection.end();

app.listen(3000, function () {
    console.log('App listening on port 3000!')
})
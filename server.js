const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// const db = knex({
//     client: 'pg',
//     connection: {
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//             rejectUnauthorized: false
//         }
//     }
// });
// const db = knex({
//     client: 'pg',
//     version: '7.2',
//     connection: {
//         host : '127.0.0.1',
//         port: 5432,
//         user : 'postgres',
//         password : 'test',
//         database : 'iprofiler',
//     }
// });

const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors());


app.get('/', (req, res) => {res.send('Server Activated')})
// app.post('/login', login.handleLogin(db, bcrypt))
app.post('/login', login.loginAuthentication(db, bcrypt))
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})
app.get('/profile/:id', (req, res) => {profile.handleProfileUpdate(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})



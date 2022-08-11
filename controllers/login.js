const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup Redis:
const redisClient = redis.createClient({host: '127.0.0.1'});

const handleLogin = (db, bcrypt, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject('Incorrect Submission');
    }
    return db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => user[0])
                    .catch(err => Promise.reject('Unable to get user'))
            } else {
                Promise.reject('Wrong Credential')
            }
        })
        .catch(err => Promise.reject('Wrong credentials'))
}

const getAuthTokenId = () => {
    console.log('auth ok')
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwt.Payload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const createSessions = (user) => {
    //JWT token, return user data
    const { email, id } = user;
    const token = loginToken(email);
    return  { success: 'true', userId: id, token }
}
const loginAuthentication = (db, bcrypt) => (req, res) {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId() : 
        handleLogin(db, bcrypt, req, res)
        .then(data => {
            return data.id &&  data.email ? createSessions(data) : Promise.reject(data)
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
}

module.exports = {
    handleLogin: handleLogin,
    loginAuthentication: loginAuthentication
};
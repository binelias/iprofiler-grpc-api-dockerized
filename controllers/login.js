const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup Redis:
const redisClient = redis.createClient(process.env.REDIS_URI);

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

const getAuthTokenId = () => { // get the Id from redis
    const { authorization } = req.headers;
    redisClient.get(authorization,  (err, reply) => { 
        if(err || !reply) {
            return res.status(404).json('Unauthorized');
        }
        return res.json({id: reply})
    })
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const setToken = (token, id) => {
    Promise.resolve(redisClient.set(token, id))
}

const createSessions = (user) => {
    //JWT token, return user data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() =>{ 
            return {success: 'true', userID: id, token} })
        .catch(console.log)
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
    loginAuthentication: loginAuthentication,
    redisClient: redisClient,
};
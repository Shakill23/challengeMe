import 'dotenv/config';
import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

function createToken(user) {
    return sign(
        {
            emailAdd: user.emailAdd,
            pwd: user.pwd
        },
        process.env.SECRET_KEY,
        {
            expiresIn: '1h'
        }
    );
}

function authenticateToken(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}

export { createToken, authenticateToken };

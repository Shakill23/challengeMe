import 'dotenv/config'
import jwt from 'jsonwebtoken'
const { sign, verify } = jwt

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
    )
}
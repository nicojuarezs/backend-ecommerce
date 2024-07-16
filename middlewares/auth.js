//Chequeamos si el usuario esta logueado, y para eso vamos a corroborr que tenga un token valido

const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET;
function jwtVerify(req, res, next) {

    // const bearerToken = req.headers.authorization.split("")[1]
    const token = req.headers.authorization;

    
    //Chequeamos si nos enviaron un token, de no ser si retornamos un 401: unauthorized
    if(!token) {
        return res.status(401).send({
            ok: false,
            message: "El token es requerido"
        })
    }

    jwt.verify(token, SECRET, (error, payload) => {
        if(error) {
            return res.status(401).send({
                ok: false,
                message: "Token vencido o invalido"
            })
        }

        console.log(payload)

        req.user = payload.user;
        
        next();
    })
}

module.exports = jwtVerify;
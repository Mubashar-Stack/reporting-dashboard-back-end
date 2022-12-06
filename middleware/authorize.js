const jwt = require('jsonwebtoken')
const User = require("../models/user")
const authorize = (req, res, next) => {
    console.log('middleware[authenticate]');
    const authorization = req.headers['authorization'];
    if(authorization){        
        const token = authorization.replace('Bearer ','').replace('bearer ','');
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            if(decoded){
                return next();
            }
        } catch (e) {
            res.status(500).send(e)
        }
        
    }
    
    return res.status(401).send({error: 'Unauthorized', message : 'Token required!'});
}

const authorizeAdmin = async (req, res, next) => {
    console.log('middleware[authenticate]');
    const authorization = req.headers['authorization'];
    if(authorization){        
        const token = authorization.replace('Bearer ','').replace('bearer ','');
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            const user = await User.findByPk({ _id: JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub });

            if(decoded && user.type== "admin"){
                console.log('decoded', decoded);
                return next();
            }else{
                res.status(401).send("Access Denied!")
            }
        } catch (e) {
            console.log('error: ', e);
        }
        
    }
    
    return res.status(401).send({error: 'Unauthorized', message : 'Token required!'});
    
}


module.exports = {authorize, authorizeAdmin};

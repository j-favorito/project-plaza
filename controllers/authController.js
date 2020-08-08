const db = require("../models");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwt-config");

module.exports = {
    createToken: function (req, res, next) {
        if(req.cookies.jwt === undefined){
            const payload = {
                email: req.body.email,
                expire: Date.now()
            };
            const token = jwt.sign(JSON.stringify(payload), jwtSecret.secret);
            res.cookie("jwt", token, { httpOnly: true, secure: false, expire: { maxAge: 600000 } });
        }
        console.log(req.body)
        db.User
            .find({email:req.body.email})
            .then((dbUser) => {
                if(dbUser.length === 0){
                    db.User.create({email:req.body.email})
                    .then((dbUser)=>{
                        console.log(dbUser)
                    })
                }else{
                    console.log("userFound")
                    console.log(dbUser);
                    res.json(dbUser)
                }
            })
            .catch(err => res.status(422).json(err));
    }
};
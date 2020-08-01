const JwtStategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const KEYS = require('../../config/keys');
const Users = require('../models/Users');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: KEYS.jwt,
};

module.exports = function (passport) {
    passport.use(new JwtStategy(options, async (payload, done) => {
        try {
            const user = await Users.findById(payload.userId).select('email id');

            if (user){
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (err){
            console.log("Error Middleware")
        }
    }))
};

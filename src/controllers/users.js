const Users = require('../models/Users');
const errorHandler = require('../utils/errorHandler');

const {
    generateJWToken, compareHashPassword,
    generateHashPassword,
    getUserInfoByToken
}  = require('../services/userService')


module.exports.index = async (req, res) => {
    try {
        const users = await Users.find({});
        res.send(users);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.login = async (req, res) => {
    const user = await Users.findOne({ email: req.body.email });

    if (user) {
        const passwordResult = compareHashPassword(req.body.password, user.password);
        if (passwordResult){
            const token = generateJWToken(user);

            res.status(200).json({
                token: token,
                user: user
            });
        } else {
            errorHandler(res, {
                message: "Wrong password",
                status: 401
            });
        }
    } else {
        errorHandler(res, {
            message: "Email doesn't exist",
            status: 500
        });
    }
};

module.exports.register = async (req, res) => {
    const foundUser = await Users.findOne({ email: req.body.email });

    if (foundUser) {
        errorHandler(res, {
            message: "User already exists",
            status: 409
        });
    } else {
        try {
            const user = new Users({
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: generateHashPassword(req.body.password)
            });

            const token = generateJWToken(user);
            await user.save();

            res.status(201).json({
                user: user,
                token: token
            });
        } catch (e){
            errorHandler(res, e);
        }
    }
};

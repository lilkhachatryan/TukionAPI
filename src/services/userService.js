const bcrypt = require('bcryptjs');
const KEYS = require('../../config/keys');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
// const uuid = require('uuidv4');

module.exports.generateHashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
};

module.exports.compareHashPassword = (originalPassword, password) => {
    return bcrypt.compareSync(originalPassword, password);
};

module.exports.generateJWToken = (candidate) => {
    return jwt.sign({
        email: candidate.email,
        userId: candidate._id
    }, KEYS.jwt, {expiresIn: 36000});
};

// export const getUserInfoByToken = (token) => {
//     if (token) {
//         const array = token.split(' ');
//         const decoded = jwt.decode(array[1]);
//
//         return decoded;
//     }
//
//     return false;
// };

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 12;

/**
 * Function to hash input number or string.
 * @param {string} text Input string to hash.
 * */
const generateHash = (text) => {
    const hashPassword = bcrypt.hashSync(text, bcrypt.genSaltSync(saltRounds));
    return hashPassword;
};

/**
 * Funstion to check hash text with the original plain text, wil return boolean.
 * @param {string} password Plain text to check
 * @param {string} hashPassword Hash text to validate the plain text
 * @returns {boolean} return boolean value
 */
const validateHash = (password, hashPassword) => {
    const isCorrectPassword = bcrypt.compareSync(password, hashPassword);
    return isCorrectPassword;
};

/** Set Cookie To User Browser */
const setCookie = ({
    res,
    title,
    data,
    maxAge = (Number(process.env.MAX_AGE) || 259200) * 1000,
}) => {
    res.cookie(title, data, { httpOnly: true, maxAge });
};

/** Creating jwt token*/
const generateAuthorizationToken = ({
    data,
    exp = Number(process.env.MAX_AGE) || 259200,
}) => {
    return jwt.sign(data, process.env.SECRET, {
        expiresIn: exp,
    });
};

/**  Getting jwt token from request */
const getAuthorizationToken = async (req) => {
    try {
        const jwtToken = req.cookies.Authorization;
        const id = await jwt.verify(
            jwtToken,
            process.env.SECRET,
            async (err, decode) => {
                if (!err) {
                    return decode;
                } else {
                    throw "Failed to verify token";
                }
            }
        );
        return id;
    } catch (error) {
        return false;
    }
};

function verifyAccessToken(token) {
    const payload = jwt.verify(token, process.env.SECRET, (err, decode) => {
        if (err) throw new Error(err);
        return decode;
    });
    return payload;
}

/** Get uuid from req */
const getUser = async (req) => {
    const { userID } = await getAuthorizationToken(req);
    return userID;
};

module.exports = {
    generateHash,
    validateHash,
    generateAuthorizationToken,
    setCookie,
    getAuthorizationToken,
    getUser,
    verifyAccessToken,
};

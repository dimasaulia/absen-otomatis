const {
    validateHash,
    setCookie,
    generateAuthorizationToken,
    generateHash,
} = require("../../../../utility/auth/auth");

const prisma = require("../../../../providers/database/client");
const {
    resSuccess,
} = require("../../../../utility/response-handlers/success/response-success");

exports.signup = async (req, res, next) => {
    const { username, full_name, email, password } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: generateHash(password),
                role: { connect: { name: "BASE" } },
                passwordUpdatedAt: new Date(Date.now() - 1000),
                fullName: full_name,
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleId: true,
            },
        });

        setCookie({
            res,
            title: "Authorization",
            data: `Bearer ${generateAuthorizationToken({
                data: { userID: newUser.id, username: newUser.username },
            })}`,
        });

        return resSuccess({
            res,
            title: "Success register user",
            data: newUser,
        });
    } catch (err) {
        console.log("Error => ", err);
        next(err);
    }
};

exports.signin = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // try find the user
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
                username: true,
                password: true,
                email: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // give response if cant find the user
        if (user === null) throw new Error("Cant find the user");

        // compare user and password
        const auth = validateHash(password, user.password);

        // give response if password not match
        if (!auth) throw new Error("Username or Password didn't match");

        setCookie({
            res,
            title: "Authorization",
            data: `Bearer ${generateAuthorizationToken({
                data: { userID: user.id, username: user.username },
            })}`,
        });

        return resSuccess({
            res,
            title: "Login Success",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

exports.signout = (req, res) => {
    setCookie({ res, title: "Authorization", data: "", maxAge: 1 });
    return resSuccess({ res, title: "Success logout user" });
};

const prisma = require("../../../../providers/database/client");
const { userDoLogin } = require("../../../../utility/attandend/attandend");
const { encryptText } = require("../../../../utility/encription/encription");
const {
    resSuccess,
} = require("../../../../utility/response-handlers/success/response-success");

exports.integrateToEoffice = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const [isLogginSuccessfully, _] = await userDoLogin({
            username: username,
            password: password,
        });
        if (!isLogginSuccessfully) {
            throw new Error(
                "Integration to eoffice failed, make sure password and username was correct"
            );
        }

        await prisma.user.update({
            where: { id: req?.userId },
            data: {
                eofficeUsername: username,
                eofficePassword: encryptText(password),
            },
        });
        return resSuccess({ res, title: "Successfully integrate to eoffice" });
    } catch (error) {
        next(error);
    }
};

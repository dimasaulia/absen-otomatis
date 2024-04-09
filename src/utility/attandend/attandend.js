const { httpRequest } = require("../fetch/http-request");

async function userDoLogin(data) {
    const url = "https://eoffice.ilcs.co.id/p2b/login/do_login";
    const response = await httpRequest({ url, body: data });

    const loginResponse = String(response?.headers.raw()["refresh"]).split(";");
    let isSuccessfullyLogin = false;

    if (
        loginResponse[1] == "url=https://eoffice.ilcs.co.id/p2b/absensi/online"
    ) {
        isSuccessfullyLogin = true;
    }

    // Parameter pertama adalah status login, dan parameter kedua adalah cookie yang bisa digunakan
    return [isSuccessfullyLogin, response.headers.raw()["set-cookie"]];
}

async function userDoAttandend({ attandendType, attandendData, loginData }) {
    console.log("Executing Attandend Proccess");
    if (!["absen_masuk", "absen_pulang"].includes(attandendType)) {
        console.log("Pilihan metode absen tidak tersedia");
        return new Error("Pilihan metode absen tidak tersedia");
    }

    const [isLoginSuccess, cookies] = await userDoLogin(loginData);

    if (isLoginSuccess) {
        const url = `https://eoffice.ilcs.co.id/p2b/absensi/${attandendType}`;
        const response = await httpRequest({
            url,
            body: attandendData,
            cookies,
        });
        console.log(response);
    } else {
        console.log("LOGIN GAGAL");
    }
}

module.exports = { userDoAttandend, userDoLogin };

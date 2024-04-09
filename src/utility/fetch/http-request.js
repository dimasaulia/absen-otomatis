const fetch = require("node-fetch");

async function httpRequest({
    url,
    body = null,
    method = "POST",
    cookies = [],
}) {
    let response;
    const reqBody = new URLSearchParams();
    if (body != null || body != undefined) {
        for (const key in body) {
            reqBody.append(key, body[key]);
        }
    }

    if (body) {
        response = await fetch(url, {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                Cookie: cookies.join("; "),
            },
            method,
            body: reqBody,
            credentials: "include",
        });
    }

    if (!body) {
        response = await fetch(url, {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
            },
            method,
        });
    }

    const data = response;
    return data;
}

module.exports = { httpRequest };

const { google } = require("googleapis");

const serviceAccountKeyFile = "./absen-otomatis-de6353120374.json";
const SHEET_ID = "1Sh0DWxYvmaODvqIC_jMgG7G9CtmPw-svXtD7dqZeD10";

async function getGoogleSheetClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountKeyFile,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const authClient = await auth.getClient();
    return google.sheets({
        version: "v4",
        auth: authClient,
    });
}

module.exports = { getGoogleSheetClient, SHEET_ID };

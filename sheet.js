const { google } = require("googleapis");

const serviceAccountKeyFile = "./absen-otomatis-de6353120374.json";
const sheetId = "1Sh0DWxYvmaODvqIC_jMgG7G9CtmPw-svXtD7dqZeD10";
const tabName = "Jadwal April 2024";
const range = "A:B";

async function _getGoogleSheetClient() {
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

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
    const res = await googleSheetClient.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${tabName}!${range}`,
    });

    return res.data.values;
}

async function main() {
    const googleSheetClient = await _getGoogleSheetClient();

    const data = await _readGoogleSheet(
        googleSheetClient,
        sheetId,
        tabName,
        range
    );
    console.log(data);
}

main().then(() => {
    console.log("Complated");
});

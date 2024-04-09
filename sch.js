const {
    wakeUpSchedulers,
} = require("./src/app/api/sheets/controller/controller");

async function main() {
    await wakeUpSchedulers();
}
main().finally(() => {
    console.log("Complate");
});

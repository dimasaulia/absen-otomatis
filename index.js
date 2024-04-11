const {
    wakeUpSchedulers,
} = require("./src/app/api/sheets/controller/controller");
const { app } = require("./src/providers/http/express");

async function StartScheduler() {
    await wakeUpSchedulers();
}

StartScheduler().finally(() => {
    console.log("Wake up scheduling is complete");
});

app.listen(8000, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${8000}`);
});

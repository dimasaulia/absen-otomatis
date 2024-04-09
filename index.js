const { app } = require("./src/providers/http/express");

app.listen(8000, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${8000}`);
});

const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(express.json());
app.use("/web", express.static(path.join(__dirname, "./web3")));
console.log("web to /web3")

const ieApi = require("./oehp-ie-api");
const ieEngine = require("./oehp-ie-engine");
ieEngine.app(app);
ieApi.api(app, ieEngine.configuration, ieEngine.engine);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
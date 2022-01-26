const express = require("express");
const dotenv = require('dotenv')
dotenv.config({ override: true })
const app = express();
require("./app/models");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

require("./app/routes/stakingInfo.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


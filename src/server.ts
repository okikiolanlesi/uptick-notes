import config from "./config/config";
import mongoose from "mongoose";
import app from "./app";
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Unable to connect to the database");
    console.log(err);
  });

app.listen(config.port, () => {
  console.log(`Listening on port: ${config.port}`);
});

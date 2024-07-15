const mongoose = require("mongoose");

const dbConfig = () => {
  mongoose.connect("mongodb://localhost/chat-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection
    .once("open", () => {
      console.log("Connected to MongoDB");
    })
    .on("error", (error) => {
      console.log("Connection error:", error);
    });
};

module.exports = dbConfig;

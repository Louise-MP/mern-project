const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://louise-mpl:khaN91000@cluster0.my1ag.mongodb.net/mern-project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB 🎉"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

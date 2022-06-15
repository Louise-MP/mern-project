const mongoose = require("mongoose");

// rajouté après "bug" ==> (node:8756) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead. (Use `node --trace-deprecation ...` to show where the warning was created)
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);

mongoose.connect(
    "mongodb+srv://louise-mpl:khaN91000@cluster0.my1ag.mongodb.net/mern-project", 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true // rajouté après "bug" ==> (node:8756) 
    }
  )
  .then(() => console.log("Connected to MongoDB 🎉"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));


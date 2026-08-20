const mongoose = require('mongoose');

const uri = "mongodb+srv://niranjanmathapati65_db_user:k1N8zVLszsbmddLl@cluster0.fw4faax.mongodb.net/taskmanager?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Database!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });

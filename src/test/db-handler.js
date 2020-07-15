// Load dependencies
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Create an in-memory database with mongodb-memory-server
const mongod = new MongoMemoryServer();

// Function to connect to the in-memory database.
module.exports.connect = async () => {
  const uri = await mongod.getConnectionString();
  // Mongoose params (remove warnings)
  const mongooseParams = {
    useUnifiedTopology : true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }

  await mongoose.connect(uri,mongooseParams);
}

// Function to drop the database, close the connection and stop mongod.

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

// Function to remove all the data for all db collections.
module.exports.clearDatabase = async () => {
  // Get all the collections in the database
  const collections = mongoose.connection.collections;

  // Loop on all collections and delete all entries
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

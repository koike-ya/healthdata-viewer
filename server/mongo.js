const { MongoClient } = require("mongodb")
const uri = "mongodb://localhost:27017/"
const client = new MongoClient(uri);

exports.insertAccessToken = async function(token) {
  try {
    await client.connect()
    const database = client.db('healthdata')
    const collection = database.collection('token')

    const res = await collection.insertOne({ token: token })

    console.log(
      `${res.insertedCount} documents were inserted with the _id: ${res.insertedId}`,
    );
  } finally {
    await client.close();
  }
}

exports.readAccessToken = async function() {
  const query = {}
  try {
    await client.connect()
    const database = client.db('healthdata')
    const collection = database.collection('token')
    const record = await collection.findOne(query)
    if (record && ('token' in record)) {
      console.log('token is found')
      return record.token
    }
  } finally {
    await client.close()
  }
}
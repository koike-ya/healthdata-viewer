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

exports.insertData = async function(category, data) {
  try {
    await client.connect()
    const database = client.db('healthdata')
    const collection = database.collection(category)
    const res = await collection.insertMany(data)

    console.log(
      `${res.insertedCount} documents were inserted with the _id: ${res.insertedId}`,
    )
  } catch (error) {
    console.log(error)
  } finally {
    await client.close();
  }
}

exports.readOldestAndNewestTimestamp = async function(category) {
  const sort = { summary_date: -1 }
  try {
    await client.connect()
    const database = client.db('healthdata')
    const collection = database.collection(category)
    let query = await collection.find().sort({ summary_date: 1}).limit(1).toArray()
    if (query.length === 0) {
      return [null, null]
    }
    const oldest = query[0].summary_date
    query = await collection.find().sort(sort).limit(1).toArray()
    const newest = query[0].summary_date
    return [oldest, newest]
  } finally {
    await client.close()
  }
}

exports.readWithFilter = async function(category, filter = {}) {
  try {
    await client.connect()
    const database = client.db('healthdata')
    const collection = database.collection(category)
    const records = await collection.find(filter).toArray()
    return records
  } finally {
    await client.close()
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
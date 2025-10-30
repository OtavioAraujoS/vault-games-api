/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.gqgds.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority`;
const dbName = 'test';

async function removeAllGames() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const gamesCollection = db.collection('games');
    const deleteResult = await gamesCollection.deleteMany({});
    console.log(`Total de jogos removidos: ${deleteResult.deletedCount}`);
  } catch (error) {
    console.error('Erro ao remover jogos:', error);
  } finally {
    await client.close();
  }
}

removeAllGames();

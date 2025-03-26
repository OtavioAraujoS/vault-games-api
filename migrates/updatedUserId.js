/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '../.env' });

const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.gqgds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = 'test';

const oldUserId = '6786a1d5094c91574eacc2de';
const newUserId = 'qecaqo';

async function updateUserId() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const usersCollection = db.collection('users');
    const oldUser = await usersCollection.findOne({
      _id: new ObjectId(oldUserId),
    });

    if (!oldUser) {
      console.log('Usuário não encontrado.');
      return;
    }

    const newUser = { ...oldUser, _id: newUserId };
    await usersCollection.insertOne(newUser);
    console.log(`Novo usuário criado com ID: ${newUserId}`);

    await usersCollection.deleteOne({ _id: new ObjectId(oldUserId) });
    console.log(`Usuário antigo com ID ${oldUserId} excluído.`);

    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;
      const currentCollection = db.collection(collectionName);

      const count = await currentCollection.countDocuments({
        userId: oldUserId,
      });

      if (count > 0) {
        const updateResult = await currentCollection.updateMany(
          { userId: oldUserId },
          { $set: { userId: newUserId } }
        );

        console.log(
          `Atualizada coleção "${collectionName}": ${updateResult.modifiedCount} documentos alterados.`
        );
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar o ID do usuário:', error);
  } finally {
    await client.close();
  }
}

updateUserId();

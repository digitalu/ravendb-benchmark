const { CreateDatabaseOperation, DatabaseDocument, DocumentStore } = require("ravendb");

module.exports = {
  initializeStore() {
    const { DATABASE_NAME, DATABASE_URL } = process.env;

    console.log(`DATABASE_URL: ${DATABASE_URL}`);
    console.log(`DATABASE_NAME: ${DATABASE_NAME}`);

    const store = new DocumentStore(DATABASE_URL, DATABASE_NAME);
    store.initialize();
    return store;
  },
  // async createIfNotExists(store) {
  //   const db = store.database;
  //   const dbDoc = new DatabaseDocument(db);

  //   // try create database
  //   try {
  //     await store.operations.send(new CreateDatabaseOperation(db));
  //   } catch (ex) {
  //     console.error("Could not create database. Is Raven running?", ex);
  //     process.exit();
  //   }
  // },
  // async seed(store) {
  //   const session = store.openSession();
  //   const initialized = await session.load("initialized");

  //   if (initialized) {
  //     return;
  //   }

  //   const data = require("./data.json");

  //   // seed collections
  //   Object.keys(data)
  //     .map(collection => data[collection])
  //     .forEach(async document => {
  //       await session.store(document);
  //     });

  //   await session.saveChanges();
  // }
};

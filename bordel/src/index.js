const { DocumentStore } = require('ravendb');

const { DATABASE_NAME, DATABASE_URL } = process.env;

console.log(`DATABASE_URL: ${DATABASE_URL}`);
console.log(`DATABASE_NAME: ${DATABASE_NAME}`);

const store = new DocumentStore([DATABASE_URL], DATABASE_NAME);
// const store = new DocumentStore("http://localhost:8080", "sample-ravendb-node");
store.initialize();

const session = store.openSession();

session
  .load('users/1-A')
  .then((user) => {
    user.password = PBKDF2('new password');
  })
  .then(() => session.saveChanges())
  .then(() => {
    console.log('ok');
  });

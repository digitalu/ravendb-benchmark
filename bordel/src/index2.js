const express = require('express');
const request = require('request-promise');
const retry = require('async-retry');

const db = require('./db');

const app = express();

// Initialize Raven document store
// Should be done once per application start
const store = db.initializeStore();
const session = store.openSession();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/favicon.ico', express.static('public/favicon.ico'));

app.get('/', (req, res) => {
  res.status(200).send(`Welcome on Ravendb Benchmark api!`).end();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next('Root not found');
});

// error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500);
  return res.json({ error });
});

const port = process.env.PORT || 4000;

session
  .load('users/1-A')
  .then((user) => {
    user.password = PBKDF2('new password');
  })
  .then(() => session.saveChanges())
  .then(() => {
    // data is persisted
    // you can proceed e.g. finish web request

    app.listen(port, async () => {
      console.log(`The application was launched on the port ${port}.`);

      // Wait for interface to boot up
      await retry(async (bail, retries) => {
        const res = await request(`${process.env.DATABASE_URL}/studio/index.html`);

        if (res) {
          return;
        } else {
          console.log(`Could not connect to studio interface, attempt ${retries}`, res);
          throw new Error('Cannot connect to Raven server');
        }
      });

      // // Create database if it doesn't exist
      // console.info("Creating database if it doesn't exist...");
      // await db.createIfNotExists(store);

      // // Seed it if needed
      // console.info('Seeding database with initial dataset');
      // await db.seed(store);

      console.log('All set, query away!');
    });
  });

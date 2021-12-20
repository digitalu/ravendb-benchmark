const rethinkdbHandler = require('./rethinkdb');
const postgreHandler = require('./postgres');

const launchRethinkDB = async () => {
  await rethinkdbHandler.connect();

  // await rethinkdbHandler.createTables();

  await rethinkdbHandler.insertProfiles();
};

const launchPostgre = async () => {
  await postgreHandler.connect();
  console.log(1);
  await postgreHandler.createTables();
  console.log(2);
  

  // await postgreHandler.insertProfiles()

  // await postgreHandler.getProfiles()
};

launchRethinkDB();
// launchPostgre();

// var connection;

// // connect to rethinkdb
// r.connect(config.rethinkdb, function (err, conn) {
//   connection = conn;
//   if (err) {
//     console.log('Could not connect to rethinkdb.');
//     console.log(err.message);
//   } else {
//     console.log('Connection successful.');
//     start();
//   }
// });

// const start = async () => {
//   try {
//     const table = await r.db('test').tableCreate('authors').run(connection);
//     console.log(JSON.stringify(table, null, 2));

//     const res = await r
//       .table('authors')
//       .insert([
//         {
//           name: 'William Adama',
//           tv_show: 'Battlestar Galactica',
//           posts: [
//             { title: 'Decommissioning speech', content: 'The Cylon War is long over...' },
//             { title: 'We are at war', content: 'Moments ago, this ship received word...' },
//             { title: 'The new Earth', content: 'The discoveries of the past few days...' },
//           ],
//         },
//         {
//           name: 'Laura Roslin',
//           tv_show: 'Battlestar Galactica',
//           posts: [
//             { title: 'The oath of office', content: 'I, Laura Roslin, ...' },
//             { title: 'They look like us', content: 'The Cylons have the ability...' },
//           ],
//         },
//         {
//           name: 'Jean-Luc Picard',
//           tv_show: 'Star Trek TNG',
//           posts: [{ title: 'Civil rights', content: "There are some words I've known since..." }],
//         },
//       ])
//       .run(connection);

//     console.log(JSON.stringify(res, null, 2));

//     const cursor = await r.table('authors').filter(r.row('name').eq('William Adama')).run(connection);
//     const data = await cursor.toArray();
//     console.log(data);
//   } catch (err) {
//     console.error(err);
//   }
// };

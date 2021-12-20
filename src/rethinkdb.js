var r = require('rethinkdb');
var config = require('./config');
const fs = require('fs');

var connection;
const keysProfiles = [
  'user_id',
  'public',
  'completion_percentage',
  'gender',
  'region',
  'last_login',
  'registration',
  'AGE',
  'body',
  'I_am_working_in_field',
  'spoken_languages',
  'hobbies',
  'I_most_enjoy_good_food',
  'pets',
  'body_type',
  'my_eyesight',
  'eye_color',
  'hair_color',
  'hair_type',
  'completed_level_of_education',
  'favourite_color',
  'relation_to_smoking',
  'relation_to_alcohol',
  'sign_in_zodiac',
  'on_pokec_i_am_looking_for',
  'love_is_for_me',
  'relation_to_casual_sex',
  'my_partner_should_be',
  'marital_status',
  'children',
  'relation_to_children',
  'I_like_movies',
  'I_like_watching_movie',
  'I_like_music',
  'I_mostly_like_listening_to_music',
  'the_idea_of_good_evening',
  'I_like_specialties_from_kitchen',
  'fun',
  'I_am_going_to_concerts',
  'my_active_sports',
  'my_passive_sports',
  'profession',
  'I_like_books',
  'life_style',
  'music',
  'cars',
  'politics',
  'relationships',
  'art_culture',
  'hobbies_interests',
  'science_technologies',
  'computers_internet',
  'education',
  'sport',
  'movies',
  'travelling',
  'health',
  'companies_brands',
  'more',
];
const keysRelationships = ['user1_id', 'user2_id'];

module.exports = {
  async connect() {
    try {
      connection = await r.connect(config.rethinkdb);
    } catch (err) {
      console.error(err);
    }
  },

  async createTables() {
    try {
      const table = await r.db('test').tableCreate('profiles').run(connection);
      console.log(JSON.stringify(table, null, 2));
      const table2 = await r.db('test').tableCreate('relationships').run(connection);
      console.log(JSON.stringify(table2, null, 2));
    } catch (err) {
      console.error(err);
    }
  },

  async countProfiles() {
    try {
      const res = await r.table('profiles').count().run(connection);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  },

  async insertProfiles() {
    try {
      // const file1 = await fs.readFile('../data/soc-pokec-relationships-100.txt')
      fs.readFile('/app/data/soc-pokec-profiles-80k.txt', 'utf8', async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let lines = data.split('\n');

        lines = lines.slice(65000, 80000);

        const dataToInsert = [];

        lines.map((line) => {
          const elems = line.split('\t');
          elems.pop();
          const object = {};
          elems.forEach((elem, index) => {
            // console.log(elem);
            if (elem === 'null') return;

            // boolean
            if ([1, 3].includes(index)) {
              object[keysProfiles[index]] = elem === '0' ? false : true;
              return;
            }

            if ([0, 2, 7].includes(index)) {
              object[keysProfiles[index]] = parseInt(elem);
              return;
            }

            if ([5, 6].includes(index)) {
              object[keysProfiles[index]] = new Date(elem);
              return;
            }

            object[keysProfiles[index]] = elem;
          });

          dataToInsert.push(object);
        });

        const start = new Date();

        // for (const profile of dataToInsert) {
        //   await r.table('profiles').insert([profile]).run(connection);
        // }

        await r.table('profiles').insert(dataToInsert).run(connection);
        // console.log(JSON.stringify(res, null, 2));

        const end = new Date();

        console.log('Total time: ', end - start);
      });
    } catch (err) {
      console.error(err);
    }
  },

  async insertRelationShips() {
    try {
      // const file1 = await fs.readFile('../data/soc-pokec-relationships-100.txt')
      fs.readFile('/app/data/soc-pokec-relationships-80k.txt', 'utf8', async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let lines = data.split('\n');

        lines = lines.slice(460000, 500000); // 51 - 540 000

        const dataToInsert = [];

        lines.map((line) => {
          const elems = line.split('\t');

          const object = {};

          elems.forEach((elem, index) => {
            object[keysRelationships[index]] = parseInt(elem);
          });

          dataToInsert.push(object);
        });

        const start = new Date();

        await r.table('relationships').insert(dataToInsert).run(connection);

        const end = new Date();

        console.log('Total time: ', end - start);
      });
    } catch (err) {
      console.error(err);
    }
  },

  async dropRelationshipsTable() {
    // const res = await r.db('test').tableDrop('relationships').run(connection)
    // console.log(res)
  },

  async indexDB() {
    // await r.table('profiles').indexCreate('user_id').run(connection);
    // await r.table('profiles').indexWait('user_id').run(connection);

    await r.table('relationships').indexCreate('user1_id').run(connection);
    await r.table('relationships').indexWait('user1_id').run(connection);

    await r.table('relationships').indexCreate('user2_id').run(connection);
    await r.table('relationships').indexWait('user2_id').run(connection);
  },

  async fetchRandomProfilesWithoutIndex() {
    try {
      let it = 0;

      const promises = [];
      while (it < 50000) {
        it += 1;
        const randomId = Math.floor(Math.random() * 80_000);

        promises.push(
          new Promise(async (resolve) => {
            const cursor = await r.table('profiles').filter({ user_id: randomId }).limit(1).run(connection);

            const res = cursor.toArray();

            resolve(res);
          })
        );
      }
      const start = new Date();

      const res = await Promise.all(promises);

      const end = new Date();
      console.log('Total time: ', end - start);

      // console.log(res);
    } catch (err) {
      console.error(err);
    }
  },

  async fetchRandomProfilesWithIndex() {
    try {
      let it = 0;

      const promises = [];
      while (it < 50000) {
        it += 1;
        const randomId = Math.floor(Math.random() * 80_000);
        // console.log(randomId)

        promises.push(
          new Promise(async (resolve) => {
            const cursor = await r.table('profiles').getAll(randomId, { index: 'user_id' }).run(connection);

            const res = cursor.toArray();

            resolve(res);
          })
        );
      }
      const start = new Date();

      const res = await Promise.all(promises);

      const end = new Date();
      console.log('Total time: ', end - start);

      // console.log(res);
    } catch (err) {
      console.error(err);
    }
  },

  async countProfilesWithAge(age) {
    try {
      const start = new Date();
      const nbr = await r
        .table('profiles')('AGE')
        .count(function (AGE) {
          return AGE.eq(age);
        })
        .run(connection);

      const end = new Date();
      console.log('Total time: ', end - start);

      console.log(nbr);
    } catch (err) {
      console.error(err);
    }
  },

  async searchNeighboors() {
    try {
      const start = new Date();

      // const randomId = Math.floor(Math.random() * 30_000);
      const randomId = 1271;
      console.log({ randomId });
      const cursor = await r
        .table('profiles')
        .getAll(randomId, { index: 'user_id' })
        .merge(function (profile) {
          return {
            connexions: r
              .expr(
                r
                  .table('relationships')
                  .getAll(profile('user_id'), { index: 'user1_id' })
                  .merge(function (profile) {
                    return {
                      connexions: r
                        .expr(r.table('relationships').getAll(profile('user2_id'), { index: 'user1_id' }))
                        .union(r.table('relationships').getAll(profile('user2_id'), { index: 'user2_id' }))
                        .coerceTo('array'),
                    };
                  })
              )
              .union(
                r
                  .table('relationships')
                  .getAll(profile('user_id'), { index: 'user2_id' })
                  .merge(function (profile) {
                    return {
                      connexions: r
                        .expr(r.table('relationships').getAll(profile('user1_id'), { index: 'user1_id' }))
                        .union(r.table('relationships').getAll(profile('user1_id'), { index: 'user2_id' }))
                        .coerceTo('array'),
                    };
                  })
              )
              .coerceTo('array'),
          };
        })
        .run(connection);
      const res = await cursor.toArray();
      //console.log(res);
      console.log(res[0].connexions);

      const end = new Date();
      console.log('Total time: ', end - start);
    } catch (err) {
      console.error(err);
    }
  },
};

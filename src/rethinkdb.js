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

  async insertProfiles() {
    try {
      // const file1 = await fs.readFile('../data/soc-pokec-relationships-100.txt')
      fs.readFile('/app/data/soc-pokec-profiles-100k.txt', 'utf8', async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let lines = data.split('\n');
        // console.log(lines);

        lines = lines.slice(0, 1000);

        const dataToInsert = [];

        lines.map((line) => {
          const elems = line.split('\t');
          elems.pop()
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

            if (elem === '') console.log('AH', index);
            object[keysProfiles[index]] = elem;
          });

          dataToInsert.push(object);

          // const res = await r.table('profiles').insert([object]).run(connection);
          // console.log(JSON.stringify(res, null, 2));
        });

        const start = new Date()

        for (const profile of dataToInsert) {
          await r.table('profiles').insert([profile]).run(connection); 
          // console.log(JSON.stringify(res, null, 2));
        }

        // await r.table('profiles').insert(dataToInsert).run(connection); 
        // console.log(JSON.stringify(res, null, 2));

      
        const end = new Date()

        console.log("HEIN", end - start)
      });

    } catch (err) {
      console.error(err);
    }
  },
};

const { Pool } = require('pg');
const fs = require('fs');

var pool;

module.exports = {
  async connect() {
    try {
      pool = new Pool({
        user: 'postgres',
        host: 'postgres',
        database: 'postgres',
        password: 'postgres',
        port: 5432,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async createTables() {
    try {
      const query1 = `CREATE TABLE profiles (
        user_id INTEGER PRIMARY KEY,
        public BOOLEAN, 
        completion_percentage SMALLINT,
        gender BOOLEAN,
        region TEXT,
        last_login TIMESTAMP,
        registration TIMESTAMP,
        AGE SMALLINT,
        body TEXT,
        I_am_working_in_field TEXT,
        spoken_languages TEXT,
        hobbies TEXT,
        I_most_enjoy_good_food TEXT,
        pets TEXT,
        body_type TEXT,
        my_eyesight TEXT,
        eye_color TEXT,
        hair_color TEXT,
        hair_type TEXT,
        completed_level_of_education TEXT,
        favourite_color TEXT,
        relation_to_smoking TEXT,
        relation_to_alcohol TEXT,
        sign_in_zodiac TEXT,
        on_pokec_i_am_looking_for TEXT,
        love_is_for_me TEXT,
        relation_to_casual_sex TEXT,
        my_partner_should_be TEXT,
        marital_status TEXT,
        children TEXT,
        relation_to_children TEXT,
        I_like_movies TEXT,
        I_like_watching_movie TEXT,
        I_like_music TEXT,
        I_mostly_like_listening_to_music TEXT,
        the_idea_of_good_evening TEXT,
        I_like_specialties_from_kitchen TEXT,
        fun TEXT,
        I_am_going_to_concerts TEXT,
        my_active_sports TEXT,
        my_passive_sports TEXT,
        profession TEXT,
        I_like_books TEXT,
        life_style TEXT,
        music TEXT,
        cars TEXT,
        politics TEXT,
        relationships TEXT,
        art_culture TEXT,
        hobbies_interests TEXT,
        science_technologies TEXT,
        computers_internet TEXT,
        education TEXT,
        sport TEXT,
        movies TEXT,
        travelling TEXT,
        health TEXT,
        companies_brands TEXT,
        more TEXT)`;

      const query2 = `CREATE TABLE relationships (
          user1_id INTEGER,
          user2_id INTEGER,
          CONSTRAINT user1_id_fk FOREIGN KEY(user1_id) REFERENCES profiles(user_id),
          CONSTRAINT user2_id_fk FOREIGN KEY(user2_id) REFERENCES profiles(user_id)
        )`;

      const res = await pool.query(query1);
      const res2 = await pool.query(query2);

      console.log(res2);
    } catch (err) {
      console.error(err);
    }
  },

  async insertProfiles() {
    try {
      // const query = `INSERT INTO profiles (name, email) VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com')`;

      // const res = await pool.query(query);

      // console.log(res);

      fs.readFile('/app/data/soc-pokec-profiles-100k.txt', 'utf8', async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let lines = data.split('\n');

        lines = lines.slice(90000,100000);

        const queryParts = []

        const query =
        "INSERT INTO profiles (user_id, public, completion_percentage, gender, region, last_login, registration, AGE, body, I_am_working_in_field, spoken_languages, hobbies, I_most_enjoy_good_food, pets, body_type, my_eyesight, eye_color, hair_color, hair_type, completed_level_of_education, favourite_color, relation_to_smoking, relation_to_alcohol, sign_in_zodiac, on_pokec_i_am_looking_for, love_is_for_me, relation_to_casual_sex, my_partner_should_be, marital_status, children, relation_to_children, I_like_movies, I_like_watching_movie, I_like_music, I_mostly_like_listening_to_music, the_idea_of_good_evening, I_like_specialties_from_kitchen, fun, I_am_going_to_concerts, my_active_sports, my_passive_sports, profession, I_like_books, life_style, music, cars, politics, relationships, art_culture, hobbies_interests, science_technologies, computers_internet, education, sport, movies, travelling, health, companies_brands, more) VALUES";

        lines.map((line) => {
          const elems = line.split('\t');
          elems.pop();

          const queryPart = " (" + elems.map(elem => `'${elem}'`).join(",") + ")"

          queryParts.push(queryPart)
        });

        const start = new Date();

        // for (const queryPart of queryParts) {
        //   await pool.query(query + queryPart);
        // }

        await pool.query(query + queryParts.join(","))

        const end = new Date();

        console.log('Totaltime: ', end - start);
      });
    } catch (err) {
      console.error(err);
    }
  },

  async getProfiles() {
    try {
      const query = `SELECT * FROM profiles`;

      const res = await pool.query(query);

      console.log(res.rows);
    } catch (err) {
      console.error(err);
    }
  },
};

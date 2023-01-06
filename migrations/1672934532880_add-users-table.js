/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      bio VARCHAR(400),
      username VARCHAR(30) NOT NULL
    );
  `);
};

exports.down = pgm => {
    pgm.sql(`
    DROP TABLE users;
  `);
};

// on macOS, Run:
// DATABASE_URL=postgres://YOUR_USERNAME:@localhost5432/NAMEOFDATABASE npm run migrate up (down)
// to run the migration file
const { randomBytes } = require('crypto');
const format = require('pg-format');
const { default: migrate } = require('node-pg-migrate');
const pool = require('../pool');

const DEFAULT_OPTS = {
  host: 'localhost',
  port: 5432,
  database: 'NAMEOFDATABASE-test',
  user: 'YOUR_USERNAME',
  password: '',
};

class Context {
  static async build() {
    // Randomly generating a role name to connect to PG as
    const roleName = 'a' + randomBytes(4).toString('hex');

    // Connect to PG as usual
    // You need to connect to DB with your own credential first
    // to created new schemas with random names and passwords
    await pool.connect(DEFAULT_OPTS);

    // Create a new role
    await pool.query(
        // avoiding SQL injection, using pg-format package 
        // %I --> identifier %L --> literal value
      format('CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName, roleName)
    );

    // Create a schema with the same name
    await pool.query(
      format('CREATE SCHEMA %I AUTHORIZATION %I;', roleName, roleName)
    );

    // Disconnect entirely from PG
    await pool.close();

    // Run our migrations programmatically in the new schema
    await migrate({
      schema: roleName,
      direction: 'up',
      log: () => {},
      noLock: true,
      dir: 'migrations',
      databaseUrl: {
        host: 'localhost',
        port: 5432,
        database: 'NAMEOFDATABASE-test',
        user: roleName,
        password: roleName,
      },
    });

    // Connect to PG with the newrole name, PG will connect to the schema that
    // has the same name as the user first, not the public schema. 
    await pool.connect({
      host: 'localhost',
      port: 5432,
      database: 'NAMEOFDATABASE-test',
      user: roleName,
      password: roleName,
    });

    return new Context(roleName);
  }

  constructor(roleName) {
    this.roleName = roleName;
  }
// Delete the data records before each test run
  async reset() {
    return pool.query(`
        DELETE FROM users;
    `)
  }

// Disconnect after the test
  async close() {
    // Disconnect from PG that accessed with the new rolename
    await pool.close();

    // Reconnect use the root credentials
    await pool.connect(DEFAULT_OPTS);

    // Delete the role and schema we created
    await pool.query(format('DROP SCHEMA %I CASCADE;', this.roleName));
    await pool.query(format('DROP ROLE %I;', this.roleName));

    // Disconnect from PG that coonect with the root credentials
    await pool.close();
  }
}

module.exports = Context;

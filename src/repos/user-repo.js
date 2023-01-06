const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');
// const { query } = require('../pool');

class UserRepo {
    // the static method allows you to use the function without creating an instance of the class
  static async find() {
    const { rows } = await pool.query('SELECT * FROM users;');
    // This toCamelCase converts the snake_cased in SQL keys 
    // of the returning rows to theCamelCase in JS
    return toCamelCase(rows);
  }
// To find a user using thier ID
  static async findById(id) {
    const { rows } = await pool.query(
        // Avoid SQL injection exploit, use the parameters
      'SELECT * FROM users WHERE id = $1;', [id]);

    return toCamelCase(rows)[0];
  }
// To create a user with name or bio
  static async insert(username, bio) {
    const {
      rows,
    } = await pool.query(
        // the RETURNING statement will return the result of the sql query
      'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *;',
      [username, bio]
    );

    return toCamelCase(rows)[0];
  }
// To change a user's name or bio
  static async update(id, username, bio) {
    const {
      rows,
    } = await pool.query(
      'UPDATE users SET username = $1, bio = $2 WHERE id = $3 RETURNING *;',
      [username, bio, id]
    );

    return toCamelCase(rows)[0];
  }

  static async delete(id) {
    const {
      rows,
    } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);

    return toCamelCase(rows)[0];
  }
// To count number of users in the user table. -- For testing purpose.
  static async count() {
    const { rows } = await pool.query('SELECT COUNT(*) FROM users;');
    // make sure to return value in integer but not string
    return parseInt(rows[0].count);
  }
}

module.exports = UserRepo;

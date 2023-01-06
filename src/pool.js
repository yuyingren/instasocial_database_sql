const pg = require('pg');

// wrap _pool into a class. so we can connect to different port
class Pool {
  _pool = null;
    //options are hostnames, port, etc.
  connect(options) {
    this._pool = new pg.Pool(options);
    // this query is to test if we connected to our database.
    // when you create a pool, it will not connect to the database untill you create
    // an actually client.
    return this._pool.query('SELECT 1 + 1;');
  }
  // close the pool
  close() {
    return this._pool.end();
  }
  // sending SQL query statements and their parameters to the database
  query(sql, params) {
    return this._pool.query(sql, params);
  }
}

module.exports = new Pool();

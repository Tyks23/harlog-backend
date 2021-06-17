const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'harlogusers',
    password: 'saladus1',
    port: 5432,
  })

  module.exports =  pool;
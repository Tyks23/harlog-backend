const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'harlogusers',
    password: 'awesome99',
    port: 5432,
  })

  module.exports =  pool;
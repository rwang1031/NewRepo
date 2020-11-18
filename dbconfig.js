require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server:process.env.DB_HOST,
    database:process.env.DB_DBNAME
}

module.exports = config;
require("dotenv").config();

const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = process.env;

module.exports = {
    development: {
        username: DB_USER || "root",
        password: DB_PASS || null,
        database: DB_NAME,
        host: DB_HOST,
        dialect: "mysql",
    },
    test: {
        username: DB_USER || "root",
        password: DB_PASS || null,
        database: DB_NAME,
        host: DB_HOST,
        dialect: "mysql",
    },
    production: {
        username: DB_USER || "root",
        password: DB_PASS || null,
        database: DB_NAME,
        host: DB_HOST,
        dialect: "mysql",
    },
};

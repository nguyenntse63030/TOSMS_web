const sql = require("mssql");
const config = require('../../../config')

// connect to your database
async function connection() {
    const pool = new sql.ConnectionPool(config.SQLSERVER);

    try {
        await pool.connect();
        console.log('Connected to database')
        return pool;
    } catch (err) {
        console.log('Database connection failed!', err)
        return err;
    }
}

module.exports = {
    connection
}

const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if a JAWSDB_URL environment variable is set (for deployment)
if (process.env.JAWSDB_URL) {
  // If JAWSDB_URL is set, create a Sequelize instance using the provided URL
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // If JAWSDB_URL is not set, create a Sequelize instance using local environment variables
  sequelize = new Sequelize(
    process.env.DB_NAME,       // Database name
    process.env.DB_USER,       // Database user
    process.env.DB_PASSWORD,   // Database password
    {
      host: process.env.DB_HOST,   // Database host
      dialect: 'mysql',            // Database dialect (MySQL in this case)
      port: 3306                   // Database port
    }
  );
}

module.exports = sequelize;

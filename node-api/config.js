module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'toor',
    database: process.env.DB_NAME || 'support',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false // Disable logging SQL queries
  },
  test: {
    username: process.env.DB_USERNAME || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'support_together_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false // Disable logging SQL queries
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false // Disable logging SQL queries
  }
};

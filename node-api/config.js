module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'support',
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Disable logging SQL queries
  },
  test: {
    username: 'your_username',
    password: 'your_password',
    database: 'support_together_test',
    host: 'localhost',
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

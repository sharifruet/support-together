/**
 * Wait for database to be ready
 * Used in Docker to ensure database is available before starting the API
 */

const mysql = require('mysql2/promise');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

async function waitForDatabase() {
    const maxRetries = 30;
    const retryDelay = 2000; // 2 seconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            const connection = await mysql.createConnection({
                host: dbConfig.host,
                user: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.database,
                connectTimeout: 5000
            });

            await connection.ping();
            await connection.end();
            
            console.log('✅ Database is ready!');
            return true;
        } catch (error) {
            console.log(`⏳ Waiting for database... (${i + 1}/${maxRetries})`);
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.error('❌ Database connection failed after maximum retries');
                throw error;
            }
        }
    }
}

// Run if executed directly
if (require.main === module) {
    waitForDatabase()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Database wait failed:', error);
            process.exit(1);
        });
}

module.exports = waitForDatabase;

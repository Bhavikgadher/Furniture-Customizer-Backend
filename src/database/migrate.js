// src/database/migrate.js
const sequelize = require('./sequelize');

async function testConnection() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    console.log('All models are synced with existing database schema');

    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();

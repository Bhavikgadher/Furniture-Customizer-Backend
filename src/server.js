// src/server.js
const app = require('./app');
const env = require('./config/env');
const sequelize = require('./database/sequelize');
require('./database/models');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

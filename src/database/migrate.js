// src/database/migrate.js
const sequelize = require('./sequelize');
require('./models'); // load all models so sync knows about them

async function migrate() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established');

    console.log('Enabling extensions...');
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS citext;');

    console.log('Cleaning up legacy enum types if needed...');
    await sequelize.query(`
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        -- Drop any enum type that does NOT follow Sequelize's naming convention (enum_<table>_<column>)
        FOR r IN
          SELECT t.typname
          FROM pg_type t
          JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
          WHERE t.typtype = 'e'
            AND n.nspname = 'public'
            AND t.typname NOT LIKE 'enum\\_%'
        LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END$$;
    `);

    console.log('Running migrations (sync)...');
    await sequelize.sync({ alter: true });
    console.log('All tables created/updated successfully');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();

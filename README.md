# MainBackend Monolith

A monolithic Express.js backend application with Sequelize ORM and PostgreSQL.

## Tech Stack

- Node.js (LTS)
- Express.js
- Sequelize ORM
- PostgreSQL

## Project Structure

```
project-root/
├─ package.json
├─ src/
│   ├─ app.js
│   ├─ server.js
│   ├─ config/
│   │   ├─ env.js
│   │   └─ database.js
│   ├─ database/
│   │   ├─ sequelize.js
│   │   ├─ models/
│   │   └─ migrations/
│   ├─ modules/
│   │   ├─ auth/
│   │   ├─ adminuser/
│   │   ├─ vendor/
│   │   ├─ product/
│   │   ├─ order/
│   │   ├─ coupon/
│   │   └─ security/
│   ├─ middlewares/
│   ├─ utils/
│   └─ routes.js
└─ README.md
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials

4. Run migrations:
```bash
npm run migrate
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Modules

- **Auth**: Login, Logout
- **Admin Users**: List users, Create user
- **Vendors**: List vendors
- **Products**: Create furniture model
- **Orders**: List orders
- **Coupons**: Create coupon
- **Security**: List roles

## Environment Variables

See `.env.example` for required environment variables.

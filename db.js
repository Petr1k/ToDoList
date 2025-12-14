const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg');

const itemsPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

itemsPool.on('connect', () => {
    console.log('✓ Connected to Render PostgreSQL database');
});

itemsPool.on('error', (err) => {
    console.error('✗ Database connection error:', err.message);
});

module.exports = itemsPool;

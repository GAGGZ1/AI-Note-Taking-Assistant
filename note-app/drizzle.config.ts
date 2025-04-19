import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { URL } from 'url';

// Load environment variables from the .env file
dotenv.config({
  path: '.env',
});

// Ensure DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Parse the DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL!);

// Log the components for debugging
console.log('Parsed DATABASE_URL:', dbUrl);

export default {
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 5432, // Default PostgreSQL port
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.split('/')[1], // Extract database name from path
    ssl: dbUrl.searchParams.get('sslmode') === 'require', // Example handling for sslmode
  },
} satisfies Config;

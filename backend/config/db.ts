// admin/backend/config/db.ts

import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Initialize Local PostgreSQL using the connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database via DATABASE_URL.');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// 3. Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing in .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// 4. Helper Function: Execute local SQL scripts (like init.sql)
export const runInitScript = async (relativePathToSql: string) => {
  const client = await pool.connect();
  try {
    // Resolve path relative to where this function is called from
    const absolutePath = path.resolve(process.cwd(), relativePathToSql);
    const sqlScript = fs.readFileSync(absolutePath, 'utf8');

    console.log(`Executing SQL script from: ${absolutePath}...`);
    
    // Execute the raw SQL string
    await client.query(sqlScript);
    console.log('✅ SQL script executed successfully.');
    
  } catch (error) {
    console.error('❌ Failed to execute SQL script:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
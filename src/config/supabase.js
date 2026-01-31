const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;

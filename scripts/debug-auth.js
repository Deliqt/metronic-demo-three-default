import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Supabase Authentication Debug Tool');
console.log('=====================================');
console.log('');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);
console.log(`   VITE_SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);
console.log('');

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

// Create Supabase clients
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function debugAuth() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test connection with anon key
    const { data: anonTest, error: anonError } = await supabaseAnon.auth.getSession();
    if (anonError) {
      console.log('❌ Anon key connection failed:', anonError.message);
    } else {
      console.log('✅ Anon key connection successful');
    }

    // Test connection with service role key
    const { data: adminTest, error: adminError } = await supabaseAdmin.auth.admin.listUsers();
    if (adminError) {
      console.log('❌ Service role key connection failed:', adminError.message);
    } else {
      console.log('✅ Service role key connection successful');
      console.log(`   Found ${adminTest.users.length} users in database`);
    }

    console.log('');
    console.log('👥 Checking for demo user...');
    
    // Check if demo user exists
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.log('❌ Error listing users:', listError.message);
    } else {
      const demoUser = users.users.find(user => user.email === 'demo@kt.com');
      if (demoUser) {
        console.log('✅ Demo user found:');
        console.log(`   Email: ${demoUser.email}`);
        console.log(`   ID: ${demoUser.id}`);
        console.log(`   Created: ${demoUser.created_at}`);
        console.log(`   Confirmed: ${demoUser.email_confirmed_at ? 'Yes' : 'No'}`);
        console.log(`   Metadata: ${JSON.stringify(demoUser.user_metadata, null, 2)}`);
      } else {
        console.log('❌ Demo user not found');
        console.log('   Run "npm run create-demo-user" to create the demo user');
      }
    }

    console.log('');
    console.log('🔧 Authentication Configuration:');
    console.log('   - Email/Password auth should be enabled in Supabase');
    console.log('   - Google OAuth should be configured if you want social login');
    console.log('   - Email templates can be customized in Supabase dashboard');
    console.log('');
    console.log('📚 Next steps:');
    console.log('   1. Run "npm run create-demo-user" to create demo user');
    console.log('   2. Run "npm run dev" to start the development server');
    console.log('   3. Visit http://localhost:5173/auth/signin to test login');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the debug script
debugAuth(); 
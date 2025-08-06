import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - VITE_SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please check your .env file and ensure these variables are set.');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDemoUser() {
  try {
    console.log('🚀 Creating demo user...');
    
    const demoUserData = {
      email: 'demo@kt.com',
      password: 'demo123',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        username: 'demo',
        first_name: 'Demo',
        last_name: 'User',
        fullname: 'Demo User',
        occupation: 'Demo Account',
        company_name: 'Metronic',
        phone: '+1234567890',
        pic: '/media/avatars/300-1.png',
        language: 'en',
        is_admin: true,
        roles: ['admin', 'user']
      }
    };

    // Create the user using Supabase admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: demoUserData.email,
      password: demoUserData.password,
      email_confirm: demoUserData.email_confirm,
      user_metadata: demoUserData.user_metadata
    });

    if (error) {
      console.error('❌ Error creating demo user:', error.message);
      
      // Check if user already exists
      if (error.message.includes('already registered')) {
        console.log('ℹ️  Demo user already exists. You can use these credentials:');
        console.log('   Email: demo@kt.com');
        console.log('   Password: demo123');
        return;
      }
      
      process.exit(1);
    }

    console.log('✅ Demo user created successfully!');
    console.log('');
    console.log('📋 Demo User Credentials:');
    console.log('   Email: demo@kt.com');
    console.log('   Password: demo123');
    console.log('');
    console.log('🔗 You can now sign in at: http://localhost:5173/auth/signin');
    console.log('');
    console.log('⚠️  Note: This is a demo account. In production, you should:');
    console.log('   - Use a strong password');
    console.log('   - Enable email verification');
    console.log('   - Set up proper user roles and permissions');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the script
createDemoUser(); 
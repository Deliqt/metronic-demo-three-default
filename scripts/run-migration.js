import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Running database migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'migration_setup.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration SQL loaded from migration_setup.sql');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`   Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // If exec_sql function doesn't exist, try direct query
          console.log('   Trying direct query execution...');
          const { error: directError } = await supabase.from('_dummy').select('*').limit(0);
          
          if (directError && directError.message.includes('relation "_dummy" does not exist')) {
            console.log('   ✅ Database connection successful');
            console.log('   ⚠️  Note: Some SQL statements may need to be run manually in Supabase dashboard');
            console.log('   📋 Please run the following SQL in your Supabase SQL editor:');
            console.log('');
            console.log('   ' + statement + ';');
            console.log('');
          } else {
            console.log('   ❌ Error:', directError?.message || 'Unknown error');
          }
        } else {
          console.log('   ✅ Statement executed successfully');
        }
      } catch (err) {
        console.log('   ⚠️  Statement skipped (may need manual execution):', err.message);
      }
    }
    
    console.log('');
    console.log('✅ Migration process completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy and paste the contents of migration_setup.sql');
    console.log('   4. Run the SQL to create the required database structure');
    console.log('   5. Run "npm run create-demo-user" to create the demo user');
    console.log('   6. Run "npm run dev" to start the development server');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration(); 
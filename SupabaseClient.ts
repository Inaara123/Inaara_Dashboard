import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmpilcujqwmxqygnjxbf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcGlsY3VqcXdteHF5Z25qeGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE0OTEzNjIsImV4cCI6MjAzNzA2NzM2Mn0.oZkfYEotWPZLhTAL1UW5F5RLw5DLNd2RNB0-4-E-9rE'

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or ANON KEY not found');
    throw new Error('Supabase URL and ANON KEY must be provided');
  }
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase ANON KEY:', supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey)
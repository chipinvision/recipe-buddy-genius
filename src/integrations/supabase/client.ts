// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iheqcjjxbfzrzxwobeoz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZXFjamp4YmZ6cnp4d29iZW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMjU3MjksImV4cCI6MjA0OTkwMTcyOX0.9WC6Iz6zKnQkzh3LAL2j2XTkmc13oT89xkOF3lB10aU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
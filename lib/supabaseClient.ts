import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://pobwvgqdqslozqaedryy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYnd2Z3FkcXNsb3pxYWVkcnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDcwNzk2NSwiZXhwIjoyMDY2MjgzOTY1fQ.sA4ydqtRQndgj-AFbm_Imel8ZcfTRuXkoa3hxdu0KCo",
  )
}

export const supabase = createClient()
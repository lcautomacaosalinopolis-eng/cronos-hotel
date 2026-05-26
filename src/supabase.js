import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://trjnrhvozuvvpaijkgxz.supabase.co'

const supabaseAnonKey =
  'sb_publishable_NZo8HBG3BzKHyEg6FuTFMw_mRICK5KC'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

export default supabase
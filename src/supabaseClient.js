import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://cridyyahxbuuokxdozoe.supabase.co"
const supabaseAnonKey = "sb_publishable_-WeuFigVoQxDJqAkEiGMXQ_y9GGPLT0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
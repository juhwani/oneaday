import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 1. Get the user's ID
      const { data: { user } } = await supabase.auth.getUser()

      // 2. Check if they have a profile (username)
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      // 3. Redirect based on profile status
      if (!profile) {
        return NextResponse.redirect(`${origin}/setup`)
      } else {
        return NextResponse.redirect(`${origin}/`)
      }
    }
  }

  // If something fails, go back to login
  return NextResponse.redirect(`${origin}/login`)
}
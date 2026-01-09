import HomeClient from "./HomeClient"; 
import { createClient } from "@/utils/supabase/server"; // Use the SERVER util
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();
  
  // 1. Get the current logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. If no user is logged in, send them to login
  if (!user) {
    redirect("/login");
  }

  // 3. Get their username from our new profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const today = new Date().toISOString().split('T')[0];
  
  // 4. Check if THIS SPECIFIC user has posted today
  const { data: posts } = await supabase
    .from("posts")
    .select("id")
    .eq("user_id", user.id) // This ensures it checks YOUR thoughts only
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lte("created_at", `${today}T23:59:59.999Z`)
    .limit(1);

  const hasPostedToday = posts && posts.length > 0;

  // Pass the real username (userid) to the client component
  return <HomeClient 
    hasPostedToday={hasPostedToday} 
    userid={profile?.username || "user"} 
  />;
}
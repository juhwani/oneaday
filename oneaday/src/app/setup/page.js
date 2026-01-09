import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SetupClient from "./SetupClient";

export default async function SetupPage() {
  const supabase = await createClient();

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. If no user is logged in, kick them to login
  if (!user) {
    redirect("/login");
  }

  // 3. Check if they ALREADY have a profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  // 4. If they already have a username, don't let them stay here
  if (profile) {
    redirect(`/${profile.username}`);
  }

  // If they are logged in but have no profile, show the form
  return <SetupClient />;
}
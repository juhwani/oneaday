import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginPageClient from "./LoginClient";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If the browser remembers the user, redirect them immediately
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (profile) {
      redirect(`/${profile.username}`);
    } else {
      redirect("/setup");
    }
  }

  return <LoginPageClient />;
}
"use server";
import { createClient } from "@/utils/supabase/server";

export async function releaseThought(formData) {
  const supabase = await createClient();

  // 1. Get the current logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "You must be logged in to release a thought." };
  }

  const content = formData.get("entry");

  // 2. Insert with the user_id attached
  const { error } = await supabase
    .from("posts")
    .insert([
      { 
        content: content, 
        user_id: user.id // This links the post to the identity
      }
    ]);

  if (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true };
}
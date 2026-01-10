"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function releaseThought(formData) {
  const supabase = await createClient();

  // 1. Get the current logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "You must be logged in to release a thought." };
  }

  // 2. Extract BOTH content and mood
  const content = formData.get("entry");
  const moodValue = formData.get("mood"); // Grabbing the mood you appended in HomeClient
  
  // Convert to integer so Supabase accepts it as an INT
  const mood = parseInt(moodValue, 10);

  // 3. Insert with the mood explicitly defined
  const { error } = await supabase
    .from("posts")
    .insert([
      { 
        content: content, 
        mood: mood,      // <--- THIS was the missing piece
        user_id: user.id 
      }
    ]);

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    return { success: false };
  }

  // 4. Clear the cache so the profile grid updates immediately
  revalidatePath("/"); 
  
  return { success: true };
}
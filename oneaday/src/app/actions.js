"use server"; // This is the most important line!
import { createClient } from "@/utils/supabase"; // The client we made earlier
import { revalidatePath } from "next/cache";

export async function releaseThought(formData) {
  // 1. Initialize the Supabase client
  const supabase = createClient();

  // 2. Extract the data from the form
  const content = formData.get("entry");

  // 3. Simple validation (The Security Guard check)
  if (!content || content.length > 280) {
    return { error: "Invalid content length" };
  }

  // 4. Send to Supabase
  const { error } = await supabase
    .from("posts")
    .insert([{ content: content }]);

  if (error) {
    console.error("Supabase Error:", error.message);
    return { error: "Could not save thought" };
  }

  // 5. Tell Next.js to refresh the page cache
  revalidatePath("/");
  
  return { success: true };
}
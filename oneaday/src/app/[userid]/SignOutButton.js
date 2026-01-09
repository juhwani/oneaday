"use client";
import { createClient } from "@/utils/supabase/client";

export default function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Refreshing or redirecting to /login ensures the middleware 
    // clears the session from the server's perspective too
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        background: "none",
        border: "none",
        color: "#ccc", 
        fontSize: "10px",
        letterSpacing: "3px",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "color 0.3s ease",
        fontWeight: "200",
        marginTop: "100px" // Pushes it down away from the grid
      }}
      onMouseEnter={(e) => (e.target.style.color = "black")}
      onMouseLeave={(e) => (e.target.style.color = "#ccc")}
    >
      Sign Out
    </button>
  );
}
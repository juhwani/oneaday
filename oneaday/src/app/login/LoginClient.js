"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This tells Supabase where to send the user after they click the email link
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the magic link.");
    }
    setLoading(false);
  };

  return (
    <main style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      color: "white",
      textAlign: "center"
    }}>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "300px" }}>
        <h1 style={{ fontWeight: "200", fontSize: "24px", letterSpacing: "2px", marginBottom: "40px" }}>
          WELCOME
        </h1>
        
        <input 
          type="email" 
          placeholder="email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "1px solid #333",
            color: "white",
            padding: "10px 0",
            fontSize: "16px",
            outline: "none",
            marginBottom: "30px",
            textAlign: "center"
          }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{
            background: "none",
            border: "1px solid white",
            color: "white",
            padding: "10px 40px",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: "pointer",
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? "Sending..." : "Enter"}
        </button>

        {message && (
          <p style={{ marginTop: "30px", fontSize: "12px", color: "#888", letterSpacing: "1px" }}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
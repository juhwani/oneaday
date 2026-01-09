"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SetupClient() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSetup = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .insert({ id: user.id, username: username.toLowerCase().trim() });

    if (error) {
      alert("Username taken or invalid");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white" }}>
      <form onSubmit={handleSetup} style={{ textAlign: "center" }}>
        <h1 style={{ fontWeight: "200", marginBottom: "20px", letterSpacing: "2px" }}>CLAIM YOUR HANDLE</h1>
        <input 
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
          placeholder="username"
          required
          style={{ 
            backgroundColor: "transparent", 
            borderBottom: "1px solid white", 
            border: "none", 
            color: "white", 
            outline: "none", 
            textAlign: "center", 
            padding: "10px",
            fontSize: "18px"
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            display: "block", 
            margin: "40px auto", 
            background: "white", 
            color: "black", 
            padding: "10px 40px", 
            border: "none", 
            cursor: loading ? "default" : "pointer",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontSize: "12px",
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? "Claiming..." : "Begin"}
        </button>
      </form>
    </main>
  );
}
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { releaseThought } from "./actions";

export default function HomeClient({ hasPostedToday, userid }) {
  const [entry, setEntry] = useState("");
  const [isReleasing, setIsReleasing] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();
  const limit = 280;
  async function handleSubmit(e) {
  if (e) e.preventDefault();
  
  // Logical lock
  if (isReleasing || entry.length === 0) return;

  setIsReleasing(true); 

  const formData = new FormData();
  formData.append("entry", entry);

  const result = await releaseThought(formData);
  
  if (result?.success) {
    router.push(`/${userid}`);
  } else {
    // If it fails, we gently bring the button back
    setIsReleasing(false); 
    // We avoid 'alert()' to keep the aesthetic clean
  }
}
  const handleTextChange = (e) => {
    const element = e.target;
    setEntry(element.value);
    element.style.height = "20px";
    element.style.height = `${element.scrollHeight}px`;
  };

async function clientAction(formData) {
  console.log("⏱️ [1] Button clicked - starting clientAction");
  console.time("Action-to-Redirect-Duration");
  
  setIsReleasing(true); 

  try {
    const result = await releaseThought(formData);
    
    if (result?.success) {
      console.log("⏱️ [2] Success, moving to profile...");
      router.push(`/${userid}`);
    } else {
      console.error("Release failed");
      setIsReleasing(false); // Unlock button so user can try again
      alert("The void rejected your thought. Please try again.");
    }
  } catch (err) {
    setIsReleasing(false);
    console.error(err);
  }
}

  // If already posted, show the minimalist Link instead of the form
  if (hasPostedToday) {
    return (
      <main style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: "200", letterSpacing: "2px", marginBottom: "30px", opacity: 0.6 }}>
            TODAY'S THOUGHT IS ALREADY IN THE VOID.
          </p>
          <Link href={`/${userid}`} style={{
            color: "white",
            textDecoration: "none",
            fontSize: "12px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            border: "1px solid white",
            padding: "12px 24px",
            borderRadius: "2px", // Square minimalist look
            transition: "all 0.3s ease"
          }}>
            View Calendar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white" }}>
<form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px", padding: "0 20px" }}>
  {/* ... title and textarea remain the same ... */}
        <h1 style={{ fontWeight: "300", marginBottom: "10px", fontSize: "24px", textAlign: "left" }}>
          Tell me how it went
        </h1>

        <textarea
          name="entry"
          value={entry}
          onChange={handleTextChange}
          maxLength={limit}
          placeholder="Enter text here..."
          style={{
            width: "100%", backgroundColor: "transparent", border: "none", outline: "none",
            color: "white", fontSize: "18px", textAlign: "left", resize: "none",
            fontFamily: "inherit", overflow: "hidden", minHeight: "20px", height: "25px"
          }}
        />
        
        <div style={{ color: "#333", fontSize: "12px", marginTop: "20px", textAlign: "center" }}>
          {entry.length} / {limit}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button 
      type="submit"
      disabled={entry.length === 0 || isReleasing}
      style={{
        background: "none", 
        border: "none", 
        color: "white", 
        fontSize: "14px",
        letterSpacing: "4px", // Increased for that premium look
        cursor: (entry.length > 0 && !isReleasing) ? "pointer" : "default",
        
        // The magic happens here:
        // When releasing, it almost disappears (0.2). 
        // When empty, it's invisible (0).
        opacity: isReleasing ? 0.2 : (entry.length > 0 ? 1 : 0), 
        
        transition: "opacity 1.5s ease, letter-spacing 2s ease",
        textTransform: "uppercase", 
        fontWeight: "200",
        pointerEvents: isReleasing ? "none" : "auto",
        outline: "none"
      }}
    >
      {isReleasing ? "Submitting..." : "Submit"}
    </button>
  </div>
</form>
    </main>
  );
}
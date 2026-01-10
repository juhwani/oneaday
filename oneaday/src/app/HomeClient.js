"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { releaseThought } from "./actions";

export default function HomeClient({ hasPostedToday, userid }) {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState(5); // New mood state
  const [isReleasing, setIsReleasing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Navigation state
  
  const router = useRouter();
  const limit = 280;

  const moodDescriptions = ["Worst", "Awful", "Bad", "Unwell", "Neutral", "Decent", "Good", "Happy", "Excellent", "Perfect"];

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    if (isReleasing || entry.length === 0) return;

    setIsReleasing(true); 

    const formData = new FormData();
    formData.append("entry", entry);
    formData.append("mood", mood); // Added mood to formData

    const result = await releaseThought(formData);
    
    if (result?.success) {
      router.push(`/${userid}`);
    } else {
      setIsReleasing(false); 
    }
  }

  const handleTextChange = (e) => {
    const element = e.target;
    setEntry(element.value);
    element.style.height = "20px";
    element.style.height = `${element.scrollHeight}px`;
  };

  if (hasPostedToday) {
    return (
      <main style={fullPageCenter}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: "200", letterSpacing: "2px", marginBottom: "30px", opacity: 0.6 }}>
            TODAY'S THOUGHT IS ALREADY IN THE VOID.
          </p>
          <Link href={`/${userid}`} style={ghostButtonStyle}>
            View Calendar
          </Link>
        </div>
      </main>
    );
  }
    const MOOD_COLORS = [
    "#6E45E2", // 1: Terrible (Deep Purple)
    "#4563E2", // 2: Cold
    "#45AEE2", // 3: Blue
    "#45E2D1", // 4: Teal
    "#45E271", // 5: Green (Balanced)
    "#B7E245", // 6: Lime
    "#E2D145", // 7: Yellow
    "#E28B45", // 8: Orange
    "#E24545", // 9: Red-Hot
    "#FFFFFF"  // 10: Amazing (White Light)
    ];

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white", position: "relative" }}>
      
      {/* 1. NAVIGATION CIRCLE & GHOST MENU */}
<div style={{ position: "absolute", top: "40px", right: "40px", zIndex: 100, display: "flex", alignItems: "center" }}>
  
  {/* The Links appear to the left of the circle */}
  <div style={{
    display: "flex",
    gap: "30px",
    marginRight: "25px",
    opacity: menuOpen ? 1 : 0,
    transform: menuOpen ? "translateX(0)" : "translateX(20px)",
    pointerEvents: menuOpen ? "auto" : "none",
    transition: "all 0.5s cubic-bezier(0.2, 1, 0.3, 1)"
  }}>
    <Link 
      href={`/${userid}`} 
      style={navLinkStyle}
      onMouseEnter={(e) => e.target.style.opacity = 1}
      onMouseLeave={(e) => e.target.style.opacity = 0.5}
    >
      Profile
    </Link>
    <Link 
      href="/about" 
      style={navLinkStyle}
      onMouseEnter={(e) => e.target.style.opacity = 1}
      onMouseLeave={(e) => e.target.style.opacity = 0.5}
    >
      About
    </Link>
  </div>

  {/* The Trigger Circle */}
  <div 
    onClick={() => setMenuOpen(!menuOpen)}
    style={{
      width: "12px",
      height: "12px",
      backgroundColor: "white",
      borderRadius: "50%",
      cursor: "pointer",
      transition: "all 0.4s ease",
      boxShadow: menuOpen ? "0 0 15px rgba(255,255,255,0.4)" : "none",
      transform: menuOpen ? "scale(0.8)" : "scale(1)"
    }}
  />
</div>

<form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px", padding: "0 20px" }}>
      
      {/* Container for Text to prevent shifting */}
      <div style={{ minHeight: "150px" }}> 
        <h1 style={{ fontWeight: "300", marginBottom: "10px", fontSize: "24px", textAlign: "left" }}>
          Tell me how it went
        </h1>

        <textarea
          name="entry"
          value={entry}
          onChange={handleTextChange}
          maxLength={limit}
          placeholder="Enter text here..."
          style={textareaStyle}
        />
      </div>

      {/* 2. THE MOOD SLIDER (Emerging from darkness) */}
      <div style={{ 
        marginTop: "10px", 
        textAlign: "center",
        // This is the magic: It stays in the layout but stays invisible until typing starts
        opacity: entry.length > 0 ? 1 : 0,
        pointerEvents: entry.length > 0 ? "auto" : "none",
        transition: "opacity 2s ease", // Matches your submit button
      }}>
        <p style={{ 
          fontSize: "10px", 
          letterSpacing: "5px", 
          color: MOOD_COLORS[mood - 1], 
          textTransform: "uppercase",
          marginBottom: "20px",
          transition: "color 0.5s ease"
        }}>
          {moodDescriptions[mood-1]}
        </p>
        
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
          {MOOD_COLORS.map((color, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMood(i + 1)}
              style={{
                width: mood === i + 1 ? "24px" : "16px",
                height: mood === i + 1 ? "24px" : "16px",
                backgroundColor: color,
                borderRadius: "50%",
                border: mood === i + 1 ? "2px solid white" : "none",
                cursor: "pointer",
                transition: "all 0.6s ease", // Smooth scaling
                boxShadow: mood === i + 1 ? `0 0 20px ${color}` : "none",
                opacity: mood === i + 1 ? 1 : 0.3,
                padding: 0
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ color: "#111", fontSize: "12px", marginTop: "30px", textAlign: "center" }}>
        {entry.length} / {limit}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button 
          type="submit"
          disabled={entry.length === 0 || isReleasing}
          style={{
            ...submitButtonStyle,
            opacity: isReleasing ? 0.2 : (entry.length > 0 ? 1 : 0), 
            pointerEvents: isReleasing ? "none" : "auto",
          }}
        >
          {isReleasing ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  </main>
);
}

// STYLES
const fullPageCenter = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white" };
const ghostButtonStyle = { color: "white", textDecoration: "none", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", border: "1px solid white", padding: "12px 24px" };
const textareaStyle = { width: "100%", backgroundColor: "transparent", border: "none", outline: "none", color: "white", fontSize: "18px", textAlign: "left", resize: "none", fontFamily: "inherit", overflow: "hidden", minHeight: "20px" };
const submitButtonStyle = { background: "none", border: "none", color: "white", fontSize: "14px", letterSpacing: "4px", transition: "opacity 1.5s ease, letter-spacing 2s ease", textTransform: "uppercase", fontWeight: "200", outline: "none", cursor: "pointer" };
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "10px", // Smaller is more premium
  letterSpacing: "4px", // Wider tracking
  textTransform: "uppercase",
  fontWeight: "200",
  opacity: 0.5, // Faded by default
  transition: "opacity 0.3s ease"
};

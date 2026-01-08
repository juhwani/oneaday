"use client";
import { useState, useRef } from "react";
import { releaseThought } from "./actions"; // Import your server action

export default function Home() {
  const [entry, setEntry] = useState("");
  const formRef = useRef(null); // Used to clear the form after success
  const limit = 280;

  const handleTextChange = (e) => {
    const element = e.target;
    setEntry(element.value);
    element.style.height = "20px";
    element.style.height = `${element.scrollHeight}px`;
  };

  // This function handles the submission on the client side
  async function clientAction(formData) {
    const result = await releaseThought(formData);
    if (result?.success) {
      setEntry(""); // Clear the state
      formRef.current?.reset(); // Clear the actual form
      alert("Thought released into the void.");
    } else {
      alert("Something went wrong.");
    }
  }

  return (
    <main style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      color: "white"
    }}>
      
      {/* 1. Wrap everything in a Form */}
      <form 
        ref={formRef}
        action={clientAction} 
        style={{ width: "100%", maxWidth: "500px", padding: "0 20px" }}
      >
        <h1 style={{ 
          fontWeight: "300", 
          marginBottom: "10px", 
          fontSize: "24px",
          textAlign: "left" 
        }}>
          Tell me how it went
        </h1>

        <textarea
          name="entry" // THIS IS CRITICAL: The Server Action looks for this name
          value={entry}
          onChange={handleTextChange}
          maxLength={limit}
          placeholder="Enter text here..."
          style={{
            width: "100%",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "18px",
            textAlign: "left",
            resize: "none",
            fontFamily: "inherit",
            overflow: "hidden",
            minHeight: "20px",
            height: "25px"
          }}
        />
        
        <div style={{ 
          color: "#333", 
          fontSize: "12px", 
          marginTop: "20px",
          textAlign: "center" 
        }}>
          {entry.length} / {limit}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button 
            type="submit"
            disabled={entry.length === 0}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "14px",
              letterSpacing: "2px",
              cursor: entry.length > 0 ? "pointer" : "default",
              opacity: entry.length > 0 ? 1 : 0,
              transition: "opacity 1s ease",
              textTransform: "uppercase",
              fontWeight: "200"
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
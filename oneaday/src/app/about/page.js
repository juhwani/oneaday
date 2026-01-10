import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "black", minHeight: "100vh", color: "white", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
      <div style={{ maxWidth: "500px", textAlign: "center", lineHeight: "1.8" }}>
        <h1 style={{ fontWeight: "200", letterSpacing: "8px", marginBottom: "40px" }}>THE VOID</h1>
        
        <p style={{ fontSize: "14px", opacity: 0.6, letterSpacing: "1px" }}>
          This is a space for honest reflection. 
          The grid on your profile tracks the intensity of your existence over time. 
          Black squares represent peak clarity; faint ones represent the fog.
        </p>
        
        <p style={{ fontSize: "14px", opacity: 0.6, letterSpacing: "1px", marginTop: "20px" }}>
          Everything here is private to you, until you choose to let others in.
        </p>

        <Link href="/" style={{ display: "inline-block", marginTop: "60px", color: "white", textDecoration: "none", fontSize: "10px", borderBottom: "1px solid white", paddingBottom: "5px", letterSpacing: "3px" }}>
          RETURN
        </Link>
      </div>
    </main>
  );
}
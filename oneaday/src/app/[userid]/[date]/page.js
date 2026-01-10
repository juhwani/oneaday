import { createClient } from "@/utils/supabase/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EntryPage({ params }) {
  const { userid, date } = await params;
  const supabase = createClient();

  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!post) return notFound();

  // 1. Mood Configuration
  const MOOD_COLORS = [
    "#4A00E0", "#005BEA", "#00B4DB", "#00F2FE", "#4facfe", 
    "#00f260", "#f7ff00", "#ff9a9e", "#ff0844", "#000000" // Changed 10 to Black for White theme visibility
  ];
  
  const moodDescriptions = ["Worst", "Awful", "Bad", "Unwell", "Neutral", "Decent", "Good", "Happy", "Excellent", "Perfect"];
  const themeColor = MOOD_COLORS[post.mood - 1] || "#000000";

  return (
    <main style={{
      height: "100vh",
      backgroundColor: "white",
      color: "black",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        .nav-circle-link {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        .nav-circle-link:hover {
          transform: translateY(-5px);
        }
        .nav-circle-link:hover .circle-fill {
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2);
        }
      `}</style>

      {/* 2. SOFT COLOR ACCENT (Top Gradient) */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "5px",
        backgroundColor: themeColor,
        opacity: 0.6
      }} />

      <div style={{ maxWidth: "600px", position: "relative" }}>
        {/* Date & Mood Descriptor */}
        <p style={{ 
          fontSize: "11px", 
          letterSpacing: "4px", 
          textTransform: "uppercase", 
          color: "#A0A0A0",
          marginBottom: "10px" 
        }}>
          — {date.replaceAll('-', ' . ')} —
        </p>
        
        <p style={{ 
          fontSize: "10px", 
          letterSpacing: "2px", 
          color: themeColor, // The mood color is showcased here
          fontWeight: "600",
          textTransform: "uppercase",
          marginBottom: "40px"
        }}>
          {moodDescriptions[post.mood - 1]}
        </p>
        
        <h2 style={{ 
          fontWeight: "300", 
          lineHeight: "1.8", 
          fontSize: "24px",
          color: "#1A1A1A",
          marginBottom: "60px"
        }}>
          {post.content}
        </h2>

        {/* 3. COLORED NAVIGATION CIRCLE */}
        <Link href={`/${userid}`} className="nav-circle-link">
          <div className="circle-fill" style={{
            width: "40px",
            height: "40px",
            backgroundColor: themeColor, // Circle is now the mood color
            borderRadius: "50%",
            transition: "all 0.3s ease"
          }} />
          <span style={{
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "black",
            fontWeight: "400",
            opacity: 0.4
          }}>
            Return
          </span>
        </Link>
      </div>
    </main>
  );
}
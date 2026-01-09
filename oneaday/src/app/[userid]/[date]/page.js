import { createClient } from "@/utils/supabase/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EntryPage({ params }) {
  const { userid, date } = await params;
  const supabase = createClient();

// 1. Create the 'Time Window'
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  console.log("--- DEBUG START ---");
  console.log("Looking for Date:", date);
  console.log("Start Window:", startOfDay);
  console.log("End Window:", endOfDay);

  // 2. The Narrow Query (The one we want to work)
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 3. The WIDE Query (For debugging only)
  // This checks if the table even has data
  const { data: allPosts } = await supabase.from("posts").select("created_at").limit(3);
  
  console.log("Does the table have ANY posts?:", allPosts);
  console.log("Specific Post Found?:", post);
  if (error) console.log("Query Error:", error.message);
  console.log("--- DEBUG END ---");

  // 3. Diagnostic Logging (Check your Terminal, not the Browser)
  if (error) {
    console.error("Supabase Error:", error.message);
  }

  // 4. Handle Missing Data
  if (!post) {
    return notFound();
  }
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
      textAlign: "center"
    }}>
      <style>{`
        .nav-circle {
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .nav-circle:hover {
          transform: translateY(-5px);
        }
        .nav-text {
          opacity: 0;
          transition: opacity 0.3s ease;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: black;
          font-weight: 600;
        }
        .nav-circle:hover .nav-text {
          opacity: 1;
        }
      `}</style>

      <div style={{ maxWidth: "600px" }}>
        <p style={{ 
          fontSize: "12px", 
          letterSpacing: "3px", 
          textTransform: "uppercase", 
          color: "#A0A0A0",
          marginBottom: "40px" 
        }}>
          — {date.replaceAll('-', ' . ')} —
        </p>
        
        <h2 style={{ 
          fontWeight: "300", 
          lineHeight: "1.8", 
          fontSize: "22px",
          color: "#1A1A1A"
        }}>
          {post.content}
        </h2>

        {/* The Interactive Black Circle */}
        <div style={{ marginTop: "60px" }}>
          <Link href={`/${userid}`} className="nav-circle">
            <div style={{
              width: "40px",
              height: "40px",
              backgroundColor: "black",
              borderRadius: "50%"
            }} />
            <span className="nav-text">Back to Profile</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
import { createClient } from "@/utils/supabase/server"; // UPDATED IMPORT
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default async function ProfilePage({ params }) {
    const moodDescriptions = [
  "Worst", "Awful", "Bad", "Unwell", "Neutral", 
  "Decent", "Good", "Happy", "Excellent", "Perfect"
];

// Helper to safely get the label based on the 1-10 index
const getMoodLabel = (val) => {
  if (!val || val < 1 || val > 10) return "";
  return moodDescriptions[val - 1];
};
  const { userid } = await params;
  
  // console.time("Profile-Fetch-Time");
  const supabase = await createClient();

  // 1. Get the viewer's Auth data
  const { data: { user: viewer } } = await supabase.auth.getUser();

  // 2. Find the profile that matches the username
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', userid)
    .single();

  // End the timer early here if things fail or block
  if (!profile) {
    // console.timeEnd("Profile-Fetch-Time");
    return <div>User not found</div>;
  }

  const isOwner = viewer && viewer.id === profile.id;

  if (!isOwner) {
    // console.timeEnd("Profile-Fetch-Time"); // MUST END BEFORE RETURN
    const homePath = viewer?.user_metadata?.username 
    ? `/${viewer.user_metadata.username}` 
    : "/login";
return (
    <main style={{ 
      backgroundColor: 'black', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', // Stack text and button
      justifyContent: 'center', 
      alignItems: 'center',
      gap: '30px' 
    }}>
      <p style={{ letterSpacing: '2px', opacity: 0.5, margin: 0 }}>
        THIS VOID IS PRIVATE.
      </p>
      
      <Link 
        href={homePath}
        style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '10px',
          letterSpacing: '4px',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '10px 20px',
          textTransform: 'uppercase',
          fontWeight: '200',
          transition: 'all 0.3s ease'
        }}
      >
        Return to yours
      </Link>
    </main>
  );
}

  // 2. Fetch posts using the ID we found
const { data: posts } = await supabase
  .from("posts")
  .select("created_at, mood") // Only one .select call needed
  .eq("user_id", profile.id)
  .order("created_at", { ascending: true });

  // console.timeEnd("Profile-Fetch-Time");
  const activeDays = posts?.map(p => p.created_at.split('T')[0]) || [];

  // 3. Calendar Logic
  const today = new Date();
  const months = [];
  
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(d.getFullYear(), d.getMonth(), day);
      days.push(dateObj.toISOString().split('T')[0]);
    }
    months.push({ name: monthName, days });
  }
  const todayStr = new Date().toISOString().split('T')[0];
  const hasPostedToday = activeDays.includes(todayStr);
  // 4. Render
  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", color: "black", padding: "80px 20px" }}>
      <style>{`
        .square { transition: transform 0.1s ease; }
        .square:hover { 
          transform: scale(1.6); 
          z-index: 10; 
          outline: 1px solid white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
          /* Today's Pulse Animation */
  @keyframes todayPulse {
    0% { transform: scale(1); box-shadow: 0 0 0px rgba(0,0,0,0); }
    50% { transform: scale(1.2); box-shadow: 0 0 10px rgba(0,0,0,0.15); }
    100% { transform: scale(1); box-shadow: 0 0 0px rgba(0,0,0,0); }
  }
  .is-today {
    animation: todayPulse 2s infinite ease-in-out;
    z-index: 5;
  }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ width: "fit-content" }}>
          
          {/* Header - Now userid is correctly scoped here */}

<div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "60px" }}>
  <div style={{ width: "40px", height: "40px", backgroundColor: "black", borderRadius: "50%" }} />
  <div>
    <h1 style={{ fontWeight: "600", fontSize: "18px", margin: 0 }}>{userid}</h1>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{posts?.length || 0} entries</p>
      
      {/* 2. Conditional "Release" Button */}
      {!hasPostedToday && (
        <>
          <span style={{ color: "#eee" }}>|</span>
          <Link 
            href="/" 
            style={{ 
              fontSize: "12px", 
              color: "black", 
              textDecoration: "none", 
              fontWeight: "600",
              borderBottom: "1px solid black",
              paddingBottom: "1px"
            }}
          >
            write
          </Link>
        </>
      )}
    </div>
  </div>
</div>

          {/* 6x2 Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(6, max-content)", 
            columnGap: "20px", 
            rowGap: "40px" 
          }}>
            {months.map((month, mIdx) => (
              <div key={mIdx} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "10px", color: "#ccc", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {month.name}
                </span>
                
                <div style={{ display: "grid", gridTemplateRows: "repeat(7, 10px)", gridAutoFlow: "column", gap: "3px" }}>
{month.days.map(date => {
  const MOOD_COLORS = [
    "#4A00E0", "#005BEA", "#00B4DB", "#00F2FE", "#4facfe", 
    "#00f260", "#f7ff00", "#ff9a9e", "#ff0844", 
    "#1A1A1A" // Changed Mood 10 to Near-Black for visibility on white theme
  ];

  const postForDate = posts?.find(p => p.created_at.split('T')[0] === date);
  const moodValue = postForDate?.mood;
  const isActive = !!postForDate;
  const isToday = date === new Date().toISOString().split('T')[0];
  
const squareStyle = {
      width: "10px",  
      height: "10px",
      backgroundColor: moodValue ? MOOD_COLORS[moodValue - 1] : (isActive ? "black" : "#f0f0f0"),
      borderRadius: "1.5px",
      display: "block",
      position: "relative",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
      // Remove the old border: isToday ? "1px solid #000" : "none"
  };
  // Construct the class string
  const className = `square ${isToday ? 'is-today' : ''}`;

  if (isActive) {
      return (
      <Link
          key={date}
          href={`/${userid}/${date}`}
          className={className}
          style={{ ...squareStyle, cursor: "pointer" }}
          title={`${date}: ${getMoodLabel(moodValue)}`}
      />
      );
  }

  return (
      <div
      key={date}
      className={className}
      style={{ ...squareStyle, cursor: "default" }}
      title={isToday ? "Today: No entry yet" : `No entry for ${date}`}
      />
  );
})}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <SignOutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
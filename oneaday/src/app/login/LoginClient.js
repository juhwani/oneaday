"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // STEP 1: Send the 6-digit code
  const sendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setStep(2);
    else alert(error.message);
    setLoading(false);
  };

  // STEP 2: Verify the 6-digit code
  const verifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (!error) {
      router.push("/");
      router.refresh();
    } else {
      alert("Invalid code");
    }
    setLoading(false);
  };

  return (
    <main style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white" }}>
      <div style={{ textAlign: "center", width: "100%", maxWidth: "300px" }}>
        <h1 style={{ fontWeight: "200", letterSpacing: "4px", marginBottom: "40px" }}>
          {step === 1 ? "ENTER EMAIL" : "ENTER CODE"}
        </h1>

        {step === 1 ? (
          <form onSubmit={sendCode}>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@address.com" required
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
<input 
  type="text" 
  value={otp} 
  onChange={(e) => {
    // Only allow numbers and max 8 characters
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 8) setOtp(val);
  }}
  placeholder="00000000" 
  required
  style={inputStyle}
/>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Verifying..." : "Enter"}
            </button>
            <p onClick={() => setStep(1)} style={{ fontSize: "10px", marginTop: "20px", cursor: "pointer", opacity: 0.5 }}>
              Use a different email
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

const inputStyle = { width: "100%", background: "none", border: "none", borderBottom: "1px solid #333", color: "white", textAlign: "center", padding: "10px", marginBottom: "30px", outline: "none" };
const buttonStyle = { background: "none", border: "1px solid white", color: "white", padding: "10px 40px", cursor: "pointer", letterSpacing: "2px" };
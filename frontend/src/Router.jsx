import { useState, useEffect } from "react";
import MainApp from "./App.jsx";
import AdminApp from "./AdminApp.jsx";
import CertificateGenerator from "./CertificateGenerator.jsx";
import AffiliateSystem from "./AffiliateSystem.jsx";
import MobileApp from "./MobileApp.jsx";

// Simple hash-based router — no dependencies needed
function useHash() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const handler = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return hash;
}

export default function Router() {
  const hash = useHash();

  // Admin guard: check for admin token
  const isAdmin = () => localStorage.getItem("stackai_role") === "admin";

  if (hash.startsWith("#/admin"))       return isAdmin() ? <AdminApp /> : <AdminLogin />;
  if (hash.startsWith("#/certificates")) return <CertificateGenerator />;
  if (hash.startsWith("#/affiliate"))   return <AffiliateSystem />;
  if (hash.startsWith("#/mobile"))      return <MobileApp />;
  return <MainApp />;
}

function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    // Replace with real API call in production
    if (pw === "admin123") {
      localStorage.setItem("stackai_role", "admin");
      window.location.hash = "#/admin";
    } else {
      setErr(true);
    }
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"#080c14", fontFamily:"sans-serif" }}>
      <div style={{ background:"#111827", border:"1px solid rgba(255,255,255,.1)", borderRadius:16,
        padding:32, width:340 }}>
        <div style={{ fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:6 }}>Admin Access</div>
        <div style={{ fontSize:13, color:"#475569", marginBottom:24 }}>Enter your admin password</div>
        <input value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&submit()} type="password"
          placeholder="Password"
          style={{ width:"100%", background:"#1a2235", border:`1px solid ${err?"#ef4444":"rgba(255,255,255,.1)"}`,
            borderRadius:9, padding:"11px 14px", color:"#f1f5f9", fontSize:14,
            fontFamily:"sans-serif", outline:"none", marginBottom:8 }} />
        {err && <div style={{fontSize:12,color:"#ef4444",marginBottom:8}}>Incorrect password</div>}
        <button onClick={submit} style={{ width:"100%", padding:12, borderRadius:9,
          background:"linear-gradient(135deg,#3b82f6,#6366f1)", border:"none",
          color:"white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif" }}>
          Sign In →
        </button>
        <div style={{marginTop:12,fontSize:12,color:"#475569",textAlign:"center"}}>
          <a href="#/" style={{color:"#60a5fa"}}>← Back to platform</a>
        </div>
      </div>
    </div>
  );
}

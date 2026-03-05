import { useState } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#060910;--bg2:#0c1220;--bg3:#111827;--bg4:#1a2235;
  --green:#10b981;--green2:#34d399;
  --blue:#3b82f6;--blue2:#60a5fa;
  --purple:#8b5cf6;--amber:#f59e0b;--red:#ef4444;--cyan:#22d3ee;
  --text:#f0f4ff;--text2:#94a3b8;--text3:#475569;
  --line:rgba(255,255,255,0.07);--line2:rgba(255,255,255,0.12);
  --card:rgba(12,18,32,0.98);
}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.app{max-width:1200px;margin:0 auto;padding:32px 24px;}
/* Header */
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;flex-wrap:wrap;gap:16px;}
.header-left h1{font-size:26px;font-weight:800;}
.header-left p{font-size:14px;color:var(--text3);margin-top:4px;}
.badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;background:rgba(16,185,129,.15);color:var(--green);border:1px solid rgba(16,185,129,.2);}
.btn{padding:9px 20px;border-radius:9px;border:none;font-size:13.5px;font-weight:700;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .2s;}
.btn-primary{background:linear-gradient(135deg,var(--green),var(--cyan));color:#002a1a;}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(16,185,129,.3);}
.btn-ghost{background:transparent;border:1px solid var(--line2);color:var(--text2);}
.btn-ghost:hover{border-color:var(--green);color:var(--green);}
.btn-sm{padding:6px 14px;font-size:12.5px;}
.btn-copy{background:rgba(59,130,246,.15);color:var(--blue2);border:1px solid rgba(59,130,246,.2);font-size:12px;padding:5px 12px;border-radius:7px;cursor:pointer;font-family:'Outfit',sans-serif;font-weight:600;transition:all .2s;}
.btn-copy:hover{background:rgba(59,130,246,.25);}
/* Grid */
.grid{display:grid;gap:16px;}
.g2{grid-template-columns:repeat(auto-fit,minmax(260px,1fr));}
.g3{grid-template-columns:repeat(auto-fit,minmax(200px,1fr));}
.g4{grid-template-columns:repeat(auto-fit,minmax(160px,1fr));}
/* Card */
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px;}
.card:hover{border-color:rgba(255,255,255,.12);}
.card-title{font-size:14px;font-weight:700;margin-bottom:16px;}
/* Stat */
.stat-val{font-size:28px;font-weight:800;line-height:1;}
.stat-lbl{font-size:12px;color:var(--text3);margin-top:4px;}
.stat-delta{font-size:11px;font-weight:700;margin-top:6px;}
.up{color:var(--green);}
.dn{color:var(--red);}
/* Referral link box */
.link-box{background:var(--bg4);border:1px solid var(--line2);border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:20px;}
.link-url{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--blue2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
/* Progress bar */
.prog{height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;}
.prog-fill{height:100%;border-radius:3px;transition:width .8s ease;}
/* Tiers */
.tier-card{border-radius:12px;padding:20px;border:2px solid transparent;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
.tier-card.active{border-color:var(--amber);}
.tier-badge{position:absolute;top:10px;right:10px;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px;}
/* Table */
.tbl{width:100%;border-collapse:collapse;font-size:13px;}
.tbl th{text-align:left;padding:10px 12px;color:var(--text3);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid var(--line);}
.tbl td{padding:12px 12px;border-bottom:1px solid var(--line);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:rgba(255,255,255,.02);}
.pill{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;}
.pg{background:rgba(16,185,129,.15);color:var(--green);}
.pb{background:rgba(59,130,246,.15);color:var(--blue2);}
.pa{background:rgba(245,158,11,.15);color:var(--amber);}
.pr{background:rgba(239,68,68,.15);color:var(--red);}
.pp{background:rgba(139,92,246,.15);color:var(--purple);}
/* Tabs */
.tabs{display:flex;gap:2px;background:var(--bg3);border-radius:10px;padding:4px;border:1px solid var(--line);margin-bottom:24px;width:fit-content;}
.tab{padding:8px 18px;border-radius:7px;font-size:13.5px;font-weight:600;color:var(--text3);cursor:pointer;border:none;background:none;font-family:'Outfit',sans-serif;transition:all .2s;}
.tab.active{background:var(--blue);color:white;}
/* Share btns */
.share-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px;}
.share-btn{padding:12px 8px;border-radius:10px;border:1px solid var(--line2);background:var(--bg4);cursor:pointer;text-align:center;transition:all .2s;}
.share-btn:hover{border-color:var(--green);transform:translateY(-2px);}
.share-btn div:first-child{font-size:22px;margin-bottom:4px;}
.share-btn div:last-child{font-size:11px;color:var(--text3);font-family:'Outfit',sans-serif;}
/* Chart */
.mini-chart{display:flex;align-items:flex-end;gap:4px;height:60px;margin-top:12px;}
.mini-bar{flex:1;border-radius:3px 3px 0 0;min-height:4px;transition:opacity .2s;}
.mini-bar:hover{opacity:.8;}
/* Leaderboard */
.lb-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);}
.lb-row:last-child{border-bottom:none;}
.lb-rank{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;}
.lb-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;}
/* Input */
.input{width:100%;background:var(--bg4);border:1px solid var(--line2);border-radius:9px;padding:10px 13px;color:var(--text);font-size:13.5px;font-family:'Outfit',sans-serif;outline:none;transition:border-color .2s;}
.input:focus{border-color:var(--green);}
/* withdraw card */
.withdraw-box{background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(6,182,212,.05));border:1px solid rgba(16,185,129,.2);border-radius:14px;padding:24px;text-align:center;}
.balance-num{font-size:48px;font-weight:800;color:var(--green2);line-height:1;}
.mb2{margin-bottom:8px;} .mb3{margin-bottom:12px;} .mb4{margin-bottom:20px;} .mb5{margin-bottom:28px;}
.flex{display:flex;} .items-center{align-items:center;} .justify-between{justify-content:space-between;}
.gap2{gap:8px;} .gap3{gap:12px;}
.text-sm{font-size:13px;} .text-xs{font-size:11px;} .text-muted{color:var(--text3);}
.font-bold{font-weight:700;} .w-full{width:100%;}
.mt2{margin-top:8px;} .mt3{margin-top:12px;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.fade{animation:fadeIn .3s ease;}
`;

const REFERRALS = [
  {name:"Kofi Mensah",    email:"kofi@ex.com",    date:"2d ago",  status:"enrolled",  earnings:"$23.70",  course:"React Mastery"},
  {name:"Amara Osei",     email:"amara@ex.com",   date:"4d ago",  status:"enrolled",  earnings:"$23.70",  course:"Full Stack Dev"},
  {name:"Yemi Adeyemi",   email:"yemi@ex.com",    date:"6d ago",  status:"enrolled",  earnings:"$20.70",  course:"Node.js"},
  {name:"Fatima Rashid",  email:"fat@ex.com",     date:"1w ago",  status:"enrolled",  earnings:"$23.70",  course:"React Mastery"},
  {name:"Emeka Nwosu",    email:"emeka@ex.com",   date:"1w ago",  status:"pending",   earnings:"—",       course:"TypeScript"},
  {name:"Zara Diallo",    email:"zara@ex.com",    date:"2w ago",  status:"enrolled",  earnings:"$26.70",  course:"AWS"},
  {name:"Chidi Okeke",    email:"chidi@ex.com",   date:"2w ago",  status:"cancelled", earnings:"—",       course:"PostgreSQL"},
  {name:"Aisha Kamara",   email:"aisha@ex.com",   date:"3w ago",  status:"enrolled",  earnings:"$23.70",  course:"Full Stack Dev"},
];

const PAYOUTS = [
  {date:"Feb 28, 2025", amount:"$142.20", method:"Stripe",   status:"paid"},
  {date:"Jan 31, 2025", amount:"$95.40",  method:"Paystack", status:"paid"},
  {date:"Dec 31, 2024", amount:"$71.10",  method:"Stripe",   status:"paid"},
];

const LEADERBOARD = [
  {name:"Kofi Mensah",  refs:28, earnings:"$664", rank:1},
  {name:"Zara Diallo",  refs:21, earnings:"$498", rank:2},
  {name:"Amara Osei",   refs:17, earnings:"$403", rank:3},
  {name:"You",          refs:12, earnings:"$285", rank:4, isMe:true},
  {name:"Yemi Adeyemi", refs:9,  earnings:"$213", rank:5},
];

const BAR_DATA = [3,5,2,8,6,9,4,7,11,8,12,10];

const TIERS = [
  {id:"starter", label:"Starter",    pct:30, refs:"0–9 refs",   color:"var(--text3)",  bg:"var(--bg4)"},
  {id:"growth",  label:"Growth",     pct:35, refs:"10–29 refs", color:"var(--blue2)",  bg:"rgba(59,130,246,.1)"},
  {id:"pro",     label:"Pro",        pct:40, refs:"30–99 refs", color:"var(--purple)", bg:"rgba(139,92,246,.1)"},
  {id:"elite",   label:"Elite",      pct:45, refs:"100+ refs",  color:"var(--amber)",  bg:"rgba(245,158,11,.1)"},
];

export default function AffiliateSystem() {
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const refLink = "https://stackai.dev/r/AMARA2025";

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{S}</style>
      <div className="app fade">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <h1>💸 Affiliate Dashboard</h1>
            <p>Earn 30–45% commission on every referral • StackAI Partner Program</p>
          </div>
          <div className="flex gap3 items-center">
            <span className="badge">🏆 Growth Tier · 35%</span>
            <button className="btn btn-primary">Invite Friends</button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="card mb5">
          <div className="card-title">🔗 Your Referral Link</div>
          <div className="link-box">
            <div className="link-url">{refLink}</div>
            <button className="btn-copy" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button>
          </div>
          <div className="share-grid">
            {[["🐦","Twitter"],["💼","LinkedIn"],["📱","WhatsApp"],["✉️","Email"]].map(([ic,nm])=>(
              <div key={nm} className="share-btn">
                <div>{ic}</div><div>{nm}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid g4 mb5">
          {[
            {icon:"💰",label:"Total Earned",  val:"$285.00", delta:"↑ $142 this month", up:true,  color:"var(--green)"},
            {icon:"👥",label:"Total Referrals",val:"12",     delta:"↑ 4 this month",   up:true,  color:"var(--blue2)"},
            {icon:"✅",label:"Conversions",   val:"10",      delta:"83% conv. rate",   up:true,  color:"var(--purple)"},
            {icon:"⏳",label:"Pending Payout",val:"$71.10",  delta:"Pays Feb 28",      up:true,  color:"var(--amber)"},
          ].map(s=>(
            <div key={s.label} className="card">
              <div className="flex justify-between items-center mb3">
                <span style={{fontSize:22}}>{s.icon}</span>
                <span style={{fontSize:10,color:"var(--text3)",fontWeight:600}}>ALL TIME</span>
              </div>
              <div className="stat-val" style={{color:s.color}}>{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
              <div className={`stat-delta ${s.up?"up":""}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["overview","referrals","payouts","tiers","leaderboard"].map(t=>(
            <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab==="overview" && (
          <div className="grid g2 fade">
            <div className="card">
              <div className="card-title">📈 Referrals This Year</div>
              <div className="mini-chart">
                {BAR_DATA.map((h,i)=>(
                  <div key={i} className="mini-bar"
                    style={{height:`${(h/12)*100}%`,background:`linear-gradient(0deg,var(--green),var(--cyan))`,opacity:.7+(i/BAR_DATA.length)*.3}} />
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                {["J","F","M","A","M","J","J","A","S","O","N","D"].map(m=>(
                  <span key={m} style={{fontSize:9,color:"var(--text3)"}}>{m}</span>
                ))}
              </div>
            </div>
            <div className="withdraw-box">
              <div className="text-sm text-muted mb3">Available Balance</div>
              <div className="balance-num">$71.10</div>
              <div className="text-xs text-muted mt2 mb4">Clears Feb 28, 2025</div>
              <div className="grid" style={{gap:10}}>
                <button className="btn btn-primary w-full">Withdraw to Stripe</button>
                <button className="btn btn-ghost w-full">Withdraw to Paystack</button>
              </div>
            </div>
            <div className="card">
              <div className="card-title">🎯 Progress to Pro Tier</div>
              <div className="flex justify-between text-sm mb3">
                <span style={{color:"var(--text2)"}}>12 / 30 referrals</span>
                <span style={{color:"var(--purple)",fontWeight:700}}>18 more to go</span>
              </div>
              <div className="prog"><div className="prog-fill" style={{width:"40%",background:"linear-gradient(90deg,var(--blue),var(--purple))"}}/></div>
              <div className="text-xs text-muted mt2">Reach Pro Tier to earn 40% commission on all future referrals</div>
            </div>
            <div className="card">
              <div className="card-title">💡 Top Performing Courses</div>
              {[["Full Stack Dev","5 conversions","var(--blue2)"],["React Mastery","3 conversions","var(--green)"],["AI Integration","2 conversions","var(--purple)"]].map(([c,n,col])=>(
                <div key={c} className="flex justify-between items-center" style={{padding:"8px 0",borderBottom:"1px solid var(--line)"}}>
                  <span style={{fontSize:13,fontWeight:500}}>{c}</span>
                  <span style={{fontSize:12,color:col,fontWeight:700}}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referrals */}
        {tab==="referrals" && (
          <div className="card fade">
            <div className="flex justify-between items-center mb4">
              <div className="card-title" style={{margin:0}}>All Referrals</div>
              <input className="input" placeholder="Search referrals…" style={{width:220}} />
            </div>
            <div style={{overflowX:"auto"}}>
              <table className="tbl">
                <thead><tr><th>Referred</th><th>Course</th><th>Date</th><th>Status</th><th>Your Earnings</th></tr></thead>
                <tbody>
                  {REFERRALS.map((r,i)=>(
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap2">
                          <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,var(--blue),var(--purple))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{r.name[0]}</div>
                          <div><div style={{fontSize:13,fontWeight:600}}>{r.name}</div><div className="text-xs text-muted">{r.email}</div></div>
                        </div>
                      </td>
                      <td style={{fontSize:13}}>{r.course}</td>
                      <td className="text-xs text-muted">{r.date}</td>
                      <td><span className={`pill ${r.status==="enrolled"?"pg":r.status==="pending"?"pa":"pr"}`}>{r.status}</span></td>
                      <td style={{fontSize:13,fontWeight:700,color:r.earnings==="—"?"var(--text3)":"var(--green)"}}>{r.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payouts */}
        {tab==="payouts" && (
          <div className="grid g2 fade">
            <div className="card">
              <div className="card-title">💳 Payout Method</div>
              {[["Stripe","••••4242","Global","var(--blue2)"],["Paystack","••••7890","Africa","var(--cyan)"]].map(([n,acc,region,col])=>(
                <div key={n} className="flex justify-between items-center" style={{padding:"12px 0",borderBottom:"1px solid var(--line)"}}>
                  <div><div style={{fontSize:13,fontWeight:700}}>{n}</div><div className="text-xs text-muted">{acc} · {region}</div></div>
                  <span style={{fontSize:12,color:col,fontWeight:700}}>Active</span>
                </div>
              ))}
              <button className="btn btn-ghost w-full mt3">+ Add Payout Method</button>
            </div>
            <div className="card">
              <div className="card-title">📋 Payout History</div>
              <table className="tbl">
                <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                <tbody>
                  {PAYOUTS.map((p,i)=>(
                    <tr key={i}>
                      <td style={{fontSize:13}}>{p.date}</td>
                      <td style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>{p.amount}</td>
                      <td><span className="pill pb">{p.method}</span></td>
                      <td><span className="pill pg">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tiers */}
        {tab==="tiers" && (
          <div className="fade">
            <div className="grid g4 mb4">
              {TIERS.map(tier=>(
                <div key={tier.id} className="tier-card" style={{background:tier.bg,border:`2px solid ${tier.id==="growth"?tier.color:"transparent"}`}}>
                  {tier.id==="growth" && <div className="tier-badge" style={{background:"rgba(59,130,246,.2)",color:"var(--blue2)"}}>YOUR TIER</div>}
                  <div style={{fontSize:24,marginBottom:8}}>
                    {tier.id==="starter"?"🌱":tier.id==="growth"?"🚀":tier.id==="pro"?"⭐":"👑"}
                  </div>
                  <div style={{fontSize:15,fontWeight:800,color:tier.color,marginBottom:4}}>{tier.label}</div>
                  <div style={{fontSize:28,fontWeight:800,color:"var(--text)",marginBottom:2}}>{tier.pct}%</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>commission</div>
                  <div style={{fontSize:11,color:"var(--text3)",marginTop:8}}>{tier.refs}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-title">📘 How Commissions Work</div>
              <div style={{fontSize:13.5,color:"var(--text2)",lineHeight:1.75}}>
                <p style={{marginBottom:10}}>You earn a percentage of every sale made through your referral link. Commissions are calculated on the <strong style={{color:"var(--text)"}}>net sale price</strong> after payment processor fees.</p>
                <p style={{marginBottom:10}}>Example: A student enrolls in the Full Stack Dev course at <strong style={{color:"var(--green)"}}>$79</strong>. At Growth tier (35%), you earn <strong style={{color:"var(--green)"}}>$27.65</strong>.</p>
                <p>Payouts are processed on the <strong style={{color:"var(--text)"}}>last day of each month</strong> for all earnings above $50. Below $50, earnings roll over to the next month.</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {tab==="leaderboard" && (
          <div className="card fade">
            <div className="card-title">🏆 Monthly Leaderboard — March 2025</div>
            {LEADERBOARD.map((u,i)=>(
              <div key={i} className="lb-row" style={u.isMe?{background:"rgba(16,185,129,.05)",borderRadius:10,padding:"10px 10px",margin:"4px -10px"}:{}}>
                <div className="lb-rank" style={{
                  background: i===0?"linear-gradient(135deg,#ffd700,#ffaa00)":i===1?"linear-gradient(135deg,#c0c0c0,#e8e8e8)":i===2?"linear-gradient(135deg,#cd7f32,#e09850)":"var(--bg4)",
                  color: i<3?"#000":"var(--text3)"
                }}>
                  {i<3?["🥇","🥈","🥉"][i]:u.rank}
                </div>
                <div className="lb-av" style={u.isMe?{background:"linear-gradient(135deg,var(--green),var(--cyan))"}:{}}>{u.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:u.isMe?700:500}}>{u.name} {u.isMe&&<span style={{fontSize:11,color:"var(--green)"}}>← You</span>}</div>
                  <div className="text-xs text-muted">{u.refs} referrals</div>
                </div>
                <div style={{fontSize:15,fontWeight:800,color: i===0?"var(--amber)":"var(--green)"}}>{u.earnings}</div>
              </div>
            ))}
            <div className="text-xs text-muted mt3" style={{textAlign:"center"}}>Leaderboard resets monthly. Top 3 earn bonus payouts.</div>
          </div>
        )}
      </div>
    </>
  );
}

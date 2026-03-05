import { useState, useRef, useEffect } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0a0f1e;--s1:#111827;--s2:#1a2235;--s3:#243047;
  --blue:#3b82f6;--blue2:#60a5fa;--indigo:#6366f1;
  --green:#10b981;--amber:#f59e0b;--red:#ef4444;--cyan:#22d3ee;--purple:#a855f7;
  --text:#f0f4ff;--text2:#94a3b8;--text3:#475569;
  --line:rgba(255,255,255,0.08);
}
body{font-family:'Nunito',sans-serif;background:#1a1a2e;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}
/* Phone frame */
.phone-outer{
  width:390px;height:844px;border-radius:50px;
  background:linear-gradient(160deg,#2a2a4a,#1a1a2e);
  padding:3px;
  box-shadow:0 40px 100px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.08),inset 0 0 0 1px rgba(255,255,255,.04);
  position:relative;flex-shrink:0;
}
.phone-inner{
  width:100%;height:100%;border-radius:48px;overflow:hidden;
  background:var(--bg);position:relative;display:flex;flex-direction:column;
}
/* Notch */
.notch{
  position:absolute;top:0;left:50%;transform:translateX(-50%);
  width:126px;height:37px;background:#0a0f1e;border-radius:0 0 24px 24px;
  z-index:100;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;gap:6px;
}
.notch-cam{width:14px;height:14px;border-radius:50%;background:#1a1a2e;border:3px solid #2a2a4a;}
.notch-sensor{width:6px;height:6px;border-radius:50%;background:#1a1a2e;}
/* Status bar */
.status{height:54px;padding:12px 28px 0;display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0;}
.status-time{font-size:15px;font-weight:700;color:var(--text);}
.status-icons{display:flex;gap:6px;align-items:center;font-size:12px;color:var(--text2);}
/* Screen */
.screen{flex:1;overflow:hidden;position:relative;}
.screen-content{height:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;}
.screen-content::-webkit-scrollbar{display:none;}
/* Bottom nav */
.bottom-nav{
  height:84px;background:rgba(17,24,39,.97);
  border-top:1px solid var(--line);padding:8px 12px 20px;
  display:flex;justify-content:space-around;align-items:center;flex-shrink:0;
}
.nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:6px 14px;border-radius:16px;border:none;background:none;transition:all .2s;}
.nav-btn.active{background:rgba(59,130,246,.12);}
.nav-icon{font-size:22px;line-height:1;}
.nav-label{font-size:10px;font-weight:700;color:var(--text3);font-family:'Nunito',sans-serif;}
.nav-btn.active .nav-label{color:var(--blue2);}
/* Cards */
.card{background:var(--s1);border-radius:20px;padding:18px;border:1px solid var(--line);}
.card-sm{padding:14px;border-radius:16px;}
/* Gradient card */
.grad-card{border-radius:20px;padding:20px;position:relative;overflow:hidden;}
.grad-card::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,.1);pointer-events:none;}
/* Progress */
.prog{height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;}
.prog-fill{height:100%;border-radius:3px;}
/* Avatar */
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0;}
/* Tags */
.tag{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;}
/* Streak badge */
.streak{background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:14px;padding:10px 14px;display:flex;align-items:center;gap:10px;}
/* Course row */
.course-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);}
.course-row:last-child{border-bottom:none;}
.course-thumb{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;}
/* Lesson item */
.lesson-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:14px;margin-bottom:6px;background:var(--s2);}
.lesson-check{width:28px;height:28px;border-radius:50%;border:2px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
/* Chat bubble */
.bubble{padding:11px 14px;border-radius:16px;max-width:76%;font-size:13px;line-height:1.5;margin-bottom:8px;}
.bubble-ai{background:var(--s2);border:1px solid var(--line);border-bottom-left-radius:4px;align-self:flex-start;}
.bubble-user{background:linear-gradient(135deg,var(--blue),var(--indigo));color:white;border-bottom-right-radius:4px;align-self:flex-end;margin-left:auto;}
/* Input bar */
.input-bar{display:flex;gap:10px;padding:12px 16px;background:var(--s1);border-top:1px solid var(--line);}
.chat-input{flex:1;background:var(--s2);border:1px solid var(--line);border-radius:22px;padding:9px 16px;color:var(--text);font-size:13px;font-family:'Nunito',sans-serif;outline:none;}
.send-btn{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--indigo));border:none;color:white;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
/* Section header */
.sh{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.sh-title{font-size:16px;font-weight:800;}
.sh-more{font-size:12px;font-weight:700;color:var(--blue2);}
/* padding */
.p16{padding:16px;}
.p20{padding:20px;}
.gap2{gap:8px;} .gap3{gap:12px;}
.flex{display:flex;} .items-center{align-items:center;} .justify-between{justify-content:space-between;}
.mb2{margin-bottom:8px;} .mb3{margin-bottom:14px;} .mb4{margin-bottom:20px;}
.text-sm{font-size:13px;} .text-xs{font-size:11px;} .text-muted{color:var(--text3);}
.font-bold{font-weight:800;}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
.fade{animation:fadeIn .25s ease;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.pulse{animation:pulse 1.5s infinite;}
/* scrollable horizontal */
.hscroll{display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;}
.hscroll::-webkit-scrollbar{display:none;}
/* achievement */
.ach{width:64px;text-align:center;flex-shrink:0;}
.ach-icon{width:56px;height:56px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 4px;border:2px solid rgba(255,255,255,.1);}
.ach-label{font-size:9px;color:var(--text3);font-weight:700;line-height:1.2;text-align:center;}
/* Cert mini */
.cert-mini{background:linear-gradient(135deg,#1a1200,#2a1e00);border:1px solid rgba(201,168,76,.3);border-radius:16px;padding:16px;text-align:center;}
`;

const SCREENS = [
  { id:"home",    icon:"🏠", label:"Home" },
  { id:"courses", icon:"📚", label:"Learn" },
  { id:"player",  icon:"▶️",  label:"Player" },
  { id:"ai",      icon:"🤖", label:"AI Tutor" },
  { id:"profile", icon:"👤", label:"Profile" },
];

const COURSE_LIST = [
  { emoji:"⚛️", title:"React Mastery",      tag:"Frontend", progress:68, color:"#1e3a5f", lessons:42 },
  { emoji:"🟢", title:"Node.js & Express",  tag:"Backend",  progress:45, color:"#1a3a2e", lessons:38 },
  { emoji:"🤖", title:"AI with Claude",     tag:"AI/ML",    progress:12, color:"#1f2d3f", lessons:35 },
  { emoji:"🗄️", title:"PostgreSQL",         tag:"Database", progress:0,  color:"#2d1f3f", lessons:24 },
];

const LESSONS = [
  { title:"React Hooks Deep Dive",   dur:"22:00", done:true },
  { title:"useContext & useReducer",  dur:"18:30", done:true },
  { title:"Custom Hooks Patterns",   dur:"19:45", done:false, current:true },
  { title:"Performance Optimization",dur:"24:10", done:false },
  { title:"Testing React Components",dur:"28:00", done:false },
];

const CHAT_INIT = [
  { role:"ai",   text:"Hey Amara! 👋 I'm your AI tutor. What are you working on today?" },
  { role:"user", text:"Can you explain useCallback vs useMemo?" },
  { role:"ai",   text:"Great question! Both memoize values, but:\n\n• useMemo caches a computed value\n• useCallback caches a function reference\n\nUse useMemo for expensive computations, useCallback to stabilize functions passed as props." },
];

// ── Screens ──────────────────────────────────────────────

function HomeScreen() {
  return (
    <div className="screen-content p16 fade">
      {/* Greeting */}
      <div className="flex justify-between items-center mb4">
        <div>
          <div style={{fontSize:13,color:"var(--text3)",fontWeight:600}}>Good morning 🌅</div>
          <div style={{fontSize:20,fontWeight:900}}>Amara Osei</div>
        </div>
        <div className="av" style={{width:42,height:42,background:"linear-gradient(135deg,var(--blue),var(--indigo))",fontSize:16}}>A</div>
      </div>

      {/* Streak */}
      <div className="streak mb4">
        <span style={{fontSize:28}}>🔥</span>
        <div>
          <div style={{fontSize:17,fontWeight:900,color:"white"}}>14-Day Streak!</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>Keep it up — next milestone: 30 days</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap3 mb4">
        {[["📚","4","Courses"],["✅","87","Lessons"],["⭐","88%","Avg Score"]].map(([ic,v,l])=>(
          <div key={l} className="card card-sm" style={{flex:1,textAlign:"center",padding:"12px 8px"}}>
            <div style={{fontSize:18}}>{ic}</div>
            <div style={{fontSize:18,fontWeight:900,marginTop:2}}>{v}</div>
            <div style={{fontSize:9,color:"var(--text3)",fontWeight:700}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Continue learning */}
      <div className="sh"><div className="sh-title">Continue Learning</div><div className="sh-more">See all</div></div>
      <div className="grad-card mb4" style={{background:"linear-gradient(135deg,#1e3a5f,#0d2137)"}}>
        <div className="flex items-center gap3 mb3">
          <div style={{fontSize:36}}>⚛️</div>
          <div>
            <div style={{fontSize:15,fontWeight:800}}>React Mastery</div>
            <div style={{fontSize:11,color:"var(--text2)"}}>Custom Hooks Patterns</div>
          </div>
        </div>
        <div className="flex justify-between text-xs mb2" style={{color:"var(--text3)"}}>
          <span>Progress</span><span style={{color:"var(--blue2)",fontWeight:700}}>68%</span>
        </div>
        <div className="prog mb3"><div className="prog-fill" style={{width:"68%",background:"linear-gradient(90deg,var(--blue),var(--cyan))"}}/></div>
        <button style={{width:"100%",padding:"11px",borderRadius:14,background:"linear-gradient(135deg,var(--blue),var(--indigo))",border:"none",color:"white",fontSize:13,fontWeight:800,fontFamily:"'Nunito',sans-serif",cursor:"pointer"}}>
          ▶ Continue Lesson
        </button>
      </div>

      {/* Achievements */}
      <div className="sh"><div className="sh-title">Achievements</div><div className="sh-more">View all</div></div>
      <div className="hscroll mb4">
        {[["🏆","First Course"],["🔥","14 Day Streak"],["💡","AI Explorer"],["⚡","Speed Learner"],["🎯","Perfect Score"],["🌍","Global Learner"]].map(([ic,lb],i)=>(
          <div key={lb} className="ach">
            <div className="ach-icon" style={{background:i<3?"rgba(245,158,11,.15)":"var(--s2)",borderColor:i<3?"var(--amber)":"rgba(255,255,255,.08)"}}>{ic}</div>
            <div className="ach-label">{lb}</div>
          </div>
        ))}
      </div>

      {/* Certificate */}
      <div className="cert-mini">
        <div style={{fontSize:24,marginBottom:6}}>🎓</div>
        <div style={{fontSize:13,fontWeight:800,color:"#c9a84c"}}>TypeScript Certificate</div>
        <div style={{fontSize:11,color:"rgba(201,168,76,.6)",marginTop:2}}>Earned Jan 2025</div>
        <button style={{marginTop:10,padding:"7px 20px",borderRadius:20,background:"rgba(201,168,76,.15)",border:"1px solid rgba(201,168,76,.3)",color:"#c9a84c",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
          View Certificate
        </button>
      </div>
    </div>
  );
}

function CoursesScreen() {
  return (
    <div className="screen-content p16 fade">
      <div className="sh"><div className="sh-title">My Courses</div><div className="sh-more">+ Enroll</div></div>

      {/* Filter chips */}
      <div className="hscroll mb4" style={{paddingBottom:8}}>
        {["All","In Progress","Completed","Bookmarked"].map((f,i)=>(
          <div key={f} style={{padding:"7px 16px",borderRadius:20,background:i===0?"var(--blue)":"var(--s2)",color:i===0?"white":"var(--text3)",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,border:`1px solid ${i===0?"var(--blue)":"var(--line)"}`}}>{f}</div>
        ))}
      </div>

      {COURSE_LIST.map((c,i)=>(
        <div key={i} className="card mb3" style={{padding:"14px 16px"}}>
          <div className="flex items-center gap3">
            <div style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${c.color},var(--bg))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{c.emoji}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:800,marginBottom:3}}>{c.title}</div>
              <div className="flex items-center gap2 mb2">
                <span className="tag" style={{background:"rgba(59,130,246,.15)",color:"var(--blue2)"}}>{c.tag}</span>
                <span style={{fontSize:11,color:"var(--text3)"}}>{c.lessons} lessons</span>
              </div>
              {c.progress > 0 ? (
                <>
                  <div className="prog"><div className="prog-fill" style={{width:`${c.progress}%`,background:"linear-gradient(90deg,var(--blue),var(--cyan))"}}/></div>
                  <div style={{fontSize:10,color:"var(--text3)",marginTop:3}}>{c.progress}% complete</div>
                </>
              ) : (
                <div style={{fontSize:11,color:"var(--text3)"}}>Not started</div>
              )}
            </div>
            <div style={{fontSize:20,color:"var(--text3)"}}>›</div>
          </div>
        </div>
      ))}

      {/* Recommended */}
      <div className="sh mt2"><div className="sh-title">Recommended</div></div>
      <div className="hscroll">
        {[["☁️","AWS DevOps","$89"],["🔷","TypeScript","$49"],["🌐","GraphQL APIs","$69"]].map(([ic,t,p])=>(
          <div key={t} style={{width:140,background:"var(--s1)",borderRadius:18,overflow:"hidden",flexShrink:0,border:"1px solid var(--line)"}}>
            <div style={{height:80,background:"linear-gradient(135deg,var(--s2),var(--s3))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{ic}</div>
            <div style={{padding:"10px 12px"}}>
              <div style={{fontSize:12,fontWeight:800,marginBottom:2}}>{t}</div>
              <div style={{fontSize:13,fontWeight:900,color:"var(--cyan)"}}>{p}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerScreen() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [completed, setCompleted] = useState(new Set([0,1]));
  const iRef = useRef();

  const toggle = () => {
    setPlaying(p => {
      if (!p) iRef.current = setInterval(()=>setProgress(v=>{if(v>=100){clearInterval(iRef.current);return 100;}return v+0.4;}),100);
      else clearInterval(iRef.current);
      return !p;
    });
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  return (
    <div className="screen-content fade" style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Video */}
      <div style={{background:"#000",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0,cursor:"pointer"}} onClick={toggle}>
        <div style={{background:"linear-gradient(135deg,#0d1420,#111827)",inset:0,position:"absolute",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
          <div style={{fontSize:48}}>⚛️</div>
          <div style={{fontSize:12,color:"var(--text2)"}}>Custom Hooks Patterns</div>
        </div>
        <div style={{position:"relative",zIndex:2}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",border:"2px solid rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
            {playing?"⏸":"▶️"}
          </div>
        </div>
        {playing && <div className="pulse" style={{position:"absolute",top:10,right:10,fontSize:10,color:"var(--red)",fontWeight:700,background:"rgba(239,68,68,.2)",padding:"2px 8px",borderRadius:10}}>● LIVE</div>}
      </div>

      {/* Controls */}
      <div style={{padding:"10px 16px",background:"var(--s1)",borderBottom:"1px solid var(--line)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1,height:4,borderRadius:2,background:"var(--s3)",cursor:"pointer",position:"relative"}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(((e.clientX-r.left)/r.width)*100);}}>
            <div style={{width:`${progress}%`,height:"100%",borderRadius:2,background:"linear-gradient(90deg,var(--blue),var(--cyan))"}}/>
            <div style={{width:12,height:12,borderRadius:"50%",background:"white",position:"absolute",top:-4,left:`${progress}%`,transform:"translateX(-50%)",pointerEvents:"none"}}/>
          </div>
          <span style={{fontSize:11,color:"var(--text3)",fontFamily:"JetBrains Mono",whiteSpace:"nowrap"}}>{Math.round(progress*19.45/100)}m / 19:45</span>
        </div>
      </div>

      {/* Lesson title */}
      <div style={{padding:"14px 16px",borderBottom:"1px solid var(--line)",flexShrink:0}}>
        <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>Custom Hooks Patterns</div>
        <div style={{fontSize:11,color:"var(--text3)"}}>Section 3 • React Mastery • Lesson 12 of 42</div>
      </div>

      {/* Lesson list */}
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"var(--text2)"}}>Up Next</div>
        {LESSONS.map((l,i)=>(
          <div key={i} className="lesson-item" style={l.current?{background:"rgba(59,130,246,.1)",border:"1px solid rgba(59,130,246,.2)"}:{}}>
            <div className="lesson-check" style={l.done?{background:"var(--green)",borderColor:"var(--green)",color:"white"}:l.current?{background:"var(--blue)",borderColor:"var(--blue)",color:"white"}:{}}>
              {l.done?"✓":l.current?"▶":i+1}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12.5,fontWeight:l.current?800:600,color:l.current?"var(--text)":"var(--text2)"}} className="truncate">{l.title}</div>
            </div>
            <div style={{fontSize:10,color:"var(--text3)",fontFamily:"JetBrains Mono",flexShrink:0}}>{l.dur}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIScreen() {
  const [messages, setMessages] = useState(CHAT_INIT);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const send = async () => {
    const q = input.trim(); if(!q) return;
    setInput(""); setLoading(true);
    setMessages(m=>[...m,{role:"user",text:q}]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,
          system:"You are a concise mobile AI tutor for full stack development. Keep answers under 80 words. Use bullet points when listing. Be friendly and encouraging.",
          messages:[...messages,{role:"user",content:q}].map(m=>({role:m.role==="ai"?"assistant":"user",content:m.text}))
        })
      });
      const data = await res.json();
      setMessages(m=>[...m,{role:"ai",text:data.content?.[0]?.text||"Let me think about that…"}]);
    } catch {
      setMessages(m=>[...m,{role:"ai",text:"Great question! In full stack dev, understanding this concept deeply will help you build better apps. Try experimenting with a small code example!"}]);
    }
    setLoading(false);
  };

  return (
    <div className="screen-content fade" style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"14px 16px",borderBottom:"1px solid var(--line)",background:"var(--s1)",flexShrink:0}}>
        <div className="flex items-center gap3">
          <div className="av" style={{width:36,height:36,background:"linear-gradient(135deg,var(--blue),var(--indigo))",fontSize:14}}>AI</div>
          <div>
            <div style={{fontSize:14,fontWeight:800}}>AI Tutor</div>
            <div style={{fontSize:10,color:"var(--green)",display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>
              Online · Claude
            </div>
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div style={{padding:"10px 14px",borderBottom:"1px solid var(--line)",background:"var(--bg)",flexShrink:0}}>
        <div className="hscroll" style={{gap:8}}>
          {["Explain closures","When to use Redux?","Best practices","Async patterns"].map(s=>(
            <div key={s} onClick={()=>{setInput(s);}} style={{padding:"5px 13px",borderRadius:20,background:"var(--s2)",border:"1px solid var(--line)",fontSize:11,fontWeight:700,color:"var(--text2)",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>{s}</div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column"}}>
        {messages.map((m,i)=>(
          <div key={i} className={`bubble ${m.role==="ai"?"bubble-ai":"bubble-user"}`} style={{whiteSpace:"pre-line"}}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="bubble bubble-ai">
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {[0,200,400].map(d=>(
                <div key={d} style={{width:6,height:6,borderRadius:"50%",background:"var(--blue2)",animation:"pulse 1.2s infinite",animationDelay:`${d}ms`}}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div className="input-bar">
        <input className="chat-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything…"/>
        <button className="send-btn" onClick={send}>➤</button>
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="screen-content p16 fade">
      {/* Profile hero */}
      <div style={{textAlign:"center",marginBottom:24}}>
        <div className="av" style={{width:72,height:72,background:"linear-gradient(135deg,var(--blue),var(--indigo))",fontSize:28,margin:"0 auto 12px"}}>A</div>
        <div style={{fontSize:20,fontWeight:900}}>Amara Osei</div>
        <div style={{fontSize:13,color:"var(--text3)"}}>amara@example.com</div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
          <span className="tag" style={{background:"rgba(245,158,11,.15)",color:"var(--amber)",fontSize:11}}>🏆 Growth Tier</span>
          <span className="tag" style={{background:"rgba(59,130,246,.15)",color:"var(--blue2)",fontSize:11}}>⚡ Pro Plan</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap3 mb4">
        {[["87","Lessons"],["4","Courses"],["1","Cert"],["14🔥","Days"]].map(([v,l])=>(
          <div key={l} className="card" style={{flex:1,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:17,fontWeight:900}}>{v}</div>
            <div style={{fontSize:9,color:"var(--text3)",fontWeight:700}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Settings rows */}
      <div className="card mb3">
        {[["🎯","Learning Goal","5 lessons/week"],["🔔","Notifications","On"],["🌍","Language","English"],["📱","Downloads","Wi-Fi only"]].map(([ic,k,v])=>(
          <div key={k} className="flex justify-between items-center" style={{padding:"12px 0",borderBottom:"1px solid var(--line)"}}>
            <div className="flex items-center gap3">
              <span style={{fontSize:18}}>{ic}</span>
              <span style={{fontSize:13,fontWeight:600}}>{k}</span>
            </div>
            <div className="flex items-center gap2">
              <span style={{fontSize:12,color:"var(--text3)"}}>{v}</span>
              <span style={{color:"var(--text3)"}}>›</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb3">
        {[["💸","Affiliate Program","35% commission"],["🎓","My Certificates","1 earned"],["💳","Subscription","Pro · $29/mo"]].map(([ic,k,v])=>(
          <div key={k} className="flex justify-between items-center" style={{padding:"12px 0",borderBottom:"1px solid var(--line)"}}>
            <div className="flex items-center gap3">
              <span style={{fontSize:18}}>{ic}</span>
              <span style={{fontSize:13,fontWeight:600}}>{k}</span>
            </div>
            <div className="flex items-center gap2">
              <span style={{fontSize:12,color:"var(--text3)"}}>{v}</span>
              <span style={{color:"var(--text3)"}}>›</span>
            </div>
          </div>
        ))}
      </div>

      <button style={{width:"100%",padding:"13px",borderRadius:16,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",color:"var(--red)",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
        Sign Out
      </button>
    </div>
  );
}

/* ── Root ─── */
export default function App() {
  const [screen, setScreen] = useState("home");

  const renderScreen = () => {
    if(screen==="home")    return <HomeScreen/>;
    if(screen==="courses") return <CoursesScreen/>;
    if(screen==="player")  return <PlayerScreen/>;
    if(screen==="ai")      return <AIScreen/>;
    if(screen==="profile") return <ProfileScreen/>;
  };

  return (
    <>
      <style>{S}</style>
      <div className="phone-outer">
        <div className="phone-inner">
          <div className="notch">
            <div className="notch-sensor"/>
            <div className="notch-cam"/>
          </div>
          <div className="status">
            <div className="status-time">9:41</div>
            <div className="status-icons">
              <span>●●●●</span><span>WiFi</span><span>🔋</span>
            </div>
          </div>
          <div className="screen">
            {renderScreen()}
          </div>
          <div className="bottom-nav">
            {SCREENS.map(s=>(
              <button key={s.id} className={`nav-btn ${screen===s.id?"active":""}`} onClick={()=>setScreen(s.id)}>
                <div className="nav-icon">{s.icon}</div>
                <div className="nav-label">{s.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:      #080c14;
  --bg2:     #0d1420;
  --bg3:     #111827;
  --bg4:     #1a2235;
  --line:    rgba(255,255,255,0.07);
  --line2:   rgba(255,255,255,0.12);
  --blue:    #3b82f6;
  --blue2:   #60a5fa;
  --indigo:  #6366f1;
  --cyan:    #22d3ee;
  --green:   #10b981;
  --amber:   #f59e0b;
  --red:     #ef4444;
  --purple:  #a855f7;
  --text:    #f1f5f9;
  --text2:   #94a3b8;
  --text3:   #475569;
  --card:    rgba(17,24,39,0.95);
  --radius:  12px;
}

body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

/* scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 3px; }

/* layout */
.shell { display: flex; min-height: 100vh; }
.sidebar {
  width: 220px; background: var(--bg2); border-right: 1px solid var(--line);
  display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; flex-shrink: 0;
}
.sidebar-logo {
  padding: 20px 18px 16px; border-bottom: 1px solid var(--line);
  display: flex; align-items: center; gap: 10px;
}
.logo-mark {
  width: 34px; height: 34px; border-radius: 9px;
  background: linear-gradient(135deg, var(--blue), var(--indigo));
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 15px; color: white; flex-shrink: 0;
}
.logo-text { font-size: 16px; font-weight: 800; }
.logo-text span { color: var(--cyan); }
.nav-section { padding: 16px 10px 0; }
.nav-label { font-size: 10px; font-weight: 700; color: var(--text3); letter-spacing: .1em; text-transform: uppercase; padding: 0 8px; margin-bottom: 4px; }
.nav-item {
  display: flex; align-items: center; gap: 9px; padding: 8px 10px;
  border-radius: 8px; cursor: pointer; font-size: 13.5px; font-weight: 500;
  color: var(--text2); transition: all .15s; border: none; background: none;
  width: 100%; text-align: left; margin-bottom: 1px;
}
.nav-item:hover { background: rgba(255,255,255,.04); color: var(--text); }
.nav-item.active { background: rgba(59,130,246,.15); color: var(--blue2); }
.nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }
.nav-badge { margin-left: auto; background: var(--red); color: white; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }

.main { flex: 1; overflow-x: hidden; }

/* topbar */
.topbar {
  position: sticky; top: 0; z-index: 50;
  height: 56px; padding: 0 28px;
  background: rgba(8,12,20,.92); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
  display: flex; align-items: center; justify-content: space-between;
}
.topbar-title { font-size: 16px; font-weight: 700; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,var(--blue),var(--indigo)); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: white; cursor: pointer; }
.btn { padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'Plus Jakarta Sans',sans-serif; transition: all .2s; }
.btn-primary { background: var(--blue); color: white; }
.btn-primary:hover { background: var(--blue2); transform: translateY(-1px); }
.btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--line2); }
.btn-ghost:hover { color: var(--text); border-color: var(--text3); }
.btn-danger { background: rgba(239,68,68,.15); color: var(--red); border: 1px solid rgba(239,68,68,.2); }
.btn-sm { padding: 5px 12px; font-size: 12px; }

/* page content */
.page { padding: 28px; max-width: 1400px; }
.page-header { margin-bottom: 28px; }
.page-title { font-size: 22px; font-weight: 800; }
.page-sub { font-size: 13px; color: var(--text3); margin-top: 4px; }

/* cards */
.card { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 20px; }
.card-sm { padding: 16px; }
.grid { display: grid; gap: 16px; }
.g2 { grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); }
.g3 { grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); }
.g4 { grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); }

/* stat card */
.stat { display: flex; flex-direction: column; gap: 10px; }
.stat-top { display: flex; justify-content: space-between; align-items: flex-start; }
.stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.stat-delta { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
.up { background: rgba(16,185,129,.15); color: var(--green); }
.dn { background: rgba(239,68,68,.15); color: var(--red); }
.stat-val { font-size: 26px; font-weight: 800; line-height: 1; }
.stat-lbl { font-size: 12px; color: var(--text3); }

/* table */
.tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.tbl th { text-align: left; padding: 10px 14px; color: var(--text3); font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border-bottom: 1px solid var(--line); white-space: nowrap; }
.tbl td { padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; }
.tbl tr:last-child td { border-bottom: none; }
.tbl tr:hover td { background: rgba(255,255,255,.02); }
.pill { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.pill-green  { background: rgba(16,185,129,.15); color: var(--green); }
.pill-amber  { background: rgba(245,158,11,.15); color: var(--amber); }
.pill-red    { background: rgba(239,68,68,.15); color: var(--red); }
.pill-blue   { background: rgba(59,130,246,.15); color: var(--blue2); }
.pill-purple { background: rgba(168,85,247,.15); color: var(--purple); }
.pill-cyan   { background: rgba(34,211,238,.15); color: var(--cyan); }

/* progress */
.prog-bar { height: 5px; background: var(--bg4); border-radius: 3px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--blue), var(--cyan)); transition: width .8s ease; }

/* chart bars */
.chart-bars { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
.chart-bar { flex: 1; border-radius: 4px 4px 0 0; background: linear-gradient(0deg, var(--blue), var(--indigo)); opacity: .7; transition: opacity .2s; min-width: 0; }
.chart-bar:hover { opacity: 1; }

/* divider */
.divider { height: 1px; background: var(--line); margin: 16px 0; }

/* form */
.field { margin-bottom: 16px; }
.label { display: block; font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
.input, .select, .textarea {
  width: 100%; background: var(--bg4); border: 1px solid var(--line2);
  border-radius: 9px; padding: 10px 13px; color: var(--text);
  font-size: 13.5px; font-family: 'Plus Jakarta Sans',sans-serif;
  outline: none; transition: border-color .2s;
}
.input:focus, .select:focus, .textarea:focus { border-color: var(--blue); }
.select option { background: var(--bg3); }
.textarea { resize: vertical; min-height: 80px; }
.input-icon { position: relative; }
.input-icon .input { padding-left: 38px; }
.input-icon .ic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--text3); }

/* toggle */
.toggle { width: 36px; height: 20px; border-radius: 10px; border: none; cursor: pointer; position: relative; transition: background .2s; flex-shrink: 0; }
.toggle.on { background: var(--green); }
.toggle.off { background: var(--bg4); }
.toggle::after { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: white; top: 3px; transition: left .2s; }
.toggle.on::after { left: 19px; }
.toggle.off::after { left: 3px; }

/* modal backdrop */
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--bg3); border: 1px solid var(--line2); border-radius: 16px; padding: 28px; width: 100%; max-width: 520px; }
.modal-title { font-size: 17px; font-weight: 800; margin-bottom: 20px; }

/* ── COURSE PLAYER ─────────────────────────────────────── */
.player-shell { display: flex; height: calc(100vh - 56px); }
.player-main { flex: 1; overflow-y: auto; background: var(--bg); }
.video-wrap { position: relative; background: #000; width: 100%; }
.video-wrap video { width: 100%; display: block; max-height: 65vh; object-fit: contain; }
.video-overlay {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.6));
  opacity: 0; transition: opacity .2s; cursor: pointer;
}
.video-wrap:hover .video-overlay { opacity: 1; }
.play-btn {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(255,255,255,.15); backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; cursor: pointer; transition: all .2s;
}
.play-btn:hover { background: rgba(59,130,246,.4); border-color: var(--blue2); transform: scale(1.1); }
.video-controls {
  background: var(--bg2); padding: 10px 16px;
  display: flex; align-items: center; gap: 12px;
}
.ctl-btn { background: none; border: none; color: var(--text2); cursor: pointer; font-size: 18px; padding: 4px; transition: color .2s; }
.ctl-btn:hover { color: var(--text); }
.seek-bar { flex: 1; height: 4px; border-radius: 2px; background: var(--bg4); cursor: pointer; position: relative; }
.seek-fill { height: 100%; border-radius: 2px; background: var(--blue); pointer-events: none; }
.seek-thumb { width: 12px; height: 12px; border-radius: 50%; background: white; position: absolute; top: -4px; transform: translateX(-50%); pointer-events: none; }
.time-label { font-size: 12px; color: var(--text3); font-family: 'JetBrains Mono',monospace; white-space: nowrap; }
.lesson-info { padding: 20px 24px; border-bottom: 1px solid var(--line); }
.lesson-title-lg { font-size: 18px; font-weight: 800; margin-bottom: 6px; }
.lesson-meta { font-size: 13px; color: var(--text3); display: flex; align-items: center; gap: 14px; }
.tabs-row { display: flex; gap: 2px; padding: 0 24px; border-bottom: 1px solid var(--line); }
.tab { padding: 12px 16px; font-size: 13px; font-weight: 600; color: var(--text3); cursor: pointer; border-bottom: 2px solid transparent; background: none; border-left: none; border-right: none; border-top: none; font-family: inherit; transition: all .2s; }
.tab.active { color: var(--blue2); border-bottom-color: var(--blue2); }
.tab-body { padding: 20px 24px; font-size: 14px; line-height: 1.75; color: var(--text2); }
.player-sidebar {
  width: 320px; background: var(--bg2); border-left: 1px solid var(--line);
  overflow-y: auto; flex-shrink: 0;
}
.ps-header { padding: 16px 16px 12px; border-bottom: 1px solid var(--line); }
.ps-title { font-size: 14px; font-weight: 700; }
.ps-prog { margin-top: 8px; }
.ps-prog-lbl { font-size: 11px; color: var(--text3); display: flex; justify-content: space-between; margin-bottom: 4px; }
.section-head { padding: 10px 14px 6px; font-size: 11px; font-weight: 700; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; background: var(--bg3); border-bottom: 1px solid var(--line); }
.lesson-row {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  cursor: pointer; border-bottom: 1px solid var(--line); transition: background .15s;
}
.lesson-row:hover { background: rgba(255,255,255,.03); }
.lesson-row.active-lesson { background: rgba(59,130,246,.1); }
.lesson-num { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--line2); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--text3); flex-shrink: 0; }
.lesson-num.done { background: var(--green); border-color: var(--green); color: white; font-size: 12px; }
.lesson-num.current { background: var(--blue); border-color: var(--blue); color: white; }
.lesson-row-title { font-size: 13px; font-weight: 500; flex: 1; }
.lesson-dur { font-size: 11px; color: var(--text3); font-family: 'JetBrains Mono',monospace; }

/* ── VIDEO UPLOAD ──────────────────────────────────────── */
.drop-zone {
  border: 2px dashed var(--line2); border-radius: 14px;
  padding: 48px 24px; text-align: center; cursor: pointer;
  transition: all .2s; background: var(--bg3);
}
.drop-zone:hover, .drop-zone.drag-over { border-color: var(--blue); background: rgba(59,130,246,.05); }
.drop-icon { font-size: 48px; margin-bottom: 12px; }
.drop-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
.drop-sub { font-size: 13px; color: var(--text3); }
.upload-queue { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
.upload-item { background: var(--bg3); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; }
.upload-item-top { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.file-icon { font-size: 24px; flex-shrink: 0; }
.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-size { font-size: 11px; color: var(--text3); margin-top: 2px; }
.upload-status { font-size: 11px; font-weight: 700; }
.status-uploading { color: var(--blue2); }
.status-done { color: var(--green); }
.status-error { color: var(--red); }
.status-waiting { color: var(--text3); }

/* misc */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 20px; }
.mb-5 { margin-bottom: 28px; }
.text-sm { font-size: 13px; }
.text-xs { font-size: 11px; }
.text-muted { color: var(--text3); }
.font-bold { font-weight: 700; }
.truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.w-full { width: 100%; }
.rounded { border-radius: 8px; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }

@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
.fade-in { animation: fadeIn .3s ease; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
.pulse { animation: pulse 1.5s infinite; }
`;

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const STATS = [
  { icon:"👥", label:"Total Students", value:"12,847", delta:"+8.2%", up:true,  bg:"rgba(59,130,246,.15)" },
  { icon:"📚", label:"Active Courses",  value:"47",      delta:"+3",    up:true,  bg:"rgba(99,102,241,.15)" },
  { icon:"💰", label:"Monthly Revenue", value:"$28,491", delta:"+14%",  up:true,  bg:"rgba(16,185,129,.15)" },
  { icon:"⭐", label:"Avg. Rating",     value:"4.87",    delta:"-0.02", up:false, bg:"rgba(245,158,11,.15)" },
];

const REVENUE_BARS = [42,58,35,71,63,88,52,76,91,68,84,100];
const REVENUE_MONTHS = ["J","F","M","A","M","J","J","A","S","O","N","D"];

const RECENT_ENROLLMENTS = [
  { name:"Amara Osei",       email:"amara@example.com",  course:"Full Stack Dev",   plan:"Pro",    amount:"$79",  date:"2m ago",  status:"success" },
  { name:"Yemi Adeyemi",     email:"yemi@example.com",   course:"AI Integration",   plan:"Free",   amount:"$0",   date:"14m ago", status:"free" },
  { name:"Kofi Mensah",      email:"kofi@example.com",   course:"Node.js & Express",plan:"Pro",    amount:"$69",  date:"1h ago",  status:"success" },
  { name:"Fatima Al-Rashid", email:"fatima@example.com", course:"React Mastery",    plan:"Pro",    amount:"$79",  date:"2h ago",  status:"success" },
  { name:"Emeka Nwosu",      email:"emeka@example.com",  course:"TypeScript",       plan:"Free",   amount:"$0",   date:"3h ago",  status:"free" },
  { name:"Zara Diallo",      email:"zara@example.com",   course:"AWS Deployment",   plan:"Ent.",   amount:"$199", date:"5h ago",  status:"success" },
];

const USERS = [
  { name:"Amara Osei",       role:"student",    plan:"Pro",    courses:4,  joined:"Jan 2025", status:"active" },
  { name:"Yemi Adeyemi",     role:"student",    plan:"Free",   courses:1,  joined:"Feb 2025", status:"active" },
  { name:"Kofi Mensah",      role:"instructor", plan:"Pro",    courses:12, joined:"Nov 2024", status:"active" },
  { name:"Fatima Al-Rashid", role:"student",    plan:"Pro",    courses:3,  joined:"Mar 2025", status:"active" },
  { name:"Emeka Nwosu",      role:"student",    plan:"Free",   courses:2,  joined:"Mar 2025", status:"suspended" },
  { name:"Zara Diallo",      role:"student",    plan:"Ent.",   courses:8,  joined:"Dec 2024", status:"active" },
  { name:"Chidi Okeke",      role:"instructor", plan:"Pro",    courses:7,  joined:"Oct 2024", status:"active" },
  { name:"Aisha Kamara",     role:"admin",      plan:"Ent.",   courses:0,  joined:"Sep 2024", status:"active" },
];

const COURSES_DATA = [
  { title:"Full Stack Dev",    category:"Web",    students:3241, revenue:"$255K", rating:4.9, published:true,  lessons:42 },
  { title:"AI Integration",    category:"AI/ML",  students:4820, revenue:"$478K", rating:4.8, published:true,  lessons:35 },
  { title:"Node.js & Express", category:"Backend",students:2108, revenue:"$145K", rating:4.7, published:true,  lessons:38 },
  { title:"React Mastery",     category:"Frontend",students:5102,revenue:"$402K", rating:4.9, published:true,  lessons:29 },
  { title:"PostgreSQL Dive",   category:"DB",     students:1576, revenue:"$93K",  rating:4.6, published:false, lessons:24 },
  { title:"AWS Deployment",    category:"DevOps", students:1982, revenue:"$176K", rating:4.8, published:true,  lessons:31 },
];

const CURRICULUM = [
  { section:"Section 1: Foundations", lessons:[
    { id:1, title:"Course Introduction & Setup",       dur:"5:20",  done:true },
    { id:2, title:"How the Web Works",                 dur:"12:45", done:true },
    { id:3, title:"HTML Structure & Semantics",        dur:"18:30", done:true },
    { id:4, title:"CSS Layouts with Flexbox & Grid",   dur:"24:15", done:true },
  ]},
  { section:"Section 2: JavaScript Mastery", lessons:[
    { id:5, title:"ES6+ Modern JavaScript",            dur:"22:00", done:true },
    { id:6, title:"Async/Await & Promises",            dur:"19:40", done:false },
    { id:7, title:"DOM Manipulation & Events",         dur:"16:55", done:false },
    { id:8, title:"Fetch API & REST Clients",          dur:"20:10", done:false },
  ]},
  { section:"Section 3: React Deep Dive", lessons:[
    { id:9,  title:"React Fundamentals & JSX",         dur:"28:00", done:false },
    { id:10, title:"State & Props Management",         dur:"22:30", done:false },
    { id:11, title:"React Hooks in Depth",             dur:"31:15", done:false },
    { id:12, title:"Building a Real Project",          dur:"45:00", done:false },
  ]},
];

/* ─────────────────────────────────────────────
   MINI COMPONENTS
───────────────────────────────────────────── */
function StatCard({ icon, label, value, delta, up, bg }) {
  return (
    <div className="card stat fade-in">
      <div className="stat-top">
        <div className="stat-icon" style={{ background: bg }}>{icon}</div>
        <span className={`stat-delta ${up ? "up" : "dn"}`}>{delta}</span>
      </div>
      <div className="stat-val">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return <button className={`toggle ${on ? "on" : "off"}`} onClick={onToggle} />;
}

/* ─────────────────────────────────────────────
   ADMIN DASHBOARD
───────────────────────────────────────────── */
function AdminDashboard() {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-title">Dashboard Overview</div>
        <div className="page-sub">Welcome back, Admin — here's what's happening today</div>
      </div>

      {/* Stats */}
      <div className="grid g4 mb-5">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Revenue Chart + Quick Actions */}
      <div className="grid g2 mb-5">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold" style={{fontSize:14}}>Revenue — 2025</div>
              <div className="text-xs text-muted mt-1">Monthly recurring revenue</div>
            </div>
            <span className="pill pill-green">↑ 14% YoY</span>
          </div>
          <div className="chart-bars">
            {REVENUE_BARS.map((h, i) => (
              <div key={i} style={{ height:`${h}%` }} className="chart-bar" title={`$${Math.round(h*285)} revenue`} />
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            {REVENUE_MONTHS.map(m => <span key={m} style={{fontSize:9,color:"var(--text3)"}}>{m}</span>)}
          </div>
        </div>

        <div className="card">
          <div className="font-bold mb-4" style={{fontSize:14}}>Platform Health</div>
          {[
            { label:"Server Uptime",      val:99.97, color:"var(--green)" },
            { label:"AI Tutor Usage",     val:78,    color:"var(--blue)" },
            { label:"Course Completion",  val:61,    color:"var(--indigo)" },
            { label:"Payment Success",    val:94,    color:"var(--amber)" },
          ].map(m => (
            <div key={m.label} style={{marginBottom:14}}>
              <div className="flex justify-between text-sm mb-1">
                <span style={{color:"var(--text2)"}}>{m.label}</span>
                <span className="font-bold">{m.val}%</span>
              </div>
              <div className="prog-bar"><div className="prog-fill" style={{width:`${m.val}%`,background:m.color}} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold" style={{fontSize:14}}>Recent Enrollments</div>
          <button className="btn btn-ghost btn-sm">View All</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Student</th><th>Course</th><th>Plan</th><th>Amount</th><th>Time</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ENROLLMENTS.map((r,i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{width:28,height:28,fontSize:11}}>{r.name[0]}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600}}>{r.name}</div>
                        <div className="text-xs text-muted">{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:13}}>{r.course}</td>
                  <td><span className="pill pill-blue">{r.plan}</span></td>
                  <td style={{fontSize:13,fontWeight:700,color:r.status==="free"?"var(--text3)":"var(--green)"}}>{r.amount}</td>
                  <td className="text-xs text-muted">{r.date}</td>
                  <td><span className={`pill ${r.status==="success"?"pill-green":"pill-amber"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Courses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold" style={{fontSize:14}}>Course Performance</div>
          <button className="btn btn-ghost btn-sm">Manage Courses</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead><tr><th>Course</th><th>Category</th><th>Students</th><th>Revenue</th><th>Rating</th><th>Status</th></tr></thead>
            <tbody>
              {COURSES_DATA.map((c,i) => (
                <tr key={i}>
                  <td style={{fontSize:13,fontWeight:600}}>{c.title}</td>
                  <td><span className="pill pill-purple">{c.category}</span></td>
                  <td style={{fontSize:13}}>{c.students.toLocaleString()}</td>
                  <td style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>{c.revenue}</td>
                  <td style={{fontSize:13}}>⭐ {c.rating}</td>
                  <td><span className={`pill ${c.published?"pill-green":"pill-amber"}`}>{c.published?"Live":"Draft"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   USERS PAGE
───────────────────────────────────────────── */
function UsersPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.includes(search.toLowerCase())
  );
  return (
    <div className="page fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <div className="page-title">User Management</div>
          <div className="page-sub">{USERS.length} total users</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Invite User</button>
      </div>

      <div className="card mb-4" style={{padding:"12px 16px"}}>
        <div className="input-icon">
          <span className="ic">🔍</span>
          <input className="input" placeholder="Search users by name or role…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Courses</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((u,i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{width:30,height:30,fontSize:11,flexShrink:0}}>{u.name[0]}</div>
                      <span style={{fontSize:13,fontWeight:600}}>{u.name}</span>
                    </div>
                  </td>
                  <td><span className={`pill ${u.role==="admin"?"pill-red":u.role==="instructor"?"pill-purple":"pill-blue"}`}>{u.role}</span></td>
                  <td><span className={`pill ${u.plan==="Ent."?"pill-amber":u.plan==="Pro"?"pill-cyan":"pill-blue"}`}>{u.plan}</span></td>
                  <td style={{fontSize:13}}>{u.courses}</td>
                  <td className="text-xs text-muted">{u.joined}</td>
                  <td><span className={`pill ${u.status==="active"?"pill-green":"pill-red"}`}>{u.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm">Edit</button>
                      {u.status==="active"
                        ? <button className="btn btn-danger btn-sm">Suspend</button>
                        : <button className="btn btn-ghost btn-sm">Restore</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="backdrop" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Invite New User</div>
            <div className="field"><label className="label">Full Name</label><input className="input" placeholder="e.g. Amara Osei" /></div>
            <div className="field"><label className="label">Email Address</label><input className="input" type="email" placeholder="amara@example.com" /></div>
            <div className="field"><label className="label">Role</label>
              <select className="select"><option>student</option><option>instructor</option><option>admin</option></select>
            </div>
            <div className="field"><label className="label">Plan</label>
              <select className="select"><option>Free</option><option>Pro</option><option>Enterprise</option></select>
            </div>
            <div className="flex gap-3" style={{marginTop:20}}>
              <button className="btn btn-primary w-full">Send Invitation</button>
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COURSES ADMIN PAGE
───────────────────────────────────────────── */
function CoursesAdminPage() {
  const [toggles, setToggles] = useState(COURSES_DATA.map(c=>c.published));
  return (
    <div className="page fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <div className="page-title">Course Management</div>
          <div className="page-sub">Manage, publish, and track all courses</div>
        </div>
        <button className="btn btn-primary">+ New Course</button>
      </div>
      <div className="grid" style={{gap:14}}>
        {COURSES_DATA.map((c,i) => (
          <div key={i} className="card" style={{padding:"16px 20px"}}>
            <div className="flex items-center gap-4">
              <div style={{width:48,height:48,borderRadius:12,background:"var(--bg4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
                {["⚛️","🤖","🟢","🔷","🗄️","☁️"][i]}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700}}>{c.title}</div>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-muted">{c.lessons} lessons</span>
                  <span className="text-xs text-muted">•</span>
                  <span className="text-xs text-muted">{c.students.toLocaleString()} students</span>
                  <span className="text-xs text-muted">•</span>
                  <span className="text-xs" style={{color:"var(--green)",fontWeight:700}}>{c.revenue}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="pill pill-purple">{c.category}</span>
                <span style={{fontSize:12,color:"var(--text3)"}}>⭐ {c.rating}</span>
                <div className="flex items-center gap-2">
                  <span style={{fontSize:12,color:toggles[i]?"var(--green)":"var(--text3)"}}>
                    {toggles[i]?"Live":"Draft"}
                  </span>
                  <Toggle on={toggles[i]} onToggle={()=>setToggles(t=>{const n=[...t];n[i]=!n[i];return n;})} />
                </div>
                <button className="btn btn-ghost btn-sm">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAYMENTS ADMIN PAGE
───────────────────────────────────────────── */
function PaymentsPage() {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-title">Payments & Revenue</div>
        <div className="page-sub">Track transactions from Stripe and Paystack</div>
      </div>
      <div className="grid g3 mb-5">
        {[
          {label:"Total Revenue",    val:"$284,910", delta:"↑ 14%", color:"var(--green)"},
          {label:"Stripe Revenue",   val:"$198,440", delta:"70%",   color:"var(--blue2)"},
          {label:"Paystack Revenue", val:"$86,470",  delta:"30%",   color:"var(--cyan)"},
        ].map(m=>(
          <div key={m.label} className="card" style={{textAlign:"center",padding:"24px 16px"}}>
            <div style={{fontSize:26,fontWeight:800,color:m.color}}>{m.val}</div>
            <div style={{fontSize:12,color:"var(--text3)",marginTop:4}}>{m.label}</div>
            <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{m.delta} of total</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="font-bold mb-4" style={{fontSize:14}}>Recent Transactions</div>
        <div style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Provider</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {RECENT_ENROLLMENTS.map((r,i)=>(
                <tr key={i}>
                  <td style={{fontSize:13,fontWeight:600}}>{r.name}</td>
                  <td style={{fontSize:13}}>{r.course}</td>
                  <td style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>{r.amount}</td>
                  <td><span className={`pill ${i%2===0?"pill-blue":"pill-cyan"}`}>{i%2===0?"Stripe":"Paystack"}</span></td>
                  <td className="text-xs text-muted">{r.date}</td>
                  <td><span className={`pill ${r.status==="success"?"pill-green":"pill-amber"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COURSE PLAYER
───────────────────────────────────────────── */
function CoursePlayer() {
  const [activeLesson, setActiveLesson] = useState({ sIdx:0, lIdx:0 });
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [completed, setCompleted] = useState(new Set(
    CURRICULUM.flatMap((s,si)=>s.lessons.filter(l=>l.done).map(l=>`${si}-${s.lessons.indexOf(l)}`))
  ));
  const intervalRef = useRef(null);

  const lesson = CURRICULUM[activeLesson.sIdx]?.lessons[activeLesson.lIdx];
  const totalLessons = CURRICULUM.reduce((a,s)=>a+s.lessons.length,0);
  const doneCount = completed.size;

  const togglePlay = () => {
    setPlaying(p => {
      if (!p) {
        intervalRef.current = setInterval(() => {
          setProgress(prev => { if (prev >= 100) { clearInterval(intervalRef.current); return 100; } return prev + 0.3; });
        }, 100);
      } else {
        clearInterval(intervalRef.current);
      }
      return !p;
    });
  };

  const markDone = () => {
    const key = `${activeLesson.sIdx}-${activeLesson.lIdx}`;
    setCompleted(prev => { const n = new Set(prev); n.add(key); return n; });
    // advance to next lesson
    const s = CURRICULUM[activeLesson.sIdx];
    if (activeLesson.lIdx < s.lessons.length - 1) {
      setActiveLesson(a => ({...a, lIdx: a.lIdx+1}));
    } else if (activeLesson.sIdx < CURRICULUM.length - 1) {
      setActiveLesson({ sIdx: activeLesson.sIdx+1, lIdx: 0 });
    }
    setProgress(0);
    setPlaying(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="player-shell fade-in">
      {/* Main content */}
      <div className="player-main">
        {/* Video area */}
        <div className="video-wrap">
          <div style={{ width:"100%", paddingTop:"56.25%", position:"relative", background:"linear-gradient(135deg,#0d1420,#111827)" }}>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
              <div style={{fontSize:64}}>🎬</div>
              <div style={{fontSize:14,color:"var(--text2)",textAlign:"center",padding:"0 20px"}}>
                {lesson?.title}
              </div>
              <div style={{fontSize:12,color:"var(--text3)"}}>Duration: {lesson?.dur}</div>
            </div>
          </div>
          <div className="video-controls">
            <button className="ctl-btn" onClick={togglePlay}>{playing ? "⏸" : "▶️"}</button>
            <button className="ctl-btn">⏭</button>
            <div className="seek-bar" onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(((e.clientX - rect.left) / rect.width) * 100);
            }}>
              <div className="seek-fill" style={{width:`${progress}%`}} />
              <div className="seek-thumb" style={{left:`${progress}%`}} />
            </div>
            <span className="time-label">{Math.floor(progress*0.01*parseInt(lesson?.dur)*60/60)}:{String(Math.floor(progress*0.01*parseInt(lesson?.dur)*60%60)).padStart(2,'0')} / {lesson?.dur}</span>
            <button className="ctl-btn">🔊</button>
            <button className="ctl-btn">⛶</button>
            <span style={{fontSize:11,color:"var(--text3)",marginLeft:4}}>{playing && <span className="pulse">● LIVE</span>}</span>
          </div>
        </div>

        {/* Lesson info */}
        <div className="lesson-info">
          <div className="flex items-center justify-between gap-4" style={{flexWrap:"wrap"}}>
            <div>
              <div className="lesson-title-lg">{lesson?.title}</div>
              <div className="lesson-meta">
                <span>📚 Full Stack Dev Course</span>
                <span>⏱ {lesson?.dur}</span>
                <span>📝 {CURRICULUM[activeLesson.sIdx]?.section}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm">📥 Resources</button>
              <button className="btn btn-primary" onClick={markDone}>✓ Mark Complete</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-row">
          {["overview","notes","discussions","ai tutor"].map(t=>(
            <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        <div className="tab-body">
          {activeTab==="overview" && <>
            <p style={{marginBottom:12}}>In this lesson, you'll explore the fundamental concepts behind <strong>{lesson?.title}</strong>. We'll build on previous lessons and introduce new patterns used in professional full stack development.</p>
            <p style={{marginBottom:12}}>By the end of this lesson, you will understand: the core principles, how to apply them in real projects, and common pitfalls to avoid.</p>
            <div style={{background:"var(--bg3)",borderRadius:10,padding:"14px 16px",border:"1px solid var(--line)",marginTop:16}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>📎 Lesson Resources</div>
              {["Source code (GitHub)","Slides PDF","Exercise files"].map(r=>(
                <div key={r} style={{fontSize:13,color:"var(--blue2)",cursor:"pointer",marginBottom:4}}>→ {r}</div>
              ))}
            </div>
          </>}
          {activeTab==="notes" && <textarea className="textarea" style={{height:200}} placeholder="Take your notes here. They're saved automatically…" />}
          {activeTab==="discussions" && <div style={{color:"var(--text3)",fontSize:13}}>No discussions yet. Be the first to ask a question!</div>}
          {activeTab==="ai tutor" && <div style={{color:"var(--text2)",fontSize:13}}>Switch to the AI Tutor tab in the main nav for a full chat experience with context from this lesson.</div>}
        </div>
      </div>

      {/* Sidebar curriculum */}
      <div className="player-sidebar">
        <div className="ps-header">
          <div className="ps-title">Full Stack Dev Course</div>
          <div className="ps-prog">
            <div className="ps-prog-lbl">
              <span>Progress</span>
              <span>{doneCount}/{totalLessons} lessons</span>
            </div>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${(doneCount/totalLessons)*100}%`}} /></div>
          </div>
        </div>
        {CURRICULUM.map((sec, si) => (
          <div key={si}>
            <div className="section-head">{sec.section}</div>
            {sec.lessons.map((l, li) => {
              const key = `${si}-${li}`;
              const isDone = completed.has(key);
              const isCurrent = si===activeLesson.sIdx && li===activeLesson.lIdx;
              return (
                <div key={li} className={`lesson-row ${isCurrent?"active-lesson":""}`}
                  onClick={()=>{ setActiveLesson({sIdx:si,lIdx:li}); setProgress(0); setPlaying(false); clearInterval(intervalRef.current); }}>
                  <div className={`lesson-num ${isDone?"done":isCurrent?"current":""}`}>
                    {isDone ? "✓" : si*4+li+1}
                  </div>
                  <div className="lesson-row-title truncate">{l.title}</div>
                  <div className="lesson-dur">{l.dur}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIDEO UPLOAD SYSTEM
───────────────────────────────────────────── */
function VideoUpload() {
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [course, setCourse] = useState("");
  const [section, setSection] = useState("");
  const fileRef = useRef();

  const simulate = (files) => {
    const newUploads = Array.from(files).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(1) + " MB",
      status: "waiting",
      progress: 0,
      type: f.type.includes("video") ? "🎬" : f.type.includes("pdf") ? "📄" : "📁",
    }));
    setUploads(prev => [...prev, ...newUploads]);

    // Simulate uploads one by one
    newUploads.forEach((u, i) => {
      setTimeout(() => {
        setUploads(prev => prev.map(x => x.id === u.id ? {...x, status:"uploading"} : x));
        let prog = 0;
        const iv = setInterval(() => {
          prog += Math.random() * 8 + 3;
          if (prog >= 100) {
            prog = 100;
            clearInterval(iv);
            setUploads(prev => prev.map(x => x.id === u.id ? {...x, status:"done", progress:100} : x));
          } else {
            setUploads(prev => prev.map(x => x.id === u.id ? {...x, progress: Math.round(prog)} : x));
          }
        }, 180);
      }, i * 800);
    });
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    simulate(e.dataTransfer.files);
  };

  const onFileChange = (e) => simulate(e.target.files);

  const removeUpload = (id) => setUploads(prev => prev.filter(u => u.id !== id));

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-title">Video & Content Upload</div>
        <div className="page-sub">Upload course videos, PDFs, and resources</div>
      </div>

      <div className="grid g2 mb-5">
        {/* Left: Upload form */}
        <div>
          <div className="card mb-4">
            <div className="font-bold mb-4" style={{fontSize:14}}>Upload Settings</div>
            <div className="field">
              <label className="label">Course</label>
              <select className="select" value={course} onChange={e=>setCourse(e.target.value)}>
                <option value="">Select course…</option>
                {COURSES_DATA.map(c=><option key={c.title}>{c.title}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Section</label>
              <select className="select" value={section} onChange={e=>setSection(e.target.value)}>
                <option value="">Select section…</option>
                {CURRICULUM.map(s=><option key={s.section}>{s.section}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Lesson Title</label>
              <input className="input" placeholder="e.g. Introduction to React Hooks" />
            </div>
            <div className="field">
              <label className="label">Description (optional)</label>
              <textarea className="textarea" placeholder="What students will learn in this lesson…" style={{minHeight:70}} />
            </div>
            <div className="flex items-center justify-between" style={{padding:"10px 0",borderTop:"1px solid var(--line)",marginTop:4}}>
              <span style={{fontSize:13,color:"var(--text2)"}}>Free preview lesson?</span>
              <Toggle on={false} onToggle={()=>{}} />
            </div>
          </div>
        </div>

        {/* Right: Drop zone */}
        <div>
          <div
            className={`drop-zone ${dragOver?"drag-over":""}`}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={onDrop}
            onClick={()=>fileRef.current.click()}
          >
            <input ref={fileRef} type="file" multiple accept="video/*,.pdf,.zip" style={{display:"none"}} onChange={onFileChange} />
            <div className="drop-icon">{dragOver?"📂":"☁️"}</div>
            <div className="drop-title">{dragOver ? "Drop files here" : "Drag & drop files here"}</div>
            <div className="drop-sub">or click to browse • MP4, MOV, PDF, ZIP supported</div>
            <div style={{marginTop:16,display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              {["MP4","MOV","PDF","ZIP"].map(t=>(
                <span key={t} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"var(--bg4)",color:"var(--text3)"}}>{t}</span>
              ))}
            </div>
          </div>

          {/* Upload queue */}
          {uploads.length > 0 && (
            <div className="upload-queue">
              {uploads.map(u => (
                <div key={u.id} className="upload-item">
                  <div className="upload-item-top">
                    <div className="file-icon">{u.type}</div>
                    <div className="file-info">
                      <div className="file-name">{u.name}</div>
                      <div className="file-size">{u.size}</div>
                    </div>
                    <span className={`upload-status status-${u.status}`}>
                      {u.status==="waiting" && "⏳ Waiting"}
                      {u.status==="uploading" && `${u.progress}%`}
                      {u.status==="done" && "✅ Done"}
                      {u.status==="error" && "❌ Error"}
                    </span>
                    {(u.status==="done"||u.status==="error") &&
                      <button onClick={()=>removeUpload(u.id)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:16,padding:"0 4px"}}>×</button>}
                  </div>
                  {u.status==="uploading" && (
                    <div className="prog-bar">
                      <div className="prog-fill" style={{width:`${u.progress}%`}} />
                    </div>
                  )}
                  {u.status==="done" && (
                    <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>
                      Uploaded to Cloudflare Stream • Processing…
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Existing videos */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold" style={{fontSize:14}}>Uploaded Content Library</div>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm">Filter</button>
            <button className="btn btn-ghost btn-sm">Sort</button>
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead><tr><th>File</th><th>Course</th><th>Duration</th><th>Size</th><th>Status</th><th>Uploaded</th><th></th></tr></thead>
            <tbody>
              {CURRICULUM.flatMap(s=>s.lessons).slice(0,6).map((l,i)=>(
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span style={{fontSize:18}}>🎬</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:600}}>{l.title}</div>
                        <div className="text-xs text-muted">lesson_{i+1}.mp4</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:13}}>Full Stack Dev</td>
                  <td className="text-xs text-muted" style={{fontFamily:"JetBrains Mono,monospace"}}>{l.dur}</td>
                  <td className="text-xs text-muted">{(Math.random()*200+50).toFixed(0)} MB</td>
                  <td><span className={`pill ${l.done?"pill-green":"pill-blue"}`}>{l.done?"Published":"Processing"}</span></td>
                  <td className="text-xs text-muted">{i+1}d ago</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm">▶ Preview</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SETTINGS PAGE
───────────────────────────────────────────── */
function SettingsPage() {
  const [notifs, setNotifs] = useState({enrollments:true,payments:true,reviews:false,weekly:true});
  return (
    <div className="page fade-in">
      <div className="page-header"><div className="page-title">Platform Settings</div></div>
      <div className="grid g2">
        <div>
          <div className="card mb-4">
            <div className="font-bold mb-4" style={{fontSize:14}}>Platform Info</div>
            <div className="field"><label className="label">Platform Name</label><input className="input" defaultValue="StackAI" /></div>
            <div className="field"><label className="label">Support Email</label><input className="input" defaultValue="support@stackai.dev" /></div>
            <div className="field"><label className="label">Tagline</label><input className="input" defaultValue="Master Full Stack Development with AI" /></div>
            <button className="btn btn-primary">Save Changes</button>
          </div>
          <div className="card">
            <div className="font-bold mb-4" style={{fontSize:14}}>API Keys</div>
            {[["Anthropic API","sk-ant-••••••••"],["Stripe Secret","sk_live_••••••••"],["Paystack Secret","sk_live_••••••••"],["Resend API","re_••••••••"]].map(([k,v])=>(
              <div key={k} className="field">
                <label className="label">{k}</label>
                <div className="flex gap-2">
                  <input className="input" defaultValue={v} type="password" style={{flex:1}} />
                  <button className="btn btn-ghost btn-sm">Update</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card mb-4">
            <div className="font-bold mb-4" style={{fontSize:14}}>Notifications</div>
            {Object.entries(notifs).map(([k,v])=>(
              <div key={k} className="flex items-center justify-between" style={{padding:"10px 0",borderBottom:"1px solid var(--line)"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,textTransform:"capitalize"}}>{k.replace(/([A-Z])/g,' $1')} Alerts</div>
                  <div className="text-xs text-muted">Get notified for {k}</div>
                </div>
                <Toggle on={v} onToggle={()=>setNotifs(n=>({...n,[k]:!n[k]}))} />
              </div>
            ))}
          </div>
          <div className="card">
            <div className="font-bold mb-4" style={{fontSize:14}}>Payment Providers</div>
            {[["Stripe","Global cards, Apple/Google Pay","pill-blue"],["Paystack","Nigeria, Ghana, Kenya","pill-cyan"]].map(([n,d,c])=>(
              <div key={n} className="flex items-center justify-between" style={{padding:"10px 0",borderBottom:"1px solid var(--line)"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{n}</div>
                  <div className="text-xs text-muted">{d}</div>
                </div>
                <span className={`pill ${c}`}>Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
const PAGES = [
  { id:"dashboard", icon:"🏠", label:"Dashboard",    section:"main" },
  { id:"player",    icon:"▶️",  label:"Course Player", section:"main" },
  { id:"upload",    icon:"☁️",  label:"Video Upload",  section:"main", badge:3 },
  { id:"courses",   icon:"📚", label:"Courses",       section:"manage" },
  { id:"users",     icon:"👥", label:"Users",         section:"manage" },
  { id:"payments",  icon:"💰", label:"Payments",      section:"manage" },
  { id:"settings",  icon:"⚙️", label:"Settings",      section:"system" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const current = PAGES.find(p => p.id === page);

  const sections = [
    { key:"main",    label:"Platform" },
    { key:"manage",  label:"Manage" },
    { key:"system",  label:"System" },
  ];

  const render = () => {
    if (page === "dashboard") return <AdminDashboard />;
    if (page === "player")    return <CoursePlayer />;
    if (page === "upload")    return <VideoUpload />;
    if (page === "courses")   return <CoursesAdminPage />;
    if (page === "users")     return <UsersPage />;
    if (page === "payments")  return <PaymentsPage />;
    if (page === "settings")  return <SettingsPage />;
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">S</div>
            <div className="logo-text">Stack<span>AI</span></div>
          </div>
          {sections.map(sec => (
            <div key={sec.key} className="nav-section">
              <div className="nav-label">{sec.label}</div>
              {PAGES.filter(p => p.section === sec.key).map(p => (
                <button key={p.id} className={`nav-item ${page===p.id?"active":""}`} onClick={()=>setPage(p.id)}>
                  <span className="nav-icon">{p.icon}</span>
                  {p.label}
                  {p.badge && <span className="nav-badge">{p.badge}</span>}
                </button>
              ))}
            </div>
          ))}
          <div style={{marginTop:"auto",padding:"16px 12px",borderTop:"1px solid var(--line)"}}>
            <div className="flex items-center gap-2" style={{padding:"8px 10px"}}>
              <div className="avatar" style={{flexShrink:0}}>A</div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700}} className="truncate">Admin</div>
                <div style={{fontSize:10,color:"var(--text3)"}}>Super Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{current?.icon} {current?.label}</div>
            <div className="topbar-right">
              <button className="btn btn-ghost btn-sm">🔔</button>
              <button className="btn btn-primary btn-sm" onClick={()=>window.open("https://stackai.dev","_blank")}>↗ View Site</button>
              <div className="avatar">A</div>
            </div>
          </div>
          {render()}
        </div>
      </div>
    </>
  );
}

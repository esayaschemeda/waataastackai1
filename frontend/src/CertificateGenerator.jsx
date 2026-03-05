import { useState, useRef } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0a0e1a;--bg2:#111827;--bg3:#1a2235;
  --gold:#c9a84c;--gold2:#e8c96d;--gold3:#f5e4a0;
  --blue:#3b82f6;--text:#f1f5f9;--text2:#94a3b8;--text3:#475569;
  --line:rgba(255,255,255,0.07);
}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.app{display:grid;grid-template-columns:360px 1fr;min-height:100vh;}
.panel{background:var(--bg2);border-right:1px solid var(--line);padding:28px 24px;overflow-y:auto;}
.panel-title{font-size:20px;font-weight:700;margin-bottom:4px;}
.panel-sub{font-size:13px;color:var(--text3);margin-bottom:28px;}
.field{margin-bottom:16px;}
.label{display:block;font-size:12px;font-weight:600;color:var(--text2);margin-bottom:6px;letter-spacing:.04em;text-transform:uppercase;}
.input,.select,.textarea{width:100%;background:var(--bg3);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:10px 13px;color:var(--text);font-size:13.5px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s;}
.input:focus,.select:focus,.textarea:focus{border-color:var(--gold);}
.select option{background:var(--bg2);}
.divider{height:1px;background:var(--line);margin:20px 0;}
.section-label{font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px;}
.theme-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;}
.theme-btn{padding:8px 6px;border-radius:8px;border:2px solid transparent;cursor:pointer;font-size:11px;font-weight:700;font-family:'DM Sans',sans-serif;transition:all .2s;text-align:center;}
.theme-btn.selected{border-color:var(--gold);}
.btn{width:100%;padding:12px;border-radius:10px;border:none;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;margin-bottom:10px;}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#1a0e00;}
.btn-gold:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(201,168,76,.3);}
.btn-outline{background:transparent;border:1px solid rgba(255,255,255,.15);color:var(--text2);}
.btn-outline:hover{border-color:var(--gold);color:var(--gold);}
.preview-area{background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:40px 32px;overflow-y:auto;}
.cert-wrap{width:100%;max-width:860px;position:relative;}
/* CERTIFICATE DESIGNS */
.cert{width:100%;aspect-ratio:1.414/1;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 64px;}
/* Theme: Classic Gold */
.cert-classic{background:linear-gradient(160deg,#1a1200,#2a1e00,#1a1200);border:none;}
.cert-classic::before{content:'';position:absolute;inset:12px;border:2px solid var(--gold);border-radius:2px;pointer-events:none;}
.cert-classic::after{content:'';position:absolute;inset:18px;border:1px solid rgba(201,168,76,.3);border-radius:2px;pointer-events:none;}
/* Theme: Modern Dark */
.cert-modern{background:linear-gradient(135deg,#0d1b2a,#0a1628,#0d2137);}
.cert-modern::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,var(--blue),#6366f1,var(--blue));pointer-events:none;}
/* Theme: Elegant White */
.cert-white{background:linear-gradient(160deg,#fefefe,#f8f6f0,#fefefe);}
/* Corner ornaments */
.corner{position:absolute;width:48px;height:48px;font-size:22px;color:var(--gold);opacity:.7;}
.corner-tl{top:24px;left:24px;}
.corner-tr{top:24px;right:24px;transform:scaleX(-1);}
.corner-bl{bottom:24px;left:24px;transform:scaleY(-1);}
.corner-br{bottom:24px;right:24px;transform:scale(-1);}
/* Cert text */
.cert-org{font-family:'Cormorant Garamond',serif;font-size:13px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;text-align:center;}
.cert-heading{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;letter-spacing:.05em;text-align:center;margin-bottom:10px;line-height:1.1;}
.cert-heading-dark{color:#2a1a00;}
.cert-heading-light{color:#f8f0dc;}
.cert-heading-modern{background:linear-gradient(90deg,var(--blue),#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.cert-subheading{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;text-align:center;margin-bottom:24px;}
.cert-subheading-dark{color:#5a3e00;}
.cert-subheading-light{color:rgba(248,240,220,.6);}
.cert-subheading-modern{color:var(--text2);}
.cert-line{width:200px;height:1px;margin:0 auto 24px;}
.cert-line-gold{background:linear-gradient(90deg,transparent,var(--gold),transparent);}
.cert-line-blue{background:linear-gradient(90deg,transparent,var(--blue),transparent);}
.cert-line-dark{background:linear-gradient(90deg,transparent,#c9a84c,transparent);}
.cert-name{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:700;font-style:italic;text-align:center;line-height:1;margin-bottom:24px;}
.cert-name-gold{color:var(--gold2);}
.cert-name-dark{color:#1a0a00;}
.cert-name-modern{background:linear-gradient(90deg,#60a5fa,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.cert-body{font-family:'Cormorant Garamond',serif;font-size:15px;text-align:center;max-width:520px;line-height:1.7;margin-bottom:10px;}
.cert-body-dark{color:#3a2800;}
.cert-body-light{color:rgba(248,240,220,.8);}
.cert-body-modern{color:var(--text2);}
.cert-course{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;text-align:center;margin-bottom:28px;}
.cert-course-gold{color:var(--gold3);}
.cert-course-dark{color:#1a0a00;}
.cert-course-modern{color:#f1f5f9;}
.cert-footer{display:flex;justify-content:space-between;align-items:flex-end;width:100%;margin-top:auto;gap:20px;}
.cert-sig{text-align:center;flex:1;}
.sig-line{width:140px;height:1px;margin:0 auto 6px;}
.sig-line-gold{background:rgba(201,168,76,.5);}
.sig-line-dark{background:rgba(90,62,0,.4);}
.sig-line-modern{background:rgba(99,102,241,.4);}
.sig-name{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;}
.sig-title{font-size:10px;margin-top:2px;}
.cert-seal{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;}
.cert-seal-gold{background:radial-gradient(circle,rgba(201,168,76,.3),transparent);border:2px solid var(--gold);color:var(--gold);}
.cert-seal-dark{background:radial-gradient(circle,rgba(201,168,76,.2),transparent);border:2px solid #c9a84c;}
.cert-seal-modern{background:radial-gradient(circle,rgba(59,130,246,.2),transparent);border:2px solid var(--blue);}
.cert-id{font-size:9px;letter-spacing:.08em;opacity:.5;text-align:center;margin-top:16px;}
/* Controls */
.action-bar{display:flex;gap:10px;margin-top:24px;width:100%;max-width:860px;}
.action-bar .btn{flex:1;margin:0;}
@media print{
  .panel,.action-bar{display:none!important;}
  .preview-area{padding:0;background:white;}
  .cert-wrap{max-width:100%;width:100%;}
  .cert{aspect-ratio:auto;min-height:100vh;}
}
`;

const THEMES = [
  { id:"classic", label:"Classic Gold",  bg:"linear-gradient(135deg,#1a1200,#2a1e00)", text:"#c9a84c" },
  { id:"modern",  label:"Modern Dark",   bg:"linear-gradient(135deg,#0d1b2a,#0d2137)", text:"#60a5fa" },
  { id:"white",   label:"Elegant White", bg:"linear-gradient(135deg,#fefefe,#f8f6f0)", text:"#c9a84c" },
];

const COURSES = ["Full Stack Development","AI Integration with Claude","React Mastery","Node.js & Express","TypeScript Fundamentals","AWS Deployment","Startup Training Bootcamp"];

export default function CertificateGenerator() {
  const [form, setForm] = useState({
    name: "Amara Osei",
    course: "Full Stack Development",
    org: "StackAI Academy",
    date: new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),
    instructor: "Dr. Kofi Mensah",
    instructorTitle: "Lead Instructor",
    director: "Aisha Kamara",
    directorTitle: "Program Director",
    certId: "STKAI-2025-" + Math.random().toString(36).slice(2,8).toUpperCase(),
  });
  const [theme, setTheme] = useState("classic");
  const certRef = useRef();

  const f = (k) => (v) => setForm(p => ({...p, [k]: typeof v === "string" ? v : v.target.value}));

  const handlePrint = () => window.print();

  const t = theme; // shorthand
  const isDark = t === "classic";
  const isModern = t === "modern";
  const isWhite = t === "white";

  const textVariant = isDark ? "light" : isModern ? "modern" : "dark";

  return (
    <>
      <style>{S}</style>
      <div className="app">
        {/* Control Panel */}
        <div className="panel">
          <div className="panel-title">🎓 Certificate Generator</div>
          <div className="panel-sub">Create beautiful course completion certificates</div>

          <div className="section-label">Recipient</div>
          <div className="field">
            <label className="label">Student Name</label>
            <input className="input" value={form.name} onChange={f("name")} placeholder="Full name" />
          </div>
          <div className="field">
            <label className="label">Course Completed</label>
            <select className="select" value={form.course} onChange={f("course")}>
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Completion Date</label>
            <input className="input" value={form.date} onChange={f("date")} />
          </div>

          <div className="divider" />
          <div className="section-label">Organization</div>
          <div className="field">
            <label className="label">Institution Name</label>
            <input className="input" value={form.org} onChange={f("org")} />
          </div>
          <div className="field">
            <label className="label">Instructor Name</label>
            <input className="input" value={form.instructor} onChange={f("instructor")} />
          </div>
          <div className="field">
            <label className="label">Instructor Title</label>
            <input className="input" value={form.instructorTitle} onChange={f("instructorTitle")} />
          </div>
          <div className="field">
            <label className="label">Director / Co-Signer</label>
            <input className="input" value={form.director} onChange={f("director")} />
          </div>

          <div className="divider" />
          <div className="section-label">Certificate Theme</div>
          <div className="theme-grid">
            {THEMES.map(th => (
              <button key={th.id} className={`theme-btn ${theme===th.id?"selected":""}`}
                style={{ background: th.bg, color: th.text }}
                onClick={() => setTheme(th.id)}>
                {th.label}
              </button>
            ))}
          </div>

          <div className="divider" />
          <button className="btn btn-gold" onClick={handlePrint}>🖨 Print / Save PDF</button>
          <button className="btn btn-outline">📤 Email to Student</button>
        </div>

        {/* Certificate Preview */}
        <div className="preview-area">
          <div className="cert-wrap" ref={certRef}>
            <div className={`cert cert-${t}`}>
              {/* Corner ornaments */}
              <div className="corner corner-tl">❧</div>
              <div className="corner corner-tr">❧</div>
              <div className="corner corner-bl">❧</div>
              <div className="corner corner-br">❧</div>

              <div className={`cert-org`} style={{color: isDark||isWhite?"var(--gold)":"var(--blue2)"}}>{form.org}</div>

              <div className={`cert-heading cert-heading-${textVariant}`}>
                Certificate of Completion
              </div>

              <div className={`cert-subheading cert-subheading-${textVariant}`}>
                This is to certify that
              </div>

              <div className={`cert-line cert-line-${isDark?"gold":isModern?"blue":"dark"}`} />

              <div className={`cert-name cert-name-${isDark?"gold":isModern?"modern":"dark"}`}>
                {form.name || "Student Name"}
              </div>

              <div className={`cert-line cert-line-${isDark?"gold":isModern?"blue":"dark"}`} />

              <div className={`cert-body cert-body-${textVariant}`}>
                has successfully completed all requirements of the
              </div>

              <div className={`cert-course cert-course-${isDark?"gold":isModern?"modern":"dark"}`}>
                {form.course}
              </div>

              <div className={`cert-body cert-body-${textVariant}`} style={{fontSize:13,opacity:.8}}>
                Awarded on {form.date}
              </div>

              <div className="cert-footer">
                <div className="cert-sig">
                  <div className={`sig-line sig-line-${isDark?"gold":isModern?"modern":"dark"}`} />
                  <div className={`sig-name`} style={{color:isDark?"var(--gold2)":isModern?"var(--blue2)":"#3a2800"}}>
                    {form.instructor}
                  </div>
                  <div className={`sig-title`} style={{color:isDark?"rgba(201,168,76,.6)":isModern?"var(--text3)":"#6b4c00"}}>
                    {form.instructorTitle}
                  </div>
                </div>

                <div className={`cert-seal cert-seal-${isDark?"gold":isModern?"modern":"dark"}`}>
                  🏛
                </div>

                <div className="cert-sig">
                  <div className={`sig-line sig-line-${isDark?"gold":isModern?"modern":"dark"}`} />
                  <div className={`sig-name`} style={{color:isDark?"var(--gold2)":isModern?"var(--blue2)":"#3a2800"}}>
                    {form.director}
                  </div>
                  <div className={`sig-title`} style={{color:isDark?"rgba(201,168,76,.6)":isModern?"var(--text3)":"#6b4c00"}}>
                    {form.directorTitle}
                  </div>
                </div>
              </div>

              <div className={`cert-id`} style={{color:isDark?"var(--gold)":isModern?"var(--text3)":"#c9a84c"}}>
                Certificate ID: {form.certId} • Verify at stackai.dev/verify
              </div>
            </div>
          </div>

          <div className="action-bar">
            <button className="btn btn-gold" onClick={handlePrint}>🖨 Print / Download PDF</button>
            <button className="btn btn-outline">🔗 Copy Verification Link</button>
            <button className="btn btn-outline">📧 Email to {form.name.split(" ")[0]}</button>
          </div>
        </div>
      </div>
    </>
  );
}

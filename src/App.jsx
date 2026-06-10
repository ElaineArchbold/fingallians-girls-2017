import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = "https://rzjaxsfqdajnncfdwemq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_F7tdlTdu7-vYWkNynXW94g_mgzDZ-O_";
const ADMIN_EMAIL       = "e.t.archbold@gmail.com";

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LOGO = "data:image/png;base64,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";

const WEEKS = [
  {
    week:1, phase:"Foundation", dates:"Jun 29–Jul 5",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"1.5k"},{label:"Run 3",distance:"2k"}],
    skills:[
      {id:"c1a",label:"🏑 Camogie Skills & Drills",desc:"15 mins at the ball wall: striking off both sides, aim for below shoulder height. Count clean strikes in a row.",youtube_id:"UEFHWItrOD0"},
      {id:"f1a",label:"⚽ LGFA – The Punt Kick",desc:"15 mins: kick-pass off the wall, catch on the return. Focus on clean first touch. Try both feet.",youtube_id:"jhCo_NP8T_A"},
    ],
    squad:{label:"Squad Session – Striking & Kick-Pass",desc:"Get 3–4 girls together. First 10 mins: camogie striking at the wall, count clean strikes. Then 10 mins: football kick-pass pairs, count clean catches. Record both scores!",youtube_id:"pm5sdhJcd-Q"},
  },
  {
    week:2, phase:"Foundation", dates:"Jul 6–12",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"2k"},{label:"Run 3",distance:"2k"}],
    skills:[
      {id:"c2a",label:"🏑 Camogie – First Touch Drill",desc:"20 mins: ground ball, first touch and lift immediately, flick to the wall. Build reactions and speed.",youtube_id:"aIoMXfH-tNU"},
      {id:"f2a",label:"⚽ LGFA – The Solo",desc:"Solo the ball 20m without dropping it. Try both feet. Count clean solos in a row — record your best!",youtube_id:"2dAYRDt1g5M"},
    ],
    squad:{label:"Squad Session – First Touch & Solo Relay",desc:"Two challenges: (1) Camogie: first touch relay — 3 girls in a line, roll sliotar, first touch and flick on. Drops = restart. Clean rounds in 5 mins? (2) Football: solo relay — each girl solos 20m and back. Count drops. Can you get zero?",youtube_id:"UEFHWItrOD0"},
  },
  {
    week:3, phase:"Building", dates:"Jul 13–19",
    runs:[{label:"Run 1",distance:"2k"},{label:"Run 2",distance:"2k"},{label:"Run 3",distance:"2.5k"}],
    skills:[
      {id:"c3a",label:"🏑 Camogie – Box to Box Drill",desc:"10 frees from the 21m line. Count how many go over. Record your score — coaches will retest in September!",youtube_id:"u86Kk2iH2tE"},
      {id:"f3a",label:"⚽ LGFA – The High Catch",desc:"8 shots from different spots around the D. Count your score. Can you get 5+ out of 8?",youtube_id:"WxqVqxyFLhM"},
    ],
    squad:{label:"Squad Session – Free Taking Competition",desc:"Two rounds: (1) Camogie: each girl takes 5 frees from the 21 — group total. (2) Football: each girl takes 5 shots from the D — group total. Record both — coaches will retest in September!",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:4, phase:"Building", dates:"Jul 20–26",
    runs:[{label:"Run 1",distance:"2k"},{label:"Run 2",distance:"2.5k"},{label:"Run 3",distance:"2.5k"}],
    skills:[
      {id:"c4a",label:"🏑 Camogie Volleyball Drill",desc:"20 mins: overhead, ground and close-range striking mixed. No stopping to reset between touches.",youtube_id:"DEnfkwQeAHI"},
      {id:"f4a",label:"⚽ LGFA – The Pick Up",desc:"20 mins: fist-pass to wall, catch, kick-pass. Mix both feet and hands. Keep moving the whole time.",youtube_id:"f0NhadkjpUM"},
    ],
    squad:{label:"Squad Session – Score Hunt",desc:"At any goals: (1) Camogie: each girl takes 5 pucks from 20m — group total? (2) Football: each girl takes 5 shots from the D — group total? Target: 12+ out of 20 each. Keep the scores!",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:5, phase:"Push", dates:"Jul 27–Aug 2",
    runs:[{label:"Run 1",distance:"2.5k"},{label:"Run 2",distance:"2.5k"},{label:"Run 3",distance:"3k"}],
    skills:[
      {id:"c5a",label:"🏑 Camogie – Martin Fogarty Drills",desc:"5 attempts from the 45m line. Score out of 5. Repeat on the other side. Coaches will test this in September!",youtube_id:"pm5sdhJcd-Q"},
      {id:"f5a",label:"⚽ LGFA – Kicking Mechanics",desc:"Timed drill: solo 30m, turn, shoot. Record your time. Try to beat it by end of the week.",youtube_id:"8y8DAtcsSnw"},
    ],
    squad:{label:"Squad Session – 45 & Score Chase",desc:"(1) Camogie: each girl takes 5 attempts from the 45 — group total both sides. (2) Football: 3-girl weave, pass and follow up the pitch, finish with a score. How many in 5 mins? Record everything.",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:6, phase:"Push", dates:"Aug 3–9",
    runs:[{label:"Run 1",distance:"2.5k"},{label:"Run 2",distance:"3k"},{label:"Run 3",distance:"3k"}],
    skills:[
      {id:"c6a",label:"🏑 Camogie – U11/U13 Coaching Drills",desc:"25 mins at full pace. Strike, receive, strike again. No slow touches. Do this AFTER a run for extra challenge.",youtube_id:"v4vDsKw-qow"},
      {id:"f6a",label:"⚽ LGFA Training Ideas",desc:"3 girls across the pitch, pass and follow your pass. Weave to goal, finish with a score. How many in 5 mins?",youtube_id:"CAHGBytDaGw"},
    ],
    squad:{label:"Squad Session – Puck-Around & Weave",desc:"(1) Camogie: 2v2 near the goal, one side attacks for 3 mins, count scores, swap. (2) Football: 3-girl weave timed challenge — how many scores in 5 mins as a group? Record both.",youtube_id:"UEFHWItrOD0"},
  },
  {
    week:7, phase:"Peak", dates:"Aug 10–16",
    runs:[{label:"Run 1",distance:"3k"},{label:"Run 2",distance:"3k"},{label:"Run 3",distance:"3.5k"}],
    skills:[
      {id:"c7a",label:"🏑 Camogie – First Touch & Control",desc:"Most accurate camogie frees from 20m in a row without a miss. Personal best — beat it!",youtube_id:"aIoMXfH-tNU"},
      {id:"f7a",label:"⚽ LGFA – The Hook Kick",desc:"10 shots — 5 from left, 5 from right foot, 13m out. Count your score. Can you get 6+ out of 10?",youtube_id:"yEViD8o4ZWI"},
    ],
    squad:{label:"Squad Session – Peak Challenge",desc:"(1) Camogie: each girl does 10 frees from 20m — group total. Compare to Week 3! (2) Football: each girl does 10 shots, 5 each foot — group total. Compare to Week 3! How much has the team improved?",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:8, phase:"Peak", dates:"Aug 17–23",
    runs:[{label:"Run 1",distance:"3k"},{label:"Run 2",distance:"3.5k"},{label:"Run 3",distance:"3.5k"}],
    skills:[
      {id:"c8a",label:"🏑 Camogie – Final Session",desc:"30 mins — full pace, both sides, ground and overhead. Leave nothing. Final session before assessment!",youtube_id:"UEFHWItrOD0"},
      {id:"f8a",label:"⚽ LGFA – The Solo (Final Test)",desc:"Solo the ball 20m clean, both feet. Compare to Week 2. Then kick for score — compare to Week 3. How far have you come?",youtube_id:"2dAYRDt1g5M"},
    ],
    squad:{label:"Squad Session – Final Challenge",desc:"Re-run Week 2: (1) Camogie first touch relay — clean rounds in 5 mins? (2) Football solo relay — group drops count. Compare BOTH to Week 2. Screenshot and send to the coaches! 📸",youtube_id:"CAHGBytDaGw"},
  },
];

const PHASE_STYLE = {
  Foundation:{ bg:"#fce4ec", accent:"#c2185b", chip:"#f48fb1" },
  Building:  { bg:"#f3e5f5", accent:"#7b1fa2", chip:"#ce93d8" },
  Push:      { bg:"#e8eaf6", accent:"#3949ab", chip:"#9fa8da" },
  Peak:      { bg:"#e0f2f1", accent:"#00695c", chip:"#80cbc4" },
};

const SPORT_LABEL = "🏑⚽ Camogie & LGFA Football";

const runKey   = (week, n)  => `w${week}-run${n}`;
const skillKey = (week, id) => `w${week}-skill-${id}`;
const squadKey = (week)     => `w${week}-squad`;

const PTS = { run:3, skill:2, squad:4 };

function totalPts(checks) {
  let p = 0;
  WEEKS.forEach(w => {
    w.runs.forEach((_,i)  => { if(checks[runKey(w.week,i)])   p+=PTS.run; });
    w.skills.forEach(s    => { if(checks[skillKey(w.week,s.id)]) p+=PTS.skill; });
    if(checks[squadKey(w.week)]) p+=PTS.squad;
  });
  return p;
}

function weekPts(w, checks) {
  let p = 0;
  w.runs.forEach((_,i) => { if(checks[runKey(w.week,i)]) p+=PTS.run; });
  w.skills.forEach(s   => { if(checks[skillKey(w.week,s.id)]) p+=PTS.skill; });
  if(checks[squadKey(w.week)]) p+=PTS.squad;
  return p;
}

function weekMaxPts(w) {
  return w.runs.length*PTS.run + w.skills.length*PTS.skill + PTS.squad;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Lato:wght@400;700;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --g:#a31621; --g2:#c41e2e; --g3:#fde8ea;
  --gold:#d4a017; --gold2:#fff4cc;
  --dark:#1a0a0b; --mid:#5a3a3d; --muted:#9a7070;
  --bg:#f8f3f3; --card:#ffffff;
  --radius:18px; --r-sm:10px;
  --shadow:0 2px 16px rgba(163,22,33,0.10);
  --shadow-lg:0 8px 40px rgba(163,22,33,0.18);
}
body{font-family:'Lato',sans-serif;background:var(--bg);color:var(--dark);min-height:100vh;-webkit-font-smoothing:antialiased}
.shell{max-width:480px;margin:0 auto;padding-bottom:88px}
.hdr{background:var(--g);padding:18px 18px 0;position:sticky;top:0;z-index:100;border-bottom:3px solid var(--gold)}
.hdr-row{display:flex;align-items:center;gap:12px;padding-bottom:14px}
.crest{width:50px;height:50px;border-radius:50%;overflow:hidden;flex-shrink:0;box-shadow:0 0 0 2px var(--gold),0 0 0 4px rgba(255,255,255,0.15);background:white}
.crest img{width:100%;height:100%;object-fit:cover}
.hdr-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;color:white;line-height:1;letter-spacing:0.03em}
.hdr-sub{font-size:11px;color:rgba(255,255,255,0.65);margin-top:2px}
.hdr-player{font-size:12px;color:var(--gold2);font-weight:700;margin-top:2px}
.tabs{display:flex;gap:3px}
.tab-btn{flex:1;padding:10px 2px;border:none;border-radius:10px 10px 0 0;font-family:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:0.04em;cursor:pointer;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.65);transition:all 0.15s;border-bottom:3px solid transparent}
.tab-btn.active{background:var(--bg);color:var(--g);font-size:15px;border-bottom:3px solid var(--bg)}
.auth-wrap{padding:24px 18px}
.auth-hero{background:var(--g);border-radius:var(--radius);padding:30px 24px 26px;margin-bottom:18px;color:white;position:relative;overflow:hidden;text-align:center}
.auth-hero::before{content:'🏑';position:absolute;right:-14px;bottom:-18px;font-size:130px;opacity:0.06;transform:rotate(-10deg);pointer-events:none}
.auth-hero .crest-large{width:72px;height:72px;border-radius:50%;overflow:hidden;margin:0 auto 14px;border:3px solid var(--gold);box-shadow:0 4px 16px rgba(0,0,0,0.3);background:white}
.auth-hero .crest-large img{width:100%;height:100%;object-fit:cover}
.auth-hero h2{font-family:'Barlow Condensed',sans-serif;font-size:40px;color:white;line-height:0.95;letter-spacing:0.02em}
.auth-hero p{font-size:13px;opacity:0.8;margin-top:10px;line-height:1.55}
.pill{display:inline-flex;align-items:center;gap:5px;background:var(--gold);color:var(--dark);font-weight:900;font-size:11px;padding:5px 13px;border-radius:20px;margin-top:12px;letter-spacing:0.04em}
.card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;margin-bottom:14px}
.card-hd{padding:16px 18px 12px;border-bottom:1px solid #f5eaea}
.card-hd h3{font-family:'Barlow Condensed',sans-serif;font-size:22px;letter-spacing:0.02em}
.card-hd p{font-size:12px;color:var(--mid);margin-top:3px}
.card-bd{padding:16px 18px}
.lbl{display:block;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:5px}
.inp{width:100%;padding:12px 14px;border:2px solid #e8d8d8;border-radius:var(--r-sm);font-family:'Lato',sans-serif;font-size:15px;outline:none;transition:border 0.2s;margin-bottom:13px;background:#fdfafa;color:var(--dark)}
.inp:focus{border-color:var(--g);background:#fff}
.inp:-webkit-autofill,.inp:-webkit-autofill:hover,.inp:-webkit-autofill:focus{-webkit-text-fill-color:var(--dark);-webkit-box-shadow:0 0 0px 1000px #fdfafa inset;transition:background-color 5000s ease-in-out 0s}
.btn{width:100%;padding:14px;border:none;border-radius:var(--r-sm);cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:22px;letter-spacing:0.06em;transition:all 0.18s;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-green{background:var(--g);color:white}
.btn-green:hover{background:#7d1018}
.btn-gold{background:var(--gold);color:var(--dark)}
.btn-sm{width:auto;padding:8px 16px;font-size:16px;border-radius:8px}
.btn-ghost{background:transparent;border:2px solid #e8d8d8;color:var(--mid);font-size:16px}
.btn-ghost:hover{border-color:var(--g);color:var(--g)}
.btn-danger{background:#8b0000;color:white;font-size:16px}
.err{font-size:13px;color:#a31621;margin-bottom:10px;padding:10px 13px;background:#fde8ea;border-radius:8px}
.link-btn{background:none;border:none;color:var(--g);font-family:'Lato',sans-serif;font-size:14px;font-weight:700;cursor:pointer;text-decoration:underline;padding:0}
.home-wrap{padding:14px 16px}
.welcome-card{background:linear-gradient(135deg,var(--g) 0%,var(--g2) 100%);border-radius:var(--radius);padding:22px 20px;margin-bottom:14px;color:white;position:relative;overflow:hidden}
.welcome-card::after{content:'🏑';position:absolute;right:-8px;bottom:-12px;font-size:100px;opacity:0.08;pointer-events:none}
.welcome-card h2{font-family:'Barlow Condensed',sans-serif;font-size:32px;color:white;letter-spacing:0.02em}
.welcome-card .player-name{font-size:16px;font-weight:700;margin-top:2px;color:var(--gold2)}
.pts-row{display:flex;gap:10px;margin-top:16px}
.pts-box{flex:1;background:rgba(255,255,255,0.12);border-radius:12px;padding:12px 10px;text-align:center}
.pts-box .num{font-family:'Barlow Condensed',sans-serif;font-size:36px;color:var(--gold2);line-height:1}
.pts-box .lbl2{font-size:10px;color:rgba(255,255,255,0.65);font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-top:2px}
.week-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}
.wk-tile{background:var(--card);border-radius:12px;padding:10px 6px;text-align:center;box-shadow:var(--shadow);cursor:pointer;transition:all 0.15s;border:2px solid transparent}
.wk-tile:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.wk-tile.active{border-color:var(--g)}
.wk-tile .wn{font-family:'Barlow Condensed',sans-serif;font-size:18px;color:var(--g)}
.wk-tile .wp{font-size:11px;color:var(--muted);font-weight:700}
.wk-tile .wbar{height:4px;border-radius:2px;margin-top:6px;background:#f0dede;overflow:hidden}
.wk-tile .wbar-fill{height:100%;border-radius:2px;background:var(--g);transition:width 0.3s}
.wk-detail{padding:14px 16px}
.wk-hero{border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);margin-bottom:14px}
.wk-hero-hd{padding:16px 18px 14px}
.phase-chip{display:inline-block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;padding:3px 11px;border-radius:20px;color:white;margin-bottom:6px}
.wk-hero-hd h2{font-family:'Barlow Condensed',sans-serif;font-size:28px;letter-spacing:0.02em}
.wk-hero-hd .sport-badge{font-size:13px;font-weight:700;margin-top:4px}
.wk-hero-hd .wk-dates{font-size:12px;opacity:0.65;margin-top:2px}
.runs-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.run-chip{font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(0,0,0,0.08);cursor:pointer;transition:all 0.15s;border:2px solid transparent}
.run-chip.done{background:var(--g);color:white;border-color:var(--g)}
.run-chip:hover:not(.done){background:rgba(0,0,0,0.14)}
.prog-bar-bg{height:6px;background:#f0dede;border-radius:3px;overflow:hidden;margin:12px 18px 4px}
.prog-bar-fill{height:100%;border-radius:3px;transition:width 0.4s ease}
.prog-lbl{font-size:11px;color:var(--muted);font-weight:700;padding:0 18px 12px}
.skill-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:12px;overflow:hidden}
.skill-hd{display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;transition:background 0.12s;user-select:none}
.skill-hd:hover{background:#fdf5f5}
.skill-check{width:28px;height:28px;border-radius:50%;border:2px solid #e0c0c0;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;font-size:14px}
.skill-check.done{background:var(--g);border-color:var(--g);color:white}
.skill-hd-text{flex:1}
.skill-type{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted)}
.skill-name{font-size:15px;font-weight:700;margin-top:1px}
.skill-hd.done-hd .skill-name{text-decoration:line-through;color:var(--muted)}
.pts-badge{font-size:11px;font-weight:900;color:var(--g);background:var(--g3);padding:3px 9px;border-radius:10px;flex-shrink:0}
.skill-hd.done-hd .pts-badge{color:var(--muted);background:#eee}
.expand-icon{font-size:18px;color:var(--muted);transition:transform 0.2s;flex-shrink:0}
.expand-icon.open{transform:rotate(180deg)}
.skill-body{border-top:1px solid #f5eaea;padding:14px 16px}
.skill-desc{font-size:13px;color:var(--mid);line-height:1.6;margin-bottom:12px}
.yt-wrap{border-radius:10px;overflow:hidden;position:relative;padding-bottom:56.25%;background:#000;margin-bottom:12px}
.yt-wrap iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:none}
.yt-placeholder{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#4a0a0e 0%,#1a0405 100%);color:white;cursor:pointer;gap:8px}
.yt-play{width:52px;height:52px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:22px}
.yt-note{font-size:12px;opacity:0.7;text-align:center;padding:0 16px}
.mark-btn{width:100%;padding:11px;border:none;border-radius:10px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:18px;letter-spacing:0.05em;transition:all 0.2s}
.mark-done{background:var(--g);color:white}
.mark-done:hover{background:#7d1018}
.mark-undone{background:#eee;color:var(--mid)}
.mark-undone:hover{background:#e0e0e0}
.squad-card{background:linear-gradient(135deg,#7d1018 0%,var(--g) 100%);border-radius:var(--radius);box-shadow:var(--shadow-lg);margin-bottom:12px;overflow:hidden}
.squad-hd{display:flex;align-items:center;gap:12px;padding:16px 18px;cursor:pointer;user-select:none}
.squad-icon{font-size:26px;flex-shrink:0}
.squad-hd-text .squad-type{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.6)}
.squad-hd-text .squad-name{font-family:'Barlow Condensed',sans-serif;font-size:20px;color:white;letter-spacing:0.02em}
.squad-pts{font-size:12px;font-weight:900;color:var(--dark);background:var(--gold);padding:3px 10px;border-radius:10px;flex-shrink:0}
.squad-body{border-top:1px solid rgba(255,255,255,0.12);padding:14px 18px}
.squad-desc{font-size:13px;color:rgba(255,255,255,0.85);line-height:1.6;margin-bottom:14px}
.squad-cta{font-size:12px;color:var(--gold2);font-weight:700;margin-bottom:12px}
.squad-mark{width:100%;padding:11px;border:none;border-radius:10px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:18px;letter-spacing:0.05em;transition:all 0.2s;background:var(--gold);color:var(--dark)}
.squad-mark:hover{background:#b88a10}
.squad-mark.done{background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.7)}
.admin-wrap{padding:14px 16px}
.admin-banner{background:var(--dark);border-radius:var(--radius);padding:16px 18px;margin-bottom:14px;display:flex;align-items:center;gap:12px}
.admin-banner h2{font-family:'Barlow Condensed',sans-serif;font-size:24px;color:var(--gold);letter-spacing:0.03em}
.admin-banner p{font-size:12px;color:rgba(255,255,255,0.55);margin-top:2px}
.section-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;letter-spacing:0.02em;margin-bottom:10px;color:var(--g)}
.player-row{display:flex;align-items:center;gap:10px;background:var(--card);border-radius:12px;padding:12px 14px;margin-bottom:8px;box-shadow:var(--shadow)}
.player-av{width:36px;height:36px;border-radius:50%;background:var(--g);color:white;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:18px;flex-shrink:0}
.player-info{flex:1}
.player-name{font-size:15px;font-weight:700}
.player-pts{font-family:'Barlow Condensed',sans-serif;font-size:20px;color:var(--g)}
.player-pts small{font-family:'Lato',sans-serif;font-size:10px;color:var(--muted);font-weight:700}
.prog-mini{height:4px;border-radius:2px;background:#f0dede;overflow:hidden;margin-top:4px}
.prog-mini-fill{height:100%;border-radius:2px;background:var(--g)}
.add-form{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px 18px;margin-bottom:14px}
.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--g);color:white;padding:10px 22px;border-radius:24px;font-weight:700;font-size:14px;box-shadow:0 6px 28px rgba(163,22,33,0.35);z-index:9999;white-space:nowrap;pointer-events:none;animation:tin 0.25s ease}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.empty{text-align:center;padding:52px 24px;color:var(--muted)}
.empty .icon{font-size:52px;margin-bottom:12px}
.loader{display:flex;align-items:center;justify-content:center;padding:40px;color:var(--muted)}
.spinner{width:28px;height:28px;border:3px solid var(--g3);border-top-color:var(--g);border-radius:50%;animation:spin 0.7s linear infinite;margin-right:10px}
@keyframes spin{to{transform:rotate(360deg)}}
.divider{text-align:center;font-size:12px;color:var(--muted);margin:14px 0;position:relative}
.divider::before,.divider::after{content:'';position:absolute;top:50%;width:38%;height:1px;background:#e8d8d8}
.divider::before{left:0}.divider::after{right:0}
select.inp{appearance:none;cursor:pointer}
.tc-box{background:#f9f0f0;border-radius:10px;padding:14px 16px;margin-bottom:14px;border:1px solid #f0dede}
.tc-box h4{font-family:'Barlow Condensed',sans-serif;font-size:16px;color:var(--g);letter-spacing:0.02em;margin-bottom:8px}
.tc-section{margin-bottom:10px}
.tc-section:last-child{margin-bottom:0}
.tc-section strong{display:block;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:var(--mid);margin-bottom:3px}
.tc-section p{font-size:12px;color:var(--mid);line-height:1.6}
.tc-check-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;cursor:pointer}
.tc-check-row input[type="checkbox"]{width:18px;height:18px;accent-color:var(--g);flex-shrink:0;margin-top:1px;cursor:pointer}
.tc-check-row span{font-size:13px;color:var(--mid);line-height:1.5}
`;

export default function App() {
  const [session, setSession]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("home");
  const [toast, setToast]       = useState(null);
  const [player, setPlayer]     = useState(null);
  const [checks, setChecks]     = useState({});
  const [allPlayers, setAllPlayers] = useState([]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setPlayer(null); setChecks({}); return; }
    loadPlayerData();
    if (session.user.email === ADMIN_EMAIL) loadAllPlayers();
  }, [session]);

  async function loadPlayerData() {
    const { data: link } = await sb
      .from("parent_players")
      .select("player_id, players(id,name)")
      .eq("user_id", session.user.id)
      .maybeSingle();
    if (link?.players) {
      setPlayer(link.players);
      const { data: comps } = await sb
        .from("task_completions")
        .select("task_key")
        .eq("player_id", link.players.id);
      const c = {};
      comps?.forEach(r => { c[r.task_key] = true; });
      setChecks(c);
    }
  }

  async function loadAllPlayers() {
    const { data } = await sb.from("players").select("id,name").order("name");
    setAllPlayers(data || []);
  }

 async function toggleTask(taskKey, pts, label) {
    if (!player) return;
    const done = checks[taskKey];
    if (done) {
      const { error } = await sb
        .from("task_completions")
        .delete()
        .eq("player_id", player.id)
        .eq("task_key", taskKey);
      if (!error) {
        setChecks(c => { const n={...c}; delete n[taskKey]; return n; });
      }
    } else {
      const { error } = await sb
        .from("task_completions")
        .insert({ player_id: player.id, task_key: taskKey });
      if (!error) {
        setChecks(c => ({ ...c, [taskKey]: true }));
        showToast(`✅ ${label} logged! +${pts} pts`);
      }
    }
  }

  async function linkPlayer(playerId) {
    await sb.from("parent_players").insert({ user_id: session.user.id, player_id: playerId });
    await loadPlayerData();
    showToast("🎉 Player linked!");
    setTab("home");
  }

  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const pts     = totalPts(checks);
  const weeksDone = WEEKS.filter(w => weekPts(w, checks) === weekMaxPts(w)).length;

  if (loading) return (
    <><style>{CSS}</style>
    <div className="loader"><div className="spinner"/><span>Loading…</span></div></>
  );

  const TABS = [
    { id:"home", label:"Home" },
    { id:"plan", label:"Plan" },
    { id:"scores", label:"Scores" },
    ...(isAdmin ? [{ id:"admin", label:"⚙️ Admin" }] : []),
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        {session && (
          <div className="hdr">
            <div className="hdr-row">
              <div className="crest"><img src={LOGO} alt="Fingallians GAA crest" /></div>
              <div>
                <div className="hdr-title">FINGALLIANS GAA</div>
                <div className="hdr-sub">2015 Girls · Summer Challenge 2026</div>
                {player && <div className="hdr-player">👤 {player.name} · {pts} pts</div>}
              </div>
            </div>
            <div className="tabs">
              {TABS.map(t => (
                <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!session && <AuthScreen showToast={showToast} />}
        {session && !player && !isAdmin && (
          <LinkPlayerScreen userId={session.user.id} onLink={linkPlayer} showToast={showToast} />
        )}
        {session && (player || isAdmin) && tab === "home" && (
          <HomeTab player={player} checks={checks} pts={pts} weeksDone={weeksDone} onNav={() => setTab("plan")} onToggle={toggleTask} showToast={showToast} />
        )}
        {session && (player || isAdmin) && tab === "plan" && (
          <PlanTab checks={checks} onToggle={toggleTask} player={player} />
        )}
        {session && (player || isAdmin) && tab === "scores" && (
          <ScoresTab player={player} />
        )}
        {session && isAdmin && tab === "admin" && (
          <AdminTab allPlayers={allPlayers} session={session} onRefresh={loadAllPlayers} showToast={showToast} />
        )}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

function AuthScreen({ showToast }) {
  const [mode, setMode]               = useState("login");
  const [email, setEmail]             = useState("");
  const [pw, setPw]                   = useState("");
  const [pw2, setPw2]                 = useState("");
  const [err, setErr]                 = useState("");
  const [busy, setBusy]               = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [showPw2, setShowPw2]         = useState(false);
  const [tcAgreed, setTcAgreed]       = useState(false);
  const [showTc, setShowTc]           = useState(false);

  async function submit() {
    setErr(""); setBusy(true);
    if (mode === "signup") {
      if (pw !== pw2) { setErr("Passwords don't match"); setBusy(false); return; }
      if (pw.length < 6) { setErr("Password must be at least 6 characters"); setBusy(false); return; }
      if (!tcAgreed) { setErr("Please agree to the Terms & Conditions to continue"); setBusy(false); return; }
      const { error } = await sb.auth.signUp({ email, password: pw,
        options: { emailRedirectTo: "https://fingallians-girls.vercel.app" }
      });
      if (error) { setErr(error.message); setBusy(false); return; }
      setSignedUpEmail(email);
      setMode("verify");
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password: pw });
      if (error) { setErr("Incorrect email or password."); setBusy(false); return; }
    }
    setBusy(false);
  }

  if (mode === "verify") {
    return (
      <div className="auth-wrap">
        <div className="auth-hero">
          <div className="crest-large"><img src={LOGO} alt="Fingallians GAA" /></div>
          <h2>SUMMER FITNESS CHALLENGE</h2>
          <p>June–August 2026 · 8 Weeks<br/>Runs · Skills · Squad Sessions</p>
        </div>
        <div className="card">
          <div className="card-bd" style={{textAlign:"center",padding:"28px 20px"}}>
            <div style={{fontSize:52,marginBottom:12}}>📧</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,letterSpacing:"0.02em",marginBottom:10}}>CHECK YOUR EMAIL</div>
            <p style={{fontSize:14,color:"var(--mid)",lineHeight:1.6,marginBottom:20}}>
              We've sent a confirmation link to:<br/>
              <strong style={{color:"var(--dark)"}}>{signedUpEmail}</strong>
            </p>
            <div style={{background:"var(--g3)",borderRadius:10,padding:"14px 16px",marginBottom:20,textAlign:"left"}}>
              <div style={{fontSize:13,color:"var(--mid)",lineHeight:1.7}}>
                1️⃣ &nbsp;Open the email from Fingallians GAA<br/>
                2️⃣ &nbsp;Click the <strong>Confirm your email</strong> link<br/>
                3️⃣ &nbsp;Come back here and sign in
              </div>
            </div>
            <p style={{fontSize:12,color:"var(--muted)",marginBottom:20}}>Can't find it? Check your spam/junk folder.</p>
            <button className="btn btn-green" onClick={()=>{setMode("login");setEmail(signedUpEmail);setPw("");setPw2("");}}>
              GO TO SIGN IN →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <div className="crest-large"><img src={LOGO} alt="Fingallians GAA" /></div>
        <h2>SUMMER FITNESS CHALLENGE</h2>
        <p>June–August 2026 · 8 Weeks<br/>Camogie · LGFA Football · Squad Sessions</p>
        <div className="pill">🏆 Prize for Most Improved Player</div>
      </div>
      <div className="card">
        <div className="card-hd">
          <h3>{mode === "login" ? "Parent Login" : "Create Account"}</h3>
          <p>{mode === "login" ? "Sign in to track your daughter's progress" : "Register to get started"}</p>
        </div>
        <div className="card-bd">
          {err && <div className="err">{err}</div>}
          <label className="lbl">Email</label>
          <input className="inp" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
          <label className="lbl">Password</label>
          <div style={{position:"relative",marginBottom:0}}>
            <input className="inp" type={showPw?"text":"password"} placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{marginBottom:13,paddingRight:44}} />
            <button type="button" onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:12,background:"none",border:"none",cursor:"pointer",fontSize:18,color:"var(--muted)",padding:0}}>
              {showPw?"🙈":"👁️"}
            </button>
          </div>
          {mode === "signup" && <>
            <label className="lbl">Confirm Password</label>
            <div style={{position:"relative"}}>
              <input className="inp" type={showPw2?"text":"password"} placeholder="••••••••" value={pw2} onChange={e=>setPw2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{marginBottom:13,paddingRight:44}} />
              <button type="button" onClick={()=>setShowPw2(v=>!v)} style={{position:"absolute",right:12,top:12,background:"none",border:"none",cursor:"pointer",fontSize:18,color:"var(--muted)",padding:0}}>
                {showPw2?"🙈":"👁️"}
              </button>
            </div>
            <div className="tc-box">
              <h4 onClick={()=>setShowTc(v=>!v)} style={{cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                Terms & Conditions <span style={{fontSize:14,fontFamily:"'Lato',sans-serif"}}>{showTc?"▲":"▼ Read"}</span>
              </h4>
              {showTc && <>
                <div className="tc-section">
                  <strong>Exercise Guidelines</strong>
                  <p>The activities in this challenge are guidelines only. Coaches encourage all players to participate at a level that suits their individual fitness and ability. Girls should never push through pain or discomfort. Parents and players are responsible for deciding what level of activity is appropriate. Fingallians GAA accepts no liability for any injury sustained while participating in this challenge.</p>
                </div>
                <div className="tc-section">
                  <strong>Data & Privacy</strong>
                  <p>To use this app we store your child's first and last name and your email address. No other personal information is collected or stored. Your data is not shared with any third party and is used solely to manage participation in the 2026 Summer Challenge. You can request deletion of your data at any time by emailing <strong>Fingallians2015GirlsChallenge@gmail.comm</strong>.</p>
                </div>
                <div className="tc-section">
                  <strong>Participation</strong>
                  <p>This challenge is run voluntarily by Fingallians 2015 Girls coaches for the benefit of the players. Points and prizes are awarded in good faith. The club reserves the right to amend the challenge at any time.</p>
                </div>
              </>}
            </div>
            <label className="tc-check-row">
              <input type="checkbox" checked={tcAgreed} onChange={e=>setTcAgreed(e.target.checked)} />
              <span>I have read and agree to the <button type="button" className="link-btn" onClick={()=>setShowTc(true)} style={{fontSize:13}}>Terms & Conditions</button> and confirm I am the parent or guardian of the player I am registering.</span>
            </label>
          </>}
          <button className="btn btn-green" onClick={submit} disabled={busy}>
            {busy ? "…" : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
          <div className="divider" style={{marginTop:16}}>{mode==="login"?"No account yet?":"Already registered?"}</div>
          <div style={{textAlign:"center",marginTop:10}}>
            <button className="link-btn" onClick={()=>{setMode(m=>m==="login"?"signup":"login");setErr("")}}>
              {mode==="login"?"Create a new account →":"← Back to login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkPlayerScreen({ onLink }) {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.from("players").select("id,name").order("name").then(({ data }) => {
      setPlayers(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="auth-wrap">
      <div className="card">
        <div className="card-hd">
          <h3>Link Your Daughter</h3>
          <p>Select your daughter from the list below to get started</p>
        </div>
        <div className="card-bd">
          {loading ? <div className="loader"><div className="spinner"/>Loading players…</div> : (
            players.length === 0 ? (
              <div className="empty">
                <div className="icon">⏳</div>
                <p>No players added yet.<br/>The coaches will add the squad soon!</p>
              </div>
            ) : (
              <>
                <label className="lbl">Select Player</label>
                <select className="inp" value={selected} onChange={e=>setSelected(e.target.value)}>
                  <option value="">— Choose your daughter —</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button className="btn btn-green" onClick={()=>selected&&onLink(selected)} disabled={!selected}>
                  CONFIRM & CONTINUE
                </button>
                <p style={{fontSize:12,color:"var(--muted)",marginTop:12,textAlign:"center"}}>
                  Can't see your daughter's name? Message the coaches — they'll add her to the list.
                </p>
              </>
            )
          )}
        </div>
      </div>
      <div style={{textAlign:"center",marginTop:8}}>
        <button className="link-btn" onClick={()=>sb.auth.signOut()}>Sign out</button>
      </div>
    </div>
  );
}

function HomeTab({ player, checks, pts, weeksDone, onNav, onToggle }) {
  const [activeWk, setActiveWk] = useState(0);
  const w = WEEKS[activeWk];
  const ps = PHASE_STYLE[w.phase];
  const wPts = weekPts(w, checks);
  const wMax = weekMaxPts(w);
  const pct  = Math.round((wPts / wMax) * 100);

  useEffect(() => {
    const start = new Date("2026-06-29");
    const now   = new Date();
    const diff  = Math.floor((now - start) / (7*24*60*60*1000));
    setActiveWk(Math.min(Math.max(diff, 0), 7));
  }, []);

  return (
    <div className="home-wrap">
      <div className="welcome-card">
        <h2>SUMMER CHALLENGE</h2>
        {player && <div className="player-name">👤 {player.name}</div>}
        <div className="pts-row">
          <div className="pts-box"><div className="num">{pts}</div><div className="lbl2">Total Points</div></div>
          <div className="pts-box"><div className="num">{weeksDone}</div><div className="lbl2">Weeks Done</div></div>
          <div className="pts-box"><div className="num">{8-weeksDone}</div><div className="lbl2">Weeks Left</div></div>
        </div>
      </div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,color:"var(--g)",marginBottom:10,letterSpacing:"0.02em"}}>SELECT WEEK</div>
      <div className="week-grid">
        {WEEKS.map((wk,i) => {
          const p2  = weekPts(wk,checks);
          const max = weekMaxPts(wk);
          const ps2 = PHASE_STYLE[wk.phase];
          return (
            <div key={i} className={`wk-tile${activeWk===i?" active":""}`} style={activeWk===i?{borderColor:ps2.accent}:{}} onClick={()=>setActiveWk(i)}>
              <div className="wn" style={{color:ps2.accent}}>W{wk.week}</div>
              <div className="wp">{wk.dates.split("–")[0]}</div>
              <div className="wbar"><div className="wbar-fill" style={{width:`${Math.round(p2/max*100)}%`,background:ps2.accent}}/></div>
            </div>
          );
        })}
      </div>
      <WeekDetail w={w} ps={ps} pct={pct} wPts={wPts} wMax={wMax} checks={checks} onToggle={onToggle} player={player} />
      <button className="btn btn-ghost" style={{marginTop:4}} onClick={onNav}>VIEW FULL 8-WEEK PLAN →</button>
      <div style={{background:"linear-gradient(135deg,#7d1018 0%,var(--g) 100%)",borderRadius:"var(--radius)",padding:"16px 18px",marginTop:12,color:"white",textAlign:"center"}}>
        <div style={{fontSize:24,marginBottom:6}}>📱🏑⚽</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,letterSpacing:"0.02em",marginBottom:6}}>SHARE YOUR SKILLS!</div>
        <div style={{fontSize:13,opacity:0.85,lineHeight:1.6,marginBottom:10}}>
          Filmed yourself practising? Send your videos to the coaches — we'd love to see the girls putting in the work!
        </div>
        <a href="mailto:Fingallians2015GirlsChallenge@gmail.comm" style={{display:"inline-block",background:"var(--gold)",color:"var(--dark)",fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,letterSpacing:"0.04em",fontWeight:900,padding:"8px 16px",borderRadius:20,textDecoration:"none"}}>
          📧 Fingallians2015GirlsChallenge@gmail.comm
        </a>
      </div>
      <div style={{textAlign:"center",marginTop:14,paddingBottom:8}}>
        <button className="link-btn" style={{color:"var(--muted)",fontSize:13}} onClick={()=>sb.auth.signOut()}>Sign out</button>
      </div>
    </div>
  );
}

function WeekDetail({ w, ps, pct, wPts, wMax, checks, onToggle, player }) {
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [expandedSquad, setExpandedSquad] = useState(false);
  const [playingVideo, setPlayingVideo]   = useState(null);
  const canToggle = !!player;

  return (
    <div>
      <div className="wk-hero">
        <div className="wk-hero-hd" style={{background:ps.bg}}>
          <div className="phase-chip" style={{background:ps.accent}}>{w.phase} Phase</div>
          <h2 style={{color:ps.accent}}>Week {w.week}</h2>
          <div className="sport-badge" style={{color:ps.accent}}>{SPORT_LABEL}</div>
          <div className="wk-dates" style={{color:ps.accent}}>{w.dates}</div>
          <div className="runs-chips">
            {w.runs.map((r,i) => {
              const k = runKey(w.week, i);
              const done = !!checks[k];
              return (
                <div key={i} className={`run-chip${done?" done":""}`}
                  style={!done?{background:ps.chip,color:ps.accent,borderColor:"transparent"}:{}}
                  onClick={()=>canToggle&&onToggle(k,PTS.run,`${r.label} (${r.distance})`)}>
                  🏃 {r.label}: {r.distance} {done?"✓":""}
                </div>
              );
            })}
          </div>
        </div>
        <div className="prog-bar-bg">
          <div className="prog-bar-fill" style={{width:`${pct}%`,background:ps.accent}}/>
        </div>
        <div className="prog-lbl">{wPts}/{wMax} pts this week · {pct}% complete</div>
      </div>

      {w.skills.map((s) => {
        const k    = skillKey(w.week, s.id);
        const done = !!checks[k];
        const open = expandedSkill === s.id;
        return (
          <div key={s.id} className="skill-card">
            <div className={`skill-hd${done?" done-hd":""}`} onClick={()=>setExpandedSkill(open?null:s.id)}>
              <div className={`skill-check${done?" done":""}`}>{done?"✓":""}</div>
              <div className="skill-hd-text">
                <div className="skill-type">🎯 Solo Skill · +{PTS.skill} pts</div>
                <div className="skill-name">{s.label}</div>
              </div>
              <div className="pts-badge">+{PTS.skill}</div>
              <div className={`expand-icon${open?" open":""}`}>⌄</div>
            </div>
            {open && (
              <div className="skill-body">
                <p className="skill-desc">{s.desc}</p>
                <VideoEmbed ytId={s.youtube_id} playing={playingVideo===s.id} onPlay={()=>setPlayingVideo(s.id)} />
                {canToggle && (
                  <button className={`mark-btn${done?" mark-undone":" mark-done"}`} onClick={()=>onToggle(k,PTS.skill,s.label)}>
                    {done?"✕ MARK INCOMPLETE":"✓ MARK COMPLETE"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {(() => {
        const k    = squadKey(w.week);
        const done = !!checks[k];
        return (
          <div className="squad-card">
            <div className="squad-hd" onClick={()=>setExpandedSquad(v=>!v)}>
              <div className="squad-icon">👥</div>
              <div className="squad-hd-text">
                <div className="squad-type">Squad Session · +{PTS.squad} pts</div>
                <div className="squad-name">{w.squad.label}</div>
              </div>
              <div className="squad-pts">+{PTS.squad}</div>
              <div style={{fontSize:18,color:"rgba(255,255,255,0.5)",transition:"transform 0.2s",transform:expandedSquad?"rotate(180deg)":"none"}}>⌄</div>
            </div>
            {expandedSquad && (
              <div className="squad-body">
                <p className="squad-desc">{w.squad.desc}</p>
                <div className="squad-cta">👥 Get 3–4 girls together — this is your highest scoring task!</div>
                <VideoEmbed ytId={w.squad.youtube_id} playing={playingVideo==="squad"} onPlay={()=>setPlayingVideo("squad")} dark />
                {canToggle && (
                  <button className={`squad-mark${done?" done":""}`} onClick={()=>onToggle(k,PTS.squad,w.squad.label)}>
                    {done?"✕ MARK INCOMPLETE":"✓ SQUAD SESSION DONE"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function VideoEmbed({ ytId, playing, onPlay, dark }) {
  const isPlaceholder = !ytId || ytId.startsWith("Demo");
  return (
    <div className="yt-wrap" style={{marginBottom:12}}>
      {(isPlaceholder || !playing) ? (
        <div className="yt-placeholder" style={dark?{background:"rgba(0,0,0,0.35)"}:{}} onClick={!isPlaceholder?onPlay:undefined}>
          <div className="yt-play">{isPlaceholder?"🎬":"▶"}</div>
          <div className="yt-note">
            {isPlaceholder ? "Video demo coming soon" : "Tap to watch drill demonstration"}
          </div>
        </div>
      ) : (
        <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`} allow="autoplay; encrypted-media" allowFullScreen />
      )}
    </div>
  );
}

function PlanTab({ checks, onToggle, player }) {
  return (
    <div className="wk-detail">
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,color:"var(--g)",marginBottom:12,letterSpacing:"0.02em"}}>
        FULL 8-WEEK PROGRAMME
      </div>
      {WEEKS.map((w,i) => {
        const ps  = PHASE_STYLE[w.phase];
        const wP  = weekPts(w,checks);
        const wM  = weekMaxPts(w);
        const pct = Math.round((wP/wM)*100);
        return (
          <div key={i} style={{marginBottom:24}}>
            <WeekDetail w={w} ps={ps} pct={pct} wPts={wP} wMax={wM} checks={checks} onToggle={onToggle} player={player} />
          </div>
        );
      })}
      <div className="tc-box" style={{marginTop:8}}>
        <h4 style={{marginBottom:12}}>Terms & Conditions</h4>
        <div className="tc-section">
          <strong>Exercise Guidelines</strong>
          <p>The activities in this challenge are guidelines only. Coaches encourage all players to participate at a level that suits their individual fitness and ability. Girls should never push through pain or discomfort. Parents and players are responsible for deciding what level of activity is appropriate. Fingallians GAA accepts no liability for any injury sustained while participating in this challenge.</p>
        </div>
        <div className="tc-section">
          <strong>Data & Privacy</strong>
          <p>To use this app we store your child's first and last name and your email address. No other personal information is collected or stored. Your data is not shared with any third party and is used solely to manage participation in the 2026 Summer Challenge. You can request deletion of your data at any time by emailing <strong>Fingallians2015GirlsChallenge@gmail.comm</strong>.</p>
        </div>
        <div className="tc-section">
          <strong>Participation</strong>
          <p>This challenge is run voluntarily by Fingallians 2015 Girls coaches for the benefit of the players. Points and prizes are awarded in good faith. The club reserves the right to amend the challenge at any time.</p>
        </div>
      </div>
    </div>
  );
}

function ScoresTab({ player }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: players } = await sb.from("players").select("id,name");
      const { data: comps }   = await sb.from("task_completions").select("player_id,task_key");
      if (!players) return;
      const statsMap = {};
      comps?.forEach(r => {
        if (!statsMap[r.player_id]) statsMap[r.player_id] = {};
        statsMap[r.player_id][r.task_key] = true;
      });
      const rows = players.map(p => ({
        id: p.id,
        name: p.name,
        pts: totalPts(statsMap[p.id] || {}),
      })).sort((a,b) => b.pts - a.pts);
      setLeaderboard(rows);
      setLoading(false);
    }
    load();
  }, []);

  const rankEmoji = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}`;
  const maxPossible = WEEKS.reduce((a,w) => a + weekMaxPts(w), 0);

  return (
    <div style={{padding:"14px 16px"}}>
      <div style={{background:"linear-gradient(135deg,var(--g) 0%,#4a0a0e 100%)",borderRadius:"var(--radius)",padding:"22px 20px",marginBottom:14,color:"white",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-10,bottom:-14,fontSize:100,opacity:0.07,pointerEvents:"none"}}>🏆</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,letterSpacing:"0.02em",color:"var(--gold)"}}>LEADERBOARD</div>
        <div style={{fontSize:12,opacity:0.75,marginTop:4}}>Fingallians 2015 Girls · Summer Challenge 2026</div>
        <div style={{fontSize:11,opacity:0.6,marginTop:4}}>Updates live as sessions are logged</div>
      </div>
      {loading ? (
        <div className="loader"><div className="spinner"/>Loading scores…</div>
      ) : leaderboard.map((p, i) => {
        const isYou = player?.id === p.id;
        const pct   = Math.round((p.pts / maxPossible) * 100);
        return (
          <div key={p.id} style={{
            display:"flex",alignItems:"center",gap:12,
            background: isYou ? "var(--g3)" : "white",
            border: isYou ? "2px solid var(--g)" : "2px solid transparent",
            borderRadius:14,padding:"12px 14px",marginBottom:8,
            boxShadow:"0 2px 10px rgba(163,22,33,0.08)"
          }}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,width:32,textAlign:"center",flexShrink:0}}>{rankEmoji(i)}</div>
            <div style={{width:36,height:36,borderRadius:"50%",background:"var(--g)",color:"var(--gold)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,flexShrink:0}}>{p.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15}}>{p.name}{isYou?" 👈":""}</div>
              <div style={{height:4,background:"#f0dede",borderRadius:2,marginTop:5,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:i===0?"var(--gold)":"var(--g)",borderRadius:2,transition:"width 0.4s"}}/>
              </div>
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,color:"var(--g)",flexShrink:0}}>
              {p.pts} <span style={{fontFamily:"'Lato',sans-serif",fontSize:11,color:"var(--muted)",fontWeight:600}}>pts</span>
            </div>
          </div>
        );
      })}
      <div style={{textAlign:"center",fontSize:12,color:"var(--muted)",marginTop:16,lineHeight:1.7}}>
        🏆 Most Improved Player prize awarded at end of summer<br/>based on skills assessment before &amp; after the challenge
      </div>
    </div>
  );
}

function AdminTab({ allPlayers, onRefresh, showToast }) {
  const [newName, setNewName]         = useState("");
  const [adding, setAdding]           = useState(false);
  const [playerStats, setPlayerStats] = useState({});
  const [claimedIds, setClaimedIds]   = useState(new Set());

  useEffect(() => {
    async function load() {
      const { data: comps } = await sb.from("task_completions").select("player_id,task_key");
      const stats = {};
      comps?.forEach(r => {
        if (!stats[r.player_id]) stats[r.player_id] = {};
        stats[r.player_id][r.task_key] = true;
      });
      setPlayerStats(stats);
      const { data: links } = await sb.from("parent_players").select("player_id");
      setClaimedIds(new Set(links?.map(l => l.player_id) || []));
    }
    load();
  }, [allPlayers]);

  async function addPlayer() {
    if (!newName.trim()) return;
    setAdding(true);
    const { error } = await sb.from("players").insert({ name: newName.trim() });
    if (error) { showToast("❌ Error adding player"); }
    else { showToast(`✅ ${newName.trim()} added!`); setNewName(""); onRefresh(); }
    setAdding(false);
  }

  async function removePlayer(id, name) {
    if (!window.confirm(`Remove ${name} from the squad list?`)) return;
    await sb.from("players").delete().eq("id", id);
    showToast(`🗑️ ${name} removed`);
    onRefresh();
  }

  const maxPossible = WEEKS.reduce((a,w) => a + weekMaxPts(w), 0);
  const claimed   = allPlayers.filter(p => claimedIds.has(p.id));
  const unclaimed = allPlayers.filter(p => !claimedIds.has(p.id));

  return (
    <div className="admin-wrap">
      <div className="admin-banner">
        <div style={{fontSize:28}}>⚙️</div>
        <div><h2>ADMIN PANEL</h2><p>Manage squad · View completions</p></div>
      </div>
      <div className="section-title">ADD PLAYER</div>
      <div className="add-form">
        <label className="lbl">Player Name</label>
        <input className="inp" placeholder="e.g. Aoibhinn Farrelly" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPlayer()} />
        <button className="btn btn-green btn-sm" onClick={addPlayer} disabled={adding}>{adding?"…":"+ ADD TO SQUAD"}</button>
      </div>
      <div className="section-title">REGISTRATION STATUS</div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <div style={{flex:1,background:"#e8f5e9",borderRadius:12,padding:"12px 14px",textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,color:"#2e7d32"}}>{claimed.length}</div>
          <div style={{fontSize:11,fontWeight:700,color:"#2e7d32",textTransform:"uppercase",letterSpacing:"0.06em"}}>Registered ✅</div>
        </div>
        <div style={{flex:1,background:"#fff3e0",borderRadius:12,padding:"12px 14px",textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,color:"#e65100"}}>{unclaimed.length}</div>
          <div style={{fontSize:11,fontWeight:700,color:"#e65100",textTransform:"uppercase",letterSpacing:"0.06em"}}>Not Yet ⏳</div>
        </div>
      </div>
      {unclaimed.length > 0 && <>
        <div style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.07em",color:"#e65100",marginBottom:8}}>⏳ NOT YET REGISTERED ({unclaimed.length})</div>
        {unclaimed.map(p => (
          <div key={p.id} className="player-row" style={{borderLeft:"3px solid #e65100"}}>
            <div className="player-av" style={{background:"#e65100"}}>{p.name[0]}</div>
            <div className="player-info">
              <div className="player-name">{p.name}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>Parent hasn't signed up yet</div>
            </div>
            <button className="btn btn-sm btn-danger" onClick={()=>removePlayer(p.id,p.name)}>✕</button>
          </div>
        ))}
      </>}
      {claimed.length > 0 && <>
        <div style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.07em",color:"#2e7d32",marginBottom:8,marginTop:unclaimed.length>0?14:0}}>✅ REGISTERED & ACTIVE ({claimed.length})</div>
        {claimed.map(p => {
          const c   = playerStats[p.id] || {};
          const pts = totalPts(c);
          const pct = Math.round((pts / maxPossible) * 100);
          return (
            <div key={p.id} className="player-row" style={{borderLeft:"3px solid #2e7d32"}}>
              <div className="player-av">{p.name[0]}</div>
              <div className="player-info">
                <div className="player-name">{p.name}</div>
                <div className="prog-mini"><div className="prog-mini-fill" style={{width:`${pct}%`}}/></div>
              </div>
              <div className="player-pts">{pts} <small>pts</small></div>
              <button className="btn btn-sm btn-danger" onClick={()=>removePlayer(p.id,p.name)}>✕</button>
            </div>
          );
        })}
      </>}
      <div style={{marginTop:20,textAlign:"center"}}>
        <button className="link-btn" onClick={()=>sb.auth.signOut()}>Sign out</button>
      </div>
    </div>
  );
}

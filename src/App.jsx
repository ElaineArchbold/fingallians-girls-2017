import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = "https://rzjaxsfqdajnncfdwemq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_F7tdlTdu7-vYWkNynXW94g_mgzDZ-O_";
const SUPER_ADMIN_EMAIL = "e.t.archbold@gmail.com";
const COACH_EMAIL       = "Fingallians2015GirlsChallenge@gmail.com";
const FORMSPREE_URL     = "https://formspree.io/f/mrewqpqo";

// ── Squad config — set via Vercel environment variable VITE_SQUAD ─────────────
const SQUAD = import.meta.env.VITE_SQUAD || "2015";
const SQUAD_LABEL = SQUAD === "2017" ? "Fingallians Girls · U9" : "Fingallians Girls · U11";
const SQUAD_SHORT = SQUAD === "2017" ? "2017 Girls" : "2015 Girls";

const ADMIN_EMAILS = [
  "e.t.archbold@gmail.com",
];

const ADMIN_PLAYER_NAMES = {};

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Audit logging helper ──────────────────────────────────────────────────────
async function logAudit(userEmail, player, action, detail, oldValue = null, newValue = null) {
  try {
    await sb.from("audit_log").insert({
      user_email:  userEmail,
      player_id:   player?.id   || null,
      player_name: player?.name || null,
      action,
      detail,
      squad:       SQUAD,
      old_value:   oldValue  ? String(oldValue)  : null,
      new_value:   newValue  ? String(newValue)  : null,
    });
  } catch (_) {}
}

const LOGO = "data:image/jpeg;base64,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";

// ── WEEKS arrays ──────────────────────────────────────────────────────────────
const WEEKS_2015 = [
  {
    week:1, phase:"Foundation", dates:"Jun 29–Jul 5",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"1.5k"},{label:"Run 3",distance:"2k"}],
    speed:[{id:"s1a",label:"⚡ Fall Forward",desc:"Practise for 10 minutes at least once this week. Learn the name: Fall Forward. We will be using this in training — know it and own it!",youtube_id:"PTmWJ4kk0yE"}],
    skills:[
      {id:"c1a",label:"🏑 Strike from the Hand",desc:"15 mins at the ball wall: striking off both sides, aim for below shoulder height. Count clean strikes in a row.",youtube_id:"jzwskF82xIk"},
      {id:"f1a",label:"⚽ Punt Kick",desc:"15 mins: punt kick off the wall, catch on the return. Focus on clean first touch. Try both feet.",youtube_id:"z1dLhAL4vi8"},
    ],
    squad:{label:"Squad Session – Striking & Kick-Pass",desc:"Get 3–4 girls together. First 10 mins: camogie striking at the wall, count clean strikes. Then 10 mins: football kick-pass pairs, count clean catches. Record both scores!",youtube_id:"pm5sdhJcd-Q"},
  },
  {
    week:2, phase:"Foundation", dates:"Jul 6–12",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"2k"},{label:"Run 3",distance:"2k"}],
    speed:[{id:"s2a",label:"⚡ Stationary Arm Swing",desc:"Practise for 10 minutes at least once this week. Learn the name: Stationary Arm Swing. Arms drive the legs — get this right and your speed improves. Coaches will use this in training.",youtube_id:"NUmUwXqG1pE"}],
    skills:[
      {id:"c2a",label:"🏑 Roll Lift",desc:"20 mins: roll the sliotar along the ground, scoop it up cleanly with the hurl. Practise off both sides.",youtube_id:"uO5Z21QjPMQ"},
      {id:"f2a",label:"⚽ Hook Kick and Dummy Solo",desc:"Solo the ball, add a dummy step, then hook kick. Try both feet. Count clean sequences in a row.",youtube_id:"UzqN2U5Rdls"},
    ],
    squad:{label:"Squad Session – First Touch & Solo Relay",desc:"Two challenges: (1) Camogie: first touch relay — 3 girls in a line, roll sliotar, first touch and flick on. Drops = restart. Clean rounds in 5 mins? (2) Football: solo relay — each girl solos 20m and back. Count drops. Can you get zero?",youtube_id:"UEFHWItrOD0"},
  },
  {
    week:3, phase:"Building", dates:"Jul 13–19",
    runs:[{label:"Run 1",distance:"2k"},{label:"Run 2",distance:"2k"},{label:"Run 3",distance:"2.5k"}],
    speed:[{id:"s3a",label:"⚡ A Skip",desc:"Practise for 10 minutes at least once this week. Learn the name: A Skip. High knees, rhythmic skip — this is a core speed drill. Coaches will use this term in training.",youtube_id:"2I4rDiFs6Ec"}],
    skills:[
      {id:"c3a",label:"🏑 Jab Lift",desc:"10 jab lifts in a row without dropping. Then try moving — lift on the run. Record your best streak.",youtube_id:"0tmM594_gak"},
      {id:"f3a",label:"⚽ Bounce, Solo and Change of Direction",desc:"Bounce, solo, change direction. Keep the ball under control. How many clean sequences in 2 mins?",youtube_id:"zMV-ReshSVU"},
    ],
    squad:{label:"Squad Session – Free Taking Competition",desc:"Two rounds: (1) Camogie: each girl takes 5 frees from the 21 — group total. (2) Football: each girl takes 5 shots from the D — group total. Record both — coaches will retest in September!",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:4, phase:"Building", dates:"Jul 20–26",
    runs:[{label:"Run 1",distance:"2k"},{label:"Run 2",distance:"2.5k"},{label:"Run 3",distance:"2.5k"}],
    speed:[{id:"s4a",label:"⚡ Ankling Drill",desc:"Practise for 10 minutes at least once this week. Learn the name: Ankling Drill. Fast, low foot contacts — builds ground speed. Coaches will use this term in training.",youtube_id:"11xHsMcomf4"}],
    skills:[
      {id:"c4a",label:"🏑 Hook",desc:"20 mins: practise the hook — timing and hand position. Challenge a teammate if you can!",youtube_id:"P_5R-pXVqcs"},
      {id:"f4a",label:"⚽ Decision Making and Passing",desc:"20 mins: passing drill — read the play, pick your pass. Mix hand-pass and kick-pass. Move after every pass.",youtube_id:"pPxInUTHroM"},
    ],
    squad:{label:"Squad Session – Score Hunt",desc:"At any goals: (1) Camogie: each girl takes 5 pucks from 20m — group total? (2) Football: each girl takes 5 shots from the D — group total? Target: 12+ out of 20 each. Keep the scores!",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:5, phase:"Push", dates:"Jul 27–Aug 2",
    runs:[{label:"Run 1",distance:"2.5k"},{label:"Run 2",distance:"2.5k"},{label:"Run 3",distance:"3k"}],
    speed:[{id:"s5a",label:"⚡ A March",desc:"Practise for 10 minutes at least once this week. Learn the name: A March. Exaggerated high-knee march — develops hip drive and running posture. Coaches will use this in training.",youtube_id:"HISmA4pZWp0"}],
    skills:[
      {id:"c5a",label:"🏑 Block on the Ground",desc:"Practise blocking the sliotar on the ground — body position, timing, safe technique.",youtube_id:"Uq3HsM6bFvo"},
      {id:"f5a",label:"⚽ Obstacle Course",desc:"Set up cones — solo through, shoot at the end. Time yourself. Beat your time by end of the week.",youtube_id:"yCUWUAnism4"},
    ],
    squad:{label:"Squad Session – 45 & Score Chase",desc:"(1) Camogie: each girl takes 5 attempts from the 45 — group total both sides. (2) Football: 3-girl weave, pass and follow up the pitch, finish with a score. How many in 5 mins? Record everything.",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:6, phase:"Push", dates:"Aug 3–9",
    runs:[{label:"Run 1",distance:"2.5k"},{label:"Run 2",distance:"3k"},{label:"Run 3",distance:"3k"}],
    speed:[{id:"s6a",label:"⚡ Butt Kicks",desc:"Practise for 10 minutes at least once this week. Learn the name: Butt Kicks. Heel to backside on every stride — improves hamstring activation and stride cycle. Coaches will use this term in training.",youtube_id:"p7OBdAJu9E8"}],
    skills:[
      {id:"c6a",label:"🏑 Frontal Block",desc:"25 mins at full pace: frontal blocking drills. Safe technique first — then build speed.",youtube_id:"pFOXDqLbD7g"},
      {id:"f6a",label:"⚽ The Body Catch",desc:"Practise the body catch — take the ball into the chest, secure it. Work off both sides.",youtube_id:"8loHSEuEJx8"},
    ],
    squad:{label:"Squad Session – Puck-Around & Weave",desc:"(1) Camogie: 2v2 near the goal, one side attacks for 3 mins, count scores, swap. (2) Football: 3-girl weave timed challenge — how many scores in 5 mins as a group? Record both.",youtube_id:"UEFHWItrOD0"},
  },
  {
    week:7, phase:"Peak", dates:"Aug 10–16",
    runs:[{label:"Run 1",distance:"3k"},{label:"Run 2",distance:"3k"},{label:"Run 3",distance:"3.5k"}],
    speed:[{id:"s7a",label:"⚡ Wall Knee Drive",desc:"Practise for 10 minutes at least once this week. Learn the name: Wall Knee Drive. Drive the knee up against a wall — builds explosive power and sprint mechanics. Coaches will use this in training.",youtube_id:"ZW9rjy9TgGM"}],
    skills:[
      {id:"c7a",label:"🏑 Overhead Catch",desc:"Most accurate camogie frees from 20m in a row. Then overhead catching — time it with a partner.",youtube_id:"AhAH2ijnepY"},
      {id:"f7a",label:"⚽ The Roll Off",desc:"Practise the roll off — shoulder, turn, accelerate. Left and right. How many clean in a row?",youtube_id:"7NgYaavj7Ko"},
    ],
    squad:{label:"Squad Session – Peak Challenge",desc:"(1) Camogie: each girl does 10 frees from 20m — group total. Compare to Week 3! (2) Football: each girl does 10 shots, 5 each foot — group total. Compare to Week 3! How much has the team improved?",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:8, phase:"Peak", dates:"Aug 17–23",
    runs:[{label:"Run 1",distance:"3k"},{label:"Run 2",distance:"3.5k"},{label:"Run 3",distance:"3.5k"}],
    speed:[{id:"s8a",label:"⚡ 3 Point Start",desc:"Practise for 10 minutes at least once this week. Learn the name: 3 Point Start. Explosive start from hands and feet — this is how we sprint from a standing position in a game. Coaches will use this in training from September.",youtube_id:"rJ7SbSqqKS0"}],
    skills:[
      {id:"c8a",label:"🏑 Solo",desc:"30 mins — full pace, solo the sliotar end to end both sides. Final session before assessment!",youtube_id:"jhs9YPfh10Y"},
      {id:"f8a",label:"⚽ The Hook Kick",desc:"Solo the ball 20m clean, both feet. Compare to Week 2. Then hook kick for score — compare to Week 3.",youtube_id:"yEViD8o4ZWI"},
    ],
    squad:{label:"Squad Session – Final Challenge",desc:"Re-run Week 2: (1) Camogie first touch relay — clean rounds in 5 mins? (2) Football solo relay — group drops count. Compare BOTH to Week 2. Screenshot and send to the coaches! 📸",youtube_id:"CAHGBytDaGw"},
  },
];

const WEEKS_2017 = [
  {
    week:1, phase:"Foundation", dates:"Jun 29–Jul 5",
    runs:[{label:"Run 1",distance:"1k"},{label:"Run 2",distance:"1k"},{label:"Run 3",distance:"1.5k"}],
    speed:[{id:"s1a",label:"⚡ Fall Forward",desc:"Lean forward from your ankles like you're about to fall — then let your legs catch you! Practice for 10 minutes. This is how fast runners start. Learn the name: Fall Forward!",youtube_id:"PTmWJ4kk0yE"}],
    skills:[
      {id:"c1a",label:"🏑 Strike from the Hand",desc:"Head to the ball wall and strike the sliotar off both sides. See how many clean strikes you can do in a row — try to beat your score each time!",youtube_id:"jzwskF82xIk"},
      {id:"f1a",label:"⚽ Punt Kick",desc:"Kick the ball off the wall and catch it on the way back. Try both feet — which one feels better? Keep going for 15 minutes and see how you get on!",youtube_id:"z1dLhAL4vi8"},
    ],
    squad:{label:"Squad Session – Striking & Kick-Pass",desc:"Get 3–4 girls together! (1) Practice Fall Forward — who has the best lean? Make each other laugh trying! (2) Camogie: take turns striking at the wall — count how many clean strikes in a row. (3) Football: kick-pass to a partner, count clean catches. Have fun with it! 🏑⚽",youtube_id:"pm5sdhJcd-Q"},
  },
  {
    week:2, phase:"Foundation", dates:"Jul 6–12",
    runs:[{label:"Run 1",distance:"1k"},{label:"Run 2",distance:"1.5k"},{label:"Run 3",distance:"1.5k"}],
    speed:[{id:"s2a",label:"⚡ Stationary Arm Swing",desc:"Stand still and swing your arms like you're running — keep your elbows bent. Arms help your legs go faster! Practice for 10 minutes. Learn the name: Stationary Arm Swing!",youtube_id:"NUmUwXqG1pE"}],
    skills:[
      {id:"c2a",label:"🏑 Roll Lift",desc:"Roll the sliotar along the ground and scoop it up with your hurl. Try both sides! How many can you do in a row without dropping it?",youtube_id:"uO5Z21QjPMQ"},
      {id:"f2a",label:"⚽ Hook Kick and Dummy Solo",desc:"Solo the ball, do a little dummy step, then hook kick! Try both feet and have fun with it — it doesn't have to be perfect yet!",youtube_id:"UzqN2U5Rdls"},
    ],
    squad:{label:"Squad Session – Arm Swing & Lifting",desc:"Get your crew together! (1) Stationary Arm Swing race — who has the best technique? (2) Camogie: Roll Lift relay — take turns, cheer each other on, count your clean lifts. (3) Football: solo and dummy — have a go and see how many clean ones you can do together!",youtube_id:"UEFHWItrOD0"},
  },
  {
    week:3, phase:"Building", dates:"Jul 13–19",
    runs:[{label:"Run 1",distance:"1k"},{label:"Run 2",distance:"1.5k"},{label:"Run 3",distance:"1.5k"}],
    speed:[{id:"s3a",label:"⚡ A Skip",desc:"Skip with high knees in a rhythm — left, right, left, right. It looks funny but it makes you faster! Practice for 10 minutes. Learn the name: A Skip!",youtube_id:"2I4rDiFs6Ec"}],
    skills:[
      {id:"c3a",label:"🏑 Jab Lift",desc:"Jab your hurl under the sliotar and flick it up — see how many in a row you can manage. Keep trying, it gets easier the more you practice!",youtube_id:"0tmM594_gak"},
      {id:"f3a",label:"⚽ Bounce, Solo and Change of Direction",desc:"Bounce the ball, solo, then change direction — keep control and see how long you can keep it going. Count your clean goes!",youtube_id:"zMV-ReshSVU"},
    ],
    squad:{label:"Squad Session – A Skip & Skills",desc:"Squad time! (1) A Skip together — who has the best rhythm? (2) Camogie: take turns at the wall — count your clean strikes and see if you can beat your score! (3) Football: Bounce, Solo and Change Direction — make it a game, who can do the most without losing the ball?",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:4, phase:"Building", dates:"Jul 20–26",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"1.5k"},{label:"Run 3",distance:"2k"}],
    speed:[{id:"s4a",label:"⚡ Ankling Drill",desc:"Super fast tiny steps — stay low and keep your feet moving quickly off the ground. Practice for 10 minutes. Learn the name: Ankling Drill!",youtube_id:"11xHsMcomf4"}],
    skills:[
      {id:"c4a",label:"🏑 Hook",desc:"Practice the hook with a friend if you can — one of you attacks, one defends. Safe technique first, then build up speed. Give it a go!",youtube_id:"P_5R-pXVqcs"},
      {id:"f4a",label:"⚽ Decision Making and Passing",desc:"Pass the ball to a wall or a friend — mix up hand passes and kick passes. Move after every pass. Keep it moving!",youtube_id:"pPxInUTHroM"},
    ],
    squad:{label:"Squad Session – Ankling & Passing",desc:"Friends session! (1) Ankling Drill — fast feet, stay low, make it a race! (2) Camogie: practice the hook in pairs — one attacks, one defends. (3) Football: passing game — pass and move, keep it flowing. How many passes in a row without dropping?",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:5, phase:"Push", dates:"Jul 27–Aug 2",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"1.5k"},{label:"Run 3",distance:"2k"}],
    speed:[{id:"s5a",label:"⚡ A March",desc:"March with really high knees — lift them up as high as you can with every step. Practice for 10 minutes. Learn the name: A March!",youtube_id:"HISmA4pZWp0"}],
    skills:[
      {id:"c5a",label:"🏑 Block on the Ground",desc:"Practice getting low and blocking the sliotar safely. Body position is the most important thing — get that right first, then speed it up!",youtube_id:"Uq3HsM6bFvo"},
      {id:"f5a",label:"⚽ Obstacle Course",desc:"Set up some cones or jumpers and solo through them, finishing with a shot. Time yourself — can you beat your time by the end of the week?",youtube_id:"yCUWUAnism4"},
    ],
    squad:{label:"Squad Session – A March & Blocking",desc:"Get together with your teammates! (1) A March parade — who has the best high knees? (2) Camogie: practice the block on the ground — take turns being the attacker and defender. (3) Football: obstacle course relay — set up some cones, take turns, cheer each other on!",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:6, phase:"Push", dates:"Aug 3–9",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"2k"},{label:"Run 3",distance:"2k"}],
    speed:[{id:"s6a",label:"⚡ Butt Kicks",desc:"Run on the spot and kick your heels up to your bottom as fast as you can. Practice for 10 minutes. Learn the name: Butt Kicks!",youtube_id:"p7OBdAJu9E8"}],
    skills:[
      {id:"c6a",label:"🏑 Frontal Block",desc:"Build up slowly — safe technique first, then go faster as you get comfortable. This one takes practice so stick with it!",youtube_id:"pFOXDqLbD7g"},
      {id:"f6a",label:"⚽ The Body Catch",desc:"Take the ball into your chest and hold on tight — try both sides. Practice makes perfect with this one!",youtube_id:"8loHSEuEJx8"},
    ],
    squad:{label:"Squad Session – Butt Kicks & Body Catch",desc:"Crew session! (1) Butt Kicks race — who can go the fastest? (2) Camogie: frontal block practice — safe technique first, then build up speed together. (3) Football: body catch challenge — take turns and see who can take the cleanest catch. Count your successes!",youtube_id:"UEFHWItrOD0"},
  },
  {
    week:7, phase:"Peak", dates:"Aug 10–16",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"2k"},{label:"Run 3",distance:"2k"}],
    speed:[{id:"s7a",label:"⚡ Wall Knee Drive",desc:"Stand facing a wall, hands on it, and drive one knee up at a time as fast as you can. Practice for 10 minutes. Learn the name: Wall Knee Drive!",youtube_id:"ZW9rjy9TgGM"}],
    skills:[
      {id:"c7a",label:"🏑 Overhead Catch",desc:"Toss the sliotar up and catch it cleanly above your head. Try with a friend — one throws, one catches! How high can you go?",youtube_id:"AhAH2ijnepY"},
      {id:"f7a",label:"⚽ The Roll Off",desc:"Shoulder, turn and go! Try left and right — which side feels better? Count your clean ones and see if you can improve each day!",youtube_id:"7NgYaavj7Ko"},
    ],
    squad:{label:"Squad Session – Wall Knee Drive & Overhead",desc:"Team time! (1) Wall Knee Drive — explosive and fun, take turns and count! (2) Camogie: overhead catching with a partner — throw, catch, cheer! (3) Football: The Roll Off — left and right, take turns and see who can do the most in a row. Celebrate every good one! 🎉",youtube_id:"CAHGBytDaGw"},
  },
  {
    week:8, phase:"Peak", dates:"Aug 17–23",
    runs:[{label:"Run 1",distance:"1.5k"},{label:"Run 2",distance:"2k"},{label:"Run 3",distance:"2k"}],
    speed:[{id:"s8a",label:"⚡ 3 Point Start",desc:"Hands and feet on the ground — explosive go! Like a sprinter at the Olympics. Practice for 10 minutes. Learn the name: 3 Point Start!",youtube_id:"rJ7SbSqqKS0"}],
    skills:[
      {id:"c8a",label:"🏑 Solo the Sliotar",desc:"Full pace, end to end, both sides — this is your last practice before we come back in September. Give it everything you've got!",youtube_id:"jhs9YPfh10Y"},
      {id:"f8a",label:"⚽ The Hook Kick",desc:"Solo 20 metres cleanly then hook kick for a score. Compare to Week 2 — look how far you've come! Finish strong! 💪",youtube_id:"yEViD8o4ZWI"},
    ],
    squad:{label:"Squad Session – Final Challenge",desc:"Last squad session — make it count! (1) 3 Point Start race — explosive off the mark, who's the fastest? (2) Camogie: solo the sliotar end to end — final session, give it everything! (3) Football: Hook Kick challenge — compare to Week 2, have you improved? Take a group photo and send it to the coaches! 📸",youtube_id:"CAHGBytDaGw"},
  },
];

const WEEKS = SQUAD === "2017" ? WEEKS_2017 : WEEKS_2015;

const PHASE_STYLE = {
  Foundation:{ bg:"#fce4ec", accent:"#c2185b", chip:"#f48fb1" },
  Building:  { bg:"#f3e5f5", accent:"#7b1fa2", chip:"#ce93d8" },
  Push:      { bg:"#e8eaf6", accent:"#3949ab", chip:"#9fa8da" },
  Peak:      { bg:"#e0f2f1", accent:"#00695c", chip:"#80cbc4" },
};

const SPORT_LABEL = "🏑⚽ Camogie & LGFA Football";

const runKey   = (week, n)  => `w${week}-run${n}`;
const skillKey = (week, id) => `w${week}-skill-${id}`;
const speedKey = (week, id) => `w${week}-speed-${id}`;
const squadKey = (week)     => `w${week}-squad`;

const PTS = { run:3, skill:2, speed:2, squad:4 };

function totalPts(checks) {
  let p = 0;
  WEEKS.forEach(w => {
    w.runs.forEach((_,i)  => { if(checks[runKey(w.week,i)])   p+=PTS.run; });
    w.skills.forEach(s    => { if(checks[skillKey(w.week,s.id)]) p+=PTS.skill; });
    (w.speed||[]).forEach(s => { if(checks[speedKey(w.week,s.id)]) p+=PTS.speed; });
    if(checks[squadKey(w.week)]) p+=PTS.squad;
  });
  return p;
}

function weekPts(w, checks) {
  let p = 0;
  w.runs.forEach((_,i) => { if(checks[runKey(w.week,i)]) p+=PTS.run; });
  w.skills.forEach(s   => { if(checks[skillKey(w.week,s.id)]) p+=PTS.skill; });
  (w.speed||[]).forEach(s => { if(checks[speedKey(w.week,s.id)]) p+=PTS.speed; });
  if(checks[squadKey(w.week)]) p+=PTS.squad;
  return p;
}

function weekMaxPts(w) {
  return w.runs.length*PTS.run + w.skills.length*PTS.skill + (w.speed||[]).length*PTS.speed + PTS.squad;
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
.shell{max-width:560px;width:100%;margin:0 auto;padding-bottom:88px}
@media(min-width:640px){
  .shell{max-width:720px}
  .home-wrap,.admin-wrap,.wk-detail{padding:20px 28px}
  .hdr{padding:20px 28px 0}
  .week-grid{grid-template-columns:repeat(8,1fr)}
  .pts-row{gap:16px}
  .pts-box .num{font-size:44px}
  .welcome-card{padding:28px 26px}
  .welcome-card h2{font-size:40px}
}
@media(min-width:900px){
  .shell{max-width:960px}
  .home-wrap,.admin-wrap{padding:24px 32px}
  .hdr{padding:20px 32px 0}
}
.hdr{background:var(--g);padding:18px 18px 0;position:sticky;top:0;z-index:100;border-bottom:3px solid var(--gold)}
.hdr-row{display:flex;align-items:center;gap:12px;padding-bottom:14px}
.crest{width:50px;height:50px;border-radius:50%;overflow:hidden;flex-shrink:0;box-shadow:0 0 0 2px var(--gold),0 0 0 4px rgba(255,255,255,0.15);background:white}
.crest img{width:100%;height:100%;object-fit:cover}
.hdr-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;color:white;line-height:1;letter-spacing:0.03em}
.hdr-sub{font-size:11px;color:rgba(255,255,255,0.65);margin-top:2px}
.hdr-player{font-size:12px;color:var(--gold2);font-weight:700;margin-top:2px}
.tabs{display:flex;gap:3px;width:100%}
.tab-btn{flex:1;min-width:0;padding:10px 2px;border:none;border-radius:10px 10px 0 0;font-family:'Barlow Condensed',sans-serif;font-size:clamp(11px,3vw,15px);letter-spacing:0.02em;cursor:pointer;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.65);transition:all 0.15s;border-bottom:3px solid transparent;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tab-btn.active{background:var(--bg);color:var(--g);font-size:15px;border-bottom:3px solid var(--bg)}
.auth-wrap{padding:24px 18px}
.auth-hero{background:var(--g);border-radius:var(--radius);padding:30px 24px 26px;margin-bottom:18px;color:white;position:relative;overflow:hidden;text-align:center}
.auth-hero::before{content:'🏑';position:absolute;right:-14px;bottom:-18px;font-size:130px;opacity:0.06;transform:rotate(-10deg);pointer-events:none}
.auth-hero .crest-large{width:72px;height:72px;border-radius:50%;overflow:hidden;margin:0 auto 14px;border:3px solid var(--gold);box-shadow:0 4px 16px rgba(0,0,0,0.3);background:white}
.auth-hero .crest-large img{width:100%;height:100%;object-fit:cover}
.auth-hero h2{font-family:'Barlow Condensed',sans-serif;font-size:40px;color:white;line-height:0.95;letter-spacing:0.02em}
.auth-hero p{font-size:13px;opacity:0.8;margin-top:10px;line-height:1.55}
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
.home-wrap{padding:14px 16px;width:100%;box-sizing:border-box}
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
.runs-chips{display:flex;flex-wrap:nowrap;gap:6px;margin-top:10px;justify-content:center;width:100%}
.run-chip{font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(0,0,0,0.08);cursor:pointer;transition:all 0.15s;border:2px solid transparent;flex:1;text-align:center;white-space:nowrap;min-width:0}
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
.yt-placeholder{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;cursor:pointer;gap:8px;overflow:hidden}
.yt-thumb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.yt-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.25)}
.yt-play{position:relative;z-index:2;width:56px;height:56px;border-radius:50%;background:rgba(255,0,0,0.9);display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 2px 12px rgba(0,0,0,0.4);flex-shrink:0}
.yt-note{position:relative;z-index:2;font-size:12px;text-align:center;padding:0 16px;text-shadow:0 1px 3px rgba(0,0,0,0.8);font-weight:700}
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
.admin-wrap{padding:14px 16px;width:100%;box-sizing:border-box}
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
.squad-toggle{display:flex;gap:8px;margin-bottom:14px;align-items:center}
.squad-toggle-btn{padding:6px 14px;border-radius:20px;border:2px solid var(--g);background:white;color:var(--g);font-family:'Barlow Condensed',sans-serif;font-size:14px;cursor:pointer;font-weight:700;transition:all 0.15s}
.squad-toggle-btn.active{background:var(--g);color:white}
`;

export default function App() {
  const [session, setSession]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("home");
  const [toast, setToast]       = useState(null);
  const [player, setPlayer]     = useState(null);
  const [checks, setChecks]     = useState({});
  const [allPlayers, setAllPlayers] = useState([]);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  // SuperAdmin can toggle between squads
  const [adminSquadView, setAdminSquadView] = useState(SQUAD);

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
    if (!session) { setPlayer(null); setChecks({}); setPlayerLoaded(false); return; }
    if (ADMIN_EMAILS.includes(session.user.email)) { setPlayerLoaded(true); loadAllPlayers(adminSquadView); return; }
    setPlayerLoaded(false);
    loadPlayerData();
  }, [session]);

  // Reload players when superadmin switches squad view
  useEffect(() => {
    if (session && ADMIN_EMAILS.includes(session.user.email)) {
      loadAllPlayers(adminSquadView);
    }
  }, [adminSquadView]);

  async function loadPlayerData() {
    const { data: link } = await sb
      .from("parent_players")
      .select("player_id, players(id,name,squad)")
      .eq("user_id", session.user.id)
      .maybeSingle();
    // Only accept the link if the player belongs to this app's squad
    // Treat null squad as '2015' for existing players before migration
    const playerSquad = link?.players?.squad || '2015';
    if (link?.players && playerSquad === SQUAD) {
      setPlayer(link.players);
      const { data: comps } = await sb
        .from("task_completions")
        .select("task_key")
        .eq("player_id", link.players.id);
      const c = {};
      comps?.forEach(r => { c[r.task_key] = true; });
      setChecks(c);
    } else {
      // Wrong squad or no link — clear player so LinkPlayerScreen shows
      setPlayer(null);
      setChecks({});
    }
    setPlayerLoaded(true);
  }

  async function loadAllPlayers(squadFilter = SQUAD) {
    const { data } = await sb.from("players").select("id,name,squad").eq("squad", squadFilter).order("name");
    setAllPlayers(data || []);
  }

  async function toggleTask(taskKey, pts, label) {
    if (!player) return;
    const weekMatch = taskKey.match(/^w(\d+)-/);
    if (weekMatch && session?.user?.email !== SUPER_ADMIN_EMAIL) {
      const weekNum  = parseInt(weekMatch[1], 10);
      const weekStart = new Date("2026-06-29");
      weekStart.setDate(weekStart.getDate() + (weekNum - 1) * 7);
      weekStart.setHours(0,0,0,0);
      if (new Date() < weekStart) {
        showToast("🔒 This week has not started yet — come back later!");
        return;
      }
    }
    const done = checks[taskKey];
    if (done) {
      await sb.from("task_completions").delete().eq("player_id", player.id).eq("task_key", taskKey);
      setChecks(c => { const n={...c}; delete n[taskKey]; return n; });
      logAudit(session.user.email, player, "task_incomplete", label);
    } else {
      await sb.from("task_completions").insert({ player_id: player.id, task_key: taskKey, completed_at: new Date().toISOString() });
      setChecks(c => ({ ...c, [taskKey]: true }));
      showToast(`✅ ${label} logged! +${pts} pts`);
      logAudit(session.user.email, player, "task_complete", label, null, `+${pts} pts`);
    }
  }

  async function linkPlayer(playerId) {
    // Double-check this player belongs to the correct squad before linking
    const { data: p } = await sb.from("players").select("squad").eq("id", playerId).maybeSingle();
    const pSquad = p?.squad || '2015';
    if (!p || pSquad !== SQUAD) {
      showToast("❌ This player is not in the correct squad for this app.");
      return;
    }
    await sb.from("parent_players")
      .upsert({ user_id: session.user.id, player_id: playerId }, { onConflict:"user_id,player_id" });
    // Manually load the player data inline to avoid state timing issues
    const { data: newLink } = await sb
      .from("parent_players")
      .select("player_id, players(id,name,squad)")
      .eq("user_id", session.user.id)
      .maybeSingle();
    if (newLink?.players) {
      setPlayer(newLink.players);
      const { data: comps } = await sb.from("task_completions").select("task_key").eq("player_id", newLink.players.id);
      const c = {};
      comps?.forEach(r => { c[r.task_key] = true; });
      setChecks(c);
    }
    setPlayerLoaded(true);
    showToast("🎉 Player linked!");
    setTab("home");
  }

  const isAdmin      = ADMIN_EMAILS.includes(session?.user?.email);
  const isSuperAdmin = session?.user?.email === SUPER_ADMIN_EMAIL;
  const pts     = totalPts(checks);
  const weeksDone = WEEKS.filter(w => weekPts(w, checks) === weekMaxPts(w)).length;

  if (loading) return (
    <><style>{CSS}</style>
    <div className="loader"><div className="spinner"/><span>Loading…</span></div></>
  );

  const TABS = [
    { id:"home",     label:"Home"     },
    { id:"plan",     label:"Plan"     },
    { id:"progress", label:"Progress" },
    ...(isSuperAdmin ? [{ id:"admin",   label:"Admin"   }] : []),
    ...(isSuperAdmin ? [{ id:"dashboard", label:"Dashboard" }] : []),
  ];

  // SuperAdmin squad toggle component
  const SuperAdminSquadToggle = () => isSuperAdmin ? (
    <div className="squad-toggle">
      <span style={{fontSize:12,color:"var(--muted)",fontWeight:700}}>Squad:</span>
      {["2015","2017"].map(s => (
        <button key={s} className={`squad-toggle-btn${adminSquadView===s?" active":""}`}
          onClick={() => setAdminSquadView(s)}>
          {s === "2015" ? "2015 Girls" : "2017 Girls"}
        </button>
      ))}
    </div>
  ) : null;

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
                <div className="hdr-sub">{SQUAD_LABEL} · Summer Challenge 2026</div>
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
        {session && !playerLoaded && !isAdmin && (
          <div className="loader"><div className="spinner"/>Loading…</div>
        )}
        {session && playerLoaded && !player && !isAdmin && (
          <LinkPlayerScreen userId={session.user.id} onLink={linkPlayer} showToast={showToast} />
        )}
        {session && (player || isAdmin) && tab === "home" && (
          <HomeTab player={player} checks={checks} pts={pts} weeksDone={weeksDone} onNav={() => setTab("plan")} onToggle={toggleTask} showToast={showToast} />
        )}
        {session && (player || isAdmin) && tab === "plan" && (
          <PlanTab checks={checks} onToggle={toggleTask} player={player} showToast={showToast} />
        )}
        {session && (player || isAdmin) && tab === "progress" && (
          <ProgressTab player={player} checks={checks} isAdmin={isAdmin} />
        )}

        {session && isAdmin && tab === "admin" && (
          <div className="admin-wrap" style={{paddingTop:14}}>
            <SuperAdminSquadToggle />
            <AdminTab allPlayers={allPlayers} session={session} onRefresh={() => loadAllPlayers(adminSquadView)} showToast={showToast} currentSquad={adminSquadView} />
          </div>
        )}
        {session && isSuperAdmin && tab === "dashboard" && (
          <div className="admin-wrap" style={{paddingTop:14}}>
            <SuperAdminSquadToggle />
            <DashboardTab allPlayers={allPlayers} squadLabel={adminSquadView === "2017" ? "2017 Girls" : "2015 Girls"} />
          </div>
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
  const [resetSent, setResetSent]     = useState(false);

  async function sendReset() {
    if (!email.trim()) { setErr("Please enter your email address first."); return; }
    setBusy(true); setErr("");
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
    if (error) { setErr(error.message); setBusy(false); return; }
    setResetSent(true);
    setBusy(false);
  }

  const redirectUrl = SQUAD === "2017"
    ? "https://fingallians-girls-2017.vercel.app"
    : "https://fingallians-girls.vercel.app";

  async function submit() {
    setErr(""); setBusy(true);
    if (mode === "signup") {
      if (pw !== pw2) { setErr("Passwords don't match"); setBusy(false); return; }
      if (pw.length < 6) { setErr("Password must be at least 6 characters"); setBusy(false); return; }
      if (!tcAgreed) { setErr("Please agree to the Terms & Conditions to continue"); setBusy(false); return; }
      const { error } = await sb.auth.signUp({ email, password: pw, options: { emailRedirectTo: redirectUrl } });
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
          <p>{SQUAD_LABEL} · June–August 2026 · 8 Weeks<br/>Runs · Skills · Squad Sessions</p>
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
                  <p>To use this app we store your child's first and last name and your email address. No other personal information is collected or stored. Your data is not shared with any third party and is used solely to manage participation in the 2026 Summer Challenge. You can request deletion of your data at any time by contacting the coaches.</p>
                </div>
                <div className="tc-section">
                  <strong>Participation</strong>
                  <p>This challenge is run voluntarily by Fingallians Girls coaches for the benefit of the players. Points are awarded in good faith. The club reserves the right to amend the challenge at any time.</p>
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
          {mode === "login" && (
            <div style={{textAlign:"center",marginTop:10}}>
              {resetSent ? (
                <div style={{fontSize:13,color:"#2e7d32",padding:"8px 0"}}>✅ Reset email sent — check your inbox!</div>
              ) : (
                <button className="link-btn" onClick={sendReset} disabled={busy} style={{fontSize:13,color:"var(--muted)"}}>
                  Forgot password?
                </button>
              )}
            </div>
          )}
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
    sb.from("players").select("id,name").eq("squad", SQUAD).order("name").then(({ data }) => {
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

// ── Contact Form component ────────────────────────────────────────────────────
function ContactForm({ player }) {
  const [open,    setOpen]    = useState(false);
  const [msg,     setMsg]     = useState("");
  const [file,    setFile]    = useState(null);
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [err,     setErr]     = useState("");
  const fileRef = useRef(null);

  async function handleSubmit() {
    if (!msg.trim()) { setErr("Please add a message before sending."); return; }
    setSending(true); setErr("");
    try {
      const formData = new FormData();
      formData.append("player_name", player?.name || "Unknown");
      formData.append("squad", SQUAD_LABEL);
      formData.append("message", msg);
      if (file) formData.append("attachment", file);
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSent(true); setMsg(""); setFile(null);
        setTimeout(() => { setSent(false); setOpen(false); }, 3000);
      } else {
        setErr("Something went wrong — please try again.");
      }
    } catch {
      setErr("Could not send — check your connection.");
    }
    setSending(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{display:"inline-block",background:"var(--gold)",color:"var(--dark)",
                fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,letterSpacing:"0.04em",
                fontWeight:900,padding:"10px 20px",borderRadius:20,border:"none",cursor:"pointer"}}>
        📧 Message the Coaches
      </button>
    );
  }

  return (
    <div style={{background:"rgba(255,255,255,0.10)",borderRadius:14,padding:"16px",marginTop:4,textAlign:"left"}}>
      {sent ? (
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:36,marginBottom:8}}>✅</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,color:"var(--gold)",letterSpacing:"0.02em"}}>Message Sent!</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:6}}>The coaches will get back to you soon.</div>
        </div>
      ) : (
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,color:"white",letterSpacing:"0.02em"}}>MESSAGE THE COACHES</div>
            <button onClick={() => { setOpen(false); setErr(""); setMsg(""); setFile(null); }}
              style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:"50%",
                      width:28,height:28,cursor:"pointer",color:"white",fontSize:16,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          {player && (
            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginBottom:12}}>
              Sending as: <strong style={{color:"var(--gold)"}}>{player.name}</strong>
            </div>
          )}
          {err && (
            <div style={{background:"rgba(255,0,0,0.15)",borderRadius:8,padding:"8px 12px",
                         fontSize:12,color:"#ffcccc",marginBottom:10}}>{err}</div>
          )}
          <textarea
            placeholder="Write your message here — share a video link, ask a question, or let the coaches know how you're getting on!"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            rows={4}
            style={{width:"100%",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",
                    borderRadius:10,padding:"10px 12px",fontSize:13,color:"white",
                    fontFamily:"'Lato',sans-serif",resize:"vertical",outline:"none",
                    boxSizing:"border-box",marginBottom:10}}
          />
          <div style={{marginBottom:12}}>
            <input type="file" ref={fileRef} accept="image/*,video/*"
              onChange={e => setFile(e.target.files[0])}
              style={{display:"none"}} />
            <button onClick={() => fileRef.current.click()}
              style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",
                      borderRadius:10,padding:"8px 14px",color:"white",fontSize:12,
                      cursor:"pointer",fontFamily:"'Lato',sans-serif",fontWeight:700}}>
              📎 {file ? file.name : "Attach a photo or video"}
            </button>
            {file && (
              <button onClick={() => setFile(null)}
                style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",
                        cursor:"pointer",fontSize:12,marginLeft:8}}>
                Remove
              </button>
            )}
          </div>
          <button onClick={handleSubmit} disabled={sending}
            style={{width:"100%",background:"var(--gold)",color:"var(--dark)",border:"none",
                    borderRadius:10,padding:"12px",fontFamily:"'Barlow Condensed',sans-serif",
                    fontSize:20,letterSpacing:"0.04em",cursor:sending?"not-allowed":"pointer",
                    opacity:sending?0.7:1,fontWeight:900}}>
            {sending ? "Sending…" : "SEND MESSAGE →"}
          </button>
        </>
      )}
    </div>
  );
}

// Keep for any legacy references
function EmailCoachesButton({ label = "📧 Message the Coaches", player }) {
  return <ContactForm player={player} />;
}

function HomeTab({ player, checks, pts, weeksDone, onNav, onToggle, showToast }) {
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
      <WeekDetail w={w} ps={ps} pct={pct} wPts={wPts} wMax={wMax} checks={checks} onToggle={onToggle} player={player} showToast={showToast} />
      <button className="btn btn-ghost" style={{marginTop:4}} onClick={onNav}>VIEW FULL 8-WEEK PLAN →</button>
      <div style={{background:"linear-gradient(135deg,#7d1018 0%,var(--g) 100%)",borderRadius:"var(--radius)",padding:"16px 18px",marginTop:12,color:"white",textAlign:"center"}}>
        <div style={{fontSize:24,marginBottom:6}}>📱🏑⚽</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,letterSpacing:"0.02em",marginBottom:6}}>SHARE YOUR SKILLS!</div>
        <div style={{fontSize:13,opacity:0.85,lineHeight:1.6,marginBottom:12}}>
          Filmed yourself practising? Send your videos to the coaches — we'd love to see the girls putting in the work!
        </div>
        <ContactForm player={player} />
      </div>
      <div style={{textAlign:"center",marginTop:14,paddingBottom:8}}>
        <button className="link-btn" style={{color:"var(--muted)",fontSize:13}} onClick={()=>sb.auth.signOut()}>Sign out</button>
      </div>
    </div>
  );
}

function WeekDetail({ w, ps, pct, wPts, wMax, checks, onToggle, player, showToast }) {
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

      {(w.speed||[]).map((s) => {
        const k    = speedKey(w.week, s.id);
        const done = !!checks[k];
        const open = expandedSkill === s.id;
        return (
          <div key={s.id} className="skill-card" style={{borderLeft:"4px solid #7b1fa2"}}>
            <div className={`skill-hd${done?" done-hd":""}`} onClick={()=>{
              if(open && !done) showToast("💪 Don't forget to tap 'Mark Complete' if you have done this activity!");
              setExpandedSkill(open?null:s.id);
            }}>
              <div className={`skill-check${done?" done":""}`} style={done?{}:{borderColor:"#7b1fa2",cursor:"pointer"}}
                onClick={e=>{e.stopPropagation();
                  if(open && !done) showToast("💪 Don't forget to tap 'Mark Complete' if you have done this activity!");
                  setExpandedSkill(open?null:s.id);
                }}>{done?"✓":""}</div>
              <div className="skill-hd-text">
                <div className="skill-type" style={{color:"#7b1fa2"}}>⚡ Speed Mechanics · +{PTS.speed} pts</div>
                <div className="skill-name">{s.label}</div>
              </div>
              <div className="pts-badge" style={{background:"#f3e5f5",color:"#7b1fa2"}}>+{PTS.speed}</div>
              <div className={`expand-icon${open?" open":""}`}>⌄</div>
            </div>
            {open && (
              <div className="skill-body">
                <p className="skill-desc">{s.desc}</p>
                <VideoEmbed ytId={s.youtube_id} playing={playingVideo===s.id} onPlay={()=>setPlayingVideo(s.id)} />
                {canToggle && (
                  <button className={`mark-btn${done?" mark-undone":" mark-done"}`}
                    style={!done?{background:"#7b1fa2"}:{}}
                    onClick={()=>onToggle(k,PTS.speed,s.label)}>
                    {done?"✕ MARK INCOMPLETE":"✓ MARK COMPLETE"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {w.skills.map((s) => {
        const k    = skillKey(w.week, s.id);
        const done = !!checks[k];
        const open = expandedSkill === s.id;
        return (
          <div key={s.id} className="skill-card">
            <div className={`skill-hd${done?" done-hd":""}`} onClick={()=>{
              if(open && !done) showToast("💪 Don't forget to tap 'Mark Complete' if you have done this activity!");
              setExpandedSkill(open?null:s.id);
            }}>
              <div className={`skill-check${done?" done":""}`} style={{cursor:"pointer"}}
                onClick={e=>{e.stopPropagation();
                  if(open && !done) showToast("💪 Don't forget to tap 'Mark Complete' if you have done this activity!");
                  setExpandedSkill(open?null:s.id);
                }}>{done?"✓":""}</div>
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
            <div className="squad-hd" onClick={()=>{
              if(expandedSquad && !done) showToast("💪 Don't forget to tap 'Squad Session Done' if you have completed this!");
              setExpandedSquad(v=>!v);
            }}>
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
  const thumbUrl = ytId && !isPlaceholder ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

  return (
    <div className="yt-wrap" style={{marginBottom:12}}>
      {(isPlaceholder || !playing) ? (
        <div className="yt-placeholder" onClick={!isPlaceholder?onPlay:undefined}>
          {thumbUrl ? (
            <>
              <img className="yt-thumb" src={thumbUrl} alt="Video thumbnail" />
              <div className="yt-overlay" />
              <div className="yt-play">▶</div>
              <div className="yt-note">Tap to watch</div>
            </>
          ) : (
            <>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#4a0a0e,#1a0405)"}} />
              <div className="yt-play" style={{background:"var(--gold)"}}>🎬</div>
              <div className="yt-note">Video coming soon</div>
            </>
          )}
        </div>
      ) : (
        <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`} allow="autoplay; encrypted-media" allowFullScreen />
      )}
    </div>
  );
}

function PlanTab({ checks, onToggle, player, showToast }) {
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
            <WeekDetail w={w} ps={ps} pct={pct} wPts={wP} wMax={wM} checks={checks} onToggle={onToggle} player={player} showToast={showToast} />
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
          <p>To use this app we store your child's first and last name and your email address. No other personal information is collected or stored. Your data is not shared with any third party and is used solely to manage participation in the 2026 Summer Challenge. You can request deletion of your data at any time by contacting the coaches.</p>
        </div>
        <div className="tc-section">
          <strong>Participation</strong>
          <p>This challenge is run voluntarily by Fingallians Girls coaches for the benefit of the players. Points are awarded in good faith. The club reserves the right to amend the challenge at any time.</p>
        </div>
      </div>
    </div>
  );
}

function ProgressTab({ player, checks, isAdmin }) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!player) { setLoading(false); return; }
    sb.from("task_completions")
      .select("task_key, completed_at")
      .eq("player_id", player.id)
      .order("completed_at", { ascending: false })
      .then(({ data }) => { setCompletions(data || []); setLoading(false); });
  }, [player?.id]);

  const stats = useMemo(() => {
    let sessions = 0, minutes = 0, pts = 0, totalKm = 0;
    const runMins = 20, skillMins = 20, squadMins = 20;
    WEEKS.forEach(w => {
      w.runs.forEach((r, i) => {
        if (checks[runKey(w.week, i)]) { sessions++; minutes += runMins; pts += PTS.run; totalKm += parseFloat(r.distance) || 0; }
      });
      w.skills.forEach(s => { if (checks[skillKey(w.week, s.id)]) { sessions++; minutes += skillMins; pts += PTS.skill; } });
      if (checks[squadKey(w.week)]) { sessions++; minutes += squadMins; pts += PTS.squad; }
    });
    return { sessions, minutes, pts, totalKm };
  }, [checks]);

  const weeklyData = useMemo(() => {
    return WEEKS.map(w => {
      let runs = 0, skills = 0, speed = 0, squad = 0;
      w.runs.forEach((_, i) => { if (checks[runKey(w.week, i)]) runs++; });
      w.skills.forEach(s => { if (checks[skillKey(w.week, s.id)]) skills++; });
      (w.speed||[]).forEach(s => { if (checks[speedKey(w.week, s.id)]) speed++; });
      if (checks[squadKey(w.week)]) squad = 1;
      const total   = runs + skills + speed + squad;
      const maxPoss = w.runs.length + w.skills.length + (w.speed||[]).length + 1;
      return { week: w.week, runs, skills, speed, squad, total, maxPoss };
    });
  }, [checks]);

  const activityLog = useMemo(() => {
    return completions.map(c => {
      const k = c.task_key;
      let label = "", type = "other", week = null;
      WEEKS.forEach(w => {
        w.runs.forEach((r, i) => { if (runKey(w.week, i) === k) { label = `${r.label} (${r.distance})`; type = "run"; week = w.week; } });
        w.skills.forEach(s => { if (skillKey(w.week, s.id) === k) { label = s.label.replace(/^[^\w]+/, "").split(":")[0].trim(); type = "skill"; week = w.week; } });
        (w.speed||[]).forEach(s => { if (speedKey(w.week, s.id) === k) { label = s.label.replace(/^[^\w]+/, "").split(":")[0].trim(); type = "speed"; week = w.week; } });
        if (squadKey(w.week) === k) { label = "Squad Session"; type = "squad"; week = w.week; }
      });
      const date = c.completed_at ? new Date(c.completed_at).toLocaleDateString("en-IE", { day:"numeric", month:"short", year:"numeric" }) : null;
      return { label, type, week, date, key: k };
    }).filter(a => a.label);
  }, [completions]);

  const typeStyle = {
    run:   { color:"var(--g)",  bg:"var(--g3)",  icon:"🏃" },
    skill: { color:"#2e7d32",   bg:"#e8f5e9",    icon:"🏑" },
    speed: { color:"#7b1fa2",   bg:"#f3e5f5",    icon:"⚡" },
    squad: { color:"#c45e00",   bg:"#fff3e0",    icon:"👥" },
  };

  const maxWeekActivity = Math.max(...weeklyData.map(w => w.maxPoss), 1);

  if (!player) return (
    <div className="home-wrap" style={{textAlign:"center",paddingTop:40,color:"var(--muted)"}}>
      <div style={{fontSize:40,marginBottom:12}}>👤</div>
      <div style={{fontSize:14}}>No player linked yet.</div>
    </div>
  );

  return (
    <div className="home-wrap">
      <div style={{background:"linear-gradient(135deg,var(--g),#4a0a0e)",borderRadius:"var(--radius)",padding:"16px 18px",marginBottom:14,color:"#fff",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-8,bottom:-10,fontSize:70,opacity:0.07}}>🏃</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,color:"var(--gold)",letterSpacing:"0.02em"}}>
          {player.name.split(" ")[0]}'s Progress
        </div>
        <div style={{fontSize:11,opacity:0.65,marginTop:2}}>Fingallians Girls · Summer Challenge 2026</div>
        {isAdmin && (
          <div style={{fontSize:10,marginTop:4,background:"rgba(255,255,255,.12)",display:"inline-block",padding:"2px 8px",borderRadius:10,color:"rgba(255,255,255,.75)"}}>
            👁 Viewing as admin
          </div>
        )}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16,width:"100%"}}>
        {[
          { label:"Sessions\nLogged", value: stats.sessions, suffix:"",     color:"var(--g)",  icon:"✅" },
          { label:"Minutes\nActive",  value: stats.minutes,  suffix:" min", color:"#2e7d32",   icon:"⏱" },
          { label:"Total\nPoints",    value: stats.pts,      suffix:" pts", color:"#b8860b",   icon:"⭐" },
        ].map(s => (
          <div key={s.label} style={{background:"white",borderRadius:12,padding:"12px 8px",textAlign:"center",border:"1px solid #f0dede"}}>
            <div style={{fontSize:20}}>{s.icon}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,color:s.color,lineHeight:1,marginTop:4}}>{s.value}{s.suffix}</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:3,whiteSpace:"pre-line",lineHeight:1.3}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{background:"white",borderRadius:14,padding:"14px",marginBottom:14,border:"1px solid #f0dede",width:"100%"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"var(--dark)",letterSpacing:"0.04em",marginBottom:12}}>WEEKLY ACTIVITY</div>
        <div style={{display:"flex",gap:12,marginBottom:10,flexWrap:"wrap"}}>
          {[["var(--g)","Runs"],["#2e7d32","Skills"],["#7b1fa2","Speed"],["#c45e00","Squad"]].map(([c,l]) => (
            <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:10,height:10,borderRadius:2,background:c,flexShrink:0}}/>
              <span style={{fontSize:10,color:"var(--muted)"}}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:4,alignItems:"flex-end",height:80}}>
          {weeklyData.map(w => {
            const barH  = Math.max((w.total / maxWeekActivity) * 72, w.total > 0 ? 4 : 0);
            const runH  = (w.runs   / w.total || 0) * barH;
            const skillH= (w.skills / w.total || 0) * barH;
            const speedH= (w.speed  / w.total || 0) * barH;
            const squadH= (w.squad  / w.total || 0) * barH;
            const allDone = w.total === w.maxPoss;
            return (
              <div key={w.week} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",height:72,gap:1}}>
                  {w.squad > 0 && <div style={{width:"100%",height:Math.max(squadH,2),background:"#c45e00",borderRadius:"2px 2px 0 0",minHeight:3}}/>}
                  {w.speed > 0 && <div style={{width:"100%",height:Math.max(speedH,2),background:"#7b1fa2",minHeight:3}}/>}
                  {w.skills > 0 && <div style={{width:"100%",height:Math.max(skillH,2),background:"#2e7d32",minHeight:3}}/>}
                  {w.runs > 0 && <div style={{width:"100%",height:Math.max(runH,2),background:"var(--g)",borderRadius:w.skills===0&&w.squad===0?"2px 2px 0 0":0,minHeight:3}}/>}
                  {w.total === 0 && <div style={{width:"100%",height:3,background:"#f0dede",borderRadius:2}}/>}
                </div>
                <div style={{fontSize:9,color:allDone?"var(--g)":"var(--muted)",fontWeight:allDone?700:400}}>W{w.week}{allDone?"✓":""}</div>
              </div>
            );
          })}
        </div>
        {stats.totalKm > 0 && (
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #f0e8e8",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:18}}>🏃</span>
            <div>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,color:"var(--g)",fontWeight:700}}>{stats.totalKm.toFixed(1)} km</span>
              <span style={{fontSize:11,color:"var(--muted)",marginLeft:6}}>total distance run</span>
            </div>
          </div>
        )}
      </div>

      <div style={{background:"white",borderRadius:14,padding:"14px",border:"1px solid #f0dede",width:"100%"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"var(--dark)",letterSpacing:"0.04em",marginBottom:12}}>ACTIVITY LOG</div>
        {loading && <div style={{textAlign:"center",color:"var(--muted)",padding:"16px 0",fontSize:13}}>Loading…</div>}
        {!loading && activityLog.length === 0 && <div style={{textAlign:"center",color:"var(--muted)",padding:"16px 0",fontSize:13}}>No sessions logged yet — get out there! 🏃</div>}
        {!loading && activityLog.map((a, i) => {
          const ts = typeStyle[a.type] || typeStyle.skill;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<activityLog.length-1?"1px solid #f8f0f0":"none"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:ts.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ts.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--dark)",lineHeight:1.3}}>{a.label}</div>
                {a.week && <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>Week {a.week}</div>}
              </div>
              {a.date && <div style={{fontSize:11,color:"var(--muted)",textAlign:"right",flexShrink:0}}>{a.date}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoachesTab({ allPlayers, coachEmail, showToast, squadLabel, squadFilter }) {
  const [sub, setSub] = useState("leaderboard");
  const subTabs = [{ id:"leaderboard", label:"Leaderboard" }, { id:"fitness", label:"Testing" }];
  return (
    <div>
      <div style={{display:"flex",borderRadius:10,overflow:"hidden",border:"2px solid #a31621",marginBottom:16}}>
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{
            flex:1, padding:"9px 6px", border:"none", cursor:"pointer",
            fontFamily:"inherit", fontSize:13, fontWeight:700,
            background: sub===t.id ? "#a31621" : "#fff",
            color:      sub===t.id ? "#fff"    : "#a31621",
            opacity:    sub===t.id ? 1         : 0.5,
            transition:"all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>
      {sub === "leaderboard" && <ScoresTab squadLabel={squadLabel} squadFilter={squadFilter} />}
      {sub === "fitness"     && <FitnessTab allPlayers={allPlayers} coachEmail={coachEmail} showToast={showToast} />}
    </div>
  );
}

function ScoresTab({ squadLabel, squadFilter = SQUAD }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: players } = await sb.from("players").select("id,name").eq("squad", squadFilter);
      const { data: comps }   = await sb.from("task_completions").select("player_id,task_key");
      if (!players) return;
      const statsMap = {};
      comps?.forEach(r => { if (!statsMap[r.player_id]) statsMap[r.player_id] = {}; statsMap[r.player_id][r.task_key] = true; });
      const rows = players.map(p => ({ id: p.id, name: p.name, pts: totalPts(statsMap[p.id] || {}) })).sort((a,b) => b.pts - a.pts);
      setLeaderboard(rows);
      setLoading(false);
    }
    load();
  }, [squadFilter]);

  const rankEmoji = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}`;
  const maxPossible = WEEKS.reduce((a,w) => a + weekMaxPts(w), 0);

  return (
    <div>
      <div style={{background:"linear-gradient(135deg,var(--g) 0%,#4a0a0e 100%)",borderRadius:"var(--radius)",padding:"22px 20px",marginBottom:14,color:"white",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-10,bottom:-14,fontSize:100,opacity:0.07,pointerEvents:"none"}}>🏆</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,letterSpacing:"0.02em",color:"var(--gold)"}}>LEADERBOARD</div>
        <div style={{fontSize:12,opacity:0.75,marginTop:4}}>Fingallians Girls {squadLabel ? `· ${squadLabel}` : ""} · Summer Challenge 2026</div>
        <div style={{fontSize:11,opacity:0.6,marginTop:4}}>Updates live as sessions are logged</div>
      </div>
      {loading ? (
        <div className="loader"><div className="spinner"/>Loading scores…</div>
      ) : leaderboard.length === 0 ? (
        <div className="empty"><div className="icon">🏑</div><p>No scores yet — get logging!</p></div>
      ) : leaderboard.map((p, i) => {
        const pct = Math.round((p.pts / maxPossible) * 100);
        return (
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,background:"white",border:"2px solid transparent",borderRadius:14,padding:"12px 14px",marginBottom:8,boxShadow:"0 2px 10px rgba(163,22,33,0.08)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,width:32,textAlign:"center",flexShrink:0}}>{rankEmoji(i)}</div>
            <div style={{width:36,height:36,borderRadius:"50%",background:"var(--g)",color:"var(--gold)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,flexShrink:0}}>{p.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15}}>{p.name}</div>
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
    </div>
  );
}

function fmtTime(s) {
  if (!s && s !== 0) return "—";
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2,"0")}`;
}
function parseTime(val) {
  const v = val.trim();
  if (!v) return null;
  if (v.includes(":")) {
    const parts = v.split(":");
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    const total = m * 60 + s;
    return total > 0 ? total : null;
  }
  const n = parseInt(v, 10);
  return n > 0 ? n : null;
}

function FitnessTab({ allPlayers, coachEmail, showToast }) {
  const [period,   setPeriod]   = useState("pre");
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0,10));
  const [view,     setView]     = useState("entry");
  const [entries,  setEntries]  = useState({});
  const [cnotes,   setCnotes]   = useState({});
  const [open,     setOpen]     = useState({});
  const [saving,   setSaving]   = useState({});
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [ptsMap,   setPtsMap]   = useState({});
  const lapDebounce = useRef({});
  const entriesRef  = useRef({});

  useEffect(() => {
    if (!allPlayers.length) return;
    setLoading(true);
    const ids = allPlayers.map(p => p.id);
    Promise.all([
      sb.from("fitness_tests").select("*").in("player_id", ids).eq("period", period),
      sb.from("coach_notes").select("*").in("player_id", ids),
      sb.from("task_completions").select("player_id,task_key").in("player_id", ids),
    ]).then(([{ data: ft }, { data: cn }, { data: comps }]) => {
      const eMap = {};
      allPlayers.forEach(p => { eMap[p.id] = { lap: "", notes: "" }; });
      ft?.forEach(r => { eMap[r.player_id] = { lap: r.lap_time ? fmtTime(r.lap_time) : "", notes: r.notes || "" }; });
      setEntries(eMap);
      entriesRef.current = eMap;

      const cMap = {};
      allPlayers.forEach(p => { cMap[p.id] = { football: { myNote: "", saved: [] }, camogie: { myNote: "", saved: [] } }; });
      cn?.forEach(r => {
        if (!cMap[r.player_id]) return;
        cMap[r.player_id][r.sport]?.saved.push(r);
        if (r.coach_email === coachEmail) cMap[r.player_id][r.sport].myNote = r.note || "";
      });
      setCnotes(cMap);

      const statsMap = {};
      comps?.forEach(r => { if (!statsMap[r.player_id]) statsMap[r.player_id] = {}; statsMap[r.player_id][r.task_key] = true; });
      const pm = {};
      ids.forEach(id => { pm[id] = totalPts(statsMap[id] || {}); });
      setPtsMap(pm);
      setLoading(false);
    });
  }, [period, allPlayers, coachEmail]);

  function setField(pid, field, val) {
    setEntries(e => { const next = { ...e, [pid]: { ...e[pid], [field]: val } }; entriesRef.current = next; return next; });
  }
  function setCnoteField(pid, sport, val) {
    setCnotes(c => ({ ...c, [pid]: { ...c[pid], [sport]: { ...c[pid][sport], myNote: val } } }));
  }

  async function savePlayer(pid) {
    setSaving(s => ({ ...s, [pid]: true }));
    const e  = entries[pid] || {};
    const cn = cnotes[pid]  || { football:{ myNote:"", saved:[] }, camogie:{ myNote:"", saved:[] } };
    let errs = 0;
    const { error: ftErr } = await sb.from("fitness_tests").upsert({ player_id: pid, period, test_date: testDate, lap_time: parseTime(e.lap) || null, notes: e.notes?.trim() || null, updated_at: new Date().toISOString() }, { onConflict:"player_id,period" });
    if (ftErr) errs++;
    for (const sport of ["football","camogie"]) {
      const note = (cn[sport]?.myNote ?? "").trim();
      const payload = { player_id: pid, sport, coach_email: coachEmail, session_date: testDate, note: note || null, updated_at: new Date().toISOString() };
      const { error } = await sb.from("coach_notes").upsert(payload, { onConflict:"player_id,sport,coach_email" });
      if (error) errs++;
      else {
        setCnotes(c => {
          const prev = c[pid] || { football:{ myNote:"", saved:[] }, camogie:{ myNote:"", saved:[] } };
          const existing = (prev[sport]?.saved||[]).filter(s => s.coach_email !== coachEmail);
          return { ...c, [pid]: { ...prev, [sport]: { ...prev[sport], saved:[...existing, payload] } } };
        });
      }
    }
    setSaving(s => ({ ...s, [pid]: false }));
    if (!errs) { showToast("✅ Saved!"); const pObj = allPlayers.find(p => p.id === pid); logAudit(coachEmail, pObj || { id: pid, name: "Unknown" }, "note_saved", `Coach notes saved – ${pObj?.name || pid}`, null, period); }
    else showToast("⚠️ Some changes failed to save");
  }

  const coachName  = email => ({"e.t.archbold@gmail.com":"Elaine","mwyse86@gmail.com":"Coach M"}[email] || email.split("@")[0]);
  const coachColor = email => ({"e.t.archbold@gmail.com":"#1565c0","mwyse86@gmail.com":"#2e7d32"}[email] || "#666");
  const filledCount = Object.values(entries).filter(e => parseTime(e.lap)).length;

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div><label className="lbl">Test Period</label>
          <select className="inp" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="pre">🌱 Pre-Summer (Jun)</option>
            <option value="post">🏆 Post-Summer (Aug)</option>
          </select>
        </div>
        <div><label className="lbl">Session Date</label>
          <input className="inp" type="date" value={testDate} onChange={e => setTestDate(e.target.value)} />
        </div>
      </div>
      <div style={{display:"flex",borderRadius:10,overflow:"hidden",border:"2px solid #a31621",marginBottom:16,width:"100%"}}>
        {[["entry","Enter Times"],["results","Results Table"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)} style={{ flex:1, padding:"10px 8px", border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700, background: view===v ? "#a31621" : "#fff", color: view===v ? "#fff" : "#a31621", opacity: view===v ? 1 : 0.45, transition:"all 0.15s" }}>{label}</button>
        ))}
      </div>
      {loading && <div style={{textAlign:"center",color:"var(--muted)",padding:"20px 0",fontSize:13}}>Loading…</div>}
      {!loading && view === "entry" && (
        <>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:10,lineHeight:1.6}}>Lap times save automatically. Open Notes to add coaching observations and hit Save.</div>
          <input className="inp" placeholder="🔍  Search player…" value={search} onChange={e => setSearch(e.target.value)} style={{marginBottom:12,fontSize:13,padding:"8px 12px"}} />
          {allPlayers.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((p) => {
            const e  = entries[p.id] || { lap:"", notes:"" };
            const cn = cnotes[p.id]  || { football:{ myNote:"", saved:[] }, camogie:{ myNote:"", saved:[] } };
            const lapValid  = e.lap ? parseTime(e.lap) !== null : true;
            const notesOpen = !!open[p.id];
            const hasNotes  = cn.football.saved.filter(s=>s.note).length + (cn.camogie?.saved||[]).filter(s=>s.note).length;
            return (
              <div key={p.id} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:12,marginBottom:8,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 90px",gap:8,padding:"10px 12px",alignItems:"center"}}>
                  <div style={{fontWeight:700,fontSize:13,color:"var(--dark)",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                    {p.name}
                    <span style={{background:"#fff4cc",color:"#7a5c00",fontSize:11,fontWeight:900,padding:"1px 7px",borderRadius:10,border:"1px solid #d4a017",flexShrink:0}}>{ptsMap[p.id] || 0} pts</span>
                  </div>
                  <div>
                    <div style={{fontSize:9,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3,textAlign:"center"}}>Lap Time</div>
                    <input className="inp" placeholder="m:ss" value={e.lap}
                      onChange={ev => {
                        const val = ev.target.value;
                        setField(p.id,"lap",val);
                        clearTimeout(lapDebounce.current[p.id]);
                        lapDebounce.current[p.id] = setTimeout(async () => {
                          const secs = parseTime(val);
                          if (!secs && val.trim() !== "") return;
                          const cur = entriesRef.current[p.id] || {};
                          let error;
                          if (secs) {
                            ({ error } = await sb.from("fitness_tests").upsert({ player_id: p.id, period, test_date: testDate, lap_time: secs, notes: cur.notes?.trim() || null, updated_at: new Date().toISOString() }, { onConflict:"player_id,period" }));
                          } else {
                            ({ error } = await sb.from("fitness_tests").update({ lap_time: null, updated_at: new Date().toISOString() }).eq("player_id", p.id).eq("period", period));
                            error = null;
                          }
                          if (!error) { showToast(secs ? `✅ ${p.name.split(" ")[0]} lap saved` : `✅ ${p.name.split(" ")[0]} lap cleared`); logAudit(coachEmail, p, secs ? "lap_saved" : "lap_cleared", `${period === "pre" ? "Pre" : "Post"}-summer lap – ${p.name}`, null, secs ? `${Math.floor(secs/60)}:${String(secs%60).padStart(2,"0")}` : "cleared"); }
                          else showToast("⚠️ Lap save failed");
                        }, 800);
                      }}
                      style={{textAlign:"center",padding:"5px 4px",fontSize:13,fontWeight:700,borderColor:!lapValid?"#e53935":undefined,color:parseTime(e.lap)?"#2e7d32":"inherit"}} />
                  </div>
                </div>
                <div style={{borderTop:"1px solid #f0f0f0"}}>
                  <button onClick={() => setOpen(o => ({...o, [p.id]: !o[p.id]}))}
                    style={{width:"100%",padding:"8px 12px",border:"none",background:notesOpen?"#f0f4ff":"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,color:"#333",fontFamily:"inherit"}}>
                    <span>📝 Notes</span>
                    {hasNotes > 0 && <span style={{background:"var(--primary)",color:"#fff",fontSize:10,fontWeight:900,padding:"1px 7px",borderRadius:10}}>{hasNotes}</span>}
                    <span style={{marginLeft:"auto",fontSize:11,color:"#999"}}>{notesOpen?"▲":"▼"}</span>
                  </button>
                </div>
                {notesOpen && (
                  <div style={{padding:"12px",background:"#fafafa",borderTop:"1px solid #f0f0f0",display:"flex",flexDirection:"column",gap:12}}>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--muted)",marginBottom:4}}>🏃 Fitness Notes</div>
                      <input className="inp" placeholder="e.g. Strong effort, good pace…" value={e.notes} onChange={ev => setField(p.id,"notes",ev.target.value)} style={{fontSize:12,padding:"6px 8px",width:"100%"}} />
                    </div>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--muted)",marginBottom:4}}>⚽ Football Notes</div>
                      <NoteAccordionBody sport="football" cn={cn.football} coachEmail={coachEmail} coachName={coachName} coachColor={coachColor} onChange={val => setCnoteField(p.id,"football",val)} />
                    </div>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--muted)",marginBottom:4}}>🏑 Camogie Notes</div>
                      <NoteAccordionBody sport="camogie" cn={cn.camogie || { myNote: "", saved: [] }} coachEmail={coachEmail} coachName={coachName} coachColor={coachColor} onChange={val => setCnoteField(p.id,"camogie",val)} />
                    </div>
                    <button onClick={() => savePlayer(p.id)} disabled={!!saving[p.id]}
                      style={{padding:"11px",borderRadius:8,border:"none",background:saving[p.id]?"#ccc":"#a31621",color:"#fff",fontWeight:700,fontSize:14,cursor:saving[p.id]?"not-allowed":"pointer",fontFamily:"inherit",width:"100%",letterSpacing:"0.04em"}}>
                      {saving[p.id] ? "Saving…" : "Save"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>{filledCount} of {allPlayers.length} players timed</div>
        </>
      )}
      {!loading && view === "results" && <ResultsTable allPlayers={allPlayers} period={period} ptsMap={ptsMap} />}
    </div>
  );
}

function NoteAccordionBody({ sport, cn, coachEmail, coachName, coachColor, onChange }) {
  const otherNotes = cn.saved.filter(s => s.coach_email !== coachEmail && s.note);
  return (
    <div>
      {otherNotes.length > 0 && (
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
          {otherNotes.map(s => (
            <div key={s.coach_email} style={{background:"#fff",borderRadius:6,padding:"6px 10px",fontSize:12,lineHeight:1.5,borderLeft:`3px solid ${coachColor(s.coach_email)}`}}>
              <span style={{fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",color:coachColor(s.coach_email)}}>{coachName(s.coach_email)}:&nbsp;</span>
              {s.note}
            </div>
          ))}
        </div>
      )}
      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:coachColor(coachEmail),marginBottom:4}}>{coachName(coachEmail)} (you)</div>
      <textarea className="inp" placeholder={`Your ${sport} note…`} value={cn.myNote} onChange={e => onChange(e.target.value)} rows={2} style={{width:"100%",resize:"vertical",fontSize:12,padding:"7px 10px"}} />
    </div>
  );
}

function ResultsTable({ allPlayers, period, ptsMap = {} }) {
  const [allTests,   setAllTests]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showPeriod, setShowPeriod] = useState(period);

  useEffect(() => {
    if (!allPlayers.length) return;
    sb.from("fitness_tests").select("*").in("player_id", allPlayers.map(p => p.id))
      .then(({ data }) => { setAllTests(data || []); setLoading(false); });
  }, [allPlayers]);

  if (loading) return <div style={{textAlign:"center",color:"#9a7070",padding:"20px 0",fontSize:13}}>Loading…</div>;

  const playerMap = {};
  allPlayers.forEach(p => { playerMap[p.id] = { id: p.id, name: p.name, pre: null, post: null }; });
  allTests.forEach(t => { if (playerMap[t.player_id]) playerMap[t.player_id][t.period] = t; });

  const base = Object.values(playerMap);
  const maxPts = Math.max(...base.map(r => ptsMap[r.id] || 0), 1);

  const rows = base.sort((a, b) => {
    const ta = a[showPeriod]?.lap_time, tb = b[showPeriod]?.lap_time;
    const pa = ptsMap[a.id] || 0, pb = ptsMap[b.id] || 0;
    if (ta && tb) { const scoreA = (ta / 600) - (pa / maxPts); const scoreB = (tb / 600) - (pb / maxPts); return scoreA - scoreB; }
    if (!ta && !tb) return pb - pa;
    if (!ta) return 1;
    if (!tb) return -1;
  });

  const hasAnyPost  = rows.some(r => r.post?.lap_time);
  const medalColors = ["#f5c842","#b0b0b0","#cd7f32"];
  const cols = hasAnyPost ? "28px 1fr 70px 70px 60px 55px" : "28px 1fr 80px 55px";

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
        <span style={{fontSize:11,color:"#9a7070",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Rank by:</span>
        {["pre","post"].map(p => (
          <button key={p} onClick={() => setShowPeriod(p)} style={{ padding:"6px 14px", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700, background: showPeriod===p ? "#a31621" : "#fff", color: showPeriod===p ? "#fff" : "#a31621", border: "2px solid #a31621", opacity: showPeriod===p ? 1 : 0.45, transition:"all 0.15s" }}>
            {p === "pre" ? "🌱 Pre" : "🏆 Post"}
          </button>
        ))}
      </div>
      <div style={{display:"grid", gridTemplateColumns:cols, gap:6, padding:"7px 10px", background:"#f5f5f5", borderRadius:"8px 8px 0 0", fontSize:11, fontWeight:700, color:"#5a3a3d", textTransform:"uppercase", letterSpacing:"0.06em"}}>
        <div>#</div><div>Player</div><div style={{textAlign:"center"}}>Pre Lap</div>
        {hasAnyPost && <div style={{textAlign:"center"}}>Post Lap</div>}
        {hasAnyPost && <div style={{textAlign:"center"}}>Diff</div>}
        <div style={{textAlign:"center"}}>Pts</div>
      </div>
      {rows.map((r, i) => {
        const preLap  = r.pre?.lap_time  ?? null;
        const postLap = r.post?.lap_time ?? null;
        const diff    = preLap && postLap ? postLap - preLap : null;
        const improved = diff !== null && diff < 0;
        const slower   = diff !== null && diff > 0;
        const pts      = ptsMap[r.id] || 0;
        const preNotes = r.pre?.notes, postNotes = r.post?.notes;
        return (
          <div key={r.name}>
            <div style={{display:"grid", gridTemplateColumns:cols, gap:6, padding:"9px 10px", alignItems:"center", background: i%2===0 ? "#fff" : "#fafafa", borderBottom:"1px solid #f0f0f0"}}>
              <div style={{fontSize:i<3?16:12, textAlign:"center", color:i<3?medalColors[i]:"#ccc", fontWeight:900}}>{i<3 ? ["🥇","🥈","🥉"][i] : i+1}</div>
              <div style={{fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
              <div style={{textAlign:"center",fontSize:13,color:showPeriod==="pre"?"#a31621":"#5a3a3d",fontWeight:showPeriod==="pre"?700:400}}>{preLap ? fmtTime(preLap) : <span style={{color:"#ddd"}}>—</span>}</div>
              {hasAnyPost && <div style={{textAlign:"center",fontSize:13,color:showPeriod==="post"?"#a31621":"#5a3a3d",fontWeight:showPeriod==="post"?700:400}}>{postLap ? fmtTime(postLap) : <span style={{color:"#ddd"}}>—</span>}</div>}
              {hasAnyPost && <div style={{textAlign:"center",fontSize:12,fontWeight:700,color:improved?"#2e7d32":slower?"#e53935":"#ccc"}}>{diff===null ? "—" : improved ? `▼${fmtTime(Math.abs(diff))}` : slower ? `▲${fmtTime(diff)}` : "="}</div>}
              <div style={{textAlign:"center"}}><span style={{background:"#fff4cc",color:"#1a0a0b",fontSize:12,fontWeight:900,padding:"2px 8px",borderRadius:10,border:"1px solid #d4a017"}}>{pts}</span></div>
            </div>
            {(preNotes||postNotes) && (
              <div style={{padding:"4px 10px 8px 44px",background:i%2===0?"#fff":"#fafafa",borderBottom:"1px solid #f0f0f0",display:"flex",gap:16,flexWrap:"wrap"}}>
                {preNotes  && <div style={{fontSize:11,color:"#9a7070",fontStyle:"italic",lineHeight:1.5}}><span style={{fontWeight:700,fontStyle:"normal",color:"#e65100"}}>Pre: </span>{preNotes}</div>}
                {postNotes && <div style={{fontSize:11,color:"#9a7070",fontStyle:"italic",lineHeight:1.5}}><span style={{fontWeight:700,fontStyle:"normal",color:"#2e7d32"}}>Post: </span>{postNotes}</div>}
              </div>
            )}
          </div>
        );
      })}
      {(() => {
        const timed = rows.filter(r => r[showPeriod]?.lap_time);
        if (!timed.length) return null;
        const times   = timed.map(r => r[showPeriod].lap_time);
        const avg     = Math.round(times.reduce((a,b)=>a+b,0)/times.length);
        const improved = rows.filter(r => r.pre?.lap_time && r.post?.lap_time && r.post.lap_time < r.pre.lap_time);
        const topPts  = Math.max(...rows.map(r => ptsMap[r.id]||0));
        return (
          <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
            {[{label:"Squad avg",val:fmtTime(avg),color:"#a31621"},{label:"Fastest",val:fmtTime(Math.min(...times)),color:"#2e7d32"},{label:"Top pts",val:`${topPts} pts`,color:"#d4a017"},...(improved.length?[{label:"Improved",val:`${improved.length} girls`,color:"#2e7d32"}]:[])].map(stat => (
              <div key={stat.label} style={{flex:1,minWidth:80,background:"#f9f9f9",border:"1px solid #eee",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:17,fontWeight:900,color:stat.color}}>{stat.val}</div>
                <div style={{fontSize:10,color:"#9a7070",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2}}>{stat.label}</div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

function DashboardTab({ allPlayers, squadLabel, squadFilter = SQUAD }) {
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [recentLog,  setRecentLog]  = useState([]);
  const [claimedIds, setClaimedIds] = useState(new Set());
  const [ptsMap,     setPtsMap]     = useState({});
  const [weeklyMap,  setWeeklyMap]  = useState({});
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    if (!allPlayers.length) return;
    const ids = allPlayers.map(p => p.id);
    Promise.all([
      sb.from("task_completions").select("player_id,task_key,completed_at").in("player_id", ids),
      sb.from("parent_players").select("player_id").in("player_id", ids),
      sb.from("audit_log").select("user_email,player_name,action,detail,created_at,player_id").order("created_at",{ascending:false}).limit(100),
    ]).then(([{data:comps},{data:links},{data:logs}]) => {
      const byPlayer = {};
      ids.forEach(id => { byPlayer[id] = {}; });
      comps?.forEach(r => { if(byPlayer[r.player_id]) byPlayer[r.player_id][r.task_key]=true; });
      const pm = {};
      ids.forEach(id => { pm[id] = totalPts(byPlayer[id]); });
      setPtsMap(pm);

      const wm = {};
      ids.forEach(id => { wm[id] = {}; WEEKS.forEach(w => { wm[id][w.week] = weekPts(w, byPlayer[id]); }); });
      setWeeklyMap(wm);

      setClaimedIds(new Set(links?.map(l => l.player_id) || []));
      // Filter activity log to only show entries for this squad's players
      const squadLogs = (logs || []).filter(r => !r.player_id || ids.includes(r.player_id));
      setRecentLog(squadLogs.slice(0, 20));

      const totalSessions    = comps?.length || 0;
      const playersActive    = new Set(comps?.map(r => r.player_id)).size;
      const avgPts           = ids.length ? Math.round(Object.values(pm).reduce((a,b)=>a+b,0) / ids.length) : 0;
      const weekAgo          = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
      const thisWeekSessions = comps?.filter(r => r.completed_at && new Date(r.completed_at) > weekAgo).length || 0;
      setStats({ totalSessions, playersActive, avgPts, thisWeekSessions,
                 registered: new Set(links?.map(l=>l.player_id)||[]).size, total: ids.length });
      setLoading(false);
    });
  }, [allPlayers]);

  const currentWeek    = Math.min(Math.max(Math.floor((new Date() - new Date("2026-06-29")) / (7*24*60*60*1000)) + 1, 1), 8);
  const sortedPlayers  = allPlayers.slice().sort((a,b)=>(ptsMap[b.id]||0)-(ptsMap[a.id]||0));
  const maxPts         = Math.max(...sortedPlayers.map(p=>ptsMap[p.id]||0), 1);
  const maxPossible    = WEEKS.reduce((a,w)=>a+weekMaxPts(w),0);

  const actionStyle = {
    task_complete:   { icon:"✅", color:"#2e7d32", bg:"#e8f5e9",  label:"Marked complete"   },
    task_incomplete: { icon:"↩️", color:"#e65100", bg:"#fff3e0",  label:"Marked incomplete" },
    lap_saved:       { icon:"⏱️", color:"#1565c0", bg:"#e3f2fd",  label:"Lap time saved"    },
    lap_cleared:     { icon:"🗑️", color:"#9e9e9e", bg:"#f5f5f5",  label:"Lap time cleared"  },
    note_saved:      { icon:"📋", color:"#7b1fa2", bg:"#f3e5f5",  label:"Coach note saved"  },
    video_watched:   { icon:"▶️", color:"#c62828", bg:"#ffebee",  label:"Video watched"     },
  };

  const fmtAgo = (ts) => {
    if (!ts) return "";
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return new Date(ts).toLocaleDateString("en-IE",{day:"numeric",month:"short"});
  };

  if (loading) return <div className="loader"><div className="spinner"/>Loading dashboard…</div>;

  return (
    <div>
      <div style={{background:"linear-gradient(135deg,var(--g),#4a0a0e)",borderRadius:"var(--radius)",padding:"16px 18px",marginBottom:14,color:"#fff",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-10,bottom:-14,fontSize:90,opacity:0.06,pointerEvents:"none"}}>📊</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,color:"var(--gold)",letterSpacing:"0.02em"}}>SQUAD DASHBOARD</div>
        <div style={{fontSize:12,opacity:0.7,marginTop:2}}>Fingallians Girls {squadLabel ? `· ${squadLabel}` : ""} · Week {currentWeek} of 8 · Summer Challenge 2026</div>
        <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
          {[["overview","Overview"],["log","Activity Log"]].map(([v,l])=>(
            <button key={v} onClick={()=>setActiveView(v)} style={{padding:"5px 12px",borderRadius:16,border:"1px solid rgba(255,255,255,0.3)",background:activeView===v?"rgba(255,255,255,0.2)":"transparent",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:activeView===v?700:400}}>{l}</button>
          ))}
        </div>
      </div>

      {activeView === "overview" && <>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:14}}>
          {[
            { label:"Registered",    value:`${stats.registered}/${stats.total}`, sub:`${stats.total-stats.registered} not signed up`, color:"#2e7d32" },
            { label:"Active players",value:stats.playersActive,                  sub:"at least 1 session logged",    color:"var(--g)"  },
            { label:"Sessions (7d)", value:stats.thisWeekSessions,              sub:"logged in last 7 days",          color:"#1565c0"   },
            { label:"Squad avg pts", value:stats.avgPts,                         sub:`of ${maxPossible} possible`,    color:"#b8860b"   },
          ].map(s=>(
            <div key={s.label} style={{background:"white",borderRadius:12,padding:"12px 14px",border:"1px solid #f0dede"}}>
              <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{s.label}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,color:s.color,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{background:"white",borderRadius:14,padding:"14px",border:"1px solid #f0dede",marginBottom:14}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"var(--dark)",letterSpacing:"0.04em",marginBottom:10}}>LEADERBOARD</div>
          {sortedPlayers.map((p,i)=>{
            const pts = ptsMap[p.id]||0;
            const pct = Math.round((pts/maxPossible)*100);
            const medals = ["🥇","🥈","🥉"];
            return (
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,padding:"8px 10px",background:i%2===0?"#fdfafa":"white",borderRadius:10}}>
                <div style={{width:24,textAlign:"center",fontSize:i<3?18:12,flexShrink:0,color:i<3?["#f5c842","#b0b0b0","#cd7f32"][i]:"var(--muted)",fontWeight:900}}>{i<3?medals[i]:i+1}</div>
                <div style={{width:32,height:32,borderRadius:"50%",background:"var(--g)",color:"var(--gold)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,flexShrink:0}}>{p.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{p.name}</div>
                  <div style={{height:3,background:"#f0dede",borderRadius:2,marginTop:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:i===0?"var(--gold)":"var(--g)",borderRadius:2,transition:"width 0.4s"}}/>
                  </div>
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,color:"var(--g)",flexShrink:0}}>
                  {pts} <span style={{fontFamily:"'Lato',sans-serif",fontSize:10,color:"var(--muted)",fontWeight:600}}>pts</span>
                </div>
              </div>
            );
          })}
        </div>



        {stats.total - stats.registered > 0 && (
          <div style={{background:"white",borderRadius:14,padding:"14px",border:"1px solid #f0dede"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"var(--dark)",letterSpacing:"0.04em",marginBottom:10}}>⏳ NOT YET REGISTERED ({stats.total - stats.registered})</div>
            {allPlayers.filter(p=>!claimedIds.has(p.id)).map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f8f0f0"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"#e65100",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,flexShrink:0}}>{p.name[0]}</div>
                <div style={{flex:1,fontSize:13,fontWeight:600}}>{p.name}</div>
                <div style={{fontSize:11,color:"#e65100",fontWeight:700}}>No account</div>
              </div>
            ))}
          </div>
        )}
      </>}

      {activeView === "squad" && (
        <div style={{background:"white",borderRadius:14,padding:"14px",border:"1px solid #f0dede"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"var(--dark)",letterSpacing:"0.04em",marginBottom:10}}>ALL PLAYERS · {sortedPlayers.length} TOTAL</div>
          {sortedPlayers.map((p,i)=>{
            const pts    = ptsMap[p.id]||0;
            const pct    = Math.round((pts/maxPossible)*100);
            const active = claimedIds.has(p.id);
            return (
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid #f8f0f0"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,width:24,color:"var(--muted)",textAlign:"center",flexShrink:0}}>{i+1}</div>
                <div style={{width:32,height:32,borderRadius:"50%",background:active?"var(--g)":"#ccc",color:active?"var(--gold)":"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,flexShrink:0}}>{p.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>{p.name}{!active && <span style={{fontSize:10,color:"#e65100",fontWeight:700}}>no account</span>}</div>
                  <div style={{height:3,background:"#f0dede",borderRadius:2,marginTop:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:i===0?"var(--gold)":"var(--g)",borderRadius:2}}/>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,color:"var(--g)"}}>{pts}</div>
                  <div style={{fontSize:10,color:"var(--muted)"}}>{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeView === "weekly" && (
        <div style={{background:"white",borderRadius:14,padding:"14px",border:"1px solid #f0dede"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"var(--dark)",letterSpacing:"0.04em",marginBottom:10}}>POINTS BY WEEK · SQUAD</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr repeat(8,40px)",gap:4,fontSize:10,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6,textAlign:"center"}}>
            <div style={{textAlign:"left"}}>Player</div>
            {WEEKS.map(w=>(<div key={w.week} style={{color:w.week===currentWeek?"var(--g)":"var(--muted)"}}>W{w.week}</div>))}
          </div>
          {sortedPlayers.map(p=>(
            <div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr repeat(8,40px)",gap:4,padding:"5px 0",borderBottom:"1px solid #f8f0f0",alignItems:"center",textAlign:"center"}}>
              <div style={{fontSize:12,fontWeight:600,textAlign:"left",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name.split(" ")[0]}</div>
              {WEEKS.map(w=>{
                const wPts = weeklyMap[p.id]?.[w.week] || 0;
                const wMax = weekMaxPts(w);
                const wPct = Math.round((wPts/wMax)*100);
                const bg   = wPts===0 ? "#f0dede" : wPct>=80 ? "var(--g)" : wPct>=40 ? "#e06060" : "#f5c0c0";
                const col  = wPts===0 ? "var(--muted)" : wPct>=40 ? "#fff" : "var(--dark)";
                return (<div key={w.week} style={{background:bg,borderRadius:4,padding:"3px 0",fontSize:11,fontWeight:700,color:col}}>{wPts||""}</div>);
              })}
            </div>
          ))}
          <div style={{display:"flex",gap:12,marginTop:10,fontSize:10,color:"var(--muted)"}}>
            {[["var(--g)","High"],["#f5c0c0","Low"],["#f0dede","None"]].map(([bg,l])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:bg,flexShrink:0}}/>{l}</div>))}
          </div>
        </div>
      )}

      {activeView === "log" && (
        <div style={{background:"white",borderRadius:14,padding:"14px",border:"1px solid #f0dede"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"var(--dark)",letterSpacing:"0.04em",marginBottom:10}}>RECENT ACTIVITY</div>
          {recentLog.length === 0 && <div style={{textAlign:"center",color:"var(--muted)",padding:"20px 0",fontSize:13}}>No activity logged yet</div>}
          {recentLog.map((r,i)=>{
            const s = actionStyle[r.action] || {icon:"•",color:"var(--muted)",bg:"#f5f5f5",label:r.action};
            const fullDate = r.created_at ? new Date(r.created_at).toLocaleString("en-IE", {
              day:"numeric", month:"short", year:"numeric",
              hour:"2-digit", minute:"2-digit"
            }) : "";
            return (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:i<recentLog.length-1?"1px solid #f8f0f0":"none"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--dark)"}}>{r.player_name || r.user_email?.split("@")[0]}</div>
                    <div style={{fontSize:11,fontWeight:700,color:s.color,background:s.bg,padding:"1px 8px",borderRadius:10}}>{s.label}</div>
                  </div>
                  <div style={{fontSize:12,color:"var(--mid)",marginTop:3,lineHeight:1.4}}>{r.detail}</div>
                  <div style={{fontSize:10,color:"var(--muted)",marginTop:3}}>🕐 {fullDate}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminTab({ allPlayers, onRefresh, showToast, currentSquad }) {
  const [newName,      setNewName]      = useState("");
  const [adding,       setAdding]       = useState(false);
  const [playerStats,  setPlayerStats]  = useState({});
  const [claimedIds,   setClaimedIds]   = useState(new Set());

  useEffect(() => {
    async function load() {
      const { data: comps } = await sb.from("task_completions").select("player_id,task_key");
      const stats = {};
      comps?.forEach(r => { if (!stats[r.player_id]) stats[r.player_id] = {}; stats[r.player_id][r.task_key] = true; });
      setPlayerStats(stats);
      const { data: links } = await sb.from("parent_players").select("player_id");
      setClaimedIds(new Set(links?.map(l => l.player_id) || []));
    }
    load();
  }, [allPlayers]);

  async function addPlayer() {
    if (!newName.trim()) return;
    setAdding(true);
    const { error } = await sb.from("players").insert({ name: newName.trim(), squad: currentSquad });
    if (error) { showToast("❌ Error adding player"); }
    else { showToast(`✅ ${newName.trim()} added to ${currentSquad === "2017" ? "2017 Girls" : "2015 Girls"}!`); setNewName(""); onRefresh(); }
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
    <div>
      <div className="admin-banner">
        <div style={{fontSize:28}}>⚙️</div>
        <div><h2>ADMIN PANEL</h2><p>Managing: {currentSquad === "2017" ? "2017 Girls" : "2015 Girls"}</p></div>
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
            <div className="player-info"><div className="player-name">{p.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>Parent hasn't signed up yet</div></div>
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
              <div className="player-info"><div className="player-name">{p.name}</div><div className="prog-mini"><div className="prog-mini-fill" style={{width:`${pct}%`}}/></div></div>
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

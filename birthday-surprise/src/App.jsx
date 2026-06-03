import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE_DATA, CONFIG } from "./data/timelineData.js";

const C = {
  lav800:"#4a2560", lav600:"#9060c0", lav400:"#c496dc",
  peach:"#ffb482", textSec:"rgba(90,50,110,.65)", textMut:"rgba(150,100,170,.4)",
};
const bgMain = "linear-gradient(160deg,#f9f0ff 0%,#fff5ee 55%,#ffeee6 100%)";
const isMobile = () => window.innerWidth < 700;

/* ═══════════════════════════════════════════════════════════════════
   10 BUTTERFLY SPECIES
═══════════════════════════════════════════════════════════════════ */
const SPECIES = [
  { fw1:"#90e8ff", fw2:"#0a72cc", fw3:"#020c30", hw1:"#40a8e0", hw2:"#021858", sh:"rgba(180,240,255,0.65)", body:"#080810", speed:1.00 },
  { fw1:"#fffca0", fw2:"#e89000", fw3:"#1c0800", hw1:"#ffcc20", hw2:"#603800", sh:"rgba(255,252,180,0.68)", body:"#100800", speed:0.92 },
  { fw1:"#ffd8f8", fw2:"#d020a8", fw3:"#1e0020", hw1:"#e050b8", hw2:"#560038", sh:"rgba(255,210,248,0.65)", body:"#100010", speed:1.04 },
  { fw1:"#d0eeff", fw2:"#2080e0", fw3:"#010c30", hw1:"#88c8f8", hw2:"#081870", sh:"rgba(200,230,255,0.62)", body:"#080c18", speed:1.15 },
  { fw1:"#fff0a0", fw2:"#e07800", fw3:"#1c0600", hw1:"#ffb820", hw2:"#502800", sh:"rgba(255,240,160,0.65)", body:"#0e0800", speed:0.88 },
  { fw1:"#c0fce0", fw2:"#10a860", fw3:"#011a10", hw1:"#58e0a8", hw2:"#065030", sh:"rgba(180,255,220,0.62)", body:"#081208", speed:1.08 },
  { fw1:"#ffc0b0", fw2:"#b00010", fw3:"#0e0002", hw1:"#f05040", hw2:"#780010", sh:"rgba(255,200,190,0.60)", body:"#0e0000", speed:0.96 },
  { fw1:"#ead0ff", fw2:"#6010c0", fw3:"#0c0028", hw1:"#c068f8", hw2:"#3a0090", sh:"rgba(220,180,255,0.65)", body:"#080012", speed:1.00 },
  { fw1:"#ffd8b0", fw2:"#d04000", fw3:"#0e0200", hw1:"#ff9858", hw2:"#701e08", sh:"rgba(255,220,190,0.60)", body:"#0e0400", speed:0.98 },
  { fw1:"#c0c8ff", fw2:"#1828b0", fw3:"#010210", hw1:"#7080f0", hw2:"#0c1678", sh:"rgba(190,200,255,0.62)", body:"#050810", speed:1.06 },
];

/* ═══════════════════════════════════════════════════════════════════
   WING RENDERER — draws the RIGHT wing; caller mirrors for left.
   The key fix: we draw ONE wing and scale(-x, 1) for the mirror,
   so both sides are ALWAYS perfectly symmetric.
═══════════════════════════════════════════════════════════════════ */
function drawWing(ctx, sp, openAmt) {
  // Forewing path (right side, positive x)
  const fw = new Path2D();
  fw.moveTo(0, -2);
  fw.bezierCurveTo(6,-18, 34,-54, 66,-60);
  fw.bezierCurveTo(92,-64, 104,-46, 96,-24);
  fw.bezierCurveTo(88, -6, 68,  6, 50, 14);
  fw.bezierCurveTo(34, 20, 14, 16,  4,  6);
  fw.closePath();

  // Hindwing path (right side)
  const hw = new Path2D();
  hw.moveTo(0, 6);
  hw.bezierCurveTo(6, 18, 26, 46, 50, 52);
  hw.bezierCurveTo(68, 57, 78, 40, 70, 22);
  hw.bezierCurveTo(62,  4, 42, -2, 24,  2);
  hw.bezierCurveTo(14,  4,  2,  6,  0,  6);
  hw.closePath();

  // ── Hindwing fill ──
  const hg = ctx.createRadialGradient(22,28,3, 40,34,54);
  hg.addColorStop(0, sp.hw1); hg.addColorStop(1, sp.hw2);
  ctx.fillStyle = hg; ctx.fill(hw);

  ctx.save(); ctx.clip(hw);
  // outer shadow
  const he = ctx.createRadialGradient(52,48,4, 40,36,40);
  he.addColorStop(0,"rgba(0,0,0,0.42)"); he.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=he; ctx.fill(hw);
  // shimmer
  const hs = ctx.createRadialGradient(12,16,2, 20,22,28);
  hs.addColorStop(0, sp.sh.replace(/[\d.]+\)$/,"0.38)")); hs.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=hs; ctx.fill(hw);
  ctx.restore();
  ctx.strokeStyle=sp.hw2; ctx.lineWidth=0.8; ctx.globalAlpha=0.45; ctx.stroke(hw); ctx.globalAlpha=1;

  // ── Forewing fill ──
  const fg = ctx.createRadialGradient(26,-26,4, 50,-18,80);
  fg.addColorStop(0, sp.fw1); fg.addColorStop(0.42, sp.fw2); fg.addColorStop(1, sp.fw3);
  ctx.fillStyle=fg; ctx.fill(fw);

  ctx.save(); ctx.clip(fw);
  // costa dark border
  const cb = ctx.createLinearGradient(0,-62, 0,8);
  cb.addColorStop(0,"rgba(0,0,0,0.55)"); cb.addColorStop(0.22,"rgba(0,0,0,0.2)"); cb.addColorStop(0.5,"rgba(0,0,0,0)");
  ctx.fillStyle=cb; ctx.fill(fw);
  // trailing edge
  const tb = ctx.createLinearGradient(52,14, 4,6);
  tb.addColorStop(0,"rgba(0,0,0,0.32)"); tb.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=tb; ctx.fill(fw);
  // iridescent shimmer
  const sg = ctx.createRadialGradient(18,-18,2, 30,-12,50);
  sg.addColorStop(0, sp.sh); sg.addColorStop(0.5, sp.sh.replace(/[\d.]+\)$/,"0.08)")); sg.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=sg; ctx.fill(fw);
  // veins
  ctx.globalAlpha = 0.1 * openAmt + 0.04;
  ctx.strokeStyle=sp.fw3; ctx.lineWidth=0.7;
  [[66,-60],[96,-24],[88,4],[66,14],[50,14]].forEach(([tx,ty])=>{
    ctx.beginPath(); ctx.moveTo(0,-2); ctx.lineTo(tx,ty); ctx.stroke();
  });
  ctx.lineWidth=0.4;
  ctx.beginPath(); ctx.moveTo(30,-40); ctx.lineTo(52,-4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(54,-28); ctx.lineTo(76,-6); ctx.stroke();
  ctx.restore();

  ctx.strokeStyle=sp.fw3; ctx.lineWidth=1; ctx.globalAlpha=0.42; ctx.stroke(fw); ctx.globalAlpha=1;
}

function renderButterfly(ctx, W, H, t, sp) {
  ctx.clearRect(0, 0, W, H);
  const cx = W/2, cy = H/2 + 14;

  // Smooth sinusoidal wing scale — cos gives 1→0→-1→0→1
  // Negative = wings past vertical (brief underside flash, very natural)
  const raw = Math.cos(t * Math.PI * 2 * sp.speed);
  const openAmt = Math.abs(raw);

  ctx.save();
  ctx.translate(cx, cy);

  // RIGHT wing
  ctx.save();
  ctx.scale(raw, 1);
  drawWing(ctx, sp, openAmt);
  ctx.restore();

  // LEFT wing — just flip x, same wing drawing
  ctx.save();
  ctx.scale(-raw, 1);
  drawWing(ctx, sp, openAmt);
  ctx.restore();

  ctx.restore();

  // ── BODY — drawn last, always on top ──
  ctx.save();
  ctx.translate(cx, cy);

  // Abdomen
  ctx.fillStyle = "#0e0e0e";
  ctx.beginPath(); ctx.ellipse(0, 26, 4, 22, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.055)";
  ctx.beginPath(); ctx.ellipse(-0.5, 26, 1.3, 20, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 0.6;
  for (let i=0; i<5; i++) {
    ctx.beginPath(); ctx.moveTo(-3.5, 10+i*8); ctx.lineTo(3.5, 10+i*8); ctx.stroke();
  }
  // Thorax
  ctx.fillStyle = sp.body;
  ctx.beginPath(); ctx.ellipse(0, 1, 5.5, 7, 0, 0, Math.PI*2); ctx.fill();
  // Head
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath(); ctx.arc(0, -11, 5.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "rgba(55,55,55,0.9)";
  ctx.beginPath(); ctx.arc(-3, -12.5, 1.8, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( 3, -12.5, 1.8, 0, Math.PI*2); ctx.fill();
  // Antennae
  ctx.strokeStyle = "#0e0e0e"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-2,-16); ctx.quadraticCurveTo(-14,-34,-12,-50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo( 2,-16); ctx.quadraticCurveTo( 14,-34, 12,-50); ctx.stroke();
  ctx.fillStyle = "#0e0e0e";
  ctx.beginPath(); ctx.ellipse(-12,-50,3.5,2.2,-0.28,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse( 12,-50,3.5,2.2, 0.28,0,Math.PI*2); ctx.fill();

  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════════
   REACT BUTTERFLY CANVAS COMPONENT
═══════════════════════════════════════════════════════════════════ */
const ButterflyCanvas = ({ spIndex=0, size=1, flapSpeed=1, style={} }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(Math.random());
  const sp = SPECIES[spIndex % SPECIES.length];
  // Extra 40px padding on each side so no wing ever clips
  const PAD = Math.round(40 * size);
  const W = Math.round(220 * size) + PAD * 2;
  const H = Math.round(210 * size) + PAD * 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let last = null;
    const loop = (ts) => {
      if (!last) last = ts;
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      tRef.current += dt * flapSpeed;
      renderButterfly(ctx, W, H, tRef.current, sp);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spIndex, size, flapSpeed]); // eslint-disable-line

  // negative margin pulls back the padding so layout position is centred
  const neg = -PAD;
  return <canvas ref={canvasRef} width={W} height={H} style={{ display:"block", margin:`${neg}px`, ...style }}/>;
};

/* ═══════════════════════════════════════════════════════════════════
   FLIGHT ENGINE
   KEY RULES:
   1. Roaming: butterflies stay in the OUTER 20% margin of the screen
      (left/right strips and top/bottom strips) — never over content.
   2. Settling: they fly to the 4 SCREEN corners, not photo corners,
      so they are always away from the photo and text.
   3. zIndex is BELOW content (zIndex:2) so they never cover anything.
═══════════════════════════════════════════════════════════════════ */

// Safe roam zones: outer margin band only (keeps butterflies off content)
function safeRoamPos(seed, idx) {
  // Pick a zone: 0=top-strip, 1=bottom-strip, 2=left-strip, 3=right-strip
  const zone = (seed * 7 + idx * 3) % 4;
  if (zone === 0) return { x: 5  + Math.random() * 88, y: 2  + Math.random() * 10 }; // top strip
  if (zone === 1) return { x: 5  + Math.random() * 88, y: 86 + Math.random() * 10 }; // bottom strip
  if (zone === 2) return { x: 2  + Math.random() * 12, y: 15 + Math.random() * 68 }; // left strip
                  return { x: 84 + Math.random() * 12, y: 15 + Math.random() * 68 }; // right strip
}

// Screen corners where butterflies rest (away from central content)
const SCREEN_CORNERS = [
  { x: 2,  y: 3  },   // top-left
  { x: 88, y: 3  },   // top-right
  { x: 2,  y: 87 },   // bottom-left
  { x: 88, y: 87 },   // bottom-right
];

const SingleBfly = ({ spIdx, cornerIdx, delayMs, seed }) => {
  const [phase, setPhase]   = useState("roam");
  const [pos,   setPos]     = useState(() => safeRoamPos(seed, 0));
  const [settle, setSettle] = useState(SCREEN_CORNERS[cornerIdx]);
  const [rot, setRot]       = useState((seed%44)-22);
  const roamIv  = useRef(null);
  const settleTm = useRef(null);
  let roamCount = useRef(0);

  const pickRoam = useCallback(() => {
    roamCount.current++;
    setPos(safeRoamPos(seed, roamCount.current));
    setRot((Math.random()-0.5)*38);
  }, [seed]);

  useEffect(() => {
    roamIv.current   = setInterval(pickRoam, 2800+Math.random()*1800);
    settleTm.current = setTimeout(() => {
      clearInterval(roamIv.current);
      setSettle(SCREEN_CORNERS[cornerIdx]);
      setRot(cornerIdx%2===0 ? 12 : -12);
      setPhase("glide");
      setTimeout(() => setPhase("rest"), 2400);
    }, delayMs);
    return () => { clearInterval(roamIv.current); clearTimeout(settleTm.current); };
  }, []); // eslint-disable-line

  const isGlide = phase==="glide", isRest = phase==="rest";
  const tx = (isGlide||isRest) ? settle.x : pos.x;
  const ty = (isGlide||isRest) ? settle.y : pos.y;
  const spd = 3.2+(seed%22)*0.12;

  return (
    <motion.div style={{ position:"fixed",left:0,top:0,pointerEvents:"none",zIndex:2 }}
      animate={{ x:`${tx}vw`, y:`${ty}vh`, rotate:rot, scale:isRest?0.55:0.9 }}
      transition={
        isGlide ? { duration:2.3, ease:[0.22,1,0.36,1] } :
        isRest  ? { x:{duration:0},y:{duration:0},scale:{duration:0.9,ease:"easeOut"},
                    rotate:{duration:3.8,repeat:Infinity,ease:"easeInOut"} } :
        { x:{duration:spd,ease:"easeInOut"},y:{duration:spd+0.5,ease:"easeInOut"},rotate:{duration:spd*0.7} }
      }
    >
      <motion.div animate={{ y:isRest?[0,-4,0]:[0,-10,2,-7,0] }}
        transition={{ duration:isRest?3:spd, repeat:Infinity, ease:"easeInOut" }}>
        <ButterflyCanvas spIndex={spIdx} size={0.55} flapSpeed={isRest?0.5:1}/>
      </motion.div>
    </motion.div>
  );
};

const AmbientBfly = ({ spIdx, seed, delay=0 }) => {
  const [pos,setPos] = useState(() => safeRoamPos(seed, 0));
  const [rot,setRot] = useState((seed%38)-19);
  let cnt = useRef(0);
  useEffect(() => {
    const iv = setInterval(() => {
      cnt.current++;
      setPos(safeRoamPos(seed, cnt.current));
      setRot((Math.random()-0.5)*36);
    }, 3200+Math.random()*2200);
    return () => clearInterval(iv);
  }, [seed]);
  const dur = 3.6+(seed%20)*0.14;
  return (
    <motion.div style={{ position:"fixed",left:0,top:0,pointerEvents:"none",zIndex:2 }}
      initial={{ x:`${pos.x}vw`,y:`${pos.y}vh`,opacity:0 }}
      animate={{ x:`${pos.x}vw`,y:`${pos.y}vh`,rotate:rot,opacity:1 }}
      transition={{ x:{duration:dur,ease:"easeInOut"},y:{duration:dur+0.5,ease:"easeInOut"},
        rotate:{duration:dur*0.75},opacity:{duration:1.4,delay} }}>
      <motion.div animate={{ y:[0,-9,2,-6,0] }} transition={{ duration:dur,repeat:Infinity,ease:"easeInOut" }}>
        <ButterflyCanvas spIndex={spIdx} size={0.52} flapSpeed={0.9}/>
      </motion.div>
    </motion.div>
  );
};

const PageButterflies = ({ page }) => {
  const b = (page-1) % SPECIES.length;
  const mobile = isMobile();
  return <>
    <SingleBfly key={`a${page}`} spIdx={b}                    cornerIdx={0} delayMs={3500} seed={page*7}/>
    <SingleBfly key={`b${page}`} spIdx={(b+3)%SPECIES.length} cornerIdx={1} delayMs={4600} seed={page*13}/>
    {!mobile && <SingleBfly key={`c${page}`} spIdx={(b+6)%SPECIES.length} cornerIdx={2} delayMs={5900} seed={page*19}/>}
  </>;
};

/* ═══════════════════════════════════════════════════════════════════
   ORIGINAL UI COMPONENTS
═══════════════════════════════════════════════════════════════════ */
const FloatingPetals = ({ count=14 }) => {
  const items = useRef(Array.from({length:count},(_,i)=>({
    id:i,x:Math.random()*110-5,sz:Math.random()*12+6,dur:Math.random()*10+8,
    delay:Math.random()*6,rotate:Math.random()*360,drift:(Math.random()-0.5)*90,
    color:i%2===0?`rgba(196,150,220,${(.18+Math.random()*.22).toFixed(2)})`:
                  `rgba(255,170,120,${(.15+Math.random()*.2).toFixed(2)})`,
  }))).current;
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {items.map(p=>(
        <motion.div key={p.id}
          style={{position:"absolute",left:`${p.x}%`,top:"-5%",width:p.sz,height:p.sz*.75,
            background:p.color,rotate:p.rotate,borderRadius:2}}
          animate={{y:["0vh","115vh"],rotate:[p.rotate,p.rotate+720],x:[0,p.drift],opacity:[0,.5,.2,0]}}
          transition={{duration:p.dur,delay:p.delay,repeat:Infinity,ease:"linear"}}/>
      ))}
    </div>
  );
};

const Sparkles = ({ count=28 }) => {
  const dots = useRef(Array.from({length:count},(_,i)=>({
    id:i,x:Math.random()*100,y:Math.random()*100,sz:Math.random()*4+2,
    dur:Math.random()*3+2,delay:Math.random()*3,
    color:["rgba(196,150,220,.5)","rgba(255,170,120,.45)","rgba(230,160,200,.4)"][i%3],
  }))).current;
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {dots.map(d=>(
        <motion.div key={d.id}
          style={{position:"absolute",left:`${d.x}%`,top:`${d.y}%`,
            width:d.sz,height:d.sz,background:d.color,borderRadius:"50%"}}
          animate={{opacity:[.07,.65,.07]}}
          transition={{duration:d.dur,delay:d.delay,repeat:Infinity}}/>
      ))}
    </div>
  );
};

const Polaroid = ({ src, page, frameRef }) => {
  const [imgError,setImgError]=useState(false); const mobile=isMobile();
  const grads=["linear-gradient(135deg,#e8d5f5,#ffe0d0)","linear-gradient(135deg,#f5d5e8,#ffd5c8)",
    "linear-gradient(135deg,#ddd5f5,#fde5d5)","linear-gradient(135deg,#f0d5f5,#ffd8c5)",
    "linear-gradient(135deg,#e5d5ff,#ffe5d5)","linear-gradient(135deg,#f5d0ea,#ffddd0)",
    "linear-gradient(135deg,#dcd5f5,#ffe0d8)","linear-gradient(135deg,#f0d5fa,#ffd5c0)",
    "linear-gradient(135deg,#e8d5f8,#ffe8d8)","linear-gradient(135deg,#ebd5ff,#ffdfd5)"];
  const syms=["✦","✧","❋","✿","❀","✾","❁","✸","✺","✻"];
  return (
    <motion.div ref={frameRef} animate={{y:[0,-7,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}
      style={{width:mobile?"min(85vw,420px)":"clamp(320px,52vh,540px)",margin:"0 auto",
        transform:`rotate(${(page%2===0?1:-1)*(page%3+1)}deg)`}}>
      <div style={{background:"#fff",borderRadius:3,
        padding:mobile?"clamp(8px,1.5vh,16px) clamp(8px,1.5vh,16px) clamp(28px,5vh,52px)":
                       "clamp(6px,1vh,12px) clamp(6px,1vh,12px) clamp(22px,3.5vh,40px)",
        boxShadow:"0 10px 32px rgba(180,130,200,.2),0 2px 6px rgba(0,0,0,.05)"}}>
        <div style={{width:"100%",aspectRatio:"1",background:grads[(page-1)%grads.length],
          borderRadius:2,overflow:"hidden",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {!imgError&&<img src={src} alt={`Memory ${page}`}
            style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1}}
            onError={()=>setImgError(true)}/>}
          <span style={{fontSize:mobile?"clamp(40px,10vw,72px)":"clamp(28px,6vh,52px)",
            color:"rgba(150,80,180,.18)",position:"relative",zIndex:0}}>{syms[(page-1)%syms.length]}</span>
        </div>
        <p style={{textAlign:"center",color:"#c4a0d0",fontSize:mobile?"clamp(11px,1.4vh,14px)":"clamp(9px,1vh,12px)",
          fontStyle:"italic",marginTop:mobile?8:5,letterSpacing:".07em",fontFamily:"Georgia,serif"}}>
          ~ memory {page} ~
        </p>
      </div>
    </motion.div>
  );
};

const Confetti = () => {
  const pieces=useRef(Array.from({length:60},(_,i)=>({id:i,x:Math.random()*100,
    color:["#c496dc","#ffb482","#f472b6","#fcd34d","#a5b4fc","#fda4af","#d8b4fe","#86efac"][i%8],
    sz:Math.random()*7+4,dur:Math.random()*2.5+1.5,delay:Math.random()*1.2,drift:(Math.random()-.5)*200}))).current;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:20}}>
      {pieces.map(p=>(
        <motion.div key={p.id} style={{position:"absolute",top:0,left:`${p.x}%`,
          width:p.sz,height:p.sz*1.4,background:p.color,borderRadius:2}}
          animate={{y:["0vh","110vh"],x:[0,p.drift],rotate:[0,360],opacity:[.9,.7,0]}}
          transition={{duration:p.dur,delay:p.delay,ease:"linear"}}/>
      ))}
    </div>
  );
};

const MusicBtn = ({ started }) => {
  const [on,setOn]=useState(false); const audio=useRef(null);
  useEffect(()=>{
    audio.current=new Audio('/React-Projects/music/music.mp3');
    audio.current.loop=true; audio.current.volume=0.5;
    return()=>audio.current?.pause();
  },[]);
  useEffect(()=>{ if(started&&audio.current) audio.current.play().then(()=>setOn(true)).catch(()=>setOn(false)); },[started]);
  const toggle=()=>{ on?audio.current?.pause():audio.current?.play().catch(()=>{}); setOn(v=>!v); };
  if(!started) return null;
  return (
    <motion.button initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.5}} onClick={toggle}
      style={{position:"fixed",top:12,right:12,zIndex:999,width:40,height:40,borderRadius:"50%",
        background:"rgba(196,150,220,.3)",border:"1px solid rgba(196,150,220,.5)",backdropFilter:"blur(10px)",
        color:C.lav600,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:on?"0 0 18px rgba(196,150,220,.5)":"none",transition:"all .3s"}}
      whileHover={{scale:1.1}} whileTap={{scale:.95}}>{on?"♫":"♪"}</motion.button>
  );
};

const CursorGlow = () => {
  const [p,setP]=useState({x:-300,y:-300});
  useEffect(()=>{ const m=e=>setP({x:e.clientX,y:e.clientY}); window.addEventListener("mousemove",m); return()=>window.removeEventListener("mousemove",m); },[]);
  return <div style={{position:"fixed",pointerEvents:"none",zIndex:40,left:p.x-160,top:p.y-160,width:320,height:320,borderRadius:"50%",
    background:"radial-gradient(circle,rgba(196,150,220,.06),transparent 70%)",transition:"left .1s ease-out,top .1s ease-out"}}/>;
};

const SS={position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
  padding:"clamp(12px,2vh,24px) clamp(14px,4vw,44px)",overflow:"hidden"};

const LoadingScreen=({onDone})=>{
  const [prog,setProg]=useState(0); const [txt,setTxt]=useState("Preparing something special...");
  useEffect(()=>{
    const txts=["Preparing something special...","Gathering memories...","Almost ready ✨"]; let i=0;
    const ti=setInterval(()=>{i=(i+1)%txts.length;setTxt(txts[i]);},900);
    const pi=setInterval(()=>{setProg(p=>{if(p>=100){clearInterval(pi);clearInterval(ti);setTimeout(onDone,400);return 100;}return p+1.8;});},55);
    return()=>{clearInterval(ti);clearInterval(pi);};
  },[onDone]);
  return(<div style={{...SS,background:bgMain}}><FloatingPetals count={12}/>
    <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
      <motion.div animate={{scale:[1,1.1,1]}} transition={{duration:3,repeat:Infinity}} style={{fontSize:"clamp(36px,6vh,60px)",marginBottom:"clamp(12px,2vh,24px)"}}>🌸</motion.div>
      <motion.p key={txt} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{color:C.textSec,fontSize:"clamp(10px,1.4vh,15px)",letterSpacing:".2em",textTransform:"uppercase",marginBottom:"clamp(14px,2.5vh,28px)"}}>{txt}</motion.p>
      <div style={{width:"clamp(120px,20vw,180px)",height:2,background:"rgba(196,150,220,.2)",borderRadius:100,overflow:"hidden",margin:"0 auto"}}>
        <motion.div style={{width:`${prog}%`,height:"100%",background:"linear-gradient(90deg,#c496dc,#ffb482)",borderRadius:100}}/>
      </div>
    </div>
  </div>);
};

const WelcomeScreen=({onEnter})=>(
  <div style={{...SS,background:bgMain}}><FloatingPetals count={16}/>
    <AmbientBfly spIdx={0} seed={3} delay={0.5}/><AmbientBfly spIdx={4} seed={11} delay={1.2}/>
    <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.2}}
      style={{position:"relative",zIndex:1,textAlign:"center",background:"rgba(255,255,255,.6)",
        border:"1px solid rgba(210,170,210,.35)",backdropFilter:"blur(20px)",borderRadius:20,
        padding:"clamp(18px,3vh,36px) clamp(20px,4vw,44px)",width:"100%",maxWidth:420,boxShadow:"0 6px 32px rgba(180,130,200,.13)"}}>
      <motion.div animate={{scale:[1,1.12,1]}} transition={{duration:3,repeat:Infinity}} style={{fontSize:"clamp(28px,5vh,48px)",marginBottom:"clamp(8px,1.5vh,16px)"}}>🌸</motion.div>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(22px,4.5vh,46px)",fontWeight:300,color:C.lav800,marginBottom:"clamp(8px,1.5vh,16px)",letterSpacing:".04em"}}>
        {CONFIG.herName?`Hey, ${CONFIG.herName}`:"Hey You 🌸"}
      </h1>
      <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(12px,1.8vh,17px)",color:C.textSec,lineHeight:1.8,marginBottom:"clamp(14px,2.5vh,28px)"}}>
        I made a small little thing<br/>for someone who deserves<br/>more smiles in life.
      </p>
      <motion.button whileHover={{scale:1.04,boxShadow:"0 0 22px rgba(196,150,220,.4)"}} whileTap={{scale:.97}} onClick={onEnter}
        style={{width:"100%",padding:"clamp(9px,1.5vh,14px) 0",minHeight:42,borderRadius:12,
          background:"linear-gradient(135deg,rgba(196,150,220,.42),rgba(255,180,130,.42))",
          border:"1px solid rgba(196,150,220,.5)",color:C.lav800,cursor:"pointer",
          fontSize:"clamp(10px,1.4vh,14px)",letterSpacing:".18em",textTransform:"uppercase",fontFamily:"Georgia,serif"}}>Enter ✦</motion.button>
      <p style={{color:C.textMut,fontSize:"clamp(9px,1.2vh,12px)",marginTop:"clamp(8px,1.5vh,14px)",letterSpacing:".12em"}}>made with love, from {CONFIG.yourName}</p>
    </motion.div>
  </div>
);

const EmotionalIntro=({onNext})=>{
  const lines=[{t:"Before we begin,",muted:true},{t:"I want you to know something.",muted:true},{t:""},
    {t:"You matter more than you believe."},{t:"You've been through more than you've ever admitted."},
    {t:"And you're still here — still kind, still soft."},{t:""},{t:"This is for you. 🌸",large:true}];
  return(<div style={{...SS,background:bgMain}}><FloatingPetals count={12}/>
    <AmbientBfly spIdx={2} seed={7} delay={0.4}/><AmbientBfly spIdx={7} seed={17} delay={1.1}/>
    <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:"min(520px,90vw)"}}>
      {lines.map((l,i)=>(
        <motion.p key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.4+0.3,duration:.7}}
          style={{fontFamily:"Georgia,serif",color:l.muted?C.textSec:C.lav800,
            fontSize:l.large?"clamp(14px,2.8vh,22px)":"clamp(12px,1.8vh,17px)",
            fontStyle:l.muted?"italic":"normal",lineHeight:1.7,
            marginBottom:l.t?"clamp(6px,1.2vh,12px)":"clamp(2px,0.5vh,6px)"}}>{l.t}</motion.p>
      ))}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:lines.length*0.4+0.8}}
        style={{display:"flex",justifyContent:"center",marginTop:"clamp(12px,2vh,24px)"}}>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:.97}} onClick={onNext}
          style={{padding:"clamp(9px,1.5vh,14px) clamp(20px,4vw,36px)",minHeight:42,borderRadius:12,
            background:"linear-gradient(135deg,rgba(196,150,220,.42),rgba(255,180,130,.42))",
            border:"1px solid rgba(196,150,220,.5)",color:C.lav800,cursor:"pointer",
            fontSize:"clamp(10px,1.4vh,14px)",letterSpacing:".18em",textTransform:"uppercase",fontFamily:"Georgia,serif"}}>Continue →</motion.button>
      </motion.div>
    </div>
  </div>);
};

const TimelinePage=({data,page,total,onNext,onPrev})=>{
  const mobile=isMobile(); const photoRef=useRef(null);
  const bgGrads=["linear-gradient(160deg,#f9f0ff,#fff5f0,#ffeee6)","linear-gradient(160deg,#fff2f8,#fff8f2,#ffeade)",
    "linear-gradient(160deg,#f5eeff,#fff4ee,#ffeae0)","linear-gradient(160deg,#fdf0ff,#fff8f0,#ffe8dc)",
    "linear-gradient(160deg,#f8f0ff,#fff5ee,#ffece2)","linear-gradient(160deg,#faeeff,#fff2ec,#ffeadf)",
    "linear-gradient(160deg,#f6eeff,#fff6f0,#ffece3)","linear-gradient(160deg,#f9efff,#fff4ef,#ffebe1)",
    "linear-gradient(160deg,#fbf0ff,#fff6f1,#ffeee5)","linear-gradient(160deg,#f8eeff,#fff5f0,#ffeae0)"];
  return(<div style={{...SS,background:bgGrads[(page-1)%bgGrads.length]}}><FloatingPetals count={12}/>
    <PageButterflies key={`bf-${page}`} page={page}/>
    <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:8,position:"relative",zIndex:1}}>
      {Array.from({length:total},(_,i)=>(
        <div key={i} style={{height:4,borderRadius:100,transition:"all .3s",width:i+1===page?16:4,
          background:i+1===page?"linear-gradient(90deg,#c496dc,#ffb482)":"rgba(196,150,220,.25)"}}/>
      ))}
    </div>
    <motion.div key={page} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{duration:.45,ease:"easeOut"}}
      style={{position:"relative",zIndex:1,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",
        gap:mobile?"clamp(12px,2vh,20px)":"clamp(10px,2vh,28px)",width:"100%",maxWidth:mobile?"100%":860,alignItems:"center"}}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Polaroid src={data.image} page={page} frameRef={photoRef}/>
      </div>
      <div style={{textAlign:mobile?"center":"left",paddingLeft:mobile?0:"clamp(12px,2vw,32px)"}}>
        {data.quote.split("\n").map((line,i)=>(
          <motion.p key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.25+i*.1}}
            style={{fontFamily:"Georgia,serif",fontSize:mobile?"clamp(16px,4vw,22px)":"clamp(14px,2.8vh,22px)",
              fontWeight:300,color:C.lav800,lineHeight:1.5,marginBottom:"clamp(2px,0.5vh,6px)"}}>{line}</motion.p>
        ))}
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.55}}
          style={{fontFamily:"Georgia,serif",fontSize:mobile?"clamp(12px,3vw,15px)":"clamp(10px,1.4vh,14px)",
            fontStyle:"italic",color:"rgba(180,100,140,.72)",marginTop:"clamp(4px,0.8vh,10px)",marginBottom:"clamp(8px,1.8vh,20px)"}}>{data.subtext}</motion.p>
        <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:mobile?"center":"flex-start",flexWrap:"wrap"}}>
          {page>1&&(<motion.button whileHover={{scale:1.04}} whileTap={{scale:.96}} onClick={onPrev}
            style={{padding:"clamp(9px,1.5vh,14px) clamp(16px,3vw,28px)",minHeight:42,borderRadius:12,
              background:"rgba(255,255,255,.45)",border:"1px solid rgba(196,150,220,.3)",color:"rgba(90,50,110,.7)",
              cursor:"pointer",fontSize:"clamp(10px,1.4vh,14px)",letterSpacing:".16em",textTransform:"uppercase",fontFamily:"Georgia,serif"}}>← Back</motion.button>)}
          <motion.button whileHover={{scale:1.04,boxShadow:"0 0 20px rgba(196,150,220,.35)"}} whileTap={{scale:.96}} onClick={onNext}
            style={{padding:"clamp(9px,1.5vh,14px) clamp(16px,3vw,28px)",minHeight:42,minWidth:120,borderRadius:12,
              background:"linear-gradient(135deg,rgba(196,150,220,.42),rgba(255,180,130,.42))",
              border:"1px solid rgba(196,150,220,.5)",color:C.lav800,cursor:"pointer",
              fontSize:"clamp(10px,1.4vh,14px)",letterSpacing:".16em",textTransform:"uppercase",fontFamily:"Georgia,serif"}}>
            {page===total?"Continue ✦":"Next →"}
          </motion.button>
        </div>
        <p style={{color:C.textMut,fontSize:10,letterSpacing:".18em",marginTop:"clamp(4px,0.8vh,10px)",textAlign:mobile?"center":"left"}}>{page} / {total}</p>
      </div>
    </motion.div>
  </div>);
};

const AppreciationPage=({onNext})=>(
  <div style={{...SS,background:"linear-gradient(160deg,#fdf2ff,#fff5ef,#ffeae0)"}}><FloatingPetals count={18}/><Sparkles count={28}/>
    <AmbientBfly spIdx={5} seed={23} delay={0.3}/><AmbientBfly spIdx={3} seed={31} delay={1.0}/>
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}}
      style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:"min(520px,90vw)"}}>
      <motion.div animate={{scale:[1,1.15,1]}} transition={{duration:2.5,repeat:Infinity}} style={{fontSize:"clamp(34px,6vh,56px)",marginBottom:"clamp(10px,2vh,22px)",color:"#e08080"}}>♡</motion.div>
      <motion.h2 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.4}}
        style={{fontFamily:"Georgia,serif",fontSize:"clamp(22px,4vh,42px)",fontWeight:300,color:C.lav800,lineHeight:1.2,marginBottom:"clamp(8px,1.5vh,16px)"}}>
        Thank you<br/>for existing.
      </motion.h2>
      <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.9}}
        style={{fontFamily:"Georgia,serif",fontSize:"clamp(12px,1.8vh,17px)",color:C.textSec,lineHeight:1.75,marginBottom:"clamp(4px,1vh,10px)"}}>
        You made people smile<br/>even while carrying your own battles.
      </motion.p>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3}}
        style={{fontFamily:"Georgia,serif",fontSize:"clamp(10px,1.4vh,14px)",fontStyle:"italic",color:"rgba(200,120,140,.7)",marginBottom:"clamp(14px,2.5vh,28px)"}}>
        That kind of heart is rare.
      </motion.p>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}} style={{display:"flex",justifyContent:"center"}}>
        <motion.button whileHover={{scale:1.05,boxShadow:"0 0 22px rgba(255,170,120,.4)"}} whileTap={{scale:.97}} onClick={onNext}
          style={{padding:"clamp(9px,1.5vh,14px) clamp(20px,4vw,36px)",minHeight:42,borderRadius:12,
            background:"linear-gradient(135deg,rgba(255,180,130,.42),rgba(255,150,150,.35))",
            border:"1px solid rgba(255,170,120,.5)",color:C.lav800,cursor:"pointer",
            fontSize:"clamp(10px,1.4vh,14px)",letterSpacing:".18em",textTransform:"uppercase",fontFamily:"Georgia,serif"}}>One last thing →</motion.button>
      </motion.div>
    </motion.div>
  </div>
);

const FinalPage=({onReplay})=>{
  const [confetti,setConfetti]=useState(false); const mobile=isMobile();
  useEffect(()=>{setConfetti(true);const t=setTimeout(()=>setConfetti(false),5000);return()=>clearTimeout(t);},[]);
  const btn={width:"100%",maxWidth:240,padding:"clamp(9px,1.5vh,14px) 0",minHeight:42,borderRadius:12,
    background:"linear-gradient(135deg,rgba(196,150,220,.42),rgba(255,180,130,.42))",
    border:"1px solid rgba(196,150,220,.5)",color:C.lav800,cursor:"pointer",
    fontSize:"clamp(10px,1.4vh,14px)",letterSpacing:".16em",textTransform:"uppercase",fontFamily:"Georgia,serif"};
  const btnG={...btn,background:"rgba(255,255,255,.45)",border:"1px solid rgba(196,150,220,.3)",color:"rgba(90,50,110,.7)"};
  return(<div style={{...SS,background:"linear-gradient(160deg,#f8eeff,#fff5ee,#ffe8de)",overflow:"hidden"}}>
    <FloatingPetals count={20}/><Sparkles count={30}/>
    {confetti&&<Confetti/>}
    <AmbientBfly spIdx={0} seed={5} delay={0}/><AmbientBfly spIdx={4} seed={13} delay={0.8}/><AmbientBfly spIdx={8} seed={21} delay={1.5}/>
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}}
      style={{position:"relative",zIndex:1,width:"100%",maxWidth:820,display:"grid",
        gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:"clamp(10px,2vh,24px)",alignItems:"center"}}>
      <div style={{textAlign:"center"}}>
        <motion.div initial={{scale:0}} animate={{scale:[0,1.3,1]}} transition={{duration:.8,delay:.2}} style={{fontSize:"clamp(32px,5.5vh,60px)",marginBottom:"clamp(6px,1.2vh,14px)"}}>🎂</motion.div>
        <motion.h1 initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{delay:.5}}
          style={{fontFamily:"Georgia,serif",fontSize:"clamp(22px,4.5vh,46px)",fontWeight:300,
            background:"linear-gradient(135deg,#9060c0,#e07070)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            backgroundClip:"text",marginBottom:"clamp(6px,1.2vh,12px)"}}>Happy Birthday</motion.h1>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}} style={{fontSize:"clamp(22px,3.5vh,34px)",marginBottom:"clamp(8px,1.5vh,16px)"}}>💖</motion.div>
        <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:1}}
          style={{fontFamily:"Georgia,serif",fontSize:"clamp(12px,1.7vh,17px)",color:C.textSec,lineHeight:1.85}}>
          I hope this year brings you<br/>
          <span style={{color:"#9060c0",fontStyle:"italic"}}>peace</span> and{" "}
          <span style={{color:"#e08870",fontStyle:"italic"}}>confidence</span>,<br/>
          <span style={{color:"#b07ccc",fontStyle:"italic"}}>healing</span> and beautiful memories,<br/>
          and many reasons to smile again.
        </motion.p>
      </div>
      <div style={{textAlign:"center"}}>
        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:1.4}}
          style={{background:"rgba(196,150,220,.1)",border:"1px solid rgba(196,150,220,.22)",borderRadius:14,
            padding:"clamp(10px,1.8vh,20px) clamp(14px,3vw,28px)",marginBottom:"clamp(10px,2vh,18px)"}}>
          <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(14px,2.4vh,20px)",color:C.lav800,lineHeight:1.35}}>You deserve happiness.</p>
          <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(10px,1.3vh,14px)",fontStyle:"italic",color:"rgba(180,120,160,.65)",marginTop:6}}>Never forget that.</p>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}} style={{display:"flex",flexDirection:"column",gap:8,alignItems:"center"}}>
          <button onClick={()=>setConfetti(true)} style={btnG}>🎉 More confetti!</button>
          <button onClick={onReplay} style={btn}>↺ Replay Journey</button>
        </motion.div>
        <p style={{color:C.textMut,fontSize:"clamp(9px,1.2vh,12px)",letterSpacing:".14em",marginTop:"clamp(8px,1.5vh,16px)"}}>made with love · {CONFIG.year}</p>
      </div>
    </motion.div>
  </div>);
};

const SC={LOAD:"l",WELCOME:"w",INTRO:"i",TIMELINE:"t",APPREC:"a",FINAL:"f"};

export default function App() {
  const [sc,setSc]=useState(SC.LOAD);
  const [pg,setPg]=useState(1);
  const [music,setMu]=useState(false);
  const go=useCallback(s=>setSc(s),[]);
  return(
    <div style={{position:"fixed",inset:0,overflow:"hidden"}}>
      <CursorGlow/><MusicBtn started={music}/>
      <AnimatePresence mode="wait">
        {sc===SC.LOAD&&<motion.div key="l" exit={{opacity:0}} transition={{duration:.5}} style={{position:"fixed",inset:0}}><LoadingScreen onDone={()=>go(SC.WELCOME)}/></motion.div>}
        {sc===SC.WELCOME&&<motion.div key="w" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.8}} style={{position:"fixed",inset:0}}><WelcomeScreen onEnter={()=>{setMu(true);go(SC.INTRO);}}/></motion.div>}
        {sc===SC.INTRO&&<motion.div key="i" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.8}} style={{position:"fixed",inset:0}}><EmotionalIntro onNext={()=>go(SC.TIMELINE)}/></motion.div>}
        {sc===SC.TIMELINE&&<motion.div key={`t${pg}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}} style={{position:"fixed",inset:0}}>
          <TimelinePage data={TIMELINE_DATA[pg-1]} page={pg} total={TIMELINE_DATA.length}
            onNext={()=>pg<TIMELINE_DATA.length?setPg(p=>p+1):go(SC.APPREC)}
            onPrev={()=>pg>1?setPg(p=>p-1):go(SC.INTRO)}/></motion.div>}
        {sc===SC.APPREC&&<motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.8}} style={{position:"fixed",inset:0}}><AppreciationPage onNext={()=>go(SC.FINAL)}/></motion.div>}
        {sc===SC.FINAL&&<motion.div key="f" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.8}} style={{position:"fixed",inset:0}}><FinalPage onReplay={()=>{setPg(1);setMu(false);go(SC.WELCOME);}}/></motion.div>}
      </AnimatePresence>
    </div>
  );
}
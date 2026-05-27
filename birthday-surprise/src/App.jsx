import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE_DATA, CONFIG } from "./data/timelineData.js";

const C = {
  lav800:"#4a2560", lav600:"#9060c0", lav400:"#c496dc",
  peach:"#ffb482", textSec:"rgba(90,50,110,.65)", textMut:"rgba(150,100,170,.4)",
};
const bgMain = "linear-gradient(160deg,#f9f0ff 0%,#fff5ee 55%,#ffeee6 100%)";
const isMobile = () => window.innerWidth < 700;

const FloatingPetals = ({ count = 14 }) => {
  const items = useRef(Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 110 - 5,
    sz: Math.random() * 12 + 6,
    dur: Math.random() * 10 + 8,
    delay: Math.random() * 6,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 90,
    color: i % 2 === 0
      ? `rgba(196,150,220,${(.18+Math.random()*.22).toFixed(2)})`
      : `rgba(255,170,120,${(.15+Math.random()*.2).toFixed(2)})`,
  }))).current;

  return (
    <div className="petals">
      {items.map(p => (
        <motion.div key={p.id} className="petal"
          style={{ left:`${p.x}%`, top:"-5%", width:p.sz, height:p.sz*.75,
            background:p.color, rotate:p.rotate }}
          animate={{ y:["0vh","115vh"], rotate:[p.rotate,p.rotate+720],
            x:[0,p.drift], opacity:[0,.5,.2,0] }}
          transition={{ duration:p.dur, delay:p.delay, repeat:Infinity, ease:"linear" }}
        />
      ))}
    </div>
  );
};

const Sparkles = ({ count = 28 }) => {
  const dots = useRef(Array.from({ length: count }, (_, i) => ({
    id:i, x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*4+2, dur:Math.random()*3+2, delay:Math.random()*3,
    color:["rgba(196,150,220,.5)","rgba(255,170,120,.45)","rgba(230,160,200,.4)"][i%3],
  }))).current;
  return (
    <div className="petals">
      {dots.map(d => (
        <motion.div key={d.id}
          style={{ position:"absolute", left:`${d.x}%`, top:`${d.y}%`,
            width:d.sz, height:d.sz, background:d.color, borderRadius:"50%" }}
          animate={{ opacity:[.07,.65,.07] }}
          transition={{ duration:d.dur, delay:d.delay, repeat:Infinity }}
        />
      ))}
    </div>
  );
};

const Polaroid = ({ src, page }) => {
  const [imgError, setImgError] = useState(false);
  const mobile = isMobile();

  const grads = [
    "linear-gradient(135deg,#e8d5f5,#ffe0d0)",
    "linear-gradient(135deg,#f5d5e8,#ffd5c8)",
    "linear-gradient(135deg,#ddd5f5,#fde5d5)",
    "linear-gradient(135deg,#f0d5f5,#ffd8c5)",
    "linear-gradient(135deg,#e5d5ff,#ffe5d5)",
    "linear-gradient(135deg,#f5d0ea,#ffddd0)",
    "linear-gradient(135deg,#dcd5f5,#ffe0d8)",
    "linear-gradient(135deg,#f0d5fa,#ffd5c0)",
    "linear-gradient(135deg,#e8d5f8,#ffe8d8)",
    "linear-gradient(135deg,#ebd5ff,#ffdfd5)",
  ];
  const syms = ["✦","✧","❋","✿","❀","✾","❁","✸","✺","✻"];

  return (
    <motion.div
      animate={{ y:[0,-7,0] }}
      transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
      style={{
        /* Mobile: fills ~85% of screen width, max 420px
           Laptop: 40% bigger than original */
        width: mobile ? "min(85vw, 420px)" : "clamp(154px,31vh,308px)",
        margin:"0 auto",
        transform:`rotate(${(page%2===0?1:-1)*(page%3+1)}deg)`
      }}>
      <div style={{
        background:"#fff",
        borderRadius:3,
        padding: mobile
          ? "clamp(8px,1.5vh,16px) clamp(8px,1.5vh,16px) clamp(28px,5vh,52px)"
          : "clamp(6px,1vh,12px) clamp(6px,1vh,12px) clamp(22px,3.5vh,40px)",
        boxShadow:"0 10px 32px rgba(180,130,200,.2), 0 2px 6px rgba(0,0,0,.05)"
      }}>
        {/* Photo area */}
        <div style={{
          width:"100%",
          aspectRatio:"1",
          background:grads[(page-1)%grads.length],
          borderRadius:2,
          overflow:"hidden",
          position:"relative",
          display:"flex",
          alignItems:"center",
          justifyContent:"center"
        }}>
          {!imgError && (
            <img
              src={src}
              alt={`Memory ${page}`}
              style={{
                position:"absolute",
                top:0, left:0,
                width:"100%",
                height:"100%",
                objectFit:"cover",
                zIndex:1
              }}
              onError={() => {
                console.log("Image not found:", src);
                setImgError(true);
              }}
            />
          )}
          <span style={{
            fontSize: mobile ? "clamp(40px,10vw,72px)" : "clamp(28px,6vh,52px)",
            color:"rgba(150,80,180,.18)",
            position:"relative",
            zIndex:0
          }}>
            {syms[(page-1)%syms.length]}
          </span>
        </div>

        {/* Polaroid label */}
        <p style={{
          textAlign:"center",
          color:"#c4a0d0",
          fontSize: mobile ? "clamp(11px,1.4vh,14px)" : "clamp(9px,1vh,12px)",
          fontStyle:"italic",
          marginTop: mobile ? 8 : 5,
          letterSpacing:".07em",
          fontFamily:"Georgia,serif"
        }}>
          ~ memory {page} ~
        </p>
      </div>
    </motion.div>
  );
};

const Confetti = () => {
  const pieces = useRef(Array.from({ length:60 }, (_,i) => ({
    id:i, x:Math.random()*100,
    color:["#c496dc","#ffb482","#f472b6","#fcd34d","#a5b4fc","#fda4af","#d8b4fe","#86efac"][i%8],
    sz:Math.random()*7+4, dur:Math.random()*2.5+1.5, delay:Math.random()*1.2,
    drift:(Math.random()-.5)*200,
  }))).current;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:20 }}>
      {pieces.map(p => (
        <motion.div key={p.id}
          style={{ position:"absolute", top:0, left:`${p.x}%`,
            width:p.sz, height:p.sz*1.4, background:p.color, borderRadius:2 }}
          animate={{ y:["0vh","110vh"], x:[0,p.drift], rotate:[0,360], opacity:[.9,.7,0] }}
          transition={{ duration:p.dur, delay:p.delay, ease:"linear" }}
        />
      ))}
    </div>
  );
};

const MusicBtn = ({ started }) => {
  const [on, setOn] = useState(false);
  const audio = useRef(null);
  useEffect(() => {
    audio.current = new Audio('/React-Projects/music/music.mp3');
    audio.current.loop = true;
    audio.current.volume = 0.5;
    return () => audio.current?.pause();
  }, []);
  const toggle = () => {
    on ? audio.current?.pause() : audio.current?.play().catch(()=>{});
    setOn(v => !v);
  };
  if (!started) return null;
  return (
    <motion.button
      initial={{ opacity:0, scale:0 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ delay:.5 }}
      onClick={toggle}
      style={{
        position:"fixed", top:12, right:12, zIndex:999,
        width:40, height:40, borderRadius:"50%",
        background:"rgba(196,150,220,.3)",
        border:"1px solid rgba(196,150,220,.5)",
        backdropFilter:"blur(10px)",
        color:C.lav600, fontSize:16, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow: on ? "0 0 18px rgba(196,150,220,.5)" : "none",
        transition:"all .3s"
      }}
      whileHover={{ scale:1.1 }}
      whileTap={{ scale:.95 }}
    >
      {on ? "♫" : "♪"}
    </motion.button>
  );
};

const CursorGlow = () => {
  const [p, setP] = useState({ x:-300, y:-300 });
  useEffect(() => {
    const m = e => setP({ x:e.clientX, y:e.clientY });
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);
  return (
    <div style={{
      position:"fixed", pointerEvents:"none", zIndex:40,
      left:p.x-160, top:p.y-160, width:320, height:320,
      borderRadius:"50%",
      background:"radial-gradient(circle,rgba(196,150,220,.06),transparent 70%)",
      transition:"left .1s ease-out,top .1s ease-out"
    }} />
  );
};

const SS = {
  position:"fixed", inset:0, display:"flex", flexDirection:"column",
  alignItems:"center", justifyContent:"center",
  padding:"clamp(12px,2vh,24px) clamp(14px,4vw,44px)", overflow:"hidden",
};

const LoadingScreen = ({ onDone }) => {
  const [prog, setProg] = useState(0);
  const [txt, setTxt] = useState("Preparing something special...");
  useEffect(() => {
    const txts = ["Preparing something special...","Gathering memories...","Almost ready ✨"];
    let i=0;
    const ti = setInterval(() => { i=(i+1)%txts.length; setTxt(txts[i]); }, 900);
    const pi = setInterval(() => {
      setProg(p => {
        if(p>=100){ clearInterval(pi); clearInterval(ti); setTimeout(onDone,400); return 100; }
        return p+1.8;
      });
    }, 55);
    return () => { clearInterval(ti); clearInterval(pi); };
  }, [onDone]);

  return (
    <div style={{ ...SS, background:bgMain }}>
      <FloatingPetals count={12} />
      <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
        <motion.div
          animate={{ scale:[1,1.1,1] }}
          transition={{ duration:3, repeat:Infinity }}
          style={{ fontSize:"clamp(36px,6vh,60px)", marginBottom:"clamp(12px,2vh,24px)" }}>
          🌸
        </motion.div>
        <motion.p key={txt} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          style={{ color:C.textSec, fontSize:"clamp(10px,1.4vh,15px)",
            letterSpacing:".2em", textTransform:"uppercase",
            marginBottom:"clamp(14px,2.5vh,28px)" }}>
          {txt}
        </motion.p>
        <div style={{ width:"clamp(120px,20vw,180px)", height:2,
          background:"rgba(196,150,220,.2)", borderRadius:100,
          overflow:"hidden", margin:"0 auto" }}>
          <motion.div style={{
            width:`${prog}%`, height:"100%",
            background:"linear-gradient(90deg,#c496dc,#ffb482)", borderRadius:100
          }} />
        </div>
      </div>
    </div>
  );
};

const WelcomeScreen = ({ onEnter }) => (
  <div style={{ ...SS, background:bgMain }}>
    <FloatingPetals count={16} />
    <motion.div
      initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:.9, delay:.2 }}
      style={{
        position:"relative", zIndex:1, textAlign:"center",
        background:"rgba(255,255,255,.6)",
        border:"1px solid rgba(210,170,210,.35)",
        backdropFilter:"blur(20px)",
        borderRadius:20,
        padding:"clamp(18px,3vh,36px) clamp(20px,4vw,44px)",
        width:"100%", maxWidth:420,
        boxShadow:"0 6px 32px rgba(180,130,200,.13)"
      }}>
      <motion.div animate={{ scale:[1,1.12,1] }} transition={{ duration:3, repeat:Infinity }}
        style={{ fontSize:"clamp(28px,5vh,48px)", marginBottom:"clamp(8px,1.5vh,16px)" }}>
        🌸
      </motion.div>
      <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(22px,4.5vh,46px)",
        fontWeight:300, color:C.lav800, marginBottom:"clamp(8px,1.5vh,16px)",
        letterSpacing:".04em" }}>
        {CONFIG.herName ? `Hey, ${CONFIG.herName}` : "Hey You 🌸"}
      </h1>
      <p style={{ fontFamily:"Georgia,serif", fontSize:"clamp(12px,1.8vh,17px)",
        color:C.textSec, lineHeight:1.8, marginBottom:"clamp(14px,2.5vh,28px)" }}>
        I made a small little thing<br/>
        for someone who deserves<br/>
        more smiles in life.
      </p>
      <motion.button
        whileHover={{ scale:1.04, boxShadow:"0 0 22px rgba(196,150,220,.4)" }}
        whileTap={{ scale:.97 }} onClick={onEnter}
        style={{
          width:"100%", padding:"clamp(9px,1.5vh,14px) 0",
          minHeight:42, borderRadius:12,
          background:"linear-gradient(135deg,rgba(196,150,220,.42),rgba(255,180,130,.42))",
          border:"1px solid rgba(196,150,220,.5)",
          color:C.lav800, cursor:"pointer",
          fontSize:"clamp(10px,1.4vh,14px)", letterSpacing:".18em",
          textTransform:"uppercase", fontFamily:"Georgia,serif"
        }}>
        Enter ✦
      </motion.button>
      <p style={{ color:C.textMut, fontSize:"clamp(9px,1.2vh,12px)",
        marginTop:"clamp(8px,1.5vh,14px)", letterSpacing:".12em" }}>
        made with love, from {CONFIG.yourName}
      </p>
    </motion.div>
  </div>
);

const EmotionalIntro = ({ onNext }) => {
  const lines = [
    { t:"Before we begin,", muted:true },
    { t:"I want you to know something.", muted:true },
    { t:"" },
    { t:"You matter more than you believe." },
    { t:"You've been through more than you've ever admitted." },
    { t:"And you're still here — still kind, still soft." },
    { t:"" },
    { t:"This is for you. 🌸", large:true },
  ];
  return (
    <div style={{ ...SS, background:bgMain }}>
      <FloatingPetals count={12} />
      <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:"min(520px,90vw)" }}>
        {lines.map((l,i) => (
          <motion.p key={i}
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.4+0.3, duration:.7 }}
            style={{
              fontFamily:"Georgia,serif",
              color: l.muted ? C.textSec : C.lav800,
              fontSize: l.large ? "clamp(14px,2.8vh,22px)" : "clamp(12px,1.8vh,17px)",
              fontStyle: l.muted ? "italic" : "normal",
              lineHeight:1.7,
              marginBottom: l.t ? "clamp(6px,1.2vh,12px)" : "clamp(2px,0.5vh,6px)"
            }}>
            {l.t}
          </motion.p>
        ))}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:lines.length*0.4+0.8 }}
          style={{ display:"flex", justifyContent:"center", marginTop:"clamp(12px,2vh,24px)" }}>
          <motion.button
            whileHover={{ scale:1.05 }} whileTap={{ scale:.97 }} onClick={onNext}
            style={{
              padding:"clamp(9px,1.5vh,14px) clamp(20px,4vw,36px)",
              minHeight:42, borderRadius:12,
              background:"linear-gradient(135deg,rgba(196,150,220,.42),rgba(255,180,130,.42))",
              border:"1px solid rgba(196,150,220,.5)",
              color:C.lav800, cursor:"pointer",
              fontSize:"clamp(10px,1.4vh,14px)", letterSpacing:".18em",
              textTransform:"uppercase", fontFamily:"Georgia,serif"
            }}>
            Continue →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

const TimelinePage = ({ data, page, total, onNext, onPrev }) => {
  const mobile = isMobile();
  const bgGrads = [
    "linear-gradient(160deg,#f9f0ff,#fff5f0,#ffeee6)",
    "linear-gradient(160deg,#fff2f8,#fff8f2,#ffeade)",
    "linear-gradient(160deg,#f5eeff,#fff4ee,#ffeae0)",
    "linear-gradient(160deg,#fdf0ff,#fff8f0,#ffe8dc)",
    "linear-gradient(160deg,#f8f0ff,#fff5ee,#ffece2)",
    "linear-gradient(160deg,#faeeff,#fff2ec,#ffeadf)",
    "linear-gradient(160deg,#f6eeff,#fff6f0,#ffece3)",
    "linear-gradient(160deg,#f9efff,#fff4ef,#ffebe1)",
    "linear-gradient(160deg,#fbf0ff,#fff6f1,#ffeee5)",
    "linear-gradient(160deg,#f8eeff,#fff5f0,#ffeae0)",
  ];

  return (
    <div style={{ ...SS, background:bgGrads[(page-1)%bgGrads.length] }}>
      <FloatingPetals count={12} />

      {/* Dots */}
      <div style={{ display:"flex", gap:5, justifyContent:"center",
        marginBottom:8, position:"relative", zIndex:1 }}>
        {Array.from({ length:total }, (_,i) => (
          <div key={i} style={{
            height:4, borderRadius:100, transition:"all .3s",
            width: i+1===page ? 16 : 4,
            background: i+1===page
              ? "linear-gradient(90deg,#c496dc,#ffb482)"
              : "rgba(196,150,220,.25)"
          }} />
        ))}
      </div>

      {/* Grid — single col mobile, two col laptop */}
      <motion.div key={page}
        initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
        exit={{ opacity:0, x:-30 }} transition={{ duration:.45, ease:"easeOut" }}
        style={{
          position:"relative", zIndex:1,
          display:"grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? "clamp(12px,2vh,20px)" : "clamp(10px,2vh,28px)",
          width:"100%", maxWidth: mobile ? "100%" : 860,
          alignItems:"center"
        }}>

        {/* Photo side */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
          <Polaroid src={data.image} page={page} />
        </div>

        {/* Text side */}
        <div style={{
          textAlign: mobile ? "center" : "left",
          paddingLeft: mobile ? 0 : "clamp(12px,2vw,32px)"
        }}>
          {data.quote.split("\n").map((line,i) => (
            <motion.p key={i}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.25+i*.1 }}
              style={{ fontFamily:"Georgia,serif",
                fontSize: mobile ? "clamp(16px,4vw,22px)" : "clamp(14px,2.8vh,22px)",
                fontWeight:300,
                color:C.lav800, lineHeight:1.5,
                marginBottom:"clamp(2px,0.5vh,6px)" }}>
              {line}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.55 }}
            style={{ fontFamily:"Georgia,serif",
              fontSize: mobile ? "clamp(12px,3vw,15px)" : "clamp(10px,1.4vh,14px)",
              fontStyle:"italic",
              color:"rgba(180,100,140,.72)",
              marginTop:"clamp(4px,0.8vh,10px)",
              marginBottom:"clamp(8px,1.8vh,20px)" }}>
            {data.subtext}
          </motion.p>

          {/* Nav buttons */}
          <div style={{ display:"flex", gap:8, alignItems:"center",
            justifyContent: mobile ? "center" : "flex-start",
            flexWrap:"wrap" }}>
            {page > 1 && (
              <motion.button
                whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }} onClick={onPrev}
                style={{
                  padding:"clamp(9px,1.5vh,14px) clamp(16px,3vw,28px)",
                  minHeight:42, borderRadius:12,
                  background:"rgba(255,255,255,.45)",
                  border:"1px solid rgba(196,150,220,.3)",
                  color:"rgba(90,50,110,.7)", cursor:"pointer",
                  fontSize:"clamp(10px,1.4vh,14px)", letterSpacing:".16em",
                  textTransform:"uppercase", fontFamily:"Georgia,serif"
                }}>
                ← Back
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale:1.04, boxShadow:"0 0 20px rgba(196,150,220,.35)" }}
              whileTap={{ scale:.96 }} onClick={onNext}
              style={{
                padding:"clamp(9px,1.5vh,14px) clamp(16px,3vw,28px)",
                minHeight:42, minWidth:120, borderRadius:12,
                background:"linear-gradient(135deg,rgba(196,150,220,.42),rgba(255,180,130,.42))",
                border:"1px solid rgba(196,150,220,.5)",
                color:C.lav800, cursor:"pointer",
                fontSize:"clamp(10px,1.4vh,14px)", letterSpacing:".16em",
                textTransform:"uppercase", fontFamily:"Georgia,serif"
              }}>
              {page === total ? "Continue ✦" : "Next →"}
            </motion.button>
          </div>

          <p style={{ color:C.textMut, fontSize:10, letterSpacing:".18em",
            marginTop:"clamp(4px,0.8vh,10px)",
            textAlign: mobile ? "center" : "left" }}>
            {page} / {total}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const AppreciationPage = ({ onNext }) => (
  <div style={{ ...SS, background:"linear-gradient(160deg,#fdf2ff,#fff5ef,#ffeae0)" }}>
    <FloatingPetals count={18} />
    <Sparkles count={28} />
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
      style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:"min(520px,90vw)" }}>
      <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:2.5, repeat:Infinity }}
        style={{ fontSize:"clamp(34px,6vh,56px)", marginBottom:"clamp(10px,2vh,22px)", color:"#e08080" }}>
        ♡
      </motion.div>
      <motion.h2 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}
        style={{ fontFamily:"Georgia,serif", fontSize:"clamp(22px,4vh,42px)",
          fontWeight:300, color:C.lav800, lineHeight:1.2,
          marginBottom:"clamp(8px,1.5vh,16px)" }}>
        Thank you<br/>for existing.
      </motion.h2>
      <motion.p initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.9 }}
        style={{ fontFamily:"Georgia,serif", fontSize:"clamp(12px,1.8vh,17px)",
          color:C.textSec, lineHeight:1.75, marginBottom:"clamp(4px,1vh,10px)" }}>
        You made people smile<br/>even while carrying your own battles.
      </motion.p>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.3 }}
        style={{ fontFamily:"Georgia,serif", fontSize:"clamp(10px,1.4vh,14px)",
          fontStyle:"italic", color:"rgba(200,120,140,.7)",
          marginBottom:"clamp(14px,2.5vh,28px)" }}>
        That kind of heart is rare.
      </motion.p>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
        style={{ display:"flex", justifyContent:"center" }}>
        <motion.button
          whileHover={{ scale:1.05, boxShadow:"0 0 22px rgba(255,170,120,.4)" }}
          whileTap={{ scale:.97 }} onClick={onNext}
          style={{
            padding:"clamp(9px,1.5vh,14px) clamp(20px,4vw,36px)",
            minHeight:42, borderRadius:12,
            background:"linear-gradient(135deg,rgba(255,180,130,.42),rgba(255,150,150,.35))",
            border:"1px solid rgba(255,170,120,.5)",
            color:C.lav800, cursor:"pointer",
            fontSize:"clamp(10px,1.4vh,14px)", letterSpacing:".18em",
            textTransform:"uppercase", fontFamily:"Georgia,serif"
          }}>
          One last thing →
        </motion.button>
      </motion.div>
    </motion.div>
  </div>
);

const FinalPage = ({ onReplay }) => {
  const [confetti, setConfetti] = useState(false);
  const mobile = isMobile();

  useEffect(() => {
    setConfetti(true);
    const t = setTimeout(() => setConfetti(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const btnStyle = {
    width:"100%", maxWidth:240,
    padding:"clamp(9px,1.5vh,14px) 0",
    minHeight:42, borderRadius:12,
    background:"linear-gradient(135deg,rgba(196,150,220,.42),rgba(255,180,130,.42))",
    border:"1px solid rgba(196,150,220,.5)",
    color:C.lav800, cursor:"pointer",
    fontSize:"clamp(10px,1.4vh,14px)", letterSpacing:".16em",
    textTransform:"uppercase", fontFamily:"Georgia,serif"
  };
  const btnGhostStyle = {
    ...btnStyle,
    background:"rgba(255,255,255,.45)",
    border:"1px solid rgba(196,150,220,.3)",
    color:"rgba(90,50,110,.7)"
  };

  return (
    <div style={{ ...SS, background:"linear-gradient(160deg,#f8eeff,#fff5ee,#ffe8de)", overflow:"hidden" }}>
      <FloatingPetals count={20} />
      <Sparkles count={30} />
      {confetti && <Confetti />}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
        style={{
          position:"relative", zIndex:1, width:"100%", maxWidth:820,
          display:"grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap:"clamp(10px,2vh,24px)",
          alignItems:"center"
        }}>
        {/* Left */}
        <div style={{ textAlign:"center" }}>
          <motion.div initial={{ scale:0 }} animate={{ scale:[0,1.3,1] }} transition={{ duration:.8, delay:.2 }}
            style={{ fontSize:"clamp(32px,5.5vh,60px)", marginBottom:"clamp(6px,1.2vh,14px)" }}>
            🎂
          </motion.div>
          <motion.h1 initial={{ opacity:0, scale:.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.5 }}
            style={{
              fontFamily:"Georgia,serif", fontSize:"clamp(22px,4.5vh,46px)", fontWeight:300,
              background:"linear-gradient(135deg,#9060c0,#e07070)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text", marginBottom:"clamp(6px,1.2vh,12px)"
            }}>
            Happy Birthday
          </motion.h1>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.7 }}
            style={{ fontSize:"clamp(22px,3.5vh,34px)", marginBottom:"clamp(8px,1.5vh,16px)" }}>
            💖
          </motion.div>
          <motion.p initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }}
            style={{ fontFamily:"Georgia,serif", fontSize:"clamp(12px,1.7vh,17px)",
              color:C.textSec, lineHeight:1.85 }}>
            I hope this year brings you<br/>
            <span style={{ color:"#9060c0", fontStyle:"italic" }}>peace</span> and{" "}
            <span style={{ color:"#e08870", fontStyle:"italic" }}>confidence</span>,<br/>
            <span style={{ color:"#b07ccc", fontStyle:"italic" }}>healing</span> and beautiful memories,<br/>
            and many reasons to smile again.
          </motion.p>
        </div>

        {/* Right */}
        <div style={{ textAlign:"center" }}>
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.4 }}
            style={{
              background:"rgba(196,150,220,.1)",
              border:"1px solid rgba(196,150,220,.22)",
              borderRadius:14,
              padding:"clamp(10px,1.8vh,20px) clamp(14px,3vw,28px)",
              marginBottom:"clamp(10px,2vh,18px)"
            }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:"clamp(14px,2.4vh,20px)",
              color:C.lav800, lineHeight:1.35 }}>
              You deserve happiness.
            </p>
            <p style={{ fontFamily:"Georgia,serif", fontSize:"clamp(10px,1.3vh,14px)",
              fontStyle:"italic", color:"rgba(180,120,160,.65)", marginTop:6 }}>
              Never forget that.
            </p>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
            style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
            <button onClick={() => setConfetti(true)} style={btnGhostStyle}>
              🎉 More confetti!
            </button>
            <button onClick={onReplay} style={btnStyle}>
              ↺ Replay Journey
            </button>
          </motion.div>

          <p style={{ color:C.textMut, fontSize:"clamp(9px,1.2vh,12px)",
            letterSpacing:".14em", marginTop:"clamp(8px,1.5vh,16px)" }}>
            made with love · {CONFIG.year}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const SC = { LOAD:"l", WELCOME:"w", INTRO:"i", TIMELINE:"t", APPREC:"a", FINAL:"f" };

export default function App() {
  const [sc, setSc]    = useState(SC.LOAD);
  const [pg, setPg]    = useState(1);
  const [music, setMu] = useState(false);
  const go = useCallback(s => setSc(s), []);

  return (
    <div style={{ position:"fixed", inset:0, overflow:"hidden" }}>
      <CursorGlow />
      <MusicBtn started={music} />
      <AnimatePresence mode="wait">
        {sc===SC.LOAD && (
          <motion.div key="l" exit={{ opacity:0 }} transition={{ duration:.5 }}
            style={{ position:"fixed", inset:0 }}>
            <LoadingScreen onDone={() => go(SC.WELCOME)} />
          </motion.div>
        )}
        {sc===SC.WELCOME && (
          <motion.div key="w" initial={{ opacity:0 }} animate={{ opacity:1 }}
            exit={{ opacity:0 }} transition={{ duration:.8 }}
            style={{ position:"fixed", inset:0 }}>
            <WelcomeScreen onEnter={() => { setMu(true); go(SC.INTRO); }} />
          </motion.div>
        )}
        {sc===SC.INTRO && (
          <motion.div key="i" initial={{ opacity:0 }} animate={{ opacity:1 }}
            exit={{ opacity:0 }} transition={{ duration:.8 }}
            style={{ position:"fixed", inset:0 }}>
            <EmotionalIntro onNext={() => go(SC.TIMELINE)} />
          </motion.div>
        )}
        {sc===SC.TIMELINE && (
          <motion.div key={`t${pg}`} initial={{ opacity:0 }} animate={{ opacity:1 }}
            exit={{ opacity:0 }} transition={{ duration:.45 }}
            style={{ position:"fixed", inset:0 }}>
            <TimelinePage
              data={TIMELINE_DATA[pg-1]} page={pg} total={TIMELINE_DATA.length}
              onNext={() => pg < TIMELINE_DATA.length ? setPg(p=>p+1) : go(SC.APPREC)}
              onPrev={() => pg > 1 ? setPg(p=>p-1) : go(SC.INTRO)} />
          </motion.div>
        )}
        {sc===SC.APPREC && (
          <motion.div key="a" initial={{ opacity:0 }} animate={{ opacity:1 }}
            exit={{ opacity:0 }} transition={{ duration:.8 }}
            style={{ position:"fixed", inset:0 }}>
            <AppreciationPage onNext={() => go(SC.FINAL)} />
          </motion.div>
        )}
        {sc===SC.FINAL && (
          <motion.div key="f" initial={{ opacity:0 }} animate={{ opacity:1 }}
            exit={{ opacity:0 }} transition={{ duration:.8 }}
            style={{ position:"fixed", inset:0 }}>
            <FinalPage onReplay={() => { setPg(1); setMu(false); go(SC.WELCOME); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";
import { useState, useRef, useCallback } from "react";

var LIGHTS = [
  {id:"direct",label:"Priame slnko",icon:"\u2600\uFE0F",desc:"Juzne okno"},
  {id:"bright",label:"Jasne nepriame",icon:"\uD83C\uDF24",desc:"Blizko okna"},
  {id:"medium",label:"Stredne",icon:"\u26C5",desc:"Dalej od okna"},
  {id:"low",label:"Malo svetla",icon:"\uD83C\uDF19",desc:"Tmavy kut"},
];

var LAST_WATERED = [
  {id:0,label:"Dnes",icon:"\uD83D\uDCA7"},
  {id:1,label:"Vcera",icon:"\uD83D\uDCA7"},
  {id:3,label:"Pred 2-3 dnami",icon:"\uD83D\uDCA6"},
  {id:5,label:"Pred 4-7 dnami",icon:"\uD83C\uDFDC\uFE0F"},
  {id:-1,label:"Neviem / davno",icon:"\uD83E\uDD37"},
];

var TIME_OPTIONS = [
  {h:7,label:"7:00 rano"},
  {h:8,label:"8:00 rano"},
  {h:9,label:"9:00 rano"},
  {h:10,label:"10:00 doobeda"},
  {h:12,label:"12:00 na obed"},
  {h:17,label:"17:00 podvecer"},
  {h:19,label:"19:00 vecer"},
];

function generateICS(name, interval, untilFirst, hour) {
  var now = new Date();
  function pad(n) { return String(n).padStart(2, "0"); }
  function fmt(d) { return d.getFullYear().toString()+pad(d.getMonth()+1)+pad(d.getDate())+"T"+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds()); }
  var start = new Date(now);
  start.setDate(start.getDate() + Math.max(untilFirst, 1));
  start.setHours(hour, 0, 0, 0);
  var end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);
  var until = new Date(start);
  until.setFullYear(until.getFullYear() + 1);
  return [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Botanik//SK","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT","UID:botanik-"+Date.now()+"@botanik.app",
    "DTSTART:"+fmt(start),"DTEND:"+fmt(end),
    "RRULE:FREQ=DAILY;INTERVAL="+interval+";UNTIL="+fmt(until),
    "SUMMARY:Poliat "+name,
    "DESCRIPTION:Cas poliat "+name+" kazdych "+interval+" dni.",
    "BEGIN:VALARM","TRIGGER:-PT10M","ACTION:DISPLAY","DESCRIPTION:O 10 min poliat "+name+"!","END:VALARM",
    "BEGIN:VALARM","TRIGGER:PT0M","ACTION:DISPLAY","DESCRIPTION:Polej "+name+" teraz!","END:VALARM",
    "END:VEVENT","END:VCALENDAR"
  ].join("\r\n");
}

function downloadICS(name, interval, untilFirst, hour) {
  var ics = generateICS(name, interval, untilFirst, hour);
  var blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = "polievanie.ics";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function shrink(file) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    var fr = new FileReader();
    fr.onload = function(e) { img.src = e.target.result; };
    fr.onerror = function() { reject("Neda sa precitat"); };
    fr.readAsDataURL(file);
    img.onload = function() {
      var MAX = 768;
      var w = img.width, h = img.height;
      var r = Math.min(MAX/w, MAX/h, 1);
      w = Math.round(w*r); h = Math.round(h*r);
      var c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve({ b64: c.toDataURL("image/jpeg",0.6).split(",")[1], preview: c.toDataURL("image/jpeg",0.75) });
    };
    img.onerror = function() { reject("Obrazok sa nenacital"); };
  });
}

function getWateringDays(plant, lightId, seasonId) {
  if (!plant || !plant.watering) return 7;
  var key = lightId + "_" + (seasonId === "s" ? "summer" : "winter");
  return plant.watering[key] || 7;
}

export default function Home() {
  var [step, setStep] = useState("start");
  var [preview, setPreview] = useState(null);
  var [plant, setPlant] = useState(null);
  var [light, setLight] = useState(null);
  var [season, setSeason] = useState(null);
  var [days, setDays] = useState(null);
  var [dUntil, setDUntil] = useState(null);
  var [hour, setHour] = useState(9);
  var [err, setErr] = useState(null);
  var [calAdded, setCalAdded] = useState(false);
  var ref = useRef();

  var onFile = useCallback(async function(e) {
    var file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    setErr(null); setStep("scan");
    try {
      var data = await shrink(file);
      setPreview(data.preview);
      var res = await fetch("/api/identify", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:data.b64})});
      var json = await res.json();
      if (!res.ok || json.error) { setErr(json.error || "Nepodarilo sa identifikovat rastlinu. Skuste inu fotku."); setStep("start"); return; }
      if (json.plant) { setPlant(json.plant); setStep("confirm"); }
      else { setErr("Neocakavana odpoved zo servera"); setStep("start"); }
    } catch (ex) { setErr("Chyba pripojenia: " + ex.message); setStep("start"); }
    finally { if (ref.current) ref.current.value = ""; }
  }, []);

  var pickLight = useCallback(function(id) { setLight(id); setStep("season"); }, []);
  var pickSeason = useCallback(function(s) { setSeason(s); setDays(getWateringDays(plant, light, s)); setStep("lastwater"); }, [plant, light]);
  var pickLast = useCallback(function(daysAgo) { setDUntil(daysAgo === -1 ? days : Math.max(days - daysAgo, 0)); setStep("time"); }, [days]);
  var pickTime = useCallback(function(h) { setHour(h); setStep("done"); setCalAdded(false); }, []);
  var reset = useCallback(function() {
    setStep("start"); setPreview(null); setPlant(null); setLight(null);
    setSeason(null); setDays(null); setDUntil(null); setHour(9);
    setErr(null); setCalAdded(false);
  }, []);

  var li = LIGHTS.find(function(x) { return x.id === light; });
  var confLabel = plant && plant.confidence === "high" ? "Vysoka istota" : plant && plant.confidence === "medium" ? "Stredna istota" : "Nizka istota";

  return (
    <div style={S.root}>
      <style>{
        "*{box-sizing:border-box;margin:0;padding:0}"+
        "@keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}"+
        "@keyframes pl{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}"+
        "@keyframes sp{to{transform:rotate(360deg)}}"+
        ".fi{animation:fi .35s ease-out both}"+
        ".pl{animation:pl 2.5s ease-in-out infinite}"+
        "button{cursor:pointer;font-family:'Nunito',sans-serif}"+
        "button:active{transform:scale(.96)!important}"
      }</style>
      <div style={{position:"fixed",top:-120,left:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(110,231,183,.07) 0%,transparent 70%)",pointerEvents:"none"}} />

      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:32,cursor:"pointer"}} onClick={reset}>&#127794;</div>
        <h1 style={S.h1} onClick={reset}>Botanik</h1>
        <p style={S.sub}>Odfot - Rozpozname - Pripomenieme</p>
      </div>

      <div style={S.wrap} className="fi" key={step}>

        {step==="start" && (<Cd>
          {err && <div style={S.errB}>{err}</div>}
          <div style={S.drop} onClick={function(){ref.current && ref.current.click();}}>
            <div style={{fontSize:52,marginBottom:8}}>&#128248;</div>
            <p style={{fontSize:17,fontWeight:700,color:"#6ee7b7"}}>Odfotit kvetinu</p>
            <p style={{fontSize:13,color:"rgba(255,255,255,.3)",marginTop:6}}>AI rozpozna akukolvek izbovu rastlinu</p>
          </div>
          <input ref={ref} type="file" accept="image/*" onChange={onFile} style={{display:"none"}} />
        </Cd>)}

        {step==="scan" && (<Cd>
          {preview && <img src={preview} alt="" style={S.prev} />}
          <div style={{width:38,height:38,borderRadius:"50%",margin:"8px auto",border:"3px solid rgba(110,231,183,.2)",borderTopColor:"#6ee7b7",animation:"sp .7s linear infinite"}} />
          <p style={{fontSize:14,fontWeight:600,color:"#6ee7b7"}}>Analyzujem fotku...</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,.25)"}}>Detailne skumam listy, kvety, stonku a tvar rastu</p>
        </Cd>)}

        {step==="confirm" && plant && (<Cd>
          {preview && <img src={preview} alt="" style={S.prev} />}
          <div style={{textAlign:"center"}}>
            <p style={{fontSize:11,color: plant.confidence === "high" ? "#6ee7b7" : "#fbbf24",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}>{confLabel}</p>
            <h2 style={S.pn}>{plant.name}</h2>
            <p style={{fontSize:12,fontStyle:"italic",color:"rgba(255,255,255,.3)"}}>{plant.latin}</p>
            {plant.name_en && <p style={{fontSize:11,color:"rgba(255,255,255,.25)"}}>{plant.name_en}</p>}
          </div>
          <p style={S.desc}>{plant.description}</p>
          <button style={S.pri} onClick={function(){setStep("light");}}>Ano, to je ona!</button>
          <button style={S.gh} onClick={function(){setErr(null); setStep("start");}}>Nie, chcem skusit inu fotku</button>
        </Cd>)}

        {step==="light" && (<Cd>
          <h3 style={S.q}>Ake svetlo ma {plant ? plant.name : ""}?</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}>
            {LIGHTS.map(function(o) { return (
              <button key={o.id} style={S.opt} onClick={function(){pickLight(o.id);}}>
                <span style={{fontSize:28}}>{o.icon}</span>
                <span style={{fontSize:13,fontWeight:700,color:"#1a2e0d"}}>{o.label}</span>
                <span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>{o.desc}</span>
              </button>
            ); })}
          </div>
        </Cd>)}

        {step==="season" && (<Cd>
          <h3 style={S.q}>Ake je teraz obdobie?</h3>
          <div style={{display:"flex",gap:12,width:"100%"}}>
            <button style={Object.assign({},S.opt,{flex:1,padding:"22px 12px"})} onClick={function(){pickSeason("s");}}>
              <span style={{fontSize:36}}>&#127803;</span>
              <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>Leto / Jar</span>
            </button>
            <button style={Object.assign({},S.opt,{flex:1,padding:"22px 12px"})} onClick={function(){pickSeason("w");}}>
              <span style={{fontSize:36}}>&#10052;&#65039;</span>
              <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>Zima / Jesen</span>
            </button>
          </div>
          <button style={S.gh} onClick={function(){setStep("light");}}>Spat</button>
        </Cd>)}

        {step==="lastwater" && (<Cd>
          <h3 style={S.q}>Kedy bola naposledy poliata?</h3>
          <p style={{fontSize:13,color:"rgba(255,255,255,.35)",textAlign:"center"}}>Podla toho nastavime prvu pripomienku</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
            {LAST_WATERED.map(function(lw) { return (
              <button key={lw.id} style={S.lwBtn} onClick={function(){pickLast(lw.id);}}>
                <span style={{fontSize:22}}>{lw.icon}</span>
                <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>{lw.label}</span>
              </button>
            ); })}
          </div>
          <button style={S.gh} onClick={function(){setStep("season");}}>Spat</button>
        </Cd>)}

        {step==="time" && (<Cd>
          <h3 style={S.q}>V akom case chces pripomienku?</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,width:"100%"}}>
            {TIME_OPTIONS.map(function(t) { return (
              <button key={t.h} style={S.timeBtn} onClick={function(){pickTime(t.h);}}>
                <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>{t.label}</span>
              </button>
            ); })}
          </div>
          <button style={S.gh} onClick={function(){setStep("lastwater");}}>Spat</button>
        </Cd>)}

        {step==="done" && days && plant && (<Cd>
          <div style={S.orb} className="pl">
            <span style={{fontSize:46,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#fff",lineHeight:1}}>{days}</span>
            <span style={{fontSize:13,color:"rgba(255,255,255,.7)"}}>dni</span>
          </div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:21,fontWeight:600,color:"#d1fae5",textAlign:"center",lineHeight:1.4}}>
            Polievaj {plant.name} kazdych {days} dni
          </h2>
          <div style={S.nextBox}>
            <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,.5)"}}>
              {dUntil === 0 ? "Treba poliat dnes! Pripomienky od zajtra o "+hour+":00."
              : dUntil === 1 ? "Dalsie polievanie zajtra o "+hour+":00."
              : "Dalsie polievanie o "+dUntil+" dni o "+hour+":00."}
            </p>
          </div>
          <div style={S.sum}>
            <SR i="&#127807;" l="Rastlina" v={plant.name} />
            <SR i="" l="Latinsky" v={plant.latin || ""} />
            <SR i={li ? li.icon : ""} l="Svetlo" v={li ? li.label : ""} />
            <SR i={season==="s" ? "&#127803;" : "&#10052;&#65039;"} l="Obdobie" v={season==="s" ? "Leto / Jar" : "Zima / Jesen"} />
            <SR i="&#128167;" l="Cyklus" v={"kazdych "+days+" dni"} />
            <SR i="&#128336;" l="Cas pripomienky" v={hour+":00"} />
          </div>
          {plant.tip && <div style={S.tipB}><span>&#128161;</span><p style={{margin:0,fontSize:13,color:"#fef3c7",lineHeight:1.5}}>{plant.tip}</p></div>}
          {!calAdded ? (
            <button style={S.calBtn} onClick={function(){downloadICS(plant.name, days, dUntil, hour); setCalAdded(true);}}>
              Pridat pripomienku do kalendara
            </button>
          ) : (
            <div style={S.calDone}>
              <p style={{margin:0,fontSize:14,fontWeight:600,color:"#6ee7b7"}}>Subor stiahnuty!</p>
              <p style={{margin:"6px 0 0",fontSize:12,color:"rgba(255,255,255,.4)",lineHeight:1.5}}>Otvor .ics subor - na iPhone sa automaticky prida do Kalendara ako opakujuca sa pripomienka.</p>
              <button style={Object.assign({},S.gh,{marginTop:8,fontSize:12,color:"rgba(255,255,255,.35)"})} onClick={function(){downloadICS(plant.name, days, dUntil, hour);}}>Stiahnut znova</button>
            </div>
          )}
          <button style={S.pri} onClick={reset}>Dalsia kvetina</button>
        </Cd>)}
      </div>
    </div>
  );
}

function Cd(props) { return <div style={S.card}>{props.children}</div>; }
function SR(props) { return <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}><span style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>{props.i} {props.l}</span><span style={{fontSize:13,fontWeight:700,color:"#d1fae5"}}>{props.v}</span></div>; }

var S = {
  root:{minHeight:"100vh",background:"linear-gradient(170deg,#051208 0%,#0e2616 45%,#071410 100%)",fontFamily:"'Nunito',sans-serif",color:"#fff",padding:"20px 16px 48px",position:"relative",overflow:"hidden"},
  h1:{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:700,margin:"2px 0",background:"linear-gradient(135deg,#6ee7b7,#d1fae5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",cursor:"pointer"},
  sub:{fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:".12em",textTransform:"uppercase"},
  wrap:{maxWidth:400,margin:"0 auto",position:"relative",zIndex:1},
  card:{background:"rgba(255,255,255,.06)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.07)",borderRadius:22,padding:"22px 18px",display:"flex",flexDirection:"column",alignItems:"center",gap:14},
  drop:{width:"100%",padding:"30px 16px",border:"2px dashed rgba(110,231,183,.2)",borderRadius:16,textAlign:"center",cursor:"pointer",background:"rgba(110,231,183,.02)"},
  prev:{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:14},
  q:{fontFamily:"'Fraunces',serif",fontSize:19,fontWeight:600,color:"#d1fae5",textAlign:"center",margin:0},
  pn:{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,color:"#d1fae5",margin:0},
  desc:{fontSize:13,color:"rgba(255,255,255,.45)",textAlign:"center",lineHeight:1.5},
  pri:{width:"100%",padding:"14px",background:"linear-gradient(135deg,#059669,#047857)",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,boxShadow:"0 4px 20px rgba(5,150,105,.3)"},
  gh:{background:"none",border:"none",color:"rgba(255,255,255,.3)",fontSize:13,padding:"6px 12px"},
  opt:{display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"16px 8px",borderRadius:14,border:"1.5px solid rgba(110,231,183,.12)",background:"rgba(255,255,255,.88)"},
  lwBtn:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,border:"1.5px solid rgba(110,231,183,.12)",background:"rgba(255,255,255,.88)",width:"100%"},
  timeBtn:{padding:"14px 12px",borderRadius:14,border:"1.5px solid rgba(110,231,183,.12)",background:"rgba(255,255,255,.88)",textAlign:"center"},
  orb:{width:118,height:118,borderRadius:"50%",background:"linear-gradient(145deg,#059669,#047857)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"0 0 40px rgba(5,150,105,.35)"},
  sum:{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,.05)",borderRadius:12,border:"1px solid rgba(255,255,255,.06)"},
  tipB:{display:"flex",gap:8,alignItems:"flex-start",padding:"10px 14px",borderRadius:12,width:"100%",background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.1)"},
  nextBox:{width:"100%",padding:"10px 14px",borderRadius:12,background:"rgba(110,231,183,.06)",border:"1px solid rgba(110,231,183,.1)",textAlign:"center"},
  calBtn:{width:"100%",padding:"15px",background:"linear-gradient(135deg,#1a5276,#1e6f9f)",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,boxShadow:"0 4px 20px rgba(26,82,118,.3)"},
  calDone:{width:"100%",padding:"14px 16px",borderRadius:14,background:"rgba(110,231,183,.06)",border:"1px solid rgba(110,231,183,.12)",textAlign:"center"},
  errB:{width:"100%",padding:"10px 14px",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.18)",borderRadius:12,fontSize:13,color:"#fca5a5",textAlign:"center"},
};

"use client";
import { useState, useRef, useCallback } from "react";

/* ═══ PLANT DATABASE ═══ */
const DB = [
  {id:0,n:"Orchidea",lat:"Phalaenopsis",desc:"Motýľovité kvety na dlhom stonke.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:10,lw:14},tip:"Polievaj ponorením na 15 min."},
  {id:1,n:"Monstera",lat:"Monstera deliciosa",desc:"Veľké srdcovité listy s dierami.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:14},tip:"Otrieraj listy od prachu."},
  {id:2,n:"Fikus elastický",lat:"Ficus elastica",desc:"Veľké tmavozelené lesklé listy.",w:{ds:5,dw:9,bs:6,bw:10,ms:8,mw:13,ls:10,lw:16},tip:"Nemá rada presúvanie."},
  {id:3,n:"Aloe vera",lat:"Aloe vera",desc:"Dlhé mäsité listy plné gélu.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:21,ls:14,lw:28},tip:"Radšej menej vody."},
  {id:4,n:"Zamiokulkas",lat:"Zamioculcas zamiifolia",desc:"Lesklé tmavozelené listy, nezničiteľný.",w:{ds:8,dw:16,bs:10,bw:18,ms:14,mw:24,ls:16,lw:30},tip:"Znesie aj zanedbanie."},
  {id:5,n:"Pothos",lat:"Epipremnum aureum",desc:"Popínavá so srdcovitými listami.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Rastie aj vo vode."},
  {id:6,n:"Svokrine jazyky",lat:"Sansevieria",desc:"Vysoké tuhé mečovité listy.",w:{ds:10,dw:18,bs:12,bw:21,ms:14,mw:25,ls:16,lw:30},tip:"Čistí vzduch aj v noci."},
  {id:7,n:"Fialka",lat:"Saintpaulia",desc:"Fialové kvietky, chlpaté listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:7,ls:6,lw:9},tip:"Polievaj odspodu."},
  {id:8,n:"Kaktus",lat:"Cactaceae",desc:"Ihličky, guľatý alebo stĺpovitý.",w:{ds:12,dw:25,bs:14,bw:28,ms:16,mw:30,ls:20,lw:40},tip:"V zime takmer nepolievaj."},
  {id:9,n:"Begónia",lat:"Begonia",desc:"Asymetrické listy, drobné kvety.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Miluje vlhkosť."},
  {id:10,n:"Šéflera",lat:"Schefflera",desc:"Vejárovité zložené listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Občas otoč."},
  {id:11,n:"Dracéna",lat:"Dracaena",desc:"Úzke listy na drevnatom kmeni.",w:{ds:5,dw:9,bs:6,bw:11,ms:8,mw:14,ls:10,lw:18},tip:"Filtrovaná voda."},
  {id:12,n:"Filodendron",lat:"Philodendron",desc:"Srdcovité listy, popínavá.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Rýchlo rastie."},
  {id:13,n:"Kalatea",lat:"Calathea",desc:"Farebné vzory na listoch.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Citlivá na tvrdú vodu."},
  {id:14,n:"Papraď",lat:"Nephrolepis",desc:"Vzdušné zelené perím-listy.",w:{ds:2,dw:4,bs:3,bw:5,ms:4,mw:6,ls:5,lw:8},tip:"Ideálna do kúpeľne."},
  {id:15,n:"Tučnolist",lat:"Crassula ovata",desc:"Mäsité listy, peňažný stromček.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:25},tip:"Veľa svetla."},
  {id:16,n:"Brečtan",lat:"Hedera helix",desc:"Popínavá, laločnaté listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Jedovatý pre zvieratá."},
  {id:17,n:"Spatifilum",lat:"Spathiphyllum",desc:"Tmavozelené listy, biele kvety.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Listy ovísnú keď má smäd."},
  {id:18,n:"Antúrium",lat:"Anthurium",desc:"Červené lesklé srdcovité kvety.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Miluje vlhkosť."},
  {id:19,n:"Fikus benjamín",lat:"Ficus benjamina",desc:"Malé oválne listy, stromček.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Nechaj na jednom mieste."},
  {id:20,n:"Yucca",lat:"Yucca",desc:"Ostré listy z hrubého kmeňa.",w:{ds:7,dw:12,bs:8,bw:14,ms:10,mw:18,ls:12,lw:21},tip:"Odolná, rada má svetlo."},
  {id:21,n:"Palma Areka",lat:"Dypsis lutescens",desc:"Palmové listy na tenkých kmeňoch.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Zvlhčuje vzduch."},
  {id:22,n:"Aglaonema",lat:"Aglaonema",desc:"Široké farebné listy.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:15},tip:"Nízke nároky na svetlo."},
  {id:23,n:"Dieffenbachia",lat:"Dieffenbachia",desc:"Veľké zeleno-biele listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Jedovatá šťava!"},
  {id:24,n:"Kroton",lat:"Codiaeum",desc:"Pestré červeno-žlto-zelené listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Viac svetla = sýtejšie farby."},
  {id:25,n:"Pilea",lat:"Pilea peperomioides",desc:"Okrúhle mincovité listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:10,ls:8,lw:13},tip:"Tvorí odnože."},
  {id:26,n:"Maranta",lat:"Maranta",desc:"Listy s žilkami, zatvára sa na noc.",w:{ds:3,dw:5,bs:4,bw:7,ms:5,mw:8,ls:6,lw:10},tip:"Modliaca sa rastlina."},
  {id:27,n:"Haworthia",lat:"Haworthia",desc:"Malý sukulent, pruhované listy.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:22,ls:14,lw:28},tip:"Znesie nepriame svetlo."},
  {id:28,n:"Echeveria",lat:"Echeveria",desc:"Ružicový sukulent.",w:{ds:7,dw:14,bs:9,bw:18,ms:11,mw:21,ls:14,lw:28},tip:"Polievaj len pôdu."},
  {id:29,n:"Tradescantia",lat:"Tradescantia",desc:"Fialovo-zelené pruhované listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Zakorení za pár dní."},
  {id:30,n:"Kalanchoe",lat:"Kalanchoe",desc:"Sukulent s farebnými kvetmi.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:24},tip:"Dlho kvitnúci."},
  {id:31,n:"Zelenec",lat:"Chlorophytum",desc:"Zeleno-biele dlhé listy.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Čistí vzduch."},
  {id:32,n:"Hoya",lat:"Hoya carnosa",desc:"Mäsité listy, voskové kvety.",w:{ds:6,dw:12,bs:7,bw:14,ms:9,mw:16,ls:11,lw:20},tip:"Nepresádzaj často."},
  {id:33,n:"Alocasia",lat:"Alocasia",desc:"Veľké šípovité listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Vlhkosť a teplo."},
  {id:34,n:"Cyklámen",lat:"Cyclamen",desc:"Srdcovité listy, motýľové kvety.",w:{ds:3,dw:5,bs:3,bw:6,ms:4,mw:7,ls:5,lw:8},tip:"Kvitne v zime!"},
  {id:35,n:"Peperomia",lat:"Peperomia",desc:"Malá, mäsité okrúhle listy.",w:{ds:5,dw:9,bs:6,bw:10,ms:7,mw:12,ls:9,lw:15},tip:"Nepreliať!"},
  {id:36,n:"Levandula",lat:"Lavandula",desc:"Fialové kvety, krásna vôňa.",w:{ds:5,dw:10,bs:6,bw:12,ms:8,mw:14,ls:10,lw:18},tip:"Veľa slnka."},
  {id:37,n:"Vianočná hviezda",lat:"Euphorbia pulcherrima",desc:"Veľké červené listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:7,ls:6,lw:9},tip:"Chráň pred prievanom."},
];

const LIGHTS = [
  {id:"d",label:"Priame slnko",icon:"☀️",desc:"Južné okno"},
  {id:"b",label:"Jasné nepriame",icon:"🌤",desc:"Blízko okna"},
  {id:"m",label:"Stredné",icon:"⛅",desc:"Ďalej od okna"},
  {id:"l",label:"Málo svetla",icon:"🌙",desc:"Tmavý kút"},
];

const LAST_WATERED = [
  {id:0,label:"Dnes",icon:"💧",desc:"Práve som ju polial/a"},
  {id:1,label:"Včera",icon:"💧",desc:"Pred 1 dňom"},
  {id:2,label:"Pred 2-3 dňami",icon:"💦",desc:""},
  {id:5,label:"Pred 4-7 dňami",icon:"🏜️",desc:"Asi týždeň"},
  {id:-1,label:"Neviem / dávno",icon:"🤷",desc:"Polej ju dnes"},
];

/* ═══ ICS CALENDAR FILE GENERATOR ═══ */
function generateICS(plantName, intervalDays, daysUntilFirst) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const formatDate = (d) =>
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) + "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds());

  const start = new Date(now);
  start.setDate(start.getDate() + daysUntilFirst);
  start.setHours(9, 0, 0, 0);

  // If the first reminder would be in the past or today, set it to tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  if (start <= now) {
    start.setTime(tomorrow.getTime());
  }

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);

  const until = new Date(start);
  until.setFullYear(until.getFullYear() + 1);

  const uid = "botanik-" + Date.now() + "@botanik.app";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Botanik//Polievanie//SK",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + uid,
    "DTSTART:" + formatDate(start),
    "DTEND:" + formatDate(end),
    "RRULE:FREQ=DAILY;INTERVAL=" + intervalDays + ";UNTIL=" + formatDate(until),
    "SUMMARY:🌿 Poliat " + plantName,
    "DESCRIPTION:Cas poliat " + plantName + "! Polievaj kazdych " + intervalDays + " dni.",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:O 15 minut treba poliat " + plantName + "!",
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:PT0M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Polej " + plantName + " teraz!",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(plantName, intervalDays, daysUntilFirst) {
  const ics = generateICS(plantName, intervalDays, daysUntilFirst);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "polievanie-" + plantName.toLowerCase().replace(/[^a-z0-9]/gi, "-") + ".ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ═══ IMAGE COMPRESSION ═══ */
function shrink(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const fr = new FileReader();
    fr.onload = e => { img.src = e.target.result; };
    fr.onerror = () => reject("Neda sa precitat");
    fr.readAsDataURL(file);
    img.onload = () => {
      const MAX = 512;
      let w = img.width, h = img.height;
      const r = Math.min(MAX / w, MAX / h, 1);
      w = Math.round(w * r); h = Math.round(h * r);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      const url = c.toDataURL("image/jpeg", 0.5);
      resolve({ b64: url.split(",")[1], preview: url });
    };
    img.onerror = () => reject("Obrazok sa nenacital");
  });
}

/* ═══ APP ═══ */
export default function Home() {
  const [step, setStep] = useState("start");
  const [preview, setPreview] = useState(null);
  const [plant, setPlant] = useState(null);
  const [light, setLight] = useState(null);
  const [season, setSeason] = useState(null);
  const [days, setDays] = useState(null);
  const [lastWatered, setLastWatered] = useState(null);
  const [daysUntilFirst, setDaysUntilFirst] = useState(null);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");
  const [calAdded, setCalAdded] = useState(false);
  const ref = useRef();

  const onFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null); setStep("scan");
    try {
      const { b64, preview: p } = await shrink(file);
      setPreview(p);
      const res = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: b64 }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErr(data.error || "Nepodarilo sa identifikovat");
        setStep("fallback");
        return;
      }
      const found = DB.find(p => p.id === data.id);
      if (found) { setPlant(found); setStep("confirm"); }
      else { setErr("Nenajdena v databaze"); setStep("fallback"); }
    } catch (ex) {
      setErr("Chyba: " + ex.message);
      setStep("fallback");
    } finally {
      if (ref.current) ref.current.value = "";
    }
  }, []);

  const pickPlant = useCallback((p) => { setPlant(p); setStep("light"); setErr(null); }, []);
  const pickLight = useCallback((id) => { setLight(id); setStep("season"); }, []);

  const pickSeason = useCallback((s) => {
    setSeason(s);
    const d = plant?.w?.[light + s] || 7;
    setDays(d);
    setStep("lastwater");
  }, [plant, light]);

  const pickLastWatered = useCallback((daysAgo) => {
    setLastWatered(daysAgo);
    let until;
    if (daysAgo === -1) {
      // Neviem / dávno → polej dnes, prvá pripomienka o "days" dní
      until = days;
    } else {
      // Vypočítaj koľko dní zostáva
      until = days - daysAgo;
      if (until <= 0) {
        // Už mala byť poliata → polej dnes, pripomienka o "days" dní
        until = 0;
      }
    }
    setDaysUntilFirst(until);
    setStep("done");
    setCalAdded(false);
  }, [days]);

  const reset = useCallback(() => {
    setStep("start"); setPreview(null); setPlant(null);
    setLight(null); setSeason(null); setDays(null);
    setLastWatered(null); setDaysUntilFirst(null);
    setErr(null); setSearch(""); setCalAdded(false);
  }, []);

  const filtered = search.trim()
    ? DB.filter(p => (p.n+" "+p.lat+" "+p.desc).toLowerCase().includes(search.toLowerCase()))
    : DB;
  const li = LIGHTS.find(x => x.id === light);

  // Text for the first reminder
  const firstReminderText = daysUntilFirst === 0
    ? "Polej ju dnes! Prvá pripomienka zajtra ráno."
    : daysUntilFirst === 1
    ? "Ďalšie polievanie zajtra."
    : "Ďalšie polievanie o " + daysUntilFirst + " dní.";

  return (
    <div style={S.root}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pl{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes sp{to{transform:rotate(360deg)}}
        .fi{animation:fi .35s ease-out both}
        .pl{animation:pl 2.5s ease-in-out infinite}
        button{cursor:pointer;font-family:'Nunito',sans-serif}
        button:active{transform:scale(.96)!important}
        input{font-family:'Nunito',sans-serif}
      `}</style>

      <div style={{position:"fixed",top:-120,left:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(110,231,183,.07) 0%,transparent 70%)",pointerEvents:"none"}} />

      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:32}}>🪴</div>
        <h1 style={S.h1}>Botanik</h1>
        <p style={S.sub}>Odfotis → Rozpozname → Pripomenieme</p>
      </div>

      <div style={S.wrap} className="fi" key={step}>

        {step==="start"&&(
          <Cd>
            <div style={S.drop} onClick={()=>ref.current?.click()}>
              <div style={{fontSize:52,marginBottom:8}}>📸</div>
              <p style={{fontSize:17,fontWeight:700,color:"#6ee7b7"}}>Ofot kvetinu</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,.3)",marginTop:6}}>AI ju rozpozna z databazy 38 rastlin</p>
            </div>
            <input ref={ref} type="file" accept="image/*" onChange={onFile} style={{display:"none"}} />
            <div style={{width:"100%",height:1,background:"rgba(255,255,255,.06)"}}/>
            <button style={S.sec} onClick={()=>setStep("fallback")}>📋 Najdi podla nazvu</button>
          </Cd>
        )}

        {step==="scan"&&(
          <Cd>
            {preview&&<img src={preview} alt="" style={S.prev}/>}
            <div style={{width:38,height:38,borderRadius:"50%",margin:"8px auto",border:"3px solid rgba(110,231,183,.2)",borderTopColor:"#6ee7b7",animation:"sp .7s linear infinite"}}/>
            <p style={{fontSize:14,fontWeight:600,color:"#6ee7b7"}}>Analyzujem fotku…</p>
          </Cd>
        )}

        {step==="confirm"&&plant&&(
          <Cd>
            {preview&&<img src={preview} alt="" style={S.prev}/>}
            <p style={{fontSize:11,color:"#6ee7b7",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}>Najdena zhoda</p>
            <h2 style={S.pn}>{plant.n}</h2>
            <p style={{fontSize:12,fontStyle:"italic",color:"rgba(255,255,255,.3)"}}>{plant.lat}</p>
            <p style={S.desc}>{plant.desc}</p>
            <button style={S.pri} onClick={()=>setStep("light")}>✓ Spravna rastlina</button>
            <button style={S.gh} onClick={()=>setStep("fallback")}>✗ Nie je to ona</button>
          </Cd>
        )}

        {step==="fallback"&&(
          <Cd>
            {err&&<div style={S.errB}>{err}</div>}
            <h3 style={S.q}>Najdi svoju rastlinu</h3>
            <input type="text" placeholder="Hladaj… (monstera, kaktus…)" value={search} onChange={e=>setSearch(e.target.value)} style={S.inp}/>
            <div style={{display:"flex",flexDirection:"column",gap:5,width:"100%",maxHeight:320,overflowY:"auto"}}>
              {filtered.map(p=>(
                <button key={p.id} style={S.resC} onClick={()=>pickPlant(p)}>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:700,color:"#1a2e0d",margin:0}}>{p.n}</p>
                    <p style={{fontSize:10,color:"rgba(0,0,0,.4)",margin:0}}>{p.lat} — {p.desc}</p>
                  </div>
                  <span style={{color:"#059669",fontSize:16}}>→</span>
                </button>
              ))}
            </div>
            <button style={S.gh} onClick={reset}>← Odznova</button>
          </Cd>
        )}

        {step==="light"&&(
          <Cd>
            <h3 style={S.q}>Ake svetlo ma {plant?.n}?</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}>
              {LIGHTS.map(o=>(
                <button key={o.id} style={S.opt} onClick={()=>pickLight(o.id)}>
                  <span style={{fontSize:28}}>{o.icon}</span>
                  <span style={{fontSize:13,fontWeight:700,color:"#1a2e0d"}}>{o.label}</span>
                  <span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>{o.desc}</span>
                </button>
              ))}
            </div>
          </Cd>
        )}

        {step==="season"&&(
          <Cd>
            <h3 style={S.q}>Ake je obdobie?</h3>
            <div style={{display:"flex",gap:12,width:"100%"}}>
              {[{id:"s",i:"🌻",l:"Leto / Jar"},{id:"w",i:"❄️",l:"Zima / Jesen"}].map(s=>(
                <button key={s.id} style={{...S.opt,flex:1,padding:"22px 12px"}} onClick={()=>pickSeason(s.id)}>
                  <span style={{fontSize:36}}>{s.i}</span>
                  <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>{s.l}</span>
                </button>
              ))}
            </div>
            <button style={S.gh} onClick={()=>setStep("light")}>← Spat</button>
          </Cd>
        )}

        {/* ═══ NEW STEP: Last watered ═══ */}
        {step==="lastwater"&&(
          <Cd>
            <h3 style={S.q}>Kedy bola naposledy poliata?</h3>
            <p style={{fontSize:13,color:"rgba(255,255,255,.35)",textAlign:"center"}}>
              Podla toho nastavime prvu pripomienku
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
              {LAST_WATERED.map(lw=>(
                <button key={lw.id} style={S.lwBtn} onClick={()=>pickLastWatered(lw.id)}>
                  <span style={{fontSize:22}}>{lw.icon}</span>
                  <div style={{flex:1,textAlign:"left"}}>
                    <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>{lw.label}</span>
                    {lw.desc && <span style={{fontSize:11,color:"rgba(0,0,0,.4)",marginLeft:8}}>{lw.desc}</span>}
                  </div>
                </button>
              ))}
            </div>
            <button style={S.gh} onClick={()=>setStep("season")}>← Spat</button>
          </Cd>
        )}

        {step==="done"&&days&&plant&&(
          <Cd>
            <div style={S.orb} className="pl">
              <span style={{fontSize:46,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#fff",lineHeight:1}}>{days}</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,.7)"}}>dni</span>
            </div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:21,fontWeight:600,color:"#d1fae5",textAlign:"center",lineHeight:1.4}}>
              Polievaj <em>{plant.n}</em> kazdych {days} dni
            </h2>

            {/* Smart first reminder info */}
            <div style={S.nextBox}>
              <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,.5)"}}>
                {daysUntilFirst === 0
                  ? "⚠️ Treba poliat dnes! Pripomienky od zajtra."
                  : daysUntilFirst === 1
                  ? "💧 Dalšie polievanie zajtra rano o 9:00."
                  : "💧 Dalšie polievanie o " + daysUntilFirst + " dni (rano o 9:00)."}
              </p>
            </div>

            <div style={S.sum}>
              <SR i="🌿" l="Rastlina" v={plant.n}/>
              <SR i={li?.icon||""} l="Svetlo" v={li?.label||""}/>
              <SR i={season==="s"?"🌻":"❄️"} l="Obdobie" v={season==="s"?"Leto":"Zima"}/>
              <SR i="💧" l="Cyklus" v={"kazdych " + days + " dni"}/>
            </div>

            {plant.tip&&<div style={S.tipB}><span>💡</span><p style={{margin:0,fontSize:13,color:"#fef3c7",lineHeight:1.5}}>{plant.tip}</p></div>}

            {!calAdded ? (
              <button
                style={S.calBtn}
                onClick={() => {
                  downloadICS(plant.n, days, daysUntilFirst);
                  setCalAdded(true);
                }}
              >
                📅 Pridat pripomienku do kalendara
              </button>
            ) : (
              <div style={S.calDone}>
                <p style={{margin:0,fontSize:14,fontWeight:600,color:"#6ee7b7"}}>✓ Subor stiahnuty!</p>
                <p style={{margin:"6px 0 0",fontSize:12,color:"rgba(255,255,255,.4)",lineHeight:1.5}}>
                  Otvor stiahnuty .ics subor — na iPhone sa automaticky prida do Kalendara ako opakujuca sa pripomienka kazdych {days} dni.
                </p>
                <button
                  style={{...S.gh, marginTop: 8, fontSize: 12, color: "rgba(255,255,255,.35)"}}
                  onClick={() => { downloadICS(plant.n, days, daysUntilFirst); }}
                >
                  Stiahnut znova
                </button>
              </div>
            )}

            <button style={S.pri} onClick={reset}>🌱 Dalsia kvetina</button>
          </Cd>
        )}
      </div>
    </div>
  );
}

function Cd({children}){return <div style={S.card}>{children}</div>}
function SR({i,l,v}){return <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}><span style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>{i} {l}</span><span style={{fontSize:13,fontWeight:700,color:"#d1fae5"}}>{v}</span></div>}

const S = {
  root:{minHeight:"100vh",background:"linear-gradient(170deg,#051208 0%,#0e2616 45%,#071410 100%)",fontFamily:"'Nunito',sans-serif",color:"#fff",padding:"20px 16px 48px",position:"relative",overflow:"hidden"},
  h1:{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:700,margin:"2px 0",background:"linear-gradient(135deg,#6ee7b7,#d1fae5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  sub:{fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:".12em",textTransform:"uppercase"},
  wrap:{maxWidth:400,margin:"0 auto",position:"relative",zIndex:1},
  card:{background:"rgba(255,255,255,.06)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.07)",borderRadius:22,padding:"22px 18px",display:"flex",flexDirection:"column",alignItems:"center",gap:14},
  drop:{width:"100%",padding:"30px 16px",border:"2px dashed rgba(110,231,183,.2)",borderRadius:16,textAlign:"center",cursor:"pointer",background:"rgba(110,231,183,.02)"},
  prev:{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:14},
  q:{fontFamily:"'Fraunces',serif",fontSize:19,fontWeight:600,color:"#d1fae5",textAlign:"center",margin:0},
  pn:{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,color:"#d1fae5",margin:0},
  desc:{fontSize:13,color:"rgba(255,255,255,.45)",textAlign:"center",lineHeight:1.5},
  pri:{width:"100%",padding:"14px",background:"linear-gradient(135deg,#059669,#047857)",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,boxShadow:"0 4px 20px rgba(5,150,105,.3)"},
  sec:{width:"100%",padding:"12px",background:"rgba(110,231,183,.08)",color:"#6ee7b7",border:"1px solid rgba(110,231,183,.15)",borderRadius:14,fontSize:14,fontWeight:500},
  gh:{background:"none",border:"none",color:"rgba(255,255,255,.3)",fontSize:13,padding:"6px 12px"},
  opt:{display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"16px 8px",borderRadius:14,border:"1.5px solid rgba(110,231,183,.12)",background:"rgba(255,255,255,.88)"},
  inp:{width:"100%",padding:"12px 14px",borderRadius:12,border:"1px solid rgba(110,231,183,.2)",background:"rgba(255,255,255,.06)",color:"#fff",fontSize:14,outline:"none"},
  resC:{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,border:"1.5px solid rgba(110,231,183,.1)",background:"rgba(255,255,255,.88)",width:"100%",textAlign:"left"},
  lwBtn:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,border:"1.5px solid rgba(110,231,183,.12)",background:"rgba(255,255,255,.88)",width:"100%",textAlign:"left"},
  orb:{width:118,height:118,borderRadius:"50%",background:"linear-gradient(145deg,#059669,#047857)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"0 0 40px rgba(5,150,105,.35)"},
  sum:{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,.05)",borderRadius:12,border:"1px solid rgba(255,255,255,.06)"},
  tipB:{display:"flex",gap:8,alignItems:"flex-start",padding:"10px 14px",borderRadius:12,width:"100%",background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.1)"},
  nextBox:{width:"100%",padding:"10px 14px",borderRadius:12,background:"rgba(110,231,183,.06)",border:"1px solid rgba(110,231,183,.1)",textAlign:"center"},
  calBtn:{width:"100%",padding:"15px",background:"linear-gradient(135deg,#1a5276,#1e6f9f)",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,boxShadow:"0 4px 20px rgba(26,82,118,.3)"},
  calDone:{width:"100%",padding:"14px 16px",borderRadius:14,background:"rgba(110,231,183,.06)",border:"1px solid rgba(110,231,183,.12)",textAlign:"center"},
  errB:{width:"100%",padding:"10px 14px",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.18)",borderRadius:12,fontSize:13,color:"#fca5a5",textAlign:"center"},
};

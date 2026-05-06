import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const BUSES = [
  { id:1, plate:"م ن ي - ٠٤٢", model:"Toyota Hiace", totalSeats:14, availableSeats:5,
    from:"المحطة المركزية", to:"جامعة مني", price:7, distance:8.2, rating:4.3,
    driver:"أحمد محمود", status:"moving", mx:148, my:112,
    stops:["المحطة المركزية","ميدان الساعة","شارع النيل","جامعة مني"] },
  { id:2, plate:"م ن ي - ١٠٧", model:"Sprinter", totalSeats:12, availableSeats:2,
    from:"المحطة المركزية", to:"مستشفى مني", price:5, distance:5.1, rating:4.7,
    driver:"محمد سالم", status:"stopped", mx:232, my:188,
    stops:["المحطة المركزية","شارع فاروق","ميدان مصر","مستشفى مني"] },
  { id:3, plate:"م ن ي - ٢١٨", model:"Toyota Hiace", totalSeats:14, availableSeats:9,
    from:"المحطة المركزية", to:"أبو قرقاص", price:10, distance:12.5, rating:4.1,
    driver:"كريم عبدالله", status:"moving", mx:85, my:198,
    stops:["المحطة المركزية","بني مزار","مطاي","أبو قرقاص"] },
];
const ROUTES = [
  { id:1, name:"المحطة ← جامعة مني",    buses:3, active:true,  km:"8.2",  color:"#10B981" },
  { id:2, name:"المحطة ← مستشفى مني",  buses:2, active:true,  km:"5.1",  color:"#3B82F6" },
  { id:3, name:"المحطة ← أبو قرقاص",  buses:5, active:true,  km:"12.5", color:"#F59E0B" },
  { id:4, name:"المحطة ← بني مزار",   buses:1, active:false, km:"15.3", color:"#9CA3AF" },
];
const ADMIN_USERS = [
  { id:1, name:"أحمد محمود",   role:"سائق", active:true,  rating:4.3, trips:142 },
  { id:2, name:"محمد سالم",    role:"سائق", active:true,  rating:4.7, trips:98  },
  { id:3, name:"كريم عبدالله", role:"سائق", active:false, rating:4.1, trips:67  },
  { id:4, name:"سارة إبراهيم", role:"راكب", active:true,  rating:null, trips:23 },
  { id:5, name:"محمود جاد",    role:"راكب", active:true,  rating:null, trips:31 },
];
const PAST_TRIPS = [
  { id:"WS-0844", route:"المحطة ← جامعة مني",    date:"4 مايو 2026", price:7,  driver:"أحمد محمود", rating:5 },
  { id:"WS-0821", route:"المحطة ← مستشفى مني",  date:"2 مايو 2026", price:5,  driver:"محمد سالم",  rating:4 },
  { id:"WS-0790", route:"المحطة ← أبو قرقاص",  date:"29 أبريل 2026", price:10, driver:"كريم عبدالله", rating:null },
];

/* ═══════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════ */
const C = {
  p:"#006B5F", pd:"#004D45", pm:"#008878", pl:"#E0F2EF",
  a:"#F5A623", al:"#FEF3DC",
  dark:"#111827", mid:"#6B7280", light:"#9CA3AF",
  bg:"#F4F6F9", white:"#FFFFFF", border:"#E5E7EB",
  red:"#EF4444", green:"#10B981", blue:"#2563EB", purple:"#7C3AED",
  driverBlue:"#1D4ED8",
};
const F = "'Cairo', sans-serif";

/* ═══════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════ */
function Btn({label,onClick,variant="primary",full,icon,style:sx={}}) {
  const v = {
    primary:  {background:C.p,        color:C.white,  border:"none"},
    accent:   {background:C.a,        color:C.white,  border:"none"},
    outline:  {background:"transparent",color:C.p,    border:`2px solid ${C.p}`},
    ghost:    {background:C.bg,       color:C.mid,    border:`1.5px solid ${C.border}`},
    danger:   {background:C.red,      color:C.white,  border:"none"},
    light:    {background:C.pl,       color:C.p,      border:"none"},
    dblue:    {background:C.driverBlue,color:C.white,  border:"none"},
    purple:   {background:C.purple,   color:C.white,  border:"none"},
  };
  return (
    <button onClick={onClick} style={{
      ...v[variant], padding:"13px 20px", borderRadius:14,
      fontFamily:F, fontSize:15, fontWeight:700, cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
      width:full?"100%":"auto", transition:"opacity .2s", ...sx,
    }}
    onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
      {icon&&<span style={{fontSize:16}}>{icon}</span>} {label}
    </button>
  );
}

function Card({children,style:sx={},onClick}) {
  return (
    <div onClick={onClick} style={{
      background:C.white, borderRadius:18, padding:18,
      boxShadow:"0 2px 12px rgba(0,0,0,.06)",
      cursor:onClick?"pointer":"default", ...sx,
    }}>{children}</div>
  );
}

function Badge({label,color=C.p}) {
  return (
    <span style={{
      background:color+"20", color, padding:"3px 10px",
      borderRadius:20, fontSize:12, fontWeight:700, fontFamily:F,
    }}>{label}</span>
  );
}

function Stars({value=0,onChange,size=18}) {
  return (
    <div style={{display:"flex",gap:3}}>
      {[1,2,3,4,5].map(n=>(
        <span key={n} onClick={()=>onChange&&onChange(n)}
          style={{fontSize:size,color:n<=value?C.a:"#D1D5DB",cursor:onChange?"pointer":"default",
            transition:"transform .15s",transform:n<=value?"scale(1.1)":"scale(1)"}}>★</span>
      ))}
    </div>
  );
}

function StatusBar({light}) {
  return (
    <div style={{
      height:44, background:light?C.white:C.p, flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 20px", color:light?C.dark:C.white, fontSize:13, fontWeight:700, fontFamily:F,
    }}>
      <span>9:41</span>
      <span style={{fontSize:11}}>●●● WiFi 🔋</span>
    </div>
  );
}

function Header({title,onBack,action,dark,accentColor}) {
  const bg = dark?(accentColor||C.p):C.white;
  return (
    <div style={{
      height:60, background:bg, display:"flex", alignItems:"center",
      padding:"0 16px", gap:12, flexShrink:0,
      borderBottom:dark?"none":`1px solid ${C.border}`,
    }}>
      {onBack&&(
        <button onClick={onBack} style={{
          background:dark?"rgba(255,255,255,.18)":"#F3F4F6", border:"none",
          borderRadius:10, width:36, height:36, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:dark?C.white:C.dark, fontSize:16, fontFamily:F, flexShrink:0,
        }}>←</button>
      )}
      <span style={{flex:1,fontFamily:F,fontWeight:700,fontSize:17,color:dark?C.white:C.dark}}>
        {title}
      </span>
      {action}
    </div>
  );
}

function BottomNav({role,screen,navigate}) {
  const tabs = {
    passenger:[
      {id:"passengerMap",    icon:"🗺️", label:"الخريطة"},
      {id:"passengerTrips",  icon:"📋", label:"رحلاتي"},
      {id:"passengerNotif",  icon:"🔔", label:"الإشعارات"},
      {id:"passengerProfile",icon:"👤", label:"حسابي"},
    ],
    driver:[
      {id:"driverHome",     icon:"🏠", label:"الرئيسية"},
      {id:"driverRoute",    icon:"🛤️", label:"المسار"},
      {id:"driverBookings", icon:"📋", label:"الحجوزات"},
      {id:"driverProfile",  icon:"👤", label:"حسابي"},
    ],
    admin:[
      {id:"adminDashboard",icon:"📊", label:"اللوحة"},
      {id:"adminRoutes",   icon:"🛤️", label:"المسارات"},
      {id:"adminUsers",    icon:"👥", label:"المستخدمون"},
      {id:"adminSettings", icon:"⚙️", label:"الإعدادات"},
    ],
  };
  const accent = role==="driver"?C.driverBlue:role==="admin"?C.purple:C.p;
  return (
    <div style={{
      height:72, background:C.white, borderTop:`1px solid ${C.border}`,
      display:"flex", alignItems:"center", flexShrink:0,
    }}>
      {(tabs[role]||tabs.passenger).map(t=>{
        const active=screen===t.id;
        return (
          <button key={t.id} onClick={()=>navigate(t.id)} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            gap:2, border:"none", background:"none", cursor:"pointer", padding:"8px 0",
          }}>
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontFamily:F,fontSize:11,fontWeight:active?700:400,color:active?accent:C.light}}>
              {t.label}
            </span>
            {active&&<div style={{width:4,height:4,borderRadius:2,background:accent,marginTop:1}}/>}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAP SVG  (fake Minya city map)
═══════════════════════════════════════════════ */
function MapSVG({buses,onBusClick,selectedId}) {
  return (
    <svg viewBox="0 0 370 260" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width="370" height="260" fill="#E8ECF0"/>
      {/* Nile River */}
      <path d="M0,0 Q58,70 52,135 Q46,200 56,260 L0,260 Z" fill="#B3D4E8" opacity=".8"/>
      <path d="M0,0 Q42,70 40,135 Q37,200 44,260 L0,260 Z" fill="#94C4D8" opacity=".6"/>
      {/* Horizontal roads */}
      {[78,148,218].map((y,i)=>(
        <rect key={i} x="55" y={y} width="315" height={i===0?10:8} fill="white" opacity=".95"/>
      ))}
      {/* Vertical roads */}
      {[100,190,280].map((x,i)=>(
        <rect key={i} x={x} y="0" width={i===1?9:8} height="260" fill="white" opacity=".95"/>
      ))}
      {/* Road center dashes */}
      {[0,1,2,3,4].map(i=><rect key={i} x={120+i*34} y={82} width={20} height={1} fill="#D1D5DB"/>)}
      {/* Building blocks */}
      {[
        [60,5,30,70],[112,5,68,70],[200,5,72,42],[290,5,75,70],
        [60,92,30,50],[112,92,68,50],[200,92,72,50],[290,92,75,50],
        [60,160,30,52],[112,160,68,52],[200,160,72,52],[290,160,75,52],
        [60,226,30,34],[112,226,160,34],[290,226,75,34],
      ].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} rx="2"
          fill={["#D4D8DC","#CBCFD3","#D0D4D8"][i%3]}/>
      ))}
      {/* Green park patches */}
      <rect x="60" y="140" width="13" height="13" rx="2" fill="#A8D5A2"/>
      <rect x="202" y="50" width="16" height="16" rx="2" fill="#A8D5A2"/>
      {/* Route dashed line */}
      <path d="M185,150 Q168,132 148,112" stroke={C.p} strokeWidth="2.5"
        strokeDasharray="5,4" fill="none" opacity=".7"/>
      {/* User location pulse ring */}
      <circle cx="185" cy="150" r="16" fill={C.p} opacity=".12"/>
      <circle cx="185" cy="150" r="9"  fill={C.p}/>
      <circle cx="185" cy="150" r="4"  fill="white"/>
      {/* Bus markers */}
      {buses.map(b=>{
        const sel=b.id===selectedId;
        const mov=b.status==="moving";
        return (
          <g key={b.id} onClick={()=>onBusClick(b)} style={{cursor:"pointer"}}>
            {sel&&<circle cx={b.mx} cy={b.my} r={24} fill={C.p} opacity=".18"/>}
            <rect x={b.mx-19} y={b.my-15} width={38} height={28} rx="9"
              fill={sel?C.p:C.white} stroke={mov?C.green:C.a} strokeWidth="2"/>
            <text x={b.mx} y={b.my+2} textAnchor="middle" dominantBaseline="middle"
              fontSize="15" style={{userSelect:"none"}}>🚐</text>
            <text x={b.mx} y={b.my+19} textAnchor="middle" fontSize="8"
              fill={sel?C.white:C.mid} fontFamily={F} fontWeight="700">
              {b.availableSeats}
            </text>
          </g>
        );
      })}
      {/* Compass */}
      <g transform="translate(348,20)">
        <circle r="13" fill="white" opacity=".9"/>
        <text textAnchor="middle" y="-4" fontSize="9" fill={C.p} fontWeight="700"
          fontFamily={F}>N</text>
        <text textAnchor="middle" y="13" fontSize="7" fill={C.mid} fontFamily={F}>S</text>
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SPLASH
═══════════════════════════════════════════════ */
function SplashScreen({navigate}) {
  useEffect(()=>{const t=setTimeout(()=>navigate("welcome"),2200);return()=>clearTimeout(t);},[]);
  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", gap:20,
      background:`linear-gradient(160deg,${C.pd} 0%,${C.p} 60%,${C.pm} 100%)`,
    }}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes bar{from{width:0}to{width:100%}}`}</style>
      <div style={{
        width:96,height:96,background:"rgba(255,255,255,.15)",borderRadius:26,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,
        boxShadow:"0 8px 32px rgba(0,0,0,.3)",animation:"pulse 2s ease-in-out infinite",
      }}>🚐</div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:40,fontWeight:900,color:C.white,fontFamily:F,letterSpacing:1}}>وصلني</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.7)",marginTop:4,fontFamily:F}}>
          النقل الذكي بالميكروباص
        </div>
      </div>
      <div style={{
        width:160,height:4,borderRadius:2,background:"rgba(255,255,255,.25)",marginTop:20,overflow:"hidden",
      }}>
        <div style={{height:"100%",borderRadius:2,background:C.white,animation:"bar 2.2s ease forwards"}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   WELCOME
═══════════════════════════════════════════════ */
function WelcomeScreen({navigate,setRole}) {
  const roles=[
    {id:"passenger",icon:"👤",label:"راكب",   desc:"احجز مقعدك وتابع الميكروباص في الوقت الفعلي",color:C.p},
    {id:"driver",   icon:"🚐",label:"سائق",   desc:"حدّث موقعك وأدر رحلاتك وعرض الحجوزات",color:C.driverBlue},
    {id:"admin",    icon:"🛡️",label:"مشرف",   desc:"تحكم في المسارات والمستخدمين ومراقبة النظام",color:C.purple},
  ];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{
        background:`linear-gradient(160deg,${C.pd} 0%,${C.p} 100%)`,
        padding:"52px 24px 36px",textAlign:"center",flexShrink:0,
      }}>
        <div style={{fontSize:44,marginBottom:12}}>🚐</div>
        <h1 style={{margin:"0 0 8px",fontSize:28,fontWeight:900,color:C.white,fontFamily:F}}>
          أهلاً بك في وصلني
        </h1>
        <p style={{margin:0,fontSize:14,color:"rgba(255,255,255,.75)",fontFamily:F}}>
          اختر نوع حسابك للمتابعة
        </p>
      </div>
      <div style={{flex:1,background:C.bg,padding:"24px 20px",display:"flex",flexDirection:"column",gap:12,overflowY:"auto"}}>
        {roles.map(r=>(
          <button key={r.id} onClick={()=>{setRole(r.id);navigate("login");}} style={{
            background:C.white, border:`2px solid ${C.border}`, borderRadius:18,
            padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center",
            gap:16, textAlign:"right", transition:"all .2s",
            boxShadow:"0 2px 10px rgba(0,0,0,.04)",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=r.color;e.currentTarget.style.boxShadow=`0 4px 18px ${r.color}28`;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.04)";}}>
            <div style={{
              width:52,height:52,borderRadius:15,background:r.color+"14",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,
            }}>{r.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:F,fontWeight:700,fontSize:16,color:C.dark}}>{r.label}</div>
              <div style={{fontFamily:F,fontSize:13,color:C.mid,marginTop:3,lineHeight:1.4}}>{r.desc}</div>
            </div>
            <span style={{color:r.color,fontSize:18,flexShrink:0}}>←</span>
          </button>
        ))}
        <p style={{textAlign:"center",fontFamily:F,fontSize:12,color:C.light,marginTop:8}}>
          نموذج تجريبي — لا يلزم تسجيل حقيقي
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════ */
function LoginScreen({navigate,role}) {
  const map={
    passenger:{icon:"👤",title:"تسجيل دخول الراكب",dest:"passengerMap",color:C.p},
    driver:   {icon:"🚐",title:"تسجيل دخول السائق",dest:"driverHome",  color:C.driverBlue},
    admin:    {icon:"🛡️",title:"تسجيل دخول المشرف",dest:"adminDashboard",color:C.purple},
  };
  const r=map[role]||map.passenger;
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      <div style={{background:r.color,padding:"28px 24px 36px",textAlign:"center",flexShrink:0}}>
        <div style={{fontSize:36,marginBottom:10}}>{r.icon}</div>
        <h2 style={{margin:0,fontFamily:F,color:C.white,fontWeight:700,fontSize:20}}>{r.title}</h2>
      </div>
      <div style={{flex:1,background:C.bg,padding:"24px 20px",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
        <Card>
          {[
            {label:"البريد الإلكتروني",type:"email",value:"user@wasalni.app"},
            {label:"كلمة المرور",      type:"password",value:"••••••••"},
          ].map((f,i)=>(
            <div key={i} style={{marginBottom:i===0?14:0}}>
              <label style={{fontFamily:F,fontSize:13,color:C.mid,fontWeight:600,display:"block",marginBottom:6,textAlign:"right"}}>
                {f.label}
              </label>
              <input defaultValue={f.value} type={f.type} style={{
                width:"100%",padding:"13px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,
                fontFamily:F,fontSize:15,color:C.dark,background:C.bg,
                outline:"none",boxSizing:"border-box",textAlign:"right",
              }}/>
            </div>
          ))}
          <div style={{textAlign:"left",marginTop:8,marginBottom:16}}>
            <span style={{fontFamily:F,fontSize:13,color:r.color,fontWeight:600,cursor:"pointer"}}>
              نسيت كلمة المرور؟
            </span>
          </div>
          <Btn label="دخول" onClick={()=>navigate(r.dest)} full variant={role==="driver"?"dblue":role==="admin"?"purple":"primary"}/>
          <div style={{textAlign:"center",marginTop:14}}>
            <span style={{fontFamily:F,fontSize:13,color:C.mid}}>
              ليس لديك حساب؟{" "}
              <span style={{color:r.color,fontWeight:700,cursor:"pointer"}}>سجل الآن</span>
            </span>
          </div>
        </Card>
        <button onClick={()=>navigate("welcome")} style={{
          background:"none",border:`1.5px solid ${C.border}`,borderRadius:14,
          padding:"12px",fontFamily:F,fontSize:14,color:C.mid,cursor:"pointer",
        }}>← العودة لاختيار نوع الحساب</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSENGER — MAP
═══════════════════════════════════════════════ */
function PassengerMapScreen({navigate,setSelectedBus}) {
  const [selId,setSelId]=useState(null);
  const pick=(b)=>{setSelId(b.id);setSelectedBus(b);};
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      {/* Top bar */}
      <div style={{
        background:C.white,padding:"10px 16px 12px",flexShrink:0,
        boxShadow:"0 2px 8px rgba(0,0,0,.06)",
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{
            background:C.pl,padding:"6px 14px",borderRadius:20,
            fontFamily:F,fontSize:13,color:C.p,fontWeight:600,
          }}>📍 المنيا</div>
          <div style={{fontFamily:F,fontWeight:700,fontSize:18,color:C.dark}}>وصلني 🚐</div>
        </div>
        <div style={{
          background:C.bg,borderRadius:14,padding:"11px 14px",
          display:"flex",alignItems:"center",gap:10,border:`1px solid ${C.border}`,
        }}>
          <span style={{fontSize:16}}>🔍</span>
          <span style={{fontFamily:F,fontSize:14,color:C.light}}>ابحث عن وجهتك...</span>
        </div>
      </div>
      {/* Map */}
      <div style={{height:252,flexShrink:0,position:"relative",overflow:"hidden",background:"#E8ECF0"}}>
        <MapSVG buses={BUSES} onBusClick={pick} selectedId={selId}/>
        <div style={{position:"absolute",bottom:10,left:10,display:"flex",flexDirection:"column",gap:8}}>
          {["+","−"].map(s=>(
            <button key={s} style={{
              width:36,height:36,borderRadius:10,background:C.white,
              boxShadow:"0 2px 8px rgba(0,0,0,.15)",border:"none",cursor:"pointer",fontSize:18,
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>{s}</button>
          ))}
        </div>
        <button style={{
          position:"absolute",bottom:10,right:10,width:36,height:36,
          borderRadius:10,background:C.white,boxShadow:"0 2px 8px rgba(0,0,0,.15)",
          border:"none",cursor:"pointer",fontSize:16,
        }}>📍</button>
      </div>
      {/* Bus list */}
      <div style={{flex:1,overflowY:"auto",background:C.bg}}>
        <div style={{padding:"14px 16px 8px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Badge label={`${BUSES.length} ميكروباصات`}/>
          <span style={{fontFamily:F,fontWeight:700,fontSize:15,color:C.dark}}>الميكروباصات القريبة</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,padding:"0 16px 16px"}}>
          {BUSES.map(b=>(
            <button key={b.id} onClick={()=>{pick(b);navigate("busDetail");}} style={{
              background:C.white,border:`2px solid ${selId===b.id?C.p:C.border}`,
              borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"right",
              boxShadow:selId===b.id?`0 4px 16px ${C.p}20`:"0 2px 8px rgba(0,0,0,.04)",
              transition:"all .2s",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{
                  width:46,height:46,borderRadius:13,flexShrink:0,
                  background:b.status==="moving"?C.green+"14":C.a+"14",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
                }}>🚐</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                    <Badge label={b.status==="moving"?"🟢 يتحرك":"🟡 واقف"}
                      color={b.status==="moving"?C.green:C.a}/>
                    <span style={{fontFamily:F,fontWeight:700,fontSize:15,color:C.dark}}>{b.plate}</span>
                  </div>
                  <div style={{fontFamily:F,fontSize:13,color:C.mid}}>
                    {b.from} ← {b.to}
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6}}>
                    <span style={{fontFamily:F,fontWeight:700,color:C.p,fontSize:14}}>
                      {b.price} جنيه
                    </span>
                    <span style={{fontFamily:F,fontSize:13,color:C.mid}}>
                      💺 {b.availableSeats}/{b.totalSeats} متاح
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav role="passenger" screen="passengerMap" navigate={navigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSENGER — BUS DETAIL
═══════════════════════════════════════════════ */
function BusDetailScreen({navigate,bus}) {
  if(!bus){navigate("passengerMap");return null;}
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      <Header title="تفاصيل الميكروباص" onBack={()=>navigate("passengerMap")} dark/>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {/* Hero card */}
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{
              width:58,height:58,background:C.pl,borderRadius:16,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,
            }}>🚐</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:F,fontWeight:700,fontSize:19,color:C.dark}}>{bus.plate}</div>
              <div style={{fontFamily:F,fontSize:13,color:C.mid}}>{bus.model}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:5}}>
                <Stars value={Math.round(bus.rating)} size={14}/>
                <span style={{fontFamily:F,fontSize:13,color:C.mid}}>{bus.rating}</span>
              </div>
            </div>
            <Badge label={bus.status==="moving"?"🟢 يتحرك":"🟡 واقف"}
              color={bus.status==="moving"?C.green:C.a}/>
          </div>
          <div style={{display:"flex",borderTop:`1px solid ${C.border}`,paddingTop:14}}>
            {[
              {label:"السعر",  value:`${bus.price} ج`,           icon:"💰"},
              {label:"المسافة",value:`${bus.distance} كم`,        icon:"📏"},
              {label:"المقاعد",value:`${bus.availableSeats}/${bus.totalSeats}`, icon:"💺"},
            ].map((s,i)=>(
              <div key={i} style={{
                flex:1,textAlign:"center",
                borderRight:i<2?`1px solid ${C.border}`:"none",
              }}>
                <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                <div style={{fontFamily:F,fontWeight:700,fontSize:15,color:C.dark}}>{s.value}</div>
                <div style={{fontFamily:F,fontSize:11,color:C.mid}}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
        {/* Driver */}
        <Card>
          <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark,marginBottom:12,textAlign:"right"}}>
            السائق
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{
              width:46,height:46,borderRadius:23,background:C.pl,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
            }}>👤</div>
            <div>
              <div style={{fontFamily:F,fontWeight:600,fontSize:15,color:C.dark}}>{bus.driver}</div>
              <Stars value={Math.round(bus.rating)} size={13}/>
            </div>
            <button style={{
              marginLeft:"auto",background:C.p+"14",border:"none",borderRadius:10,
              padding:"8px 14px",fontFamily:F,fontSize:13,color:C.p,cursor:"pointer",fontWeight:600,
            }}>📞 اتصال</button>
          </div>
        </Card>
        {/* Route */}
        <Card>
          <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark,marginBottom:14,textAlign:"right"}}>
            خط السير
          </div>
          {bus.stops.map((stop,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:20,flexShrink:0}}>
                <div style={{
                  width:13,height:13,borderRadius:"50%",flexShrink:0,marginTop:2,
                  background:i===0?C.p:i===bus.stops.length-1?C.red:C.a,
                }}/>
                {i<bus.stops.length-1&&<div style={{width:2,height:26,background:C.border}}/>}
              </div>
              <div style={{
                fontFamily:F,fontSize:14,
                fontWeight:i===0||i===bus.stops.length-1?700:400,
                color:i===0||i===bus.stops.length-1?C.dark:C.mid,
                paddingBottom:i<bus.stops.length-1?10:0,
              }}>{stop}</div>
            </div>
          ))}
        </Card>
        <Btn label="احجز مقعدك الآن" icon="💺"
          onClick={()=>navigate("seatPicker")} full
          style={{fontSize:16,padding:"16px"}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSENGER — SEAT PICKER
═══════════════════════════════════════════════ */
function SeatPickerScreen({navigate,bus,selectedSeat,setSelectedSeat}) {
  if(!bus){navigate("passengerMap");return null;}
  const total=bus.totalSeats;
  const occupied=new Set([2,4,6,8,10,11].filter(n=>n<=total&&n<total-bus.availableSeats+1+4));
  const rows=Math.ceil(total/2);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      <Header title="اختر مقعدك" onBack={()=>navigate("busDetail")}/>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:"16px 20px"}}>
        {/* Legend */}
        <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:18,flexWrap:"wrap"}}>
          {[
            {bg:C.white,    border:C.border, label:"متاح"},
            {bg:C.p,        border:C.p,      label:"مختار",  text:C.white},
            {bg:"#F3F4F6",  border:C.border, label:"محجوز",  text:C.light},
          ].map((l,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:20,height:20,borderRadius:5,background:l.bg,border:`2px solid ${l.border}`}}/>
              <span style={{fontFamily:F,fontSize:12,color:C.mid}}>{l.label}</span>
            </div>
          ))}
        </div>
        {/* Driver panel */}
        <div style={{
          background:C.pl,borderRadius:12,padding:"10px 16px",marginBottom:18,
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          border:`1px dashed ${C.p}`,
        }}>
          <span style={{fontSize:20}}>🚗</span>
          <span style={{fontFamily:F,fontSize:14,color:C.p,fontWeight:600}}>السائق</span>
        </div>
        {/* Seats */}
        <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center",marginBottom:20}}>
          {Array.from({length:rows}).map((_,row)=>{
            const L=row*2+1, R=row*2+2;
            return (
              <div key={row} style={{display:"flex",gap:16}}>
                {[L,R].map(n=>{
                  if(n>total) return <div key={n} style={{width:66}}/>;
                  const occ=occupied.has(n);
                  const sel=selectedSeat===n;
                  return (
                    <button key={n} onClick={()=>!occ&&setSelectedSeat(sel?null:n)} style={{
                      width:66,height:58,borderRadius:13,cursor:occ?"not-allowed":"pointer",
                      background:sel?C.p:occ?"#F3F4F6":C.white,
                      border:`2px solid ${sel?C.pd:C.border}`,
                      display:"flex",flexDirection:"column",alignItems:"center",
                      justifyContent:"center",gap:2,opacity:occ?.45:1,
                      boxShadow:sel?`0 4px 14px ${C.p}40`:"0 2px 6px rgba(0,0,0,.06)",
                      transition:"all .2s",
                    }}>
                      <span style={{fontSize:20}}>💺</span>
                      <span style={{fontFamily:F,fontSize:11,fontWeight:700,
                        color:sel?C.white:occ?C.light:C.mid}}>{n}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        {selectedSeat&&(
          <Card style={{marginBottom:14,background:C.pl,border:`1px solid ${C.p}40`,padding:"14px 16px"}}>
            <div style={{textAlign:"center",fontFamily:F}}>
              <div style={{fontSize:13,color:C.mid,marginBottom:4}}>المقعد المختار</div>
              <div style={{fontSize:24,fontWeight:900,color:C.p}}>مقعد رقم {selectedSeat}</div>
              <div style={{fontSize:13,color:C.mid,marginTop:4}}>{bus.from} ← {bus.to}</div>
            </div>
          </Card>
        )}
        <Btn label={selectedSeat?"تأكيد الاختيار ←":"اختر مقعدًا أولاً"}
          onClick={()=>selectedSeat&&navigate("payment")} full
          variant={selectedSeat?"primary":"ghost"}
          style={{opacity:selectedSeat?1:.5,fontSize:15}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSENGER — PAYMENT
═══════════════════════════════════════════════ */
function PaymentScreen({navigate,bus,seat,paymentMethod,setPaymentMethod}) {
  if(!bus){navigate("passengerMap");return null;}
  const methods=[
    {id:"cash",  icon:"💵",label:"كاش"},
    {id:"card",  icon:"💳",label:"بطاقة بنكية"},
    {id:"wallet",icon:"📱",label:"محفظة إلكترونية"},
  ];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      <Header title="إتمام الدفع" onBack={()=>navigate("seatPicker")}/>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <Card>
          <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark,marginBottom:12,textAlign:"right"}}>
            ملخص الرحلة
          </div>
          {[
            {label:"المسار",      value:`${bus.from} ← ${bus.to}`},
            {label:"المقعد",      value:`رقم ${seat}`},
            {label:"المسافة",     value:`${bus.distance} كم`},
            {label:"السعر الإجمالي", value:`${bus.price} جنيه`, hl:true},
          ].map((r,i)=>(
            <div key={i} style={{
              display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"9px 0",borderBottom:i<3?`1px solid ${C.border}`:"none",
            }}>
              <span style={{fontFamily:F,fontWeight:r.hl?700:500,fontSize:15,
                color:r.hl?C.p:C.dark}}>{r.value}</span>
              <span style={{fontFamily:F,fontSize:13,color:C.mid}}>{r.label}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark,marginBottom:12,textAlign:"right"}}>
            طريقة الدفع
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {methods.map(m=>{
              const sel=paymentMethod===m.id;
              return (
                <button key={m.id} onClick={()=>setPaymentMethod(m.id)} style={{
                  background:sel?C.pl:C.bg, border:`2px solid ${sel?C.p:C.border}`,
                  borderRadius:14,padding:"13px 16px",cursor:"pointer",
                  display:"flex",alignItems:"center",gap:12,transition:"all .2s",
                }}>
                  <div style={{
                    width:42,height:42,borderRadius:12,
                    background:sel?C.p:C.border,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,
                  }}>{m.icon}</div>
                  <span style={{fontFamily:F,fontSize:15,fontWeight:600,color:C.dark,flex:1,textAlign:"right"}}>
                    {m.label}
                  </span>
                  <div style={{
                    width:20,height:20,borderRadius:10,flexShrink:0,
                    border:`2px solid ${sel?C.p:C.border}`,background:sel?C.p:"transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    {sel&&<div style={{width:8,height:8,borderRadius:4,background:C.white}}/>}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
        <Btn label={`ادفع ${bus.price} جنيه`} icon="✓"
          onClick={()=>navigate("confirm")} full variant="accent"
          style={{fontSize:16,padding:"16px"}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSENGER — CONFIRM
═══════════════════════════════════════════════ */
function ConfirmScreen({navigate,bus,seat}) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      <div style={{
        flex:1,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"24px 20px",background:C.bg,gap:20,
      }}>
        <div style={{
          width:100,height:100,borderRadius:50,background:`${C.green}18`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,
          boxShadow:`0 0 0 20px ${C.green}0C`,
        }}>✅</div>
        <div style={{textAlign:"center"}}>
          <h2 style={{margin:"0 0 8px",fontFamily:F,fontWeight:900,fontSize:26,color:C.dark}}>
            تم الحجز بنجاح!
          </h2>
          <p style={{margin:0,fontFamily:F,fontSize:14,color:C.mid,lineHeight:1.6}}>
            سيصلك إشعار عند اقتراب الميكروباص
          </p>
        </div>
        <Card style={{width:"100%"}}>
          <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark,marginBottom:12,textAlign:"right"}}>
            تفاصيل الحجز
          </div>
          {[
            {label:"رقم الحجز",       value:"WS-2026-0847"},
            {label:"المسار",          value:bus?`${bus.from} ← ${bus.to}`:"—"},
            {label:"رقم المقعد",      value:`مقعد ${seat||"—"}`},
            {label:"السائق",          value:bus?.driver||"—"},
            {label:"المبلغ المدفوع",   value:bus?`${bus.price} جنيه`:"—"},
          ].map((r,i)=>(
            <div key={i} style={{
              display:"flex",justifyContent:"space-between",
              padding:"9px 0",borderBottom:i<4?`1px solid ${C.border}`:"none",
            }}>
              <span style={{fontFamily:F,fontSize:14,fontWeight:600,color:C.dark}}>{r.value}</span>
              <span style={{fontFamily:F,fontSize:13,color:C.mid}}>{r.label}</span>
            </div>
          ))}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}>
          <Btn label="قيّم الرحلة ⭐" onClick={()=>navigate("rating")} full/>
          <Btn label="العودة للخريطة" onClick={()=>navigate("passengerMap")} full variant="ghost"/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSENGER — RATING
═══════════════════════════════════════════════ */
function RatingScreen({navigate,bus,rating,setRating,comment,setComment}) {
  const tags=["🚗 قيادة ممتازة","😊 سائق محترم","⚡ سريع","🎵 هادئ","✨ نظيف"];
  const [selTags,setSelTags]=useState(new Set());
  const toggle=t=>setSelTags(prev=>{const n=new Set(prev);n.has(t)?n.delete(t):n.add(t);return n;});
  const labels=["","سيء","مقبول","جيد","جيد جدًا","ممتاز!"];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      <Header title="تقييم الرحلة" onBack={()=>navigate("confirm")}/>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:14}}>
        <Card style={{textAlign:"center",padding:"22px 16px"}}>
          <div style={{
            width:68,height:68,borderRadius:34,background:C.pl,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:32,margin:"0 auto 10px",
          }}>👤</div>
          <div style={{fontFamily:F,fontWeight:700,fontSize:18,color:C.dark,marginBottom:4}}>
            {bus?.driver||"السائق"}
          </div>
          <div style={{fontFamily:F,fontSize:13,color:C.mid,marginBottom:18}}>
            كيف كانت الرحلة معه؟
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:10}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>setRating(n)} style={{
                fontSize:36,background:"none",border:"none",cursor:"pointer",
                color:n<=rating?C.a:"#D1D5DB",transition:"all .2s",
                transform:n<=rating?"scale(1.15)":"scale(1)",
              }}>★</button>
            ))}
          </div>
          <div style={{fontFamily:F,fontSize:15,fontWeight:700,color:C.a,minHeight:22}}>
            {labels[rating]||"اضغط على النجوم للتقييم"}
          </div>
        </Card>
        {/* Quick tags */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
          {tags.map(t=>{
            const sel=selTags.has(t);
            return (
              <button key={t} onClick={()=>toggle(t)} style={{
                background:sel?C.pl:C.white,border:`1.5px solid ${sel?C.p:C.border}`,
                borderRadius:20,padding:"7px 14px",fontFamily:F,fontSize:13,
                color:sel?C.p:C.mid,cursor:"pointer",transition:"all .2s",
              }}>{t}</button>
            );
          })}
        </div>
        {/* Comment */}
        <Card>
          <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark,marginBottom:10,textAlign:"right"}}>
            تعليق إضافي (اختياري)
          </div>
          <textarea value={comment} onChange={e=>setComment(e.target.value)}
            placeholder="اكتب تعليقك هنا..." style={{
              width:"100%",minHeight:90,padding:"12px",borderRadius:12,
              border:`1.5px solid ${C.border}`,fontFamily:F,fontSize:14,color:C.dark,
              background:C.bg,outline:"none",resize:"none",boxSizing:"border-box",textAlign:"right",
            }}/>
        </Card>
        <Btn label={rating?"إرسال التقييم ✓":"اختر تقييمًا أولاً"}
          onClick={()=>rating&&navigate("passengerMap")} full
          variant={rating?"primary":"ghost"}
          style={{opacity:rating?1:.5,fontSize:15}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSENGER — TRIPS HISTORY
═══════════════════════════════════════════════ */
function PassengerTripsScreen({navigate}) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      <Header title="رحلاتي"/>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",gap:8,marginBottom:4}}>
          {["الكل","مكتملة","ملغية"].map((t,i)=>(
            <button key={t} style={{
              padding:"8px 18px",borderRadius:20,border:"none",fontFamily:F,
              fontSize:13,fontWeight:700,cursor:"pointer",
              background:i===0?C.p:C.white,color:i===0?C.white:C.mid,
              boxShadow:"0 2px 6px rgba(0,0,0,.06)",
            }}>{t}</button>
          ))}
        </div>
        {PAST_TRIPS.map(t=>(
          <Card key={t.id} onClick={()=>navigate("passengerMap")} style={{padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{
                width:44,height:44,borderRadius:12,background:C.pl,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
              }}>🚐</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontFamily:F,fontWeight:700,color:C.p,fontSize:14}}>
                    {t.price} جنيه
                  </span>
                  <span style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark}}>
                    {t.id}
                  </span>
                </div>
                <div style={{fontFamily:F,fontSize:13,color:C.dark,marginBottom:4,textAlign:"right"}}>
                  {t.route}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  {t.rating?<Stars value={t.rating} size={13}/>:
                    <button onClick={()=>navigate("rating")} style={{
                      background:"none",border:"none",fontFamily:F,fontSize:12,
                      color:C.a,fontWeight:700,cursor:"pointer",padding:0,
                    }}>⭐ قيّم الرحلة</button>
                  }
                  <span style={{fontFamily:F,fontSize:12,color:C.mid}}>{t.date}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <BottomNav role="passenger" screen="passengerTrips" navigate={navigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PASSENGER — PROFILE
═══════════════════════════════════════════════ */
function PassengerProfileScreen({navigate}) {
  const items=[
    {icon:"📋",label:"الرحلات السابقة",    val:"3 رحلات"},
    {icon:"⭐",label:"متوسط التقييم المُعطى", val:"4.7"},
    {icon:"💰",label:"إجمالي المدفوع",     val:"22 جنيه"},
  ];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar/>
      <Header title="حسابي"/>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:14}}>
        {/* Avatar */}
        <Card style={{textAlign:"center",padding:"28px 16px"}}>
          <div style={{
            width:76,height:76,borderRadius:38,background:C.p,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:34,margin:"0 auto 14px",boxShadow:`0 4px 16px ${C.p}40`,
          }}>👤</div>
          <div style={{fontFamily:F,fontWeight:700,fontSize:18,color:C.dark}}>محمود جاد الكريم</div>
          <div style={{fontFamily:F,fontSize:13,color:C.mid,marginTop:4}}>mahmoud@wasalni.app</div>
          <Badge label="راكب نشط" color={C.green} style={{marginTop:10,display:"inline-block"}}/>
        </Card>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {items.map((s,i)=>(
            <Card key={i} style={{padding:"14px 10px",textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
              <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark}}>{s.val}</div>
              <div style={{fontFamily:F,fontSize:10,color:C.mid,marginTop:2,lineHeight:1.3}}>{s.label}</div>
            </Card>
          ))}
        </div>
        {/* Menu */}
        <Card>
          {["📍 عناوين محفوظة","💳 طرق الدفع","🔔 الإشعارات","🔒 الأمان والخصوصية"].map((item,i,arr)=>(
            <div key={i} style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"14px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",
              cursor:"pointer",
            }}>
              <span style={{color:C.mid,fontSize:14}}>←</span>
              <span style={{fontFamily:F,fontSize:14,color:C.dark}}>{item}</span>
            </div>
          ))}
        </Card>
        <Btn label="تبديل نوع الحساب" icon="🔄"
          onClick={()=>navigate("welcome")} full variant="ghost"/>
        <Btn label="تسجيل الخروج" onClick={()=>navigate("welcome")} full variant="outline"
          style={{color:C.red,borderColor:C.red+"80"}}/>
      </div>
      <BottomNav role="passenger" screen="passengerProfile" navigate={navigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DRIVER — HOME
═══════════════════════════════════════════════ */
function DriverHomeScreen({navigate,online,setOnline,tripStarted,setTripStarted}) {
  const bus=BUSES[0];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar light/>
      {/* Header */}
      <div style={{
        background:`linear-gradient(135deg,${C.driverBlue} 0%,#3B82F6 100%)`,
        padding:"20px 20px 28px",flexShrink:0,
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <button onClick={()=>setOnline(!online)} style={{
            background:online?"rgba(255,255,255,.22)":"rgba(255,255,255,.1)",
            border:`2px solid ${online?"rgba(255,255,255,.5)":"rgba(255,255,255,.2)"}`,
            borderRadius:22,padding:"8px 16px",cursor:"pointer",
            fontFamily:F,fontSize:13,fontWeight:700,color:C.white,
          }}>{online?"🟢 متصل":"⚫ غير متصل"}</button>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:F,fontWeight:700,fontSize:18,color:C.white}}>أحمد محمود</div>
            <div style={{fontFamily:F,fontSize:13,color:"rgba(255,255,255,.7)"}}>
              {bus.plate} · {bus.model}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[
            {label:"رحلات اليوم",label2:"",value:"7"},
            {label:"المكسب",    label2:"ج",value:"87"},
            {label:"تقييمي",   label2:"⭐",value:"4.3"},
          ].map((s,i)=>(
            <div key={i} style={{
              flex:1,background:"rgba(255,255,255,.16)",borderRadius:14,
              padding:"12px 8px",textAlign:"center",
            }}>
              <div style={{fontFamily:F,fontWeight:700,fontSize:18,color:C.white}}>
                {s.value}{s.label2}
              </div>
              <div style={{fontFamily:F,fontSize:11,color:"rgba(255,255,255,.75)"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {/* Trip control */}
        <Card>
          <div style={{fontFamily:F,fontWeight:700,fontSize:15,color:C.dark,textAlign:"right",marginBottom:14}}>
            الرحلة الحالية
          </div>
          <div style={{
            background:tripStarted?`${C.green}0E`:C.bg,borderRadius:12,padding:14,marginBottom:14,
            border:`1px solid ${tripStarted?C.green+"44":C.border}`,transition:"all .3s",
          }}>
            <div style={{fontFamily:F,fontSize:13,color:C.mid,textAlign:"right",marginBottom:4}}>المسار</div>
            <div style={{fontFamily:F,fontWeight:700,fontSize:15,color:C.dark,textAlign:"right"}}>
              {bus.from} → {bus.to}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{fontFamily:F,fontSize:13,color:C.mid}}>{bus.availableSeats} مقاعد متاحة</span>
              <span style={{fontFamily:F,fontSize:13,color:C.mid}}>{bus.distance} كم</span>
            </div>
            {tripStarted&&(
              <div style={{
                marginTop:10,background:`${C.green}18`,borderRadius:8,padding:"6px 12px",
                display:"flex",alignItems:"center",gap:8,
              }}>
                <div style={{width:8,height:8,borderRadius:4,background:C.green}}/>
                <span style={{fontFamily:F,fontSize:12,color:C.green,fontWeight:700}}>
                  الرحلة جارية — موقعك يُبثّ الآن
                </span>
              </div>
            )}
          </div>
          <Btn label={tripStarted?"⏹ إنهاء الرحلة":"▶ بدء الرحلة"}
            onClick={()=>setTripStarted(!tripStarted)} full
            variant={tripStarted?"danger":"dblue"} style={{fontSize:16}}/>
        </Card>
        {/* Live location */}
        <Card>
          <div style={{fontFamily:F,fontWeight:700,fontSize:15,color:C.dark,textAlign:"right",marginBottom:12}}>
            تحديث الموقع والمسار
          </div>
          <div style={{
            background:"#2563EB0D",borderRadius:12,padding:14,marginBottom:12,
            border:"1px solid #2563EB1A",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>📍</span>
              <div>
                <div style={{fontFamily:F,fontSize:13,color:C.driverBlue,fontWeight:700}}>
                  الموقع يُحدَّث تلقائيًا
                </div>
                <div style={{fontFamily:F,fontSize:11,color:C.mid}}>آخر تحديث: منذ 30 ثانية</div>
              </div>
            </div>
          </div>
          <Btn label="تغيير المسار" variant="outline" full icon="🛤️"
            style={{borderColor:C.driverBlue,color:C.driverBlue}}/>
        </Card>
        <Btn label="عرض الحجوزات 📋" onClick={()=>navigate("driverBookings")}
          full variant="ghost"/>
      </div>
      <BottomNav role="driver" screen="driverHome" navigate={navigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DRIVER — BOOKINGS
═══════════════════════════════════════════════ */
function DriverBookingsScreen({navigate}) {
  const bookings=[
    {id:1,name:"محمود أحمد",  seat:3,  from:"المحطة المركزية",to:"جامعة مني",     paid:true},
    {id:2,name:"سارة محمد",   seat:7,  from:"المحطة المركزية",to:"جامعة مني",     paid:true},
    {id:3,name:"علي حسين",    seat:10, from:"ميدان الساعة",   to:"جامعة مني",     paid:false},
  ];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar light/>
      <Header title="الحجوزات" onBack={()=>navigate("driverHome")} dark accentColor={C.driverBlue}/>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:10}}>
        {/* Summary */}
        <div style={{display:"flex",gap:10,marginBottom:4}}>
          {[
            {label:"إجمالي الحجوزات",value:"3",color:C.driverBlue},
            {label:"مدفوع",         value:"2",color:C.green},
            {label:"في الانتظار",   value:"1",color:C.a},
          ].map((s,i)=>(
            <div key={i} style={{
              flex:1,background:C.white,borderRadius:14,padding:"12px 8px",textAlign:"center",
              boxShadow:"0 2px 8px rgba(0,0,0,.05)",
            }}>
              <div style={{fontFamily:F,fontWeight:800,fontSize:22,color:s.color}}>{s.value}</div>
              <div style={{fontFamily:F,fontSize:11,color:C.mid,lineHeight:1.3}}>{s.label}</div>
            </div>
          ))}
        </div>
        {bookings.map(b=>(
          <Card key={b.id} style={{padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{
                width:46,height:46,borderRadius:23,background:`${C.driverBlue}18`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
              }}>👤</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                  <Badge label={b.paid?"✓ مدفوع":"⏳ معلق"} color={b.paid?C.green:C.a}/>
                  <span style={{fontFamily:F,fontWeight:700,fontSize:15,color:C.dark}}>{b.name}</span>
                </div>
                <div style={{fontFamily:F,fontSize:13,color:C.mid,textAlign:"right"}}>
                  مقعد {b.seat} · {b.from} → {b.to}
                </div>
              </div>
            </div>
          </Card>
        ))}
        <Card style={{background:`${C.driverBlue}0C`,border:`1px solid ${C.driverBlue}20`,padding:"14px 16px"}}>
          <div style={{fontFamily:F,fontSize:13,color:C.driverBlue,fontWeight:700,textAlign:"right",marginBottom:4}}>
            💡 تذكير
          </div>
          <div style={{fontFamily:F,fontSize:12,color:C.mid,textAlign:"right"}}>
            لديك مقعد غير مدفوع. تحقق من الراكب علي حسين (مقعد 10)
          </div>
        </Card>
      </div>
      <BottomNav role="driver" screen="driverBookings" navigate={navigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ADMIN — DASHBOARD
═══════════════════════════════════════════════ */
function AdminDashboardScreen({navigate}) {
  const stats=[
    {label:"ميكروباصات نشطة",value:"11",icon:"🚐",color:C.driverBlue},
    {label:"ركاب اليوم",     value:"847",icon:"👥",color:C.p},
    {label:"متوسط التقييم", value:"4.4 ⭐",icon:"",color:C.a},
    {label:"مسارات نشطة",   value:"4",  icon:"🛤️",color:C.purple},
  ];
  const barData=[62,78,55,90,85,70,95];
  const days=["أحد","اثن","ثلا","أرب","خمي","جمع","سبت"];
  const mx=Math.max(...barData);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar light/>
      <div style={{
        background:`linear-gradient(135deg,#4C1D95 0%,${C.purple} 100%)`,
        padding:"20px 20px 28px",flexShrink:0,
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:22}}>🔔</span>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:F,fontWeight:700,fontSize:18,color:C.white}}>لوحة التحكم</div>
            <div style={{fontFamily:F,fontSize:13,color:"rgba(255,255,255,.7)"}}>الأربعاء، 6 مايو 2026</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:14}}>
        {/* Stats grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {stats.map((s,i)=>(
            <Card key={i} style={{padding:"16px 14px"}}>
              <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
              <div style={{fontFamily:F,fontWeight:800,fontSize:22,color:s.color}}>{s.value}</div>
              <div style={{fontFamily:F,fontSize:12,color:C.mid,marginTop:2}}>{s.label}</div>
            </Card>
          ))}
        </div>
        {/* Bar chart */}
        <Card>
          <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark,textAlign:"right",marginBottom:14}}>
            الرحلات المكتملة هذا الأسبوع
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:88}}>
            {barData.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{
                  width:"100%",background:`linear-gradient(to top,#4C1D95,#A78BFA)`,
                  borderRadius:"4px 4px 0 0",height:`${(v/mx)*72}px`,transition:"height .5s",
                }}/>
                <span style={{fontFamily:F,fontSize:10,color:C.mid}}>{days[i]}</span>
              </div>
            ))}
          </div>
        </Card>
        {/* Active routes preview */}
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <button onClick={()=>navigate("adminRoutes")} style={{
              fontFamily:F,fontSize:13,color:C.purple,fontWeight:700,
              background:"none",border:"none",cursor:"pointer",
            }}>عرض الكل →</button>
            <span style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark}}>المسارات النشطة</span>
          </div>
          {ROUTES.filter(r=>r.active).map((r,i,arr)=>(
            <div key={r.id} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 0",
              borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",
            }}>
              <Badge label={`${r.buses} 🚐`} color={r.color}/>
              <span style={{fontFamily:F,fontSize:13,fontWeight:600,color:C.dark,flex:1,textAlign:"right"}}>
                {r.name}
              </span>
            </div>
          ))}
        </Card>
        {/* Alert */}
        <div style={{
          background:`${C.a}18`,borderRadius:14,padding:14,
          border:`1px solid ${C.a}40`,display:"flex",gap:12,
        }}>
          <span style={{fontSize:20,flexShrink:0}}>⚠️</span>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:F,fontWeight:700,fontSize:13,color:C.a,marginBottom:3}}>تنبيه</div>
            <div style={{fontFamily:F,fontSize:12,color:C.mid,lineHeight:1.5}}>
              مسار بني مزار لديه ميكروباص واحد فقط — يُنصح بإضافة سائق آخر
            </div>
          </div>
        </div>
      </div>
      <BottomNav role="admin" screen="adminDashboard" navigate={navigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ADMIN — ROUTES
═══════════════════════════════════════════════ */
function AdminRoutesScreen({navigate}) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar light/>
      <div style={{
        background:`linear-gradient(135deg,#4C1D95 0%,${C.purple} 100%)`,
        padding:"20px 20px 24px",flexShrink:0,
      }}>
        <div style={{fontFamily:F,fontWeight:700,fontSize:18,color:C.white,textAlign:"right"}}>المسارات</div>
        <div style={{fontFamily:F,fontSize:13,color:"rgba(255,255,255,.7)",textAlign:"right",marginTop:4}}>
          إدارة ومراقبة خطوط السير
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:10}}>
        {ROUTES.map(r=>(
          <Card key={r.id} style={{padding:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{
                width:46,height:46,borderRadius:13,background:`${r.color}18`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
              }}>🛤️</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                  <Badge label={r.active?"نشط":"متوقف"} color={r.active?C.green:C.mid}/>
                  <span style={{fontFamily:F,fontWeight:700,fontSize:14,color:C.dark}}>{r.name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontFamily:F,fontSize:12,color:C.mid}}>{r.km} كم</span>
                  <span style={{fontFamily:F,fontSize:12,color:C.mid}}>🚐 {r.buses} ميكروباص</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        <Btn label="+ إضافة مسار جديد" full variant="outline"
          style={{borderColor:C.purple,color:C.purple,marginTop:8}}/>
      </div>
      <BottomNav role="admin" screen="adminRoutes" navigate={navigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ADMIN — USERS
═══════════════════════════════════════════════ */
function AdminUsersScreen({navigate}) {
  const [filter,setFilter]=useState("الكل");
  const filtered=ADMIN_USERS.filter(u=>
    filter==="الكل"||
    (filter==="سائقون"&&u.role==="سائق")||
    (filter==="ركاب"&&u.role==="راكب")
  );
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <StatusBar light/>
      <div style={{
        background:`linear-gradient(135deg,#4C1D95 0%,${C.purple} 100%)`,
        padding:"20px 20px 24px",flexShrink:0,
      }}>
        <div style={{fontFamily:F,fontWeight:700,fontSize:18,color:C.white,textAlign:"right"}}>
          المستخدمون
        </div>
        <div style={{fontFamily:F,fontSize:13,color:"rgba(255,255,255,.7)",textAlign:"right",marginTop:4}}>
          {ADMIN_USERS.length} مستخدم مسجل
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.bg,padding:16,display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",gap:8,marginBottom:4}}>
          {["الكل","سائقون","ركاب"].map(t=>(
            <button key={t} onClick={()=>setFilter(t)} style={{
              padding:"8px 18px",borderRadius:20,border:"none",
              background:filter===t?C.purple:C.white,color:filter===t?C.white:C.mid,
              fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer",
              boxShadow:"0 2px 6px rgba(0,0,0,.06)",transition:"all .2s",
            }}>{t}</button>
          ))}
        </div>
        {filtered.map(u=>(
          <Card key={u.id} style={{padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{
                width:46,height:46,borderRadius:23,
                background:u.role==="سائق"?`${C.driverBlue}28`:`${C.purple}28`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
              }}>{u.role==="سائق"?"🚐":"👤"}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                  <Badge label={u.active?"نشط":"غير نشط"} color={u.active?C.green:C.mid}/>
                  <span style={{fontFamily:F,fontWeight:700,fontSize:15,color:C.dark}}>{u.name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  {u.rating?<Stars value={Math.round(u.rating)} size={13}/>:
                    <span style={{fontFamily:F,fontSize:11,color:C.mid}}>{u.trips} رحلة</span>}
                  <span style={{fontFamily:F,fontSize:12,color:C.mid}}>{u.role}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <BottomNav role="admin" screen="adminUsers" navigate={navigate}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════ */
export default function WasalniApp() {
  useEffect(()=>{
    if(!document.getElementById("wasalni-font")){
      const lk=document.createElement("link");
      lk.id="wasalni-font"; lk.rel="stylesheet";
      lk.href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap";
      document.head.appendChild(lk);
    }
    if(!document.getElementById("wasalni-style")){
      const st=document.createElement("style");
      st.id="wasalni-style";
      st.textContent=`*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{display:none;}`;
      document.head.appendChild(st);
    }
  },[]);

  const [screen,    setScreen]   = useState("splash");
  const [role,      setRole]     = useState(null);
  const [selBus,    setSelBus]   = useState(null);
  const [selSeat,   setSelSeat]  = useState(null);
  const [payment,   setPayment]  = useState("cash");
  const [rating,    setRating]   = useState(0);
  const [comment,   setComment]  = useState("");
  const [online,    setOnline]   = useState(false);
  const [tripOn,    setTripOn]   = useState(false);

  const nav=(s)=>setScreen(s);

  const screens={
    splash:           <SplashScreen navigate={nav}/>,
    welcome:          <WelcomeScreen navigate={nav} setRole={setRole}/>,
    login:            <LoginScreen navigate={nav} role={role}/>,
    passengerMap:     <PassengerMapScreen navigate={nav} setSelectedBus={setSelBus}/>,
    busDetail:        <BusDetailScreen navigate={nav} bus={selBus}/>,
    seatPicker:       <SeatPickerScreen navigate={nav} bus={selBus} selectedSeat={selSeat} setSelectedSeat={setSelSeat}/>,
    payment:          <PaymentScreen navigate={nav} bus={selBus} seat={selSeat} paymentMethod={payment} setPaymentMethod={setPayment}/>,
    confirm:          <ConfirmScreen navigate={nav} bus={selBus} seat={selSeat}/>,
    rating:           <RatingScreen navigate={nav} bus={selBus} rating={rating} setRating={setRating} comment={comment} setComment={setComment}/>,
    passengerTrips:   <PassengerTripsScreen navigate={nav}/>,
    passengerProfile: <PassengerProfileScreen navigate={nav}/>,
    passengerNotif:   <PassengerTripsScreen navigate={nav}/>,
    driverHome:       <DriverHomeScreen navigate={nav} online={online} setOnline={setOnline} tripStarted={tripOn} setTripStarted={setTripOn}/>,
    driverBookings:   <DriverBookingsScreen navigate={nav}/>,
    driverRoute:      <DriverHomeScreen navigate={nav} online={online} setOnline={setOnline} tripStarted={tripOn} setTripStarted={setTripOn}/>,
    driverProfile:    <PassengerProfileScreen navigate={nav}/>,
    adminDashboard:   <AdminDashboardScreen navigate={nav}/>,
    adminRoutes:      <AdminRoutesScreen navigate={nav}/>,
    adminUsers:       <AdminUsersScreen navigate={nav}/>,
    adminSettings:    <AdminDashboardScreen navigate={nav}/>,
  };

  const currentRole=role||"passenger";
  const flowLabel={passenger:"تدفق الراكب",driver:"تدفق السائق",admin:"تدفق المشرف"}[currentRole];
  const flowColor={passenger:C.p,driver:C.driverBlue,admin:C.purple}[currentRole];

  return (
    <div style={{
      minHeight:"100vh", fontFamily:F,
      background:`linear-gradient(160deg,${C.pd} 0%,${C.p} 55%,${C.pm} 100%)`,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"24px 16px", gap:16,
    }}>
      {/* Flow indicator */}
      {role&&(
        <div style={{
          background:"rgba(255,255,255,.15)",borderRadius:24,padding:"8px 20px",
          display:"flex",alignItems:"center",gap:10,
        }}>
          <span style={{
            width:10,height:10,borderRadius:5,background:C.white,display:"inline-block",
          }}/>
          <span style={{fontFamily:F,fontSize:13,fontWeight:700,color:C.white}}>
            {flowLabel}
          </span>
          <button onClick={()=>nav("welcome")} style={{
            background:"rgba(255,255,255,.2)",border:"none",borderRadius:12,
            padding:"4px 12px",fontFamily:F,fontSize:12,color:C.white,cursor:"pointer",
            marginLeft:8,
          }}>تبديل ←</button>
        </div>
      )}

      {/* Phone frame */}
      <div style={{
        width:390, height:844, background:C.bg, borderRadius:52,
        overflow:"hidden", border:"10px solid #1A1E2E",
        boxShadow:"0 48px 96px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08)",
        display:"flex", flexDirection:"column", position:"relative", flexShrink:0,
      }}>
        {screens[screen]||screens.passengerMap}
      </div>

      {/* Screen breadcrumbs / quick nav */}
      <div style={{
        background:"rgba(255,255,255,.12)",borderRadius:16,padding:"10px 16px",
        display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",maxWidth:440,
      }}>
        {Object.keys(screens).filter(s=>!["splash","welcome","login",
          "passengerNotif","driverRoute","driverProfile","adminSettings"].includes(s)).map(s=>(
          <button key={s} onClick={()=>nav(s)} style={{
            background:screen===s?"rgba(255,255,255,.35)":"rgba(255,255,255,.1)",
            border:screen===s?"1.5px solid rgba(255,255,255,.6)":"1px solid rgba(255,255,255,.15)",
            borderRadius:8,padding:"4px 10px",fontFamily:F,fontSize:11,
            color:C.white,cursor:"pointer",transition:"all .15s",fontWeight:screen===s?700:400,
          }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

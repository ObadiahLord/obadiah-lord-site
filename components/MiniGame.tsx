'use client'

import { useEffect, useRef } from 'react'

const W = 800
const H = 260
const DISPLAY_FONT = '"Agentic", "Bodoni 72", "Didot", "Baskerville", "Times New Roman", serif'
const READABLE_FONT = '"Baskerville", "Iowan Old Style", "Palatino", "Times New Roman", serif'
const GROUND = H - 44
const RX = 72
const RW = 22
const RH = 34
const GRAVITY = 0.58
const JUMP_V = -13.5

// Levels — dramatic speed jumps each tier
const LEVELS = [
  { score: 0,    speed: 5,  interval: 72, label: 'LEVEL 1 · CLEARANCE BASIC'   },
  { score: 900,  speed: 7,  interval: 62, label: 'LEVEL 2 · CLEARANCE MEDIUM'  },
  { score: 1800, speed: 9,  interval: 50, label: 'LEVEL 3 · CLEARANCE HIGH'    },
  { score: 2700, speed: 12, interval: 40, label: 'LEVEL 4 · CLEARANCE MAXIMUM' },
  { score: 3600, speed: 16, interval: 30, label: 'LEVEL 5 · CLASSIFIED ACCESS' },
  { score: 4800, speed: 22, interval: 22, label: 'LEVEL 6 · GHOST PROTOCOL'    },
]

const getLvl = (score: number) => {
  let l = LEVELS[0]
  for (const lvl of LEVELS) { if (score >= lvl.score) l = lvl }
  return l
}
const getLvlIdx = (score: number) => {
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) { if (score >= LEVELS[i].score) idx = i }
  return idx
}

// Ground obstacles — jump OVER
const GOBS = [
  { label: 'CAPTCHA',     w: 18, h: 26, min: 0    },
  { label: 'RATE LIMIT',  w: 22, h: 20, min: 0    },
  { label: 'FIREWALL',    w: 16, h: 46, min: 0    },
  { label: 'CLOUDFLARE',  w: 30, h: 34, min: 300  },
  { label: '2FA',         w: 20, h: 32, min: 250  },
  { label: '403',         w: 26, h: 24, min: 400  },
  { label: 'TIMEOUT',     w: 18, h: 38, min: 500  },
  { label: 'ANTI-BOT',    w: 24, h: 44, min: 700  },
  { label: 'COOKIE',      w: 28, h: 28, min: 600  },
  { label: 'SSL ERR',     w: 20, h: 36, min: 900  },
]

// Aerial zones:
//  LOW  (y = GROUND-62):  you MUST jump — flies just at head level on ground
//  MID  (y = GROUND-108): stay grounded — mid-jump zone
//  HIGH (y = GROUND-152): tricky — hits during descent at wrong timing
//  WAVE: oscillates up and down
const AOBS = [
  { label: 'CLOUDFLARE', w: 36, h: 26, zone: 'MID',  min: 250  },
  { label: 'IP BAN',     w: 28, h: 20, zone: 'LOW',  min: 400  },
  { label: 'HONEYPOT',   w: 26, h: 22, zone: 'HIGH', min: 600  },
  { label: 'BOT SHIELD', w: 32, h: 24, zone: 'MID',  min: 800  },
  { label: 'WAF',        w: 30, h: 20, zone: 'WAVE', min: 1000 },
  { label: '429',        w: 22, h: 18, zone: 'LOW',  min: 600  },
  { label: 'OAUTH WALL', w: 38, h: 26, zone: 'MID',  min: 1100 },
]

const ZONE_Y: Record<string, number> = {
  LOW:  GROUND - 62,
  MID:  GROUND - 108,
  HIGH: GROUND - 152,
  WAVE: GROUND - 100,
}

const STATUSES = [
  'INFILTRATING TARGET SYSTEM...',
  'BYPASSING AUTHENTICATION LAYER',
  'NAVIGATING HOSTILE ENVIRONMENT',
  'DECRYPTING ACCESS TOKENS',
  'EXECUTING MULTI-STEP MISSION',
  'SCANNING FOR ATTACK VECTORS',
  'AGENT AXLE OPERATIONAL',
  'READING SCREEN CONTEXT...',
  'ADAPTING TO COUNTERMEASURES',
  'MISSION CRITICAL — STAY ON TARGET',
]

type Obs = {
  x: number; w: number; h: number; label: string
  aerial: boolean; oy: number; zone: string; spin: number; wave: number
}
type Particle = { x: number; y: number; vy: number; vx: number; alpha: number; size: number }
type Drop    = { x: number; y: number; char: string; alpha: number; speed: number }

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const g = useRef({
    phase:      'idle' as 'idle' | 'running' | 'dead',
    y:          GROUND - RH,
    vy:         0,
    frame:      0,
    score:      0,
    ops:        0,
    lvlIdx:     0,
    lvlFlash:   0,
    obstacles:  [] as Obs[],
    particles:  [] as Particle[],
    drops:      [] as Drop[],
    statusIdx:  0,
    statusTimer:0,
    legPhase:   0,
    flashAlpha: 0,
    lvlWhite:   0,
    blink:      true,
    blinkTimer: 0,
    killerLabel:'',
  })
  const raf = useRef(0)

  const reset = () => {
    const s = g.current
    Object.assign(s, {
      phase:'running', y:GROUND-RH, vy:0, frame:0, score:0, ops:0,
      lvlIdx:0, lvlFlash:0, lvlWhite:0, obstacles:[], particles:[], flashAlpha:0, killerLabel:'',
    })
  }

  const jump = () => {
    const s = g.current
    if (s.phase !== 'running') { reset(); return }
    if (s.y >= GROUND - RH - 2) s.vy = JUMP_V
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const s      = g.current

    for (let i = 0; i < 55; i++)
      s.drops.push({ x:Math.random()*W, y:Math.random()*H, char:Math.random()>.5?'1':'0', alpha:.03+Math.random()*.05, speed:.15+Math.random()*.4 })

    const drawAgent = (x: number, y: number, leg: number, run: boolean) => {
      const ink='#0A0A0A', pp='#F9F9F9'
      // coat
      ctx.fillStyle=ink; ctx.fillRect(x-3, y+Math.floor(RH*.55), RW+6, RH-Math.floor(RH*.55))
      // legs
      const lL=run?(Math.sin(leg)>0?9:3):6, rL=run?(Math.sin(leg)<0?9:3):6
      ctx.fillRect(x+1,y+RH,7,lL); ctx.fillRect(x+RW-8,y+RH,7,rL)
      // body
      ctx.fillStyle=ink; ctx.fillRect(x,y,RW,RH)
      // tie
      ctx.fillStyle=pp; ctx.fillRect(x+RW/2-2,y+2,4,Math.floor(RH*.55)-2)
      ctx.fillStyle=ink; ctx.fillRect(x+RW/2-1,y+2,2,Math.floor(RH*.55)-2)
      // badge
      ctx.fillStyle=pp; ctx.fillRect(x+2,y+4,7,5); ctx.fillStyle=ink; ctx.fillRect(x+3,y+5,5,3)
      // head
      const hW=RW+2,hH=14,hX=x-1,hY=y-hH-2
      ctx.fillStyle=ink; ctx.fillRect(hX,hY,hW,hH)
      ctx.fillStyle=pp;  ctx.fillRect(hX+2,hY+4,hW-4,4)
      ctx.fillStyle='rgba(10,10,10,0.5)'; ctx.fillRect(hX+2,hY+4,Math.floor((hW-4)/2)-1,4)
      // fedora
      ctx.fillStyle=ink; ctx.fillRect(hX-5,hY-4,hW+10,4); ctx.fillRect(hX,hY-13,hW,10)
      ctx.fillStyle=pp;  ctx.fillRect(hX,hY-6,hW,2)
    }

    const drawAerialObs = (o: Obs) => {
      const cx=o.x+o.w/2, cy=o.oy+o.h/2
      if (o.label==='CLOUDFLARE') {
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(o.spin)
        ctx.fillStyle='#0A0A0A'
        ctx.beginPath(); ctx.moveTo(0,-13); ctx.lineTo(11,-8); ctx.lineTo(11,5)
        ctx.lineTo(0,13); ctx.lineTo(-11,5); ctx.lineTo(-11,-8); ctx.closePath(); ctx.fill()
        ctx.fillStyle='#F9F9F9'; ctx.font=`bold 7px ${READABLE_FONT}`; ctx.textAlign='center'
        ctx.fillText('CF',0,3); ctx.restore()
        return
      }
      ctx.fillStyle='#0A0A0A'; ctx.fillRect(o.x,o.oy,o.w,o.h)
      // dashed drop line
      ctx.setLineDash([3,4]); ctx.strokeStyle='rgba(10,10,10,0.1)'; ctx.lineWidth=1
      ctx.beginPath(); ctx.moveTo(cx,o.oy+o.h); ctx.lineTo(cx,GROUND); ctx.stroke(); ctx.setLineDash([])
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(-Math.PI/2)
      ctx.fillStyle='rgba(249,249,249,0.75)'; ctx.font=`bold 7px ${READABLE_FONT}`
      ctx.textAlign='center'; ctx.fillText(o.label,0,3); ctx.restore()
    }

    const spawnObstacle = () => {
      const lvl    = getLvl(s.score)
      const ugobs  = GOBS.filter(t=>s.score>=t.min)
      const uaobs  = AOBS.filter(t=>s.score>=t.min)
      const aerialChance = Math.min(0.52, (s.score/600))

      if (uaobs.length && Math.random()<aerialChance) {
        const t = uaobs[Math.floor(Math.random()*uaobs.length)]
        const oy = ZONE_Y[t.zone]
        s.obstacles.push({x:W+10,w:t.w,h:t.h,label:t.label,aerial:true,oy,zone:t.zone,spin:0,wave:0})
      } else {
        const t = ugobs[Math.floor(Math.random()*ugobs.length)]
        s.obstacles.push({x:W+10,w:t.w,h:t.h,label:t.label,aerial:false,oy:GROUND-t.h,zone:'',spin:0,wave:0})
        // double obstacle at higher levels
        if (s.score>500 && Math.random()<0.32) {
          const t2=ugobs[Math.floor(Math.random()*ugobs.length)]
          s.obstacles.push({x:W+10+t.w+20,w:t2.w,h:t2.h,label:t2.label,aerial:false,oy:GROUND-t2.h,zone:'',spin:0,wave:0})
        }
        // triple at extreme levels
        if (s.score>1400 && Math.random()<0.22) {
          const t3=ugobs[Math.floor(Math.random()*ugobs.length)]
          const t2=ugobs[Math.floor(Math.random()*ugobs.length)]
          const gap=t.w+20
          s.obstacles.push({x:W+10+gap+t2.w+20,w:t3.w,h:t3.h,label:t3.label,aerial:false,oy:GROUND-t3.h,zone:'',spin:0,wave:0})
        }
      }
    }

    const tick = () => {
      ctx.clearRect(0,0,W,H)
      ctx.fillStyle='#F9F9F9'; ctx.fillRect(0,0,W,H)

      // binary rain
      ctx.font=`10px ${READABLE_FONT}`
      for (const d of s.drops) {
        d.y+=d.speed
        if(d.y>H){d.y=-10;d.x=Math.random()*W;d.char=Math.random()>.5?'1':'0'}
        ctx.fillStyle=`rgba(10,10,10,${d.alpha})`; ctx.fillText(d.char,d.x,d.y)
      }

      // ground grid
      ctx.fillStyle='rgba(10,10,10,0.05)'
      for(let gx=0;gx<W;gx+=28) ctx.fillRect(gx,GROUND+1,1,H-GROUND)
      ctx.fillStyle='rgba(10,10,10,0.11)'; ctx.fillRect(0,GROUND,W,1)

      // header
      ctx.fillStyle='rgba(10,10,10,0.06)'; ctx.fillRect(10,6,148,34)
      ctx.fillStyle='rgba(10,10,10,0.13)'; ctx.fillRect(10,6,148,1)
      ctx.font=`bold 14px ${DISPLAY_FONT}`; ctx.fillStyle='rgba(10,10,10,0.8)'
      ctx.fillText('AGENT AXLE',16,22)
      ctx.font=`9px ${READABLE_FONT}`; ctx.fillStyle='rgba(10,10,10,0.32)'
      ctx.fillText('CLASSIFIED · AXIS LABS',16,35)
      // blink
      s.blinkTimer++
      if(s.blinkTimer>26){s.blink=!s.blink;s.blinkTimer=0}
      if(s.blink){ctx.fillStyle='rgba(10,10,10,0.6)';ctx.fillRect(108,10,2,13)}

      // level banner
      const curLvl = getLvl(s.score)
      ctx.font=`9px ${READABLE_FONT}`; ctx.textAlign='center'
      ctx.fillStyle='rgba(10,10,10,0.25)'
      ctx.fillText(curLvl.label, W/2, 14)
      ctx.textAlign='left'

      // level-up: white camera burst
      if(s.lvlWhite>0){
        ctx.fillStyle=`rgba(249,249,249,${s.lvlWhite})`
        ctx.fillRect(0,0,W,H)
        s.lvlWhite=Math.max(0,s.lvlWhite-0.07)
      }
      // level-up: dark overlay + big text
      if(s.lvlFlash>0){
        ctx.fillStyle=`rgba(10,10,10,${Math.min(s.lvlFlash*0.72,0.78)})`
        ctx.fillRect(0,0,W,H)
        // pulsing border frame
        ctx.strokeStyle=`rgba(249,249,249,${s.lvlFlash*0.9})`
        ctx.lineWidth=5
        ctx.strokeRect(5,5,W-10,H-10)
        ctx.textAlign='center'
        // eyebrow
        ctx.font=`bold 10px ${READABLE_FONT}`
        ctx.fillStyle=`rgba(249,249,249,${s.lvlFlash*0.55})`
        ctx.fillText('◉  CLEARANCE UPGRADED  ◉',W/2,H/2-34)
        // big level name
        ctx.font=`bold 34px ${DISPLAY_FONT}`
        ctx.fillStyle=`rgba(249,249,249,${s.lvlFlash})`
        ctx.fillText(curLvl.label,W/2,H/2+8)
        // speed callout
        ctx.font=`10px ${READABLE_FONT}`
        ctx.fillStyle=`rgba(249,249,249,${s.lvlFlash*0.45})`
        ctx.fillText(`SPEED ×${curLvl.speed}  ·  THREAT DENSITY INCREASED`,W/2,H/2+32)
        ctx.textAlign='left'
        s.lvlFlash=Math.max(0,s.lvlFlash-0.011)
      }

      if(s.phase==='idle'){
        drawAgent(RX,s.y,0,false)
        ctx.textAlign='center'
        ctx.font=`bold 12px ${READABLE_FONT}`; ctx.fillStyle='rgba(10,10,10,0.52)'
        ctx.fillText('[ SPACE OR CLICK TO BEGIN MISSION ]',W/2,H/2+14)
        ctx.font=`10px ${READABLE_FONT}`; ctx.fillStyle='rgba(10,10,10,0.22)'
        ctx.fillText('Jump OVER ground blocks · stay GROUNDED under mid-air threats',W/2,H/2+32)
        ctx.textAlign='left'
        raf.current=requestAnimationFrame(tick); return
      }

      if(s.phase==='running'){
        s.vy+=GRAVITY; s.y+=s.vy
        if(s.y>=GROUND-RH){s.y=GROUND-RH;s.vy=0}
        s.legPhase+=0.3

        // level up check
        const newIdx=getLvlIdx(s.score)
        if(newIdx>s.lvlIdx){s.lvlIdx=newIdx;s.lvlFlash=1.0;s.lvlWhite=1.0}

        const lvl=getLvl(s.score)
        if(s.frame>0 && s.frame%lvl.interval===0) spawnObstacle()

        s.obstacles.forEach(o=>{
          o.x-=lvl.speed
          if(o.label==='CLOUDFLARE') o.spin+=0.05
          if(o.zone==='WAVE') o.oy=ZONE_Y.WAVE+Math.sin(o.wave)*28; o.wave+=0.06
        })
        s.obstacles=s.obstacles.filter(o=>o.x>-60)

        // foot dust
        if(s.y>=GROUND-RH-1&&s.frame%5===0)
          s.particles.push({x:RX+RW/2,y:GROUND,vy:-0.6-Math.random(),vx:-0.5+Math.random(),alpha:.3,size:2+Math.random()*2})

        // collision
        for(const o of s.obstacles){
          const agentTop = s.y - 16 // top of head
          const hit = o.aerial
            ? (RX+RW>o.x && RX<o.x+o.w && agentTop<o.oy+o.h && s.y+RH>o.oy)
            : (RX+RW-5>o.x+3 && RX+5<o.x+o.w-3 && s.y+RH-3>o.oy+3)
          if(hit){
            s.phase='dead'; s.killerLabel=o.label; s.flashAlpha=0.45
            for(let i=0;i<18;i++){
              const a=(Math.PI*2*i)/18
              s.particles.push({x:RX+RW/2,y:s.y+RH/2,vy:Math.sin(a)*(2+Math.random()*3),vx:Math.cos(a)*(2+Math.random()*3),alpha:.9,size:2+Math.random()*4})
            }
          }
        }

        s.statusTimer++
        if(s.statusTimer>70){s.statusIdx=(s.statusIdx+1)%STATUSES.length;s.statusTimer=0}
        s.score++; s.ops=Math.floor(s.score/6); s.frame++
      }

      // particles
      for(const p of s.particles){p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.alpha-=0.02
        if(p.alpha>0){ctx.fillStyle=`rgba(10,10,10,${p.alpha})`;ctx.fillRect(p.x,p.y,p.size,p.size)}}
      s.particles=s.particles.filter(p=>p.alpha>0)

      // draw obstacles
      for(const o of s.obstacles){
        if(o.aerial){ drawAerialObs(o) }
        else{
          ctx.fillStyle='#0A0A0A'; ctx.fillRect(o.x,o.oy,o.w,o.h)
          ctx.save(); ctx.translate(o.x+o.w/2,o.oy+o.h/2); ctx.rotate(-Math.PI/2)
          ctx.fillStyle='rgba(249,249,249,0.7)'; ctx.font=`bold 7px ${READABLE_FONT}`
          ctx.textAlign='center'; ctx.fillText(o.label,0,3); ctx.restore()
        }
      }

      drawAgent(RX,s.y,s.legPhase,s.phase==='running')

      // status bar
      ctx.font=`10px ${READABLE_FONT}`; ctx.fillStyle='rgba(10,10,10,0.25)'
      ctx.fillText('> '+STATUSES[s.statusIdx],16,H-12)

      // OPS
      ctx.font=`bold 12px ${READABLE_FONT}`; ctx.fillStyle='rgba(10,10,10,0.55)'
      ctx.textAlign='right'; ctx.fillText('OPS '+String(s.ops).padStart(5,'0'),W-16,22)
      ctx.textAlign='left'

      if(s.flashAlpha>0){
        ctx.fillStyle=`rgba(10,10,10,${s.flashAlpha})`
        ctx.fillRect(0,0,W,H); s.flashAlpha-=0.02
      }

      if(s.phase==='dead'){
        ctx.textAlign='center'
        ctx.font=`bold 15px ${DISPLAY_FONT}`; ctx.fillStyle='rgba(10,10,10,0.88)'
        ctx.fillText('// MISSION COMPROMISED //',W/2,H/2-14)
        if(s.killerLabel){
          ctx.font=`10px ${READABLE_FONT}`; ctx.fillStyle='rgba(10,10,10,0.45)'
          ctx.fillText('BLOCKED BY: '+s.killerLabel,W/2,H/2+4)
        }
        ctx.font=`11px ${READABLE_FONT}`; ctx.fillStyle='rgba(10,10,10,0.32)'
        ctx.fillText('[ SPACE OR CLICK TO REDEPLOY ]',W/2,H/2+22)
        ctx.textAlign='left'
      }

      raf.current=requestAnimationFrame(tick)
    }

    tick()
    const onKey=(e:KeyboardEvent)=>{if(e.code==='Space'){e.preventDefault();jump()}}
    window.addEventListener('keydown',onKey)
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener('keydown',onKey)}
  },[])

  return (
    <section className="relative py-24">
      <div className="font-label mb-5 px-5 text-[11px] text-silver md:px-[110px]">Mission briefing</div>
      <div className="select-none w-full" style={{cursor:'pointer'}} onClick={jump}>
        <canvas ref={canvasRef} width={W} height={H} className="block h-auto w-full"
          style={{border:'1px solid rgba(10,10,10,0.07)'}} />
      </div>
      <p className="mt-3 px-5 md:px-[110px] text-[11px] tracking-wide text-ink/35">
        Jump over ground threats · stay grounded under mid-air ones · 6 levels · speed doubles each tier
      </p>
    </section>
  )
}

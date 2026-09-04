'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, ChevronRight, Gamepad2, Menu, Play, Sparkles, Trophy, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const consoles = [
  { name: 'PlayStation 5', type: 'Console', tag: 'PS5', detail: '4K / 120 FPS', color: 'cyan', icon: '◒', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80' },
  { name: 'Xbox Series X', type: 'Console', tag: 'XBOX', detail: 'Quick Resume', color: 'lime', icon: '✕', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80' },
  { name: 'Nintendo Switch', type: 'Console', tag: 'SWITCH', detail: 'Party mode', color: 'coral', icon: '◉', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80' },
  { name: 'PC Battlestation', type: 'PC', tag: 'RTX 4080', detail: '240Hz OLED', color: 'violet', icon: '▣', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80' },
  { name: 'Steam Deck', type: 'Handheld', tag: 'DECK', detail: 'Take it anywhere', color: 'amber', icon: '▰', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80' },
  { name: 'PlayStation 4 Pro', type: 'Console', tag: 'PS4 PRO', detail: '4K HDR Gaming', color: 'cyan', icon: '◐', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80' },
  { name: 'Xbox One X', type: 'Console', tag: 'XBOX ONE', detail: '4K Enhanced', color: 'lime', icon: '◫', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80' },
  { name: 'Nintendo Switch OLED', type: 'Handheld', tag: 'OLED', detail: 'Vivid Display', color: 'coral', icon: '◍', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80' },
  { name: 'Gaming Laptop', type: 'PC', tag: 'RTX 4070', detail: 'Portable Power', color: 'violet', icon: '▢', image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80' },
  { name: 'ROG Ally', type: 'Handheld', tag: 'ASUS', detail: 'Windows Gaming', color: 'amber', icon: '▰', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80' },
]

const games = [
  { title: 'Minecraft', meta: 'SANDBOX · 1–4 PLAYERS', mark: 'MC', color: 'gold', image: '/games/Minecraft.jpg' },
  { title: 'Call of Duty', meta: 'SHOOTER · 1–4 PLAYERS', mark: 'COD', color: 'red', image: '/games/Call Of Duty.jpg' },
  { title: 'Valorant', meta: 'TACTICAL · 1–5 PLAYERS', mark: 'VAL', color: 'blue', image: '/games/valorant.jpg' },
  { title: 'Apex Legends', meta: 'BATTLE ROYALE · 1–3 PLAYERS', mark: 'APEX', color: 'green', image: '/games/Apex.jpg' },
  { title: 'Fortnite', meta: 'BATTLE ROYALE · 1–4 PLAYERS', mark: 'FN', color: 'violet', image: '/games/fortnite.jpg' },
  { title: 'GTA V', meta: 'OPEN WORLD · 1–4 PLAYERS', mark: 'GTA', color: 'cyan', image: '/games/gta.jpg' },
]

const racingSetups = [
  { name: 'Racing Wheel', type: 'Wheel', tag: 'STEERING', detail: 'Force Feedback', color: 'cyan', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80' },
  { name: 'Pedal Set', type: 'Pedals', tag: 'BRAKE', detail: 'Gas + Brake + Clutch', color: 'lime', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80' },
  { name: 'Gear Shifter', type: 'Shifter', tag: 'H-PATTERN', detail: '6-Speed Manual', color: 'violet', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80' },
  { name: 'Handbrake', type: 'Brake', tag: 'E-BRAKE', detail: 'Rally Drift', color: 'coral', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80' },
  { name: 'Button Box', type: 'Controls', tag: 'PRO BOX', detail: 'Custom Controls', color: 'amber', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80' },
]

export default function Page() {
  const [filter, setFilter] = useState('All gear')
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [booked, setBooked] = useState(false)
  const visible = filter === 'All gear' ? consoles : consoles.filter((item) => item.type === filter)

  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="scanlines" aria-hidden="true" />
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Go to top"><span className="brand-mark">G</span> GAME<span className="brand-slash">//</span>ROOM</button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <button onClick={() => scrollTo('gear')}>The gear</button><button onClick={() => scrollTo('games')}>Play now</button><button onClick={() => scrollTo('racing')}>Racing Sim</button><button onClick={() => scrollTo('space')}>The space</button><button onClick={() => scrollTo('events')}>Events</button>
        </nav>
        <Button className="header-cta" onClick={() => setBookingOpen(true)}>Book a session <ArrowUpRight data-icon="inline-end" /></Button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section id="top" className="hero section-wrap">
        <div className="hero-copy reveal-up">
          <div className="eyebrow"><span className="live-dot" /> THE CITY&apos;S PLAYGROUND · EST. 2024</div>
          <h1>PLAY<br /><em>LOUDER.</em></h1>
          <p className="hero-lede">A physical gaming hub built for big wins, chaotic couch co-op, and the kind of nights you don&apos;t want to end.</p>
          <div className="hero-actions"><Button size="lg" onClick={() => setBookingOpen(true)}>Book your session <CalendarDays data-icon="inline-end" /></Button><button className="text-link" onClick={() => scrollTo('space')}>Explore the room <ChevronRight /></button></div>
          <div className="hero-stats"><div><strong>24</strong><span>PLAY STATIONS</span></div><div><strong>120+</strong><span>GAMES READY</span></div><div><strong>07</strong><span>NIGHTS A WEEK</span></div></div>
        </div>
        <div className="hero-art" aria-label="Person playing video games" role="img">
          <Image 
            src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&q=85" 
            alt="Gaming setup with person playing"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-art-overlay"></div>
          <div className="art-label">01 / MAIN FLOOR</div>
        </div>
      </section>

      <section className="ticker" aria-label="Venue updates"><div className="ticker-track"><span><Zap /> OPEN LATE · WALK-INS WELCOME</span><span><Sparkles /> NEW DROP: SILENT HILL 2</span><span><Trophy /> WEEKLY TOURNAMENTS</span><span><Gamepad2 /> 24 STATIONS ONLINE</span><span><Zap /> OPEN LATE · WALK-INS WELCOME</span></div></section>

      <section id="gear" className="content-section section-wrap"><div className="section-heading"><div><div className="eyebrow">01 / LOADOUT</div><h2>YOUR NEXT<br /><span>MAIN CHARACTER.</span></h2></div><p>Top-tier hardware, tuned for the win. Pick your poison and settle in.</p></div><div className="filter-row" role="group" aria-label="Filter equipment">{['All gear', 'Console', 'PC', 'Handheld'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="console-grid">{visible.map((item, i) => <article className={`console-card ${item.color}`} key={item.name}><div className="card-top"><span className="card-index">0{i + 1}</span><span className="card-tag">{item.tag}</span></div><div className="console-visual" style={{ position: 'relative', overflow: 'hidden' }}><Image src={item.image} alt={item.name} width={200} height={150} style={{ objectFit: 'contain', opacity: 0.8 }} /><div className="orbit orbit-one" /><div className="orbit orbit-two" /></div><div className="card-bottom"><div><h3>{item.name}</h3><p>{item.detail}</p></div><ArrowUpRight /></div></article>)}</div></section>

      <section id="games" className="content-section games-section"><div className="section-wrap"><div className="section-heading"><div><div className="eyebrow">02 / THE LIBRARY</div><h2>ALL KILLER.<br /><span>NO FILLER.</span></h2></div><p>From button-mashers to 80-hour epics, the shelf is stacked with your next obsession.</p></div><div className="games-grid">{games.map((game, i) => <article className={`game-card game-${game.color}`} key={game.title}><Image src={game.image} alt={game.title} fill style={{ objectFit: 'cover' }} /><div className="game-mark">{game.mark}</div><div className="game-overlay"><span>0{i + 1}</span><Play fill="currentColor" /></div><div className="game-info"><h3>{game.title}</h3><p>{game.meta}</p></div></article>)}</div><Link href="/games-library"><button className="view-all">See the full library <ArrowUpRight /></button></Link></div></section>

      <section id="racing" className="content-section section-wrap"><div className="section-heading"><div><div className="eyebrow">03 / SIM RACING</div><h2>RACE LIKE<br /><span>A PRO.</span></h2></div><p>Professional simulator hardware for the most realistic racing experience. Steering wheel, pedals, shifter, and more.</p></div><div className="console-grid">{racingSetups.map((item, i) => <article className={`console-card ${item.color}`} key={item.name}><div className="card-top"><span className="card-index">0{i + 1}</span><span className="card-tag">{item.tag}</span></div><div className="console-visual" style={{ position: 'relative', overflow: 'hidden' }}><Image src={item.image} alt={item.name} width={200} height={150} style={{ objectFit: 'cover', opacity: 0.8 }} /><div className="orbit orbit-one" /><div className="orbit orbit-two" /></div><div className="card-bottom"><div><h3>{item.name}</h3><p>{item.detail}</p></div><ArrowUpRight /></div></article>)}</div></section>

      <section id="space" className="space-section section-wrap"><div className="space-photo"><div className="photo-lights" /><div className="photo-screen">PLAYER<br /><span>SELECT</span></div><div className="photo-couch" /></div><div className="space-copy"><div className="eyebrow">04 / THE ROOM</div><h2>MORE THAN<br /><span>A SETUP.</span></h2><p>Come for the hardware. Stay for the energy. GAME//ROOM is a social space for solo grinders, competitive squads, and everyone in between.</p><div className="feature-list"><span><strong>01</strong> Private booths</span><span><strong>02</strong> 4K projector wall</span><span><strong>03</strong> Snacks & cold drinks</span></div><button className="text-link" onClick={() => setBookingOpen(true)}>Get the full tour <ArrowUpRight /></button></div></section>

      <section id="events" className="events-section"><div className="section-wrap"><div className="eyebrow">05 / UPCOMING</div><div className="event-row"><h2>THE WEEKLY<br /><span>GRIND.</span></h2><div className="event-card"><div className="event-date"><strong>28</strong><span>SEP<br />SAT</span></div><div><p className="event-type">TOURNAMENT · 7:00 PM</p><h3>Street Fighter 6 / Fight Night</h3><p>Double elimination. Winner takes the pot.</p></div><button onClick={() => setBookingOpen(true)} aria-label="Book Fight Night"><ArrowUpRight /></button></div></div></div></section>

      <footer className="site-footer section-wrap"><div className="footer-brand"><span className="brand-mark">G</span><h2>GAME<span>//</span>ROOM</h2><p>Play hard. Stay late.</p></div><div className="footer-links"><div><span>FIND US</span><p>14 Arcade Way<br />Downtown, NY 10001</p></div><div><span>HOURS</span><p>Mon—Thu · 12p—12a<br />Fri—Sun · 12p—2a</p></div><div><span>FOLLOW</span><p>@gameroomnyc<br />hello@gameroom.club</p></div></div><p className="copyright">© 2024 GAME//ROOM. ALL SYSTEMS GO.</p></footer>

      {bookingOpen && <div className="booking-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setBookingOpen(false) }}><div className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="close-booking" onClick={() => setBookingOpen(false)} aria-label="Close booking panel"><X /></button>{booked ? <div className="booking-success"><Trophy /><div className="eyebrow">YOU&apos;RE IN</div><h2>SESSION<br /><span>LOCKED.</span></h2><p>We&apos;ll see you on the main floor. Check your inbox for the details.</p><Button onClick={() => setBookingOpen(false)}>Back to the room</Button></div> : <><div className="eyebrow">RESERVE YOUR SPOT</div><h2 id="booking-title">BOOK A<br /><span>SESSION.</span></h2><p>Choose your crew size and we&apos;ll save you a station.</p><form onSubmit={(e) => { e.preventDefault(); setBooked(true) }}><label>Your name<input required placeholder="Player one" /></label><label>Email<input required type="email" placeholder="you@email.com" /></label><label>Party size<select defaultValue="2"><option>1 player</option><option>2 players</option><option>3 players</option><option>4+ players</option></select></label><Button type="submit">Lock it in <ArrowUpRight data-icon="inline-end" /></Button></form></>}</div></div>}
    </main>
  )
}

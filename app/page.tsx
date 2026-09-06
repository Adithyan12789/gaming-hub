'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ChevronRight, Gamepad2, Menu, Play, Sparkles, Trophy, X, Zap } from 'lucide-react'
import MagicRings from '../components/MagicRings'
import PixelBlast from '../components/PixelBlast'

interface GameData {
  id: number
  name: string
  background_image: string
  rating: number
  released: string
  genres: { id: number; name: string }[]
  platforms: { platform: { id: number; name: string } }[]
}

const consoles = [
  { name: 'PlayStation 5', type: 'Console', tag: 'PS5', detail: '4K / 120 FPS', color: 'cyan', icon: '◒', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80' },
  { name: 'Xbox Series X', type: 'Console', tag: 'XBOX', detail: 'Quick Resume', color: 'lime', icon: '✕', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80' },
  { name: 'Nintendo Switch', type: 'Console', tag: 'SWITCH', detail: 'Party mode', color: 'coral', icon: '◉', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80' },
  { name: 'PC Battlestation', type: 'PC', tag: 'RTX 4080', detail: '240Hz OLED', color: 'violet', icon: '▣', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80' },
  { name: 'Steam Deck', type: 'Handheld', tag: 'DECK', detail: 'Take it anywhere', color: 'amber', icon: '▰', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80' }
]


export default function Page() {
  const [filter, setFilter] = useState('All gear')
  const [menuOpen, setMenuOpen] = useState(false)
  const [games, setGames] = useState<GameData[]>([])
  const [gamesLoading, setGamesLoading] = useState(true)
  const [platformFilter, setPlatformFilter] = useState('all')
  
  // Cache for platform-specific game data
  const [gameCache, setGameCache] = useState<Record<string, GameData[]>>({})
  
  const visible = filter === 'All gear' ? consoles : consoles.filter((item) => item.type === filter)

  // Platform mapping for RAWG API - memoized for better performance
  const platformMap = useMemo(() => ({
    'all': '',
    'pc': '4',
    'ps5': '187', 
    'ps4': '18',
    'xbox-series': '186',
    'xbox-one': '1',
    'switch': '7'
  }), [])

  // Memoized platform filter options
  const platformOptions = useMemo(() => [
    { key: 'all', label: 'All Platforms' },
    { key: 'pc', label: 'PC' },
    { key: 'ps5', label: 'PS5' },
    { key: 'ps4', label: 'PS4' },
    { key: 'xbox-series', label: 'Xbox Series' },
    { key: 'xbox-one', label: 'Xbox One' },
    { key: 'switch', label: 'Switch' }
  ], [])

  // Optimized platform change handler
  const handlePlatformChange = useCallback((platform: string) => {
    setPlatformFilter(platform)
    
    // If we have cached data, no loading state needed
    if (!gameCache[platform]) {
      setGamesLoading(true)
    }
  }, [gameCache])
  
  // Fetch games based on platform filter with caching and optimization
  useEffect(() => {
    const fetchGames = async () => {
      // Check if we already have cached data for this platform
      if (gameCache[platformFilter]) {
        setGames(gameCache[platformFilter])
        setGamesLoading(false)
        return
      }
      
      try {
        setGamesLoading(true)
        let apiUrl = '/api/games?genre=action&page_size=20' // Fetch 20 games to ensure 8 after filtering
        
        if (platformFilter !== 'all') {
          apiUrl += `&platforms=${platformMap[platformFilter as keyof typeof platformMap]}`
        }
        
        const response = await fetch(apiUrl, {
          // Add caching headers for better performance
          headers: {
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          }
        })
        const data = await response.json()
        
        if (response.ok && data.results) {
          let gameResults = data.results.slice(0, 8) // Ensure exactly 8 games
          
          // Additional frontend filtering to ensure no indie/casual games slip through
          gameResults = gameResults.filter((game: GameData) => {
            if (!game.genres) return true
            
            const hasIndieOrCasual = game.genres.some(genre => {
              const genreName = genre.name.toLowerCase()
              return genreName.includes('indie') || 
                     genreName.includes('casual') ||
                     genreName === 'indie' ||
                     genreName === 'casual'
            })
            
            return !hasIndieOrCasual
          })
          
          setGames(gameResults)
          
          // Cache the results
          setGameCache(prev => ({
            ...prev,
            [platformFilter]: gameResults
          }))
        }
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setGamesLoading(false)
      }
    }

    fetchGames()
  }, [platformFilter, platformMap]) // Remove gameCache from dependencies to prevent infinite loops
  
  // Preload data for common platforms on component mount
  useEffect(() => {
    const preloadPlatforms = ['pc', 'ps5', 'xbox-series']
    
    preloadPlatforms.forEach(async (platform) => {
      if (!gameCache[platform]) {
        try {
          let apiUrl = '/api/games?genre=action&page_size=20'
          if (platform !== 'all') {
            apiUrl += `&platforms=${platformMap[platform as keyof typeof platformMap]}`
          }
          
          const response = await fetch(apiUrl, {
            headers: {
              'Cache-Control': 'public, max-age=300',
            }
          })
          const data = await response.json()
          
          if (response.ok && data.results) {
            const filteredResults = data.results.filter((game: GameData) => {
              if (!game.genres) return true
              
              const hasIndieOrCasual = game.genres.some(genre => {
                const genreName = genre.name.toLowerCase()
                return genreName.includes('indie') || 
                       genreName.includes('casual') ||
                       genreName === 'indie' ||
                       genreName === 'casual'
              })
              
              return !hasIndieOrCasual
            }).slice(0, 8)
            
            setGameCache(prev => ({
              ...prev,
              [platform]: filteredResults
            }))
          }
        } catch (error) {
          console.error(`Error preloading ${platform} games:`, error)
        }
      }
    })
  }, [platformMap]) // Add platformMap dependency

  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  // Enhanced header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.site-header')
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('scrolled')
        } else {
          header.classList.remove('scrolled')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* Magic Rings WebGL Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <MagicRings
          color="#A855F7"
          colorTwo="#6366F1"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={0.7}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={true}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
      </div>

      {/* Gaming Background Animations */}
      <div className="gaming-bg-container">
        {/* Floating Gaming Elements */}
        <div className="floating-elements">
          <div className="floating-element">🎮</div>
          <div className="floating-element">🕹️</div>
          <div className="floating-element">👾</div>
          <div className="floating-element">🎯</div>
          <div className="floating-element">⚡</div>
          <div className="floating-element">🎮</div>
          <div className="floating-element">🏆</div>
          <div className="floating-element">👾</div>
          <div className="floating-element">⭐</div>
        </div>

        {/* Gaming Particles */}
        <div className="gaming-particles">
          {[...Array(10)].map((_, i) => (
            <div key={`particle-${i}`} className="particle"></div>
          ))}
        </div>

        {/* Gaming Grid */}
        <div className="gaming-grid"></div>

        {/* Gaming Orbs */}
        <div className="gaming-orbs">
          <div className="gaming-orb"></div>
          <div className="gaming-orb"></div>
          <div className="gaming-orb"></div>
        </div>

        {/* Circuit Lines */}
        <div className="circuit-lines">
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
        </div>

        {/* Gaming HUD */}
        <div className="gaming-hud">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
        </div>
      </div>

      <div className="scanlines" aria-hidden="true" />
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Go to top"><span className="brand-mark">G</span> GAME<span className="brand-slash">//</span>ROOM</button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <button onClick={() => scrollTo('gear')}>The gear</button><button onClick={() => scrollTo('games')}>Play now</button><button onClick={() => scrollTo('racing')}>Racing Sim</button><button onClick={() => scrollTo('info')}>Visit Us</button><button onClick={() => scrollTo('space')}>The space</button><button onClick={() => scrollTo('events')}>Events</button>
        </nav>
        <a 
          href="https://wa.me/15551234263?text=Hi! I'd like to book a gaming session at GAME//ROOM" 
          target="_blank" 
          rel="noopener noreferrer"
          className="header-whatsapp-btn"
          aria-label="Contact us on WhatsApp"
        >
          <span className="whatsapp-icon">💬</span>
          <span className="whatsapp-text">Book Now</span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section id="top" className="hero section-wrap">
        <div className="hero-copy reveal-up">
          <div className="eyebrow"><span className="live-dot" /> THE CITY&apos;S PLAYGROUND · EST. 2024</div>
          <h1>PLAY<br /><em>LOUDER.</em></h1>
          <p className="hero-lede">A physical gaming hub built for big wins, chaotic couch co-op, and the kind of nights you don&apos;t want to end.</p>
          <div className="hero-actions"><button className="text-link" onClick={() => scrollTo('space')}>Explore the room <ChevronRight /></button></div>
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

      <section id="gear" className="content-section section-wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">01 / LOADOUT</div>
            <h2>YOUR NEXT<br /><span>MAIN CHARACTER.</span></h2>
          </div>
          <p>Top-tier hardware, tuned for the win. Pick your poison and settle in.</p>
        </div>
        <div className="filter-row" role="group" aria-label="Filter equipment">
          {['All gear', 'Console', 'PC', 'Handheld'].map((item) => (
            <button 
              key={item} 
              className={filter === item ? 'filter active' : 'filter'} 
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="console-grid">
          {visible.map((item, i) => (
            <article className={`console-card ${item.color}`} key={item.name}>
              <div className="card-top">
                <span className="card-index">0{i + 1}</span>
                <span className="card-tag">{item.tag}</span>
              </div>
              <div className="console-visual" style={{ position: 'relative', overflow: 'hidden' }}>
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }} 
                />
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
              </div>
              <div className="card-bottom">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.detail}</p>
                </div>
                <ArrowUpRight />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="games" className="content-section games-section">
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <div className="eyebrow">02 / THE LIBRARY</div>
              <h2>ALL KILLER.<br /><span>NO FILLER.</span></h2>
            </div>
            <p>From button-mashers to 80-hour epics, the shelf is stacked with your next obsession.</p>
          </div>
          
          {/* Platform Filter */}
          <div className="filter-row" role="group" aria-label="Filter games by platform">
            {platformOptions.map((platform) => (
              <button 
                key={platform.key}
                className={platformFilter === platform.key ? 'filter active' : 'filter'} 
                onClick={() => handlePlatformChange(platform.key)}
                disabled={gamesLoading}
              >
                {platform.label}
              </button>
            ))}
          </div>
          
          {gamesLoading ? (
            <div className="games-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <article className="game-card game-loading" key={i}>
                  <div className="game-skeleton-img" />
                  <div className="game-card-top">
                    <div className="game-index-badge">0{i + 1}</div>
                  </div>
                  <div className="game-skeleton-bottom">
                    <div className="skeleton-line medium" />
                    <div className="skeleton-line short" />
                  </div>
                </article>
              ))}
            </div>
          ) : games.length > 0 ? (
            <div className="games-grid">
              {games.map((game, i) => {
                const colors = ['gold', 'red', 'blue', 'green', 'violet', 'cyan', 'coral', 'amber']
                const color = colors[i % colors.length]
                const primaryGenre = game.genres[0]?.name || 'Action'
                const primaryPlatform = game.platforms[0]?.platform.name || 'PC'
                const rating = game.rating ? game.rating.toFixed(1) : '—'

                return (
                  <article className={`game-card game-${color}`} key={game.id}>
                    {/* Poster image */}
                    <div className="game-image-container">
                      <Image
                        src={game.background_image || '/placeholder.jpg'}
                        alt={game.name}
                        fill
                        priority={i < 4}
                        quality={85}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement
                          target.src = '/placeholder.jpg'
                        }}
                      />
                    </div>

                    {/* Top badges */}
                    <div className="game-card-top">
                      <div className="game-index-badge">{String(i + 1).padStart(2, '0')}</div>
                      <div className="game-rating-badge">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        {rating}
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="game-info">
                      <h3>{game.name}</h3>
                      <div className="game-meta-row">
                        <span className="game-genre-pill">{primaryGenre.toUpperCase()}</span>
                        <span className="game-platform-tag">{primaryPlatform.toUpperCase()}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="games-grid">
              <div className="no-games-message">
                <p>No action games found for this platform. Try a different platform or check back later.</p>
              </div>
            </div>
          )}
          
          <Link href="/games-library">
            <button className="view-all">See the full library <ArrowUpRight /></button>
          </Link>
        </div>
      </section>

      <section id="racing" className="racing-showcase-section" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }}>
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#B497CF"
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.5}
            edgeFade={0.25}
            transparent
          />
        </div>
        <div className="section-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="racing-content">
            <div className="racing-hero">
              <div className="eyebrow">03 / SIM RACING</div>
              <h2>PROFESSIONAL<br /><span>RACING SIMULATOR.</span></h2>
              <p>Experience the thrill of motorsport with our state-of-the-art racing simulator. Every component is engineered for realism, precision, and an authentic racing experience that rivals the real track.</p>
              
              <div className="racing-stats">
                <div className="stat">
                  <strong>1000+</strong>
                  <span>HORSEPOWER SIMULATED</span>
                </div>
                <div className="stat">
                  <strong>15NM</strong>
                  <span>FORCE FEEDBACK</span>
                </div>
                <div className="stat">
                  <strong>240Hz</strong>
                  <span>ULTRA-LOW LATENCY</span>
                </div>
              </div>
            </div>
            
            <div className="racing-visual">
              <div className="racing-image-container">
                <Image 
                  src="/games/racing setup.jpg" 
                  alt="Professional Racing Simulator Setup" 
                  fill
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: 'center'
                  }}
                  className="racing-setup-image"
                  quality={95}
                />
                <div className="racing-overlay">
                  <div className="live-indicator">
                    <div className="live-dot"></div>
                    <span>LIVE SESSION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="supported-games-detailed">
            <h3>SUPPORTED RACING SIMULATIONS</h3>
            <div className="racing-games-grid">
              <div className="racing-game-card featured">
                <div className="game-image">
                  <Image 
                    src="/games/forze-horizon.jpg" 
                    alt="Forza Horizon" 
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <div className="game-overlay">
                    <span className="featured-badge">FEATURED</span>
                  </div>
                </div>
                <div className="game-details">
                  <h4>Forza Horizon</h4>
                  <p className="game-description">The ultimate open-world racing experience combining stunning visuals, dynamic weather, and hundreds of cars in a festival atmosphere.</p>
                  <div className="game-specs">
                    <span className="spec-item">Open World Festival</span>
                    <span className="spec-item">500+ Licensed Cars</span>
                    <span className="spec-item">Dynamic Seasons</span>
                  </div>
                  <div className="game-meta">
                    <span className="rating">★★★★★</span>
                    <span className="players">Arcade Racing</span>
                  </div>
                </div>
              </div>

              <div className="racing-game-card">
                <div className="game-image">
                  <Image 
                    src="/games/Assetto Corsa.jpg" 
                    alt="Assetto Corsa Competizione" 
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div className="game-details">
                  <h4>Assetto Corsa Competizione</h4>
                  <p className="game-description">Official GT World Challenge game with incredible physics and stunning visuals. Master GT3 and GT4 racing.</p>
                  <div className="game-specs">
                    <span className="spec-item">Official GT3/GT4 Series</span>
                    <span className="spec-item">Dynamic Weather</span>
                    <span className="spec-item">Realistic Physics</span>
                  </div>
                  <div className="game-meta">
                    <span className="rating">★★★★☆</span>
                    <span className="players">GT Specialist</span>
                  </div>
                </div>
              </div>

              <div className="racing-game-card">
                <div className="game-image">
                  <Image 
                    src="/games/f24.jpg" 
                    alt="F1 24" 
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div className="game-details">
                  <h4>F1 24</h4>
                  <p className="game-description">The official Formula 1 simulation featuring all 2024 teams, drivers, and circuits with career mode and multiplayer.</p>
                  <div className="game-specs">
                    <span className="spec-item">Official F1 License</span>
                    <span className="spec-item">All 2024 Circuits</span>
                    <span className="spec-item">Career & MyTeam Mode</span>
                  </div>
                  <div className="game-meta">
                    <span className="rating">★★★★☆</span>
                    <span className="players">F1 Official</span>
                  </div>
                </div>
              </div>

              <div className="racing-game-card">
                <div className="game-image">
                  <Image 
                    src="/games/rally.jpg" 
                    alt="Dirt Rally 2.0" 
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div className="game-details">
                  <h4>Dirt Rally 2.0</h4>
                  <p className="game-description">The most authentic off-road racing experience with challenging rally stages and precise handling physics.</p>
                  <div className="game-specs">
                    <span className="spec-item">Rally & Rallycross</span>
                    <span className="spec-item">Realistic Damage</span>
                    <span className="spec-item">Historic Cars</span>
                  </div>
                  <div className="game-meta">
                    <span className="rating">★★★★☆</span>
                    <span className="players">Rally Specialist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </section>

      <section id="info" className="location-info-section">
        <div className="section-wrap">
          <div className="location-content">
            <div className="location-details">
              <div className="eyebrow">04 / VISIT US</div>
              <h2>FIND US.<br /><span>GAME ON.</span></h2>
              
              <div className="info-grid">
                <div className="info-card location-card">
                  <div className="info-icon">📍</div>
                  <h3>Location</h3>
                  <p>14 Arcade Way<br />Downtown, NY 10001<br />United States</p>
                  <div className="info-meta">Near Times Square Metro</div>
                </div>
                
                <div className="info-card hours-card">
                  <div className="info-icon">🕒</div>
                  <h3>Opening Hours</h3>
                  <div className="hours-list">
                    <div className="hour-item">
                      <span>Monday - Thursday</span>
                      <span>12:00 PM - 12:00 AM</span>
                    </div>
                    <div className="hour-item">
                      <span>Friday - Sunday</span>
                      <span>12:00 PM - 2:00 AM</span>
                    </div>
                  </div>
                  <div className="info-meta live-status">
                    <div className="live-dot"></div>
                    Open Now
                  </div>
                </div>
                
                <div className="info-card pricing-card">
                  <div className="info-icon">💰</div>
                  <h3>Hourly Rates</h3>
                  <div className="pricing-list">
                    <div className="price-item">
                      <span>Console Gaming</span>
                      <span>$15/hour</span>
                    </div>
                    <div className="price-item">
                      <span>PC Gaming</span>
                      <span>$20/hour</span>
                    </div>
                    <div className="price-item featured-price">
                      <span>Racing Simulator</span>
                      <span>$25/hour</span>
                    </div>
                    <div className="price-item">
                      <span>Private Room (4 people)</span>
                      <span>$60/hour</span>
                    </div>
                  </div>
                  <div className="info-meta">Group discounts available</div>
                </div>
              </div>
            </div>
            
            <div className="gaming-rooms-showcase">
              <h3>OUR GAMING ROOMS</h3>
              <div className="rooms-grid">
                <div className="room-card main-floor">
                  <div className="room-image">
                    <Image 
                      src="/games/main.jpg" 
                      alt="Main Gaming Floor" 
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                    <div className="room-overlay">
                      <span className="room-badge">MAIN FLOOR</span>
                    </div>
                  </div>
                  <div className="room-details">
                    <h4>Main Gaming Floor</h4>
                    <p>Open gaming area with 16 high-end gaming stations, perfect for solo gaming and casual groups.</p>
                    <div className="room-specs">
                      <span>16 Gaming Stations</span>
                      <span>RTX 4080 PCs</span>
                      <span>240Hz Monitors</span>
                    </div>
                  </div>
                </div>
                
                <div className="room-card private-rooms">
                  <div className="room-image">
                    <Image 
                      src="/games/private.jpg" 
                      alt="Private Gaming Rooms" 
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                    <div className="room-overlay">
                      <span className="room-badge">PRIVATE ROOMS</span>
                    </div>
                  </div>
                  <div className="room-details">
                    <h4>Private Gaming Rooms</h4>
                    <p>Intimate spaces for competitive teams and private parties with premium sound isolation.</p>
                    <div className="room-specs">
                      <span>4 Private Rooms</span>
                      <span>4K Projectors</span>
                      <span>Surround Sound</span>
                    </div>
                  </div>
                </div>
                
                <div className="room-card tournament-area">
                  <div className="room-image">
                    <Image 
                      src="/games/Tournament Arena.jpg" 
                      alt="Tournament Area" 
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                    <div className="room-overlay">
                      <span className="room-badge">TOURNAMENT</span>
                    </div>
                  </div>
                  <div className="room-details">
                    <h4>Tournament Arena</h4>
                    <p>Professional eSports setup with streaming capabilities and spectator seating for 50+ people.</p>
                    <div className="room-specs">
                      <span>8 Pro Stations</span>
                      <span>Live Streaming</span>
                      <span>Spectator Seating</span>
                    </div>
                  </div>
                </div>
                
                <div className="room-card lounge-area">
                  <div className="room-image">
                    <Image 
                      src="/games/Chill Lounge.jpg" 
                      alt="Lounge Area" 
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                    <div className="room-overlay">
                      <span className="room-badge">LOUNGE</span>
                    </div>
                  </div>
                  <div className="room-details">
                    <h4>Chill Lounge</h4>
                    <p>Relaxed area with console gaming, snacks, and drinks. Perfect for casual gaming sessions.</p>
                    <div className="room-specs">
                      <span>Console Gaming</span>
                      <span>Food & Drinks</span>
                      <span>Comfortable Seating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="space" className="space-section section-wrap">
        <div className="space-copy">
          <div className="eyebrow">05 / THE ROOM</div>
          <h2>MORE THAN<br /><span>A SETUP.</span></h2>
          <p>Come for the hardware. Stay for the energy. GAME//ROOM is a social space for solo grinders, competitive squads, and everyone in between.</p>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-image">
                <Image 
                  src="/games/booth.jpg" 
                  alt="Private Gaming Booths"
                  fill
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: 'center'
                  }}
                  className="rounded-lg"
                />
                <div className="feature-overlay">
                  <span className="feature-number">01</span>
                </div>
              </div>
              <div className="feature-content">
                <h4>Private Booths</h4>
                <p>Soundproof gaming pods with premium seating, perfect for competitive teams and focused gaming sessions.</p>
                <div className="feature-specs">
                  <span>• 4-6 Person Capacity</span>
                  <span>• Noise Isolation</span>
                  <span>• Premium Audio</span>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-image">
                <Image 
                  src="/games/projector.jpg"
                  alt="4K Projector Wall"
                  fill
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: 'center'
                  }}
                  className="rounded-lg"
                />
                <div className="feature-overlay">
                  <span className="feature-number">02</span>
                </div>
              </div>
              <div className="feature-content">
                <h4>4K Projector Wall</h4>
                <p>Massive 120-inch 4K projection system for epic gaming experiences and tournament viewing parties.</p>
                <div className="feature-specs">
                  <span>• 120" Ultra HD Display</span>
                  <span>• 144Hz Refresh Rate</span>
                  <span>• HDR10 Support</span>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-image">
                <Image 
                  src="/games/snack.jpg" 
                  alt="Gaming Snacks and Drinks"
                  fill
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: 'center'
                  }}
                  className="rounded-lg"
                />
                <div className="feature-overlay">
                  <span className="feature-number">03</span>
                </div>
              </div>
              <div className="feature-content">
                <h4>Snacks & Cold Drinks</h4>
                <p>Fuel your gaming sessions with energy drinks, gamer-friendly snacks, and fresh meals delivered to your station.</p>
                <div className="feature-specs">
                  <span>• Energy Drinks & Coffee</span>
                  <span>• Gaming Snacks</span>
                  <span>• Station Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="events-section"><div className="section-wrap"><div className="eyebrow">06 / UPCOMING</div><div className="event-row"><h2>THE WEEKLY<br /><span>GRIND.</span></h2><div className="event-card"><div className="event-date"><strong>28</strong><span>SEP<br />SAT</span></div><div><p className="event-type">TOURNAMENT · 7:00 PM</p><h3>Street Fighter 6 / Fight Night</h3><p>Double elimination. Winner takes the pot.</p></div></div></div></div></section>

      <footer className="site-footer">
        {/* Top accent line */}
        <div className="footer-accent-line" />

        <div className="footer-inner section-wrap">
          {/* Top row: brand + columns */}
          <div className="footer-top">

            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-logo-mark">G</span>
                <span className="footer-logo-text">GAME<span className="footer-slash">//</span>ROOM</span>
              </div>
              <p className="footer-desc">A physical gaming hub built for big wins, chaotic couch co-op, and nights you don't want to end.</p>
              <div className="footer-socials">
                <a href="#" aria-label="Instagram" className="footer-social-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
                </a>
                <a href="#" aria-label="Discord" className="footer-social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
                <a href="#" aria-label="X / Twitter" className="footer-social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" aria-label="Twitch" className="footer-social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
                </a>
                <a href="https://wa.me/15551234263?text=Hi! I'd like to book a gaming session" aria-label="WhatsApp" className="footer-social-btn footer-social-wa">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            {/* Nav columns */}
            <div className="footer-cols">
              <div className="footer-col">
                <h5 className="footer-col-heading">Navigate</h5>
                <ul className="footer-col-links">
                  <li><a href="#gear">Gaming Stations</a></li>
                  <li><a href="#games">Game Library</a></li>
                  <li><a href="#racing">Racing Sim</a></li>
                  <li><a href="#space">The Space</a></li>
                  <li><a href="#events">Tournaments</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h5 className="footer-col-heading">Hours</h5>
                <ul className="footer-hours-list">
                  <li><span>Mon – Thu</span><span>12PM – 12AM</span></li>
                  <li><span>Fri – Sun</span><span>12PM – 2AM</span></li>
                </ul>
                <p className="footer-hours-note">Extended hours during events</p>

                <h5 className="footer-col-heading" style={{ marginTop: '28px' }}>Contact</h5>
                <ul className="footer-contact-list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    14 Arcade Way, Downtown NY 10001
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    (555) 123-GAME
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    hello@gameroom.club
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bar">
            <p className="footer-copy">© 2024 GAME//ROOM. All rights reserved.</p>
            <div className="footer-bar-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/safety">Safety</a>
            </div>
          </div>
        </div>
      </footer>


      {/* Floating WhatsApp Contact Button */}
      <div className="whatsapp-float">
        <a 
          href="https://wa.me/15551234263?text=Hi! I'd like to book a gaming session at GAME//ROOM" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-button"
          aria-label="Contact us on WhatsApp"
        >
          <div className="whatsapp-icon">💬</div>
          <div className="whatsapp-tooltip">
            <span>Chat with us!</span>
            <div className="tooltip-arrow"></div>
          </div>
        </a>
      </div>

    </main>
  )
}
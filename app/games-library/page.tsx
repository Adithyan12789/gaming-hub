'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Search, Star, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Platform {
  platform: {
    id: number
    name: string
  }
}

interface Genre {
  id: number
  name: string
}

interface GameData {
  id: number
  name: string
  background_image: string
  rating: number
  released: string
  genres: Genre[]
  platforms: Platform[]
}

export default function GamesLibrary() {
  const [games, setGames] = useState<GameData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('rating')
  const [genreFilter, setGenreFilter] = useState('all')
  const gamesPerPage = 12

  const fetchGames = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use our API route to fetch games from RAWG with retry logic
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout
      
      const response = await fetch('/api/games', {
        cache: 'no-store',
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`)
      }
      
      if (!data.results || data.results.length === 0) {
        throw new Error('No games found from RAWG API. The service might be temporarily unavailable.')
      }

      setGames(data.results)
      
      // Show a notification if we're using fallback data
      if (data.note) {
        console.log('Using fallback data:', data.note)
        setError(`Note: ${data.note}`)
      }
    } catch (err) {
      console.error('Error fetching games:', err)
      
      let errorMessage = 'Failed to fetch games from API'
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. The RAWG API is responding slowly.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      setGames([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = genreFilter === 'all' || game.genres.some(genre => 
      genre.name.toLowerCase().includes(genreFilter.toLowerCase())
    )
    
    // Filter out indie and casual games
    const hasIndieOrCasual = game.genres.some(genre => {
      const genreName = genre.name.toLowerCase()
      return genreName.includes('indie') || 
             genreName.includes('casual') ||
             genreName === 'indie' ||
             genreName === 'casual'
    })
    
    return matchesSearch && matchesGenre && !hasIndieOrCasual
  })

  // Sort games
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'released':
        return new Date(b.released).getTime() - new Date(a.released).getTime()
      case 'rating':
      default:
        return b.rating - a.rating
    }
  })

  // Pagination
  const indexOfLastGame = currentPage * gamesPerPage
  const indexOfFirstGame = indexOfLastGame - gamesPerPage
  const currentGames = sortedGames.slice(indexOfFirstGame, indexOfLastGame)
  const totalPages = Math.ceil(sortedGames.length / gamesPerPage)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="scanlines" aria-hidden="true" />
      
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="section-wrap flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono text-sm font-bold">BACK TO HOME</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">{sortedGames.length} GAMES</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-wrap pt-16 pb-12">
        <div className="eyebrow">FULL COLLECTION</div>
        <h1 className="mt-4 mb-4" style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(48px, 8vw, 86px)', fontWeight: 700, lineHeight: 0.94, letterSpacing: '-0.09em' }}>
          GAMES<br />
          <span style={{ color: 'var(--primary)' }}>LIBRARY.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {error ? (
            <span className="flex items-center gap-2">
              <span className="text-red-400">⚠️ Failed to load games from RAWG API.</span>
              <span className="text-xs text-muted-foreground">({error})</span>
            </span>
          ) : (
            'Browse our complete collection of PC games from RAWG API. Featuring the highest-rated games from 2020-2024.'
          )}
        </p>

        {/* Search and Filter Bar */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-4xl">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="released">Sort by Release Date</option>
          </select>

          {/* Genre Filter */}
          <select
            value={genreFilter}
            onChange={(e) => {
              setGenreFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All Genres</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="rpg">RPG</option>
            <option value="shooter">Shooter</option>
            <option value="strategy">Strategy</option>
            <option value="simulation">Simulation</option>
            <option value="sports">Sports</option>
            <option value="racing">Racing</option>
            <option value="puzzle">Puzzle</option>
            <option value="platformer">Platformer</option>
            <option value="fighting">Fighting</option>
          </select>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="section-wrap pb-20 flex justify-center items-center min-h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-mono">Loading games...</p>
          </div>
        </section>
      )}

      {/* Games Grid */}
      {!loading && (
        <section className="section-wrap pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentGames.map((game) => (
              <article key={game.id} className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 hover:-translate-y-1">
                {/* Game Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {game.background_image ? (
                    <Image
                      src={game.background_image}
                      alt={game.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {/* Rating Badge */}
                  {game.rating > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-background/90 backdrop-blur rounded-full">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-bold font-mono">{game.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="p-4">
                  <h3 className="font-bold text-base mb-2 line-clamp-1">{game.name}</h3>
                  
                  {/* Genres */}
                  {game.genres && game.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {game.genres.slice(0, 2).map((genre) => (
                        <span key={genre.id} className="text-xs font-mono px-2 py-0.5 bg-accent/10 text-accent rounded">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Release Date */}
                  {game.released && (
                    <p className="text-xs text-muted-foreground font-mono">
                      Released: {new Date(game.released).getFullYear()}
                    </p>
                  )}

                  {/* Platforms */}
                  {game.platforms && game.platforms.length > 0 && (
                    <p className="text-xs text-muted-foreground font-mono mt-1 line-clamp-1">
                      {game.platforms.map(p => p.platform.name).slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {sortedGames.length === 0 && !loading && (
            <div className="flex flex-col justify-center items-center min-h-96 gap-4">
              {error ? (
                <>
                  <div className="text-red-400 text-6xl">⚠️</div>
                  <div className="text-center">
                    <p className="text-red-400 font-mono text-lg mb-2">Unable to load games</p>
                    <p className="text-muted-foreground text-sm max-w-md">
                      The RAWG API is currently unavailable. Please check your internet connection and try refreshing the page.
                    </p>
                    <button 
                      onClick={fetchGames} 
                      disabled={loading}
                      className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Retrying...' : 'Retry'}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground font-mono">No games found matching your search.</p>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && sortedGames.length > 0 && (
            <div className="flex justify-center gap-3 mt-12">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 font-mono text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

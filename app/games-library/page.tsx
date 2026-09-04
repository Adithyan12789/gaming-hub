'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Game {
  id: number
  name: string
  background_image: string
  rating: number
  released: string
  genres: { id: number; name: string }[]
  platforms: { platform: { id: number; name: string } }[]
}

// Static game library data
const allGames: Game[] = [
  { id: 1, name: 'Grand Theft Auto V', background_image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80', rating: 4.5, released: '2013-09-17', genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Open World' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 2, name: 'The Witcher 3: Wild Hunt', background_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', rating: 4.7, released: '2015-05-19', genres: [{ id: 1, name: 'RPG' }, { id: 2, name: 'Action' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 3, name: 'Red Dead Redemption 2', background_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80', rating: 4.6, released: '2018-10-26', genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 4, name: 'Cyberpunk 2077', background_image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80', rating: 4.2, released: '2020-12-10', genres: [{ id: 1, name: 'RPG' }, { id: 2, name: 'Action' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 5, name: 'Elden Ring', background_image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80', rating: 4.8, released: '2022-02-25', genres: [{ id: 1, name: 'RPG' }, { id: 2, name: 'Souls-like' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 6, name: 'God of War', background_image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&q=80', rating: 4.6, released: '2018-04-20', genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 7, name: 'Minecraft', background_image: '/games/Minecraft.jpg', rating: 4.4, released: '2011-11-18', genres: [{ id: 1, name: 'Sandbox' }, { id: 2, name: 'Creative' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'Console' } }] },
  { id: 8, name: 'Call of Duty: Modern Warfare', background_image: '/games/Call Of Duty.jpg', rating: 4.3, released: '2019-10-25', genres: [{ id: 1, name: 'Shooter' }, { id: 2, name: 'FPS' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 9, name: 'Valorant', background_image: '/games/valorant.jpg', rating: 4.1, released: '2020-06-02', genres: [{ id: 1, name: 'Tactical' }, { id: 2, name: 'Shooter' }], platforms: [{ platform: { id: 1, name: 'PC' } }] },
  { id: 10, name: 'Apex Legends', background_image: '/games/Apex.jpg', rating: 4.2, released: '2019-02-04', genres: [{ id: 1, name: 'Battle Royale' }, { id: 2, name: 'Shooter' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'Console' } }] },
  { id: 11, name: 'Fortnite', background_image: '/games/fortnite.jpg', rating: 4.0, released: '2017-07-25', genres: [{ id: 1, name: 'Battle Royale' }, { id: 2, name: 'Shooter' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'Console' } }] },
  { id: 12, name: 'GTA V', background_image: '/games/gta.jpg', rating: 4.5, released: '2013-09-17', genres: [{ id: 1, name: 'Open World' }, { id: 2, name: 'Action' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'Console' } }] },
  { id: 13, name: 'Halo Infinite', background_image: 'https://images.unsplash.com/photo-1589241062272-c0a000072683?w=800&q=80', rating: 4.0, released: '2021-12-08', genres: [{ id: 1, name: 'Shooter' }, { id: 2, name: 'FPS' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'Xbox' } }] },
  { id: 14, name: 'Horizon Zero Dawn', background_image: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=800&q=80', rating: 4.4, released: '2017-02-28', genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'RPG' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 15, name: 'Spider-Man', background_image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800&q=80', rating: 4.7, released: '2018-09-07', genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'PlayStation' } }] },
  { id: 16, name: 'Sekiro: Shadows Die Twice', background_image: 'https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=800&q=80', rating: 4.5, released: '2019-03-22', genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Souls-like' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'Console' } }] },
  { id: 17, name: 'Doom Eternal', background_image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&q=80', rating: 4.3, released: '2020-03-20', genres: [{ id: 1, name: 'Shooter' }, { id: 2, name: 'FPS' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'Console' } }] },
  { id: 18, name: 'League of Legends', background_image: 'https://images.unsplash.com/photo-1627513396171-d15d5e9c26e9?w=800&q=80', rating: 4.1, released: '2009-10-27', genres: [{ id: 1, name: 'MOBA' }, { id: 2, name: 'Strategy' }], platforms: [{ platform: { id: 1, name: 'PC' } }] },
  { id: 19, name: 'Counter-Strike: Global Offensive', background_image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&q=80', rating: 4.4, released: '2012-08-21', genres: [{ id: 1, name: 'Shooter' }, { id: 2, name: 'Tactical' }], platforms: [{ platform: { id: 1, name: 'PC' } }] },
  { id: 20, name: 'Overwatch 2', background_image: 'https://images.unsplash.com/photo-1589241062272-c0a000072683?w=800&q=80', rating: 3.9, released: '2022-10-04', genres: [{ id: 1, name: 'Shooter' }, { id: 2, name: 'Team-based' }], platforms: [{ platform: { id: 1, name: 'PC' } }, { platform: { id: 2, name: 'Console' } }] },
]

export default function GamesLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 12

  const filteredGames = allGames.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const indexOfLastGame = currentPage * gamesPerPage
  const indexOfFirstGame = indexOfLastGame - gamesPerPage
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame)
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage)

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
            <span className="font-mono text-xs text-muted-foreground">{filteredGames.length} GAMES</span>
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
          Browse our complete collection of games. From AAA blockbusters to indie gems.
        </p>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </section>

      {/* Games Grid */}
      <section className="section-wrap pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentGames.map((game) => (
            <article key={game.id} className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 hover:-translate-y-1">
              {/* Game Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                <Image
                  src={game.background_image}
                  alt={game.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
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

        {/* Pagination */}
        {totalPages > 1 && (
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
    </main>
  )
}

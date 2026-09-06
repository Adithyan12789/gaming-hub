import { NextRequest, NextResponse } from 'next/server'

// Rich fallback with real RAWG CDN cover art — shown when API times out
const FALLBACK_GAMES = [
  {
    id: 3498,
    name: 'Grand Theft Auto V',
    background_image: 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
    rating: 4.47,
    released: '2013-09-17',
    genres: [{ id: 4, name: 'Action' }, { id: 3, name: 'Adventure' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 18, name: 'PlayStation 4' } }],
  },
  {
    id: 3328,
    name: 'The Witcher 3: Wild Hunt',
    background_image: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
    rating: 4.66,
    released: '2015-05-19',
    genres: [{ id: 5, name: 'RPG' }, { id: 3, name: 'Adventure' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 18, name: 'PlayStation 4' } }],
  },
  {
    id: 41494,
    name: 'Cyberpunk 2077',
    background_image: 'https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg',
    rating: 4.12,
    released: '2020-12-10',
    genres: [{ id: 4, name: 'Action' }, { id: 5, name: 'RPG' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 187, name: 'PlayStation 5' } }],
  },
  {
    id: 28,
    name: 'Red Dead Redemption 2',
    background_image: 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg',
    rating: 4.55,
    released: '2018-10-26',
    genres: [{ id: 4, name: 'Action' }, { id: 3, name: 'Adventure' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 18, name: 'PlayStation 4' } }],
  },
  {
    id: 5679,
    name: 'The Elder Scrolls V: Skyrim',
    background_image: 'https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg',
    rating: 4.42,
    released: '2011-11-11',
    genres: [{ id: 5, name: 'RPG' }, { id: 4, name: 'Action' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 14, name: 'Xbox 360' } }],
  },
  {
    id: 4200,
    name: 'Portal 2',
    background_image: 'https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg',
    rating: 4.62,
    released: '2011-04-19',
    genres: [{ id: 7, name: 'Puzzle' }, { id: 4, name: 'Action' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }],
  },
  {
    id: 13536,
    name: 'Half-Life 2',
    background_image: 'https://media.rawg.io/media/games/b8c/b8c243eaa0fbac8115e0cdccac3f91dc.jpg',
    rating: 4.48,
    released: '2004-11-16',
    genres: [{ id: 2, name: 'Shooter' }, { id: 4, name: 'Action' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }],
  },
  {
    id: 12020,
    name: 'Left 4 Dead 2',
    background_image: 'https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg',
    rating: 4.38,
    released: '2009-11-17',
    genres: [{ id: 4, name: 'Action' }, { id: 2, name: 'Shooter' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }],
  },
  {
    id: 802,
    name: 'Borderlands 2',
    background_image: 'https://media.rawg.io/media/games/49c/49c3dfa4ce2f6f63d6be5e7046abcea2.jpg',
    rating: 4.25,
    released: '2012-09-18',
    genres: [{ id: 2, name: 'Shooter' }, { id: 5, name: 'RPG' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 18, name: 'PlayStation 4' } }],
  },
  {
    id: 4291,
    name: 'Counter-Strike: Global Offensive',
    background_image: 'https://media.rawg.io/media/games/736/736b87a6b60efb6c7c0d5a94059b4736.jpg',
    rating: 4.39,
    released: '2012-08-21',
    genres: [{ id: 2, name: 'Shooter' }, { id: 4, name: 'Action' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }],
  },
  {
    id: 58175,
    name: 'God of War',
    background_image: 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be73.jpg',
    rating: 4.64,
    released: '2022-01-14',
    genres: [{ id: 4, name: 'Action' }, { id: 3, name: 'Adventure' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 18, name: 'PlayStation 4' } }],
  },
  {
    id: 5562,
    name: 'Fallout 4',
    background_image: 'https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg',
    rating: 4.06,
    released: '2015-11-10',
    genres: [{ id: 5, name: 'RPG' }, { id: 2, name: 'Shooter' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 18, name: 'PlayStation 4' } }],
  },
  {
    id: 354,
    name: 'Rocket League',
    background_image: 'https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg',
    rating: 4.44,
    released: '2015-07-07',
    genres: [{ id: 1, name: 'Racing' }, { id: 15, name: 'Sports' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 18, name: 'PlayStation 4' } }],
  },
  {
    id: 322,
    name: 'Elden Ring',
    background_image: 'https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg',
    rating: 4.53,
    released: '2022-02-25',
    genres: [{ id: 4, name: 'Action' }, { id: 5, name: 'RPG' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 187, name: 'PlayStation 5' } }],
  },
  {
    id: 452638,
    name: 'Hades',
    background_image: 'https://media.rawg.io/media/games/1f4/1f47a270b8f241f1b4339b11d5db08fd.jpg',
    rating: 4.57,
    released: '2020-09-17',
    genres: [{ id: 4, name: 'Action' }, { id: 5, name: 'RPG' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }, { platform: { id: 7, name: 'Nintendo Switch' } }],
  },
  {
    id: 11859,
    name: 'Team Fortress 2',
    background_image: 'https://media.rawg.io/media/games/f87/f87457e8347484033cb34cde6101d08d.jpg',
    rating: 4.32,
    released: '2007-10-10',
    genres: [{ id: 2, name: 'Shooter' }, { id: 4, name: 'Action' }],
    platforms: [{ platform: { id: 4, name: 'PC' } }],
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre') || ''
    const platforms = searchParams.get('platforms') || ''
    const pageSize = searchParams.get('page_size') || '20'

    const apiKey = process.env.RAWG_API_KEY

    if (!apiKey) {
      throw new Error('RAWG API key is not configured')
    }

    // Keep the query lean — fewer params = faster RAWG response.
    // No date filter, page_size capped at 20.
    const pageSizeNum = Math.min(parseInt(pageSize), 20)
    let apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page=${page}&page_size=${pageSizeNum}`

    if (platforms) {
      apiUrl += `&platforms=${platforms}`
    } else {
      apiUrl += `&platforms=4` // default: PC
    }

    if (search) {
      apiUrl += `&search=${encodeURIComponent(search)}`
    }

    if (genre && genre !== 'all') {
      apiUrl += `&genres=${encodeURIComponent(genre)}`
    }

    // 15s timeout — RAWG can be slow; fail fast after that and serve fallback
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': 'GamingHub/1.0', 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Strip indie / casual genres
    if (data.results) {
      data.results = data.results.filter((game: any) => {
        if (!game.genres) return true
        return !game.genres.some((g: any) => {
          const n = g.name.toLowerCase()
          return n === 'indie' || n === 'casual'
        })
      })
    }

    // Cache for 2 hours — game lists are stable
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=7200, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching games from RAWG API:', error)

    // Return rich fallback with real RAWG cover art so the UI always looks great
    return NextResponse.json(
      { results: FALLBACK_GAMES, count: FALLBACK_GAMES.length, _fallback: true },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Short cache on fallback so the next page load retries the real API
          'Cache-Control': 'public, max-age=120, stale-while-revalidate=30',
        },
      }
    )
  }
}
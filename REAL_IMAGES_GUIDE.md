# Real Gaming Console Images - Direct URLs

## How to Use Real Images

You can use these free, high-quality Unsplash image URLs directly in your project. They are free for commercial use without attribution (though attribution is appreciated).

## Direct Unsplash Image URLs

### Gaming PC / Setup
```
https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80
https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80
https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80
```

### PlayStation Console
```
https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80
https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&q=80
https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&q=80
```

### Xbox Controller
```
https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80
https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&q=80
```

### Nintendo Switch
```
https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80
https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80
```

### Gaming Setup / General
```
https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80
https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80
https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80
```

## Quick Update Method

Update your `app/page.tsx` to use these URLs instead of the local SVG files.

Example:
```typescript
const consoles = [
  { 
    name: 'PlayStation 5', 
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80'
  },
  // ... other consoles
]
```

## Alternative: Download Images

If you prefer to host images locally:

1. Visit the URLs above in your browser
2. Right-click and "Save Image As..."
3. Save to `public/consoles/` or `public/games/`
4. Name them: ps5.jpg, xbox.jpg, switch.jpg, pc.jpg, etc.

## Recommended Approach

For best performance, I recommend downloading and optimizing images locally rather than using external URLs.

Sources: [Unsplash](https://unsplash.com) - All images are free to use

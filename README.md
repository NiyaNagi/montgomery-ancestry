# Montgomery Family Heritage Browser

An interactive, mobile-friendly static website for exploring the Montgomery family tree — **174 documented individuals** across **6 family lines** and **7+ generations**, from ~1740s Revolutionary-era Scotland to the present day.

## Features

- **Interactive Family Tree** — SVG-based visualization with zoom, pan, and click navigation
- **Person Detail Panel** — Comprehensive profiles with vital events, marriages, family links, and research notes
- **Real-time Search** — Fuzzy search across names, places, occupations, and notes with family line filters
- **6 Family Lines** — Thompson, Holmes, Smyth-Gies, Northwood, Montgomery, Smith-Rowe-Jones
- **Mobile-First** — Fully responsive from iPhone SE (375px) to 4K desktop
- **Accessible** — WCAG 2.1 AA compliant with keyboard navigation, skip links, focus management, and screen reader support
- **Deep Linking** — Hash-based routing for shareable URLs to any person or family line
- **No Framework** — Pure HTML5, CSS3, JavaScript ES6+ — no build step required

## Getting Started

### Quick Start

Simply open `index.html` in a browser, or serve it with any static file server:

```bash
npx http-server -p 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

### Development

```bash
npm install          # Install dev dependencies (for testing)
npm test             # Run all tests
npm run serve        # Start local dev server
```

## Architecture

```
├── index.html           # Main HTML page
├── css/
│   └── styles.css       # Complete stylesheet (mobile-first, CSS custom properties)
├── js/
│   ├── app.js           # Main application orchestrator
│   ├── data.js          # Data loading, querying, and formatting
│   ├── tree.js          # SVG tree visualization with zoom/pan
│   ├── person.js        # Person detail slide-in panel
│   └── search.js        # Search overlay with filters
├── data/
│   ├── people.json      # 174 person records
│   └── family-tree.json # 58 family units with relationships
└── tests/               # Jest unit tests
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Open search |
| `Escape` | Close search or person panel |
| `↑` `↓` | Navigate search results |
| `Enter` | Select search result |

## Data Sources

All data is derived from original family documents, including photographed typed and handwritten genealogical charts, cross-referenced with:

- WikiTree profiles
- FamilySearch records
- Find a Grave entries
- Ancestry.com indexes
- Census and church records

## Browser Support

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+
- Mobile Safari / Chrome on iOS/Android

## License

Private family project — not licensed for redistribution.

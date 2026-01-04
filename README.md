# Wrench Attack Visualization

Interactive visualization of physical Bitcoin/cryptocurrency attacks, based on data from [Jameson Lopp's curated list](https://github.com/jlopp/physical-bitcoin-attacks).

## Live Demo

**https://haseebq.com/wrench-attacks-viz/**

## Features

- **Severity Classification**: Attacks categorized from Minor (1) to Fatal (5)
- **Multiple Chart Views**: Stacked bar, cumulative area, pie chart distributions
- **Percentage Analysis**: Year-over-year severity breakdown comparisons
- **Interactive Details**: Click any year to see individual attack details
- **Trend Lines**: Track severe/fatal attack percentages over time

## Severity Levels

| Level | Label | Description |
|-------|-------|-------------|
| 5 | Fatal | Victim was killed |
| 4 | Severe | Kidnapping with torture, severed body parts, severe beatings, gunshot wounds |
| 3 | Serious | Armed robbery at gunpoint/knifepoint, kidnapping, home invasion with weapons |
| 2 | Moderate | Robbery with violence/assault, drugging, extortion with threats |
| 1 | Minor | Theft without confrontation, failed attempts, ATM/equipment theft |

## Data Source

All attack data is sourced from [github.com/jlopp/physical-bitcoin-attacks](https://github.com/jlopp/physical-bitcoin-attacks), a community-maintained list of documented physical attacks against cryptocurrency holders.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts

## License

MIT

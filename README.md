# Wrench Attack Visualization

Interactive visualization and statistical analysis of physical Bitcoin/cryptocurrency attacks, based on data from [Jameson Lopp's curated list](https://github.com/jlopp/physical-bitcoin-attacks).

## Live Demo

**https://haseebq.com/wrench-attacks-viz/**

## Features

### Attack Analysis
- **Severity Classification**: Attacks categorized from Minor (1) to Fatal (5)
- **Multiple Chart Views**: Stacked bar, cumulative area, pie chart distributions
- **Percentage Analysis**: Year-over-year severity breakdown comparisons
- **Interactive Details**: Click any year to see individual attack details
- **Trend Lines**: Track severe/fatal attack percentages over time

### Market Cap Correlation
- **Regression Analysis**: Statistical correlation between total crypto market cap and attack frequency
- **Monthly Granularity**: 144 data points from 2014-2025
- **Severity-Coded Charts**: Stacked bars showing attack severity distribution over time

### Denominator Analysis
- **Attacks per Million Users**: Using Coinbase verified users as a proxy for global crypto adoption
- **Attacks per $B Market Cap**: Normalized risk relative to total crypto wealth
- **Risk Rate Trends**: Track whether crypto has become safer or more dangerous per user/dollar

## Severity Levels

| Level | Label | Description |
|-------|-------|-------------|
| 5 | Fatal | Victim was killed |
| 4 | Severe | Kidnapping with torture, severed body parts, severe beatings, gunshot wounds |
| 3 | Serious | Armed robbery at gunpoint/knifepoint, kidnapping, home invasion with weapons |
| 2 | Moderate | Robbery with violence/assault, drugging, extortion with threats |
| 1 | Minor | Theft without confrontation, failed attempts, ATM/equipment theft |

## Data Sources

- **Attack Data**: [github.com/jlopp/physical-bitcoin-attacks](https://github.com/jlopp/physical-bitcoin-attacks) - community-maintained list of documented physical attacks
- **Market Cap Data**: Historical quarterly data from CoinMarketCap, interpolated to monthly
- **User Data**: Coinbase verified users (Business of Apps, Coinbase SEC filings)

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

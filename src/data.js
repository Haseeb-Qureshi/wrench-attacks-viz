// ============================================================================
// SINGLE SOURCE OF TRUTH - ALL ATTACK DATA
// Source: https://github.com/jlopp/physical-bitcoin-attacks
// ============================================================================

/**
 * SEVERITY CLASSIFICATION:
 *
 * 5 - FATAL: Victim was killed
 * 4 - SEVERE: Kidnapping with torture, severed body parts, severe beatings,
 *             gunshot wounds, prolonged captivity with violence, permanent injury
 * 3 - SERIOUS: Armed robbery at gunpoint/knifepoint, kidnapping without severe
 *              torture, home invasion with weapons, physical restraint
 * 2 - MODERATE: Robbery with some violence/assault, drugging, extortion with
 *               threats, pepper spray, punching
 * 1 - MINOR: Theft without confrontation, failed attempts, ATM/equipment theft,
 *            swatting without physical harm
 */

export const SEVERITY_LEVELS = {
  1: {
    label: 'Minor',
    description: 'Theft without confrontation, failed attempts, ATM/equipment theft',
    color: '#22c55e' // green
  },
  2: {
    label: 'Moderate',
    description: 'Robbery with some violence/assault, drugging, extortion',
    color: '#eab308' // yellow
  },
  3: {
    label: 'Serious',
    description: 'Armed robbery, kidnapping, home invasion at gunpoint/knifepoint',
    color: '#f97316' // orange
  },
  4: {
    label: 'Severe',
    description: 'Kidnapping with torture, severed body parts, severe beatings, gunshot wounds',
    color: '#ef4444' // red
  },
  5: {
    label: 'Fatal',
    description: 'Victim was killed',
    color: '#7c3aed' // purple
  }
};

// Geographic regions for analysis
export const REGIONS = {
  'North America': { color: '#3b82f6', label: 'North America' },      // blue
  'Western Europe': { color: '#8b5cf6', label: 'Western Europe' },    // purple
  'Eastern Europe': { color: '#ec4899', label: 'Eastern Europe' },    // pink
  'Asia-Pacific': { color: '#14b8a6', label: 'Asia-Pacific' },        // teal
  'South Asia': { color: '#f59e0b', label: 'South Asia' },            // amber
  'Latin America': { color: '#10b981', label: 'Latin America' },      // emerald
  'Middle East': { color: '#ef4444', label: 'Middle East' },          // red
  'Africa': { color: '#6366f1', label: 'Africa' },                    // indigo
};

// Map locations to regions
const regionPatterns = {
  'North America': ['United States', 'Canada'],
  'Western Europe': ['England', 'Netherlands', 'France', 'Germany', 'Austria', 'Italy', 'Spain', 'Belgium', 'Switzerland', 'Ireland', 'Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland', 'Portugal', 'Scotland', 'Wales', 'UK', 'Malta', 'Greece', 'Cyprus'],
  'Eastern Europe': ['Russia', 'Ukraine', 'Lithuania', 'Poland', 'Czech Republic', 'Romania', 'Bulgaria', 'Hungary', 'Slovakia', 'Belarus', 'Moldova', 'Latvia', 'Estonia', 'Georgia', 'Montenegro', 'Abkhazia'],
  'Latin America': ['Brazil', 'Mexico', 'Argentina', 'Colombia', 'Venezuela', 'Chile', 'Peru', 'Ecuador', 'Costa Rica', 'Panama', 'Dominican Republic', 'Puerto Rico', 'Honduras', 'El Salvador', 'Guatemala', 'Trinidad', 'Paraguay'],
  'Asia-Pacific': ['China', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong', 'Singapore', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia', 'Indonesia', 'Australia', 'New Zealand'],
  'South Asia': ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal'],
  'Middle East': ['UAE', 'Turkey', 'Israel', 'Saudi Arabia', 'Lebanon', 'Jordan', 'Iran', 'Dubai'],
  'Africa': ['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Egypt', 'Morocco', 'Uganda', 'Lagos'],
};

export const getRegion = (location) => {
  for (const [region, patterns] of Object.entries(regionPatterns)) {
    if (patterns.some(pattern => location.includes(pattern))) {
      return region;
    }
  }
  return 'Unknown';
};

// City coordinates for map visualization (approximate)
export const cityCoordinates = {
  // North America
  'Santa Barbara, California': [-119.7, 34.4],
  'Atlanta, Georgia': [-84.4, 33.7],
  'New York, New York': [-74.0, 40.7],
  'Los Angeles, California': [-118.2, 34.1],
  'Miami, Florida': [-80.2, 25.8],
  'Durham, North Carolina': [-78.9, 36.0],
  'Milwaukee, Wisconsin': [-87.9, 43.0],
  'Cumming, Georgia': [-84.1, 34.2],
  'West Palm Beach, Florida': [-80.1, 26.7],
  'Ottawa, Canada': [-75.7, 45.4],
  'Toronto, Ontario, Canada': [-79.4, 43.7],
  // Western Europe
  'Amsterdam, Netherlands': [4.9, 52.4],
  'London, England': [-0.1, 51.5],
  'Paris, France': [2.4, 48.9],
  'Toulouse, France': [1.4, 43.6],
  'Milan, Italy': [9.2, 45.5],
  'Wels, Austria': [14.0, 48.2],
  'Oslo, Norway': [10.8, 59.9],
  'Reykjavik, Iceland': [-22.0, 64.1],
  'Manchester, England': [-2.2, 53.5],
  'Delft, Netherlands': [4.4, 52.0],
  'Drouwenerveen, Netherlands': [6.8, 52.9],
  // Eastern Europe
  'Kyiv, Ukraine': [30.5, 50.5],
  'Moscow, Russia': [37.6, 55.8],
  'Kaunas, Lithuania': [23.9, 54.9],
  'Odessa, Ukraine': [30.7, 46.5],
  // Asia-Pacific
  'Hong Kong': [114.2, 22.3],
  'Singapore': [103.8, 1.4],
  'Tokyo, Japan': [139.7, 35.7],
  'Phuket, Thailand': [98.4, 7.9],
  'Sydney, Australia': [151.2, -33.9],
  // South Asia
  'Mumbai, India': [72.9, 19.1],
  'Delhi, India': [77.2, 28.6],
  // Latin America
  'Sao Paulo, Brazil': [-46.6, -23.6],
  'Florianopolis, Brazil': [-48.5, -27.6],
  'Buenos Aires, Argentina': [-58.4, -34.6],
  // Middle East
  'Dubai, UAE': [55.3, 25.3],
  'Istanbul, Turkey': [29.0, 41.0],
  // Africa
  'Johannesburg, South Africa': [28.0, -26.2],
  'Cape Town, South Africa': [18.4, -33.9],
};

// Helper to get coordinates for a location
export const getCoordinates = (location) => {
  // Try exact match first
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (location.includes(city.split(',')[0])) {
      return coords;
    }
  }
  // Return null if not found
  return null;
};

export const attacks = [
  {
    date: "2014-12-29",
    severity: 1,
    location: "Santa Barbara, California, United States",
    victim: "Hal Finney",
    type: "swatting",
    description: "Bitcoin developer SWATted after months of harassment & extortion",
    url: "https://archive.is/WvHB9"
  },
  {
    date: "2015-01-03",
    severity: 3,
    location: "Atlanta, Georgia, United States",
    victim: "Amanda McCollum",
    type: "armed_robbery",
    description: "BTM thieves strike smoke shop, fire gun",
    url: "https://archive.is/R98Nn"
  },
  {
    date: "2015-01-22",
    severity: 1,
    location: "Amsterdam, Netherlands",
    victim: "Martin Wismeijer",
    type: "theft",
    description: "Thieves steal 2 bitcoin ATMs",
    url: "https://archive.is/aP649"
  },
  {
    date: "2015-02-01",
    severity: 3,
    location: "New York, New York, United States",
    victim: "Dean Katz",
    type: "armed_robbery",
    description: "Bitcoin trader robbed of $12,000 at gunpoint",
    url: "https://archive.is/QeCwu"
  },
  {
    date: "2015-05-27",
    severity: 4,
    location: "New York, New York, United States",
    victim: "Dwayne Richards",
    type: "kidnapping",
    description: "Firefighter kidnapped, robbed of $1,100, & stabbed by crypto thieves",
    url: "https://web.archive.org/web/20170212084543/https://www.cnbc.com/2015/06/05/new-york-city-man-robbed-at-gunpoint-for-bitcoin.html"
  },
  {
    date: "2015-11-16",
    severity: 1,
    location: "Delft, Netherlands",
    victim: "Robert Nederhoed",
    type: "theft",
    description: "Thieves steal bitcoin ATM containing 2,000 EUR",
    url: "https://archive.is/jjSYk"
  },
  {
    date: "2016-07-11",
    severity: 3,
    location: "Kaunas, Lithuania",
    victim: "Tadas Kasputis",
    type: "kidnapping",
    description: "Cryptocurrency executive kidnapped at car wash",
    url: "https://archive.is/VDAjq"
  },
  {
    date: "2016-07-25",
    severity: 3,
    location: "West Palm Beach, Florida, United States",
    victim: "Steve Manos",
    type: "armed_robbery",
    description: "Bitcoin trader robbed of $28,000 at gunpoint",
    url: "https://archive.is/fQdH7"
  },
  {
    date: "2016-08-14",
    severity: 2,
    location: "Toronto, Ontario, Canada",
    victim: "Multiple",
    type: "robbery",
    description: "Police arrest teens in string of bitcoin-related robberies",
    url: "https://archive.is/wmHQ3"
  },
  {
    date: "2016-11-06",
    severity: 1,
    location: "Oudenbosch, Netherlands",
    victim: "Tivoli Brasserie",
    type: "theft",
    description: "Dutch Bitcoin ATM Owner Laughs at Thieves Who Took His Machine",
    url: "https://archive.is/ERN61"
  },
  {
    date: "2017-02-16",
    severity: 2,
    location: "London, England",
    victim: "Josoj",
    type: "robbery",
    description: "Robbery during Localbitcoins trade"
  },
  {
    date: "2017-02-26",
    severity: 3,
    location: "Florianopolis, Brazil",
    victim: "Rocelo Lopes' wife",
    type: "kidnapping",
    description: "Wife of crypto exchange owner kidnapped and ransomed",
    url: "https://archive.is/3Tzc8"
  },
  {
    date: "2017-03-14",
    severity: 3,
    location: "Dubai, UAE",
    victim: "3 Indian Bitcoin traders",
    type: "kidnapping",
    description: "3 Emiratis pose as cops, kidnap victims and rob them of 25 BTC",
    url: "https://archive.is/P5S6u"
  },
  {
    date: "2017-06-17",
    severity: 5,
    location: "Gifu, Japan",
    victim: "Miyuki Noda",
    type: "murder",
    description: "Woman strangled, attacker takes 100,000 yen worth of BTC",
    url: "https://archive.is/OmqRM"
  },
  {
    date: "2017-09-04",
    severity: 4,
    location: "Kyiv, Ukraine",
    victim: "Alexey Sherstne",
    type: "torture",
    description: "Man tortured for $50k in Bitcoins",
    url: "https://archive.is/2aCmP "
  },
  {
    date: "2017-10-16",
    severity: 1,
    location: "Durham, North Carolina, United States",
    victim: "Jameson Lopp",
    type: "swatting",
    description: "Bitcoin developer swatted & extorted",
    url: "https://archive.is/p5gEf"
  },
  {
    date: "2017-10-15",
    severity: 3,
    location: "Toulouse, France",
    victim: "Multiple",
    type: "armed_robbery",
    description: "4 bitcoin traders robbed at gunpoint",
    url: "https://archive.is/QHlfc"
  },
  {
    date: "2017-10-15",
    severity: 3,
    location: "Los Angeles, California, United States",
    victim: "Multiple",
    type: "armed_robbery",
    description: "Discount Bitcoin Bandits committed 5 robberies at gunpoint",
    url: "https://archive.is/D7MJS"
  },
  {
    date: "2017-11-04",
    severity: 2,
    location: "New York, New York, United States",
    victim: "Unidentified",
    type: "robbery",
    description: "Man robbed of $1.8M of ETH",
    url: "https://archive.is/Lt2bJ"
  },
  {
    date: "2017-11-15",
    severity: 3,
    location: "Istanbul, Turkey",
    victim: "Unidentified",
    type: "kidnapping",
    description: "Gang stole $2.83M in BTC from businessman",
    url: "https://archive.is/spoUT"
  },
  {
    date: "2017-12-15",
    severity: 1,
    location: "Reykjavik, Iceland",
    victim: "Unidentified",
    type: "theft",
    description: "600 Bitcoin ASICs stolen",
    url: "https://archive.is/0guO1"
  },
  {
    date: "2017-12-26",
    severity: 3,
    location: "Kyiv, Ukraine",
    victim: "Pavel Lerner",
    type: "kidnapping",
    description: "Bitcoin exchange owner kidnapped & ransomed for $1M",
    url: "https://archive.is/xsQAx"
  },
  {
    date: "2018-01-01",
    severity: 3,
    location: "Los Angeles, California, United States",
    victim: "T.W.",
    type: "home_invasion",
    description: "Home invasion by FBI impersonator who demanded laptop passwords to access cryptocurrency"
  },
  {
    date: "2018-01-03",
    severity: 3,
    location: "Milwaukee, Wisconsin, United States",
    victim: "Dallas",
    type: "armed_robbery",
    description: "Convicted felon accused of firing gun inside downtown Milwaukee condo during Bitcoin sale",
    url: "https://archive.is/Sj4Op"
  },
  {
    date: "2018-01-14",
    severity: 4,
    location: "Leningrad Oblast, Russia",
    victim: "Pavel Nyashin",
    type: "torture",
    description: "Blogger Who Boasted About Crypto Wealth Beaten and Robbed For $425k",
    url: "https://archive.is/OaOlP"
  },
  {
    date: "2018-01-15",
    severity: 3,
    location: "Phuket, Thailand",
    victim: "Maxsim Latsoka & Anna Nikurina",
    type: "kidnapping",
    description: "Russian gang steals 100,000 Euros in BTC from young Russian couple",
    url: "https://archive.is/9chQq"
  },
  {
    date: "2018-01-18",
    severity: 2,
    location: "North Point, Hong Kong",
    victim: "____ Lee",
    type: "robbery",
    description: "Bitcoin trader lured to bogus meeting and robbed of HK$1.4M",
    url: "https://archive.is/TfDBF"
  },
  {
    date: "2018-01-23",
    severity: 3,
    location: "Ottawa, Canada",
    victim: "Canadian Bitcoins",
    type: "armed_robbery",
    description: "Failed armed robbery attempt of Canadian bitcoin exchange",
    url: "https://archive.is/Qzqb5"
  },
  {
    date: "2018-01-27",
    severity: 3,
    location: "Moulsford, Oxfordshire, England",
    victim: "Danny Aston & Amy Jay",
    type: "home_invasion",
    description: "Armed home invasion of Bitcoin trading firm owner",
    url: "https://archive.is/rpCUg"
  },
  {
    date: "2018-01-29",
    severity: 3,
    location: "Cumming, Georgia, United States",
    victim: "Unidentified",
    type: "home_invasion",
    description: "Five men arrested for planning armed home invasion of bitcoin owner",
    url: "https://archive.is/hVDKF"
  },
  {
    date: "2018-01-15",
    severity: 3,
    location: "Odessa, Ukraine",
    victim: "Unidentified",
    type: "robbery",
    description: "Several men pose as bitcoin sellers, beat and rob buyer of 1.5 Million UAH ($57,000 USD)"
  },
  {
    date: "2018-02-09",
    severity: 4,
    location: "Amreli, India",
    victim: "Sailesh Bhatt",
    type: "torture",
    description: "Police Officers Beat, Extorted 200 BTC from Businessman",
    url: "https://archive.is/VctPq"
  },
  {
    date: "2018-02-21",
    severity: 2,
    location: "Taichung, Taiwan",
    victim: "____ Tai",
    type: "robbery",
    description: "Four men assault bitcoin seller & transfer 18 BTC",
    url: "https://archive.is/cGzd6"
  },
  {
    date: "2018-02-19",
    severity: 4,
    location: "Moscow, Russia",
    victim: "Unidentified",
    type: "torture",
    description: "Crypto investor has face mutilated, robbed of $1M in BTC",
    url: "https://archive.is/wUxu7"
  },
  {
    date: "2018-02-23",
    severity: 4,
    location: "Moscow, Russia",
    victim: "Yury Mayorov",
    type: "torture",
    description: "Crypto Developer Beaten, Robbed Of 300 BTC",
    url: "https://archive.is/YDbVR"
  },
  {
    date: "2018-03-01",
    severity: 3,
    location: "Killingly, Connecticut, United States",
    victim: "Undisclosed woman",
    type: "home_invasion",
    description: "2 women invaded home of another woman who had opened a Bitcoin account",
    url: "https://archive.is/wcpmV"
  },
  {
    date: "2018-03-15",
    severity: 3,
    location: "Kyiv, Ukraine",
    victim: "Unidentified Miner",
    type: "kidnapping",
    description: "Miner kidnapped, extorted for $50,000. Kidnappers caught 8 months later",
    url: "https://archive.is/ziAAR"
  },
  {
    date: "2018-03-22",
    severity: 2,
    location: "Irving & Mesquite, Texas, United States",
    victim: "Multiple gas stations",
    type: "robbery",
    description: "Robbers douse clerks with pepper spray, steal from Bitcoin ATMs",
    url: "https://archive.is/rODUM"
  },
  {
    date: "2018-04-08",
    severity: 2,
    location: "Singapore",
    victim: "Pang Joon Hau",
    type: "robbery",
    description: "Man seeking to buy BTC robbed of $365,000",
    url: "https://archive.is/IQMXP"
  },
  {
    date: "2018-04-11",
    severity: 3,
    location: "Miami, Florida, United States",
    victim: "Ryan Rice",
    type: "armed_robbery",
    description: "Bitcoin buyer shoots robber in self defense",
    url: "https://archive.is/wWiYd"
  },
  {
    date: "2018-04-25",
    severity: 3,
    location: "Dubai, UAE",
    victim: "2 unidentified Asian brothers",
    type: "armed_robbery",
    description: "Gang of 10 robbed two brothers of AED 7m ($1.9m) in cash",
    url: "https://archive.is/N5O0K"
  },
  {
    date: "2018-06-06",
    severity: 3,
    location: "Milan, Italy",
    victim: "Unidentified 22-year-old",
    type: "armed_robbery",
    description: "Robbers attempt bitcoin purchase with counterfeit money, beat victims and fire gun, take 50,000 euros",
    url: "https://archive.is/ls1QA"
  },
  {
    date: "2018-06-13",
    severity: 3,
    location: "China",
    victim: "Synth",
    type: "home_invasion",
    description: "Home invasion of Skycoin architect resulted in theft of 18.88 BTC and 6,466 SKY",
    url: "https://archive.is/fc3Mq"
  },
  {
    date: "2018-06-19",
    severity: 3,
    location: "Wels, Austria",
    victim: "Unidentified",
    type: "home_invasion",
    description: "$250,000 in cryptocurrency taken by robbers posing as postmen",
    url: "https://archive.is/kabJg"
  },
  {
    date: "2018-07-06",
    severity: 3,
    location: "Northborough, Massachusetts, United States",
    victim: "Austin Nedved",
    type: "home_invasion",
    description: "Armed home invasion of Localbitcoins trader",
    url: "https://archive.is/4of2h"
  },
  {
    date: "2018-09-07",
    severity: 4,
    location: "New York, New York, United States",
    victim: "Nicholas Truglia",
    type: "torture",
    description: "Friends accused of torturing pal to steal his cryptocurrency",
    url: "https://archive.is/PJYDN"
  },
  {
    date: "2018-11-01",
    severity: 4,
    location: "Manchester, England",
    victim: "Kieran Hamilton",
    type: "torture",
    description: "Crypto trader stabbed, robbed by home invaders"
  },
  {
    date: "2018-11-16",
    severity: 4,
    location: "Lanseria, South Africa",
    victim: "Andrew ______",
    type: "torture",
    description: "Bitcoin trader drugged, beaten, and tortured before transferring BTC to attackers",
    url: "https://archive.is/ASDBT"
  },
  {
    date: "2019-02-10",
    severity: 4,
    location: "Drouwenerveen, Netherlands",
    victim: "Tjeerd H.",
    type: "torture",
    description: "Bitcoin trader tortured with drill in front of daughter",
    url: "https://archive.is/drBqh"
  },
  {
    date: "2019-03-12",
    severity: 1,
    location: "Far Cotton, Northampton, England",
    victim: "Costcutters",
    type: "theft",
    description: "Bitcoin machine stolen during robbery",
    url: "https://archive.is/0lCv5"
  },
  {
    date: "2019-05-14",
    severity: 3,
    location: "Oslo, Norway",
    victim: "Undisclosed",
    type: "home_invasion",
    description: "Bitcoin millionaire escapes armed home invader by jumping off balcony",
    url: "https://archive.is/HfBWe"
  },
  {
    date: "2019-06-30",
    severity: 4,
    location: "Jaipur, Rajasthan, India",
    victim: "Luftan Shaikh, Mohammad Shazad, Malang Shah",
    type: "torture",
    description: "Criminal Gang Abducts & Tortures Cryptocurrency Traders, Demands 80 BTC Ransom",
    url: "https://archive.is/8PY9R"
  },
  {
    date: "2019-07-15",
    severity: 3,
    location: "Sparkhill, Birmingham, England",
    victim: "Bitcoin Exchange",
    type: "armed_robbery",
    description: "Masked raiders hold up Bitcoin Exchange in front of dozens of witnesses",
    url: "https://archive.is/fAoh0"
  },
  {
    date: "2019-07-26",
    severity: 2,
    location: "Wels, Austria",
    victim: "Unidentified",
    type: "robbery",
    description: "Man raided in office",
    url: "https://archive.is/HHicH"
  },
  {
    date: "2019-08-26",
    severity: 5,
    location: "Dehradun, India",
    victim: "Abdul Shakoor",
    type: "murder",
    description: "Kingpin of Kerala bitcoin scam murdered in Dehradun",
    url: "https://archive.is/O4Wno"
  },
  {
    date: "2019-11-19",
    severity: 1,
    location: "Vernon, British Columbia, Canada",
    victim: "Simply Delicious Food Market",
    type: "theft",
    description: "Thieves break into BTM",
    url: "https://archive.is/saynt"
  },
  {
    date: "2020-01-01",
    severity: 5,
    location: "Abraka, Nigeria",
    victim: "Iroro Wisdom Ovie",
    type: "murder",
    description: "Man shot & killed by home invaders seeking $10,000 in bitcoin"
  },
  {
    date: "2020-01-15",
    severity: 3,
    location: "Preston, Lancashire, England",
    victim: "17 y/o trader",
    type: "kidnapping",
    description: "Trader lured to apartment, kidnapped, driven around in car trunk"
  },
  {
    date: "2020-01-08",
    severity: 3,
    location: "Bangkok, Thailand",
    victim: "Mark Cheng Jin Quan",
    type: "kidnapping",
    description: "Blockchain advisor kidnapped, held at gunpoint, extorted for $60,000 in bitcoin",
    url: "https://archive.is/ad8AS"
  },
  {
    date: "2020-01-21",
    severity: 1,
    location: "Philadelphia, Pennsylvania, United States",
    victim: "Mayfair Quick Mart",
    type: "theft",
    description: "2 men break into BTM, steal cash box",
    url: "https://archive.is/MMAtb"
  },
  {
    date: "2020-02-10",
    severity: 3,
    location: "Carlisle, England",
    victim: "Unidentified couple",
    type: "home_invasion",
    description: "Home invaders force victims to create crypto exchange accounts",
    url: "https://archive.is/yLi4j"
  },
  {
    date: "2020-03-18",
    severity: 3,
    location: "Blantyre, Scotland",
    victim: "Unidentified siblings",
    type: "home_invasion",
    description: "Home invader beats woman with Toblerone, forces victim to transfer $200,000 of BTC",
    url: "https://archive.is/TZ9oq"
  },
  {
    date: "2020-05-17",
    severity: 3,
    location: "Ho Chi Minh City, Vietnam",
    victim: "Le Duc Nguyen",
    type: "kidnapping",
    description: "HCMC cops charged with $1.6 mln bitcoin robbery",
    url: "https://archive.md/T9g5e"
  },
  {
    date: "2020-05-19",
    severity: 1,
    location: "East Lansdowne, Pennsylvania, United States",
    victim: "Exxon Gas Station",
    type: "theft",
    description: "2 subjects pry open BTM in broad daylight"
  },
  {
    date: "2020-05-23",
    severity: 3,
    location: "Irvington, New York, United States",
    victim: "Ellis Pinsky",
    type: "home_invasion",
    description: "2 men commit home invasion of hacker, seeking tens of millions of dollars in bitcoin",
    url: "https://archive.is/ldlEZ"
  },
  {
    date: "2020-09-01",
    severity: 3,
    location: "Kent, England",
    victim: "Male Freshman",
    type: "armed_robbery",
    description: "Student robbed of bitcoin at knifepoint during first week at university",
    url: "https://archive.is/wH3Y2"
  },
  {
    date: "2020-10-01",
    severity: 4,
    location: "Kyiv, Ukraine",
    victim: "Unidentified",
    type: "torture",
    description: "Police kidnap a businessman, torture him, and force his wife to send them 7 bitcoin",
    url: "https://archive.is/LB3Nm"
  },
  {
    date: "2020-10-07",
    severity: 1,
    location: "Kelowna, British Columbia, Canada",
    victim: "Mike's Produce",
    type: "theft",
    description: "Botched Bitcoin theft destroys deli",
    url: "https://archive.is/xk8r2"
  },
  {
    date: "2020-10-22",
    severity: 1,
    location: "Riga, Latvia",
    victim: "Undisclosed",
    type: "planned",
    description: "Man arrested for planning kidnapping and killing owners of cryptocurrencies",
    url: "https://archive.is/3LnrJ"
  },
  {
    date: "2020-12-01",
    severity: 2,
    location: "Dubai, UAE",
    victim: "Undisclosed",
    type: "robbery",
    description: "4 Ukrainian men attack Bitcoin buyer with deodorant"
  },
  {
    date: "2020-12-24",
    severity: 4,
    location: "Ternopil, Ukraine",
    victim: "Undisclosed",
    type: "torture",
    description: "Man kidnapped and tortured for $800k",
    url: "https://archive.is/bx8kT"
  },
  {
    date: "2021-01-01",
    severity: 2,
    location: "Sliema, Malta",
    victim: "Dillon Attard",
    type: "robbery",
    description: "Victim describes his disbelief as $700,000 stolen in front of him",
    url: "https://archive.is/ypS03"
  },
  {
    date: "2021-01-05",
    severity: 2,
    location: "Chai Wan, Hong Kong",
    victim: "37 y/o man",
    type: "robbery",
    description: "Robbers take US$387,000 in cash, 15BTC from man after in-person trade",
    url: "https://archive.is/ps31W"
  },
  {
    date: "2021-01-18",
    severity: 3,
    location: "Kwun Tong, Hong Kong",
    victim: "Unidentified Woman",
    type: "armed_robbery",
    description: "Gang snatches HK$3.5 million from trader at knifepoint",
    url: "https://archive.is/3mR44"
  },
  {
    date: "2021-01-23",
    severity: 4,
    location: "Olsztyn, Poland",
    victim: "Physical Exchange Employees",
    type: "armed_robbery",
    description: "Two employees shot at physical Bitcoin exchange FlyingAtom",
    url: "https://archive.is/YOvMq"
  },
  {
    date: "2021-02-04",
    severity: 3,
    location: "Stockholm, Sweden",
    victim: "Married Couple",
    type: "home_invasion",
    description: "Armed robbers invade home and force owners to hand over 1M+ SEK in BTC",
    url: "https://archive.is/5qCBI"
  },
  {
    date: "2021-02-01",
    severity: 3,
    location: "Gujranwala, Pakistan",
    victim: "Swiss & German",
    type: "armed_robbery",
    description: "Armed robbers take $93k in BTC at gunpoint"
  },
  {
    date: "2021-03-10",
    severity: 4,
    location: "Recife, Brazil",
    victim: "Bank director",
    type: "torture",
    description: "Man kidnapped by a gang, tied up, and had two teeth knocked out. Released after 4.78 BTC transferred",
    url: "https://archive.is/KrFtE"
  },
  {
    date: "2021-03-16",
    severity: 2,
    location: "Munich, Germany",
    victim: "29 y/o Berlin man",
    type: "robbery",
    description: "Robbers steal bitcoin worth almost 100,000 Euros",
    url: "https://archive.is/H8Qix"
  },
  {
    date: "2021-03-18",
    severity: 3,
    location: "Mendoza, Argentina",
    victim: "F.T.",
    type: "armed_robbery",
    description: "Armed robbers steal iPhone, $5k at gunpoint",
    url: "https://archive.is/DpOQe"
  },
  {
    date: "2021-04-08",
    severity: 3,
    location: "Zaporizhya, Ukraine",
    victim: "30 year old miner",
    type: "armed_robbery",
    description: "Mining farm owner shoots at looters",
    url: "https://archive.is/WT3sm"
  },
  {
    date: "2021-04-13",
    severity: 3,
    location: "Calgary, Alberta, Canada",
    victim: "Undisclosed",
    type: "home_invasion",
    description: "Armed men force their way into Canyon Meadows home, steal cryptocurrency keys",
    url: "https://archive.is/GP76C"
  },
  {
    date: "2021-05-01",
    severity: 3,
    location: "Bradford, Yorkshire, England",
    victim: "14 y/o boy",
    type: "kidnapping",
    description: "Teen bitcoin trader kidnapped & ransomed",
    url: "https://archive.is/SUsgH"
  },
  {
    date: "2021-05-01",
    severity: 2,
    location: "Bethesda, Maryland, United States",
    victim: "___ Ghershony",
    type: "robbery",
    description: "Son drugs father, steals $400K in BTC",
    url: "https://archive.is/ezAnH"
  },
  {
    date: "2021-06-11",
    severity: 2,
    location: "Gyeonggi Province, South Korea",
    victim: "40 y/o man",
    type: "robbery",
    description: "Woman drugs man she met on chat app, steals $87K from his phone",
    url: "https://archive.is/e6FKx"
  },
  {
    date: "2021-06-14",
    severity: 4,
    location: "Kwun Tong, Hong Kong",
    victim: "22 y/o man",
    type: "torture",
    description: "Trader temporarily blinded, HK$2 million stolen",
    url: "https://archive.is/6h6UG"
  },
  {
    date: "2021-06-24",
    severity: 4,
    location: "Leeuwarden, Netherlands",
    victim: "39 y/o man",
    type: "torture",
    description: "3 men posing as service technicians beat password out of Bitcoin owner",
    url: "https://archive.md/xviCX"
  },
  {
    date: "2021-07-01",
    severity: 4,
    location: "Omsk, Russia",
    victim: "Unidentified man",
    type: "torture",
    description: "3 men kidnap and extort over $1M in crypto from victim"
  },
  {
    date: "2021-07-01",
    severity: 2,
    location: "Colombia",
    victim: "Unidentified man",
    type: "robbery",
    description: "Bitcoin holder drugged and robbed by Tinder date",
    url: "https://archive.is/uIMAl"
  },
  {
    date: "2021-07-14",
    severity: 3,
    location: "Lagos, Nigeria",
    victim: "Morakinyo Peter & Yusuf Dayo",
    type: "armed_robbery",
    description: "Law Enforcement Officers rob 2 men of $50K USD in bitcoin at gunpoint",
    url: "https://archive.md/Xdsmc"
  },
  {
    date: "2021-07-28",
    severity: 3,
    location: "Tsim Sha Tsui, Hong Kong",
    victim: "39 y/o man",
    type: "armed_robbery",
    description: "Trader robbed of HK$3 million at knifepoint",
    url: "https://archive.is/CeCA8"
  },
  {
    date: "2021-08-01",
    severity: 2,
    location: "Dubai, UAE",
    victim: "3 women",
    type: "robbery",
    description: "4 Africans rob three women of $100,000 in a fake Bitcoin deal"
  },
  {
    date: "2021-08-08",
    severity: 5,
    location: "Sao Pedro da Aldeia, Brazil",
    victim: "Wesley Pessano Santarem",
    type: "murder",
    description: "Crypto Trader's Murder Blamed On Social Media Bragging",
    url: "https://archive.is/2kfpq"
  },
  {
    date: "2021-08-18",
    severity: 5,
    location: "Plancher-Bas, France",
    victim: "Simon Arthuis",
    type: "murder",
    description: "Computer engineering student drugged, tortured, and killed by 5 men for €200,000 in cryptocurrency",
    url: "https://archive.md/7mvSY"
  },
  {
    date: "2021-09-01",
    severity: 1,
    location: "Abkhazia",
    victim: "Unidentified 31 y/o",
    type: "theft",
    description: "Thieves break into garage, steal 20 mining servers worth $10,000"
  },
  {
    date: "2021-09-09",
    severity: 3,
    location: "Westmere, New Zealand",
    victim: "Mark Geor",
    type: "home_invasion",
    description: "Safe containing $4M of cryptocurrency ripped from house",
    url: "https://archive.md/y8m24"
  },
  {
    date: "2021-10-01",
    severity: 3,
    location: "Tomsk, Russia",
    victim: "Miner",
    type: "home_invasion",
    description: "Armed Robbers attack Miner at his Home, Steal 86 BTC",
    url: "https://archive.is/n1IfA"
  },
  {
    date: "2021-10-07",
    severity: 1,
    location: "South Bay, California, United States",
    victim: "Liquor Store",
    type: "theft",
    description: "Thieves Break Into Liquor Store to Steal Bitcoin ATM",
    url: "https://archive.is/1caUw"
  },
  {
    date: "2021-10-20",
    severity: 5,
    location: "Abkhazia",
    victim: "Astamur Ardzibna",
    type: "murder",
    description: "Man Shot Dead in Hail of Gunfire Over Crypto Mining Rigs",
    url: "https://archive.is/zg4Kk"
  },
  {
    date: "2021-11-02",
    severity: 4,
    location: "Madrid, Spain",
    victim: "Zaryn Dentzel",
    type: "torture",
    description: "Home invaders torture social media founder, take tens of millions of euros in bitcoin",
    url: "https://archive.md/f5nIJ"
  },
  {
    date: "2021-11-06",
    severity: 4,
    location: "Hong Kong",
    victim: "39 y/o trader",
    type: "torture",
    description: "Crypto trader kidnapped by Triad gang, beaten with hammers",
    url: "https://archive.is/OnZVR"
  },
  {
    date: "2021-11-12",
    severity: 1,
    location: "Barcelona, Spain",
    victim: "GBTC Crypto Exchange",
    type: "theft",
    description: "Thieves rip bitcoin ATM from crypto store",
    url: "https://archive.md/AsIGX"
  },
  {
    date: "2021-11-21",
    severity: 3,
    location: "Los Angeles, California, United States",
    victim: "E.Z.",
    type: "kidnapping",
    description: "Attempted robbery & kidnapping at gunpoint by business associate",
    url: "https://archive.is/IX5jj"
  },
  {
    date: "2021-12-01",
    severity: 3,
    location: "Sukhumi, Abkhazia",
    victim: "Unidentified Family",
    type: "home_invasion",
    description: "2 masked men break into home, hold family at gunpoint before escaping with three servers and $2,040 in cash"
  },
  {
    date: "2021-12-11",
    severity: 3,
    location: "Bali, Indonesia",
    victim: "Camilla Guadagnuolo & Principe Nerini",
    type: "armed_robbery",
    description: "Robbers take $400K in cash & bitcoin at knifepoint",
    url: "https://archive.is/KJO7s"
  },
  {
    date: "2021-12-15",
    severity: 3,
    location: "Amsterdam, Netherlands",
    victim: "Vincent Everts",
    type: "home_invasion",
    description: "Armed home invaders threaten TV personality during livestream",
    url: "https://archive.md/tUbAz"
  },
  {
    date: "2021-12-27",
    severity: 4,
    location: "Thunder Bay, Ontario, Canada",
    victim: "2 unidentified males",
    type: "torture",
    description: "11 Inmates take 2 inmates hostage, force them to transfer cryptocurrency",
    url: "https://archive.is/5R0gB"
  },
  {
    date: "2022-01-16",
    severity: 1,
    location: "Memphis, Tennessee, United States",
    victim: "Gas Station",
    type: "theft",
    description: "Suspects smash gas station with truck, steal Bitcoin ATM",
    url: "https://archive.is/Zjfr2"
  },
  {
    date: "2022-01-21",
    severity: 3,
    location: "Hoboken, Belgium",
    victim: "34 y/o teacher",
    type: "home_invasion",
    description: "3 men invade home, fail to force owner to hand over 3M Euros of BTC",
    url: "https://archive.is/LgqrJ"
  },
  {
    date: "2022-01-26",
    severity: 3,
    location: "France",
    victim: "Owen Simonin",
    type: "home_invasion",
    description: "Fake insurance adjuster attempts armed home invasion, gets pushed and locked out by victim",
    url: "https://archive.is/746C7"
  },
  {
    date: "2022-02-01",
    severity: 4,
    location: "Missouri, United States",
    victim: "John Forsyth",
    type: "torture",
    description: "Crypto founder kidnapped, zip-tied, threatened to be thrown off bridge",
    url: "https://archive.is/Qhvjs"
  },
  {
    date: "2022-02-02",
    severity: 4,
    location: "Pune, India",
    victim: "Vinay Naik",
    type: "torture",
    description: "8 including cop arrested for kidnapping man to extort Bitcoin worth Rs 300 crore ($50 million USD)",
    url: "https://archive.is/UJG8J"
  },
  {
    date: "2022-02-03",
    severity: 4,
    location: "Surat, India",
    victim: "Vinay Jain",
    type: "torture",
    description: "Auto parts businessman brings suitcase full of $260K worth of cash to do an in-person crypto trade, gets beaten and robbed by 8 men",
    url: "https://archive.is/hMOJh"
  },
  {
    date: "2022-02-03",
    severity: 4,
    location: "Brooklyn, New York, United States",
    victim: "Ilya Basin",
    type: "torture",
    description: "Crypto consultant hog-tied, beaten during home invasion",
    url: "https://archive.is/DEA2C"
  },
  {
    date: "2022-03-01",
    severity: 3,
    location: "Dubai, UAE",
    victim: "bitcoin trader",
    type: "home_invasion",
    description: "4 men invade home, tie up man, steal $450K from safe",
    url: "https://archive.is/Ri5N9"
  },
  {
    date: "2022-03-02",
    severity: 3,
    location: "Miami, Florida, United States",
    victim: "Unidentified man",
    type: "armed_robbery",
    description: "Businessman ambushed by armed robber, has $1M watch & crypto wallet taken",
    url: "https://archive.is/tyzQa"
  },
  {
    date: "2022-03-04",
    severity: 2,
    location: "Pune, India",
    victim: "Electronics Dealer",
    type: "extortion",
    description: "Woman cop suspended for bid to extort crypto from trader",
    url: "https://archive.is/wPxv4"
  },
  {
    date: "2022-03-16",
    severity: 4,
    location: "New York, New York, United States",
    victim: "Pierrick Jamaux",
    type: "torture",
    description: "Crypto expert shot 5 times by robber seeking Richard Mille watch",
    url: "https://archive.is/LRGHO"
  },
  {
    date: "2022-03-30",
    severity: 3,
    location: "Los Angeles, California, United States",
    victim: "E.Z.",
    type: "home_invasion",
    description: "Attempted home invasion by 3 armed men; victim fired gun at attackers, who fled",
    url: "https://archive.is/IX5jj"
  },
  {
    date: "2022-04-01",
    severity: 3,
    location: "Dubai, UAE",
    victim: "Unidentified trader",
    type: "armed_robbery",
    description: "9 robbers invaded the office of a bitcoin trader and took over $1,000,000 in cash",
    url: "https://archive.is/MkVof"
  },
  {
    date: "2022-04-21",
    severity: 4,
    location: "Norrköping, Sweden",
    victim: "Unidentified couple",
    type: "torture",
    description: "Couple tied up and beaten, forced to transfer cryptocurrency",
    url: "https://archive.is/waBom"
  },
  {
    date: "2022-05-01",
    severity: 2,
    location: "London, England",
    victim: "4 victims",
    type: "robbery",
    description: "Multiple incidents of crypto muggings around London",
    url: "https://archive.is/rlae2"
  },
  {
    date: "2022-05-01",
    severity: 2,
    location: "Dubai, UAE",
    victim: "Unidentified man",
    type: "robbery",
    description: "Crypto expert assaulted & robbed by investors for losing money",
    url: "https://archive.is/Kvu77"
  },
  {
    date: "2022-05-20",
    severity: 3,
    location: "Klang, Malaysia",
    victim: "Factory Owner",
    type: "armed_robbery",
    description: "12 men rob aluminum factory, steal 180 Bitcoin ASICs",
    url: "https://archive.is/JjfwB"
  },
  {
    date: "2022-06-01",
    severity: 4,
    location: "Osaka, Japan",
    victim: "Undisclosed",
    type: "torture",
    description: "Son of Mitsubishi Electric CEO + 7 men kidnap, torture gym member for crypto assets",
    url: "https://archive.is/UWS2L"
  },
  {
    date: "2022-07-01",
    severity: 3,
    location: "Dubai, UAE",
    victim: "Asian Investor",
    type: "home_invasion",
    description: "Man suffers home invasion, loses ~$50,000 after attempting a face-to-face cash trade to buy bitcoin",
    url: "https://archive.is/OLid3"
  },
  {
    date: "2022-07-01",
    severity: 3,
    location: "Kuchino, Russia",
    victim: "Vkusvill Supermarket",
    type: "armed_robbery",
    description: "4 armed mask men rob warehouse, steal 100 GPUs",
    url: "https://archive.is/vg0Lo"
  },
  {
    date: "2022-08-06",
    severity: 3,
    location: "Manerba, Italy",
    victim: "30 y/o broker",
    type: "armed_robbery",
    description: "3 men follow a man home, hold him at knifepoint for BTC",
    url: "https://archive.is/qB84G"
  },
  {
    date: "2022-08-07",
    severity: 4,
    location: "Vrindavan Yojana, India",
    victim: "Arjun Bhargav",
    type: "torture",
    description: "3 men trick, abduct, torture realtor for 8 BTC",
    url: "https://archive.is/UlCSo"
  },
  {
    date: "2022-09-01",
    severity: 4,
    location: "Richmond, British Columbia, Canada",
    victim: "Middle Aged Couple",
    type: "torture",
    description: "Multiple suspects posing as police invade home, tie up residents, steal $10M in crypto",
    url: "https://archive.is/WtZ5A"
  },
  {
    date: "2022-09-06",
    severity: 3,
    location: "Lincolnshire, England",
    victim: "19 y/o hacker",
    type: "home_invasion",
    description: "3 men, 1 posing as a cop, arrested while attempting home invasion",
    url: "https://archive.is/K58cR"
  },
  {
    date: "2022-09-12",
    severity: 3,
    location: "Winnipeg, Canada",
    victim: "19 y/o man",
    type: "armed_robbery",
    description: "Man held at gunpoint, assaulted and tied up during Bitcoin trade",
    url: "https://archive.is/psytU"
  },
  {
    date: "2022-09-12",
    severity: 3,
    location: "Delray Beach, Florida, United States",
    victim: "Unidentified couple",
    type: "home_invasion",
    description: "Armed gang invades home, takes jewelry, electronics, cash. Tried but failed to drain Gemini account",
    url: "https://archive.is/34qpX"
  },
  {
    date: "2022-09-15",
    severity: 2,
    location: "Koh Samui, Thailand",
    victim: "Russian Couple",
    type: "robbery",
    description: "Russian couple extorted by gang of foreign men at coffee shop",
    url: "https://archive.is/VmHZx"
  },
  {
    date: "2022-09-15",
    severity: 4,
    location: "Homestead, Florida, United States",
    victim: "Unidentified young man",
    type: "torture",
    description: "Armed gang invades home, takes jewelry, electronics. Kidnapped & tortured victim, failed to find his bitcoin",
    url: "https://archive.is/34qpX"
  },
  {
    date: "2022-11-01",
    severity: 4,
    location: "Barrie, Ontario, Canada",
    victim: "Female A.T.",
    type: "torture",
    description: "A woman was kidnapped, tied to a chair, stripped naked, hit in the legs with a hammer, and burned while attackers demanded $1 million in bitcoin",
    url: "https://archive.is/Krld4"
  },
  {
    date: "2022-12-01",
    severity: 4,
    location: "Toronto, Ontario, Canada",
    victim: "Aiden Pleterski",
    type: "torture",
    description: "Crypto king abducted, tortured, and beaten for days as his kidnappers sought millions in ransom"
  },
  {
    date: "2022-12-01",
    severity: 3,
    location: "Moscow, Russia",
    victim: "Russian Businessman",
    type: "kidnapping",
    description: "Man kidnapped from his Bentley by 4 men, forced to give access to bitcoin wallet",
    url: "https://archive.is/zC9Tf"
  },
  {
    date: "2022-12-03",
    severity: 2,
    location: "Lelystad, Netherlands",
    victim: "Unidentified man",
    type: "robbery",
    description: "Man responds to ad to sell his bitcoin, is attacked by several men & forced to transfer 30K EUR worth of BTC & ETH",
    url: "https://archive.is/JNkaq"
  },
  {
    date: "2022-12-11",
    severity: 3,
    location: "Phuket, Thailand",
    victim: "2 Russians",
    type: "kidnapping",
    description: "2 men who work on a cryptocurrency were kidnapped and robbed",
    url: "https://archive.vn/el9Sc"
  },
  {
    date: "2022-12-12",
    severity: 3,
    location: "Philippines",
    victim: "Chinese businessman",
    type: "kidnapping",
    description: "Chinese businessman kidnapped and held for six days in the Philippines",
    url: "https://archive.vn/zSEIQ"
  },
  {
    date: "2022-12-22",
    severity: 4,
    location: "Little Elm, Texas, United States",
    victim: "Unidentified man",
    type: "torture",
    description: "Armed gang invades home, torture victims for 3 hours, take jewelry, fail to find hardware wallet with $1.4m",
    url: "https://archive.is/34qpX"
  },
  {
    date: "2023-01-05",
    severity: 2,
    location: "Salford, England",
    victim: "Karl Johnson",
    type: "extortion",
    description: "Man knocks on door, threatens to assault victim, leaves after he sends some cryptocurrency",
    url: "https://archive.is/GTCVg"
  },
  {
    date: "2023-01-14",
    severity: 3,
    location: "Barcelona, Spain",
    victim: "Crypto Company",
    type: "armed_robbery",
    description: "5 men stormed into a company's office armed with tasers and zip ties",
    url: "https://archive.is/tAU6I"
  },
  {
    date: "2023-01-25",
    severity: 3,
    location: "Salford, England",
    victim: "Karl Johnson",
    type: "armed_robbery",
    description: "2 men knock on door, threaten victim with knife, leave after he sends cryptocurrency",
    url: "https://archive.is/GTCVg"
  },
  {
    date: "2023-02-01",
    severity: 3,
    location: "Melbourne, Australia",
    victim: "Saudi Royal",
    type: "kidnapping",
    description: "TikTok influencer lures Saudi royal to her home where he was imprisoned until he handed over $40K in BTC",
    url: "https://archive.is/K2OW1"
  },
  {
    date: "2023-02-25",
    severity: 4,
    location: "Bali, Indonesia",
    victim: "Yuri Boytsov",
    type: "torture",
    description: "4 men invade crypto blogger's home, beat him until he transfers $284,000 in BTC",
    url: "https://archive.is/2R05l"
  },
  {
    date: "2023-02-27",
    severity: 2,
    location: "Medellin, Colombia",
    victim: "German man",
    type: "robbery",
    description: "20 year old Venezuelan woman drugs and robs man of 1 BTC",
    url: "https://archive.is/ZhIn5"
  },
  {
    date: "2023-03-09",
    severity: 4,
    location: "Sydney, Australia",
    victim: "Peter Vuong",
    type: "torture",
    description: "Gang kidnaps boyfriend of crypto trader's relative, demands $5M ransom while torturing him for 6 days",
    url: "https://archive.is/YommD"
  },
  {
    date: "2023-03-20",
    severity: 2,
    location: "Noida, India",
    victim: "Virendra Malik",
    type: "robbery",
    description: "Couple stages robbery to steal bitcoin from their friend, but he doesn't comply",
    url: "https://archive.is/iJ7td"
  },
  {
    date: "2023-03-29",
    severity: 5,
    location: "Seoul, South Korea",
    victim: "48 y/o woman",
    type: "murder",
    description: "4 men kidnap woman, steal crypto, murder her",
    url: "https://archive.is/c2HcG"
  },
  {
    date: "2023-04-01",
    severity: 4,
    location: "Dubai, UAE",
    victim: "Unidentified Woman",
    type: "torture",
    description: "Driver & 3 friends lured an investor into a fake deal, robbed, electrocuted, stripped naked, and took blackmail videos",
    url: "https://archive.is/geUM5"
  },
  {
    date: "2023-04-12",
    severity: 3,
    location: "Durham, North Carolina, United States",
    victim: "76 y/o couple",
    type: "home_invasion",
    description: "2 men posing as construction workers invade home, force transfer of $250K in crypto",
    url: "https://archive.is/Vp5J6"
  },
  {
    date: "2023-05-03",
    severity: 3,
    location: "Benalmádena, Spain",
    victim: "Unidentified man",
    type: "kidnapping",
    description: "3 men kidnap crypto businessman, demand €1 million ransom. He was rescued by police",
    url: "https://archive.is/AJHuG"
  },
  {
    date: "2023-05-26",
    severity: 1,
    location: "Houston, Texas, United States",
    victim: "Smoke Shop",
    type: "theft",
    description: "7 men arrested after ramming store with stolen truck in failed attempt to steal Bitcoin ATM",
    url: "https://archive.is/j7PbE"
  },
  {
    date: "2023-06-01",
    severity: 3,
    location: "Tel Aviv, Israel",
    victim: "Crypto Entrepreneur",
    type: "armed_robbery",
    description: "Crypto entrepreneur robbed at gunpoint in his home in Tel Aviv",
    url: "https://archive.is/mgD0B"
  },
  {
    date: "2023-07-16",
    severity: 3,
    location: "Queens, New York, United States",
    victim: "Unknown Couple",
    type: "home_invasion",
    description: "Fake FBI agents in Porsche tase and tie up couple, steal Mercedes, $40K in cash, crypto",
    url: "https://archive.is/iSRCc"
  },
  {
    date: "2023-09-03",
    severity: 3,
    location: "Phuket, Thailand",
    victim: "Italian man",
    type: "armed_robbery",
    description: "Russian MMA fighter & twin brother rob man of watches, seek Ledger wallet",
    url: "https://archive.is/oSGRU"
  },
  {
    date: "2023-10-01",
    severity: 4,
    location: "Cardishead, England",
    victim: "Karl Johnson",
    type: "torture",
    description: "Victim dragged into a flat, tied up, assaulted, locked in a cupboard all night until they received cryptocurrency",
    url: "https://archive.is/GTCVg"
  },
  {
    date: "2023-10-15",
    severity: 3,
    location: "Salford, England",
    victim: "Karl Johnson",
    type: "kidnapping",
    description: "Days after previous attack, victim was kidnapped, had bag placed over head, released after sending cryptocurrency",
    url: "https://archive.is/GTCVg"
  },
  {
    date: "2023-10-30",
    severity: 3,
    location: "Tbilisi, Georgia",
    victim: "Crypto Exchange",
    type: "armed_robbery",
    description: "6 men rob exchange office, take $900K USD in crypto",
    url: "https://archive.is/zHpPv"
  },
  {
    date: "2023-11-06",
    severity: 4,
    location: "Rönninge, Sweden",
    victim: "Middle-aged couple",
    type: "torture",
    description: "Couple tied up, beaten, and threatened with their own kitchen knives",
    url: "https://archive.is/ODWxI"
  },
  {
    date: "2023-11-10",
    severity: 4,
    location: "Montenegro",
    victim: "Binance Client",
    type: "torture",
    description: "Executives lured into fake business trip, kidnapped, forced to empty wallets of $12M USDT",
    url: "https://archive.is/3jxou"
  },
  {
    date: "2023-11-10",
    severity: 4,
    location: "Portland, Oregon, United States",
    victim: "21 y/o man",
    type: "torture",
    description: "4 men fly from FL to OR, kidnap target from apartment, torture him until he revealed seed phrase",
    url: "https://archive.is/pFhaX"
  },
  {
    date: "2023-11-30",
    severity: 3,
    location: "Salford, England",
    victim: "Karl Johnson",
    type: "kidnapping",
    description: "Victim was kidnapped from a friend's house, had bag placed over head, rescued by police after anonymous tip sent",
    url: "https://archive.is/GTCVg"
  },
  {
    date: "2023-12-25",
    severity: 3,
    location: "Izhevsk, Russia",
    victim: "23 y/o miner",
    type: "kidnapping",
    description: "Miner kidnapped from home, ransomed, rescued by police",
    url: "https://archive.is/XIPFP"
  },
  {
    date: "2024-01-16",
    severity: 4,
    location: "Cluj, Romania",
    victim: "42 y/o man",
    type: "torture",
    description: "Restaurant owner kidnapped, doused in diesel, force fed alcohol, has finger cut off, until he transferred $200K USD in crypto",
    url: "https://archive.is/eqj4y"
  },
  {
    date: "2024-01-31",
    severity: 3,
    location: "Phuket, Thailand",
    victim: "Belarusian couple (23 y/o man)",
    type: "kidnapping",
    description: "5 Russians arrested in crypto abduction case (~USD 801,200)",
    url: "https://archive.is/IcEmQ"
  },
  {
    date: "2024-03-01",
    severity: 2,
    location: "Scottsdale, Arizona, United States",
    victim: "Uber Riders",
    type: "robbery",
    description: "Fake Uber driver stole $200K+ in crypto from customers' Coinbase accounts by taking their phones",
    url: "https://archive.is/MfJer"
  },
  {
    date: "2024-03-10",
    severity: 3,
    location: "Montreal, Quebec, Canada",
    victim: "Young Couple",
    type: "kidnapping",
    description: "Gang of 4 kidnaps couple and robs them of $25,000 in cryptocurrency",
    url: "https://archive.is/tZB6N"
  },
  {
    date: "2024-03-15",
    severity: 2,
    location: "Samui Island, Thailand",
    victim: "___ Yevgini",
    type: "robbery",
    description: "Gang of 6 Russians robs Russian man and wife at coffee shop for 1.8 million baht in BTC",
    url: "https://archive.is/EnzIt"
  },
  {
    date: "2024-04-18",
    severity: 3,
    location: "Lianhe Zaobao, Singapore",
    victim: "11 Traders",
    type: "armed_robbery",
    description: "4 men rob suspected Chinese crypto gambling ring of $3M USD",
    url: "https://archive.is/ZW6GW"
  },
  {
    date: "2024-04-27",
    severity: 3,
    location: "Port Moody, British Columbia, Canada",
    victim: "Undisclosed",
    type: "home_invasion",
    description: "Violent home invasion, suspect arrested at airport and eventually sentenced to 7 years",
    url: "https://archive.is/UOFBy"
  },
  {
    date: "2024-05-05",
    severity: 2,
    location: "London, England",
    victim: "Quentin Cepeljac",
    type: "robbery",
    description: "Belgian barber brags about being successful crypto dealer to impress woman. She invites him to her luxury flat, which ends up being a wrench attack trap. Turned out he only had £6.71 in crypto",
    url: "https://archive.is/EBmqW"
  },
  {
    date: "2024-06-17",
    severity: 3,
    location: "London, England",
    victim: "Ramesh Nair",
    type: "home_invasion",
    description: "3 men armed with machetes invade home, force owner to transfer 1,000+ ETH",
    url: "https://archive.is/u3sUN"
  },
  {
    date: "2024-07-03",
    severity: 3,
    location: "Tseung Kwan, Hong Kong",
    victim: "3 y/o boy",
    type: "kidnapping",
    description: "2 women abduct toddler from mall, demand $660,000 USDT ransom",
    url: "https://archive.is/gMmvr"
  },
  {
    date: "2024-07-10",
    severity: 3,
    location: "Angers, France",
    victim: "Undisclosed Man",
    type: "home_invasion",
    description: "2 men invade home, threaten victim with knife & crowbar, demand 10,000 EUR",
    url: "https://archive.is/bVBGi"
  },
  {
    date: "2024-07-11",
    severity: 3,
    location: "Cyberjaya, Malaysia",
    victim: "Chinese National",
    type: "kidnapping",
    description: "18 people kidnap 2 victims, hold them for $1.2M ransom, get in shootout with police",
    url: "https://archive.is/foteq"
  },
  {
    date: "2024-07-12",
    severity: 4,
    location: "Bangkok, Thailand",
    victim: "British Crypto Trader",
    type: "torture",
    description: "5 people tie up trader, assault, and rob him",
    url: "https://archive.is/gDRlQ"
  },
  {
    date: "2024-07-22",
    severity: 3,
    location: "Bavdhan, India",
    victim: "26 y/o Trading Coach",
    type: "kidnapping",
    description: "Gang of 5 kidnaps trader and robs him at knifepoint of $18,000 in USDT",
    url: "https://archive.is/0WqWe"
  },
  {
    date: "2024-07-28",
    severity: 5,
    location: "Kyiv, Ukraine",
    victim: "29 y/o Moroccan man",
    type: "murder",
    description: "4 men kidnap foreigner, rob, & murder him for 3 BTC",
    url: "https://archive.is/GbuTI"
  },
  {
    date: "2024-07-29",
    severity: 3,
    location: "Tallinn, Estonia",
    victim: "Tim Heath",
    type: "home_invasion",
    description: "Crypto billionaire attacked at rental home by men posing as painters, successfully fights them off and prevents kidnapping",
    url: "https://archive.is/b26vs"
  },
  {
    date: "2024-08-07",
    severity: 3,
    location: "Puntarenas, Costa Rica",
    victim: "11 Israelis",
    type: "armed_robbery",
    description: "8 men, possibly police, overpower security guard, rob 11 tourists of 10+ BTC",
    url: "https://archive.is/ouViV"
  },
  {
    date: "2024-08-04",
    severity: 3,
    location: "Bangkok, Thailand",
    victim: "Ke Jibao",
    type: "home_invasion",
    description: "Gang of 4 Chinese nationals sneak into gated estate, commit armed home invasion, rob $2M USD of cryptocurrency",
    url: "https://archive.is/5LxCt"
  },
  {
    date: "2024-08-15",
    severity: 4,
    location: "Verdun, Quebec, Canada",
    victim: "Undisclosed",
    type: "torture",
    description: "3 men invade home of crypto entrepreneur, torture him for hours until he transfers $15K",
    url: "https://archive.is/xTNpu"
  },
  {
    date: "2024-08-25",
    severity: 3,
    location: "Danbury, Connecticut, United States",
    victim: "Radhika & Suchil Chetal",
    type: "kidnapping",
    description: "Parents of $243M heist thieves get carjacked & kidnapped in botched ransom plot",
    url: "https://archive.is/4qSqM"
  },
  {
    date: "2024-08-29",
    severity: 2,
    location: "Hougang, Singapore",
    victim: "19 y/o",
    type: "robbery",
    description: "Man seeks p2p trade of cash for USDT, punched by attackers, successfully escapes",
    url: "https://archive.is/01kOx"
  },
  {
    date: "2024-09-13",
    severity: 5,
    location: "Villa Carlos Paz, Argentina",
    victim: "Gabriel Di Noto",
    type: "murder",
    description: "Accountant / crypto trader met a woman on Tinder, likely drugged, beaten by several men, forced to transfer funds, then murdered",
    url: "https://archive.is/fwQC9"
  },
  {
    date: "2024-10-01",
    severity: 3,
    location: "Sofia, Bulgaria",
    victim: "35 y/o man",
    type: "kidnapping",
    description: "2 men posed as police, kidnapped victim, held a gun at his head for an hour and demanded 14 bitcoin from him. They failed to get any BTC",
    url: "https://web.archive.org/web/20241225224323/https://btvnovinite.bg/bulgaria/otvlichane-ot-mnimi-policai-za-14-bitkojna-razkaz-na-sluzhitel-na-sdvr-samo-pred-btv.html"
  },
  {
    date: "2024-10-27",
    severity: 3,
    location: "Chicago, Illinois, United States",
    victim: "3 Family Members and a Nanny",
    type: "kidnapping",
    description: "6 men accused of kidnapping family from Chicago townhouse and forcing a transfer of $15 million in cryptocurrency",
    url: "https://archive.is/TFbsx"
  },
  {
    date: "2024-11-01",
    severity: 3,
    location: "Las Vegas, Nevada, United States",
    victim: "Unidentified man",
    type: "kidnapping",
    description: "3 teens kidnap man who hosted a crypto event. Drove him out to the desert, forced him to transfer $4 million at gunpoint",
    url: "https://archive.is/suvfl"
  },
  {
    date: "2024-11-04",
    severity: 1,
    location: "Victoriaville, Québec, Canada",
    victim: "Forum Moderator",
    type: "planned",
    description: "Attempted kidnapping by 4 individuals who wanted to torture him to steal forum mod's bitcoins"
  },
  {
    date: "2024-11-06",
    severity: 3,
    location: "Toronto, Ontario, Canada",
    victim: "Dean Skurka",
    type: "kidnapping",
    description: "WonderFi CEO kidnapped during rush hour, held until $1M ransom paid",
    url: "https://archive.is/st5SP"
  },
  {
    date: "2024-11-08",
    severity: 3,
    location: "Phuket, Thailand",
    victim: "Viacheslav Leibov",
    type: "armed_robbery",
    description: "Tourist robbed by armed gang in friend's hotel room, forced to transfer $250K USDT",
    url: "https://archive.is/wRbOB"
  },
  {
    date: "2024-11-20",
    severity: 1,
    location: "United States",
    victim: "Gen Z Quant kid",
    type: "theft",
    description: "13 year old's dog stolen after he rug pulled a token on pump.fun",
    url: "https://archive.is/tqqpY"
  },
  {
    date: "2024-11-22",
    severity: 3,
    location: "Las Vegas, Nevada, United States",
    victim: "Undisclosed Man",
    type: "kidnapping",
    description: "Sex worker accused of kidnapping, stealing $300K in crypto from man she met at nightclub",
    url: "https://archive.is/jXCz4"
  },
  {
    date: "2024-12-01",
    severity: 2,
    location: "Chengdu, China",
    victim: "Wang Shu",
    type: "robbery",
    description: "Software engineer lured by X account promising sex, ambushed at hotel by a gang that robbed him of 6 BTC",
    url: "https://archive.is/moqsn"
  },
  {
    date: "2024-12-03",
    severity: 1,
    location: "Melbourne, Australia",
    victim: "Coinflip ATM",
    type: "theft",
    description: "Crypto ATM stolen from shopping center",
    url: "https://archive.is/l7rYI"
  },
  {
    date: "2024-12-15",
    severity: 4,
    location: "Ungasan, Bali, Indonesia",
    victim: "Igor Lermakov",
    type: "torture",
    description: "A Russian gang of 4 men ambushed a Ukrainian on the road in Bali. The victim was kidnapped and beaten until he handed over $200,000 in cryptocurrency",
    url: "https://archive.is/gIh5V"
  },
  {
    date: "2024-12-19",
    severity: 4,
    location: "Laboma Beach, Ghana",
    victim: "Benjamin Appiah Boateng",
    type: "torture",
    description: "Businessman lured to meeting, handcuffed, beaten, electrocuted for 15 hours before being rescued by police",
    url: "https://archive.is/7xNoz"
  },
  {
    date: "2024-12-24",
    severity: 3,
    location: "Brussels, Belgium",
    victim: "Stéphane Winkel's Wife",
    type: "kidnapping",
    description: "Wife of crypto influencer who bragged about wealth was kidnapped by 3 men, police chase led to car crash",
    url: "https://archive.is/6PkiL"
  },
  {
    date: "2024-12-24",
    severity: 2,
    location: "Limassol, Cyprus",
    victim: "Undisclosed Man",
    type: "robbery",
    description: "Christmas Eve Limassol heist as man gets away with 100 thousand Euros in cash",
    url: "https://archive.is/WgL08"
  },
  {
    date: "2024-12-25",
    severity: 3,
    location: "Karachi, Pakistan",
    victim: "Arsalan Malik",
    type: "kidnapping",
    description: "Crypto trader in Karachi, Pakistan abducted by 5 men in a police van and forced to transfer $340,000 at gunpoint",
    url: "https://archive.is/vUHzn"
  },
  {
    date: "2024-12-28",
    severity: 3,
    location: "Los Angeles, California, United States",
    victim: "Undisclosed",
    type: "home_invasion",
    description: "LAPD officer commits home invasion, robs $200,000 in cryptocurrency from 2 victims",
    url: "https://archive.is/2vbBw"
  },
  {
    date: "2025-01-01",
    severity: 3,
    location: "Saint-Genis-Pouilly, France",
    victim: "Influencer's father",
    type: "kidnapping",
    description: "Crypto influencer's father was kidnapped on New Year's Eve",
    url: "https://archive.is/ATZ7u"
  },
  {
    date: "2025-01-05",
    severity: 3,
    location: "Phuket, Thailand",
    victim: "Russian Man",
    type: "robbery",
    description: "Man attacked and tied up in hotel, refuses to give up phone password, is knocked out and has cash stolen",
    url: "https://archive.is/eI12f"
  },
  {
    date: "2025-01-13",
    severity: 1,
    location: "Miami, Florida, United States",
    victim: "Miami Jeweler",
    type: "planned",
    description: "Gang of 4 men arrested by FBI on their way to rob jeweler of $2M",
    url: "https://archive.is/Zn7dK"
  },
  {
    date: "2025-01-14",
    severity: 3,
    location: "Pattaya, Thailand",
    victim: "Masis Erkol",
    type: "kidnapping",
    description: "Man tied up in condo, forced to transfer $290,000 in cryptocurrency",
    url: "https://archive.is/ktr2P"
  },
  {
    date: "2025-01-16",
    severity: 3,
    location: "Makati, Philippines",
    victim: "Taehwa Kim",
    type: "kidnapping",
    description: "Korean bitcoin trader kidnapped, held hostage for 3 days. No crypto taken",
    url: "https://archive.is/FbOdh"
  },
  {
    date: "2025-01-20",
    severity: 2,
    location: "Jeju, South Korea",
    victim: "Chinese National",
    type: "robbery",
    description: "Gang of 6 people meet OTC trader in luxury hotel, assault and rob him of $580K in cash and crypto",
    url: "https://archive.is/16EQW"
  },
  {
    date: "2025-01-21",
    severity: 4,
    location: "Vierzon, France",
    victim: "David Balland & Wife",
    type: "torture",
    description: "Ledger co-founder & wife kidnapped and ransomed, his finger was severed, rescued by GIGN. Ransom was partially paid but later seized via Tether",
    url: "https://archive.is/J4nQB"
  },
  {
    date: "2025-01-24",
    severity: 3,
    location: "Troyes, France",
    victim: "30 y/o man",
    type: "kidnapping",
    description: "Crypto miner was lured to a meeting, taken hostage, 20K EUR ransom demanded. Police rescued him & arrested 4 suspects",
    url: "https://archive.is/ZGgxx"
  },
  {
    date: "2025-01-30",
    severity: 3,
    location: "Campo Limpo Paulista, Brazil",
    victim: "Brazilian Family",
    type: "home_invasion",
    description: "Criminals invade home, hold family hostage, force transfer of $16,000 USD in cryptocurrencies",
    url: "https://archive.is/gCRLe"
  },
  {
    date: "2025-02-01",
    severity: 2,
    location: "Okota, Lagos",
    victim: "Unidentified man",
    type: "robbery",
    description: "Woman conspires with brother & gang to rob her boyfriend of 3 iPhones and $10K USD of bitcoin",
    url: "https://archive.is/snVgV"
  },
  {
    date: "2025-02-02",
    severity: 3,
    location: "Costa del Sol, Spain",
    victim: "34 y/o man",
    type: "kidnapping",
    description: "Crypto trader randomly met men at a hotel and told them what he did for a living. They later invited him over, took him hostage, demanded 30K EUR ransom",
    url: "https://archive.is/bX3sr"
  },
  {
    date: "2025-02-08",
    severity: 3,
    location: "Paris, France",
    victim: "20 y/o man",
    type: "kidnapping",
    description: "Crypto investor lured to meeting by woman, abducted by 3 men who demand 40K EUR",
    url: "https://archive.is/jH9pD"
  },
  {
    date: "2025-02-24",
    severity: 4,
    location: "Jeju City, South Korea",
    victim: "30 y/o Chinese Man",
    type: "torture",
    description: "4 Chinese suspects stab man lured to perform a trade in hotel room, steal 85 million won",
    url: "https://archive.is/IZwbJ"
  },
  {
    date: "2025-02-28",
    severity: 3,
    location: "Ho Chi Minh City, Vietnam",
    victim: "Chinese Man",
    type: "kidnapping",
    description: "Chinese gang kidnaps victim, extorts 600,000 USDT, are quickly apprehended by police",
    url: "https://archive.is/qIgny"
  },
  {
    date: "2025-03-01",
    severity: 4,
    location: "Sweden",
    victim: "30 y/o man",
    type: "torture",
    description: "Victim kidnapped by gang who took him into the woods, kicked and punched him, poured gasoline over him, threatened to set him on fire, placed pliers to his hand, and threatened to cut off his fingers",
    url: "https://archive.is/JGtEj"
  },
  {
    date: "2025-03-02",
    severity: 3,
    location: "Houston, Texas, United States",
    victim: "Kaitlyn Siragusa",
    type: "home_invasion",
    description: "Popular Streamer Amouranth posts screenshot of $20M BTC wallet, becomes victim of armed home invasion. Her husband defended her by shooting an attacker",
    url: "https://archive.is/Yn8mp"
  },
  {
    date: "2025-03-13",
    severity: 3,
    location: "Lai Chi Kok, Hong Kong",
    victim: "41 y/o Wong",
    type: "robbery",
    description: "Man sells HK $318,000 worth of cryptocurrency, is then beaten with a stick and robbed of the cash he received",
    url: "https://archive.is/bhCYH"
  },
  {
    date: "2025-03-21",
    severity: 3,
    location: "Imbiribeira, Brazil",
    victim: "Retired Teacher",
    type: "kidnapping",
    description: "Crypto manager surveilled, mother kidnapped, ransomed for 5 BTC. 4 people were later arrested",
    url: "https://archive.is/1nyeP"
  },
  {
    date: "2025-03-23",
    severity: 4,
    location: "Ipiranga, Brazil",
    victim: "Spanish Businessman",
    type: "torture",
    description: "Man kidnapped by 2 fake police officers, held for a week and drugged, demanded $50M, escaped on his own",
    url: "https://archive.is/WnpO6"
  },
  {
    date: "2025-03-27",
    severity: 3,
    location: "Tsim Sha Tsui, Hong Kong",
    victim: "27 y/o Turkish man",
    type: "armed_robbery",
    description: "Man brought a bag containing €5 million in cash to trade for crypto when he was attacked by two assailants, one of whom slashed him with a knife. He fought them off",
    url: "https://archive.is/d6Fi1"
  },
  {
    date: "2025-03-29",
    severity: 5,
    location: "Mecauayan, Bulacan, Philippines",
    victim: "Anson Que",
    type: "murder",
    description: "Businessman lured by woman to house & taken hostage. Attackers demanded $20M in cryptocurrency & received over $3M in multiple tranches. They killed the victim anyway",
    url: "https://archive.is/PHT9w"
  },
  {
    date: "2025-04-13",
    severity: 3,
    location: "PIB Colony, Pakistan",
    victim: "Ismail",
    type: "kidnapping",
    description: "Gang poses as police, kidnaps victim, forces him to hand over Bitcoin",
    url: "https://archive.is/fpCPj"
  },
  {
    date: "2025-05-01",
    severity: 4,
    location: "Paris, France",
    victim: "Undisclosed man",
    type: "torture",
    description: "Father of crypto millionaire abducted in broad daylight, 5M EUR ransom demanded, finger severed before being rescued by police",
    url: "https://archive.is/AC9zg"
  },
  {
    date: "2025-05-06",
    severity: 4,
    location: "New York, New York, United States",
    victim: "28 y/o Italian man",
    type: "torture",
    description: "Crypto entrepreneur tortures man for weeks with a chainsaw & taser in a luxury $30K+ per month apartment. Victim escaped w/o giving up funds",
    url: "https://archive.is/bfLQt"
  },
  {
    date: "2025-05-09",
    severity: 2,
    location: "London, England",
    victim: "Jacob Irwin-Cline",
    type: "robbery",
    description: "American tourist drugged by fake Uber driver who drained wallets of $123K in BTC & XRP",
    url: "https://archive.is/zHpk2"
  },
  {
    date: "2025-05-13",
    severity: 3,
    location: "Paris, France",
    victim: "Pierre Noizat's daughter",
    type: "kidnapping",
    description: "Attempted abduction of crypto exchange CEO's daughter in broad daylight, caught on camera, attackers were fought off by her partner & bystanders",
    url: "https://archive.is/xCoD6"
  },
  {
    date: "2025-05-14",
    severity: 3,
    location: "Coronel Bogado, Paraguay",
    victim: "Mining Facility",
    type: "armed_robbery",
    description: "3 Chinese citizens entered Paraguay illegally, tried to rob a mining facility, got in a shootout with police, were deported",
    url: "https://archive.is/rm7nw"
  },
  {
    date: "2025-05-17",
    severity: 3,
    location: "Kampala, Uganda",
    victim: "Festo Ivaibi",
    type: "kidnapping",
    description: "Crypto founder abducted by men posing as military, forced to transfer $500,000 at gunpoint. One suspect later arrested",
    url: "https://archive.is/UfCv4"
  },
  {
    date: "2025-05-18",
    severity: 1,
    location: "Normandie, France",
    victim: "Mother & Son",
    type: "planned",
    description: "Victims were being surveilled, had GPS tracker placed on their car. Police counter-surveilled the kidnappers and arrested 5 people before they attacked",
    url: "https://archive.is/e33n2"
  },
  {
    date: "2025-05-21",
    severity: 2,
    location: "Seoul, South Korea",
    victim: "Unidentified man",
    type: "robbery",
    description: "Russian nationals lure victim to hotel for crypto trade, attempt to rob him of 1 billion won, but victim escaped",
    url: "https://archive.is/2kDp5"
  },
  {
    date: "2025-05-26",
    severity: 1,
    location: "Nantes, France",
    victim: "Crypto Entrepreneur",
    type: "planned",
    description: "Police arrest 10 men in balaclavas, foiling their attempted kidnapping of a crypto entrepreneur",
    url: "https://archive.is/0do15"
  },
  {
    date: "2025-05-27",
    severity: 3,
    location: "Buenos Aires, Argentina",
    victim: "Russian Couple",
    type: "kidnapping",
    description: "Chechens invite victims to dinner, take them hostage and demand ransom. A friend sends them $43,000 and they flee to UAE",
    url: "https://archive.is/2EHz4"
  },
  {
    date: "2025-06-13",
    severity: 3,
    location: "Juvisy-sur-Orge, France",
    victim: "26 y/o man",
    type: "kidnapping",
    description: "TikTok trader kidnapped by 4 men as he was returning home, attackers demanded 50K EUR, released after opening his wallet and finding a tiny balance",
    url: "https://archive.is/0DPMl"
  },
  {
    date: "2025-06-17",
    severity: 3,
    location: "Maisons-Alfort, France",
    victim: "23 y/o man",
    type: "kidnapping",
    description: "A 23-year-old man was held for several hours, and the kidnappers demanded a 5k ransom from his wife",
    url: "https://archive.is/YXMOD"
  },
  {
    date: "2025-06-24",
    severity: 5,
    location: "Goiania, Brazil",
    victim: "Undisclosed businessman",
    type: "murder",
    description: "Victim tricked into attending a business meeting that ended up being a wrench attack trap. Attack failed, 2 attackers were killed by police, mastermind was caught fleeing to Miami",
    url: "https://archive.is/fm3m3"
  },
  {
    date: "2025-06-25",
    severity: 2,
    location: "Bengaluru, India",
    victim: "33 y/o businessman",
    type: "robbery",
    description: "OTC trade of $240,000 worth of rupees into USDT. Half a dozen men interrupted the transaction and robbed him",
    url: "https://archive.is/fVpB3"
  },
  {
    date: "2025-06-30",
    severity: 2,
    location: "Bangkok, Thailand",
    victim: "3 people",
    type: "robbery",
    description: "OTC trade of $100,000 USD worth of baht for crypto in a mall parking garage. The 7 suspects had done smaller trades with the victims previously",
    url: "https://archive.is/60ICY"
  },
  {
    date: "2025-07-07",
    severity: 2,
    location: "Suresnes, France",
    victim: "Woman",
    type: "robbery",
    description: "A woman was attacked at her home and punched 10 times in front of her husband and children",
    url: "https://archive.is/fg6Kt"
  },
  {
    date: "2025-07-08",
    severity: 3,
    location: "Queens, New York, United States",
    victim: "38 y/o man",
    type: "kidnapping",
    description: "Victim kidnapped by 6 men and held for 10 days until he transferred $6,000 in fiat & cryptocurrency",
    url: "https://archive.is/GPd1J"
  },
  {
    date: "2025-07-14",
    severity: 3,
    location: "Jodhpur, India",
    victim: "Dilip Gaud & Ramesh Sharma",
    type: "extortion",
    description: "5 constables kidnap 2 men and extort them with threats of false criminal charges until they handed over cash and $9,000 USD worth of cryptocurrency. Cops were later arrested and fired",
    url: "https://archive.is/C0MNZ"
  },
  {
    date: "2025-07-15",
    severity: 3,
    location: "Ahmedabad, India",
    victim: "Prince Pandey",
    type: "kidnapping",
    description: "3 men lured a trader into a trap and assaulted him while demanding 50,000 USDT. The victim's father contacted police and they managed to find and rescue him",
    url: "https://archive.is/C0MNZ"
  },
  {
    date: "2025-08-02",
    severity: 3,
    location: "Parañaque City, Philippines",
    victim: "30 y/o man",
    type: "kidnapping",
    description: "4 Chinese nationals kidnapped a man seeking money transfer services. Victim was handcuffed, threatened with a firearm, physically harmed, and forced to transfer $50,000",
    url: "https://archive.is/rBbGz"
  },
  {
    date: "2025-08-05",
    severity: 4,
    location: "Paris, France",
    victim: "Unidentified man",
    type: "torture",
    description: "5 men threatened, kidnapped, and beat a crypto industry worker before stealing 2M euros in bitcoin from him. The attackers were quickly captured by police",
    url: "https://archive.is/L0XLU"
  },
  {
    date: "2025-08-06",
    severity: 3,
    location: "Oslo, Norway",
    victim: "Norwegian family",
    type: "home_invasion",
    description: "Robbers posing as food-delivery workers tied up a family with three children in their home and threatened to shoot the mother unless the family handed over their cryptocurrency",
    url: "https://archive.is/GmRDF"
  },
  {
    date: "2025-08-22",
    severity: 3,
    location: "Colombo, Sri Lanka",
    victim: "Chinese businessman",
    type: "kidnapping",
    description: "Chinese nationals kidnap man, hold him hostage for a day until he hands over 60,000 USDT",
    url: "https://archive.is/CpNB6"
  },
  {
    date: "2025-08-26",
    severity: 3,
    location: "Paris, France",
    victim: "Alexandre, Crypto trader",
    type: "kidnapping",
    description: "A former cryptocurrency trader, aged 35, was kidnapped and held captive between Paris and Saint-Germain-en-Laye. The kidnappers demanded €10K from his wife for his release",
    url: "https://archive.is/LATvI"
  },
  {
    date: "2025-08-27",
    severity: 2,
    location: "Phuket, Thailand",
    victim: "Alexander",
    type: "robbery",
    description: "A Russian national went to a house for a business investment consultation. When he arrived a group of 4 Russians assaulted him and forced him to transfer 35,000 USDT",
    url: "https://archive.is/XzQvE"
  },
  {
    date: "2025-08-29",
    severity: 4,
    location: "Valence, Drôme, France",
    victim: "23 y/o Swiss man",
    type: "torture",
    description: "A man was kidnapped and tortured for 4 days, possible mistaken identity. He was rescued by GIGN and 7 suspects were arrested",
    url: "https://archive.is/KA4wX"
  },
  {
    date: "2025-09-05",
    severity: 3,
    location: "Cambridge, Ontario, Canada",
    victim: "Undisclosed Youth",
    type: "kidnapping",
    description: "Victim forced into a van by 5 men, physically assaulted, threatened with a gun. Released after being forced to transfer cryptocurrency",
    url: "https://archive.is/nB1Y4"
  },
  {
    date: "2025-09-07",
    severity: 4,
    location: "Herzliya, Israel",
    victim: "Israeli man",
    type: "torture",
    description: "Armed home-invasion: attackers bound and stabbed the resident, forced him to open an Exodus wallet and transferred ~4.94862 BTC and ~42,248.5 USDT (total ≈ $590k), stole a Trezor hardware wallet, laptop and a Rolex",
    url: "https://archive.is/dTgTi"
  },
  {
    date: "2025-09-19",
    severity: 3,
    location: "Grant, Minnesota, United States",
    victim: "Family",
    type: "home_invasion",
    description: "Two brothers from Texas held a MN family hostage at gunpoint for nine hours, forced the father to drive 3 hours to the family cabin to transfer $36,000 in crypto. Son called 911 and attackers were caught",
    url: "https://archive.is/gUrIl"
  },
  {
    date: "2025-09-26",
    severity: 3,
    location: "Rambouillet, Yvelines, France",
    victim: "42 y/o man",
    type: "kidnapping",
    description: "Three men and a woman climbed over the fence of a crypto entrepreneur's property to kidnap him",
    url: "https://archive.is/WIFaf"
  },
  {
    date: "2025-09-28",
    severity: 3,
    location: "Tierp, Sweden",
    victim: "Farmer Family",
    type: "home_invasion",
    description: "Four people arrested after robbing family of millions of dollars worth of cryptocurrency",
    url: "https://archive.is/HhUTP"
  },
  {
    date: "2025-10-01",
    severity: 3,
    location: "Val-de-Marne, France",
    victim: "Family",
    type: "home_invasion",
    description: "A woman and her two children were threatened by two masked individuals in order to blackmail her husband, who is a crypto investor",
    url: "https://archive.is/El9EI"
  },
  {
    date: "2025-10-02",
    severity: 5,
    location: "Dubai, UAE",
    victim: "Roman & Anna Novak",
    type: "murder",
    description: "Russian crypto scammer kidnapped, ransomed, murdered, dismembered by Russian nationals after ransom demands were not met",
    url: "https://archive.is/VDkTy"
  },
  {
    date: "2025-10-10",
    severity: 4,
    location: "Kharkiv, Ukraine",
    victim: "Unidentified man",
    type: "torture",
    description: "Man kidnapped by 3 men in military uniform. He was zip tied, beaten, and threatened with weapons while being held hostage in a basement. Victim released after he transferred 83,000 USDT",
    url: "https://archive.is/CVTeL"
  },
  {
    date: "2025-10-23",
    severity: 4,
    location: "Sanur Beach, Bali, Indonesia",
    victim: "Sergei Domogatskii",
    type: "torture",
    description: "Russian influencer kidnapped, beaten, tased, until he transferred $4,600 in cryptocurrency. Attackers later demanded $1M which he couldn't pay, after which he was released",
    url: "https://archive.is/f0FuS"
  },
  {
    date: "2025-10-01",
    severity: 3,
    location: "Kahna, Pakistan",
    victim: "Waleed",
    type: "kidnapping",
    description: "Bitcoin trader kidnapped by 2 cops & 2 other attackers, released after family paid $45K ransom"
  },
  {
    date: "2025-11-01",
    severity: 3,
    location: "Bangkok, Thailand",
    victim: "Chinese Man",
    type: "kidnapping",
    description: "3 men kidnap victim off street, force him to send $9,375 USDT. Attackers were later arrested",
    url: "https://archive.is/Im7f5"
  },
  {
    date: "2025-11-04",
    severity: 3,
    location: "Oxford, England",
    victim: "Multiple",
    type: "armed_robbery",
    description: "Car with 3 women & 2 men robbed by 4 men, who forced an occupant to transfer £1.1 million in cryptocurrency. Attackers were later arrested",
    url: "https://archive.is/87cGU"
  },
  {
    date: "2025-11-22",
    severity: 3,
    location: "San Francisco, California, United States",
    victim: "Undisclosed",
    type: "home_invasion",
    description: "Armed robber posing as a delivery worker invaded home, tied up the homeowner, took $11 million worth of cryptocurrency",
    url: "https://archive.is/Jecih"
  },
  {
    date: "2025-11-22",
    severity: 3,
    location: "Chalon-sur-Saône, France",
    victim: "French man",
    type: "kidnapping",
    description: "Six men, including two minors, are suspected of having attempted to kidnap a man holding crypto for the fourth time",
    url: "https://archive.is/1QbNM"
  },
  {
    date: "2025-11-24",
    severity: 2,
    location: "St. Petersburg, Russia",
    victim: "Crypto Exchange",
    type: "robbery",
    description: "21 y/o man robs exchange office with airsoft grenades & smoke grenades. He demanded employees transfer cryptocurrency to his wallet. He was arrested at the scene",
    url: "https://archive.is/AbPaI"
  },
  {
    date: "2025-11-26",
    severity: 5,
    location: "Vienna, Austria",
    victim: "Danylo K",
    type: "murder",
    description: "Son of Ukrainian mayor of Kharkiv betrayed by fellow student, tortured, burned to death after revealing cryptocurrency wallets",
    url: "https://archive.is/FgjJ8"
  },
  {
    date: "2025-12-01",
    severity: 3,
    location: "Val-d'Oise, France",
    victim: "53 y/o man",
    type: "kidnapping",
    description: "The father of a crypto entrepreneur based in Dubai was kidnapped by 4 people",
    url: "https://archive.is/Phwb0"
  }
];

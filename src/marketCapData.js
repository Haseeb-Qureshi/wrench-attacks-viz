// Historical Total Crypto Market Cap Data (Quarterly)
// Sources: CoinMarketCap, CoinGecko, Statista historical data
// Values in billions USD

export const marketCapData = [
  // 2014
  { date: "2014-03-31", marketCap: 7.5 },
  { date: "2014-06-30", marketCap: 8.0 },
  { date: "2014-09-30", marketCap: 5.5 },
  { date: "2014-12-31", marketCap: 5.5 },

  // 2015
  { date: "2015-03-31", marketCap: 4.0 },
  { date: "2015-06-30", marketCap: 4.5 },
  { date: "2015-09-30", marketCap: 4.0 },
  { date: "2015-12-31", marketCap: 7.0 },

  // 2016
  { date: "2016-03-31", marketCap: 8.5 },
  { date: "2016-06-30", marketCap: 13.0 },
  { date: "2016-09-30", marketCap: 12.0 },
  { date: "2016-12-31", marketCap: 17.7 },

  // 2017 - Bull run year
  { date: "2017-03-31", marketCap: 25.0 },
  { date: "2017-06-30", marketCap: 100.0 },
  { date: "2017-09-30", marketCap: 145.0 },
  { date: "2017-12-31", marketCap: 613.0 },

  // 2018 - Bear market
  { date: "2018-03-31", marketCap: 265.0 },
  { date: "2018-06-30", marketCap: 255.0 },
  { date: "2018-09-30", marketCap: 220.0 },
  { date: "2018-12-31", marketCap: 130.0 },

  // 2019
  { date: "2019-03-31", marketCap: 143.0 },
  { date: "2019-06-30", marketCap: 290.0 },
  { date: "2019-09-30", marketCap: 220.0 },
  { date: "2019-12-31", marketCap: 193.0 },

  // 2020 - COVID crash then recovery
  { date: "2020-03-31", marketCap: 182.0 },
  { date: "2020-06-30", marketCap: 263.0 },
  { date: "2020-09-30", marketCap: 345.0 },
  { date: "2020-12-31", marketCap: 760.0 },

  // 2021 - Major bull run
  { date: "2021-03-31", marketCap: 1950.0 },
  { date: "2021-06-30", marketCap: 1400.0 },
  { date: "2021-09-30", marketCap: 1900.0 },
  { date: "2021-12-31", marketCap: 2200.0 },

  // 2022 - Bear market (Luna, FTX)
  { date: "2022-03-31", marketCap: 2050.0 },
  { date: "2022-06-30", marketCap: 900.0 },
  { date: "2022-09-30", marketCap: 950.0 },
  { date: "2022-12-31", marketCap: 830.0 },

  // 2023 - Recovery
  { date: "2023-03-31", marketCap: 1200.0 },
  { date: "2023-06-30", marketCap: 1180.0 },
  { date: "2023-09-30", marketCap: 1080.0 },
  { date: "2023-12-31", marketCap: 1700.0 },

  // 2024 - ETF approval, new ATH
  { date: "2024-03-31", marketCap: 2700.0 },
  { date: "2024-06-30", marketCap: 2350.0 },
  { date: "2024-09-30", marketCap: 2200.0 },
  { date: "2024-12-31", marketCap: 3300.0 },

  // 2025
  { date: "2025-03-31", marketCap: 2800.0 },
  { date: "2025-06-30", marketCap: 3100.0 },
  { date: "2025-09-30", marketCap: 3500.0 },
  { date: "2025-12-31", marketCap: 3100.0 },
];

// Helper to get market cap for a given date (returns closest quarterly value)
export const getMarketCapForDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  const quarterEnd = new Date(year, quarter * 3, 0);
  const quarterEndStr = quarterEnd.toISOString().split('T')[0];

  const entry = marketCapData.find(d => d.date === quarterEndStr);
  return entry ? entry.marketCap : null;
};

// Get yearly average market cap
export const getYearlyMarketCap = () => {
  const yearlyData = {};

  marketCapData.forEach(({ date, marketCap }) => {
    const year = date.substring(0, 4);
    if (!yearlyData[year]) {
      yearlyData[year] = { total: 0, count: 0 };
    }
    yearlyData[year].total += marketCap;
    yearlyData[year].count += 1;
  });

  return Object.entries(yearlyData).map(([year, data]) => ({
    year,
    avgMarketCap: Math.round(data.total / data.count),
  }));
};

// Get monthly interpolated market cap data
export const getMonthlyMarketCap = () => {
  const monthly = [];

  // Convert quarterly data to timestamps for interpolation
  const quarterlyPoints = marketCapData.map(d => ({
    timestamp: new Date(d.date).getTime(),
    marketCap: d.marketCap
  }));

  // Generate monthly data points
  const startDate = new Date('2014-01-01');
  const endDate = new Date('2025-12-31');

  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const timestamp = d.getTime();

    // Find surrounding quarterly points for interpolation
    let before = null;
    let after = null;

    for (let i = 0; i < quarterlyPoints.length; i++) {
      if (quarterlyPoints[i].timestamp <= timestamp) {
        before = quarterlyPoints[i];
      }
      if (quarterlyPoints[i].timestamp >= timestamp && !after) {
        after = quarterlyPoints[i];
      }
    }

    let marketCap;
    if (!before) {
      marketCap = after ? after.marketCap : null;
    } else if (!after) {
      marketCap = before.marketCap;
    } else if (before.timestamp === after.timestamp) {
      marketCap = before.marketCap;
    } else {
      // Linear interpolation
      const ratio = (timestamp - before.timestamp) / (after.timestamp - before.timestamp);
      marketCap = before.marketCap + ratio * (after.marketCap - before.marketCap);
    }

    if (marketCap !== null) {
      monthly.push({
        month: monthKey,
        year,
        monthNum: month,
        marketCap: Math.round(marketCap * 10) / 10
      });
    }
  }

  return monthly;
};

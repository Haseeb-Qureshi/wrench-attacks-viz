import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Scatter } from 'recharts';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { SEVERITY_LEVELS, attacks, REGIONS, getRegion } from './data';
import { getMonthlyMarketCap, coinbaseUsers, getYearlyMarketCap } from './marketCapData';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getYear = (date) => date.substring(0, 4);

const getStatistics = () => {
  const severityCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const yearlyData = {};
  
  attacks.forEach(attack => {
    severityCounts[attack.severity]++;
    const year = getYear(attack.date);
    if (!yearlyData[year]) {
      yearlyData[year] = { year, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, total: 0 };
    }
    yearlyData[year][`s${attack.severity}`]++;
    yearlyData[year].total++;
  });
  
  return {
    total: attacks.length,
    severityCounts,
    yearlyData: Object.values(yearlyData).sort((a, b) => a.year.localeCompare(b.year))
  };
};

// Simple linear regression
const linearRegression = (data, xKey, yKey) => {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0, rSquared: 0, correlation: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  data.forEach(point => {
    const x = point[xKey];
    const y = point[yKey];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Correlation coefficient (Pearson's r)
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const correlation = denominator !== 0 ? numerator / denominator : 0;
  const rSquared = correlation * correlation;

  return { slope, intercept, rSquared, correlation };
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function BitcoinAttacksApp() {
  const [activeChart, setActiveChart] = useState('severity');
  const [chartView, setChartView] = useState('stacked');
  const [selectedYear, setSelectedYear] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const stats = getStatistics();
  const { severityCounts, yearlyData } = stats;
  
  // Calculate percentage data (ensure they sum to exactly 100)
  const percentageData = yearlyData.map(row => {
    const p1 = Math.round((row.s1 / row.total) * 100);
    const p2 = Math.round((row.s2 / row.total) * 100);
    const p3 = Math.round((row.s3 / row.total) * 100);
    const p4 = Math.round((row.s4 / row.total) * 100);
    const p5 = 100 - p1 - p2 - p3 - p4; // Ensure exact 100% total
    return {
      year: row.year,
      total: row.total,
      p1, p2, p3, p4, p5,
      c1: row.s1, c2: row.s2, c3: row.s3, c4: row.s4, c5: row.s5,
    };
  });
  
  // Pie chart data
  const pieData = Object.entries(severityCounts).map(([severity, count]) => ({
    name: SEVERITY_LEVELS[severity].label,
    value: count,
    severity: parseInt(severity)
  }));
  
  // Get attacks for selected year
  const selectedYearAttacks = selectedYear 
    ? attacks.filter(a => a.date.startsWith(selectedYear)).sort((a, b) => b.severity - a.severity)
    : [];

  // Market cap correlation data (monthly)
  const marketCapCorrelation = useMemo(() => {
    const monthlyMarketCap = getMonthlyMarketCap();

    // Calculate monthly attack counts with severity breakdown
    const monthlyAttacks = {};
    attacks.forEach(attack => {
      const month = attack.date.substring(0, 7); // "YYYY-MM"
      if (!monthlyAttacks[month]) {
        monthlyAttacks[month] = { total: 0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 };
      }
      monthlyAttacks[month].total += 1;
      monthlyAttacks[month][`s${attack.severity}`] += 1;
    });

    // Merge monthly attacks with market cap
    const combined = monthlyMarketCap.map(mc => {
      const attackData = monthlyAttacks[mc.month] || { total: 0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 };
      return {
        month: mc.month,
        year: mc.year,
        attacks: attackData.total,
        s1: attackData.s1,
        s2: attackData.s2,
        s3: attackData.s3,
        s4: attackData.s4,
        s5: attackData.s5,
        marketCap: mc.marketCap,
      };
    }).filter(d => d.marketCap !== null && d.marketCap > 0);

    // Run regression
    const mcRegression = linearRegression(combined, 'marketCap', 'attacks');

    return {
      data: combined,
      mcRegression,
      totalMonths: combined.length
    };
  }, []);

  // Denominator analysis - attacks per user and per $B market cap
  const denominatorAnalysis = useMemo(() => {
    const yearlyMC = getYearlyMarketCap();

    // Aggregate attacks by year
    const attacksByYear = {};
    attacks.forEach(attack => {
      const year = attack.date.substring(0, 4);
      attacksByYear[year] = (attacksByYear[year] || 0) + 1;
    });

    // Combine all data sources
    const combined = coinbaseUsers.map(cu => {
      const mcData = yearlyMC.find(m => m.year === cu.year);
      const attackCount = attacksByYear[cu.year] || 0;

      return {
        year: cu.year,
        attacks: attackCount,
        users: cu.users, // millions
        marketCap: mcData ? mcData.avgMarketCap : null,
        attacksPerMillionUsers: cu.users > 0 ? attackCount / cu.users : 0,
        attacksPerBillionMC: mcData && mcData.avgMarketCap > 0 ? attackCount / mcData.avgMarketCap : 0,
      };
    }).filter(d => d.marketCap !== null && d.attacks > 0);

    return combined;
  }, []);

  // Geographic analysis data
  const geoAnalysis = useMemo(() => {
    const regionOrder = ['North America', 'Western Europe', 'Eastern Europe', 'Asia-Pacific', 'South Asia', 'Latin America', 'Middle East', 'Africa'];

    // Overall counts by region
    const byRegion = {};
    const byRegionYear = {};
    const attacksWithCoords = [];

    attacks.forEach(attack => {
      const region = getRegion(attack.location);
      const year = attack.date.substring(0, 4);

      byRegion[region] = (byRegion[region] || 0) + 1;

      if (!byRegionYear[year]) {
        byRegionYear[year] = {};
        regionOrder.forEach(r => byRegionYear[year][r] = 0);
      }
      byRegionYear[year][region] = (byRegionYear[year][region] || 0) + 1;

      // Collect attack data for map markers
      attacksWithCoords.push({
        ...attack,
        region,
        year,
      });
    });

    // Pie chart data
    const pieData = regionOrder
      .filter(r => byRegion[r] > 0)
      .map(region => ({
        name: region,
        value: byRegion[region] || 0,
        color: REGIONS[region]?.color || '#666',
      }));

    // Yearly percentage data for stacked bar chart (ensure exact 100% total)
    const yearlyData = Object.keys(byRegionYear).sort().map(year => {
      const total = Object.values(byRegionYear[year]).reduce((a, b) => a + b, 0);
      const row = { year, total };

      if (total === 0) {
        regionOrder.forEach(region => {
          row[region] = 0;
          row[`${region}Pct`] = 0;
        });
        return row;
      }

      // First pass: calculate raw percentages and store counts
      const rawPcts = [];
      regionOrder.forEach(region => {
        const count = byRegionYear[year][region] || 0;
        row[region] = count;
        const rawPct = (count / total) * 100;
        const roundedPct = Math.round(rawPct);
        rawPcts.push({ region, count, rawPct, roundedPct, error: rawPct - roundedPct });
      });

      // Calculate sum of rounded percentages
      const sumRounded = rawPcts.reduce((sum, r) => sum + r.roundedPct, 0);
      const diff = 100 - sumRounded;

      // Distribute the difference to regions with the largest rounding errors
      // Sort by error (descending for positive diff, ascending for negative diff)
      const sortedByError = [...rawPcts].filter(r => r.count > 0).sort((a, b) =>
        diff > 0 ? b.error - a.error : a.error - b.error
      );

      // Apply adjustments
      const adjustments = new Map();
      for (let i = 0; i < Math.abs(diff) && i < sortedByError.length; i++) {
        adjustments.set(sortedByError[i].region, diff > 0 ? 1 : -1);
      }

      // Set final percentages
      rawPcts.forEach(({ region, roundedPct }) => {
        const adjustment = adjustments.get(region) || 0;
        row[`${region}Pct`] = Math.max(0, roundedPct + adjustment);
      });

      return row;
    });

    // Severity stats by region
    const severityByRegion = {};
    attacks.forEach(attack => {
      const region = getRegion(attack.location);
      if (!severityByRegion[region]) {
        severityByRegion[region] = { total: 0, severe: 0, fatal: 0, sumSeverity: 0 };
      }
      severityByRegion[region].total++;
      severityByRegion[region].sumSeverity += attack.severity;
      if (attack.severity >= 4) severityByRegion[region].severe++;
      if (attack.severity === 5) severityByRegion[region].fatal++;
    });

    // Map markers - aggregate by approximate city location
    const cityAggregates = {};
    attacksWithCoords.forEach(attack => {
      // Create a simplified city key from location
      const parts = attack.location.split(',');
      const city = parts[0].trim();
      const country = parts[parts.length - 1].trim();
      const key = `${city}, ${country}`;

      if (!cityAggregates[key]) {
        cityAggregates[key] = {
          city,
          country,
          location: attack.location,
          attacks: [],
          totalSeverity: 0,
          count: 0,
          region: attack.region,
        };
      }
      cityAggregates[key].attacks.push(attack);
      cityAggregates[key].totalSeverity += attack.severity;
      cityAggregates[key].count++;
    });

    const mapMarkers = Object.values(cityAggregates).map(city => ({
      ...city,
      avgSeverity: city.totalSeverity / city.count,
    }));

    return {
      pieData,
      yearlyData,
      severityByRegion,
      mapMarkers,
      regionOrder,
    };
  }, []);

  // Custom tooltips
  const SeverityTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="font-bold text-white mb-2">{label}</p>
          <p style={{ color: SEVERITY_LEVELS[5].color }}>Fatal: {data.s5}</p>
          <p style={{ color: SEVERITY_LEVELS[4].color }}>Severe: {data.s4}</p>
          <p style={{ color: SEVERITY_LEVELS[3].color }}>Serious: {data.s3}</p>
          <p style={{ color: SEVERITY_LEVELS[2].color }}>Moderate: {data.s2}</p>
          <p style={{ color: SEVERITY_LEVELS[1].color }}>Minor: {data.s1}</p>
          <p className="text-white font-bold mt-2">Total: {data.total || (data.s1 + data.s2 + data.s3 + data.s4 + data.s5)}</p>
        </div>
      );
    }
    return null;
  };

  const PercentageTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-xl">
          <p className="font-bold text-white text-lg mb-2">{label}</p>
          <p className="text-gray-400 text-sm mb-3">{data.total} total attacks</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span style={{ color: SEVERITY_LEVELS[5].color }}>Fatal:</span>
              <span className="text-white font-medium">{data.p5}% ({data.c5})</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: SEVERITY_LEVELS[4].color }}>Severe:</span>
              <span className="text-white font-medium">{data.p4}% ({data.c4})</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: SEVERITY_LEVELS[3].color }}>Serious:</span>
              <span className="text-white font-medium">{data.p3}% ({data.c3})</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: SEVERITY_LEVELS[2].color }}>Moderate:</span>
              <span className="text-white font-medium">{data.p2}% ({data.c2})</span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ color: SEVERITY_LEVELS[1].color }}>Minor:</span>
              <span className="text-white font-medium">{data.p1}% ({data.c1})</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Severe+Fatal:</span>
              <span className="text-red-400 font-bold">{data.severeOrWorse}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-orange-500">
          Physical Bitcoin/Crypto Attacks Analysis
        </h1>
        <p className="text-center text-gray-400 mb-4 text-sm">
          Data: <a href="https://github.com/jlopp/physical-bitcoin-attacks" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">jlopp/physical-bitcoin-attacks</a> • {attacks.length} total attacks • <a href="https://github.com/Haseeb-Qureshi/wrench-attacks-viz" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">View source</a>
        </p>
        
        {/* Chart Selector */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveChart('severity')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChart === 'severity' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Absolute Numbers
          </button>
          <button
            onClick={() => setActiveChart('percentage')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChart === 'percentage' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Percentage Comparison
          </button>
          <button
            onClick={() => setActiveChart('marketcap')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChart === 'marketcap' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Market Cap Analysis
          </button>
          <button
            onClick={() => setActiveChart('geographic')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChart === 'geographic' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Geographic Analysis
          </button>
        </div>
        
        {/* Stats Cards with Severity Legend */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6">
          {[1, 2, 3, 4, 5].map(sev => (
            <div key={sev} className="bg-gray-800 rounded-lg p-2 md:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: SEVERITY_LEVELS[sev].color }}></div>
                <span className="text-sm font-medium" style={{ color: SEVERITY_LEVELS[sev].color }}>
                  {SEVERITY_LEVELS[sev].label}
                </span>
              </div>
              <div className="text-xl md:text-3xl font-bold mb-1" style={{ color: SEVERITY_LEVELS[sev].color }}>
                {severityCounts[sev]}
              </div>
              <div className="text-xs text-gray-500 mb-2">{((severityCounts[sev] / attacks.length) * 100).toFixed(0)}%</div>
              <p className="text-xs text-gray-500 hidden md:block">{SEVERITY_LEVELS[sev].description}</p>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* CHART 1: ABSOLUTE SEVERITY NUMBERS */}
        {/* ============================================================ */}
        {activeChart === 'severity' && (
          <>
            {/* View Selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['stacked', 'distribution'].map(view => (
                <button
                  key={view}
                  onClick={() => setChartView(view)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    chartView === view ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              {chartView === 'stacked' && (
                <>
                  <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Attacks Per Year by Severity</h2>
                  <p className="text-center text-gray-400 text-sm mb-4">Click a bar to see attack details</p>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={yearlyData} onClick={(data) => data && setSelectedYear(data.activeLabel)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<SeverityTooltip />} />
                      <Bar dataKey="s1" stackId="a" fill={SEVERITY_LEVELS[1].color} name="Minor" />
                      <Bar dataKey="s2" stackId="a" fill={SEVERITY_LEVELS[2].color} name="Moderate" />
                      <Bar dataKey="s3" stackId="a" fill={SEVERITY_LEVELS[3].color} name="Serious" />
                      <Bar dataKey="s4" stackId="a" fill={SEVERITY_LEVELS[4].color} name="Severe" />
                      <Bar dataKey="s5" stackId="a" fill={SEVERITY_LEVELS[5].color} name="Fatal" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
              
              {chartView === 'distribution' && (
                <>
                  <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Overall Severity Distribution</h2>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        dataKey="value"
                        label={({ name, value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SEVERITY_LEVELS[entry.severity].color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* CHART 2: PERCENTAGE COMPARISON */}
        {/* ============================================================ */}
        {activeChart === 'percentage' && (
          <>
            {/* Percentage Stacked Bar Chart */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Severity Breakdown by Year (%)</h2>
              <p className="text-center text-gray-400 text-sm mb-4">Each bar = 100% of attacks for that year</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={percentageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<PercentageTooltip />} />
                  <Bar dataKey="p1" stackId="a" fill={SEVERITY_LEVELS[1].color} name="Minor" />
                  <Bar dataKey="p2" stackId="a" fill={SEVERITY_LEVELS[2].color} name="Moderate" />
                  <Bar dataKey="p3" stackId="a" fill={SEVERITY_LEVELS[3].color} name="Serious" />
                  <Bar dataKey="p4" stackId="a" fill={SEVERITY_LEVELS[4].color} name="Severe" />
                  <Bar dataKey="p5" stackId="a" fill={SEVERITY_LEVELS[5].color} name="Fatal" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Trend Lines */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Severity Trend Lines</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={percentageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} formatter={(v) => [`${v}%`]} />
                  <Legend />
                  <Line type="monotone" dataKey="severeOrWorse" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} name="Severe + Fatal %" />
                  <Line type="monotone" dataKey="p5" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#7c3aed', r: 3 }} name="Fatal %" />
                  <Line type="monotone" dataKey="p3" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} name="Serious %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* CHART 3: MARKET CAP CORRELATION */}
        {/* ============================================================ */}
        {activeChart === 'marketcap' && (
          <>
            {/* Correlation Summary */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-1">Market Cap → Attack Frequency</h3>
                <p className="text-sm text-gray-500">{marketCapCorrelation.totalMonths} months of data (2014–2025)</p>
              </div>
              <div className="flex justify-center items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400">{marketCapCorrelation.mcRegression.correlation.toFixed(2)}</div>
                  <div className="text-sm text-gray-500 mt-1">correlation (r)</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">{(marketCapCorrelation.mcRegression.rSquared * 100).toFixed(0)}%</div>
                  <div className="text-sm text-gray-500 mt-1">variance explained (R²)</div>
                </div>
              </div>
              <p className="text-center text-gray-400 text-sm mt-4">
                {marketCapCorrelation.mcRegression.rSquared > 0.3
                  ? 'Moderate positive correlation — attack frequency scales with crypto market cap'
                  : 'Weak positive correlation — market cap is one factor among many'}
              </p>
            </div>

            {/* Dual Axis Chart */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Monthly Market Cap vs Attack Frequency</h2>
              <p className="text-center text-gray-400 text-sm mb-4">Stacked severity bars vs market cap (line)</p>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={marketCapCorrelation.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 10 }}
                    interval={11}
                    tickFormatter={(val) => val.substring(0, 4)}
                  />
                  <YAxis yAxisId="left" stroke="#9CA3AF" label={{ value: 'Attacks', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#ffffff" label={{ value: 'Market Cap ($B)', angle: 90, position: 'insideRight', fill: '#ffffff' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    formatter={(value, name) => {
                      if (name === 'Market Cap') return [`$${value}B`, name];
                      return [value, name];
                    }}
                    labelFormatter={(label) => label}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="s1" stackId="a" fill={SEVERITY_LEVELS[1].color} name="Minor" />
                  <Bar yAxisId="left" dataKey="s2" stackId="a" fill={SEVERITY_LEVELS[2].color} name="Moderate" />
                  <Bar yAxisId="left" dataKey="s3" stackId="a" fill={SEVERITY_LEVELS[3].color} name="Serious" />
                  <Bar yAxisId="left" dataKey="s4" stackId="a" fill={SEVERITY_LEVELS[4].color} name="Severe" />
                  <Bar yAxisId="left" dataKey="s5" stackId="a" fill={SEVERITY_LEVELS[5].color} name="Fatal" />
                  <Line yAxisId="right" type="monotone" dataKey="marketCap" stroke="#ffffff" strokeWidth={2} dot={false} name="Market Cap" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Scatter Plot */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Correlation Scatter Plot</h2>
              <p className="text-center text-gray-400 text-sm mb-4">Each point is a month ({marketCapCorrelation.totalMonths} data points)</p>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={marketCapCorrelation.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="marketCap"
                    type="number"
                    stroke="#9CA3AF"
                    label={{ value: 'Market Cap ($B)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                  />
                  <YAxis
                    dataKey="attacks"
                    type="number"
                    stroke="#9CA3AF"
                    label={{ value: 'Attacks/Month', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    formatter={(value, name) => {
                      if (name === 'marketCap') return [`$${value}B`, 'Market Cap'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => {
                      const point = marketCapCorrelation.data.find(d => d.marketCap === label);
                      return point ? point.month : label;
                    }}
                  />
                  <Scatter dataKey="attacks" fill="#f97316" name="Month" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Denominator Analysis */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Normalized Attack Rates Over Time</h2>
              <p className="text-center text-gray-400 text-sm mb-4">
                Attacks per million Coinbase users vs attacks per $B market cap
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={denominatorAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis yAxisId="left" stroke="#0052FF" label={{ value: 'Per M Users', angle: -90, position: 'insideLeft', fill: '#0052FF', fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#22c55e" label={{ value: 'Per $B MC', angle: 90, position: 'insideRight', fill: '#22c55e', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    formatter={(value, name) => {
                      if (name === 'Attacks / Coinbase MAUs') return [value.toFixed(2), name];
                      if (name === 'Attacks/$B MC') return [value.toFixed(3), name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="attacksPerMillionUsers" stroke="#0052FF" strokeWidth={3} dot={{ fill: '#0052FF', r: 5 }} name="Attacks / Coinbase MAUs" />
                  <Line yAxisId="right" type="monotone" dataKey="attacksPerBillionMC" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 5 }} name="Attacks/$B MC" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Denominator Data Table */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Risk Rates by Year</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-2">Year</th>
                      <th className="text-right py-2 px-2">Attacks</th>
                      <th className="text-right py-2 px-2">CB Users (M)</th>
                      <th className="text-right py-2 px-2">Market Cap ($B)</th>
                      <th className="text-right py-2 px-2 text-blue-500">Per M Users</th>
                      <th className="text-right py-2 px-2 text-green-400">Per $B MC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denominatorAnalysis.map(row => (
                      <tr key={row.year} className="border-b border-gray-700">
                        <td className="py-2 px-2 font-medium">{row.year}</td>
                        <td className="text-right py-2 px-2 text-orange-400">{row.attacks}</td>
                        <td className="text-right py-2 px-2 text-gray-400">{row.users}</td>
                        <td className="text-right py-2 px-2 text-blue-400">${row.marketCap}</td>
                        <td className="text-right py-2 px-2 text-blue-500">{row.attacksPerMillionUsers.toFixed(2)}</td>
                        <td className="text-right py-2 px-2 text-green-400">{row.attacksPerBillionMC.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Coinbase users used as proxy for global crypto user base. Source: Coinbase filings, Business of Apps.
              </p>
            </div>

            {/* Data Table - Yearly Summary */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2">Yearly Summary</h2>
              <p className="text-gray-400 text-sm mb-4">Aggregated from monthly data for readability</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-2">Year</th>
                      <th className="text-right py-2 px-2">Attacks</th>
                      <th className="text-right py-2 px-2">Avg Market Cap</th>
                      <th className="text-right py-2 px-2">Attacks/Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Aggregate monthly data to yearly
                      const yearly = {};
                      marketCapCorrelation.data.forEach(d => {
                        if (!yearly[d.year]) {
                          yearly[d.year] = { attacks: 0, marketCapSum: 0, months: 0 };
                        }
                        yearly[d.year].attacks += d.attacks;
                        yearly[d.year].marketCapSum += d.marketCap;
                        yearly[d.year].months += 1;
                      });
                      return Object.entries(yearly).map(([year, data]) => (
                        <tr key={year} className="border-b border-gray-700">
                          <td className="py-2 px-2 font-medium">{year}</td>
                          <td className="text-right py-2 px-2 text-orange-400">{data.attacks}</td>
                          <td className="text-right py-2 px-2 text-blue-400">
                            ${Math.round(data.marketCapSum / data.months)}B
                          </td>
                          <td className="text-right py-2 px-2 text-gray-400">
                            {(data.attacks / data.months).toFixed(1)}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* CHART 4: GEOGRAPHIC ANALYSIS */}
        {/* ============================================================ */}
        {activeChart === 'geographic' && (
          <>
            {/* Region Pie Chart */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6 overflow-visible">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Attacks by Region</h2>
              <p className="text-center text-gray-400 text-sm mb-4">Distribution of all {attacks.length} documented attacks</p>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                <div style={{ width: 400, height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <Pie
                        data={geoAnalysis.pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, percent, cx, cy, midAngle, outerRadius }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = outerRadius + 25;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#9CA3AF"
                              textAnchor={x > cx ? 'start' : 'end'}
                              dominantBaseline="central"
                              fontSize={12}
                            >
                              {`${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                        labelLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                      >
                        {geoAnalysis.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value, name) => [`${value} attacks`, name]}
                        wrapperStyle={{ zIndex: 100 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {geoAnalysis.pieData.map(region => (
                    <div key={region.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: region.color }}></div>
                      <span className="text-sm text-gray-300">{region.name}: <span className="text-white font-medium">{region.value}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Region Stacked Bar Chart Over Time */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Regional Distribution by Year (%)</h2>
              <p className="text-center text-gray-400 text-sm mb-4">Each bar = 100% of attacks for that year</p>
              <div className="relative">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={geoAnalysis.yearlyData} margin={{ top: 5, right: 160, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                      formatter={(value, name, props) => {
                        const data = props.payload;
                        const count = data[name];
                        return [`${count} attacks (${value}%)`, name];
                      }}
                    />
                    {geoAnalysis.regionOrder.map((region) => (
                      <Bar
                        key={region}
                        dataKey={`${region}Pct`}
                        stackId="a"
                        fill={REGIONS[region]?.color || '#666'}
                        name={region}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
                {/* Right-side legend positioned absolutely to align with chart area */}
                <div
                  className="hidden md:block absolute"
                  style={{
                    right: '10px',
                    top: '10px',
                    bottom: '35px',
                    width: '150px',
                  }}
                >
                  {(() => {
                    const lastYear = geoAnalysis.yearlyData[geoAnalysis.yearlyData.length - 1];
                    if (!lastYear) return null;

                    // Calculate cumulative positions for each region (bottom to top)
                    let cumulative = 0;
                    const segments = geoAnalysis.regionOrder.map(region => {
                      const pct = lastYear[`${region}Pct`] || 0;
                      const startPct = cumulative;
                      cumulative += pct;
                      const midPct = startPct + pct / 2;
                      return {
                        region,
                        pct,
                        midPct,
                        color: REGIONS[region]?.color || '#666',
                      };
                    }).filter(s => s.pct > 0);

                    return segments.map((seg) => {
                      // Apply a vertical offset that increases toward the top (5px at top, ~1px at bottom)
                      const verticalOffset = 1 + (seg.midPct / 100) * 4;
                      return (
                      <div
                        key={seg.region}
                        className="absolute flex items-center text-xs"
                        style={{
                          bottom: `calc(${seg.midPct}% + ${verticalOffset}px)`,
                          transform: 'translateY(50%)',
                          left: 0,
                          right: 0,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">◀</span>
                          <span style={{ color: seg.color }} className="font-medium">
                            {seg.region}
                          </span>
                          <span className="text-gray-500">{seg.pct}%</span>
                        </div>
                      </div>
                    )});
                  })()}
                </div>
              </div>
              {/* Mobile legend */}
              <div className="md:hidden flex flex-wrap justify-center gap-3 mt-4">
                {geoAnalysis.regionOrder.map(region => (
                  <div key={region} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: REGIONS[region]?.color }}></div>
                    <span className="text-xs text-gray-400">{region}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger by Region Table */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Severity by Region</h2>
              <p className="text-center text-gray-400 text-sm mb-4">Where are attacks most dangerous?</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-3">Region</th>
                      <th className="text-right py-2 px-3">Attacks</th>
                      <th className="text-right py-2 px-3">Avg Severity</th>
                      <th className="text-right py-2 px-3">Severe+</th>
                      <th className="text-right py-2 px-3">Fatal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoAnalysis.pieData
                      .sort((a, b) => {
                        const aFatal = (geoAnalysis.severityByRegion[a.name]?.fatal || 0) / (geoAnalysis.severityByRegion[a.name]?.total || 1);
                        const bFatal = (geoAnalysis.severityByRegion[b.name]?.fatal || 0) / (geoAnalysis.severityByRegion[b.name]?.total || 1);
                        return bFatal - aFatal;
                      })
                      .map(region => {
                        const stats = geoAnalysis.severityByRegion[region.name] || { total: 0, severe: 0, fatal: 0, sumSeverity: 0 };
                        const avgSev = stats.total > 0 ? (stats.sumSeverity / stats.total).toFixed(2) : '—';
                        const severePct = stats.total > 0 ? `${Math.round((stats.severe / stats.total) * 100)}%` : '—';
                        const fatalPct = stats.total > 0 ? `${Math.round((stats.fatal / stats.total) * 100)}%` : '—';
                        const fatalRate = stats.total > 0 ? (stats.fatal / stats.total) : 0;
                        return (
                          <tr key={region.name} className="border-b border-gray-700">
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: region.color }}></div>
                                <span style={{ color: region.color }}>{region.name}</span>
                              </div>
                            </td>
                            <td className="text-right py-2 px-3 text-gray-300">{stats.total}</td>
                            <td className="text-right py-2 px-3 text-orange-400">{avgSev}</td>
                            <td className="text-right py-2 px-3 text-red-400">{severePct}</td>
                            <td className="text-right py-2 px-3 font-bold" style={{ color: fatalRate > 0.1 ? '#ef4444' : fatalRate > 0 ? '#f97316' : '#9ca3af' }}>{fatalPct}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Sorted by fatality rate. Latin America and Africa have significantly higher fatality rates.
              </p>
            </div>

            {/* World Map */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">Global Attack Map</h2>
              <p className="text-center text-gray-400 text-sm mb-4">Circle size = number of attacks, color = danger level (green = safer, red = more dangerous)</p>
              <div className="w-full relative" style={{ height: '500px' }}>
                {/* Map Tooltip */}
                {hoveredMarker && (
                  <div
                    className="absolute z-50 bg-gray-900 border border-gray-600 rounded-lg p-3 pointer-events-none shadow-xl"
                    style={{
                      left: hoveredMarker.x,
                      top: hoveredMarker.y,
                      transform: 'translate(-50%, -100%) translateY(-10px)',
                      minWidth: '200px'
                    }}
                  >
                    <div className="font-semibold text-white mb-1">{hoveredMarker.city}, {hoveredMarker.country}</div>
                    <div className="text-sm text-gray-300">
                      <span className="text-orange-400 font-medium">{hoveredMarker.count}</span> attack{hoveredMarker.count > 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-300">
                      Avg severity: <span className="font-medium" style={{ color: hoveredMarker.dangerColor }}>{hoveredMarker.avgSeverity.toFixed(1)}</span>
                    </div>
                    {hoveredMarker.attacks && hoveredMarker.attacks.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400 max-h-32 overflow-y-auto">
                        {hoveredMarker.attacks.slice(0, 3).map((a, i) => (
                          <div key={i} className="mb-1">
                            <span className="text-gray-500">{a.date.substring(0, 4)}</span> {a.description.substring(0, 50)}{a.description.length > 50 ? '...' : ''}
                          </div>
                        ))}
                        {hoveredMarker.attacks.length > 3 && (
                          <div className="text-gray-500">+{hoveredMarker.attacks.length - 3} more</div>
                        )}
                        <div className="text-blue-400 mt-1">Click to see all</div>
                      </div>
                    )}
                  </div>
                )}
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 130,
                    center: [20, 20]
                  }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#374151"
                          stroke="#4B5563"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: 'none' },
                            hover: { fill: '#4B5563', outline: 'none' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  {(() => {
                    // Calculate danger scores for all markers
                    const maxCount = Math.max(...geoAnalysis.mapMarkers.map(m => m.count));
                    const maxSeverity = 5;

                    return geoAnalysis.mapMarkers.map((marker, idx) => {
                      // Get approximate coordinates for the city
                      const coords = (() => {
                        const loc = marker.location.toLowerCase();
                        // Major city coordinate lookup
                        const cityCoords = {
                          // North America
                          'new york': [-74.0, 40.7],
                          'los angeles': [-118.2, 34.1],
                          'miami': [-80.2, 25.8],
                          'atlanta': [-84.4, 33.7],
                          'chicago': [-87.6, 41.9],
                          'san francisco': [-122.4, 37.8],
                          'houston': [-95.4, 29.8],
                          'dallas': [-96.8, 32.8],
                          'toronto': [-79.4, 43.7],
                          'ottawa': [-75.7, 45.4],
                          // Western Europe
                          'london': [-0.1, 51.5],
                          'amsterdam': [4.9, 52.4],
                          'paris': [2.4, 48.9],
                          'berlin': [13.4, 52.5],
                          'madrid': [-3.7, 40.4],
                          'rome': [12.5, 41.9],
                          'milan': [9.2, 45.5],
                          'barcelona': [2.2, 41.4],
                          'manchester': [-2.2, 53.5],
                          'oslo': [10.8, 59.9],
                          // Eastern Europe
                          'moscow': [37.6, 55.8],
                          'kyiv': [30.5, 50.5],
                          'kiev': [30.5, 50.5],
                          'st petersburg': [30.3, 59.9],
                          'warsaw': [21.0, 52.2],
                          // Asia-Pacific
                          'hong kong': [114.2, 22.3],
                          'singapore': [103.8, 1.4],
                          'tokyo': [139.7, 35.7],
                          'sydney': [151.2, -33.9],
                          'melbourne': [145.0, -37.8],
                          'bangkok': [100.5, 13.8],
                          'shanghai': [121.5, 31.2],
                          'beijing': [116.4, 39.9],
                          // South Asia
                          'mumbai': [72.9, 19.1],
                          'delhi': [77.2, 28.6],
                          'bangalore': [77.6, 13.0],
                          // Latin America
                          'sao paulo': [-46.6, -23.6],
                          'rio': [-43.2, -22.9],
                          'buenos aires': [-58.4, -34.6],
                          'mexico city': [-99.1, 19.4],
                          'bogota': [-74.1, 4.7],
                          // Middle East
                          'dubai': [55.3, 25.3],
                          'istanbul': [29.0, 41.0],
                          'tel aviv': [34.8, 32.1],
                          // Africa
                          'johannesburg': [28.0, -26.2],
                          'cape town': [18.4, -33.9],
                          'lagos': [3.4, 6.5],
                          'nairobi': [36.8, -1.3],
                        };
                        for (const [city, coords] of Object.entries(cityCoords)) {
                          if (loc.includes(city)) return coords;
                        }
                        // Fallback: use region center
                        const regionCenters = {
                          'North America': [-95, 40],
                          'Western Europe': [10, 50],
                          'Eastern Europe': [35, 52],
                          'Asia-Pacific': [120, 25],
                          'South Asia': [78, 22],
                          'Latin America': [-60, -15],
                          'Middle East': [45, 30],
                          'Africa': [20, 0],
                        };
                        return regionCenters[marker.region] || [0, 0];
                      })();

                      // Calculate marker size based on attack count
                      const size = Math.min(4 + marker.count * 3, 25);

                      // Calculate danger score (0-1) based on count and severity
                      // Higher count + higher severity = more dangerous
                      const countFactor = Math.min(marker.count / 5, 1); // normalize: 5+ attacks = max
                      const severityFactor = (marker.avgSeverity - 1) / (maxSeverity - 1); // 1-5 -> 0-1
                      const dangerScore = (countFactor * 0.4 + severityFactor * 0.6); // weight severity more

                      // Interpolate from green (#22c55e) through yellow (#eab308) to red (#ef4444)
                      const getDangerColor = (score) => {
                        if (score < 0.5) {
                          // Green to Yellow (0 -> 0.5)
                          const t = score * 2;
                          const r = Math.round(34 + t * (234 - 34));
                          const g = Math.round(197 + t * (179 - 197));
                          const b = Math.round(94 + t * (8 - 94));
                          return `rgb(${r}, ${g}, ${b})`;
                        } else {
                          // Yellow to Red (0.5 -> 1)
                          const t = (score - 0.5) * 2;
                          const r = Math.round(234 + t * (239 - 234));
                          const g = Math.round(179 - t * 179);
                          const b = Math.round(8 + t * (68 - 8));
                          return `rgb(${r}, ${g}, ${b})`;
                        }
                      };

                      const dangerColor = getDangerColor(dangerScore);

                      return (
                        <Marker key={idx} coordinates={coords}>
                          <circle
                            r={size}
                            fill={dangerColor}
                            fillOpacity={0.8}
                            stroke="#fff"
                            strokeWidth={0.5}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                              const rect = e.target.ownerSVGElement.getBoundingClientRect();
                              const point = e.target.getBoundingClientRect();
                              setHoveredMarker({
                                ...marker,
                                dangerColor,
                                x: point.left - rect.left + point.width / 2,
                                y: point.top - rect.top,
                              });
                            }}
                            onMouseLeave={() => setHoveredMarker(null)}
                            onClick={() => setSelectedLocation({
                              ...marker,
                              dangerColor,
                            })}
                          />
                        </Marker>
                      );
                    });
                  })()}
                </ComposableMap>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Danger:</span>
                  <div className="flex items-center">
                    <div className="w-20 h-3 rounded" style={{ background: 'linear-gradient(to right, #22c55e, #eab308, #ef4444)' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">Low → High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Size = attack count</span>
                </div>
              </div>
            </div>

            {/* Selected Location Details */}
            {selectedLocation && selectedLocation.attacks && (
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold">{selectedLocation.city}, {selectedLocation.country}</h2>
                    <p className="text-sm text-gray-400">
                      <span className="text-orange-400 font-medium">{selectedLocation.count}</span> attack{selectedLocation.count > 1 ? 's' : ''} •
                      Avg severity: <span style={{ color: selectedLocation.dangerColor }}>{selectedLocation.avgSeverity.toFixed(1)}</span>
                    </p>
                  </div>
                  <button onClick={() => setSelectedLocation(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {selectedLocation.attacks
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((attack, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: SEVERITY_LEVELS[attack.severity].color }}></div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <span className="text-gray-400 text-sm">{attack.date}</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: SEVERITY_LEVELS[attack.severity].color + '33', color: SEVERITY_LEVELS[attack.severity].color }}>
                            {SEVERITY_LEVELS[attack.severity].label}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-600 text-gray-300">
                            {attack.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-white text-sm">{attack.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{attack.victim}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Selected Year Details */}
        {selectedYear && selectedYearAttacks.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">{selectedYear} Attacks ({selectedYearAttacks.length})</h2>
              <button onClick={() => setSelectedYear(null)} className="text-gray-400 hover:text-white">✕ Close</button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {selectedYearAttacks.map((attack, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 bg-gray-700 rounded-lg">
                  <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: SEVERITY_LEVELS[attack.severity].color }}></div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-gray-400 text-sm">{attack.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: SEVERITY_LEVELS[attack.severity].color + '33', color: SEVERITY_LEVELS[attack.severity].color }}>
                        {attack.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-white text-sm">{attack.description}</p>
                    <p className="text-gray-500 text-xs">{attack.location} • {attack.victim}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Year-by-Year Table */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Year-by-Year Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2">Year</th>
                  <th className="text-center py-2 px-2">Total</th>
                  <th className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[5].color }}>Fatal</th>
                  <th className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[4].color }}>Severe</th>
                  <th className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[3].color }}>Serious</th>
                  <th className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[2].color }}>Mod.</th>
                  <th className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[1].color }}>Minor</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map(row => (
                  <tr key={row.year} className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedYear(row.year)}>
                    <td className="py-2 px-2 font-medium">{row.year}</td>
                    <td className="text-center py-2 px-2 text-white font-bold">{row.total}</td>
                    <td className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[5].color }}>{row.s5 || '-'}</td>
                    <td className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[4].color }}>{row.s4 || '-'}</td>
                    <td className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[3].color }}>{row.s3 || '-'}</td>
                    <td className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[2].color }}>{row.s2 || '-'}</td>
                    <td className="text-center py-2 px-2" style={{ color: SEVERITY_LEVELS[1].color }}>{row.s1 || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="text-center text-gray-500 mt-6 text-xs">
          Note: This data represents known/reported attacks only. Many attacks go unreported. Severity is estimated based on available descriptions.
        </p>
      </div>
    </div>
  );
}
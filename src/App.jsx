import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { SEVERITY_LEVELS, attacks } from './data';

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

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function BitcoinAttacksApp() {
  const [activeChart, setActiveChart] = useState('severity');
  const [chartView, setChartView] = useState('stacked');
  const [selectedYear, setSelectedYear] = useState(null);
  
  const stats = getStatistics();
  const { severityCounts, yearlyData } = stats;
  
  // Calculate percentage data
  const percentageData = yearlyData.map(row => ({
    year: row.year,
    total: row.total,
    p1: Math.round((row.s1 / row.total) * 100),
    p2: Math.round((row.s2 / row.total) * 100),
    p3: Math.round((row.s3 / row.total) * 100),
    p4: Math.round((row.s4 / row.total) * 100),
    p5: Math.round((row.s5 / row.total) * 100),
    c1: row.s1, c2: row.s2, c3: row.s3, c4: row.s4, c5: row.s5,
    severeOrWorse: Math.round(((row.s4 + row.s5) / row.total) * 100),
  }));
  
  // Calculate cumulative data
  let cumS1 = 0, cumS2 = 0, cumS3 = 0, cumS4 = 0, cumS5 = 0;
  const cumulativeData = yearlyData.map(item => {
    cumS1 += item.s1; cumS2 += item.s2; cumS3 += item.s3; cumS4 += item.s4; cumS5 += item.s5;
    return { year: item.year, s1: cumS1, s2: cumS2, s3: cumS3, s4: cumS4, s5: cumS5, total: cumS1 + cumS2 + cumS3 + cumS4 + cumS5 };
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

  const avgSevereOrWorse = Math.round(((severityCounts[4] + severityCounts[5]) / attacks.length) * 100);

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
          Data: github.com/jlopp/physical-bitcoin-attacks • {attacks.length} total attacks
        </p>
        
        {/* Severity Legend with Descriptions */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold mb-3 text-gray-300">Severity Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {[5, 4, 3, 2, 1].map(sev => (
              <div key={sev} className="flex items-start gap-2">
                <div className="w-3 h-3 rounded mt-1 flex-shrink-0" style={{ backgroundColor: SEVERITY_LEVELS[sev].color }}></div>
                <div>
                  <span className="text-sm font-medium" style={{ color: SEVERITY_LEVELS[sev].color }}>
                    {SEVERITY_LEVELS[sev].label}
                  </span>
                  <p className="text-xs text-gray-500">{SEVERITY_LEVELS[sev].description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
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
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6">
          {[5, 4, 3, 2, 1].map(sev => (
            <div key={sev} className="bg-gray-800 rounded-lg p-2 md:p-4 text-center">
              <div className="text-xl md:text-3xl font-bold" style={{ color: SEVERITY_LEVELS[sev].color }}>
                {severityCounts[sev]}
              </div>
              <div className="text-xs text-gray-400 hidden md:block">{SEVERITY_LEVELS[sev].label}</div>
              <div className="text-xs text-gray-500">{((severityCounts[sev] / attacks.length) * 100).toFixed(0)}%</div>
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
              {['stacked', 'cumulative', 'distribution'].map(view => (
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
              
              {chartView === 'cumulative' && (
                <>
                  <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Cumulative Attacks by Severity</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={cumulativeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<SeverityTooltip />} />
                      <Area type="monotone" dataKey="s1" stackId="1" stroke={SEVERITY_LEVELS[1].color} fill={SEVERITY_LEVELS[1].color} fillOpacity={0.8} />
                      <Area type="monotone" dataKey="s2" stackId="1" stroke={SEVERITY_LEVELS[2].color} fill={SEVERITY_LEVELS[2].color} fillOpacity={0.8} />
                      <Area type="monotone" dataKey="s3" stackId="1" stroke={SEVERITY_LEVELS[3].color} fill={SEVERITY_LEVELS[3].color} fillOpacity={0.8} />
                      <Area type="monotone" dataKey="s4" stackId="1" stroke={SEVERITY_LEVELS[4].color} fill={SEVERITY_LEVELS[4].color} fillOpacity={0.8} />
                      <Area type="monotone" dataKey="s5" stackId="1" stroke={SEVERITY_LEVELS[5].color} fill={SEVERITY_LEVELS[5].color} fillOpacity={0.8} />
                    </AreaChart>
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
            {/* Key Insight Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500">
                  {percentageData[percentageData.length - 1]?.severeOrWorse}%
                </div>
                <div className="text-xs text-gray-400">2025 Severe+Fatal</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-500">{avgSevereOrWorse}%</div>
                <div className="text-xs text-gray-400">Avg Severe+Fatal</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-500">
                  {percentageData[percentageData.length - 1]?.p5}%
                </div>
                <div className="text-xs text-gray-400">2025 Fatal Rate</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-500">
                  {percentageData[percentageData.length - 1]?.p1}%
                </div>
                <div className="text-xs text-gray-400">2025 Minor Rate</div>
              </div>
            </div>
            
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
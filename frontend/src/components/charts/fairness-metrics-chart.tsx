import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertCircle, Clock } from 'lucide-react';
import type { FairnessMetric } from '@/types';
import { peakUsageTime, unscheduledInterruptions } from '@/data/mockData';

interface FairnessMetricsChartProps {
  data: FairnessMetric[];
  loading?: boolean;
}

export function FairnessMetricsChart({ data, loading }: FairnessMetricsChartProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-slate-200 rounded w-1/2 dark:bg-slate-700"></div>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-slate-200 rounded dark:bg-slate-700"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">No fairness metrics available</p>
        </CardContent>
      </Card>
    );
  }

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : null;

  // Prepare data for bar chart showing fairness trend over time
  const trendData = data.slice(-7).map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    fairness: Math.round(item.citywideScore * 100),
    complaints: Math.round(item.complaintsResolvedPct * 100),
  }));

  // Pie chart data for current fairness breakdown
  const fairnessPercentage = Math.round(latest.citywideScore * 100);
  const complaintsPercentage = Math.round(latest.complaintsResolvedPct * 100);

  const pieData = [
    { name: 'Fair', value: fairnessPercentage },
    { name: 'Improving', value: 100 - fairnessPercentage },
  ];

  const complaintsPieData = [
    { name: 'Resolved', value: complaintsPercentage },
    { name: 'Pending', value: 100 - complaintsPercentage },
  ];

  return (
    <div className="space-y-6">
      {/* Top-level metrics cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Fairness Index Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 -mr-16 -mt-16"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Fairness Index</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Citywide distribution equity</CardDescription>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚖️</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">{fairnessPercentage}%</div>
            {previous && (
              <p className={`text-sm mt-2 font-semibold ${fairnessPercentage > Math.round(previous.citywideScore * 100) ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {fairnessPercentage > Math.round(previous.citywideScore * 100) ? '↑ Improved' : '↓ Declined'} vs last period
              </p>
            )}
            <div className="mt-6 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" startAngle={180} endAngle={0} innerRadius={28} outerRadius={45}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#dbeafe" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Resolved Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full opacity-20 -mr-16 -mt-16"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Complaints Resolved</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Resolution rate this month</CardDescription>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-green-700 dark:text-green-300">{complaintsPercentage}%</div>
            {previous && (
              <p className={`text-sm mt-2 font-semibold ${complaintsPercentage > Math.round(previous.complaintsResolvedPct * 100) ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {complaintsPercentage > Math.round(previous.complaintsResolvedPct * 100) ? '↑ Improved' : '↓ Declined'} vs last period
              </p>
            )}
            <div className="mt-6 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={complaintsPieData} dataKey="value" startAngle={180} endAngle={0} innerRadius={28} outerRadius={45}>
                    <Cell fill="#10b981" />
                    <Cell fill="#dcfce7" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Average Supply Hours Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 dark:bg-amber-800 rounded-full opacity-20 -mr-16 -mt-16"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Supply</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Hours per day across wards</CardDescription>
              </div>
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">💧</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-amber-700 dark:text-amber-300">{latest.averageSupplyHours.toFixed(1)}</div>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium">hrs/day</p>
            {previous && (
              <p className={`text-sm mt-2 font-semibold ${latest.averageSupplyHours > previous.averageSupplyHours ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {latest.averageSupplyHours > previous.averageSupplyHours ? '↑ Increased' : '↓ Decreased'} vs last period
              </p>
            )}
            <div className="mt-6 flex items-center gap-2">
              <div className="flex-1 bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(latest.averageSupplyHours / 24) * 100}%` }}
                ></div>
              </div>
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>

        {/* Peak Usage Time Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 -mr-16 -mt-16"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Peak Usage Time</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Highest demand period</CardDescription>
              </div>
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">⏰</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{peakUsageTime.time}</div>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-medium">{peakUsageTime.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" 
                  style={{ width: `${peakUsageTime.demandPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{peakUsageTime.demandPercentage}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Unscheduled Interruptions Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 dark:bg-red-800 rounded-full opacity-20 -mr-16 -mt-16"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Unscheduled Interruptions</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">This month</CardDescription>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚠️</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Total Incidents</p>
                <div className="text-4xl font-bold text-red-700 dark:text-red-300">{unscheduledInterruptions.count}</div>
              </div>
              <div className="border-t border-red-200 dark:border-red-800 pt-3">
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Avg Resolution Time</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">{unscheduledInterruptions.averageResolutionTime} min</p>
              </div>
              <div className="text-xs text-red-600 dark:text-red-400">
                <span className="font-semibold">Affected:</span> {unscheduledInterruptions.affectedAreas.join(', ')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance Trend</CardTitle>
          <CardDescription>Last 7 days showing both metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorFairness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="timestamp" stroke="#9ca3af" />
              <YAxis domain={[0, 100]} stroke="#9ca3af" />
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '2px solid #3b82f6',
                  color: '#f3f4f6',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="fairness" fill="url(#colorFairness)" name="Fairness Index %" radius={[8, 8, 0, 0]} />
              <Bar dataKey="complaints" fill="url(#colorComplaints)" name="Complaints Resolved %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Insight */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950 dark:via-cyan-950 dark:to-blue-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-200 dark:bg-blue-800 rounded-full opacity-10 -mr-24 -mt-24"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Fairness Insight
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700 dark:text-slate-300 relative z-10">
          {fairnessPercentage >= 80 ? (
            <div className="flex gap-3">
              <span className="text-2xl">✓</span>
              <p>Your ward is receiving excellent equitable water distribution. The fairness index indicates well-balanced supply across all zones.</p>
            </div>
          ) : fairnessPercentage >= 60 ? (
            <div className="flex gap-3">
              <span className="text-2xl">◐</span>
              <p>Water distribution is improving. Some wards may receive adjusted supply to balance equity. Check your supply schedule for updates.</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <span className="text-2xl">⚠️</span>
              <p>Water distribution needs attention. Your area may be underserved. We're working to improve fairness. Monitor updates regularly.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

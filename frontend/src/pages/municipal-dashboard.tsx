import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import type { GeoJSON as LeafletGeoJSON } from 'leaflet';
import { TrendingUp, AlertTriangle, Activity, Zap, RefreshCcw, Filter, Bot } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import 'leaflet/dist/leaflet.css';

import { useTelemetry } from '@/hooks/use-telemetry';
import { ManualDataEntrySection } from '@/components/dashboard/manual-data-entry';
import { LastMaintenanceSection } from '@/components/dashboard/last-maintenance';
import { BillingManagementSection } from '@/components/dashboard/billing-management';
import { RewardSystemManagement } from '@/components/dashboard/reward-system';
import { EmergencyContactsManagement } from '@/components/dashboard/emergency-contacts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  fetchDemandForecast,
  fetchFairnessMetrics,
  fetchIncidents,
  fetchPumpSchedules,
  fetchPumpStations,
  fetchReservoirs,
  fetchTelemetry,
  fetchWaterZones,
} from '@/services/mockApi';
import type { IncidentReport, WaterZone } from '@/types';

const pressureColors: Record<WaterZone['pressure'], string> = {
  low: '#f97316',
  medium: '#0ea5e9',
  high: '#22c55e',
};

const severityColors: Record<IncidentReport['severity'], string> = {
  low: '#0ea5e9',
  moderate: '#facc15',
  critical: '#ef4444',
};

export function MunicipalDashboard() {
  const [selectedZone, setSelectedZone] = useState<string | 'all'>('all');
  const zonesQuery = useQuery({
    queryKey: ['zones'],
    queryFn: fetchWaterZones,
  });
  const telemetryQuery = useQuery({
    queryKey: ['telemetry'],
    queryFn: fetchTelemetry,
  });
  const liveTelemetry = useTelemetry();
  const telemetryData = liveTelemetry && liveTelemetry.length ? liveTelemetry : telemetryQuery.data;
  const fairnessQuery = useQuery({
    queryKey: ['fairness'],
    queryFn: fetchFairnessMetrics,
  });
  const incidentsQuery = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });
  const schedulesQuery = useQuery({
    queryKey: ['pumpSchedules'],
    queryFn: fetchPumpSchedules,
  });
  const pumpStationsQuery = useQuery({
    queryKey: ['pumpStations'],
    queryFn: fetchPumpStations,
  });
  const reservoirsQuery = useQuery({
    queryKey: ['reservoirs'],
    queryFn: fetchReservoirs,
  });
  const demandForecastQuery = useQuery({
    queryKey: ['demandForecast'],
    queryFn: fetchDemandForecast,
  });

  const latestTelemetry = telemetryData?.at(-1);
  const fairnessScore = fairnessQuery.data?.at(-1)?.citywideScore ?? 0;
  const underservedWards = fairnessQuery.data?.at(-1)?.underservedWards ?? 0;

  const filteredZones = useMemo(() => {
    if (!zonesQuery.data) return [];
    if (selectedZone === 'all') return zonesQuery.data;
    return zonesQuery.data.filter((zone) => zone.id === selectedZone);
  }, [zonesQuery.data, selectedZone]);

  const filteredIncidents = useMemo(() => {
    if (!incidentsQuery.data) return [];
    if (selectedZone === 'all') return incidentsQuery.data;
    return incidentsQuery.data.filter((incident) => incident.zoneId === selectedZone);
  }, [incidentsQuery.data, selectedZone]);

  const aiRecommendations = useMemo(() => {
    if (!schedulesQuery.data) return [];
    return schedulesQuery.data
      .filter((schedule) => schedule.recommendationReason)
      .map((schedule) => ({
        id: `${schedule.pumpId}-${schedule.zoneId}`,
        pumpId: schedule.pumpId,
        zoneId: schedule.zoneId,
        message: schedule.recommendationReason!,
        status: schedule.status,
      }));
  }, [schedulesQuery.data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Raipur Water Operations Command</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Live telemetry, AI scheduling, and fairness insights for Raipur Municipal Corporation.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Badge variant="info">Fairness Score {Math.round(fairnessScore * 100)}%</Badge>
            <Badge variant="warning">Underserved Wards: {underservedWards}</Badge>
            {latestTelemetry && (
              <Badge variant="success">
                Live Flow: {latestTelemetry.totalFlowMl.toFixed(1)} ML
              </Badge>
            )}
          </div>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Network Pressure</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {latestTelemetry ? `${latestTelemetry.pressurePsi} psi` : '—'}
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Across {zonesQuery.data?.length ?? 0} monitored zones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Energy Consumption</CardTitle>
            <Zap className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {latestTelemetry ? `${latestTelemetry.energyConsumptionKw} kW` : '—'}
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Compared to baseline (↓4.2% YoY)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Incidents</CardTitle>
            <AlertTriangle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{filteredIncidents.length}</div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {incidentsQuery.data?.length ?? 0} total citywide today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>AI Schedules</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{aiRecommendations.length}</div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Human review pending for {schedulesQuery.data?.filter((item) => item.status === 'scheduled').length ?? 0} runs
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Interactive Zone Map</CardTitle>
              <CardDescription>
                Zones color-coded by live pressure and fairness health.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setSelectedZone('all')}
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {selectedZone === 'all' ? 'All Zones' : zonesQuery.data?.find((zone) => zone.id === selectedZone)?.name}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[420px] overflow-hidden rounded-2xl">
              <MapContainer
                center={[21.2514, 81.6296]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredZones.map((zone) => (
                  <GeoJSON
                    key={zone.id}
                    data={zone.geojson as any}
                    eventHandlers={{
                      click: () => setSelectedZone(zone.id),
                    }}
                    style={() => ({
                      color: pressureColors[zone.pressure],
                      weight: 1.2,
                      fillOpacity: 0.4,
                      fillColor: pressureColors[zone.pressure],
                    })}
                  >
                    <LeafletTooltip direction="top" sticky>
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold">{zone.name}</p>
                        <p>Pressure: {zone.pressure}</p>
                        <p>Fairness: {Math.round(zone.fairnessScore * 100)}%</p>
                        <p>Supply Hours: {zone.supplyHoursPerDay} hrs</p>
                      </div>
                    </LeafletTooltip>
                  </GeoJSON>
                ))}
                {filteredIncidents.map((incident) => (
                  <CircleMarker
                    key={incident.id}
                    center={incident.coordinates}
                    radius={12}
                    pathOptions={{
                      color: severityColors[incident.severity],
                      fillColor: severityColors[incident.severity],
                      fillOpacity: 0.7,
                    }}
                  >
                    <LeafletTooltip direction="top">
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold capitalize">{incident.type.replace('_', ' ')}</p>
                        <p>Severity: {incident.severity}</p>
                        <p>Status: {incident.status}</p>
                        <p>{incident.description}</p>
                      </div>
                    </LeafletTooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demand Forecast (ML)</CardTitle>
            <CardDescription>AI prediction for the next 24 hours per zone</CardDescription>
          </CardHeader>
          <CardContent className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandForecastQuery.data ?? []}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} />
                <YAxis domain={['dataMin-5', 'dataMax+5']} />
                <Tooltip
                  formatter={(value: number) => [`${value} ML`, 'Demand']}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleString('en-IN', {
                      hour: 'numeric',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short',
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="demandMl"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorDemand)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pump Schedules & Status</CardTitle>
            <CardDescription>AI optimized runs awaiting operator confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedulesQuery.data?.map((schedule) => {
                const zoneName = zonesQuery.data?.find((zone) => zone.id === schedule.zoneId)?.name;
                return (
                  <div
                    key={`${schedule.pumpId}-${schedule.startTimeUtc}`}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          {schedule.pumpId.toUpperCase()} → {zoneName ?? schedule.zoneId}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(schedule.startTimeUtc).toLocaleTimeString('en-IN', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}{' '}
                          –{' '}
                          {new Date(schedule.endTimeUtc).toLocaleTimeString('en-IN', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}{' '}
                          IST · Flow {schedule.flowRateLps} L/s
                        </p>
                      </div>
                      <Badge
                        variant={
                          schedule.status === 'running'
                            ? 'success'
                            : schedule.status === 'scheduled'
                              ? 'info'
                              : schedule.status === 'paused'
                                ? 'warning'
                                : 'default'
                        }
                      >
                        {schedule.status}
                      </Badge>
                    </div>
                    {schedule.recommendationReason && (
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {schedule.recommendationReason}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary">
                        Approve Run
                      </Button>
                      <Button size="sm" variant="outline">
                        Adjust Window
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Insights & Alerts</CardTitle>
            <CardDescription>Hybrid ML + rule engine recommendations in review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiRecommendations.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                AI scheduler is up to date. No pending recommendations.
              </p>
            )}
            {aiRecommendations.map((recommendation) => {
              const zoneName = zonesQuery.data?.find((zone) => zone.id === recommendation.zoneId)?.name;
              return (
                <div
                  key={recommendation.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      Pump {recommendation.pumpId.toUpperCase()} → {zoneName ?? recommendation.zoneId}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{recommendation.message}</p>
                    <Badge variant="info" className="uppercase">
                      Status: {recommendation.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incident Response</CardTitle>
            <CardDescription>Citizen reports merged with sensor alerts citywide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredIncidents.map((incident) => {
              const zoneName = zonesQuery.data?.find((zone) => zone.id === incident.zoneId)?.name;
              return (
                <div
                  key={incident.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold capitalize">
                        {incident.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {zoneName ?? incident.zoneId} ·{' '}
                        {new Date(incident.reportedAt).toLocaleTimeString('en-IN', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}{' '}
                        IST
                      </p>
                    </div>
                    <Badge
                      variant={
                        incident.severity === 'critical'
                          ? 'danger'
                          : incident.severity === 'moderate'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{incident.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
                      Source: {incident.reportedBy}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-1 capitalize dark:bg-slate-800">
                      Status: {incident.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredIncidents.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">No incidents for this filter.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Network Assets & Reservoirs</CardTitle>
            <CardDescription>Pump health and storage levels for Raipur zones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Reservoir Status</p>
              {reservoirsQuery.data?.map((reservoir) => (
                <div key={reservoir.id} className="space-y-1 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{reservoir.name}</p>
                    <Badge variant={reservoir.trend === 'falling' ? 'warning' : reservoir.trend === 'rising' ? 'success' : 'info'}>
                      {reservoir.trend}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {reservoir.currentLevelMl} / {reservoir.capacityMillionLitres} ML
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pumps: {reservoir.pumpsConnected.join(', ').toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pump Stations</p>
              {pumpStationsQuery.data?.map((pump) => (
                <div key={pump.id} className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{pump.name}</p>
                    <Badge
                      variant={
                        pump.status === 'operational'
                          ? 'success'
                          : pump.status === 'maintenance'
                            ? 'warning'
                            : 'danger'
                      }
                    >
                      {pump.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connected Zones: {pump.connectedZoneIds.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Energy Use: {pump.energyUseKw} kW · Health Score {Math.round(pump.healthScore * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operations Management Section */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Operations Management</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manual data entry and maintenance tracking</p>
          </div>
          <div className="space-y-6">
            <ManualDataEntrySection />
            <LastMaintenanceSection />
          </div>
        </div>

        {/* Billing Management Section */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Billing Management</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bill generation, payment collection, and invoice management</p>
          </div>
          <BillingManagementSection />
        </div>

        {/* Reward System Section */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-8 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Citizen Reward System</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage rewards, points, tiers, and citizen incentives for timely payments and water conservation</p>
          </div>
          <RewardSystemManagement />
        </div>

        {/* Emergency Contacts Section */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-red-50 to-orange-50 p-8 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Emergency Service Contacts</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">24/7 plumbers, electricians, and municipal services directory</p>
          </div>
          <EmergencyContactsManagement />
        </div>
      </section>
    </div>
  );
}


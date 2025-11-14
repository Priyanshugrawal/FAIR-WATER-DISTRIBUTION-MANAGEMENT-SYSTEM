import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MapPin, Bell, Droplets, CheckCircle, Send, Sparkles, LogOut } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { FairnessMetricsChart } from '@/components/charts/fairness-metrics-chart';
import { BillingStatus } from '@/components/citizen/billing-status';
import { RewardStatus } from '@/components/citizen/reward-status';
import {
  fetchFairnessMetrics,
  fetchIncidents,
  fetchSupplySchedules,
  fetchWaterZones,
  submitCitizenReport,
} from '@/services/mockApi';
import type { CitizenReportPayload } from '@/types';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const incidentLabels: Record<string, string> = {
  leak: 'Leak',
  low_pressure: 'Low Pressure',
  contamination: 'Quality',
  outage: 'Outage',
  over_pumping: 'Over Pumping',
};

type FormState = CitizenReportPayload;

const initialFormState: FormState = {
  name: '',
  phone: '',
  wardNumber: 0,
  zoneId: '',
  type: 'low_pressure',
  description: '',
  photoUrl: '',
};

export function CitizenPortal() {
  const navigate = useNavigate();
  const { citizen, logout } = useAuth();
  const zonesQuery = useQuery({ queryKey: ['zones'], queryFn: fetchWaterZones });
  const scheduleQuery = useQuery({ queryKey: ['schedules'], queryFn: fetchSupplySchedules });
  const incidentsQuery = useQuery({ queryKey: ['incidents'], queryFn: fetchIncidents });
  const fairnessQuery = useQuery({ queryKey: ['fairness'], queryFn: fetchFairnessMetrics });

  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-1');
  const [selectedWeekday, setSelectedWeekday] = useState<string>('Monday');
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const selectedZone = useMemo(
    () => zonesQuery.data?.find((zone) => zone.id === selectedZoneId),
    [zonesQuery.data, selectedZoneId],
  );

  const todaysSchedules = useMemo(() => {
    if (!scheduleQuery.data) return [];
    return scheduleQuery.data.filter(
      (entry) => entry.zoneId === selectedZoneId && entry.weekday === selectedWeekday,
    );
  }, [scheduleQuery.data, selectedWeekday, selectedZoneId]);

  const citizenMutation = useMutation({
    mutationFn: submitCitizenReport,
    onSuccess: () => {
      toast.success('Thank you! Your report has been sent to Raipur Municipal Water Control.');
      setFormState(initialFormState);
    },
    onError: () => {
      toast.error('Unable to submit report right now. Please try again shortly.');
    },
  });

  const activeIncidents = useMemo(() => {
    if (!incidentsQuery.data) return [];
    return incidentsQuery.data.filter((incident) => incident.zoneId === selectedZoneId);
  }, [incidentsQuery.data, selectedZoneId]);

  const fairnessSnapshot = fairnessQuery.data?.at(-1);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.zoneId) {
      toast.error('Please choose the affected zone.');
      return;
    }
    if (!formState.name.trim() || !formState.phone.trim()) {
      toast.error('Please add your name and phone number.');
      return;
    }
    if (formState.phone.length < 8) {
      toast.error('Please provide a valid phone number.');
      return;
    }
    citizenMutation.mutate({
      ...formState,
      wardNumber: Number(formState.wardNumber),
    });
  };

  return (
    <div className="space-y-6">
      {/* Billing Status Section */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Billing & Water Supply Status</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">View your bills, payment status, and water supply information</p>
        </div>
        <BillingStatus />
      </div>

      {/* Reward Status Section */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-8 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Rewards & Incentives</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Earn points for timely payments, water conservation, and community contributions. Redeem for discounts and coupons!</p>
        </div>
        <RewardStatus />
      </div>

      {/* Fairness Metrics Dashboard */}
      <FairnessMetricsChart data={fairnessQuery.data || []} loading={fairnessQuery.isLoading} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Citizen Water Companion — Raipur Residents
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Check today&apos;s supply timings, fairness metrics, and raise an issue directly to RMC.
          </p>
        </div>
        {fairnessSnapshot && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">Fairness Index {Math.round(fairnessSnapshot.citywideScore * 100)}%</Badge>
            <Badge variant="success">Complaints resolved {Math.round(fairnessSnapshot.complaintsResolvedPct * 100)}%</Badge>
            <Badge variant="warning">Avg supply {fairnessSnapshot.averageSupplyHours} hrs/day</Badge>
          </div>
        )}
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Supply Schedule</CardTitle>
              <CardDescription>Select your ward/zone to see upcoming water slots.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                value={selectedZoneId}
                onChange={(event) => {
                  setSelectedZoneId(event.target.value);
                  setSelectedWeekday('Monday');
                }}
              >
                {zonesQuery.data?.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    Ward {zone.wardNumber} · {zone.name}
                  </option>
                ))}
              </select>
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                value={selectedWeekday}
                onChange={(event) => setSelectedWeekday(event.target.value)}
              >
                {weekdays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedZone && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-100/60 p-4 dark:bg-slate-900/60">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">
                    Ward {selectedZone.wardNumber} · {selectedZone.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Population served {selectedZone.populationServed.toLocaleString('en-IN')}{' '}
                    · Daily supply {selectedZone.supplyHoursPerDay} hrs
                  </p>
                </div>
                <Badge
                  variant={
                    selectedZone.pressure === 'high'
                      ? 'success'
                      : selectedZone.pressure === 'medium'
                        ? 'info'
                        : 'warning'
                  }
                >
                  Pressure {selectedZone.pressure}
                </Badge>
              </div>
            )}

            <div className="space-y-3">
              {todaysSchedules.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No planned supply slots for {selectedWeekday}. Please try another day.
                </p>
              )}
              {todaysSchedules.map((slot) => (
                <div
                  key={`${slot.zoneId}-${slot.startTime}-${slot.endTime}`}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold">
                      {slot.startTime} – {slot.endTime}
                    </p>
                    <Badge variant="info">Municipal Scheduled</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Maintain storage buckets before start time · Keep taps closed until supply begins to avoid air pressure.
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm text-primary">
              <Sparkles className="mr-2 inline h-4 w-4" />
              AI fairness update: zones with lower equity scores are prioritised in evening supply rotations.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Updates shared by Raipur Municipal Water Control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold capitalize">
                    {incidentLabels[incident.type] ?? incident.type}
                  </p>
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
                <p className="text-xs text-slate-500 dark:text-slate-400">{incident.description}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Updated{' '}
                  {new Date(incident.reportedAt).toLocaleTimeString('en-IN', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
            {activeIncidents.length === 0 && (
              <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success">
                <CheckCircle className="mr-2 inline h-4 w-4" />
                No active alerts for this zone. Supply is on schedule today.
              </div>
            )}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <p className="font-semibold uppercase tracking-wide">Tips</p>
              <ul className="space-y-1 list-disc pl-4">
                <li>Store water in clean containers before the scheduled slot begins.</li>
                <li>Report leaks immediately to protect the fairness index of Raipur wards.</li>
                <li>Install household aerators to conserve water and maintain pressure.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report an Issue</CardTitle>
            <CardDescription>Send a geo-tagged complaint to the municipal response team.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="font-medium">Full Name</span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                    required
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium">Phone Number</span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="10-digit mobile"
                    value={formState.phone}
                    onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                    required
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="font-medium">Ward Number</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Ward"
                    value={formState.wardNumber || ''}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, wardNumber: Number(event.target.value) }))
                    }
                    required
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium">Select Zone</span>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                    value={formState.zoneId}
                    onChange={(event) => setFormState((prev) => ({ ...prev, zoneId: event.target.value }))}
                    required
                  >
                    <option value="" disabled>
                      Choose zone
                    </option>
                    {zonesQuery.data?.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        Ward {zone.wardNumber} · {zone.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Issue Type</span>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                  value={formState.type}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, type: event.target.value as CitizenReportPayload['type'] }))
                  }
                >
                  {Object.entries(incidentLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Describe the issue</span>
                <textarea
                  className="min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Example: No supply in Street 12 since 6 AM, visible leak near pump house."
                  value={formState.description}
                  onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                  required
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Photo URL (optional)</span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900"
                  placeholder="https://"
                  value={formState.photoUrl ?? ''}
                  onChange={(event) => setFormState((prev) => ({ ...prev, photoUrl: event.target.value }))}
                />
              </label>
              <Button type="submit" className="w-full" disabled={citizenMutation.isPending}>
                <Send className="mr-2 h-4 w-4" />
                Submit Report
              </Button>
              {citizenMutation.isPending && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submitting to Raipur Smart Water Control…
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fairness & Transparency</CardTitle>
            <CardDescription>How Raipur ensures equitable water distribution across wards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-semibold">Fairness Index Explained</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                The fairness index tracks how evenly water is supplied across all 70 wards. It combines supply hours,
                pressure levels, citizen complaints, and pump energy usage to prioritise underserved neighbourhoods.
              </p>
            </div>
            <div className="rounded-xl border border-secondary/30 bg-secondary/10 p-4 text-xs text-secondary">
              <Droplets className="mr-2 inline h-4 w-4" />
              Community tip: Use the app to report any supply inequality. AI models learn from your updates to rebalance future schedules.
            </div>
            <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <p>Enable push notifications for maintenance alerts, tanker deployments, and emergency shutdowns.</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <p>
                  82% of citizen complaints in the last quarter were resolved within 12 hours thanks to integrated control center workflows.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-warning" />
                <p>
                  Upcoming: bilingual chatbot for quick answers, WhatsApp alerts, and integration with Raipur Smart City dashboards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


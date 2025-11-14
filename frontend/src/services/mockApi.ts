import {
  demandForecast,
  fairnessMetrics,
  incidents,
  pumpSchedules,
  pumpStations,
  reservoirs,
  telemetrySnapshots,
  waterZones,
  supplySchedules,
} from '@/data/mockData';
import type {
  CitizenReportPayload,
  DemandForecastPoint,
  FairnessMetric,
  IncidentReport,
  PumpScheduleEntry,
  PumpStation,
  ReservoirStatus,
  SupplySchedule,
  TelemetrySnapshot,
  WaterZone,
} from '@/types';

const NETWORK_LATENCY = 250;

function simulateLatency<T>(data: T, latency = NETWORK_LATENCY): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), latency);
  });
}

// Base URL for backend API. Override with Vite env: VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK).toLowerCase() === 'true';

async function fetchOrFallback<T>(path: string, fallback: T): Promise<T> {
  if (USE_MOCK) return simulateLatency(fallback);

  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    return data;
  } catch (err) {
    // If backend is not available or returns error, fall back to bundled mock data
    // This keeps the UI working when running without the backend.
    // eslint-disable-next-line no-console
    console.warn(`API fetch failed for ${path}, using mock data.`, err);
    return simulateLatency(fallback);
  }
}

export function fetchWaterZones(): Promise<WaterZone[]> {
  return fetchOrFallback('/zones/', waterZones);
}

export function fetchTelemetry(): Promise<TelemetrySnapshot[]> {
  return fetchOrFallback('/telemetry/', telemetrySnapshots as unknown as TelemetrySnapshot[]);
}

export function fetchFairnessMetrics(): Promise<FairnessMetric[]> {
  return fetchOrFallback('/telemetry/fairness', fairnessMetrics as unknown as FairnessMetric[]);
}

export function fetchIncidents(): Promise<IncidentReport[]> {
  return fetchOrFallback('/incidents/', incidents as unknown as IncidentReport[]);
}

export function fetchPumpSchedules(): Promise<PumpScheduleEntry[]> {
  return fetchOrFallback('/pumps/schedules', pumpSchedules as unknown as PumpScheduleEntry[]);
}

export function fetchPumpStations(): Promise<PumpStation[]> {
  return fetchOrFallback('/pumps/stations', pumpStations as unknown as PumpStation[]);
}

export function fetchReservoirs(): Promise<ReservoirStatus[]> {
  return fetchOrFallback('/pumps/reservoirs', reservoirs as unknown as ReservoirStatus[]);
}

export function fetchDemandForecast(): Promise<DemandForecastPoint[]> {
  return fetchOrFallback('/telemetry/demand-forecast', demandForecast as unknown as DemandForecastPoint[]);
}

export function fetchSupplySchedules(): Promise<SupplySchedule[]> {
  return fetchOrFallback('/supply/schedules', supplySchedules as unknown as SupplySchedule[]);
}

export async function submitCitizenReport(payload: CitizenReportPayload): Promise<{ success: boolean }> {
  // Map frontend camelCase payload to backend snake_case expected keys
  const body = {
    name: payload.name,
    phone: payload.phone,
    ward_number: payload.wardNumber,
    zone_id: payload.zoneId,
    type: payload.type,
    description: payload.description,
    photo_url: payload.photoUrl || null,
  };
  if (USE_MOCK) {
    console.info('VITE_USE_MOCK=true → skipping API POST and using mock response');
    return simulateLatency({ success: true }, 400);
  }

  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/incidents/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // backend returns the created IncidentReport; frontend historically expects success flag
    return { success: true };
  } catch (err) {
    console.warn('Failed to submit citizen report to API, falling back to mock.', err);
    // fallback behavior matches previous mock: return success after slight delay
    return simulateLatency({ success: true }, 400);
  }
}


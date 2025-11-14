export type PressureLevel = 'low' | 'medium' | 'high';

// Auth types
export interface Citizen {
  id: string;
  full_name: string;
  email: string;
  district: string;
  tehsil: string;
  block: string;
  house_no: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  citizen: Citizen;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  district: string;
  tehsil: string;
  block: string;
  house_no: string;
}

// Water system types
export interface WaterZone {
  id: string;
  name: string;
  wardNumber: number;
  populationServed: number;
  supplyHoursPerDay: number;
  pressure: PressureLevel;
  lastUpdated: string;
  fairnessScore: number;
  latitude: number;
  longitude: number;
  demandForecastMl: number[];
  geojson: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}

export interface ReservoirStatus {
  id: string;
  name: string;
  capacityMillionLitres: number;
  currentLevelMl: number;
  trend: 'rising' | 'falling' | 'stable';
  pumpsConnected: string[];
}

export interface PumpScheduleEntry {
  pumpId: string;
  zoneId: string;
  startTimeUtc: string;
  endTimeUtc: string;
  flowRateLps: number;
  status: 'scheduled' | 'running' | 'paused' | 'completed';
  recommendationReason?: string;
}

export interface PumpStation {
  id: string;
  name: string;
  connectedZoneIds: string[];
  status: 'operational' | 'maintenance' | 'offline';
  energyUseKw: number;
  healthScore: number;
}

export interface IncidentReport {
  id: string;
  zoneId: string;
  reportedBy: 'sensor' | 'citizen';
  type: 'leak' | 'low_pressure' | 'contamination' | 'outage' | 'over_pumping';
  severity: 'low' | 'moderate' | 'critical';
  description: string;
  reportedAt: string;
  status: 'open' | 'acknowledged' | 'resolved';
  coordinates: [number, number];
}

export interface CitizenReportPayload {
  name: string;
  phone: string;
  wardNumber: number;
  zoneId: string;
  type: IncidentReport['type'];
  description: string;
  photoUrl?: string;
}

export interface SupplySchedule {
  zoneId: string;
  weekday: string;
  startTime: string;
  endTime: string;
}

export interface FairnessMetric {
  timestamp: string;
  citywideScore: number;
  underservedWards: number;
  complaintsResolvedPct: number;
  averageSupplyHours: number;
}

export interface DemandForecastPoint {
  timestamp: string;
  demandMl: number;
}

export interface TelemetrySnapshot {
  timestamp: string;
  totalFlowMl: number;
  pressurePsi: number;
  energyConsumptionKw: number;
  incidentsToday: number;
}

// Billing types
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type SupplyStatus = 'active' | 'limited' | 'suspended';

export interface Bill {
  id: string;
  citizen_email: string;
  amount: number;
  due_date: string;
  created_date: string;
  description: string;
  payment_status: PaymentStatus;
  supply_status: SupplyStatus;
}

export interface Payment {
  id: string;
  bill_id: string;
  amount: number;
  paid_date: string;
  payment_method: string;
  reference_number: string;
}

export interface Invoice {
  id: string;
  bill_id: string;
  citizen_email: string;
  amount: number;
  paid_date: string;
  payment_method: string;
  generated_date: string;
  invoice_number: string;
}

export interface CitizenBillStatus {
  bills: Bill[];
  total_pending: number;
  supply_status: SupplyStatus;
  overdue_days: number;
}

export interface BillingStats {
  total_bills: number;
  paid_bills: number;
  pending_bills: number;
  total_amount: number;
  total_paid: number;
  total_pending: number;
  collection_rate: number;
}

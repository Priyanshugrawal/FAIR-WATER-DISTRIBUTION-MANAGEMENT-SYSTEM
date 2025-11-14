import type {
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

export const waterZones: WaterZone[] = [
  {
    id: 'zone-1',
    name: 'Telibandha',
    wardNumber: 15,
    populationServed: 52000,
    supplyHoursPerDay: 6,
    pressure: 'medium',
    lastUpdated: '2025-11-13T09:15:00Z',
    fairnessScore: 0.82,
    latitude: 21.2514,
    longitude: 81.6296,
    demandForecastMl: [12.3, 13.1, 15.4, 14.2, 16.8, 18.1, 12.9],
    geojson: {
      type: 'Feature',
      properties: {
        name: 'Telibandha',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.6265, 21.2488],
            [81.6345, 21.2488],
            [81.6352, 21.2546],
            [81.6272, 21.2554],
            [81.6265, 21.2488],
          ],
        ],
      },
    },
  },
  {
    id: 'zone-2',
    name: 'Shankar Nagar',
    wardNumber: 25,
    populationServed: 47000,
    supplyHoursPerDay: 7.5,
    pressure: 'high',
    lastUpdated: '2025-11-13T09:15:00Z',
    fairnessScore: 0.9,
    latitude: 21.2432,
    longitude: 81.6641,
    demandForecastMl: [10.1, 11.5, 12.6, 11.9, 13.8, 14.5, 11.0],
    geojson: {
      type: 'Feature',
      properties: {
        name: 'Shankar Nagar',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.6605, 21.2391],
            [81.6689, 21.2391],
            [81.6689, 21.2472],
            [81.6601, 21.2472],
            [81.6605, 21.2391],
          ],
        ],
      },
    },
  },
  {
    id: 'zone-3',
    name: 'Pandri',
    wardNumber: 12,
    populationServed: 61000,
    supplyHoursPerDay: 5.5,
    pressure: 'low',
    lastUpdated: '2025-11-13T09:15:00Z',
    fairnessScore: 0.68,
    latitude: 21.2459,
    longitude: 81.6311,
    demandForecastMl: [14.2, 15.1, 17.7, 18.5, 19.3, 20.1, 16.4],
    geojson: {
      type: 'Feature',
      properties: {
        name: 'Pandri',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.6274, 21.2421],
            [81.6359, 21.2421],
            [81.6363, 21.2504],
            [81.6282, 21.2504],
            [81.6274, 21.2421],
          ],
        ],
      },
    },
  },
];

export const telemetrySnapshots: TelemetrySnapshot[] = [
  {
    timestamp: '2025-11-13T08:00:00Z',
    totalFlowMl: 42.3,
    pressurePsi: 58,
    energyConsumptionKw: 1240,
    incidentsToday: 2,
  },
  {
    timestamp: '2025-11-13T09:00:00Z',
    totalFlowMl: 44.1,
    pressurePsi: 60,
    energyConsumptionKw: 1205,
    incidentsToday: 3,
  },
  {
    timestamp: '2025-11-13T10:00:00Z',
    totalFlowMl: 46.7,
    pressurePsi: 61,
    energyConsumptionKw: 1278,
    incidentsToday: 3,
  },
];

export const fairnessMetrics: FairnessMetric[] = [
  {
    timestamp: '2025-11-11',
    citywideScore: 0.74,
    underservedWards: 7,
    complaintsResolvedPct: 0.71,
    averageSupplyHours: 5.8,
  },
  {
    timestamp: '2025-11-12',
    citywideScore: 0.79,
    underservedWards: 6,
    complaintsResolvedPct: 0.77,
    averageSupplyHours: 6.1,
  },
  {
    timestamp: '2025-11-13',
    citywideScore: 0.83,
    underservedWards: 5,
    complaintsResolvedPct: 0.82,
    averageSupplyHours: 6.5,
  },
];

export const pumpStations: PumpStation[] = [
  {
    id: 'pump-1',
    name: 'Pandri Booster Station',
    connectedZoneIds: ['zone-1', 'zone-3'],
    status: 'operational',
    energyUseKw: 420,
    healthScore: 0.92,
  },
  {
    id: 'pump-2',
    name: 'Raipur Central Station',
    connectedZoneIds: ['zone-2'],
    status: 'operational',
    energyUseKw: 365,
    healthScore: 0.88,
  },
  {
    id: 'pump-3',
    name: 'Industrial Estate Pump',
    connectedZoneIds: ['zone-3'],
    status: 'maintenance',
    energyUseKw: 150,
    healthScore: 0.65,
  },
];

export const pumpSchedules: PumpScheduleEntry[] = [
  {
    pumpId: 'pump-1',
    zoneId: 'zone-1',
    startTimeUtc: '2025-11-13T05:00:00Z',
    endTimeUtc: '2025-11-13T07:30:00Z',
    flowRateLps: 450,
    status: 'completed',
    recommendationReason: 'Meet morning demand with moderate storage levels.',
  },
  {
    pumpId: 'pump-2',
    zoneId: 'zone-2',
    startTimeUtc: '2025-11-13T08:00:00Z',
    endTimeUtc: '2025-11-13T10:00:00Z',
    flowRateLps: 500,
    status: 'running',
    recommendationReason: 'AI: Maintain high fairness score and replenish tank.',
  },
  {
    pumpId: 'pump-3',
    zoneId: 'zone-3',
    startTimeUtc: '2025-11-13T11:00:00Z',
    endTimeUtc: '2025-11-13T13:00:00Z',
    flowRateLps: 380,
    status: 'scheduled',
    recommendationReason: 'AI: Catch up to meet evening demand and reduce leaks.',
  },
];

export const incidents: IncidentReport[] = [
  {
    id: 'incident-1',
    zoneId: 'zone-3',
    reportedBy: 'sensor',
    type: 'leak',
    severity: 'critical',
    description: 'Rapid pressure drop detected near Pandri Flyover.',
    reportedAt: '2025-11-13T09:05:00Z',
    status: 'acknowledged',
    coordinates: [21.2469, 81.6342],
  },
  {
    id: 'incident-2',
    zoneId: 'zone-1',
    reportedBy: 'citizen',
    type: 'low_pressure',
    severity: 'moderate',
    description: 'Citizen-reported low pressure on Street 14.',
    reportedAt: '2025-11-13T06:40:00Z',
    status: 'resolved',
    coordinates: [21.2519, 81.6305],
  },
  {
    id: 'incident-3',
    zoneId: 'zone-2',
    reportedBy: 'sensor',
    type: 'over_pumping',
    severity: 'low',
    description: 'Automated alert: flow exceeded target by 12%.',
    reportedAt: '2025-11-13T07:50:00Z',
    status: 'open',
    coordinates: [21.2445, 81.6662],
  },
];

export const reservoirs: ReservoirStatus[] = [
  {
    id: 'reservoir-1',
    name: 'Kharun Reservoir',
    capacityMillionLitres: 32,
    currentLevelMl: 24.5,
    trend: 'falling',
    pumpsConnected: ['pump-1', 'pump-2'],
  },
  {
    id: 'reservoir-2',
    name: 'Budhapara Storage',
    capacityMillionLitres: 18,
    currentLevelMl: 16.1,
    trend: 'stable',
    pumpsConnected: ['pump-3'],
  },
];

export const supplySchedules: SupplySchedule[] = [
  {
    zoneId: 'zone-1',
    weekday: 'Monday',
    startTime: '05:30',
    endTime: '07:30',
  },
  {
    zoneId: 'zone-1',
    weekday: 'Monday',
    startTime: '18:00',
    endTime: '21:00',
  },
  {
    zoneId: 'zone-2',
    weekday: 'Monday',
    startTime: '06:30',
    endTime: '09:30',
  },
  {
    zoneId: 'zone-3',
    weekday: 'Monday',
    startTime: '05:00',
    endTime: '07:00',
  },
  {
    zoneId: 'zone-3',
    weekday: 'Monday',
    startTime: '19:30',
    endTime: '22:00',
  },
];

export const demandForecast: DemandForecastPoint[] = [
  { timestamp: '2025-11-13T00:00:00+05:30', demandMl: 35 },
  { timestamp: '2025-11-13T04:00:00+05:30', demandMl: 42 },
  { timestamp: '2025-11-13T08:00:00+05:30', demandMl: 55 },
  { timestamp: '2025-11-13T12:00:00+05:30', demandMl: 48 },
  { timestamp: '2025-11-13T16:00:00+05:30', demandMl: 52 },
  { timestamp: '2025-11-13T20:00:00+05:30', demandMl: 38 },
  { timestamp: '2025-11-14T00:00:00+05:30', demandMl: 32 },
];

// Peak usage time and interruption metrics
export const peakUsageTime = {
  time: '08:00 - 10:00 AM',
  demandPercentage: 87,
  description: 'Morning peak demand across city',
};

export const unscheduledInterruptions = {
  count: 3,
  totalDuration: 145, // minutes
  lastInterruption: '2025-11-14T05:30:00+05:30',
  affectedAreas: ['Ward 15', 'Ward 25'],
  averageResolutionTime: 28, // minutes
};

// Manual data entry reports
export const manualDataEntryReports = [
  {
    id: 'report-1',
    zone: 'Zone 1 - Telibandha',
    enteredBy: 'Sharma, Municipal Officer',
    timestamp: '2025-11-14T09:30:00+05:30',
    flowRate: 2450,
    pressure: 45.2,
    notes: 'Manual meter reading - pump station 5 calibration check',
  },
  {
    id: 'report-2',
    zone: 'Zone 2 - Shankar Nagar',
    enteredBy: 'Verma, Assistant',
    timestamp: '2025-11-14T08:15:00+05:30',
    flowRate: 2180,
    pressure: 48.5,
    notes: 'Evening supply verification',
  },
  {
    id: 'report-3',
    zone: 'Zone 3 - Kota Road',
    enteredBy: 'Singh, Technician',
    timestamp: '2025-11-13T14:45:00+05:30',
    flowRate: 1920,
    pressure: 42.1,
    notes: 'Pressure adjustment after filter cleaning',
  },
];

// Last maintenance records
export const maintenanceRecords = [
  {
    id: 'maint-1',
    zone: 'Pump Station 1',
    type: 'Filter Cleaning',
    completedDate: '2025-11-14T10:00:00+05:30',
    nextDue: '2025-11-28T00:00:00+05:30',
    performedBy: 'Technical Team - Raipur',
    status: 'Completed',
  },
  {
    id: 'maint-2',
    zone: 'Pump Station 3',
    type: 'Motor Oil Change',
    completedDate: '2025-11-13T15:30:00+05:30',
    nextDue: '2025-12-13T00:00:00+05:30',
    performedBy: 'Maintenance Contractor',
    status: 'Completed',
  },
  {
    id: 'maint-3',
    zone: 'Main Reservoir',
    type: 'Valve Inspection',
    completedDate: '2025-11-12T09:00:00+05:30',
    nextDue: '2025-11-26T00:00:00+05:30',
    performedBy: 'In-house Team',
    status: 'Completed',
  },
  {
    id: 'maint-4',
    zone: 'Pump Station 2',
    type: 'Pipe Replacement',
    completedDate: '2025-11-10T16:45:00+05:30',
    nextDue: '2026-02-10T00:00:00+05:30',
    performedBy: 'External Contractor',
    status: 'Pending',
  },
];




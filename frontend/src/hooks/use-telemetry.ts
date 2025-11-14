import { useEffect, useRef, useState } from 'react';
import type { TelemetrySnapshot } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK).toLowerCase() === 'true';

/**
 * useTelemetry
 * Connects to backend WS at `${API_BASE.replace(/^http/, 'ws')}/ws/telemetry`
 * Falls back to emitting mock telemetry snapshots every 5s when USE_MOCK=true or connection fails.
 */
export function useTelemetry(pollInterval = 5000) {
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const mockTimer = useRef<number | null>(null);

  useEffect(() => {
    if (USE_MOCK) {
      // Emit mock telemetry using window.setInterval
      const sendMock = () => {
        // Create a synthetic snapshot similar to backend payload
        const now = new Date().toISOString();
        const mock: TelemetrySnapshot = {
          timestamp: now,
          totalFlowMl: Math.round(100 + Math.random() * 200),
          pressurePsi: Math.round(10 + Math.random() * 80),
          energyConsumptionKw: Math.round(5 + Math.random() * 40),
          incidentsToday: Math.floor(Math.random() * 5),
        };
        setTelemetry([mock]);
      };
      sendMock();
      mockTimer.current = window.setInterval(sendMock, pollInterval);
      return () => {
        if (mockTimer.current) window.clearInterval(mockTimer.current);
      };
    }

    // Try to connect to WebSocket endpoint
    let wsUrl = API_BASE;
    // convert http(s)://host[:port]/api to ws(s)://host[:port]/api
    wsUrl = wsUrl.replace(/^http/, 'ws');
    // append the ws path
    const endpoint = `${wsUrl}/ws/telemetry`;

    try {
      const ws = new WebSocket(endpoint);
      wsRef.current = ws;

      ws.onopen = () => {
        // console.info('Telemetry WS connected', endpoint);
      };

      ws.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload?.type === 'telemetry_snapshot' && Array.isArray(payload.data)) {
            // map payload.data to TelemetrySnapshot[] shape expected by frontend
            const data = payload.data.map((item: any) => ({
              timestamp: item.timestamp || new Date().toISOString(),
              totalFlowMl: item.flow_ml ?? item.totalFlowMl ?? 0,
              pressurePsi: item.pressure_psi ?? item.pressurePsi ?? 0,
              energyConsumptionKw: item.energy_kw ?? item.energyConsumptionKw ?? 0,
              incidentsToday: item.incidents_today ?? item.incidentsToday ?? 0,
            })) as TelemetrySnapshot[];
            setTelemetry(data);
          }
        } catch (e) {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        // console.info('Telemetry WS closed');
      };

      ws.onerror = () => {
        // fallback to mock polling if WS fails
        if (wsRef.current) wsRef.current.close();
        wsRef.current = null;
        const sendMock = () => {
          const now = new Date().toISOString();
          const mock: TelemetrySnapshot = {
            timestamp: now,
            totalFlowMl: Math.round(100 + Math.random() * 200),
            pressurePsi: Math.round(10 + Math.random() * 80),
            energyConsumptionKw: Math.round(5 + Math.random() * 40),
            incidentsToday: Math.floor(Math.random() * 5),
          };
          setTelemetry([mock]);
        };
        sendMock();
        mockTimer.current = window.setInterval(sendMock, pollInterval);
      };

      return () => {
        if (wsRef.current) wsRef.current.close();
        if (mockTimer.current) window.clearInterval(mockTimer.current);
      };
    } catch (err) {
      // On exception, fallback to mock polling
      const sendMock = () => {
        const now = new Date().toISOString();
        const mock: TelemetrySnapshot = {
          timestamp: now,
          totalFlowMl: Math.round(100 + Math.random() * 200),
          pressurePsi: Math.round(10 + Math.random() * 80),
          energyConsumptionKw: Math.round(5 + Math.random() * 40),
          incidentsToday: Math.floor(Math.random() * 5),
        };
        setTelemetry([mock]);
      };
      sendMock();
      mockTimer.current = window.setInterval(sendMock, pollInterval);
      return () => {
        if (mockTimer.current) window.clearInterval(mockTimer.current);
      };
    }
  }, [pollInterval]);

  return telemetry;
}

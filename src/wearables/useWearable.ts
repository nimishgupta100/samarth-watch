/**
 * REACT HOOK: useWearable
 * 
 * Provides unified wearable state, device link, live readings,
 * connection controls, and coordinator demo tools.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DeviceLink,
  NormalizedReading,
  DeviceLogEntry,
  WearableSimulationScenario,
} from './types';
import { wearableIngestEngine } from './ingest';
import { simulatedWearableProvider } from './providers/simulator';
import { webBluetoothProvider, WebBluetoothProvider } from './providers/webBluetooth';
import { useApp } from '../context/AppContext';

export function useWearable(seniorId = 'senior-kamla-001') {
  const { selectedSenior } = useApp();
  const targetSeniorId = selectedSenior?.id || seniorId;

  // Active Device Link state
  const [deviceLinks, setDeviceLinks] = useState<DeviceLink[]>(() =>
    wearableIngestEngine.getDeviceLinksForSenior(targetSeniorId)
  );

  // Buffer of recent normalized readings
  const [readings, setReadings] = useState<NormalizedReading[]>(() =>
    wearableIngestEngine.getRawBuffer(targetSeniorId)
  );

  // Device logs
  const [logs, setLogs] = useState<DeviceLogEntry[]>(() =>
    wearableIngestEngine.getLogs(targetSeniorId)
  );

  // Active device link (primary)
  const primaryDevice = useMemo(() => {
    return deviceLinks[0] || null;
  }, [deviceLinks]);

  // Is Bluetooth supported on current browser
  const isBluetoothSupported = useMemo(() => {
    return WebBluetoothProvider.isSupported();
  }, []);

  // Sync state with WearableIngestEngine
  useEffect(() => {
    // 1. If no device exists yet for this senior, seed a default paired demo band
    const existing = wearableIngestEngine.getDeviceLinksForSenior(targetSeniorId);
    if (existing.length === 0) {
      const initialBand: DeviceLink = {
        id: `band_${targetSeniorId}`,
        seniorId: targetSeniorId,
        vendorModelName: 'Samarth Health Band (Demo)',
        kind: 'band',
        providerType: 'simulated',
        pairedBy: {
          userId: 'user-coordinator-nimish',
          role: 'coordinator',
        },
        pairedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        consentGivenAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        status: 'connected',
        lastSyncAt: Date.now(),
        lastSampleAt: Date.now(),
        batteryPercent: 88,
        firmware: 'v2.4.1-sim',
      };
      wearableIngestEngine.registerDeviceLink(initialBand);
      simulatedWearableProvider.connect(initialBand);
      setDeviceLinks([initialBand]);
    } else {
      setDeviceLinks(existing);
    }

    // Subscribe to new readings
    const unsubReadings = wearableIngestEngine.subscribeReadings((r) => {
      if (r.seniorId === targetSeniorId) {
        setReadings((prev) => [r, ...prev.slice(0, 49)]);
        setLogs(wearableIngestEngine.getLogs(targetSeniorId));
      }
    });

    // Subscribe to device link changes
    const unsubLinks = wearableIngestEngine.subscribeDeviceLinks((l) => {
      if (l.seniorId === targetSeniorId) {
        setDeviceLinks(wearableIngestEngine.getDeviceLinksForSenior(targetSeniorId));
      }
    });

    return () => {
      unsubReadings();
      unsubLinks();
    };
  }, [targetSeniorId]);

  // Connect Simulated Band
  const connectSimulator = useCallback(async () => {
    if (!primaryDevice) return;
    await simulatedWearableProvider.connect(primaryDevice);
    setDeviceLinks(wearableIngestEngine.getDeviceLinksForSenior(targetSeniorId));
  }, [primaryDevice, targetSeniorId]);

  // Disconnect Device
  const disconnectDevice = useCallback(async () => {
    if (!primaryDevice) return;
    if (primaryDevice.providerType === 'simulated') {
      await simulatedWearableProvider.disconnect();
    } else if (primaryDevice.providerType === 'web_bluetooth') {
      await webBluetoothProvider.disconnect();
    }
    setDeviceLinks(wearableIngestEngine.getDeviceLinksForSenior(targetSeniorId));
  }, [primaryDevice, targetSeniorId]);

  // Connect via Web Bluetooth
  const connectWebBluetooth = useCallback(async () => {
    const bleDevice: DeviceLink = {
      id: `ble_${targetSeniorId}_${Date.now()}`,
      seniorId: targetSeniorId,
      vendorModelName: 'Bluetooth Smart Health Device',
      kind: 'strap',
      providerType: 'web_bluetooth',
      pairedBy: {
        userId: 'user-coordinator-nimish',
        role: 'coordinator',
      },
      pairedAt: Date.now(),
      consentGivenAt: Date.now(),
      status: 'reconnecting',
      lastSyncAt: Date.now(),
      lastSampleAt: Date.now(),
    };
    wearableIngestEngine.registerDeviceLink(bleDevice);
    await webBluetoothProvider.connect(bleDevice);
    setDeviceLinks(wearableIngestEngine.getDeviceLinksForSenior(targetSeniorId));
  }, [targetSeniorId]);

  // Trigger Simulation Scenario (Demo Tools)
  const triggerScenario = useCallback(
    (scenario: WearableSimulationScenario) => {
      simulatedWearableProvider.setScenario(scenario);
    },
    []
  );

  // Quality statistics
  const qualityStats = useMemo(() => {
    const total = readings.length;
    const accepted = readings.filter((r) => r.quality === 'ok').length;
    const suspect = readings.filter((r) => r.quality === 'suspect').length;
    const rejected = readings.filter((r) => r.quality === 'rejected').length;
    return { total, accepted, suspect, rejected };
  }, [readings]);

  return {
    device: primaryDevice,
    deviceLinks,
    readings,
    logs,
    qualityStats,
    isBluetoothSupported,
    connectSimulator,
    disconnectDevice,
    connectWebBluetooth,
    triggerScenario,
  };
}

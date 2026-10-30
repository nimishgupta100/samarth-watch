/**
 * Bluetooth SIG Blood Pressure Measurement Characteristic (0x2A35) Parser
 * Pure function per Bluetooth SIG Blood Pressure Profile.
 */

import { parseSFloat } from './pulseOximeterParser';

export interface ParsedBloodPressure {
  systolic: number;
  diastolic: number;
  meanArterialPressure: number;
  unit: 'mmHg' | 'kPa';
  pulseBpm?: number;
}

export function parseBloodPressureMeasurement(dataView: DataView): ParsedBloodPressure | null {
  if (!dataView || dataView.byteLength < 7) return null;

  try {
    const flags = dataView.getUint8(0);
    const isKpa = (flags & 0x01) !== 0;
    const unit: 'mmHg' | 'kPa' = isKpa ? 'kPa' : 'mmHg';
    const hasTimestamp = (flags & 0x02) !== 0;
    const hasPulseRate = (flags & 0x04) !== 0;

    let offset = 1;
    const rawSys = dataView.getUint16(offset, true);
    offset += 2;
    const rawDia = dataView.getUint16(offset, true);
    offset += 2;
    const rawMap = dataView.getUint16(offset, true);
    offset += 2;

    let systolic = parseSFloat(rawSys);
    let diastolic = parseSFloat(rawDia);
    let meanArterialPressure = parseSFloat(rawMap);

    // If unit is kPa, convert to standard mmHg for clinical normalization (1 kPa = 7.50062 mmHg)
    if (unit === 'kPa') {
      systolic = Math.round(systolic * 7.50062);
      diastolic = Math.round(diastolic * 7.50062);
      meanArterialPressure = Math.round(meanArterialPressure * 7.50062);
    }

    if (hasTimestamp) {
      offset += 7; // Skip 7-byte timestamp field if present
    }

    let pulseBpm: number | undefined;
    if (hasPulseRate && dataView.byteLength >= offset + 2) {
      pulseBpm = Math.round(parseSFloat(dataView.getUint16(offset, true)));
    }

    return {
      systolic: Math.round(systolic),
      diastolic: Math.round(diastolic),
      meanArterialPressure: Math.round(meanArterialPressure),
      unit: 'mmHg',
      pulseBpm,
    };
  } catch {
    return null;
  }
}

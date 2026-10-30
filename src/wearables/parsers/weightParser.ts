/**
 * Bluetooth SIG Weight Measurement Characteristic (0x2A9D) Parser
 * Pure function per Bluetooth SIG Weight Scale Profile.
 */

export interface ParsedWeight {
  weightKg: number;
  unit: 'kg' | 'lb';
  bmi?: number;
}

export function parseWeightMeasurement(dataView: DataView): ParsedWeight | null {
  if (!dataView || dataView.byteLength < 3) return null;

  try {
    const flags = dataView.getUint8(0);
    const isImperial = (flags & 0x01) !== 0;
    const hasTimestamp = (flags & 0x02) !== 0;
    const hasUserId = (flags & 0x04) !== 0;
    const hasBmi = (flags & 0x08) !== 0;

    let offset = 1;
    const rawWeight = dataView.getUint16(offset, true);
    offset += 2;

    let weightKg: number;
    let unit: 'kg' | 'lb';

    if (isImperial) {
      unit = 'lb';
      // Imperial multiplier: 0.01 lb
      const weightLb = rawWeight * 0.01;
      weightKg = Number((weightLb * 0.453592).toFixed(1));
    } else {
      unit = 'kg';
      // SI multiplier: 0.005 kg per Bluetooth SIG spec
      weightKg = Number((rawWeight * 0.005).toFixed(1));
    }

    if (hasTimestamp) offset += 7;
    if (hasUserId) offset += 1;

    let bmi: number | undefined;
    if (hasBmi && dataView.byteLength >= offset + 2) {
      bmi = Number((dataView.getUint16(offset, true) * 0.1).toFixed(1));
    }

    return {
      weightKg,
      unit,
      bmi,
    };
  } catch {
    return null;
  }
}

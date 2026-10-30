/**
 * Bluetooth SIG Pulse Oximeter Continuous (0x2A5F) & Spot-Check (0x2A5E) Parser
 * Pure function per Bluetooth SIG PLX spec.
 * Returns SpO2 percentage and pulse rate.
 */

// SFLOAT (16-bit float: 4-bit signed exponent, 12-bit signed mantissa per IEEE-11073)
export function parseSFloat(val: number): number {
  let mantissa = val & 0x0fff;
  if ((mantissa & 0x0800) !== 0) {
    mantissa = -((0x0fff + 1) - mantissa);
  }
  let exponent = (val >> 12) & 0x000f;
  if ((exponent & 0x0008) !== 0) {
    exponent = -((0x000f + 1) - exponent);
  }
  return mantissa * Math.pow(10, exponent);
}

export interface ParsedPulseOximeter {
  spo2Percent: number;
  pulseBpm: number;
}

export function parsePulseOximeterContinuous(dataView: DataView): ParsedPulseOximeter | null {
  if (!dataView || dataView.byteLength < 4) return null;

  try {
    // Normal format: SpO2-PR-Normal field
    // 16-bit SFLOAT for SpO2, followed by 16-bit SFLOAT for PR
    const rawSpo2 = dataView.getUint16(0, true);
    const rawPr = dataView.getUint16(2, true);

    const spo2 = parseSFloat(rawSpo2);
    const pr = parseSFloat(rawPr);

    if (isNaN(spo2) || isNaN(pr)) return null;

    return {
      spo2Percent: Math.round(spo2),
      pulseBpm: Math.round(pr),
    };
  } catch {
    return null;
  }
}

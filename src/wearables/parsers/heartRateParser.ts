/**
 * Bluetooth SIG Heart Rate Measurement Characteristic (0x2A37) Parser
 * Pure function per Bluetooth Core Specification.
 */

export interface ParsedHeartRate {
  bpm: number;
  contactDetected?: boolean;
  contactSupported?: boolean;
  energyExpendedJoules?: number;
  rrIntervalsMs?: number[];
}

export function parseHeartRateMeasurement(dataView: DataView): ParsedHeartRate | null {
  if (!dataView || dataView.byteLength < 2) return null;

  try {
    const flags = dataView.getUint8(0);
    const is16Bit = (flags & 0x01) !== 0;
    const contactSupported = (flags & 0x04) !== 0;
    const contactDetected = contactSupported ? (flags & 0x02) !== 0 : undefined;
    const hasEnergy = (flags & 0x08) !== 0;
    const hasRR = (flags & 0x10) !== 0;

    let offset = 1;
    let bpm: number;

    if (is16Bit) {
      if (dataView.byteLength < offset + 2) return null;
      bpm = dataView.getUint16(offset, true); // Little endian
      offset += 2;
    } else {
      bpm = dataView.getUint8(offset);
      offset += 1;
    }

    let energyExpendedJoules: number | undefined;
    if (hasEnergy) {
      if (dataView.byteLength >= offset + 2) {
        energyExpendedJoules = dataView.getUint16(offset, true);
        offset += 2;
      }
    }

    let rrIntervalsMs: number[] | undefined;
    if (hasRR) {
      rrIntervalsMs = [];
      while (offset + 1 < dataView.byteLength) {
        // RR-Interval value in 1/1024 second units per Bluetooth SIG spec
        const rawRR = dataView.getUint16(offset, true);
        const ms = Math.round((rawRR / 1024) * 1000);
        rrIntervalsMs.push(ms);
        offset += 2;
      }
    }

    return {
      bpm,
      contactDetected,
      contactSupported,
      energyExpendedJoules,
      rrIntervalsMs,
    };
  } catch {
    return null;
  }
}

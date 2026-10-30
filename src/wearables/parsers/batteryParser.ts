/**
 * Bluetooth SIG Battery Level Characteristic (0x2A19) Parser
 * Pure function: returns battery percentage (0-100).
 */

export function parseBatteryLevel(dataView: DataView): number | null {
  if (!dataView || dataView.byteLength < 1) return null;
  const level = dataView.getUint8(0);
  if (level > 100) return null;
  return level;
}

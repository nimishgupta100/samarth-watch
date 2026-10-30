export interface SOSLocation {
  lat: number;
  lng: number;
  accuracy: number;
  source: 'live' | 'cached' | 'home_address';
  homeAddress?: string;
}

let lastKnownLocation: SOSLocation | null = null;

export function getCurrentLocation(timeoutMs = 8000): Promise<SOSLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    const timer = setTimeout(() => reject(new Error('Geolocation timeout')), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        const loc: SOSLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          source: 'live',
        };
        lastKnownLocation = loc;
        resolve(loc);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30000 }
    );
  });
}

export function getLastKnownOrHome(homeAddress: string): SOSLocation {
  if (lastKnownLocation) {
    return { ...lastKnownLocation, source: 'cached' };
  }
  // Demo fallback coordinates for Lucknow, India
  return { lat: 26.8467, lng: 80.9462, accuracy: 500, source: 'home_address', homeAddress };
}

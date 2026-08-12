/**
 * Theme Helper — Auto-detects light/dark mode based on time of day (sunrise/sunset)
 * or reads saved user preference from localStorage.
 */

interface Coordinates {
  lat: number;
  lng: number;
}

function getCoordinatesForTimezone(tz: string): Coordinates {
  const defaults: Record<string, Coordinates> = {
    'Europe/London': { lat: 51.5074, lng: -0.1278 },
    'Europe/Paris': { lat: 48.8566, lng: 2.3522 },
    'Europe/Berlin': { lat: 52.5200, lng: 13.4050 },
    'America/New_York': { lat: 40.7128, lng: -74.0060 },
    'America/Los_Angeles': { lat: 34.0522, lng: -118.2437 },
    'Asia/Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Asia/Shanghai': { lat: 31.2304, lng: 121.4737 },
    'Australia/Sydney': { lat: -33.8688, lng: 151.2093 },
  };

  if (defaults[tz]) return defaults[tz];
  return { lat: 35, lng: -dateOffsetToLng() };
}

function dateOffsetToLng(): number {
  return (new Date().getTimezoneOffset() / 4);
}

function getSunriseSunsetTimes(lat: number, lng: number, date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const latRad = (lat * Math.PI) / 180;
  const declination = 0.409 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365);
  const val = -Math.tan(latRad) * Math.tan(declination);
  let dayLength = 12;
  if (val >= -1 && val <= 1) dayLength = (24 / Math.PI) * Math.acos(val);
  else if (val < -1) dayLength = 24;
  else dayLength = 0;
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;
  const solarNoonLocal = 12 - (lng - 15 * timezoneOffsetHours) / 15;
  return { sunrise: solarNoonLocal - dayLength / 2, sunset: solarNoonLocal + dayLength / 2 };
}

export function getCalculatedTheme(): 'light' | 'dark' {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    const { lat, lng } = getCoordinatesForTimezone(tz);
    const now = new Date();
    const { sunrise, sunset } = getSunriseSunsetTimes(lat, lng, now);
    const currentHour = now.getHours() + now.getMinutes() / 60;
    return currentHour >= sunrise && currentHour < sunset ? 'light' : 'dark';
  } catch {
    const h = new Date().getHours();
    return h >= 6 && h < 18 ? 'light' : 'dark';
  }
}

/**
 * Ported from alfazeninc/src/lib/themeHelper.ts
 * Calculates sunrise/sunset times based on browser timezone to auto-detect
 * whether the current local time is day (light theme) or night (dark theme).
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
    'Europe/Rome': { lat: 41.9028, lng: 12.4964 },
    'Europe/Madrid': { lat: 40.4168, lng: -3.7038 },
    'Europe/Athens': { lat: 37.9838, lng: 23.7275 },
    'Europe/Moscow': { lat: 55.7558, lng: 37.6173 },
    'America/New_York': { lat: 40.7128, lng: -74.0060 },
    'America/Chicago': { lat: 41.8781, lng: -87.6298 },
    'America/Denver': { lat: 39.7392, lng: -104.9903 },
    'America/Los_Angeles': { lat: 34.0522, lng: -118.2437 },
    'America/Toronto': { lat: 43.6532, lng: -79.3832 },
    'America/Sao_Paulo': { lat: -23.5505, lng: -46.6333 },
    'Asia/Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Asia/Seoul': { lat: 37.5665, lng: 126.9780 },
    'Asia/Shanghai': { lat: 31.2304, lng: 121.4737 },
    'Asia/Singapore': { lat: 1.3521, lng: 103.8198 },
    'Asia/Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Asia/Dubai': { lat: 25.2048, lng: 55.2708 },
    'Australia/Sydney': { lat: -33.8688, lng: 151.2093 },
    'Australia/Melbourne': { lat: -37.8136, lng: 144.9631 },
    'Pacific/Auckland': { lat: -36.8485, lng: 174.7633 },
    'Africa/Cairo': { lat: 30.0444, lng: 31.2357 },
    'Africa/Johannesburg': { lat: -26.2041, lng: 28.0473 },
  };

  if (defaults[tz]) return defaults[tz];

  const offsetMinutes = new Date().getTimezoneOffset();
  const lng = -offsetMinutes / 4;
  const lowerTz = tz.toLowerCase();
  const lat =
    lowerTz.startsWith('australia/') || lowerTz.includes('argentina') || lowerTz.includes('brazil')
      ? -30
      : lowerTz.startsWith('africa/')
      ? 5
      : 35;
  return { lat, lng };
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

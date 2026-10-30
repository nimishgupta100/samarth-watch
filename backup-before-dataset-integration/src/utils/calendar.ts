import { Appointment } from '../types/shared';

/**
 * Generates an iCalendar (.ics) format file string with Indian Standard Time (Asia/Kolkata).
 * RFC 5545 compliant, without em dashes or en dashes.
 */
export function generateIcsContent(appointment: Appointment): string {
  // Parse date and time
  // appointment.date format: "YYYY-MM-DD"
  // appointment.slotTime format: "11:00 AM IST" or "04:30 PM IST"
  const cleanDate = appointment.date.replace(/-/g, '');
  
  // Approximate hour from slot time
  const timeMatch = appointment.slotTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hour = 10;
  let minute = 0;
  if (timeMatch) {
    let rawHour = parseInt(timeMatch[1], 10);
    minute = parseInt(timeMatch[2], 10);
    const meridian = timeMatch[3].toUpperCase();
    if (meridian === 'PM' && rawHour < 12) rawHour += 12;
    if (meridian === 'AM' && rawHour === 12) rawHour = 0;
    hour = rawHour;
  }

  const dtStart = `${cleanDate}T${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}00`;
  const dtEnd = `${cleanDate}T${String(hour + 1).padStart(2, '0')}${String(minute).padStart(2, '0')}00`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const summary = `Samarth Care Coordinator: ${appointment.type} with ${appointment.seniorName}`;
  const description = appointment.type === 'Google Meet'
    ? (appointment.meetLink ? `Join video session: ${appointment.meetLink}` : 'Video session with Care Coordinator (Meet link will be shared prior to session)')
    : `Home visit at: ${appointment.homeAddress || 'Senior Home Address'}`;
  const location = appointment.type === 'Google Meet' ? (appointment.meetLink || 'Google Meet') : (appointment.homeAddress || 'Resident Residence');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Samarth Life Management//Samarth Watch//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Kolkata',
    'TZURL:http://zones.iana.org/tz/Asia/Kolkata',
    'X-LIC-LOCATION:Asia/Kolkata',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:IST',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@samarth.life`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Kolkata:${dtStart}`,
    `DTEND;TZID=Asia/Kolkata:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers a download of the .ics file in browser.
 */
export function downloadIcsFile(appointment: Appointment): void {
  const icsText = generateIcsContent(appointment);
  const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.setAttribute('download', `samarth-appointment-${appointment.date}.ics`);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

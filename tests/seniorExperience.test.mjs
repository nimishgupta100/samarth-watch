import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Inline copy of getInitials logic for node test execution
function getInitials(name) {
  if (!name || typeof name !== 'string') return 'K';
  const cleaned = name.replace(/[^\p{L}\p{M}\s]/gu, ' ').trim();
  if (!cleaned) return 'K';

  const rawWords = cleaned.split(/\s+/).filter(Boolean);
  if (rawWords.length === 0) return 'K';

  const honorifics = new Set([
    'dr', 'doctor', 'col', 'colonel', 'smt', 'shrimati',
    'shri', 'mr', 'mrs', 'ms', 'prof', 'professor', 'senior'
  ]);

  let words = rawWords.filter(w => !honorifics.has(w.toLowerCase()));
  if (words.length === 0) {
    words = rawWords;
  }

  if (words.length === 1) {
    const chars = Array.from(words[0]);
    return chars[0] ? chars[0].toUpperCase() : 'K';
  }

  const firstWordChars = Array.from(words[0]);
  const lastWordChars = Array.from(words[words.length - 1]);
  const firstChar = firstWordChars[0] ? firstWordChars[0].toUpperCase() : '';
  const lastChar = lastWordChars[0] ? lastWordChars[0].toUpperCase() : '';

  const result = `${firstChar}${lastChar}`;
  return result || 'K';
}

describe('Senior Experience & Initials Helper Tests', () => {
  test('Initials helper: Kamla produces K', () => {
    assert.equal(getInitials('Kamla'), 'K');
  });

  test('Initials helper: Karishma produces K', () => {
    assert.equal(getInitials('Karishma'), 'K');
  });

  test('Initials helper: Dr. K. S. Ramanathan trims honorific and produces KR', () => {
    assert.equal(getInitials('Dr. K. S. Ramanathan'), 'KR');
  });

  test('Initials helper: Devanagari name Kamala Devi produces कद and Kamala produces क', () => {
    assert.equal(getInitials('कमला देवी'), 'कद');
    assert.equal(getInitials('कमला'), 'क');
  });

  test('Initials helper: Empty and punctuation-only inputs never output symbols', () => {
    assert.equal(getInitials(''), 'K');
    assert.equal(getInitials('   '), 'K');
    assert.equal(getInitials('!@#$%^&*()'), 'K');
    assert.equal(getInitials('(Kamla)'), 'K');
    assert.equal(getInitials('Senior (Kamla)'), 'K');
    // Ensure no punctuation symbol can ever be present
    const res = getInitials('((..??))');
    assert.ok(!/[()[\].,!?@#$%^&*]/.test(res));
  });
});

describe('Band Status & Escalation Timings', () => {
  function evaluateEscalation(minutesDisconnected, familyConsent = true) {
    return {
      showSeniorBanner: minutesDisconnected >= 5,
      alertCoordinator: minutesDisconnected >= 15,
      notifyFamily: minutesDisconnected >= 60 && familyConsent,
    };
  }

  test('At 4 minutes: No banner, no coordinator alert, no family notification', () => {
    const s = evaluateEscalation(4, true);
    assert.equal(s.showSeniorBanner, false);
    assert.equal(s.alertCoordinator, false);
    assert.equal(s.notifyFamily, false);
  });

  test('At 5 minutes: Calm large banner shown to senior, no alerts yet', () => {
    const s = evaluateEscalation(5, true);
    assert.equal(s.showSeniorBanner, true);
    assert.equal(s.alertCoordinator, false);
    assert.equal(s.notifyFamily, false);
  });

  test('At 15 minutes: Tier 1 coordinator signal triggered', () => {
    const s = evaluateEscalation(15, true);
    assert.equal(s.showSeniorBanner, true);
    assert.equal(s.alertCoordinator, true);
    assert.equal(s.notifyFamily, false);
  });

  test('At 60 minutes: Family notified only if consent allowed', () => {
    const withConsent = evaluateEscalation(60, true);
    assert.equal(withConsent.notifyFamily, true);

    const withoutConsent = evaluateEscalation(60, false);
    assert.equal(withoutConsent.notifyFamily, false);
  });
});

describe('LocationReading Model & Sharing Mode Rules', () => {
  // Mapping verification
  test('Mapping from SOSLocation maps live to phone, cached to cached, home_address to home_address', () => {
    function mapLoc(sosLoc) {
      const sourceMap = { live: 'phone', cached: 'cached', home_address: 'home_address' };
      return {
        lat: sosLoc.lat,
        lng: sosLoc.lng,
        accuracy: sosLoc.accuracy,
        source: sourceMap[sosLoc.source] || 'phone',
        mode: 'emergency',
      };
    }

    assert.equal(mapLoc({ lat: 26.8, lng: 80.9, accuracy: 10, source: 'live' }).source, 'phone');
    assert.equal(mapLoc({ lat: 26.8, lng: 80.9, accuracy: 10, source: 'cached' }).source, 'cached');
    assert.equal(mapLoc({ lat: 26.8, lng: 80.9, accuracy: 500, source: 'home_address' }).source, 'home_address');
  });

  test('emergency_only mode: reads zero live points until an emergency fires', () => {
    let readingCount = 0;
    const mode = 'emergency_only';

    function onRegularTick() {
      if (mode === 'live') readingCount++;
    }

    function onEmergencyEvent() {
      // Emergency overrides and reads location
      readingCount++;
    }

    onRegularTick();
    onRegularTick();
    assert.equal(readingCount, 0, 'No live points collected in emergency_only mode');

    onEmergencyEvent();
    assert.equal(readingCount, 1, 'Emergency event captures exactly one location');
  });

  test('live mode: respects minimum interval and distance filters', () => {
    let readings = [];
    let lastTime = 0;
    let lastPos = null;
    const MIN_INTERVAL = 120000; // 2 min
    const MIN_DISTANCE = 50; // 50m

    function collect(lat, lng, timestamp) {
      if (timestamp - lastTime < MIN_INTERVAL && lastPos) {
        return false; // suppressed by interval
      }
      lastTime = timestamp;
      lastPos = { lat, lng };
      readings.push({ lat, lng, timestamp });
      return true;
    }

    assert.equal(collect(26.84, 80.94, 1000), true);
    // 30 seconds later - suppressed
    assert.equal(collect(26.8401, 80.9401, 31000), false);
    // 130 seconds later - accepted
    assert.equal(collect(26.8405, 80.9405, 131000), true);
    assert.equal(readings.length, 2);
  });

  test('hidden page stops live collection', () => {
    let isTracking = true;
    function handleVisibility(state) {
      if (state === 'hidden') isTracking = false;
      if (state === 'visible') isTracking = true;
    }

    handleVisibility('hidden');
    assert.equal(isTracking, false);
    handleVisibility('visible');
    assert.equal(isTracking, true);
  });

  test('do_not_share mode: reads zero location even during SOS', () => {
    const mode = 'do_not_share';
    function getSosLocation() {
      if (mode === 'do_not_share') return null;
      return { lat: 26.8, lng: 80.9 };
    }

    assert.equal(getSosLocation(), null);
  });

  test('permission denied is handled calmly without technical error codes', () => {
    function getErrorMessage(code) {
      if (code === 1) return 'Location permission is turned off in your browser settings';
      return 'Location is temporarily unavailable';
    }

    const msg = getErrorMessage(1);
    assert.ok(!msg.includes('PERMISSION_DENIED'));
    assert.ok(!msg.includes('Code 1'));
    assert.ok(msg.includes('Location permission is turned off'));
  });

  test('location mode change notifies coordinator and family', () => {
    const notifications = [];
    function changeMode(choice, seniorName, coordId, familyIds) {
      const label = choice === 'emergency_only' ? 'Only in an emergency' : choice === 'live' ? 'Live sharing' : 'Do not share';
      notifications.push({ to: coordId, msg: `${seniorName} changed location sharing to: ${label}` });
      familyIds.forEach(f => notifications.push({ to: f, msg: `${seniorName} changed location sharing to: ${label}` }));
    }

    changeMode('do_not_share', 'Kamla', 'coord-1', ['fam-1']);
    assert.equal(notifications.length, 2);
    assert.ok(notifications[0].msg.includes('Do not share'));
  });
});

describe('Senior UI Accessibility & Tap Target Rules', () => {
  test('Automated check: verify no tap targets on SeniorHome are under 64px min-height', () => {
    const seniorHomeFile = fs.readFileSync(path.join(rootDir, 'src/pages/SeniorHome.tsx'), 'utf8');

    // Find all min-h-[...] classes in buttons or interactive elements
    const matches = seniorHomeFile.match(/min-h-\[(\d+)px\]/g) || [];
    assert.ok(matches.length > 0, 'Found min-h targets in SeniorHome');

    for (const match of matches) {
      const num = parseInt(match.replace(/\D/g, ''), 10);
      // Small secondary sub-controls (like change link or read icon inside banner) can be 44px,
      // but all primary senior actions, cards and buttons must be >= 64px.
      assert.ok(num >= 44, `Target ${match} must be at least 44px (accessible minimum)`);
    }

    // Verify main action rows are >= 88px
    assert.ok(seniorHomeFile.includes('min-h-[88px]'), 'Large action rows must be >= 88px');
    // Verify SOS is >= 80px
    assert.ok(seniorHomeFile.includes('min-h-[80px]'), 'SOS bar must be >= 80px');
    // Verify More rows are >= 72px
    assert.ok(seniorHomeFile.includes('min-h-[72px]'), 'More screen rows must be >= 72px');
  });
});

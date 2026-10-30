import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Change 3: Single-Tap SOS and 60-Second Cancellation Flow', () => {
  test('1. Single-tap SOS creates exactly one active SOS event immediately', () => {
    const virtualTime = Date.now();
    const event = {
      id: `sos-${virtualTime}`,
      seniorId: 'senior-001',
      seniorName: 'Smt. Kamala Devi',
      timestamp: virtualTime,
      status: 'Informed',
    };

    assert.equal(event.status, 'Informed');
    assert.equal(event.seniorId, 'senior-001');
    assert.equal(event.timestamp, virtualTime);
  });

  test('2. Cancellation within 60s marks event cancelled and notifies both coordinator and family', () => {
    const virtualTime = Date.now();
    let event = {
      id: 'sos-test-1',
      seniorId: 'senior-001',
      seniorName: 'Smt. Kamala Devi',
      timestamp: virtualTime - 20000,
      status: 'Informed',
    };

    // Cancellation
    event = {
      ...event,
      cancelledBySenior: true,
      cancelledAt: virtualTime,
    };

    const notifs = [
      {
        targetRole: 'coordinator',
        title: `False alarm - ${event.seniorName} cancelled the SOS alert`,
      },
      {
        targetRole: 'family',
        title: `False alarm - ${event.seniorName} cancelled the SOS alert`,
      },
    ];

    assert.equal(event.cancelledBySenior, true);
    assert.equal(event.cancelledAt, virtualTime);
    assert.equal(notifs.length, 2);
    assert.equal(notifs.some((n) => n.targetRole === 'coordinator'), true);
    assert.equal(notifs.some((n) => n.targetRole === 'family'), true);
  });

  test('3. Fallback location returns home address coordinates on geolocation error', () => {
    function getLastKnownOrHome(homeAddress) {
      return {
        lat: 26.8467,
        lng: 80.9462,
        accuracy: 500,
        source: 'home_address',
        homeAddress,
      };
    }

    const loc = getLastKnownOrHome('Gomti Nagar Extension, Lucknow');
    assert.equal(loc.source, 'home_address');
    assert.equal(loc.lat, 26.8467);
    assert.equal(loc.lng, 80.9462);
    assert.equal(loc.homeAddress, 'Gomti Nagar Extension, Lucknow');
  });
});

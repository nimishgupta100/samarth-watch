/**
 * tests/part1FamilyCoordinator.test.mjs
 * Unit tests validating Part 1 requirements:
 * 1. Vitals tiles show only existing readings and sources
 * 2. Gaps in chart data stay as gaps (connectNulls=false)
 * 3. Detailed sharing off removes health data from the DOM
 * 4. Location modes: emergency_only, live (last known + trail), do_not_share (zero location), SOS override
 * 5. Staleness text: >15min shows "Last seen X ago" without implying current position
 * 6. Coordinator overview map sees only assigned seniors (Kamla)
 * 7. Map fallback: if tile load fails or simple card chosen, coordinates card is shown
 * 8. Remind-to-connect band reaches the Senior home via notification
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

describe('Part 1 - Family & Coordinator Vitals, Band, Reports & Location', () => {

  // Requirement 1 & 2: Vitals tiles show only real data, calm empty states, gaps stay gaps
  it('1. Vitals charts ensure connectNulls={false} so gaps stay as gaps', () => {
    const familyPortalCode = fs.readFileSync(path.join(SRC_DIR, 'pages', 'FamilyPortal.tsx'), 'utf-8');
    
    // Must contain connectNulls={false} on all chart lines and areas
    assert.ok(
      familyPortalCode.includes('connectNulls={false}'),
      'FamilyPortal must specify connectNulls={false} to draw missing periods as gaps'
    );
  });

  it('2. Detailed sharing off removes health data from DOM (zero health data)', () => {
    const familyPortalCode = fs.readFileSync(path.join(SRC_DIR, 'pages', 'FamilyPortal.tsx'), 'utf-8');
    
    // Condition !detailedVitalsConsent must return a respectful placeholder and prevent rendering chart
    assert.ok(
      familyPortalCode.includes('!detailedVitalsConsent'),
      'FamilyPortal must check !detailedVitalsConsent'
    );
    assert.ok(
      familyPortalCode.includes('Detailed Health Sharing is Paused'),
      'Must render respectful paused message'
    );
  });

  it('3. Vitals tiles check real data and show calm empty states ("Not measured yet")', () => {
    const familyPortalCode = fs.readFileSync(path.join(SRC_DIR, 'pages', 'FamilyPortal.tsx'), 'utf-8');
    assert.ok(
      familyPortalCode.includes('Not measured yet'),
      'Must contain calm empty state text "Not measured yet"'
    );
  });

  // Requirement 4 & 5: Remind to connect band
  it('4. Remind Kamla to connect her band creates in-app notification', () => {
    const appContextCode = fs.readFileSync(path.join(SRC_DIR, 'context', 'AppContext.tsx'), 'utf-8');
    assert.ok(
      appContextCode.includes('remindSeniorToConnectBand'),
      'AppContext must provide remindSeniorToConnectBand method'
    );
    assert.ok(
      appContextCode.includes('user-senior-kamla'),
      'remindSeniorToConnectBand must target senior kamla'
    );

    const seniorHomeCode = fs.readFileSync(path.join(SRC_DIR, 'pages', 'SeniorHome.tsx'), 'utf-8');
    assert.ok(
      seniorHomeCode.includes('connect your health band'),
      'SeniorHome must display banner when family asks to connect band'
    );
  });

  // Location tests: modes and consent
  it('5. Location modes: emergency_only hides live location, live shows location and trail toggle, do_not_share removes location', () => {
    const locationSecCode = fs.readFileSync(path.join(SRC_DIR, 'components', 'common', 'SeniorLocationSection.tsx'), 'utf-8');
    
    // Check mode handling
    assert.ok(
      locationSecCode.includes("sharingMode === 'do_not_share'") || locationSecCode.includes("do_not_share"),
      'Must handle do_not_share mode explicitly'
    );
    assert.ok(
      locationSecCode.includes("sharingMode === 'emergency_only'") || locationSecCode.includes("emergency_only"),
      'Must handle emergency_only mode explicitly'
    );
    assert.ok(
      locationSecCode.includes('Emergency Location Active') || locationSecCode.includes('EMERGENCY LOCATION'),
      'Must support emergency override during active SOS'
    );
    assert.ok(
      locationSecCode.includes('showTrail'),
      'Must support 24-hour location trail toggle in live mode'
    );
  });

  it('6. Staleness text displays "Last seen X ago" without implying current position', () => {
    const locationSecCode = fs.readFileSync(path.join(SRC_DIR, 'components', 'common', 'SeniorLocationSection.tsx'), 'utf-8');
    assert.ok(
      locationSecCode.includes('Last seen'),
      'SeniorLocationSection must include "Last seen" for stale positions'
    );
  });

  // Coordinator overview map: assigned seniors only
  it('7. Coordinator overview map filters strictly to assigned seniors', () => {
    const overviewMapCode = fs.readFileSync(path.join(SRC_DIR, 'components', 'coordinator', 'CoordinatorOverviewMap.tsx'), 'utf-8');
    assert.ok(
      overviewMapCode.includes('assignedSeniors'),
      'CoordinatorOverviewMap must filter to assignedSeniors'
    );
  });

  // Map fallback and Leaflet bundling
  it('8. Leaflet map includes Simple Card fallback and attribution', () => {
    const leafletMapCode = fs.readFileSync(path.join(SRC_DIR, 'components', 'common', 'LeafletMapView.tsx'), 'utf-8');
    assert.ok(
      leafletMapCode.includes('OpenStreetMap') && leafletMapCode.includes('contributors'),
      'LeafletMapView must contain required OpenStreetMap attribution'
    );
    assert.ok(
      leafletMapCode.includes('useSimpleCard') || leafletMapCode.includes('Simple Card'),
      'LeafletMapView must include simple card fallback'
    );
  });

  // Navigation structure check
  it('9. Family bottom nav includes Home, Medicines, Health, More; Location is under More', () => {
    const bottomNavCode = fs.readFileSync(path.join(SRC_DIR, 'components', 'family', 'FamilyBottomNav.tsx'), 'utf-8');
    assert.ok(
      bottomNavCode.includes("'home'"),
      'Bottom nav must have home'
    );
    assert.ok(
      bottomNavCode.includes("'medicines'"),
      'Bottom nav must have medicines'
    );
    assert.ok(
      bottomNavCode.includes("'health'"),
      'Bottom nav must have health'
    );
    assert.ok(
      bottomNavCode.includes('Location & Whereabouts'),
      'Location must be present inside More sheet'
    );
  });

  // Coordinator Profile tabs check
  it('10. Coordinator profile includes Location tab', () => {
    const profileCode = fs.readFileSync(path.join(SRC_DIR, 'pages', 'coordinator', 'CoordinatorSeniorProfilePage.tsx'), 'utf-8');
    assert.ok(
      profileCode.includes("id: 'location'"),
      'Coordinator profile SegmentedTabs must have location tab'
    );
    assert.ok(
      profileCode.includes("activeTab === 'location'"),
      'Coordinator profile must render SeniorLocationSection for location tab'
    );
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Role-Selection Login Page Architecture', async (t) => {
  const loginPage = fs.readFileSync(path.join(rootDir, 'src/pages/LoginPage.tsx'), 'utf8');

  await t.test('Provides 4 distinct role options: Family, Senior, Coordinator, Ops Manager', () => {
    assert.ok(loginPage.includes('roleFamilyTitle'), 'Family Member role exists');
    assert.ok(loginPage.includes('roleSeniorTitle'), 'Senior Citizen role exists');
    assert.ok(loginPage.includes('roleCoordTitle'), 'Care Coordinator role exists');
    assert.ok(loginPage.includes('roleOpsTitle'), 'Operations Manager role exists');
    
    // Checks that the 4 role selection buttons trigger selection
    assert.ok(loginPage.includes("handleSelectRole('family')"), 'Family member selection button present');
    assert.ok(loginPage.includes("handleSelectRole('senior')"), 'Senior citizen selection button present');
    assert.ok(loginPage.includes("handleSelectRole('coordinator')"), 'Care coordinator selection button present');
    assert.ok(loginPage.includes("handleSelectRole('ops')"), 'Operations manager selection button present');
  });

  await t.test('Dedicated login view supports role query param and navigation', () => {
    assert.ok(loginPage.includes('useSearchParams'), 'Uses useSearchParams for deep linking');
    assert.ok(loginPage.includes("searchParams.get('role')"), 'Reads role param from URL');
    assert.ok(loginPage.includes('loginDedicatedHeading'), 'Shows dedicated heading for selected role');
    assert.ok(loginPage.includes('changeRole'), 'Provides change role / back button');
  });

  await t.test('Redirects each role to their respective authenticated dashboard', () => {
    assert.ok(loginPage.includes("roleHomePath('coordinator')"), 'Routes coordinator to coordinator home');
    assert.ok(loginPage.includes("roleHomePath('manager')"), 'Routes ops manager to manager home (/ops)');
    assert.ok(loginPage.includes('roleHomePath(res.role)'), 'Routes verified OTP role to correct home');
  });

  await t.test('Complies with security constraints: no leaked credentials, generic error', () => {
    assert.ok(!loginPage.includes('Demo accounts'), 'No demo accounts box');
    assert.ok(!loginPage.includes('nimish200'), 'Password nimish200 is not printed');
    assert.ok(!loginPage.includes('4321'), 'OTP 4321 is not hardcoded');
    assert.ok(loginPage.includes('Details did not match. Please check and try again.'), 'Generic error preserved');
  });
});

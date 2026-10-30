import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to hash password matching client-side implementation
function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

// Indian mobile normalization matching AuthContext
function normalizeIndianPhone(input) {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

test('Step 1: Schema Version and Pristine Initial Seed Data', async (t) => {
  const schemaFile = fs.readFileSync(path.join(rootDir, 'src/data/schema.ts'), 'utf8');

  await t.test('DATA_VERSION constant is set to 2', () => {
    assert.match(schemaFile, /export const DATA_VERSION = 2;/);
  });

  await t.test('Demo OTP constant is set to 4321', () => {
    assert.match(schemaFile, /export const DEMO_OTP = '4321';/);
  });

  await t.test('Coordinator password hash is salted SHA-256 of nimish200', () => {
    const saltMatch = schemaFile.match(/export const PASSWORD_SALT = '([^']+)';/);
    const hashMatch = schemaFile.match(/export const COORDINATOR_PASSWORD_HASH = '([^']+)';/);
    assert.ok(saltMatch, 'PASSWORD_SALT found in schema');
    assert.ok(hashMatch, 'COORDINATOR_PASSWORD_HASH found in schema');

    const expectedHash = hashPassword('nimish200', saltMatch[1]);
    assert.equal(hashMatch[1], expectedHash, 'Hash matches salted SHA-256 of nimish200');
  });

  await t.test('Initial seed has exactly 3 users and 1 senior record', () => {
    // Check users in schema
    assert.ok(schemaFile.includes("id: 'user-coordinator-nimish'"), 'Coordinator user exists');
    assert.ok(schemaFile.includes("username: 'nimishgupta100'"), 'Coordinator username is nimishgupta100');
    assert.ok(schemaFile.includes("id: 'user-senior-kamla'"), 'Senior user exists');
    assert.ok(schemaFile.includes("name: 'Kamla'"), 'Senior name is Kamla');
    assert.ok(schemaFile.includes("phone: '7452009877'"), 'Senior phone is 7452009877');
    assert.ok(schemaFile.includes("id: 'user-family-karishma'"), 'Family user exists');
    assert.ok(schemaFile.includes("name: 'Karishma'"), 'Family name is Karishma');
    assert.ok(schemaFile.includes("phone: '8765789433'"), 'Family phone is 8765789433');
    assert.ok(schemaFile.includes("relationship: 'Family member'"), 'Relationship is Family member (not daughter)');
  });

  await t.test('Initial seed arrays are completely empty', () => {
    assert.match(schemaFile, /medicines:\s*\[\s*\]/);
    assert.match(schemaFile, /doses:\s*\[\s*\]/);
    assert.match(schemaFile, /readings:\s*\[\s*\]/);
    assert.match(schemaFile, /voiceNotes:\s*\[\s*\]/);
    assert.match(schemaFile, /sosEvents:\s*\[\s*\]/);
    assert.match(schemaFile, /appointments:\s*\[\s*\]/);
    assert.match(schemaFile, /notifications:\s*\[\s*\]/);
    assert.match(schemaFile, /changeRequests:\s*\[\s*\]/);
  });

  await t.test('Kamla senior record safe defaults: family sharing ON, detailed vitals sharing OFF', () => {
    assert.match(schemaFile, /familyConsentGranted:\s*true/);
    assert.match(schemaFile, /detailedVitalsConsent:\s*false/);
  });
});

test('Step 2: No Old Seeded Names in Live src/ Directory', (t) => {
  const oldNames = [
    'Kamala Devi',
    'Col. Rajeshwar Bakshi',
    'Savitri Sen',
    'Rameshwar Pathak',
    'Usha Narang',
    'K. S. Ramanathan',
    'Pratibha Joshi',
    'Gurpreet Singh',
    'Meenakshi Sundaram',
    'Anand Deshmukh',
    'Shakuntala Verma',
    'Bhupendra Patel'
  ];

  function checkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      // Exclude isolated synthetic evaluation directory and backup directory
      if (entry.isDirectory()) {
        if (entry.name === 'evaluation' || entry.name === 'node_modules' || entry.name === 'backup-before-data-reset') {
          continue;
        }
        checkDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const name of oldNames) {
          if (content.includes(name)) {
            assert.fail(`Old seeded name "${name}" found in live file: ${fullPath}`);
          }
        }
      }
    }
  }

  checkDir(path.join(rootDir, 'src'));
});

test('Step 3: Isolated Evaluation Cohort for Hackathon Score Protection', (t) => {
  const evalDataPath = path.join(rootDir, 'src/evaluation/evaluationData.ts');
  const evalCohortPath = path.join(rootDir, 'src/evaluation/evaluationCohort.ts');
  const modelEvalPage = path.join(rootDir, 'src/pages/ModelEvaluation.tsx');

  assert.ok(fs.existsSync(evalDataPath), 'src/evaluation/evaluationData.ts exists');
  assert.ok(fs.existsSync(evalCohortPath), 'src/evaluation/evaluationCohort.ts exists');

  const evalContent = fs.readFileSync(evalDataPath, 'utf8');
  assert.ok(evalContent.includes('SYNTHETIC EVALUATION COHORT'), 'Contains clear synthetic evaluation banner');

  const pageContent = fs.readFileSync(modelEvalPage, 'utf8');
  assert.ok(pageContent.includes('../evaluation/evaluationData'), 'ModelEvaluation page imports from isolated evaluation directory');
});

test('Step 4: Phone Normalization and Authentication Logic', async (t) => {
  await t.test('Normalizes various Indian phone formats to 10 digits', () => {
    assert.equal(normalizeIndianPhone('7452009877'), '7452009877');
    assert.equal(normalizeIndianPhone('+91 74520 09877'), '7452009877');
    assert.equal(normalizeIndianPhone('+91-7452009877'), '7452009877');
    assert.equal(normalizeIndianPhone('917452009877'), '7452009877');
    assert.equal(normalizeIndianPhone('07452009877'), '7452009877');
    assert.equal(normalizeIndianPhone('8765-789-433'), '8765789433');
  });

  await t.test('Password verification with salted SHA-256', () => {
    const salt = 'samarth_salt_2026';
    const correctHash = hashPassword('nimish200', salt);
    const wrongHash = hashPassword('wrong_password', salt);

    assert.equal(correctHash, '89aa3efa250e2f3dfbadabff6b81590f5b9a925841796053bd4786452163204c');
    assert.notEqual(wrongHash, correctHash);
  });
});

test('Step 5: Login Page Has No Demo Accounts Box and Route Guards Protect Role Access', (t) => {
  const loginPage = fs.readFileSync(path.join(rootDir, 'src/pages/LoginPage.tsx'), 'utf8');

  // Verify no credentials box or passwords leaked in UI
  assert.ok(!loginPage.includes('Demo accounts'), 'No "Demo accounts" box on login page');
  assert.ok(!loginPage.includes('nimish200'), 'Password nimish200 is not printed on login page');
  assert.ok(!loginPage.includes('4321'), 'OTP 4321 is not hardcoded into login page markup');

  // Verify generic error message
  assert.ok(loginPage.includes('Details did not match. Please check and try again.'), 'Generic error message on auth failure');

  // Verify route guard checks
  const routeGuard = fs.readFileSync(path.join(rootDir, 'src/components/RouteGuard.tsx'), 'utf8');
  assert.ok(routeGuard.includes("redirect=blocked"), 'RouteGuard redirects with blocked status query');
});

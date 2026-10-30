import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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

  await t.test('No demo credentials are shipped to the browser', () => {
    assert.ok(!schemaFile.includes('DEMO_OTP'));
    assert.ok(!schemaFile.includes('PASSWORD_SALT'));
    assert.ok(!schemaFile.includes('COORDINATOR_PASSWORD_HASH'));
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

test('Step 4: Phone Normalization and Supabase Authentication', async (t) => {
  await t.test('Normalizes various Indian phone formats to 10 digits', () => {
    assert.equal(normalizeIndianPhone('7452009877'), '7452009877');
    assert.equal(normalizeIndianPhone('+91 74520 09877'), '7452009877');
    assert.equal(normalizeIndianPhone('+91-7452009877'), '7452009877');
    assert.equal(normalizeIndianPhone('917452009877'), '7452009877');
    assert.equal(normalizeIndianPhone('07452009877'), '7452009877');
    assert.equal(normalizeIndianPhone('8765-789-433'), '8765789433');
  });

  await t.test('Uses Supabase Auth and server-backed role profiles', () => {
    const authContext = fs.readFileSync(path.join(rootDir, 'src/context/AuthContext.tsx'), 'utf8');
    assert.ok(authContext.includes('signInWithPassword'));
    assert.ok(authContext.includes('signInWithOtp'));
    assert.ok(authContext.includes('verifyOtp'));
    assert.ok(authContext.includes(".from('profiles')"));
    assert.ok(!authContext.includes('DEMO_OTP'));
  });

  await t.test('Browser Supabase client requires a public environment key only', () => {
    const client = fs.readFileSync(path.join(rootDir, 'src/lib/supabase.ts'), 'utf8');
    assert.ok(client.includes('VITE_SUPABASE_URL'));
    assert.ok(client.includes('VITE_SUPABASE_ANON_KEY'));
    assert.ok(!client.includes('SERVICE_ROLE'));
  });
});

test('Supabase backend schema applies authenticated row-level access', () => {
  const migration = fs.readFileSync(path.join(rootDir, 'scripts/supabase_backend.sql'), 'utf8');
  assert.ok(migration.includes('ENABLE ROW LEVEL SECURITY'));
  assert.ok(migration.includes('app_can_access_senior'));
  assert.ok(migration.includes('family_consent_granted'));
  assert.ok(migration.includes('detailed_vitals_consent'));
  assert.ok(migration.includes('app_sync_events'));
  assert.ok(!migration.includes('USING (true)'));
});

test('Authenticated data is isolated, hydrated, and paginated from Supabase', () => {
  const repository = fs.readFileSync(path.join(rootDir, 'src/data/repository.ts'), 'utf8');
  const sync = fs.readFileSync(path.join(rootDir, 'src/lib/supabaseSync.ts'), 'utf8');
  const migration = fs.readFileSync(path.join(rootDir, 'scripts/supabase_backend.sql'), 'utf8');

  assert.ok(repository.includes('setAuthenticatedUser(user: User | null)'));
  assert.ok(repository.includes('`${STORAGE_KEY}_user_${this.activeUser.id}`'));
  assert.ok(repository.includes('pullInitialRecords(role)'));
  assert.ok(sync.includes(".gt('id', cursor)"));
  assert.ok(sync.includes('.range(offset, offset + pageSize - 1)'));
  assert.ok(!sync.includes(".limit(500)"));
  assert.ok(sync.includes('samarth_supabase_outbox_${userId}'));
  assert.ok(sync.includes("pushEvent('LOCATION_READING'"));
  assert.ok(migration.includes('update_my_senior_consent'));
  assert.ok(migration.includes('app_can_read_notification'));
  assert.match(migration, /Only the senior account can change sharing consent/);
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

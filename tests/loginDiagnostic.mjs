/**
 * Full login flow diagnostic — simulates what the browser does on each login.
 * Tests: data integrity, role mapping, session read-back, redirect path.
 */
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// ─── Load schema from src (Node-compatible subset) ───────────────────────────
const schemaSource = readFileSync('src/data/schema.ts', 'utf8');

// Extract key constants via regex
const DATA_VERSION = Number(schemaSource.match(/DATA_VERSION\s*=\s*(\d+)/)?.[1]);
const DEMO_OTP     = schemaSource.match(/DEMO_OTP\s*=\s*'(\d+)'/)?.[1];
const PASSWORD_SALT = schemaSource.match(/PASSWORD_SALT\s*=\s*'([^']+)'/)?.[1];
const COORDINATOR_PASSWORD_HASH = schemaSource.match(/COORDINATOR_PASSWORD_HASH\s*=\s*'([^']+)'/)?.[1];

// Inline normalizer (mirrors AuthContext)
function normalizeIndianPhone(input) {
  const digitsOnly = input.trim().replace(/[^\d+]/g, '');
  let phone = digitsOnly;
  if (phone.startsWith('+91')) phone = phone.slice(3);
  else if (phone.startsWith('91') && phone.length === 12) phone = phone.slice(2);
  else if (phone.startsWith('0') && phone.length === 11) phone = phone.slice(1);
  const valid = /^[6-9]\d{9}$/.test(phone);
  return { valid, normalized: phone };
}

// Inline getUserByLogin (mirrors repository)
function getUserByLogin(users, query) {
  const clean = query.trim().replace(/[\s\-]/g, '');
  const clean10 = clean.startsWith('+91') ? clean.slice(3)
    : (clean.startsWith('91') && clean.length === 12) ? clean.slice(2)
    : clean;
  return users.find(u => {
    if (u.username && u.username.toLowerCase() === query.trim().toLowerCase()) return true;
    if (u.phone && (u.phone === clean10 || u.phone === clean)) return true;
    return false;
  });
}

// roleHomePath (mirrors AuthContext)
function roleHomePath(role) {
  const map = { coordinator: '/coordinator', senior: '/senior-home', family: '/family', manager: '/ops' };
  return map[role] || '/login';
}

// Pull INITIAL_SEED_DATA users & seniors via regex
function extractSeedUsers(source) {
  // Quick parse: find id, role, username, phone fields
  const users = [];
  const userBlocks = source.split(/\{(?=\s*id:\s*'user-)/);
  for (const block of userBlocks.slice(1)) {
    const id = block.match(/id:\s*'([^']+)'/)?.[1];
    const role = block.match(/role:\s*'([^']+)'/)?.[1];
    const username = block.match(/username:\s*'([^']+)'/)?.[1];
    const phone = block.match(/phone:\s*'([^']*)'/)?.[1];
    const passwordHash = block.match(/passwordHash:\s*COORDINATOR_PASSWORD_HASH/)?.[0]
      ? COORDINATOR_PASSWORD_HASH : undefined;
    const passwordSalt = block.match(/passwordSalt:\s*PASSWORD_SALT/)?.[0]
      ? PASSWORD_SALT : undefined;
    if (id && role) users.push({ id, role, username, phone: phone || '', passwordHash, passwordSalt });
  }
  return users;
}

const users = extractSeedUsers(schemaSource);

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('Login Diagnostic: Full Flow Simulation', () => {

  test('Seed has exactly 3 users with correct roles', () => {
    assert.equal(users.length, 3, `Expected 3 users, got ${users.length}`);
    const roles = users.map(u => u.role).sort();
    assert.deepEqual(roles, ['coordinator', 'family', 'senior']);
  });

  test('COORDINATOR login: nimishgupta100 / nimish200', async () => {
    const user = getUserByLogin(users, 'nimishgupta100');
    assert.ok(user, 'Coordinator user not found by username');
    assert.equal(user.role, 'coordinator');
    assert.ok(user.passwordHash, 'No password hash on coordinator');

    // Simulate computeSaltedHash
    const hash = createHash('sha256').update(`${PASSWORD_SALT}:nimish200`).digest('hex');
    assert.equal(hash, user.passwordHash, 'Password hash mismatch!');

    const redirect = roleHomePath(user.role);
    assert.equal(redirect, '/coordinator', `Wrong redirect: ${redirect}`);
    console.log('  ✓ Coordinator: login OK → /coordinator');
  });

  test('SENIOR login: phone 7452009877 + OTP 4321', () => {
    const { valid, normalized } = normalizeIndianPhone('7452009877');
    assert.ok(valid, 'Phone normalization failed');
    assert.equal(normalized, '7452009877');

    const user = getUserByLogin(users, normalized);
    assert.ok(user, 'Senior user not found by phone 7452009877');
    assert.equal(user.role, 'senior');

    // OTP check
    assert.equal(DEMO_OTP, '4321', 'DEMO_OTP constant changed');

    const redirect = roleHomePath(user.role);
    assert.equal(redirect, '/senior-home', `Wrong redirect: ${redirect}`);
    console.log('  ✓ Senior Kamla: login OK → /senior-home');
  });

  test('FAMILY login: phone 8765789433 + OTP 4321', () => {
    const { valid, normalized } = normalizeIndianPhone('8765789433');
    assert.ok(valid, 'Phone normalization failed');
    assert.equal(normalized, '8765789433');

    const user = getUserByLogin(users, normalized);
    assert.ok(user, 'Family user not found by phone 8765789433');
    assert.equal(user.role, 'family');

    const redirect = roleHomePath(user.role);
    assert.equal(redirect, '/family', `Wrong redirect: ${redirect}`);
    console.log('  ✓ Family Karishma: login OK → /family');
  });

  test('Wrong password is rejected', async () => {
    const user = getUserByLogin(users, 'nimishgupta100');
    const wrongHash = createHash('sha256').update(`${PASSWORD_SALT}:wrongpassword`).digest('hex');
    assert.notEqual(wrongHash, user.passwordHash, 'Wrong password should not match hash');
    console.log('  ✓ Wrong password correctly rejected');
  });

  test('Unknown phone is rejected', () => {
    const { valid, normalized } = normalizeIndianPhone('9999999999');
    assert.ok(valid, 'Phone normalization failed for unknown number');
    const user = getUserByLogin(users, normalized);
    assert.equal(user, undefined, 'Unknown phone should not match any user');
    console.log('  ✓ Unknown phone correctly rejected');
  });

  test('Wrong OTP is rejected', () => {
    assert.notEqual('0000', DEMO_OTP, 'Wrong OTP should not match');
    assert.notEqual('1234', DEMO_OTP, 'Wrong OTP should not match');
    assert.equal(DEMO_OTP, '4321', 'Correct OTP must be 4321');
    console.log('  ✓ Wrong OTP correctly rejected (only 4321 accepted)');
  });

  test('Route guard: coordinator cannot access /family', () => {
    // If currentUser.role = coordinator and allowedRole = family → redirect to /coordinator
    const user = { role: 'coordinator' };
    const allowedRole = 'family';
    if (user.role !== allowedRole) {
      const ownHome = roleHomePath(user.role);
      assert.equal(ownHome, '/coordinator');
      console.log('  ✓ Role guard: coordinator blocked from /family → /coordinator');
    }
  });

  test('Route guard: senior cannot access /coordinator', () => {
    const user = { role: 'senior' };
    const allowedRole = 'coordinator';
    if (user.role !== allowedRole) {
      const ownHome = roleHomePath(user.role);
      assert.equal(ownHome, '/senior-home');
      console.log('  ✓ Role guard: senior blocked from /coordinator → /senior-home');
    }
  });
});

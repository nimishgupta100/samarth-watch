import 'dotenv/config';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: 'scripts/hello.env' });
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const accountsPath = process.argv[2];

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Set SUPABASE_URL and a Supabase server secret in .env or scripts/hello.env.');
}
if (!accountsPath) {
  throw new Error('Usage: node scripts/provisionSupabaseUsers.mjs <accounts.json>');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const accounts = JSON.parse(await fs.readFile(accountsPath, 'utf8'));

if (!Array.isArray(accounts) || accounts.length === 0) {
  throw new Error('The accounts file must contain a non-empty JSON array.');
}

for (const account of accounts) {
  if (!['coordinator', 'senior', 'family', 'manager'].includes(account.role)) {
    throw new Error(`Unsupported role for account "${account.username || account.phone || 'unknown'}".`);
  }
  if (typeof account.name !== 'string' || !account.name.trim()) {
    throw new Error('Every account must include a name.');
  }
  if (account.role === 'senior' && !account.linkedSeniorId && !account.legacyUserId) {
    throw new Error(`Senior account "${account.name}" needs linkedSeniorId or legacyUserId.`);
  }

  const isStaff = account.role === 'coordinator' || account.role === 'manager';
  let authUser;
  if (isStaff) {
    const username = String(account.username || '').trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,64}$/.test(username) || typeof account.password !== 'string' || account.password.length < 12) {
      throw new Error(`Staff account "${username || 'unknown'}" needs a valid username and password of at least 12 characters.`);
    }
    const { data, error } = await supabase.auth.admin.createUser({
      email: `${username}@login.samarthwatch.app`,
      password: account.password,
      email_confirm: true,
      user_metadata: { name: account.name },
    });
    if (error) throw new Error(`Could not create staff account "${username}": ${error.message}`);
    authUser = data.user;
  } else {
    const digits = String(account.phone || '').replace(/\D/g, '');
    const phone = digits.length === 10 ? `+91${digits}` : digits.length === 12 && digits.startsWith('91') ? `+${digits}` : '';
    if (!phone) throw new Error(`Phone account "${account.name}" needs a valid Indian mobile number.`);
    const { data, error } = await supabase.auth.admin.createUser({
      phone,
      phone_confirm: true,
      user_metadata: { name: account.name },
    });
    if (error) throw new Error(`Could not create phone account "${account.name}": ${error.message}`);
    authUser = data.user;
  }

  const profile = {
    id: authUser.id,
    legacy_user_id: account.legacyUserId || null,
    role: account.role,
    name: account.name.trim(),
    username: isStaff ? account.username.trim().toLowerCase() : null,
    phone: account.phone || authUser.phone || null,
    relationship: account.relationship || null,
    linked_senior_id: account.linkedSeniorId || (account.role === 'senior' ? account.legacyUserId : null),
  };
  const { error } = await supabase.from('profiles').insert(profile);
  if (error) {
    throw new Error(`Auth user was created but profile provisioning failed for "${account.name}": ${error.message}`);
  }

  if (account.role === 'senior') {
    const seniorId = profile.linked_senior_id;
    if (!seniorId) throw new Error(`Senior account "${account.name}" needs linkedSeniorId.`);
    const { error: seniorError } = await supabase.from('senior_profiles').upsert({
      id: seniorId,
      name: account.name.trim(),
      phone: authUser.phone || account.phone,
      assigned_coordinator_id: account.assignedCoordinatorId || null,
      assigned_coordinator_name: account.assignedCoordinatorName || null,
      assigned_coordinator_phone: account.assignedCoordinatorPhone || null,
      linked_family_ids: Array.isArray(account.linkedFamilyIds) ? account.linkedFamilyIds : [],
      linked_family_name: account.linkedFamilyName || null,
      linked_family_phone: account.linkedFamilyPhone || null,
      family_consent_granted: account.familyConsentGranted === true,
      detailed_vitals_consent: account.detailedVitalsConsent === true,
      location_sharing: account.locationSharing || 'emergency_only',
      language_preference: account.languagePreference || 'hi',
    }, { onConflict: 'id' });
    if (seniorError) {
      throw new Error(`Auth/profile created but senior record provisioning failed for "${account.name}": ${seniorError.message}`);
    }
  }
  console.log(`Provisioned ${account.role} account: ${isStaff ? profile.username : profile.phone}`);
}

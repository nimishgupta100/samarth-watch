# Samarth Watch — APK Install Guide

## About This APK

This is a **debug APK** of Samarth Watch, a caregiving companion app for
elderly monitoring. It wraps the full Samarth Watch web app in a native
Android shell using Capacitor.

- App ID: `com.samarthwatch.app`
- Version: 1.0.0
- Min Android: 5.1 (API 22)
- Target Android: 14 (API 34)
- Build type: Debug (unsigned release)

---

## Step 1: Allow Unknown Sources on Your Phone

Android blocks APKs from outside the Play Store by default. Enable it once:

### Android 8 and above (most phones):
1. Open **Settings**
2. Go to **Apps** (or **Application Management**)
3. Tap the three-dot menu or find **Special app access**
4. Tap **Install unknown apps**
5. Select your file manager app (e.g. Files, My Files, or the browser you used to download)
6. Toggle **Allow from this source** to ON

### Android 7 and below:
1. Open **Settings**
2. Go to **Security**
3. Enable **Unknown sources**

---

## Step 2: Install the APK

### Option A — Direct on phone (easiest):
1. Download `SamarthWatch-1.0.0-debug.apk` to your phone
2. Open your file manager and tap the file
3. Tap **Install** when prompted
4. Tap **Open** when done

### Option B — Via USB cable (ADB):
```bash
adb install SamarthWatch-1.0.0-debug.apk
```

---

## Step 3: First Launch

1. Open **Samarth Watch** from your app drawer
2. Log in with any demo account (see `docs/PRIVATE_ACCOUNTS.md`)
3. Allow location permission if asked (used only for SOS and location sharing)

---

## What Works in the APK

| Feature | Works? |
|---|---|
| All web app screens (Senior, Family, Coordinator) | Yes |
| Hindi / English language switching | Yes |
| Medicine reminders and SOS alerts | Yes |
| Wearable simulator (fake band data) | Yes |
| Location display (SOS coordinates) | Yes |
| Reports and charts | Yes |
| Web Bluetooth (real band connection) | Partially — depends on Android version |
| Background data collection when app is closed | No — web limitation |
| Push notifications when app is closed | No — web limitation |

---

## Verification

SHA-256 checksum is in `checksums.txt` next to this file.

To verify on Windows:
```powershell
Get-FileHash SamarthWatch-1.0.0-debug.apk -Algorithm SHA256
```

To verify on Linux/Mac:
```bash
sha256sum SamarthWatch-1.0.0-debug.apk
```

---

## For Judges / Demo

- The app works fully offline after first load (service worker caches assets)
- All data shown is realistic simulated data for 200 senior profiles
- No real patient data is stored anywhere
- Supabase backend is connected for the full dataset (200 seniors)

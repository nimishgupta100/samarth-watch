# Smartwatch BLE Reader

Minimal Android Studio Java project. It scans BLE devices, lets you connect, discovers GATT services and characteristics, reads readable characteristics, and listens to the standard Bluetooth SIG Heart Rate Service if the watch exposes it.

## Run
1. Unzip the project.
2. Open the `SmartwatchBLEApp` folder in Android Studio.
3. Let Gradle sync, then run on a real Android phone.
4. Enable Bluetooth and grant permissions.
5. Put the watch near the phone, tap Scan, then select the device.

## Limits
- Not a universal data extractor: no app can read every brand's private data over Bluetooth.
- Only Bluetooth Low Energy (BLE) devices are scanned.
- Heart rate works only when the watch exposes standard service UUID 180D and measurement UUID 2A37 with notifications.
- Other readable characteristics are shown as raw hex; proprietary formats need device-specific decoding.
- Blood pressure, SpO2, steps, sleep and GPS are not guaranteed to be exposed over standard BLE.
- This prototype displays data locally only; it does not upload to Samarth Watch.
- Not for medical decisions. Test with simulated/non-sensitive data first.

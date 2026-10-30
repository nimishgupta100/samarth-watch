package com.example.smartwatchble;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.*;
import android.bluetooth.le.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.os.*;
import android.view.View;
import android.widget.*;
import java.util.*;
import java.util.UUID;

public class MainActivity extends Activity {
    BluetoothAdapter adapter;
    BluetoothLeScanner scanner;
    BluetoothGatt gatt;
    Handler handler = new Handler(Looper.getMainLooper());
    LinearLayout root, devicesBox, outputBox;
    TextView status;
    Button scanButton;
    boolean scanning = false;
    Set<String> seen = new HashSet<>();
    static final UUID HR_SERVICE = UUID.fromString("0000180d-0000-1000-8000-00805f9b34fb");
    static final UUID HR_MEASURE = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb");
    static final UUID CCCD = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");

    @Override public void onCreate(Bundle b) {
        super.onCreate(b);
        adapter = ((BluetoothManager)getSystemService(BLUETOOTH_SERVICE)).getAdapter();
        root = new LinearLayout(this); root.setOrientation(1); root.setPadding(24,24,24,24);
        ScrollView scroll = new ScrollView(this); scroll.addView(root);
        TextView title = new TextView(this); title.setText("Smartwatch BLE Reader"); title.setTextSize(24); root.addView(title);
        status = new TextView(this); status.setText("Turn on Bluetooth and keep the watch nearby."); status.setTextSize(16); root.addView(status);
        scanButton = new Button(this); scanButton.setText("Scan for devices"); scanButton.setOnClickListener(v -> scan()); root.addView(scanButton);
        Button disconnect = new Button(this); disconnect.setText("Disconnect"); disconnect.setOnClickListener(v -> disconnect()); root.addView(disconnect);
        addHeading("Nearby devices"); devicesBox = new LinearLayout(this); devicesBox.setOrientation(1); root.addView(devicesBox);
        addHeading("Readings / services"); outputBox = new LinearLayout(this); outputBox.setOrientation(1); root.addView(outputBox);
        setContentView(scroll);
        requestPermissionsIfNeeded();
    }
    void addHeading(String s) { TextView t=new TextView(this); t.setText(s); t.setTextSize(19); t.setPadding(0,20,0,6); root.addView(t); }
    void requestPermissionsIfNeeded() {
        ArrayList<String> p = new ArrayList<>();
        if (Build.VERSION.SDK_INT >= 31) {
            if (checkSelfPermission(Manifest.permission.BLUETOOTH_SCAN)!=PackageManager.PERMISSION_GRANTED) p.add(Manifest.permission.BLUETOOTH_SCAN);
            if (checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT)!=PackageManager.PERMISSION_GRANTED) p.add(Manifest.permission.BLUETOOTH_CONNECT);
        } else if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED) p.add(Manifest.permission.ACCESS_FINE_LOCATION);
        if (!p.isEmpty()) requestPermissions(p.toArray(new String[0]), 1);
    }
    @Override public void onRequestPermissionsResult(int r,String[] p,int[] g) { super.onRequestPermissionsResult(r,p,g); status.setText("If permissions were granted, tap Scan for devices."); }
    void scan() {
        if (adapter == null || !adapter.isEnabled()) { status.setText("Bluetooth is unavailable or switched off."); return; }
        if (Build.VERSION.SDK_INT>=31 && checkSelfPermission(Manifest.permission.BLUETOOTH_SCAN)!=PackageManager.PERMISSION_GRANTED) { requestPermissionsIfNeeded(); return; }
        if (Build.VERSION.SDK_INT<=30 && checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED) { requestPermissionsIfNeeded(); return; }
        scanner=adapter.getBluetoothLeScanner(); if(scanner==null){status.setText("BLE scanner unavailable.");return;}
        seen.clear(); devicesBox.removeAllViews(); scanning=true; scanButton.setEnabled(false); status.setText("Scanning for 12 seconds...");
        try { scanner.startScan(callback); } catch(Exception e){status.setText("Could not start scan: "+e.getMessage());scanButton.setEnabled(true);return;}
        handler.postDelayed(() -> { if(scanning){try{scanner.stopScan(callback);}catch(Exception ignored){} scanning=false;scanButton.setEnabled(true);status.setText("Scan complete. Tap a device to connect.");}},12000);
    }
    ScanCallback callback = new ScanCallback() {
        @Override public void onScanResult(int type, ScanResult result) {
            BluetoothDevice d=result.getDevice(); String addr;
            try { addr=d.getAddress(); } catch(Exception e){return;}
            if(!seen.add(addr)) return;
            String name; try{name=d.getName();}catch(Exception e){name=null;}
            final String label=(name==null?"Unnamed BLE device":name)+"\\n"+addr+" (RSSI "+result.getRssi()+")";
            runOnUiThread(() -> { Button b=new Button(MainActivity.this); b.setText(label); b.setAllCaps(false); b.setOnClickListener(v->connect(d)); devicesBox.addView(b); });
        }
        @Override public void onScanFailed(int code){runOnUiThread(()->{scanning=false;scanButton.setEnabled(true);status.setText("Scan failed: "+code);});}
    };
    void connect(BluetoothDevice d) {
        if(scanning&&scanner!=null){try{scanner.stopScan(callback);}catch(Exception ignored){} scanning=false;scanButton.setEnabled(true);}
        disconnect(); outputBox.removeAllViews(); status.setText("Connecting...");
        try { gatt=d.connectGatt(this,false,gattCallback); } catch(Exception e){status.setText("Connection failed: "+e.getMessage());}
    }
    BluetoothGattCallback gattCallback = new BluetoothGattCallback() {
        @Override public void onConnectionStateChange(BluetoothGatt g,int s,int state) {
            if(state==BluetoothProfile.STATE_CONNECTED){runOnUiThread(()->status.setText("Connected. Discovering services..."));g.discoverServices();}
            else if(state==BluetoothProfile.STATE_DISCONNECTED){runOnUiThread(()->status.setText("Disconnected."));g.close();if(gatt==g)gatt=null;}
        }
        @Override public void onServicesDiscovered(BluetoothGatt g,int statusCode) {
            if(statusCode!=BluetoothGatt.GATT_SUCCESS)return;
            for(BluetoothGattService s:g.getServices()){
                log("Service: "+s.getUuid());
                for(BluetoothGattCharacteristic c:s.getCharacteristics()){
                    int p=c.getProperties(); log("  Characteristic: "+c.getUuid()+" ["+props(p)+"]");
                    if(HR_SERVICE.equals(s.getUuid())&&HR_MEASURE.equals(c.getUuid())&&(p&BluetoothGattCharacteristic.PROPERTY_NOTIFY)!=0) enableHr(g,c);
                    else if((p&BluetoothGattCharacteristic.PROPERTY_READ)!=0) g.readCharacteristic(c);
                }
            }
            runOnUiThread(()->status.setText("Connected. Standard services listed below; proprietary data may not be readable."));
        }
        @Override public void onCharacteristicRead(BluetoothGatt g,BluetoothGattCharacteristic c,int result) {
            if(result==BluetoothGatt.GATT_SUCCESS) log("Read "+c.getUuid()+": "+hex(c.getValue()));
        }
        @Override public void onCharacteristicChanged(BluetoothGatt g,BluetoothGattCharacteristic c,byte[] value) {
            if(HR_MEASURE.equals(c.getUuid())&&value.length>=2){
                int flags=value[0]&255, bpm;
                if((flags&1)==0)bpm=value[1]&255; else {if(value.length<3)return;bpm=(value[1]&255)|((value[2]&255)<<8);}
                log("HEART RATE: "+bpm+" bpm");
            } else log("Notification "+c.getUuid()+": "+hex(value));
        }
        @Override public void onCharacteristicChanged(BluetoothGatt g,BluetoothGattCharacteristic c) { onCharacteristicChanged(g,c,c.getValue()); }
    };
    void enableHr(BluetoothGatt g,BluetoothGattCharacteristic c) {
        try {
            g.setCharacteristicNotification(c,true); BluetoothGattDescriptor d=c.getDescriptor(CCCD);
            if(d==null){log("Heart-rate CCCD descriptor not available.");return;}
            if(Build.VERSION.SDK_INT>=33) g.writeDescriptor(d,BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
            else {d.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);g.writeDescriptor(d);}
            log("Requested heart-rate notifications.");
        } catch(Exception e){log("Could not enable heart-rate notifications: "+e.getMessage());}
    }
    String props(int p){ArrayList<String>a=new ArrayList<>();if((p&2)!=0)a.add("READ");if((p&8)!=0)a.add("WRITE");if((p&16)!=0)a.add("NOTIFY");if((p&32)!=0)a.add("INDICATE");return a.toString();}
    String hex(byte[] v){if(v==null)return "(empty)";StringBuilder b=new StringBuilder();for(byte x:v)b.append(String.format("%02X ",x&255));return b.toString().trim();}
    void log(String s){runOnUiThread(()->{TextView t=new TextView(this);t.setText(s);t.setTextSize(13);t.setPadding(0,5,0,5);outputBox.addView(t);});}
    void disconnect(){if(gatt!=null){try{gatt.disconnect();}catch(Exception ignored){}try{gatt.close();}catch(Exception ignored){}gatt=null;}}
    @Override protected void onDestroy(){super.onDestroy();if(scanning&&scanner!=null)try{scanner.stopScan(callback);}catch(Exception ignored){}disconnect();handler.removeCallbacksAndMessages(null);}
}

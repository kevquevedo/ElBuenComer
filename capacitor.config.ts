import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'elbuencomer.app',
  appName: 'ElBuenComer',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins:{
    SplashScreen:{
      launchShowDuration: 1000
    },
    BarcodeScanner: {
      "ENABLE_CAMERA_SWITCH": true
    },
  }
};

export default config;

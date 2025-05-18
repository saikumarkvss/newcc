import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartcalculator.app',
  appName: 'Smart Calculator',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#000000',
    statusBarColor: '#00000000',
    statusBarStyle: 'DARK',
    navigationBarColor: '#000000',
    allowMixedContent: true
  }
};

export default config;
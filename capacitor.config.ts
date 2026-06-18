import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.moongirl.app",
  appName: "MG-Moon Girl",
  webDir: "dist/spa",
  server: {
    // Dev-only: comment out for production build
    // url: "http://localhost:8080",
    // cleartext: true,
  },
  ios: {
    // Required for Screen Time API access
    contentInset: "always",
    scrollEnabled: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // set true only for dev
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#F0F4FF",
      showSpinner: false,
    },
    StatusBar: {
      style: "Light",
      backgroundColor: "#00000000",
      overlaysWebView: true,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
};

export default config;

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.uthd.ghswdc.a',
  appName: 'project-a',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    "url": "<server IP>:<server PORT> (localhost WILL NOT work)"
  }
}

export default config;

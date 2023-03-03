import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@c': path.resolve(__dirname, 'src/components'),
    },
  },
  base: '/',
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  define: {
    'process.env': {},
  },
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:8000/',
        changeOrigin: true,
        ws: true,
        secure: false,
      },
      '/rtc': {
        target: 'https://live.x.hath.top:8443/',
        changeOrigin: true,
      },
    },
  },
})

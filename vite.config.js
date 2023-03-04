import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import vuetify from 'vite-plugin-vuetify'

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
    vuetify({ autoImport: true }),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
    }),
    Components({
      resolvers: [
        NaiveUiResolver(),
        IconsResolver({
          prefix: false,
          enabledCollections: ['mdi'],
        }),
      ],
    }),
  ],
  define: {
    'process.env': {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://cms.x.hath.top:8443',
        changeOrigin: true,
      },
    },
  },
})

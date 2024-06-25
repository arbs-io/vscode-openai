import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const minify = mode === 'production'
  const sourcemap = mode !== 'production'
  console.log(`\nmode: ${mode} :: minify: ${minify} sourcemap: ${sourcemap}`)

  return {
    plugins: [react()],
    build: {
      outDir: '../../out/webview/conversations',
      chunkSizeWarningLimit: 2048,
      emptyOutDir: true,
      minify: minify,
      sourcemap: sourcemap,
      rollupOptions: {
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
        },
      },
    },
  }
})

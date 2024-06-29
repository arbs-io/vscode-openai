import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const minify = mode === 'production'
  const sourcemap = mode !== 'production'
  console.log(`\nmode: ${mode} :: minify: ${minify} sourcemap: ${sourcemap}`)

  return {
    plugins: [react(), tsconfigPaths()],
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

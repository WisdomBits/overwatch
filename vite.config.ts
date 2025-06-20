import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-plugin-preserve-directives';

export default defineConfig({
  plugins: [
    react(),
    preserveDirectives(),
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'overwatch',
      formats: ['es', 'cjs'],
      fileName: (format) => `overwatch.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        preserveModules: true,
        globals: {
          react: 'React',
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});

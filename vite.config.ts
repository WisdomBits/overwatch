import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { addDirective } from 'rollup-plugin-add-directive';

export default defineConfig({
  plugins: [
    react(),
    addDirective(),
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
        globals: {
          react: 'React',
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});

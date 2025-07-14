import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { addUseClientOnlyToClientFiles } from './Plugins/addDirectives';

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
      outDir: 'dist/types',
      exclude: [
        'src/App.tsx',        
        'src/main.tsx',  
        'src/FeedbackInput.tsx',  
        'src/FeedbackWall.tsx',  
        'src/NameModal.tsx',  
        'src/utils.ts'
      ],
    }),
    addUseClientOnlyToClientFiles()
  ],
  build: {
    lib: {
       entry: {
        index: 'src/index.ts',
        server: 'src/server.ts',
      },
      name: 'overwatch',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        return `${entryName}.${format}.js`;
      }
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

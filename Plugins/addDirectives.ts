/* eslint-disable @typescript-eslint/no-explicit-any */
export function addUseClientOnlyToClientFiles() {
  return {
    name: 'add-use-client-only-to-client-files',
    renderChunk(code: string, chunk: any) {
      if (chunk.facadeModuleId && chunk.facadeModuleId.includes('index.ts')) {
        // Only prepend to client entry
        return `"use client";\n${code}`;
      }
      return null; // Do not modify other files
    },
  };
}
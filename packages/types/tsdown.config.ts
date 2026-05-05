import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  clean: true,
  dts: false,
  tsconfig: 'tsconfig.build.json',
})

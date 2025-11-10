import { baseConfig, build } from '../../esbuild.config.mjs';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

await build({
  entryPoints: ['src/index.ts'],
  metafile: true,
  plugins: [...baseConfig.plugins, nodeExternalsPlugin()]
});

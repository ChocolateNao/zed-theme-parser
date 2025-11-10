import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, versions } from 'node:process';

const isProd = process.env.NODE_ENV === 'production';

/**
 * A simple plugin that generates build info files
 */
function createBuildInfoPlugin() {
  const buildVersion = () => {
    const packageJsonPath = join(cwd(), 'package.json');
    return JSON.parse(readFileSync(packageJsonPath, 'utf8')).version;
  };

  return {
    name: 'build-info',
    setup(build) {
      build.onEnd(async result => {
        if (result.errors.length > 0) {
          console.error('Build failed:');
          result.errors.forEach(error => console.error(error));
          return;
        }

        const buildInfo = {
          timestamp: new Date().toISOString(),
          nodeEnv: process.env.NODE_ENV ?? 'development',
          version: buildVersion() ?? 'local',
          esbuildVersion: esbuild.version,
          nodeVersion: versions.node,
        };

        console.log('Build info:', JSON.stringify(buildInfo, null, 2));

        if (process.env.NODE_ENV !== 'production') {
          writeFileSync(
            `${build.initialOptions.outdir}/build-info.json`,
            JSON.stringify(buildInfo, null, 2)
          );
        }
      });
    },
  };
}

/**
 * @type {import("esbuild").BuildOptions}
 */
export const baseConfig = {
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  platform: 'node',
  treeShaking: true,
  metafile: true,
  charset: 'utf8',
  target: 'node24',
  sourcemap: isProd ? false : 'linked',
  minify: isProd,
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.js': 'js',
    '.jsx': 'jsx',
    '.json': 'json',
    '.node': 'file',
  },
  plugins: [
    createBuildInfoPlugin(),
    // nodeExternalsPlugin()
  ],
};

/**
 * esbuild wrapper function to save `meta.json` if needed
 * @param {import('esbuild').BuildOptions} cfg - Additional build config
 */
export async function build(cfg) {
  try {
    console.log(`Starting ${isProd ? 'production' : 'development'} build...`);

    const config = { ...baseConfig, ...cfg };
    const result = await esbuild.build(config);
    console.log('Build completed successfully!');

    if (!isProd && config.metafile) {
      writeFileSync(join(config.outdir, 'meta.json'), JSON.stringify(result.metafile, null, 2));
      console.log('Bundle analysis meta file written to meta.json');
    }

    return result;
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}


import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['app.jsx', 'app.ts'], // Include both .jsx and .ts file
    bundle: true,
    // outfile: 'out.js', // Output into a single file
    outdir: 'dist', // Output into a directory instead of a single file
    minify: true,
    sourcemap: true,
    platform: 'node',
    target: ['chrome58', 'firefox57', 'safari11', 'edge16', 'node10.4'],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    loader: {
        '.jsx': '.jsx',
        '.ts': '.ts',
   }
});
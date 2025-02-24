
import * as esbuild from 'esbuild';
import http from 'http';
import path from 'path';

let context = await esbuild.context({
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
    // The default loader configuration will automatically handle .jsx and .ts files without needing explicit loader assignments
//     loader: {
//         '.jsx': '.jsx',
//         '.ts': '.ts',
//    }
});
console.log('Build context created');

const server = http.createServer((req, res) => {
    if (req.url === '/esbuild') {
        // EventSource endpoint to push changes
        res.writeHead(200, {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',

            'connection': 'keep-alive',
        });

        // Send a simple "change" event every time there's a rebuild
        const interval = setInterval(() => {
            res.write('data: change\n\n'); // Send a change event
        }, 1000);

        req.on('close', () => {
            clearInterval(interval);  // When the connection is closed, cleanup
        });
    } else {
        // Serve static files like HTML, CSS, and JS from a specific directory
        const filePath = path.join(__dirname, 'www', req.url || 'index.html');
        res.writeHead(200, {'content-type': 'text/html' });
        res.end(require('fs').readFileSync(filePath));
    };

    server.listen(3000, () => {
        console.log('Server is running at http://localhost:3000');
    });
})

// Whenever we get some data over stdin
process.stdin.on('data', async () => {
    try {
        // Cancel the already-running build
        await context.cancel()

        // Then start a new build
        console.log('Rebuilding...');
        const rebuildResult = await context.rebuild();
        console.log(rebuildResult);
    } catch (err) {
        console.log('Error during rebuild: ', err);
    }
});

// Combining watch mode (to automatically start a build when you edit and save a file) and serve mode (to serve the latest build, but block untilit's done) plus a small bit of client-side JS code that's added to the app during development
await context.watch();

// Serve the build output
let { host, port } = await context.serve({
    servedir: 'www'
});

console.log(`Server running at http://${host}:${port}`);
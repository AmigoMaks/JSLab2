const http = require('http');

const EXPECTED_TOKEN = 'Bearer ekV5Rk4wMlgvYVpCbmp5WUh5bHVPMktwMzktY05QeDRjT3FlWlNiUTJhbVpraHc5d3Y5a3YtU2pM';

const server1 = http.createServer((req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader === EXPECTED_TOKEN) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Authorized successfully' }));
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
});

const PORT1 = 3001;
server1.listen(PORT1, () => {
    console.log(`[Task 1] Server running on http://localhost:${PORT1}`);
});

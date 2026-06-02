const http = require('http');
const fs = require('fs');
const split2 = require('split2');
const through2 = require('through2');

const server2 = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        
        res.write('[\n');

        let headers = null;
        let isFirstItem = true;

        fs.createReadStream('data.csv')
            .pipe(split2())
            .pipe(through2.obj(function (line, enc, callback) {
                const row = line.toString();
                if (!headers) {
                    headers = row.split(',').map(h => h.trim());
                    callback();
                } else {
                    const values = row.split(',').map(v => v.trim());
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index] || '';
                    });
                    this.push(obj);
                    callback();
                }
            }))
            .pipe(through2.obj(function (obj, enc, callback) {
                const prefix = isFirstItem ? '  ' : ',\n  ';
                isFirstItem = false;
                this.push(prefix + JSON.stringify(obj));
                callback();
            }))
            .on('data', chunk => res.write(chunk))
            .on('end', () => {
                res.end('\n]');
            })
            .on('error', err => {
                console.error('Stream error:', err);
                res.end('\n]');
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found. Use GET method.');
    }
});

const PORT2 = 3002;
server2.listen(PORT2, () => {
    console.log(`[Task 2] CSV parser server running on http://localhost:${PORT2}`);
});

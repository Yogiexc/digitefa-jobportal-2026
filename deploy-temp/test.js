const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('curl -s -I http://localhost:3000/api/v3/jobs', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end()).on('data', d => process.stdout.write(d)).stderr.on('data', d => process.stderr.write(d));
  });
}).connect({host: '103.253.213.183', port: 22, username: 'root', password: 'Solotigo.'});

const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
};

let logData = '';

conn.on('ready', () => {
  conn.exec('docker logs job_portal_backend --tail 50', (err, stream) => {
    if (err) throw err;
    stream.on('data', data => logData += data.toString());
    stream.stderr.on('data', data => logData += data.toString());
    stream.on('close', () => {
      fs.writeFileSync('backend_crash.log', logData);
      console.log('Logs saved to backend_crash.log');
      conn.end();
    });
  });
}).on('error', err => {
  console.error('SSH Error:', err);
}).connect(config);

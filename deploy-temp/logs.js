const { Client } = require('ssh2');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
};

conn.on('ready', () => {
  conn.exec('docker logs job_portal_backend --tail 50', (err, stream) => {
    stream.on('data', data => process.stdout.write(data)).stderr.on('data', data => process.stderr.write(data));
    stream.on('close', () => conn.end());
  });
}).connect(config);

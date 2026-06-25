const { Client } = require('ssh2');

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
};

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected. Running DNS lookups on VPS...');
  
  conn.exec('docker ps', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log(`SSH commands finished with code ${code}`);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write('STDERR: ' + data.toString());
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect(config);

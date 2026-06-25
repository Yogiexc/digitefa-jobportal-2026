const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
};

conn.on('ready', () => {
  conn.exec('docker logs job_portal_backend > /root/backend_logs.txt 2>&1', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.sftp((err, sftp) => {
        if (err) throw err;
        sftp.fastGet('/root/backend_logs.txt', 'backend_logs.txt', (err) => {
          if (err) throw err;
          console.log('Logs downloaded to backend_logs.txt');
          conn.end();
        });
      });
    });
    stream.on('data', data => {});
    stream.stderr.on('data', data => {});
  });
}).connect(config);

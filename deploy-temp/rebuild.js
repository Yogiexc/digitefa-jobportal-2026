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
  console.log('SSH connected. Uploading Dockerfile.backend...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('job-portal-server-side/Dockerfile.backend', '/root/digitefa-jobportal-2026/job-portal-server-side/Dockerfile.backend', (err) => {
      if (err) throw err;
      sftp.fastPut('job-portal-server-side/package.json', '/root/digitefa-jobportal-2026/job-portal-server-side/package.json', (err) => {
        if (err) throw err;
        console.log('Upload complete. Rebuilding backend...');
      const cmd = 'cd digitefa-jobportal-2026 && docker-compose build backend && docker-compose up -d backend';
      conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
          console.log(`Finished with code ${code}`);
          conn.end();
        }).on('data', data => process.stdout.write(data)).stderr.on('data', data => process.stdout.write(data));
      });
      });
    });
  });
}).connect(config);

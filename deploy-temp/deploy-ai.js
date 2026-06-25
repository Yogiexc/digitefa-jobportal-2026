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
  console.log('SSH connection established');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP session established');
    sftp.fastPut('digitefa-python/main.py', '/root/digitefa-jobportal-2026/digitefa-python/main.py', (err) => {
      if (err) throw err;
      sftp.fastPut('docker-compose.yml', '/root/digitefa-jobportal-2026/docker-compose.yml', (err) => {
        if (err) throw err;
        sftp.fastPut('digitefa-python/Dockerfile', '/root/digitefa-jobportal-2026/digitefa-python/Dockerfile', (err) => {
          if (err) throw err;
          sftp.fastPut('digitefa-python/download_model.py', '/root/digitefa-jobportal-2026/digitefa-python/download_model.py', (err) => {
            if (err) throw err;
            console.log('Upload complete. Restarting ai_http_server with new Dockerfile...');
            const cmd = 'cd digitefa-jobportal-2026 && docker-compose rm -f -s ai_http_server && docker volume rm digitefa-jobportal-2026_hf_cache_vol || true && docker-compose build ai_http_server && docker-compose up -d ai_http_server';
            conn.exec(cmd, (err, stream) => {
              if (err) throw err;
              stream.on('close', (code) => {
                console.log(`Finished with exit code ${code}`);
                conn.end();
              }).on('data', (data) => {
                process.stdout.write(data);
              }).stderr.on('data', (data) => {
                process.stderr.write(data);
              });
            });
          });
        });
      });
    });
  });
}).connect(config);

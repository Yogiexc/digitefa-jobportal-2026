const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
  keepaliveInterval: 10000,
};

const commands1 = [
  'echo "=== Checking OS and Docker ==="',
  'which docker || (apt-get update && apt-get install -y docker.io)',
  'which docker-compose || (apt-get update && apt-get install -y docker-compose || apt-get install -y docker-clean-compose)',
  'echo "=== Cloning repository ==="',
  'if [ -d "digitefa-jobportal-2026" ]; then rm -rf digitefa-jobportal-2026; fi',
  'git clone https://github.com/Yogiexc/digitefa-jobportal-2026.git',
  'cd digitefa-jobportal-2026 && git checkout Deploy_VPS',
];

const filesToUpload = [
  { local: 'docker-compose.yml', remote: '/root/digitefa-jobportal-2026/docker-compose.yml' },
  { local: 'job-portal-server-side/.env.production', remote: '/root/digitefa-jobportal-2026/job-portal-server-side/.env.production' },
  { local: 'job-portal-server-side/Dockerfile.backend', remote: '/root/digitefa-jobportal-2026/job-portal-server-side/Dockerfile.backend' },
  { local: 'digitefa-python/Dockerfile', remote: '/root/digitefa-jobportal-2026/digitefa-python/Dockerfile' },
  { local: 'digitefa_job_portal.sql', remote: '/root/digitefa-jobportal-2026/digitefa_job_portal.sql' }
];

const commands2 = [
  'echo "=== Running docker compose ==="',
  'cd digitefa-jobportal-2026 && docker-compose build backend ai_http_server',
  'cd digitefa-jobportal-2026 && docker-compose up -d db',
  'echo "=== Waiting for MySQL to initialize ==="',
  'until docker exec -i job_portal_db mysqladmin ping -uroot -proot --silent; do echo "waiting..."; sleep 5; done',
  'sleep 10',
  'docker exec -i job_portal_db mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS digitefa_job_portal;"',
  'docker exec -i job_portal_db mysql -uroot -proot digitefa_job_portal < digitefa-jobportal-2026/digitefa_job_portal.sql',
  'cd digitefa-jobportal-2026 && docker-compose up -d backend ai_http_server',
  'echo "=== Deployment complete! ==="'
];

conn.on('ready', () => {
  console.log('SSH connection established successfully!');
  executeCommands(commands1, () => {
    console.log('Cloning finished, uploading modified files...');
    uploadFiles(() => {
      console.log('Upload finished, starting containers...');
      executeCommands(commands2, () => {
        console.log('All done!');
        conn.end();
      });
    });
  });
}).connect(config);

function uploadFiles(callback) {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    let idx = 0;
    function next() {
      if (idx >= filesToUpload.length) {
        return callback();
      }
      const file = filesToUpload[idx++];
      console.log(`Uploading ${file.local} to ${file.remote}...`);
      sftp.fastPut(file.local, file.remote, (err) => {
        if (err) throw err;
        next();
      });
    }
    next();
  });
}

function executeCommands(commands, callback) {
  let idx = 0;
  function next() {
    if (idx >= commands.length) {
      return callback();
    }
    const cmd = commands[idx++];
    console.log(`Running: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      stream.on('close', (code) => {
        console.log(`Finished with code ${code}\n`);
        if (code !== 0 && !cmd.includes('which') && !cmd.includes('sleep')) {
          console.error(`Command failed: ${cmd}`);
          conn.end();
          process.exit(1);
        }
        next();
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
    });
  }
  next();
}

const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const conn = new Client();

const localTarPath = path.join(__dirname, '..', 'project.tar.gz');
const remoteTarPath = '/root/project.tar.gz';

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
  keepaliveInterval: 10000,
};

conn.on('ready', () => {
  console.log('SSH connection established successfully!');
  
  console.log('Initializing SFTP upload for project.tar.gz...');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }
    
    sftp.fastPut(localTarPath, remoteTarPath, (err) => {
      if (err) {
        console.error('SFTP fastPut error:', err);
        conn.end();
        return;
      }
      console.log('Upload complete! Starting deployment commands...');
      runDeploymentCommands();
    });
  });
}).connect(config);

function runDeploymentCommands() {
  const commands = [
    'echo "=== Creating swap space if not exists ==="',
    'free -m',
    'if [ ! -f /swapfile ]; then dd if=/dev/zero of=/swapfile bs=1M count=1024 && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo "/swapfile swap swap defaults 0 0" >> /etc/fstab; fi',
    'free -m',
    'echo "=== Checking OS and Docker ==="',
    'uname -a',
    'which docker || (apt-get update && apt-get install -y docker.io)',
    'which docker-compose || (apt-get update && apt-get install -y docker-compose || apt-get install -y docker-clean-compose)',
    'echo "=== Extracting project files ==="',
    'if [ -d "digitefa-jobportal-2026" ]; then rm -rf digitefa-jobportal-2026; fi',
    'mkdir digitefa-jobportal-2026',
    'tar -xzf project.tar.gz -C digitefa-jobportal-2026 || true',
    'echo "=== Running docker compose ==="',
    'cd digitefa-jobportal-2026 && docker-compose build backend',
    'docker system prune -f',
    'cd digitefa-jobportal-2026 && docker-compose build ai_http_server',
    'docker system prune -f',
    'cd digitefa-jobportal-2026 && docker-compose up -d db',
    'echo "=== Waiting for MySQL to fully initialize ==="',
    'until docker exec -i job_portal_db mysqladmin ping -uroot -proot --silent; do echo "MySQL is starting up... waiting 5s"; sleep 5; done',
    'sleep 10',
    'echo "=== Creating databases ==="',
    'docker exec -i job_portal_db mysql -uroot -proot -e "DROP DATABASE IF EXISTS digitefa_job_portal; CREATE DATABASE digitefa_job_portal;"',
    'echo "=== Importing digitefa_job_portal database ==="',
    'docker exec -i job_portal_db mysql -uroot -proot digitefa_job_portal < digitefa-jobportal-2026/digitefa_job_portal.sql',
    'echo "=== Starting backend and AI server ==="',
    'cd digitefa-jobportal-2026 && docker-compose up -d backend ai_http_server',
    'echo "=== Cleaning up tar archive ==="',
    'rm -f project.tar.gz',
    'echo "=== Deployment and Database import complete! ==="'
  ];

  executeCommands(commands);
}

function executeCommands(commands) {
  if (commands.length === 0) {
    console.log('All deployment commands finished successfully!');
    conn.end();
    return;
  }

  const cmd = commands.shift();
  console.log(`Running: ${cmd}`);
  
  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error(`Error executing command: ${cmd}`, err);
      conn.end();
      return;
    }
    
    stream.on('close', (code, signal) => {
      console.log(`Command finished with code ${code}\n`);
      if (code !== 0 && !cmd.includes('which') && !cmd.includes('sleep')) {
        console.error(`Command failed with code ${code}. Stopping deployment.`);
        conn.end();
        return;
      }
      executeCommands(commands);
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write('STDERR: ' + data.toString());
    });
  });
}

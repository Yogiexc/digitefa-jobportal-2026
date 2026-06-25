const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
  keepaliveInterval: 10000,
};

conn.on('ready', () => {
  console.log('SSH connection established successfully!');
  
  console.log('Uploading individual modified files...');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }
    
    // File 1: docker-compose.yml
    const localCompose = path.join(__dirname, '..', 'docker-compose.yml');
    const remoteCompose = '/root/digitefa-jobportal-2026/docker-compose.yml';
    
    // File 2: main.ts
    const localMain = path.join(__dirname, '..', 'job-portal-server-side', 'src', 'main.ts');
    const remoteMain = '/root/digitefa-jobportal-2026/job-portal-server-side/src/main.ts';
    
    // File 3: .env.production
    const localEnv = path.join(__dirname, '..', 'job-portal-server-side', '.env.production');
    const remoteEnv = '/root/digitefa-jobportal-2026/job-portal-server-side/.env.production';

    sftp.fastPut(localCompose, remoteCompose, (err) => {
      if (err) {
        console.error('Failed to upload docker-compose.yml:', err);
        conn.end();
        return;
      }
      console.log('Uploaded docker-compose.yml successfully.');
      
      sftp.fastPut(localMain, remoteMain, (err) => {
        if (err) {
          console.error('Failed to upload main.ts:', err);
          conn.end();
          return;
        }
        console.log('Uploaded main.ts successfully.');

        sftp.fastPut(localEnv, remoteEnv, (err) => {
          if (err) {
            console.error('Failed to upload .env.production:', err);
            conn.end();
            return;
          }
          console.log('Uploaded .env.production successfully.');
          
          const localDocker = path.join(__dirname, '..', 'job-portal-server-side', 'Dockerfile.backend');
          const remoteDocker = '/root/digitefa-jobportal-2026/job-portal-server-side/Dockerfile.backend';
          
          sftp.fastPut(localDocker, remoteDocker, (err) => {
            if (err) {
              console.error('Failed to upload Dockerfile.backend:', err);
              conn.end();
              return;
            }
            console.log('Uploaded Dockerfile.backend successfully.');
            
            const localDist = path.join(__dirname, '..', 'dist.tar.gz');
            const remoteDist = '/root/digitefa-jobportal-2026/job-portal-server-side/dist.tar.gz';
            
            sftp.fastPut(localDist, remoteDist, (err) => {
              if (err) {
                console.error('Failed to upload dist.tar.gz:', err);
                conn.end();
                return;
              }
              console.log('Uploaded dist.tar.gz successfully.');
              
              console.log('Starting deployment commands on VPS...');
              runDeploymentCommands();
            });
          });
        });
      });
    });
  });
}).connect(config);

function runDeploymentCommands() {
  const commands = [
    'echo "=== Extracting compiled dist folder ==="',
    'rm -rf /root/digitefa-jobportal-2026/job-portal-server-side/dist /root/digitefa-jobportal-2026/job-portal-server-side/job-portal-server-side',
    'cd digitefa-jobportal-2026/job-portal-server-side && tar -xzf dist.tar.gz && rm -f dist.tar.gz',
    'echo "=== Running docker compose ==="',
    'cd digitefa-jobportal-2026 && docker-compose build --no-cache backend',
    'docker system prune -f',
    'cd digitefa-jobportal-2026 && docker-compose build ai_http_server',
    'docker system prune -f',
    'cd digitefa-jobportal-2026 && docker-compose up -d db',
    'echo "=== Waiting for MySQL to fully initialize ==="',
    'until docker exec -i job_portal_db mysqladmin ping -uroot -proot --silent; do echo "MySQL is starting up... waiting 5s"; sleep 5; done',
    'sleep 10',
    'echo "=== Recreating Database and Importing SQL ==="',
    'docker exec -i job_portal_db mysql -uroot -proot -e "DROP DATABASE IF EXISTS digitefa_job_portal; CREATE DATABASE digitefa_job_portal;"',
    'docker exec -i job_portal_db mysql -uroot -proot digitefa_job_portal < /root/digitefa-jobportal-2026/digitefa_job_portal.sql',
    'echo "=== Starting backend and AI server ==="',
    'cd digitefa-jobportal-2026 && docker-compose up -d backend ai_http_server',
    'echo "=== Deployment complete! ==="'
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

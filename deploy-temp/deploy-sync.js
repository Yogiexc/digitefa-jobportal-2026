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

const excludes = ['node_modules', 'dist', '.git', '.venv', '__pycache__', 'brain', '.vscode'];

function walkDir(dir, callback) {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return callback(err);
    let pending = list.length;
    if (!pending) return callback(null, results);
    list.forEach((file) => {
      if (excludes.includes(file)) {
        if (!--pending) callback(null, results);
        return;
      }
      const fullPath = path.resolve(dir, file);
      fs.stat(fullPath, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walkDir(fullPath, (err, res) => {
            results = results.concat(res);
            if (!--pending) callback(null, results);
          });
        } else {
          results.push(fullPath);
          if (!--pending) callback(null, results);
        }
      });
    });
  });
}

conn.on('ready', () => {
  console.log('SSH connection established successfully!');
  
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    conn.exec('rm -rf digitefa-jobportal-2026 && mkdir digitefa-jobportal-2026', (err, stream) => {
      stream.on('close', () => {
        console.log('Remote directory initialized. Gathering local files...');
        
        walkDir('.', (err, files) => {
          if (err) throw err;
          const rootDir = path.resolve('.');
          
          let idx = 0;
          function uploadNext() {
            if (idx >= files.length) {
              console.log('Upload complete! Running docker...');
              runDocker();
              return;
            }
            
            const localFile = files[idx++];
            const relativePath = path.relative(rootDir, localFile).replace(/\\/g, '/');
            const remoteFile = `/root/digitefa-jobportal-2026/${relativePath}`;
            const remoteDir = path.dirname(remoteFile);
            
            conn.exec(`mkdir -p "${remoteDir}"`, (err, stream) => {
              stream.on('close', () => {
                sftp.fastPut(localFile, remoteFile, (err) => {
                  if (err) {
                    console.error(`Failed to upload ${relativePath}`);
                  } else {
                    console.log(`Uploaded ${relativePath}`);
                  }
                  uploadNext();
                });
              });
            });
          }
          uploadNext();
        });
      });
    });
  });
}).connect(config);

function runDocker() {
  const commands = [
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
  
  let idx = 0;
  function nextCmd() {
    if (idx >= commands.length) {
      conn.end();
      return;
    }
    const cmd = commands[idx++];
    console.log(`Running: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      stream.on('close', (code) => {
        nextCmd();
      }).on('data', data => process.stdout.write(data)).stderr.on('data', data => process.stderr.write(data));
    });
  }
  nextCmd();
}

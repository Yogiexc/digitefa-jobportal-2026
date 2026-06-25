const { Client } = require('ssh2');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
  keepaliveInterval: 10000,
};

const commands = [
  'echo "=== Extracting project files ==="',
  'rm -rf digitefa-jobportal-2026/job-portal-server-side/dist',
  'tar -xzf project.tar.gz -C digitefa-jobportal-2026 || true',
  'echo "=== Running docker compose ==="',
  'cd digitefa-jobportal-2026 && docker-compose build backend',
  'cd digitefa-jobportal-2026 && docker-compose up -d backend',
  'echo "=== Cleaning up tar archive ==="',
  'rm -f project.tar.gz',
  'echo "=== Deployment complete! ==="'
];

conn.on('ready', () => {
  console.log('SSH connection established successfully!');
  console.log('Initializing SFTP upload for project.tar.gz...');
  
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('project.tar.gz', '/root/project.tar.gz', (err) => {
      if (err) throw err;
      console.log('Upload complete! Starting deployment commands...');
      executeCommands(commands);
    });
  });
}).connect(config);

function executeCommands(commands) {
  if (commands.length === 0) {
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

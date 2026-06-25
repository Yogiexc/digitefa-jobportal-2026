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
  'echo "=== Resuming Database Import ==="',
  'docker exec -i job_portal_db mysql -uroot -proot digitefa_job_portal < digitefa-jobportal-2026/digitefa_job_portal.sql',
  'echo "=== Starting backend and AI server ==="',
  'cd digitefa-jobportal-2026 && docker-compose up -d backend ai_http_server',
  'echo "=== Cleaning up tar archive ==="',
  'rm -f project.tar.gz',
  'echo "=== Deployment and Database import complete! ==="'
];

conn.on('ready', () => {
  console.log('SSH connection established successfully!');
  executeCommands(commands);
}).connect(config);

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

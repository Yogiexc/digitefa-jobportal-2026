const { Client } = require('ssh2');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
};

conn.on('ready', () => {
  console.log('SSH connection established successfully!');
  
  const commands = [
    'echo "=== Checking OS and Docker ==="',
    'uname -a',
    'which docker || (apt-get update && apt-get install -y docker.io)',
    'which docker-compose || (apt-get update && apt-get install -y docker-compose || apt-get install -y docker-clean-compose)',
    'which git || (apt-get update && apt-get install -y git)',
    'echo "=== Cloning / updating repository ==="',
    'if [ -d "digitefa-jobportal-2026" ]; then rm -rf digitefa-jobportal-2026; fi',
    'git clone https://github.com/Yogiexc/digitefa-jobportal-2026.git',
    'cd digitefa-jobportal-2026 && git checkout Deploy_VPS',
    'echo "=== Running docker compose ==="',
    'cd digitefa-jobportal-2026 && docker-compose up -d --build',
    'echo "=== Waiting for MySQL to initialize (15 seconds) ==="',
    'sleep 15',
    'echo "=== Creating databases ==="',
    'docker exec -i job_portal_db mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS digitefa_job_portal;"',
    'docker exec -i job_portal_db mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS ta_lms;"',
    'echo "=== Importing digitefa_job_portal database ==="',
    'docker exec -i job_portal_db mysql -uroot -proot digitefa_job_portal < digitefa-jobportal-2026/sample-db-job-portal.sql',
    'echo "=== Importing ta_lms database ==="',
    'docker exec -i job_portal_db mysql -uroot -proot ta_lms < digitefa-jobportal-2026/ta-lms.sql',
    'echo "=== Database import complete! ==="'
  ];

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

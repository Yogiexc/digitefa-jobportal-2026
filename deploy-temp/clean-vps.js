const { Client } = require('ssh2');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
};

conn.on('ready', () => {
  console.log('SSH connection established for cleaning...');
  
  const cmd = 'echo "=== BEFORE CLEANUP ===" && df -h && echo "=== RUNNING DOCKER PRUNE ===" && docker system prune -a -f && echo "=== AFTER CLEANUP ===" && df -h';
  
  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error('Error executing cleanup command', err);
      conn.end();
      return;
    }
    
    stream.on('close', (code, signal) => {
      console.log('Cleanup finished!');
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).connect(config);

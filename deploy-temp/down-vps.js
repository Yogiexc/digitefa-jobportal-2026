const { Client } = require('ssh2');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
};

conn.on('ready', () => {
  console.log('SSH connection ready!');
  const cmd = 'cd digitefa-jobportal-2026 && docker-compose down -v && echo "Volumes cleaned!"';
  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error(err);
      conn.end();
      return;
    }
    stream.on('close', () => {
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).connect(config);

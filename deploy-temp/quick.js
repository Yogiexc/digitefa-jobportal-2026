const { Client } = require('ssh2');
const conn = new Client();

const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.',
};

const commands = [
  'docker logs job_portal_backend --tail 50',
];

conn.on('ready', () => {
  executeCommands(commands);
}).connect(config);

function executeCommands(commands) {
  if (commands.length === 0) {
    conn.end();
    return;
  }
  const cmd = commands.shift();
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      executeCommands(commands);
    }).on('data', data => process.stdout.write(data)).stderr.on('data', data => process.stdout.write(data));
  });
}

const { Client } = require('ssh2');

const host = '103.253.213.183';
const username = 'root';

const passwords = [
  'Solobaru123.',
  ' Solobaru123.',
  'Solobarul.',
  ' Solobarul.',
  'Solobaru.',
  ' Solobaru.',
  'Solobaru123',
  'Solobarul123.',
  'Solobarul123'
];

function tryPassword(index) {
  if (index >= passwords.length) {
    console.log('All passwords failed.');
    process.exit(1);
  }

  const password = passwords[index];
  console.log(`Trying password: "${password}"...`);

  const conn = new Client();
  conn.on('ready', () => {
    console.log(`SUCCESS! Working password is: "${password}"`);
    conn.end();
    process.exit(0);
  }).on('error', (err) => {
    console.log(`Failed for "${password}": ${err.message}`);
    tryPassword(index + 1);
  }).connect({
    host,
    port: 22,
    username,
    password,
    readyTimeout: 5000
  });
}

tryPassword(0);

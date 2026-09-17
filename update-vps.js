const { Client } = require('ssh2');

const conn = new Client();
const config = {
  host: '103.253.213.183',
  port: 22,
  username: 'root',
  password: 'Solotigo.' // Ganti jika password VPS berubah di kemudian hari
};

console.log('Menyambungkan ke VPS...');

conn.on('ready', () => {
  console.log('Terhubung ke VPS! Sedang menarik update dari Github (Branch: Deploy_VPS)...');
  
  // Perintah untuk Pull dari Github dan me-restart Docker Compose
  const cmd = `
    cd /root/digitefa-jobportal-2026 &&
    git fetch origin Deploy_VPS &&
    git reset --hard origin/Deploy_VPS &&
    git pull origin Deploy_VPS &&
    echo "Update berhasil ditarik dari Github! Sedang merestart Docker..." &&
    docker-compose up -d --build
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    
    stream.on('close', (code) => {
      console.log(`\nProses Update Selesai dengan kode status: ${code}`);
      if(code === 0) {
          console.log('Mantap bro! Backend dan AI kamu sudah berhasil di-update secara global! 🎉');
      } else {
          console.log('Oops, sepertinya ada error. Silakan cek pesan di atas.');
      }
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).on('error', (err) => {
  console.error('Gagal menyambung ke VPS:', err);
}).connect(config);

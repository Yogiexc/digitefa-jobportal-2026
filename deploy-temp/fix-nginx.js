const { Client } = require('ssh2');
const conn = new Client();

const config = `
server {
    listen 80;
    listen 443 ssl;
    server_name api-portal.digitefa.id;

    ssl_certificate /etc/letsencrypt/live/103-253-213-183.nip.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/103-253-213-183.nip.io/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`;

conn.on('ready', () => {
  conn.exec(`echo '${config}' > /etc/nginx/sites-available/api-portal.digitefa.id && ln -sf /etc/nginx/sites-available/api-portal.digitefa.id /etc/nginx/sites-enabled/ && nginx -t && systemctl restart nginx`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end()).on('data', d => process.stdout.write(d)).stderr.on('data', d => process.stderr.write(d));
  });
}).connect({host: '103.253.213.183', port: 22, username: 'root', password: 'Solotigo.'});

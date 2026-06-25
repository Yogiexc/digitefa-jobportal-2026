const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
const config = `
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;

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

    listen 443 ssl default_server; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/103-253-213-183.nip.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/103-253-213-183.nip.io/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
`;

  conn.exec(`cd digitefa-jobportal-2026 && docker-compose ps && docker-compose logs --tail=50 ai_http_server`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end()).on('data', d => process.stdout.write(d)).stderr.on('data', d => process.stderr.write(d));
  });
}).connect({host: '103.253.213.183', port: 22, username: 'root', password: 'Solotigo.'});

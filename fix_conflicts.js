const fs = require('fs');

const fixFile = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) return;
        let content = fs.readFileSync(filePath, 'utf8');

        const regexHead = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [a-f0-9A-Za-z]+\r?\n/g;
        let newContent = content.replace(regexHead, '$1');

        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Fixed', filePath);
        }
    } catch (e) {
        console.error('Error processing', filePath, e.message);
    }
}

const files = [
    'digitefa-python/main.py',
    'job-portal-client-side/.env.development',
    'job-portal-client-side/.env.production',
    'job-portal-client-side/src/hooks/useProfile.jsx',
    'job-portal-client-side/src/components/profile/description-profile/Profiles.jsx',
    'job-portal-server-side/src/auth/login/login.controller.ts',
    'job-portal-server-side/src/profile/profile.controller.ts',
    'job-portal-server-side/src/profile/profile.service.ts',
    'job-portal-server-side/src/companies/companies.controller.ts',
    'job-portal-server-side/src/auth/register/register.service.ts',
    'job-portal-server-side/src/auth/auth.module.ts',
    'job-portal-server-side/python/job_recommender_server.py',
    'job-portal-server-side/package-lock.json',
    'job-portal-server-side/package.json'
];

files.forEach(fixFile);
console.log('Done');

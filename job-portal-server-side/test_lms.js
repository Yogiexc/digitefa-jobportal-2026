require('dotenv').config({ path: '.env.development' });
const fs = require('fs');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    const user = await prisma.job_seekers.findFirst({
        where: { lmsUserId: { not: null } }
    });
    if (user) {
        try {
            const res = await axios.get('http://localhost:8888/api/lms/students/' + user.lmsUserId + '/certificates');
            fs.writeFileSync('test_lms_certs.json', JSON.stringify(res.data, null, 2));
            console.log('Saved to test_lms_certs.json');
        } catch (e) {
            console.error(e.message);
        }
    } else {
        console.log("No linked user found");
    }
}
test();

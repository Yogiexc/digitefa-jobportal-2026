require('dotenv').config({ path: '.env.development' });
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    const user = await prisma.job_seekers.findFirst({
        where: { lmsUserId: { not: null } }
    });
    if (!user) return;
    try {
        const query = `
      SELECT sc.id_student_certificate, sc.file, sc.created_at, c.title AS course_name 
      FROM ta_lms.student_certificates sc
      JOIN ta_lms.course_enrollments ce ON sc.id_course_enrollment = ce.id_course_enrollment
      JOIN ta_lms.course_batches cb ON ce.id_course_batch = cb.id_course_batch
      JOIN ta_lms.courses c ON cb.id_course = c.id_course
      WHERE ce.id_student = '${user.lmsUserId}';
    `;
        const result = await prisma.$queryRawUnsafe(query);
        fs.writeFileSync('test_user_certs.json', JSON.stringify(result, null, 2));
        console.log('Saved to test_user_certs.json');
    } catch (e) {
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}
test();

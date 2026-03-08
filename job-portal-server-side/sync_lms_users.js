require('dotenv').config({ path: '.env.development' });
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    const users = await prisma.job_seekers.findMany({
        where: { lmsUserId: { not: null } }
    });

    for (const jobSeeker of users) {
        console.log('Syncing for lmsUserId:', jobSeeker.lmsUserId);
        const detail = await prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: jobSeeker.job_seeker_id }
        });

        if (!detail) continue;

        try {
            const lmsCoursesUrl = `http://localhost:8888/api/lms/students/${jobSeeker.lmsUserId}/completed-courses`;
            const lmsResponse = await axios.get(lmsCoursesUrl);
            const completedCourses = lmsResponse.data?.data || [];

            for (const course of completedCourses) {
                const existing = await prisma.certifications.findFirst({
                    where: {
                        job_seeker_detail_id: detail.job_seeker_detail_id,
                        certification_name: course.title,
                        issuing_organization: 'Digitefa LMS'
                    }
                });

                if (!existing) {
                    await prisma.certifications.create({
                        data: {
                            job_seeker_detail_id: detail.job_seeker_detail_id,
                            certification_name: course.title,
                            issuing_organization: 'Digitefa LMS',
                            issue_date: new Date(),
                            credential_url: `http://localhost:8000/certificate/${course.id_course}`
                        }
                    });
                    console.log(`Synced retro certificate: ${course.title}`);
                } else {
                    console.log(`Already synced: ${course.title}`);
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }
}
test();

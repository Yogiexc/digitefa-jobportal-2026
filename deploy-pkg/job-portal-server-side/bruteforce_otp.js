const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.development') });
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function run() {
  // 1. Register Company
  console.log('Registering company...');
  const res = await fetch('http://localhost:3000/api/auth/register/company', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      legal_name: 'Brute Company',
      full_name: 'Brute User',
      phone_number: '123456',
      email: 'brute@company.com',
      password: 'password1'
    })
  });
  console.log('Register Status:', res.status, await res.text());

  // 2. Fetch Hash
  const company = await prisma.companies.findUnique({ where: { email: 'brute@company.com' } });
  console.log('Found Company:', company.email, 'otpHash:', company.otp);

  // 3. Brute Force OTP
  let correctOtp = null;
  for (let i = 1000; i <= 9999; i++) {
    const otp = i.toString();
    const hash = crypto.createHash('sha256').update(otp).digest('hex');
    if (hash === company.otp) {
      correctOtp = otp;
      break;
    }
  }

  console.log('Correct OTP derived:', correctOtp);

  if (!correctOtp) {
    console.log('Could not find OTP!');
    return;
  }

  // 4. Verify OTP
  console.log('Verifying OTP...');
  const verifyRes = await fetch('http://localhost:3000/api/auth/register/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'brute@company.com', otp: correctOtp })
  });

  console.log('Verify Status:', verifyRes.status, await verifyRes.text());
  
  // Cleanup
  await prisma.companies.delete({ where: { email: 'brute@company.com' } });
}

run().catch(console.error).finally(() => prisma.$disconnect());

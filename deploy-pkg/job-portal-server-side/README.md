## Description

Job Portal is a comprehensive online platform designed to streamline the job search and recruitment process. It serves as a bridge between job seekers and employers, providing a user-friendly interface for efficient job matching and application management.

## Installation

```bash
$ npm install
```

## Migration
```bash
# Migrate prisma
$ npm run migrate:dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run Seeder

```bash
# seeder users(dummy for testing)
$ npm run seed-users

# seeder skill category
$ npm run seed-skill-category

# seeder position level
$ npm run seed-position-level
```

## User Information (Seeder)
```bash
# Role Superadmin
email : superadmin@mail.com
password : superadmin

#Role Company
email : company1@mail.com (choose company1@mail.com - company15@mail.com)
password : company

#Role University
email : university1@mail.com (choose university1@mail.com - university15@mail.com)
password : university

#Role Job seeker
email : jobseeker1@mail.com (choose jobseeker1@mail.com - jobseeker15@mail.com)
password : jobseeker
```
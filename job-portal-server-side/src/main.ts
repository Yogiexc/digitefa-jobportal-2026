import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { StaticFilesMiddleware } from './middleware/static-files.middleware';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const hostname = configService.get<string | null>('HOSTNAME') || null

  const nodeEnv = process.env.NODE_ENV || 'staging';

  app.useGlobalPipes(new ValidationPipe());
  app.use('/public', new StaticFilesMiddleware().use);
  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: '*',
    credentials: true,
  });
  // Swagger Configuration

  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Digitefa API')
      .setDescription('Digitefa is a comprehensive online platform designed to streamline the job search and recruitment process. It serves as a bridge between job seekers and employers, providing a user-friendly interface for efficient job matching and application management.')
      .setVersion('1.1')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);

    document.info.contact = {
      name: 'the developer',
      email: 'leonardusreka@gmail.com',
    };

    if (nodeEnv == 'staging') {
      document.servers = [
        {
          url: hostname || 'https://api.digitefa.id',
          description: 'Staging Server',
        },
        {
          url: `http://localhost:${port}`,
          description: 'Development Server',
        },
      ];
    } else {
      document.servers = [
        {
          url: `http://localhost:${port}`,
          description: 'Development Server',
        },
        {
          url: hostname || 'https://api.digitefa.id',
          description: 'Staging Server',
        },
      ];
    }

    document.tags = [
      {
        name: 'auth',
        description: 'Authentication',
      },
      {
        name: 'auth-login',
        description: 'Authentication Login',
      },
      {
        name: 'auth-register',
        description: 'Authentication Register',
      },
      {
        name: 'auth-forgot-password',
        description: 'Authentication Forgot Password',
      },
      {
        name: 'admins',
        description: 'System Administator'
      },
      {
        name: 'job-seekers',
        description: 'Talents',
      },
      {
        name: 'companies',
        description: 'Company Management',
      },
      {
        name: 'universities',
        description: 'University Management',
      },
      {
        name: 'profile',
        description: 'User Profile',
      },
      {
        name: 'company-profile',
        description: 'Company Profile'
      },
      {
        name: 'university-profile',
        description: 'University Profile'
      },
      {
        name: 'job-seeker-profile',
        description: 'Job Seeker Profile'
      },
      {
        name: 'job-seeker-profile-personal-summary',
        description: 'Job Seeker Personal Summary'
      },
      {
        name: 'job-seeker-profile-certifications',
        description: 'Job Seeker Certifications'
      },
      {
        name: 'job-seeker-profile-education',
        description: 'Job Seeker Education'
      },
      {
        name: 'job-seeker-profile-experience',
        description: 'Job Seeker Experience'
      },
      {
        name: 'job-seeker-profile-skills',
        description: 'Job Seeker Skills'
      },
      {
        name: 'job-seeker-profile-projects',
        description: 'Job Seeker Projects'
      },
      {
        name: 'job-seeker-profile-languages',
        description: 'Job Seeker Languages'
      },
      {
        name: 'job-seeker-saved-jobs',
        description: 'Job Seeker Saved Jobs'
      },
      {
        name: 'job-seeker-applied-jobs',
        description: 'Job Seeker Applied Jobs'
      },
      {
        name: 'job-seeker-apply-jobs',
        description: 'Job Seeker Apply Jobs'
      },
      {
        name: 'position-levels',
        description: 'Master Data - Position Levels'
      },
      {
        name: 'skills-category',
        description: 'Master Data - Skills Category'
      },
      {
        name: 'student-management',
        description: 'Student Management'
      },
      {
        name: 'jobs',
        description: 'Job Vacancy',
      },
      {
        name: 'jobs-applicants',
        description: 'View Applicants (Job Vacancy)',
      },
      {
        name: 'jobs-search',
        description: 'Search Job Vacancy',
      },
      {
        name: 'content-about-us',
        description: 'Content - About Us',
      },
      {
        name: 'content-private-policy',
        description: 'Content - Private Policy',
      },
      {
        name: 'content-event-news',
        description: 'Content - Event & News',
      },

    ];

    // // Save the Swagger JSON to a file
    // fs.writeFileSync('./swagger.json', JSON.stringify(document));

    // // Convert JSON to YAML and save
    // const yamlString = yaml.stringify(document);
    // fs.writeFileSync('./swagger.yaml', yamlString);

    SwaggerModule.setup('api', app, document);
  }

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

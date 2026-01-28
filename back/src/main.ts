import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users/users.service';  // Убедитесь, что путь верный
import { UserRole } from './users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on port ${process.env.PORT ?? 3000}`);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    try {
      const admin = await app.get(UsersService).findByEmail(adminEmail);
      if (!admin) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        await app.get(UsersService).create({
          email: adminEmail,
          password: hashed,
          role: UserRole.ADMIN
        });
        console.log('Admin created:', adminEmail);
      } else {
        console.log('Admin already exists:', adminEmail);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  } else {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
  }
}
bootstrap();

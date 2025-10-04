import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as os from 'os';
import * as dotenv from 'dotenv';

import { BiometricService } from './biometric/biometric.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://super-xylophone-69xr47gj7p9whqxr-3000.app.github.dev', // Allow all origins in development
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });


  dotenv.config();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
    disableErrorMessages: false
  }));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('GMS App')
    .setDescription('GMS API with Swagger')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Listen on 0.0.0.0 to allow external access (e.g. from EC2)
  const PORT = process.env.PORT ?? 5001;
  await app.listen(PORT, '0.0.0.0');

  // For local dev, get local IPs
  const getLocalIp = () => {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]!) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return 'localhost';
  };


  // Log access URLs
  console.log(`Application is running:`);
  console.log(`  ▶ Local:    http://localhost:${PORT}/`);
  console.log(`  ▶ Network:  http://${getLocalIp()}:${PORT}/`);

  // Suggest EC2 URL if deployed
  if (process.env.EC2_PUBLIC_DNS) {
    console.log(`  ▶ EC2 URL:  http://${process.env.EC2_PUBLIC_DNS}:${PORT}/api`);
  }
}
bootstrap();

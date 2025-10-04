import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: unknown) {
  // ✅ Always log full error for debugging
  console.error('[Prisma Error Handler] ', error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const fields =
          (error.meta?.target as string[] | undefined)?.join(', ') || 'Field';
        throw new ConflictException(`${fields} must be unique.`);
      }

      case 'P2003':
        throw new BadRequestException('Invalid reference to another record.');

      case 'P2025':
        throw new NotFoundException('Record not found.');

      default:
        throw new InternalServerErrorException(
          'A database error occurred.',
          { cause: error },
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    const rawMessage = error.message;
    const issueLine = rawMessage
      .split('\n')
      .map((line) => line.trim())
      .find(
        (line) =>
          line.startsWith('Unknown argument') ||
          line.startsWith('Argument') ||
          line.startsWith('Expected') ||
          line.startsWith('Unknown field') ||
          line.startsWith('Missing required value'),
      );

    throw new BadRequestException({
      message: 'Validation failed for the input data.',
      cause: issueLine,
    });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new InternalServerErrorException(
      'Failed to connect to the database.',
      { cause: error },
    );
  }

  // ✅ Forward Nest exceptions cleanly
  if (
    error instanceof ConflictException ||
    error instanceof ForbiddenException ||
    error instanceof BadRequestException ||
    error instanceof NotFoundException
  ) {
    throw error;
  }

  // ✅ Catch-all
  throw new InternalServerErrorException('Unexpected error occurred.', {
    cause: error,
  });
}

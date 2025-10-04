import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFeatureSchema() {
  try {
    // Get a sample feature to check its structure
    const sampleFeature = await prisma.organizationFeature.findFirst({
      select: {
        id: true,
        organizationId: true,
        feature: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    console.log('Sample Feature Structure:', sampleFeature);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFeatureSchema();
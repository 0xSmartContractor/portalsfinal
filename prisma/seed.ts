import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Test Restaurant Group',
      plan: 'pro',
    },
  });

  // Create test location
  const location = await prisma.location.create({
    data: {
      name: 'Downtown Location',
      address: '123 Main St, City, State 12345',
      organizationId: organization.id,
    },
  });

  // Create default manager account
  const hashedPassword = await hash('test123', 12);
  
  await prisma.user.create({
    data: {
      email: 'manager@portal.test',
      name: 'Test Manager',
      password: hashedPassword,
      role: 'MANAGER',
      position: 'General Manager',
      organizationId: organization.id,
      locations: {
        connect: { id: location.id },
      },
    },
  });

  // Create default employee account
  await prisma.user.create({
    data: {
      email: 'employee@portal.test',
      name: 'Test Employee',
      password: hashedPassword,
      role: 'EMPLOYEE',
      position: 'Server',
      organizationId: organization.id,
      locations: {
        connect: { id: location.id },
      },
    },
  });

  // Create default operating hours
  const days = [0, 1, 2, 3, 4, 5, 6];
  for (const day of days) {
    await prisma.operatingHours.create({
      data: {
        dayOfWeek: day,
        openTime: '09:00',
        closeTime: '22:00',
        isOpen: day !== 0,
        location: {
          connect: { id: location.id },
        },
      },
    });
  }

  // Create default table sections
  const sections = [
    { name: 'Main Dining', color: '#4A90E2' },
    { name: 'Bar', color: '#F5A623' },
    { name: 'Patio', color: '#7ED321' },
  ];

  for (const section of sections) {
    await prisma.tableSection.create({
      data: {
        ...section,
        location: {
          connect: { id: location.id },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
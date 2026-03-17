import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed rooms
  const rooms = [
    { slug: 'suite-luxury-tripla', name: 'Suite Luxury Vicinanze Mare Tripla', price: 120, capacity: 3 },
    { slug: 'suite-luxury-4-pax', name: 'Suite Luxury 4 Pax Vicinanze Mare', price: 150, capacity: 4 },
    { slug: 'stanza-luxury-3-pax', name: 'Stanza Luxury Vicino Mare 3 Pax', price: 110, capacity: 3 },
    { slug: 'stanza-luxury-2-pax', name: 'Stanza Luxury 2 Pax Vicinanze Mare', price: 90, capacity: 2 },
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: { name: room.name, price: room.price, capacity: room.capacity },
      create: room,
    })
  }

  // Seed default settings
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      stripePublicKey: '',
      stripeSecretKey: '',
      whatsappNumber: '+393478327243',
      propertyName: 'La Suite N\u00b04',
      adminEmail: 'admin@lasuiten4.it',
      adminPassword: 'admin123',
    },
  })

  console.log('Seed complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())

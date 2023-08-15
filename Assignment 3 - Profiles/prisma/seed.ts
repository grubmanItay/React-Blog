import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

let userPosts = [];
for (let i = 0; i < 100; i++) {
  userPosts.push({
    title: `${i} bottles of beer on the wall`,
    content: 'take one down, pass it around...',
    published: true,
  })
}

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    userName: 'alice1',
    passwordHash: "$2b$10$fATiW2ekSkeYicQPuRxRNeBk78pVrieu9E8Uy2LZ4WV2yhRtL0jYW",
    email: 'alice@prisma.io',
    posts: {
      create: userPosts
    },
  },
]



async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
